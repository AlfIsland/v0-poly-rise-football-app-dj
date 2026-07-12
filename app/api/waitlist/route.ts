import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"
import { Resend } from "resend"

let redis: Redis | null = null
function getRedis() {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    redis.on("error", err => console.error("[Redis Waitlist]", err))
  }
  return redis
}

export async function POST(req: NextRequest) {
  const { email, tier = "elite-recruit" } = await req.json()

  if (!email || !email.includes("@")) {
    return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 })
  }

  const id = `waitlist:${tier}:${Date.now()}`
  const entry = { id, email, tier, createdAt: new Date().toISOString() }

  const r = getRedis()
  if (r) {
    await r.set(id, JSON.stringify(entry))
    await r.lpush(`waitlist:${tier}:list`, id)
  }

  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: "PolyRISE Athletix <noreply@polyrisefootball.com>",
      to: "polyrise@polyrisefootball.com",
      subject: "New Elite Recruit Waitlist Signup",
      html: `<p>New waitlist signup for <strong>Elite Recruit</strong>.</p><p>Email: <strong>${email}</strong></p><p>Time: ${new Date().toLocaleString()}</p>`,
    })
  }

  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")
  if (!process.env.ADMIN_SECRET || auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const r = getRedis()
  if (!r) return NextResponse.json({ entries: [] })

  const ids = await r.lrange("waitlist:elite-recruit:list", 0, -1)
  const entries = await Promise.all(
    ids.map(async id => {
      const data = await r!.get(id)
      return data ? JSON.parse(data) : null
    })
  )

  return NextResponse.json({ entries: entries.filter(Boolean) })
}
