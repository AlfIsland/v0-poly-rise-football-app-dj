import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("pr_admin_session")?.value
  return !!session && !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN
}

let redis: Redis | null = null
function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    redis.on("error", (err) => console.error("[Redis Training]", err))
  }
  return redis
}

const devStore = new Map<string, string>()
async function kvSet(key: string, value: unknown) {
  const r = getRedis()
  if (r) await r.set(key, JSON.stringify(value))
  else devStore.set(key, JSON.stringify(value))
}
async function kvGet(key: string): Promise<unknown> {
  const r = getRedis()
  if (r) { const raw = await r.get(key); return raw ? JSON.parse(raw) : null }
  const raw = devStore.get(key); return raw ? JSON.parse(raw) : null
}

export interface TrainingSession {
  date: string
  fortyYard?: number
  shuttle?: number
  shuttleLeft?: number
  shuttleRight?: number
  threeCone?: number
  verticalJump?: number
  broadJump?: number
  benchPress?: number
  weight?: number
  notes?: string
}

export interface TrainingAthlete {
  id: string
  name: string
  age: number
  grade: string
  school: string
  position?: string
  coachNotes?: string
  phone?: string
  email?: string
  joinedAt: string
  sessions: TrainingSession[]
  featured?: boolean
}

// ─── POST /api/training — create athlete ──────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  try {
    const body = await req.json()
    const { name, age, grade, school } = body
    if (!name || !age || !grade) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const r = getRedis()
    let num = 1
    if (r) num = await r.incr("training:counter")

    const id = `TRN-${String(num).padStart(4, "0")}`
    const athlete: TrainingAthlete = {
      id, name, age: Number(age), grade, school: school || "",
      position: body.position || "",
      coachNotes: body.coachNotes || "",
      phone: body.phone || "",
      email: body.email || "",
      joinedAt: new Date().toISOString(),
      sessions: [],
    }

    await kvSet(`training:athlete:${id}`, athlete)
    if (r) await r.sadd("training:roster", id)

    return NextResponse.json({ success: true, id })
  } catch (err) {
    console.error("[training POST]", err)
    return NextResponse.json({ success: false, error: "Failed to create athlete" }, { status: 500 })
  }
}

