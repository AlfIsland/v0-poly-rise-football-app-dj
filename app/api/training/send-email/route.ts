import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: NextRequest) {
  const { email, athleteName, id, age, grade, school, position, sessionCount, joinedAt, metrics } = await req.json()

  if (!email || !id) return NextResponse.json({ success: false, error: "Missing email or id" }, { status: 400 })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return NextResponse.json({ success: false, error: "Email not configured" }, { status: 500 })

  const joinedStr = joinedAt ? new Date(joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : ""

  const metricsRows = metrics && metrics.length ? metrics.map((m: { label: string; baseline: string; current: string; change: string; improved: boolean }) => `
    <tr>
      <td style="padding:8px 12px;color:#ccc;font-size:13px;">${m.label}</td>
      <td style="padding:8px 12px;color:#aaa;font-size:13px;text-align:center;">${m.baseline}</td>
      <td style="padding:8px 12px;color:#fff;font-size:13px;font-weight:bold;text-align:center;">${m.current}</td>
      <td style="padding:8px 12px;font-size:13px;font-weight:bold;text-align:center;color:${m.improved ? "#34d399" : "#f87171"};">${m.change}</td>
    </tr>`).join("") : `<tr><td colspan="4" style="padding:12px;color:#666;text-align:center;font-size:13px;">No metrics recorded yet</td></tr>`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr>
        <td style="background:#b40a0a;padding:24px 32px;border-radius:12px 12px 0 0;">
          <p style="margin:0;color:#fff;font-size:20px;font-weight:bold;">PolyRISE Football</p>
          <p style="margin:4px 0 0;color:#ffcccc;font-size:12px;">Monthly Progress Report · Training Program</p>
        </td>
      </tr>
      <tr>
        <td style="background:#111116;padding:32px;border-radius:0 0 12px 12px;">
          <p style="color:#fff;font-size:22px;font-weight:bold;margin:0 0 4px;">${athleteName}</p>
          <p style="color:#888;font-size:13px;margin:0 0 24px;">${[age ? `Age ${age}` : "", grade, school, position].filter(Boolean).join(" · ")}</p>

          <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td style="color:#888;font-size:12px;padding-right:16px;padding-bottom:6px;">MEMBER SINCE</td><td style="color:#fff;font-size:14px;font-weight:bold;">${joinedStr}</td></tr>
            <tr><td style="color:#888;font-size:12px;padding-right:16px;">TOTAL SESSIONS</td><td style="color:#fff;font-size:14px;font-weight:bold;">${sessionCount}</td></tr>
          </table>

          <p style="color:#aaa;font-size:13px;font-weight:bold;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Progress Snapshot</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a22;border-radius:8px;overflow:hidden;margin-bottom:24px;">
            <tr style="background:#222230;">
              <th style="padding:8px 12px;color:#666;font-size:11px;text-align:left;text-transform:uppercase;">Metric</th>
              <th style="padding:8px 12px;color:#666;font-size:11px;text-align:center;text-transform:uppercase;">Baseline</th>
              <th style="padding:8px 12px;color:#666;font-size:11px;text-align:center;text-transform:uppercase;">Current</th>
              <th style="padding:8px 12px;color:#666;font-size:11px;text-align:center;text-transform:uppercase;">Change</th>
            </tr>
            ${metricsRows}
          </table>

          <hr style="border:none;border-top:1px solid #222;margin:0 0 20px;">
          <p style="color:#666;font-size:12px;margin:0;">Questions? Contact Coach Jonathan</p>
          <p style="color:#666;font-size:12px;margin:6px 0 0;">(817) 658-3300 · coachjonathan@polyrisefootball.com</p>
        </td>
      </tr>
      <tr><td style="padding:20px 0;text-align:center;">
        <p style="color:#333;font-size:11px;margin:0;">PolyRISE Football · Austin, TX · polyrisefootball.com</p>
      </td></tr>
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
      subject: `Monthly Progress Report — ${athleteName} | PolyRISE Football`,
      html,
    })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
