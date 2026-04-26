import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  // Require admin session — never expose key info publicly
  const adminSession = req.cookies.get("pr_admin_session")?.value
  if (!adminSession || adminSession !== process.env.ADMIN_SESSION_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return NextResponse.json({ status: "NOT SET" })
  return NextResponse.json({
    status: "SET",
    length: key.length,
    prefix: key.substring(0, 12),
  })
}
