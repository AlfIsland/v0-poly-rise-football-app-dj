import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"
import { getAllParents } from "@/lib/parent-store"

async function notifyParentOfNewSession(athleteId: string, athleteName: string, sessionNumber: number) {
  try {
    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) return

    // Find parent linked to this athlete
    const parents = await getAllParents()
    const parent = parents.find(p => p.athleteIds.includes(athleteId.toUpperCase()))
    if (!parent?.email) return

    const isBaseline = sessionNumber === 1
    const sessionLabel = isBaseline ? "Baseline Test" : `Session #${sessionNumber}`
    const portalUrl = "https://polyrisefootball.com/parent/portal"

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "PolyRISE Football <noreply@polyrisefootball.com>",
        to: [parent.email],
        subject: `📊 New Results Posted — ${athleteName}`,
        html: `
          <div style="font-family:sans-serif;background:#0a0a0f;color:#fff;padding:0;margin:0">
            <div style="background:#b40a0a;padding:24px 32px">
              <h1 style="margin:0;font-size:20px;font-weight:900;letter-spacing:1px">PolyRISE Football</h1>
              <p style="margin:4px 0 0;font-size:12px;color:#ffaaaa">Athlete Progress Update</p>
            </div>
            <div style="padding:32px">
              <h2 style="color:#fff;font-size:22px;margin:0 0 8px">${athleteName}</h2>
              <p style="color:#aaa;font-size:14px;margin:0 0 24px">${sessionLabel} has been recorded by your PolyRISE coach.</p>

              <div style="background:#1a1a25;border:1px solid #333;border-radius:12px;padding:20px;margin-bottom:24px">
                <p style="color:#ccc;font-size:14px;margin:0 0 4px">Your athlete's latest combine results are now available in your parent portal.</p>
                <p style="color:#888;font-size:13px;margin:0">Log in to view all metrics, progress charts, and coach notes.</p>
              </div>

              <a href="${portalUrl}" style="display:inline-block;background:#b40a0a;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none">
                View Results →
              </a>

              <div style="margin-top:32px;padding-top:24px;border-top:1px solid #222">
                <p style="color:#555;font-size:12px;margin:0">Questions? Contact us at <a href="mailto:polyrise@polyrisefootball.com" style="color:#b40a0a">polyrise@polyrisefootball.com</a> or <a href="mailto:kg@polyrisefootball.com" style="color:#b40a0a">kg@polyrisefootball.com</a></p>
                <p style="color:#444;font-size:11px;margin:6px 0 0">PolyRISE Football · Dripping Springs, TX · polyrisefootball.com</p>
              </div>
            </div>
          </div>
        `,
      }),
    })
  } catch (err) {
    console.error("[session notify email]", err)
  }
}

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
  height?: string
  fortyYard?: number
  twentyYard?: number
  shuttle?: number
  shuttleLeft?: number
  shuttleRight?: number
  threeCone?: number
  verticalJump?: number
  broadJump?: number
  benchPress?: number
  pushups?: number
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
  gender?: "M" | "F"
  coachNotes?: string
  videoLink?: string
  twitterHandle?: string
  phone?: string
  email?: string
  sport?: "football" | "soccer"
  mlsTeam?: string
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
      sport: body.sport === "soccer" ? "soccer" : "football",
      ...(body.sport === "soccer" && body.mlsTeam ? { mlsTeam: body.mlsTeam } : {}),
      gender: body.gender === "F" ? "F" as const : "M" as const,
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
        ...(body.height ? { height: body.height } : {}),
        ...(body.fortyYard !== "" && body.fortyYard != null ? { fortyYard: parseFloat(body.fortyYard) } : {}),
        ...(body.twentyYard !== "" && body.twentyYard != null ? { twentyYard: parseFloat(body.twentyYard) } : {}),
        ...(body.shuttle !== "" && body.shuttle != null ? { shuttle: parseFloat(body.shuttle) } : {}),
        ...(body.shuttleLeft !== "" && body.shuttleLeft != null ? { shuttleLeft: parseFloat(body.shuttleLeft) } : {}),
        ...(body.shuttleRight !== "" && body.shuttleRight != null ? { shuttleRight: parseFloat(body.shuttleRight) } : {}),
        ...(body.threeCone !== "" && body.threeCone != null ? { threeCone: parseFloat(body.threeCone) } : {}),
        ...(body.verticalJump !== "" && body.verticalJump != null ? { verticalJump: parseFloat(body.verticalJump) } : {}),
        ...(body.broadJump !== "" && body.broadJump != null ? { broadJump: parseFloat(body.broadJump) } : {}),
        ...(body.benchPress !== "" && body.benchPress != null ? { benchPress: parseInt(body.benchPress) } : {}),
        ...(body.pushups !== "" && body.pushups != null ? { pushups: parseInt(body.pushups) } : {}),
        ...(body.weight !== "" && body.weight != null ? { weight: parseFloat(body.weight) } : {}),
        ...(body.notes ? { notes: body.notes } : {}),
      }
      existing.sessions.push(session)
      // Sort sessions by date ascending
      existing.sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      await kvSet(`training:athlete:${id.toUpperCase()}`, existing)
      // Notify parent — fire and forget
      notifyParentOfNewSession(id.toUpperCase(), existing.name, existing.sessions.length).catch(() => {})
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
        height: body.height || undefined,
        ...(body.fortyYard !== "" && body.fortyYard != null ? { fortyYard: parseFloat(body.fortyYard) } : { fortyYard: undefined }),
        ...(body.twentyYard !== "" && body.twentyYard != null ? { twentyYard: parseFloat(body.twentyYard) } : { twentyYard: undefined }),
        ...(body.shuttle !== "" && body.shuttle != null ? { shuttle: parseFloat(body.shuttle) } : { shuttle: undefined }),
        ...(body.shuttleLeft !== "" && body.shuttleLeft != null ? { shuttleLeft: parseFloat(body.shuttleLeft) } : { shuttleLeft: undefined }),
        ...(body.shuttleRight !== "" && body.shuttleRight != null ? { shuttleRight: parseFloat(body.shuttleRight) } : { shuttleRight: undefined }),
        ...(body.threeCone !== "" && body.threeCone != null ? { threeCone: parseFloat(body.threeCone) } : { threeCone: undefined }),
        ...(body.verticalJump !== "" && body.verticalJump != null ? { verticalJump: parseFloat(body.verticalJump) } : { verticalJump: undefined }),
        ...(body.broadJump !== "" && body.broadJump != null ? { broadJump: parseFloat(body.broadJump) } : { broadJump: undefined }),
        ...(body.benchPress !== "" && body.benchPress != null ? { benchPress: parseInt(body.benchPress) } : { benchPress: undefined }),
        ...(body.pushups !== "" && body.pushups != null ? { pushups: parseInt(body.pushups) } : { pushups: undefined }),
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
      videoLink: body.videoLink ?? existing.videoLink ?? "",
      twitterHandle: body.twitterHandle ?? existing.twitterHandle ?? "",
      phone: body.phone ?? existing.phone,
      email: body.email ?? existing.email,
      sport: body.sport === "soccer" ? "soccer" : body.sport === "football" ? "football" : existing.sport,
      mlsTeam: body.mlsTeam !== undefined ? (body.mlsTeam || undefined) : existing.mlsTeam,
      gender: body.gender === "F" ? "F" : body.gender === "M" ? "M" : existing.gender,
    }
    await kvSet(`training:athlete:${id.toUpperCase()}`, updated)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[training PUT]", err)
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 })
  }
}
