import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getParent, createSession, PARENT_COOKIE, SESSION_MAX_AGE } from "@/lib/parent-store"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password)
      return NextResponse.json({ success: false, error: "Missing email or password" }, { status: 400 })

    const parent = await getParent(email)
    if (!parent)
      return NextResponse.json({ success: false, error: "No account found with this email" }, { status: 401 })

    const valid = await bcrypt.compare(password, parent.passwordHash)
    if (!valid)
      return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 })

    const token = await createSession(email)
    const res = NextResponse.json({ success: true, tier: parent.tier })
    res.cookies.set(PARENT_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    })
    return res
  } catch (err) {
    console.error("[parent login]", err)
    return NextResponse.json({ success: false, error: "Failed to login" }, { status: 500 })
  }
}
