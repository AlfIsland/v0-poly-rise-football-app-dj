import { NextRequest, NextResponse } from "next/server"
import { getSessionEmail, getParentByEmail } from "@/lib/parent-store"
import Redis from "ioredis"

async function getAthlete(id: string) {
  try {
    if (!process.env.REDIS_URL) return null
    const redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    const raw = await redis.get(`training:athlete:${id.toUpperCase()}`)
    await redis.quit()
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export async function POST(req: NextRequest) {
  try {
    // ── Verify parent session ──
    const token = req.cookies.get("pr_parent_session")?.value
    if (!token) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })

    const email = await getSessionEmail(token)
    if (!email) return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 })

    const parent = await getParentByEmail(email)
    if (!parent) return NextResponse.json({ success: false, error: "Parent not found" }, { status: 404 })

    const { athleteId, athleteEmail } = await req.json()
    if (!athleteId || !athleteEmail) {
      return NextResponse.json({ success: false, error: "Missing athleteId or athleteEmail" }, { status: 400 })
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(athleteEmail)) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 })
    }

    // ── Verify parent owns this athlete ──
    if (!parent.athleteIds?.includes(athleteId.toUpperCase())) {
      return NextResponse.json({ success: false, error: "Athlete not linked to your account" }, { status: 403 })
    }

    // ── Fetch athlete data for the email ──
    const athlete = await getAthlete(athleteId)
    if (!athlete) return NextResponse.json({ success: false, error: "Athlete not found" }, { status: 404 })

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) return NextResponse.json({ success: false, error: "Email not configured" }, { status: 500 })

    const profileUrl = `https://polyrisefootball.com/athlete/${athleteId.toUpperCase()}?welcome=1`
    const athleteName = athlete.name ?? "Athlete"
    const position   = athlete.position ?? ""
    const school     = athlete.school ?? ""
    const firstName  = athleteName.split(" ")[0]

    // Pull best metric for the subject line hook
    const latest = athlete.sessions?.[athlete.sessions.length - 1] ?? {}
    const fortyYard = latest.fortyYard ?? athlete.sessions?.[0]?.fortyYard
    const vertical  = latest.verticalJump ?? athlete.sessions?.[0]?.verticalJump
    const metricLine = fortyYard
      ? `Your verified 40-yard dash: <strong style="color:#ffffff">${fortyYard}s</strong>`
      : vertical
      ? `Your verified vertical jump: <strong style="color:#ffffff">${vertical}"</strong>`
      : "Your combine metrics are verified and ready to share."

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PolyRISE Football <noreply@polyrisefootball.com>",
        to: [athleteEmail],
        subject: `${firstName}, your PolyRISE recruiting profile is live 🏈`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0a0a0f;color:#ffffff;border-radius:12px;overflow:hidden">

            <!-- Top bar -->
            <div style="background:linear-gradient(90deg,#b40a0a,#dc2626);height:8px"></div>

            <!-- Header -->
            <div style="padding:32px 32px 0 32px">
              <p style="color:#b40a0a;font-size:12px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px 0">PolyRISE Football</p>
              <h1 style="color:#ffffff;font-size:28px;font-weight:900;margin:0 0 6px 0;line-height:1.2">
                ${firstName}, your profile<br/>is live.
              </h1>
              <p style="color:#6b7280;font-size:14px;margin:0 0 24px 0">
                ${[position, school].filter(Boolean).join(" · ")}
              </p>
            </div>

            <!-- Metric highlight box -->
            <div style="margin:0 32px 24px 32px;background:#1a1a2e;border:1px solid #2d2d4e;border-radius:10px;padding:20px">
              <p style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px 0">Your Verified Metric</p>
              <p style="color:#9ca3af;font-size:15px;margin:0;line-height:1.6">
                ${metricLine}
              </p>
              ${athlete.featured ? `
              <div style="margin-top:14px;display:inline-block;background:rgba(127,29,29,0.5);border:1px solid #b40a0a;border-radius:6px;padding:6px 14px">
                <p style="color:#fca5a5;font-size:12px;font-weight:bold;margin:0">✓ PR-VERIFIED</p>
              </div>` : ""}
            </div>

            <!-- Body copy -->
            <div style="padding:0 32px 24px 32px">
              <p style="color:#d1d5db;font-size:15px;line-height:1.7;margin:0 0 16px 0">
                Your parent set up your PolyRISE recruiting profile. It's got your verified combine metrics, your national ranking, and a shareable card you can post on Instagram.
              </p>
              <p style="color:#d1d5db;font-size:15px;line-height:1.7;margin:0 0 28px 0">
                Tap below to see how you stack up nationally for your position — and grab your card.
              </p>

              <!-- CTA button -->
              <a href="${profileUrl}"
                style="display:inline-block;background:linear-gradient(90deg,#b40a0a,#dc2626);color:#ffffff;font-weight:900;font-size:15px;text-decoration:none;padding:16px 32px;border-radius:10px;letter-spacing:1px;text-transform:uppercase">
                See My Profile →
              </a>
            </div>

            <!-- What you'll find -->
            <div style="margin:0 32px 28px 32px;border-top:1px solid #1f2937;padding-top:20px">
              <p style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px 0">What's on your profile</p>
              <div style="display:grid;gap:8px">
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="color:#b40a0a;font-size:16px">→</span>
                  <p style="color:#9ca3af;font-size:14px;margin:0">Your verified combine metrics vs. athletes nationwide</p>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="color:#b40a0a;font-size:16px">→</span>
                  <p style="color:#9ca3af;font-size:14px;margin:0">Downloadable recruiting card for Instagram &amp; Twitter</p>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="color:#b40a0a;font-size:16px">→</span>
                  <p style="color:#9ca3af;font-size:14px;margin:0">Shareable link to send directly to college coaches</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background:#0d0d14;padding:20px 32px;border-top:1px solid #1f2937">
              <p style="color:#4b5563;font-size:12px;margin:0 0 4px 0">Questions? We've got you.</p>
              <p style="color:#4b5563;font-size:12px;margin:0">
                <strong style="color:#6b7280">Kevin Garrett</strong> · kg@polyrisefootball.com · (817) 658-3300
              </p>
              <p style="color:#374151;font-size:11px;margin:12px 0 0 0">PolyRISE Football · Austin, Texas · polyrisefootball.com</p>
            </div>

            <!-- Bottom bar -->
            <div style="background:linear-gradient(90deg,#b40a0a,#dc2626);height:6px"></div>
          </div>
        `,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[invite-athlete]", err)
    return NextResponse.json({ success: false, error: "Failed to send invite" }, { status: 500 })
  }
}
