import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import Redis from "ioredis"

function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  return new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
}

export async function POST(req: NextRequest) {
  const { prompt, leadData } = await req.json()

  if (!prompt) {
    return NextResponse.json({ success: false, error: "Missing prompt" }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ success: false, error: "AI not configured" }, { status: 500 })
  }

  // Save lead to Redis (fire and forget)
  const r = getRedis()
  if (r && leadData) {
    try {
      const leadId = `lead:free-profile:${Date.now()}`
      await r.set(leadId, JSON.stringify({ ...leadData, savedAt: new Date().toISOString() }))
      await r.lpush("leads:free-profile", leadId)
    } catch (e) {
      console.error("[free-profile] Redis save error", e)
    }
  }

  // Send alert email to coach (fire and forget)
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey && leadData) {
    try {
      const resend = new Resend(resendKey)
      const name = leadData.athlete_name || "Unknown Athlete"
      const parent = leadData.parent_name || ""
      const email = leadData.parent_email || ""
      const phone = leadData.parent_phone || ""
      const position = leadData.position || ""
      const gradYear = leadData.grad_year || ""
      const school = leadData.school || ""
      const division = leadData.division || ""
      const source = leadData.source || ""

      await resend.emails.send({
        from: "PolyRISE Lead Magnet <noreply@polyrisefootball.com>",
        to: ["kg@polyrisefootball.com", "polyrise@polyrisefootball.com"],
        subject: `New Free Profile Lead — ${name}`,
        html: `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#0a0a0f;padding:32px 16px;">
  <table width="600" style="max-width:600px;margin:0 auto;background:#111116;border-radius:12px;overflow:hidden;">
    <tr><td style="background:#1A6B3A;padding:20px 28px;">
      <p style="margin:0;color:#fff;font-size:18px;font-weight:bold;">New Free Profile Submission</p>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">polyrisefootball.com/free-profile</p>
    </td></tr>
    <tr><td style="padding:28px;">
      <table cellpadding="0" cellspacing="0" style="width:100%;">
        <tr><td style="color:#888;font-size:12px;padding-bottom:4px;">ATHLETE</td><td style="color:#fff;font-size:15px;font-weight:bold;padding-bottom:12px;">${name}</td></tr>
        <tr><td style="color:#888;font-size:12px;padding-bottom:4px;">POSITION</td><td style="color:#fff;font-size:14px;padding-bottom:12px;">${position}</td></tr>
        <tr><td style="color:#888;font-size:12px;padding-bottom:4px;">GRAD YEAR</td><td style="color:#fff;font-size:14px;padding-bottom:12px;">${gradYear}</td></tr>
        <tr><td style="color:#888;font-size:12px;padding-bottom:4px;">SCHOOL</td><td style="color:#fff;font-size:14px;padding-bottom:12px;">${school}</td></tr>
        <tr><td style="color:#888;font-size:12px;padding-bottom:4px;">TARGET DIVISION</td><td style="color:#fff;font-size:14px;padding-bottom:12px;">${division}</td></tr>
        <tr><td colspan="2" style="border-top:1px solid #222;padding-top:16px;padding-bottom:4px;"></td></tr>
        <tr><td style="color:#888;font-size:12px;padding-bottom:4px;">PARENT NAME</td><td style="color:#fff;font-size:14px;font-weight:bold;padding-bottom:12px;">${parent}</td></tr>
        <tr><td style="color:#888;font-size:12px;padding-bottom:4px;">EMAIL</td><td style="color:#7fd4a0;font-size:14px;padding-bottom:12px;"><a href="mailto:${email}" style="color:#7fd4a0;">${email}</a></td></tr>
        <tr><td style="color:#888;font-size:12px;padding-bottom:4px;">PHONE</td><td style="color:#fff;font-size:14px;padding-bottom:12px;">${phone || "—"}</td></tr>
        <tr><td style="color:#888;font-size:12px;padding-bottom:4px;">SOURCE</td><td style="color:#fff;font-size:14px;padding-bottom:12px;">${source || "—"}</td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:0 28px 24px;"><p style="color:#555;font-size:11px;margin:0;">Submitted ${new Date().toLocaleString("en-US",{timeZone:"America/Chicago"})} CT</p></td></tr>
  </table>
</body>
</html>`,
      })
    } catch (e) {
      console.error("[free-profile] Resend error", e)
    }
  }

  if (r) {
    try { await r.quit() } catch {}
  }

  // Call Anthropic API server-side
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    const data = await response.json()
    const reply = data?.content?.[0]?.text || ""
    return NextResponse.json({ success: true, reply })
  } catch (err: unknown) {
    console.error("[free-profile] Anthropic error", err)
    const message = err instanceof Error ? err.message : "Failed to generate profile"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
