import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/athletes  — save athlete record
// GET  /api/athletes?code=PR-VJMW-0027  — fetch athlete by seal code
// ─────────────────────────────────────────────────────────────────────────────

const devStore = new Map<string, unknown>()

function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  return new Redis(process.env.REDIS_URL, { tls: { rejectUnauthorized: false } })
}

async function kvSet(key: string, value: unknown) {
  const redis = getRedis()
  if (redis) {
    await redis.set(key, JSON.stringify(value))
    redis.disconnect()
  } else {
    devStore.set(key, value)
  }
}

async function kvGet(key: string): Promise<unknown> {
  const redis = getRedis()
  if (redis) {
    const raw = await redis.get(key)
    redis.disconnect()
    return raw ? JSON.parse(raw) : null
  }
  return devStore.get(key) ?? null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code } = body

    if (!code || !/^PR-V[A-Z]+-\d{4}$/.test(code)) {
      return NextResponse.json({ success: false, error: "Invalid seal code format" }, { status: 400 })
    }

    await kvSet(`athlete:${code}`, body)

    return NextResponse.json({ success: true, code })
  } catch (err) {
    console.error("[athletes POST]", err)
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")

  if (!code) {
    return NextResponse.json({ success: false, error: "Missing code" }, { status: 400 })
  }

  try {
    const data = await kvGet(`athlete:${code.toUpperCase()}`)

    if (!data) {
      return NextResponse.json({ success: false, error: "Athlete not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, athlete: data })
  } catch (err) {
    console.error("[athletes GET]", err)
    return NextResponse.json({ success: false, error: "Failed to retrieve" }, { status: 500 })
  }
}
