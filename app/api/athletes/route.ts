import { NextRequest, NextResponse } from "next/server"

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/athletes  — save athlete record
// GET  /api/athletes?code=PR-VJMW-0027  — fetch athlete by seal code
//
// Uses Vercel KV if KV_REST_API_URL is set, otherwise falls back to
// in-memory store (dev only — resets on each server restart).
// ─────────────────────────────────────────────────────────────────────────────

// In-memory fallback for local dev without KV
const devStore = new Map<string, unknown>()

async function kvSet(key: string, value: unknown) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { kv } = await import("@vercel/kv")
    await kv.set(key, value)
  } else {
    devStore.set(key, value)
  }
}

async function kvGet(key: string): Promise<unknown> {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { kv } = await import("@vercel/kv")
    return await kv.get(key)
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
