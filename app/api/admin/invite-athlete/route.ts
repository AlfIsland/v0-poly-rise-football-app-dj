import { NextRequest, NextResponse } from "next/server"
import { createInviteToken } from "@/lib/athlete-auth"

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("pr_admin_session")?.value
  return !!session && !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const { athleteId, athleteName, email } = await req.json()
    if (!athleteId || !email) {
      return NextResponse.json({ success: false, error: "Missing athleteId or email" }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) return NextResponse.json({ success: false, error: "Email not configured" }, { status: 500 })

    const token = await createInviteToken(athleteId)
    const registerUrl = `https://polyrisefootball.com/athlete/register/${token}`

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "PolyRISE Football <noreply@polyrisefootball.com>",
        to: [email],
        subject: `${athleteName ?? "Your"} PolyRISE Recruiting Profile is ready 🏈`,
        html: `
          <div style="font-family:sans-serif;background:#0a0a0f;color:#fff;padding:0;margin:0;max-width:600px">
            <div style="background:#b40a0a;padding:24px 32px">
              <h1 style="margin:0;font-size:20px;font-weight:900;letter-spacing:1px">PolyRISE Football</h1>
              <p style="margin:4px 0 0;font-size:12px;color:#ffaaaa">Athlete Profile Access</p>
            </div>
            <div style="padding:32px">
              <h2 style="color:#fff;font-size:22px;margin:0 0 8px">Your recruiting profile is live${athleteName ? `, ${athleteName.split(" ")[0]}` : ""}!</h2>
              <p style="color:#aaa;font-size:14px;margin:0 0 24px">
                Your PolyRISE coach has set up your personal recruiting profile — packed with your verified combine metrics, national rankings, and recruiting tools.
              </p>

              <div style="background:#1a1a25;border:1px solid #333;border-radius:12px;padding:20px;margin-bottom:24px">
                <p style="color:#ccc;font-size:14px;margin:0 0 8px;font-weight:600">Create your account to:</p>
                <ul style="color:#888;font-size:13px;margin:0;padding-left:20px;line-height:2">
                  <li>View and share your recruiting profile</li>
                  <li>Track your Recruiting Roadmap checklist</li>
                  <li>Download your Instagram Story card</li>
                  <li>Send your profile directly to college coaches</li>
                </ul>
              </div>

              <a href="${registerUrl}" style="display:inline-block;background:#b40a0a;color:#fff;font-weight:700;font-size:16px;padding:16px 36px;border-radius:10px;text-decoration:none">
                Create My Account →
              </a>

              <p style="color:#555;font-size:12px;margin:24px 0 0">
                This link expires in 7 days. If you didn't expect this email, you can ignore it.
              </p>

              <div style="margin-top:32px;padding-top:24px;border-top:1px solid #222">
                <p style="color:#555;font-size:12px;margin:0">Questions? Contact us at <a href="mailto:polyrise@polyrisefootball.com" style="color:#b40a0a">polyrise@polyrisefootball.com</a></p>
                <p style="color:#444;font-size:11px;margin:6px 0 0">PolyRISE Football · Dripping Springs, TX · polyrisefootball.com</p>
              </div>
            </div>
          </div>
        `,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[invite-athlete POST]", err)
    return NextResponse.json({ success: false, error: "Failed to send invite" }, { status: 500 })
  }
}
