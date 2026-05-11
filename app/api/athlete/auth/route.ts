import { NextRequest, NextResponse } from "next/server"
import {
  ATHLETE_COOKIE, SESSION_MAX_AGE_MS,
  getAthleteAccountByEmail,
  createAthleteSession,
  deleteAthleteSession,
  verifyPassword,
} from "@/lib/athlete-auth"

// POST /api/athlete/auth — login
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 })
    }

    const account = await getAthleteAccountByEmail(email.trim().toLowerCase())
    if (!account) {
      return NextResponse.json({ success: false, error: "No account found for that email" }, { status: 401 })
    }

    const valid = await verifyPassword(password, account.passwordHash)
    if (!valid) {
      return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 })
    }

    const token = await createAthleteSession(account.athleteId)
    const res = NextResponse.json({ success: true, athleteId: account.athleteId })
    res.cookies.set(ATHLETE_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_MS,
      path: "/",
    })
    return res
  } catch (err) {
    console.error("[athlete auth POST]", err)
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 })
  }
}

// DELETE /api/athlete/auth — logout
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get(ATHLETE_COOKIE)?.value
  if (token) await deleteAthleteSession(token)
  const res = NextResponse.json({ success: true })
  res.cookies.set(ATHLETE_COOKIE, "", { maxAge: 0, path: "/" })
  return res
}
