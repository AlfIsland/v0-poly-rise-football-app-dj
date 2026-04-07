import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: NextRequest) {
  const { email, athleteName, code, position, school, gradYear, expiresAt } = await req.json()

  if (!email || !code) {
    return NextResponse.json({ success: false, error: "Missing email or code" }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ success: false, error: "Email not configured" }, { status: 500 })
  }

  const verifyUrl = `https://polyrisefootball.com/verify/${code}`
  const expiryStr = expiresAt ? new Date(expiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#b40a0a;padding:24px 32px;border-radius:12px 12px 0 0;">
            <p style="margin:0;color:#fff;font-size:20px;font-weight:bold;">PolyRISE Football</p>
            <p style="margin:4px 0 0;color:#ffcccc;font-size:12px;">PR-VERIFIED Seal Program · Austin, Texas</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#111116;padding:32px;border-radius:0 0 12px 12px;">
            <p style="color:#fff;font-size:22px;font-weight:bold;margin:0 0 8px;">Congratulations, ${athleteName}!</p>
            <p style="color:#aaa;font-size:15px;margin:0 0 24px;">Your PR-VERIFIED seal has been issued by PolyRISE Football.</p>

            ${position || school || gradYear ? `
            <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              ${position ? `<tr><td style="color:#888;font-size:12px;padding-right:16px;padding-bottom:6px;">POSITION</td><td style="color:#fff;font-size:14px;font-weight:bold;">${position}</td></tr>` : ""}
              ${school ? `<tr><td style="color:#888;font-size:12px;padding-right:16px;padding-bottom:6px;">SCHOOL</td><td style="color:#fff;font-size:14px;font-weight:bold;">${school}</td></tr>` : ""}
              ${gradYear ? `<tr><td style="color:#888;font-size:12px;padding-right:16px;padding-bottom:6px;">CLASS</td><td style="color:#fff;font-size:14px;font-weight:bold;">${gradYear}</td></tr>` : ""}
              ${expiryStr ? `<tr><td style="color:#888;font-size:12px;padding-right:16px;padding-bottom:6px;">VALID THROUGH</td><td style="color:#fff;font-size:14px;font-weight:bold;">${expiryStr}</td></tr>` : ""}
            </table>` : ""}

            <p style="color:#ccc;font-size:14px;margin:0 0 8px;">Your seal code:</p>
            <p style="color:#e05050;font-size:20px;font-weight:bold;font-family:monospace;margin:0 0 24px;letter-spacing:2px;">${code}</p>

            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#b40a0a;border-radius:10px;padding:14px 28px;">
                  <a href="${verifyUrl}" style="color:#fff;font-size:15px;font-weight:bold;text-decoration:none;">View My PR-VERIFIED Profile →</a>
                </td>
              </tr>
            </table>

            <p style="color:#888;font-size:13px;margin:0 0 4px;">Or copy this link:</p>
            <p style="color:#e05050;font-size:13px;word-break:break-all;margin:0 0 32px;">${verifyUrl}</p>

            <hr style="border:none;border-top:1px solid #222;margin:0 0 24px;">
            <p style="color:#666;font-size:12px;margin:0;">Share your profile link with college coaches, recruiters, and scouts.</p>
            <p style="color:#666;font-size:12px;margin:8px 0 0;">Questions? Contact us at coachjonathan@polyrisefootball.com · 512-593-3933</p>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 0;text-align:center;">
            <p style="color:#333;font-size:11px;margin:0;">PolyRISE Football · Austin, TX · polyrisefootball.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: "PolyRISE Football <noreply@polyrisefootball.com>",
      to: email,
      subject: `Your PR-VERIFIED Seal is Ready — ${athleteName}`,
      html,
    })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error("[send-email]", err)
    const message = err instanceof Error ? err.message : "Failed to send email"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