// ─── GET /api/training — list all OR fetch one ────────────────────────────────
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")

  try {
    if (id) {
      const data = await kvGet(`training:athlete:${id.toUpperCase()}`)
      if (!data) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
      return NextResponse.json({ success: true, athlete: data })
    }

    // List all
    const r = getRedis()
    if (!r) return NextResponse.json({ success: true, athletes: [] })
    const ids = await r.smembers("training:roster")
    if (!ids.length) return NextResponse.json({ success: true, athletes: [] })
    const values = await r.mget(...ids.map(i => `training:athlete:${i}`))
    const athletes = values.filter(Boolean).map(v => JSON.parse(v!))
      .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
    return NextResponse.json({ success: true, athletes })
  } catch (err) {
    console.error("[training GET]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}

// ─── PUT /api/training — update athlete info OR add session ───────────────────
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  try {
    const body = await req.json()
    const { id, action } = body
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 })

    const existing = await kvGet(`training:athlete:${id.toUpperCase()}`) as TrainingAthlete | null
    if (!existing) return NextResponse.json({ success: false, error: "Athlete not found" }, { status: 404 })

    if (action === "add-session") {
      const session: TrainingSession = {
        date: body.date || new Date().toISOString().split("T")[0],
        ...(body.fortyYard !== "" && body.fortyYard != null ? { fortyYard: parseFloat(body.fortyYard) } : {}),
        ...(body.shuttle !== "" && body.shuttle != null ? { shuttle: parseFloat(body.shuttle) } : {}),
        ...(body.shuttleLeft !== "" && body.shuttleLeft != null ? { shuttleLeft: parseFloat(body.shuttleLeft) } : {}),
        ...(body.shuttleRight !== "" && body.shuttleRight != null ? { shuttleRight: parseFloat(body.shuttleRight) } : {}),
        ...(body.threeCone !== "" && body.threeCone != null ? { threeCone: parseFloat(body.threeCone) } : {}),
        ...(body.verticalJump !== "" && body.verticalJump != null ? { verticalJump: parseFloat(body.verticalJump) } : {}),
        ...(body.broadJump !== "" && body.broadJump != null ? { broadJump: parseFloat(body.broadJump) } : {}),
        ...(body.benchPress !== "" && body.benchPress != null ? { benchPress: parseInt(body.benchPress) } : {}),
        ...(body.weight !== "" && body.weight != null ? { weight: parseFloat(body.weight) } : {}),
        ...(body.notes ? { notes: body.notes } : {}),
      }
      existing.sessions.push(session)
      // Sort sessions by date ascending
      existing.sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      await kvSet(`training:athlete:${id.toUpperCase()}`, existing)
      return NextResponse.json({ success: true })
    }

    // Delete session by index
    if (action === "delete-session") {
      const { sessionIndex } = body
      if (sessionIndex == null || !existing.sessions[sessionIndex]) {
        return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
      }
      existing.sessions.splice(sessionIndex, 1)
      await kvSet(`training:athlete:${id.toUpperCase()}`, existing)
      return NextResponse.json({ success: true })
    }

    // Edit existing session by index
    if (action === "edit-session") {
      const { sessionIndex } = body
      if (sessionIndex == null || !existing.sessions[sessionIndex]) {
        return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
      }
      const s = existing.sessions[sessionIndex]
      existing.sessions[sessionIndex] = {
        ...s,
        date: body.date ?? s.date,
        ...(body.fortyYard !== "" && body.fortyYard != null ? { fortyYard: parseFloat(body.fortyYard) } : { fortyYard: undefined }),
        ...(body.shuttle !== "" && body.shuttle != null ? { shuttle: parseFloat(body.shuttle) } : { shuttle: undefined }),
        ...(body.shuttleLeft !== "" && body.shuttleLeft != null ? { shuttleLeft: parseFloat(body.shuttleLeft) } : { shuttleLeft: undefined }),
        ...(body.shuttleRight !== "" && body.shuttleRight != null ? { shuttleRight: parseFloat(body.shuttleRight) } : { shuttleRight: undefined }),
        ...(body.threeCone !== "" && body.threeCone != null ? { threeCone: parseFloat(body.threeCone) } : { threeCone: undefined }),
        ...(body.verticalJump !== "" && body.verticalJump != null ? { verticalJump: parseFloat(body.verticalJump) } : { verticalJump: undefined }),
        ...(body.broadJump !== "" && body.broadJump != null ? { broadJump: parseFloat(body.broadJump) } : { broadJump: undefined }),
        ...(body.benchPress !== "" && body.benchPress != null ? { benchPress: parseInt(body.benchPress) } : { benchPress: undefined }),
        ...(body.weight !== "" && body.weight != null ? { weight: parseFloat(body.weight) } : { weight: undefined }),
        notes: body.notes ?? s.notes,
      }
      // Re-sort by date
      existing.sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      await kvSet(`training:athlete:${id.toUpperCase()}`, existing)
      return NextResponse.json({ success: true })
    }

    // Toggle featured
    if (action === "toggle-featured") {
      existing.featured = !existing.featured
      await kvSet(`training:athlete:${id.toUpperCase()}`, existing)
      return NextResponse.json({ success: true, featured: existing.featured })
    }

    // Update athlete info
    const updated: TrainingAthlete = {
      ...existing,
      name: body.name ?? existing.name,
      age: body.age != null ? Number(body.age) : existing.age,
      grade: body.grade ?? existing.grade,
      school: body.school ?? existing.school,
      position: body.position ?? existing.position,
      coachNotes: body.coachNotes ?? existing.coachNotes,
      phone: body.phone ?? existing.phone,
      email: body.email ?? existing.email,
    }
    await kvSet(`training:athlete:${id.toUpperCase()}`, updated)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[training PUT]", err)
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 })
  }
}
