import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"

let redis: Redis | null = null
function getRedis() {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    redis.on("error", err => console.error("[Redis Cron]", err))
  }
  return redis
}

async function sendEmail(resendKey: string, to: string, subject: string, html: string) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "PolyRISE Football <onboarding@resend.dev>", to: [to], subject, html }),
  }).catch(err => console.error("[cron] email failed", err))
}

async function sendSms(sid: string, token: string, from: string, to: string, body: string) {
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
  }).catch(err => console.error("[cron] sms failed", err))
}

export async function GET(req: NextRequest) {
  // Protect cron endpoint
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const r = getRedis()
  if (!r) return NextResponse.json({ error: "No Redis" }, { status: 500 })

  const resendKey = process.env.RESEND_API_KEY
  const twilioSid = process.env.TWILIO_ACCOUNT_SID
  const twilioToken = process.env.TWILIO_AUTH_TOKEN
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER

  const codes = await r.smembers("athlete:roster")
  if (!codes.length) return NextResponse.json({ checked: 0 })

  const values = await r.mget(...codes.map(c => `athlete:${c}`))
  const athletes = values.filter(Boolean).map(v => JSON.parse(v!))

  const now = new Date()
  let reminded30 = 0, remindedExpired = 0

  for (const athlete of athletes) {
    if (!athlete.expiresAt) continue
    const expires = new Date(athlete.expiresAt)
    const daysLeft = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const verifyUrl = `https://polyrisefootball.com/verify/${athlete.code}`
    const registerUrl = `https://polyrisefootball.com/register`
    const expiresFormatted = expires.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

    // 30-day warning
    if (daysLeft === 30) {
      const subject = `PR-VERIFIED Seal Expiring Soon — ${athlete.athleteName}`
      const html = `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
          <h2 style="color:#d97706">PR-VERIFIED Seal Expiring in 30 Days</h2>
          <p>Hi, this is a reminder that <strong>${athlete.athleteName}</strong>'s PR-VERIFIED seal expires on <strong>${expiresFormatted}</strong>.</p>
          <p>To keep your recruiting profile active, sign up for the next PR-VERIFIED Combine Camp before your seal expires.</p>
          <p style="margin-top:20px"><a href="${registerUrl}" style="background:#dc2626;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Sign Up for Next PR-VERIFIED Event →</a></p>
          <p style="margin-top:16px"><a href="${verifyUrl}" style="color:#dc2626">View current profile</a></p>
          <p style="color:#999;font-size:12px;margin-top:16px">PolyRISE Football · (817) 658-3300 · polyrise@polyrisefootball.com</p>
        </div>
      `
      const sms = `PolyRISE: ${athlete.athleteName}'s PR-VERIFIED seal expires in 30 days (${expiresFormatted}). Sign up to re-verify: ${registerUrl}`

      if (resendKey) {
        if (athlete.email) await sendEmail(resendKey, athlete.email, subject, html)
        if (athlete.parentEmail) await sendEmail(resendKey, athlete.parentEmail, subject, html)
      }
      if (twilioSid && twilioToken && twilioFrom) {
        if (athlete.phone) await sendSms(twilioSid, twilioToken, twilioFrom, athlete.phone, sms)
        if (athlete.parentPhone) await sendSms(twilioSid, twilioToken, twilioFrom, athlete.parentPhone, sms)
      }
      reminded30++
    }

    // Expiration day
    if (daysLeft === 0) {
      const subject = `PR-VERIFIED Seal Expired — ${athlete.athleteName}`
      const html = `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
          <h2 style="color:#dc2626">PR-VERIFIED Seal Has Expired</h2>
          <p><strong>${athlete.athleteName}</strong>'s PR-VERIFIED seal expired today.</p>
          <p>Sign up for the next PR-VERIFIED Combine Camp to renew your seal and keep your recruiting profile active.</p>
          <p style="margin-top:20px"><a href="${registerUrl}" style="background:#dc2626;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Sign Up to Re-Verify →</a></p>
          <p style="color:#999;font-size:12px;margin-top:16px">PolyRISE Football · (817) 658-3300 · polyrise@polyrisefootball.com</p>
        </div>
      `
      const sms = `PolyRISE: ${athlete.athleteName}'s PR-VERIFIED seal has expired. Sign up to re-verify at ${registerUrl}`

      if (resendKey) {
        if (athlete.email) await sendEmail(resendKey, athlete.email, subject, html)
        if (athlete.parentEmail) await sendEmail(resendKey, athlete.parentEmail, subject, html)
      }
      if (twilioSid && twilioToken && twilioFrom) {
        if (athlete.phone) await sendSms(twilioSid, twilioToken, twilioFrom, athlete.phone, sms)
        if (athlete.parentPhone) await sendSms(twilioSid, twilioToken, twilioFrom, athlete.parentPhone, sms)
      }
      remindedExpired++
    }
  }

  return NextResponse.json({ checked: athletes.length, reminded30, remindedExpired })
}
