import { NextRequest, NextResponse } from "next/server"
import { getRedis, getSessionEmail, PARENT_COOKIE, getParent } from "@/lib/parent-store"

export interface CollegeTarget {
  id: string
  school: string
  division: string
  state: string
  coachName: string
  emailed: boolean
}

export interface RecruitingRoadmapData {
  ncaaId?: string
  instagram?: string
  checklist: Record<string, boolean>
  colleges: CollegeTarget[]
  updatedAt: string
}

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("pr_admin_session")?.value
  return !!session && !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN
}

async function isAuthorizedParent(req: NextRequest, athleteId: string): Promise<boolean> {
  const token = req.cookies.get(PARENT_COOKIE)?.value
  if (!token) return false
  const email = await getSessionEmail(token)
  if (!email) return false
  const parent = await getParent(email)
  if (!parent) return false
  return parent.athleteIds.includes(athleteId.toUpperCase())
}

// GET /api/training/roadmap?id=TRN-0001
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 })

  const upperid = id.toUpperCase()

  const adminOk = isAdmin(req)
  const parentOk = adminOk ? false : await isAuthorizedParent(req, upperid)

  if (!adminOk && !parentOk) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const r = getRedis()
  if (!r) return NextResponse.json({ success: false, error: "No database connection" }, { status: 500 })

  const raw = await r.get(`training:athlete:${upperid}`)
  if (!raw) return NextResponse.json({ success: false, error: "Athlete not found" }, { status: 404 })

  const athlete = JSON.parse(raw)
  const roadmap: RecruitingRoadmapData = athlete.roadmap ?? { checklist: {}, colleges: [] }

  return NextResponse.json({ success: true, roadmap })
}

// PUT /api/training/roadmap
export async function PUT(req: NextRequest) {
  let body: { id: string; roadmap: RecruitingRoadmapData }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 })
  }

  const { id, roadmap } = body
  if (!id || !roadmap) {
    return NextResponse.json({ success: false, error: "Missing id or roadmap" }, { status: 400 })
  }

  const upperid = id.toUpperCase()

  const adminOk = isAdmin(req)
  const parentOk = adminOk ? false : await isAuthorizedParent(req, upperid)

  if (!adminOk && !parentOk) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const r = getRedis()
  if (!r) return NextResponse.json({ success: false, error: "No database connection" }, { status: 500 })

  const raw = await r.get(`training:athlete:${upperid}`)
  if (!raw) return NextResponse.json({ success: false, error: "Athlete not found" }, { status: 404 })

  const athlete = JSON.parse(raw)

  // Enforce max 10 colleges
  const colleges = Array.isArray(roadmap.colleges) ? roadmap.colleges.slice(0, 10) : []

  athlete.roadmap = {
    ...roadmap,
    colleges,
    updatedAt: new Date().toISOString(),
  }

  await r.set(`training:athlete:${upperid}`, JSON.stringify(athlete))

  return NextResponse.json({ success: true })
}
