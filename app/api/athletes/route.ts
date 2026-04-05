import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/athletes  — save athlete record
// GET  /api/athletes?code=PR-VJMW-0027  — fetch athlete by seal code
// ─────────────────────────────────────────────────────────────────────────────

// Singleton Redis client — reused across serverless invocations
let redis: Redis | null = null

function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
      lazyConnect: false,
    })
    redis.on("error", (err) => console.error("[Redis]", err))
  }
  return redis
}

// In-memory fallback for local dev without Redis
const devStore = new Map<string, string>()

async function kvSet(key: string, value: unknown): Promise<void> {
  const r = getRedis()
  if (r) {
    await r.set(key, JSON.stringify(value))
  } else {
    devStore.set(key, JSON.stringify(value))
  }
}

async function kvGet(key: string): Promise<unknown> {
  const r = getRedis()
  if (r) {
    const raw = await r.get(key)
    return raw ? JSON.parse(raw) : null
  }
  const raw = devStore.get(key)
  return raw ? JSON.parse(raw) : null
}

// ─── POST /api/athletes — save athlete ────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code } = body

    if (!code || !/^PR-V[A-Z]+-\d{4}$/i.test(code)) {
      return NextResponse.json(
        { success: false, error: "Invalid seal code format" },
        { status: 400 }
      )
    }

    const upperCode = code.toUpperCase()
    await kvSet(`athlete:${upperCode}`, { ...body, code: upperCode })

    return NextResponse.json({ success: true, code: upperCode })
  } catch (err) {
    console.error("[athletes POST]", err)
    return NextResponse.json(
      { success: false, error: "Failed to save athlete" },
      { status: 500 }
    )
  }
}

// ─── GET /api/athletes?code=PR-VCM-0003 — fetch athlete ──────────────────────

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")

  if (!code) {
    return NextResponse.json(
      { success: false, error: "Missing code parameter" },
      { status: 400 }
    )
  }

  try {
    const data = await kvGet(`athlete:${code.toUpperCase()}`)

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Athlete not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, athlete: data })
  } catch (err) {
    console.error("[athletes GET]", err)
    return NextResponse.json(
      { success: false, error: "Failed to retrieve athlete" },
      { status: 500 }
    )
  }
}
