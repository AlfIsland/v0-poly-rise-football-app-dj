import { NextRequest, NextResponse } from "next/server"
import { getParent, getSessionEmail, PARENT_COOKIE, getRedis } from "@/lib/parent-store"

// PATCH — parent updates their linked athlete's basic info (position, school, grade)
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get(PARENT_COOKIE)?.value
    if (!token) return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 })

    const email = await getSessionEmail(token)
    if (!email) return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 })

    const parent = await getParent(email)
    if (!parent) return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 })

    const { athleteId, position, school, grade } = await req.json()
    if (!athleteId) return NextResponse.json({ success: false, error: "Missing athleteId" }, { status: 400 })

    // Verify this athlete is linked to this parent
    if (!parent.athleteIds.includes(athleteId.toUpperCase())) {
      return NextResponse.json({ success: false, error: "Athlete not linked to your account" }, { status: 403 })
    }

    const r = getRedis()
    if (!r) return NextResponse.json({ success: false, error: "Storage unavailable" }, { status: 503 })

    const raw = await r.get(`training:athlete:${athleteId.toUpperCase()}`)
    if (!raw) return NextResponse.json({ success: false, error: "Athlete not found" }, { status: 404 })

    const athlete = JSON.parse(raw)

    // Only allow updating these specific fields — nothing else
    if (position !== undefined) athlete.position = position
    if (school   !== undefined) athlete.school   = school
    if (grade    !== undefined) athlete.grade    = grade

    await r.set(`training:athlete:${athleteId.toUpperCase()}`, JSON.stringify(athlete))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[parent athlete PATCH]", err)
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 })
  }
}
