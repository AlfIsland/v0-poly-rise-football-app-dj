import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getParent, saveParent, createSession, PARENT_COOKIE, SESSION_MAX_AGE } from "@/lib/parent-store"

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone } = await req.json()
    if (!email || !password || !name)
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })

    const existing = await getParent(email)
    if (existing)
      return NextResponse.json({ success: false, error: "An account with this email already exists" }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 10)
    await saveParent({
      email: email.toLowerCase(),
      passwordHash,
      name,
      phone: phone || "",
      athleteIds: [],
      tier: "none",
      createdAt: new Date().toISOString(),
    })

    const token = await createSession(email)
    const res = NextResponse.json({ success: true })
    res.cookies.set(PARENT_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    })
    return res
  } catch (err) {
    console.error("[parent register]", err)
    return NextResponse.json({ success: false, error: "Failed to register" }, { status: 500 })
  }
}
