import { NextResponse } from "next/server"
import Redis from "ioredis"

let redis: Redis | null = null
function getRedis() {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    redis.on("error", err => console.error("[Redis admin/athletes]", err))
  }
  return redis
}

export async function GET() {
  try {
    const r = getRedis()
    if (!r) return NextResponse.json({ success: false, error: "No Redis" }, { status: 500 })
    const codes = await r.smembers("athlete:roster")
    if (!codes.length) return NextResponse.json({ success: true, athletes: [] })
    const values = await r.mget(...codes.map(c => `athlete:${c}`))
    const athletes = values.filter(Boolean).map(v => JSON.parse(v!))
      .sort((a, b) => new Date(b.issuedAt ?? 0).getTime() - new Date(a.issuedAt ?? 0).getTime())
    return NextResponse.json({ success: true, athletes })
  } catch (err) {
    console.error("[admin/athletes]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}
