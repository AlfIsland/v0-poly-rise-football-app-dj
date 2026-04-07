import { NextRequest, NextResponse } from "next/server"

const COOKIE_NAME = "pr_admin_session"
// 7 days in seconds
const MAX_AGE = 60 * 60 * 24 * 7

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  const adminPassword = process.env.ADMIN_PASSWORD
  const sessionToken = process.env.ADMIN_SESSION_TOKEN

  if (!adminPassword || !sessionToken) {
    return NextResponse.json({ success: false, error: "Server not configured" }, { status: 500 })
  }

  if (password !== adminPassword) {
    return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  })
  return res
}
