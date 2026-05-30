import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"
import { TrainingAthlete } from "../route"

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("pr_admin_session")?.value
  return !!session && !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN
}

let redis: Redis | null = null
function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    redis.on("error", (err) => console.error("[Redis Export]", err))
  }
  return redis
}

function csvEscape(val: unknown): string {
  if (val == null) return ""
  const str = String(val)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const r = getRedis()
    if (!r) return NextResponse.json({ error: "No database" }, { status: 500 })

    const ids = await r.smembers("training:roster")
    if (!ids.length) {
      return new NextResponse("No athletes found", { status: 200 })
    }

    const values = await r.mget(...ids.map(i => `training:athlete:${i}`))
    const athletes: TrainingAthlete[] = values
      .filter(Boolean)
      .map(v => JSON.parse(v!))
      .sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime())

    const headers = [
      "ID", "Name", "Age", "Grade", "GradYear", "School", "Position", "Gender",
      "Sport", "GPA", "Phone", "Email", "Twitter", "VideoLink",
      "Subscription", "ProfilePublic", "JoinedAt", "TotalSessions",
      // Latest session fields
      "LatestDate", "Height", "Weight",
      "40Yard", "20Yard", "Shuttle", "ShuttleLeft", "ShuttleRight",
      "3Cone", "Vertical", "BroadJump", "BenchPress", "Pushups",
      "CoachNotes", "SessionNotes",
    ]

    const rows = athletes.map(a => {
      const latest = a.sessions.length > 0 ? a.sessions[a.sessions.length - 1] : null
      return [
        a.id,
        a.name,
        a.age,
        a.grade,
        a.gradYear ?? "",
        a.school,
        a.position ?? "",
        a.gender ?? "",
        a.sport ?? "",
        a.gpa ?? "",
        a.phone ?? "",
        a.email ?? "",
        a.twitterHandle ?? "",
        a.videoLink ?? "",
        a.hasSubscription ? "Yes" : "No",
        a.profilePublic !== false ? "Public" : "Private",
        new Date(a.joinedAt).toLocaleDateString("en-US"),
        a.sessions.length,
        latest?.date ?? "",
        latest?.height ?? "",
        latest?.weight ?? "",
        latest?.fortyYard ?? "",
        latest?.twentyYard ?? "",
        latest?.shuttle ?? "",
        latest?.shuttleLeft ?? "",
        latest?.shuttleRight ?? "",
        latest?.threeCone ?? "",
        latest?.verticalJump ?? "",
        latest?.broadJump ?? "",
        latest?.benchPress ?? "",
        latest?.pushups ?? "",
        a.coachNotes ?? "",
        latest?.notes ?? "",
      ].map(csvEscape)
    })

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const date = new Date().toISOString().split("T")[0]

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="polyrise-athletes-${date}.csv"`,
      },
    })
  } catch (err) {
    console.error("[training export]", err)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
