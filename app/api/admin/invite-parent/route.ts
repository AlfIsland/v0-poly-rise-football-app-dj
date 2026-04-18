import { NextRequest, NextResponse } from "next/server"

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("pr_admin_session")?.value
  return !!session && !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  try {
    const { email, parentName, athleteId, athleteName } = await req.json()
    if (!email || !athleteId || !athleteName)
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 })

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) return NextResponse.json({ success: false, error: "Email not configured" }, { status: 500 })

    const registerUrl = `https://polyrisefootball.com/parent/register`
    const greeting = parentName ? `Hi ${parentName},` : "Hi,"

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "PolyRISE Football <noreply@polyrisefootball.com>",
        to: [email],
        subject: `Your athlete's PolyRISE Training Passport is ready — ${athleteName}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#0a0a0f;color:#fff">
            <h2 style="color:#dc2626">PolyRISE Athlete Training Passport</h2>
            <p>${greeting}</p>
            <p>Your athlete <strong>${athleteName}</strong> is now in the PolyRISE training system. Create your free parent account to track their progress, view session history, and see performance charts.</p>
            <p style="background:#1a1a2e;border:1px solid #333;border-radius:8px;padding:12px;font-size:13px;color:#aaa">
              When registering, enter Athlete ID: <strong style="color:#60a5fa;font-family:monospace">${athleteId}</strong> to link instantly.
            </p>
            <p style="margin-top:20px">
              <a href="${registerUrl}" style="background:#dc2626;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px">Create Your Account →</a>
            </p>
            <p style="color:#999;font-size:13px;margin-top:24px">Questions? Call <strong>(817) 658-3300</strong> or email <strong>polyrise@polyrisefootball.com</strong></p>
            <p style="color:#555;font-size:12px;margin-top:8px">PolyRISE Football · Dripping Springs, TX · polyrisefootball.com</p>
          </div>
        `,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[invite-parent]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}
