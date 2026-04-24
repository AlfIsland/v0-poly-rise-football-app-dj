import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import Redis from "ioredis"

function getRedis() {
  return new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: 2, connectTimeout: 4000 })
}

function isAuthed(req: NextRequest) {
  const adminToken = req.cookies.get("pr_admin_session")?.value
  const parentToken = req.cookies.get("pr_parent_session")?.value
  return !!(adminToken || parentToken)
}

// POST /api/athlete/photo — upload photo for an athlete
export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const athleteId = formData.get("athleteId") as string | null

    if (!file || !athleteId) return NextResponse.json({ success: false, error: "Missing file or athleteId" }, { status: 400 })

    if (!file.type.startsWith("image/")) return NextResponse.json({ success: false, error: "File must be an image" }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ success: false, error: "Image must be under 5MB" }, { status: 400 })

    const ext = file.name.split(".").pop() ?? "jpg"
    const blob = await put(`athletes/${athleteId.toUpperCase()}.${ext}`, file, {
      access: "public",
      addRandomSuffix: false,
    })

    // Save photo URL to athlete record in Redis
    const r = getRedis()
    const raw = await r.get(`training:athlete:${athleteId.toUpperCase()}`)
    if (raw) {
      const athlete = JSON.parse(raw)
      athlete.photoUrl = blob.url
      await r.set(`training:athlete:${athleteId.toUpperCase()}`, JSON.stringify(athlete))
    }
    await r.quit()

    return NextResponse.json({ success: true, url: blob.url })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 })
  }
}
