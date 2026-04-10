import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/athletes  — save athlete record
// GET  /api/athletes?code=PR-VJMW-0027  — fetch athlete by seal code
// ─────────────────────────────────────────────────────────────────────────────

// Singleton Redis client — reused across serverless invocations
let redis: Redis | null = null

function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
      lazyConnect: false,
    })
    redis.on("error", (err) => console.error("[Redis]", err))
  }
  return redis
}

// In-memory fallback for local dev without Redis
const devStore = new Map<string, string>()

async function kvSet(key: string, value: unknown): Promise<void> {
  const r = getRedis()
  if (r) {
    await r.set(key, JSON.stringify(value))
  } else {
    devStore.set(key, JSON.stringify(value))
  }
}

async function kvGet(key: string): Promise<unknown> {
  const r = getRedis()
  if (r) {
    const raw = await r.get(key)
    return raw ? JSON.parse(raw) : null
  }
  const raw = devStore.get(key)
  return raw ? JSON.parse(raw) : null
}

// ─── POST /api/athletes — save athlete ────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { athleteName, initials } = body

    if (!athleteName || !initials) {
      return NextResponse.json(
        { success: false, error: "Missing athleteName or initials" },
        { status: 400 }
      )
    }

    // Auto-assign next seal number
    const r = getRedis()
    let sealNumber = 1
    if (r) {
      sealNumber = await r.incr("athlete:counter")
    }

    const padded = String(sealNumber).padStart(4, "0")
    const upperCode = `PR-V${initials.toUpperCase()}-${padded}`

    const issuedAt = body.issuedAt || new Date().toISOString()
    const expiresAt = new Date(issuedAt)
    expiresAt.setMonth(expiresAt.getMonth() + 4)

    const athleteData = { ...body, code: upperCode, sealNumber, issuedAt, expiresAt: expiresAt.toISOString() }
    await kvSet(`athlete:${upperCode}`, athleteData)

    // Track in roster list
    if (r) {
      await r.sadd("athlete:roster", upperCode)
    }

    // Send notifications to athlete and parent
    const resendKey = process.env.RESEND_API_KEY
    const verifyUrl = `https://polyrisefootball.com/verify/${upperCode}`
    const expiresFormatted = expiresAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    const emailHtml = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#dc2626;margin-bottom:4px">PR-VERIFIED Seal Issued</h2>
        <p style="color:#444;margin-top:0"><strong>${body.athleteName}</strong> has been PR-VERIFIED by PolyRISE Football.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
          <tr style="background:#f9fafb"><td style="padding:10px 12px;color:#555;width:140px">Seal Code</td><td style="padding:10px 12px;font-weight:bold;font-family:monospace">${upperCode}</td></tr>
          <tr><td style="padding:10px 12px;color:#555">Position</td><td style="padding:10px 12px">${body.position || "—"}</td></tr>
          <tr style="background:#f9fafb"><td style="padding:10px 12px;color:#555">School</td><td style="padding:10px 12px">${body.school || "—"}</td></tr>
          <tr><td style="padding:10px 12px;color:#555">Valid Until</td><td style="padding:10px 12px;color:#dc2626;font-weight:bold">${expiresFormatted}</td></tr>
        </table>
        <p style="color:#666;font-size:13px;margin-top:16px">Copy and paste the link below to view your PR-VERIFIED profile. Share it with college coaches and recruiters.</p>
        <p style="background:#f3f4f6;padding:12px;border-radius:8px;word-break:break-all;font-size:13px;margin:8px 0">${verifyUrl}</p>
        <p style="color:#666;font-size:13px;">Your seal expires on <strong>${expiresFormatted}</strong> — you will receive a reminder to re-verify before then.</p>
        <p style="color:#999;font-size:12px;margin-top:16px">PolyRISE Football · (817) 658-3300 · polyrise@polyrisefootball.com</p>
      </div>
    `

    if (resendKey) {
      const recipients = [
        body.email && { to: body.email, name: body.athleteName },
        body.parentEmail && { to: body.parentEmail, name: body.parentName || "Parent/Guardian" },
      ].filter(Boolean) as { to: string; name: string }[]

      for (const rec of recipients) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "PolyRISE Football <noreply@polyrisefootball.com>",
            to: [rec.to],
            subject: `PR-VERIFIED Seal Issued — ${body.athleteName} (${upperCode})`,
            html: emailHtml,
          }),
        }).catch(err => console.error("[athletes] email failed", err))
      }
    }

    // SMS via Twilio
    const twilioSid = process.env.TWILIO_ACCOUNT_SID
    const twilioToken = process.env.TWILIO_AUTH_TOKEN
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER
    if (twilioSid && twilioToken && twilioFrom) {
      const smsText = `PolyRISE Football: ${body.athleteName} has been PR-VERIFIED! View profile: ${verifyUrl} | Expires ${expiresFormatted}. Re-verify at https://polyrisefootball.com/register`
      const numbers = [body.phone, body.parentPhone].filter(Boolean)
      for (const num of numbers) {
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ To: num, From: twilioFrom, Body: smsText }).toString(),
        }).catch(err => console.error("[athletes] sms failed", err))
      }
    }

    return NextResponse.json({ success: true, code: upperCode, sealNumber })
  } catch (err) {
    console.error("[athletes POST]", err)
    return NextResponse.json(
      { success: false, error: "Failed to save athlete" },
      { status: 500 }
    )
  }
}

// ─── PUT /api/athletes — update existing athlete ─────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ success: false, error: "Missing code" }, { status: 400 })
    }

    const upperCode = code.toUpperCase()
    const existing = await kvGet(`athlete:${upperCode}`) as Record<string, unknown> | null

    if (!existing) {
      return NextResponse.json({ success: false, error: "Athlete not found" }, { status: 404 })
    }

    // Preserve original issuedAt, sealNumber, expiresAt unless explicitly renewed
    await kvSet(`athlete:${upperCode}`, {
      ...existing,
      ...body,
      code: upperCode,
      issuedAt: existing.issuedAt,
      expiresAt: existing.expiresAt,
      sealNumber: existing.sealNumber,
    })

    return NextResponse.json({ success: true, code: upperCode })
  } catch (err) {
    console.error("[athletes PUT]", err)
    return NextResponse.json({ success: false, error: "Failed to update athlete" }, { status: 500 })
  }
}

// ─── GET /api/athletes?code=PR-VCM-0003 — fetch athlete ──────────────────────

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")

  if (!code) {
    return NextResponse.json(
      { success: false, error: "Missing code parameter" },
      { status: 400 }
    )
  }

  try {
    const data = await kvGet(`athlete:${code.toUpperCase()}`)

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Athlete not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, athlete: data })
  } catch (err) {
    console.error("[athletes GET]", err)
    return NextResponse.json(
      { success: false, error: "Failed to retrieve athlete" },
      { status: 500 }
    )
  }
}
