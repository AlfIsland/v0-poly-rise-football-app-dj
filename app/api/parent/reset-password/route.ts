import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getParent, saveParent, getRedis } from "@/lib/parent-store"

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 })

    const r = getRedis()
    if (!r) return NextResponse.json({ success: false, error: "Service unavailable" }, { status: 500 })

    const email = await r.get(`parent:reset:${token}`)
    if (!email) return NextResponse.json({ success: false, error: "Reset link expired or invalid" }, { status: 400 })

    const parent = await getParent(email)
    if (!parent) return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 })

    parent.passwordHash = await bcrypt.hash(password, 10)
    await saveParent(parent)
    await r.del(`parent:reset:${token}`)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[reset-password]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}
