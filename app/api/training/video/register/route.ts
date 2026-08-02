import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"
import { getAthleteIdFromSession, ATHLETE_COOKIE } from "@/lib/athlete-auth"
import type { MetricKey, PendingVideoTest, TrainingAthlete } from "@/app/api/training/route"

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("pr_admin_session")?.value
  return !!session && !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN
}

let redis: Redis | null = null
function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    redis.on("error", (err) => console.error("[Redis Training Video]", err))
  }
  return redis
}

const VALID_METRICS: MetricKey[] = [
  "fortyYard", "twentyYard", "shuttle", "threeCone", "verticalJump", "broadJump", "benchPress",
]

// Records a video that's already been uploaded to Blob as a pending test awaiting staff review.
// Called by the client right after `upload()` resolves — see app/api/training/video/upload/route.ts
// for why this doesn't rely on Vercel Blob's onUploadCompleted callback.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const athleteId = (body.athleteId as string | undefined)?.toUpperCase()
    const metric = body.metric as MetricKey
    const videoUrl = body.videoUrl as string | undefined

    if (!athleteId || !videoUrl || !VALID_METRICS.includes(metric)) {
      return NextResponse.json({ success: false, error: "Missing or invalid fields" }, { status: 400 })
    }

    const admin = isAdmin(req)
    let owner = false
    const athleteToken = req.cookies.get(ATHLETE_COOKIE)?.value
    if (athleteToken) {
      const loggedInId = await getAthleteIdFromSession(athleteToken)
      owner = !!loggedInId && loggedInId.toUpperCase() === athleteId
    }
    if (!admin && !owner) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const r = getRedis()
    if (!r) return NextResponse.json({ success: false, error: "Storage unavailable" }, { status: 500 })

    const raw = await r.get(`training:athlete:${athleteId}`)
    if (!raw) return NextResponse.json({ success: false, error: "Athlete not found" }, { status: 404 })
    const athlete = JSON.parse(raw) as TrainingAthlete

    const test: PendingVideoTest = {
      id: crypto.randomUUID(),
      metric,
      videoUrl,
      uploadedAt: new Date().toISOString(),
      uploadedBy: admin ? "admin" : "athlete",
      status: "pending",
    }
    athlete.pendingVideoTests = [...(athlete.pendingVideoTests || []), test]
    await r.set(`training:athlete:${athleteId}`, JSON.stringify(athlete))

    return NextResponse.json({ success: true, test })
  } catch (err) {
    console.error("[training video register]", err)
    return NextResponse.json({ success: false, error: "Failed to register test" }, { status: 500 })
  }
}
