import { NextRequest, NextResponse } from "next/server"

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("pr_admin_session")?.value
  return !!session && !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 })

  const to = req.nextUrl.searchParams.get("to") || "PolyRISE7v7@gmail.com"

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "PolyRISE Football <onboarding@resend.dev>",
      to: [to],
      subject: "PolyRISE Email Test",
      html: "<p>This is a test email from PolyRISE. If you see this, email sending is working.</p>",
    }),
  })

  const data = await res.json()
  return NextResponse.json({ status: res.status, resend_response: data, key_prefix: resendKey.slice(0, 12) })
}
