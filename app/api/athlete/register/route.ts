import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"
import {
  ATHLETE_COOKIE, SESSION_MAX_AGE_MS,
  getAthleteAccount,
  saveAthleteAccount,
  createAthleteSession,
  redeemInviteToken,
  hashPassword,
} from "@/lib/athlete-auth"

async function getAthleteName(athleteId: string): Promise<string | null> {
  try {
    if (!process.env.REDIS_URL) return null
    const r = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    const raw = await r.get(`training:athlete:${athleteId.toUpperCase()}`)
    await r.quit()
    if (!raw) return null
    const a = JSON.parse(raw)
    return a.name ?? null
  } catch { return null }
}

// POST /api/athlete/register — redeem invite token and create account
export async function POST(req: NextRequest) {
  try {
    const { token, email, password } = await req.json()
    if (!token || !email || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Redeem invite token — one-time use, 7-day TTL
    const { redeemInviteToken: redeem } = await import("@/lib/athlete-auth")
    const athleteId = await redeem(token)
    if (!athleteId) {
      return NextResponse.json({ success: false, error: "This invite link has expired or already been used" }, { status: 400 })
    }

    // Check account doesn't already exist
    const existing = await getAthleteAccount(athleteId)
    if (existing) {
      return NextResponse.json({ success: false, error: "An account already exists for this athlete" }, { status: 409 })
    }

    // Fetch athlete name from training profile
    const name = await getAthleteName(athleteId) ?? "Athlete"

    const passwordHash = await hashPassword(password)
    await saveAthleteAccount({
      athleteId,
      email: email.trim().toLowerCase(),
      passwordHash,
      name,
      createdAt: new Date().toISOString(),
    })

    // Log them in immediately
    const sessionToken = await createAthleteSession(athleteId)
    const res = NextResponse.json({ success: true, athleteId })
    res.cookies.set(ATHLETE_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_MS,
      path: "/",
    })
    return res
  } catch (err) {
    console.error("[athlete register POST]", err)
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 })
  }
}
