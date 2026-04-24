import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"
import { type Camp } from "@/app/api/camps/route"

function getRedis() {
  return new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: 2, connectTimeout: 4000 })
}

function isAdmin(req: NextRequest) {
  return !!req.cookies.get("pr_admin_session")?.value
}


// GET — list all camps (including inactive)
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const r = getRedis()
  try {
    const ids = await r.smembers("camps:index")
    if (!ids.length) return NextResponse.json({ success: true, camps: [] })
    const raws = await r.mget(...ids.map(id => `camp:${id}`))
    const camps = raws
      .filter(Boolean)
      .map(v => JSON.parse(v!) as Camp)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return NextResponse.json({ success: true, camps })
  } finally {
    await r.quit()
  }
}

// POST — create camp
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const r = getRedis()
  try {
    const body = await req.json()
    const shortId = Date.now() + Math.random().toString(36).slice(2, 7)
    const camp: Camp = {
      id: `camp:${shortId}`,
      name: body.name ?? "",
      organizer: body.organizer ?? "",
      type: body.type ?? "elite",
      sports: body.sports ?? ["football"],
      grades: body.grades ?? [],
      date: body.date ?? "",
      location: body.location ?? "",
      description: body.description ?? "",
      registrationUrl: body.registrationUrl ?? "",
      featured: body.featured ?? false,
      active: true,
      createdAt: new Date().toISOString(),
    }
    await r.set(`camp:${shortId}`, JSON.stringify(camp))
    await r.sadd("camps:index", shortId)
    return NextResponse.json({ success: true, camp })
  } finally {
    await r.quit()
  }
}

// PUT — update camp
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const r = getRedis()
  try {
    const body = await req.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 })
    const raw = await r.get(id)
    if (!raw) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
    const existing = JSON.parse(raw) as Camp
    const updated = { ...existing, ...updates }
    await r.set(id, JSON.stringify(updated))
    return NextResponse.json({ success: true, camp: updated })
  } finally {
    await r.quit()
  }
}

// DELETE — remove camp
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  const r = getRedis()
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 })
    const shortId = id.replace("camp:", "")
    await r.del(id)
    await r.srem("camps:index", shortId)
    return NextResponse.json({ success: true })
  } finally {
    await r.quit()
  }
}
