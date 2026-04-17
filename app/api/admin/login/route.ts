import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"

const COOKIE_NAME = "pr_admin_session"
const MAX_AGE = 60 * 60 * 24 * 7  // 7 days
const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 60 * 15   // 15 minutes

let redis: Redis | null = null
function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    redis.on("error", err => console.error("[Redis admin login]", err))
  }
  return redis
}

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  const adminPassword = process.env.ADMIN_PASSWORD
  const sessionToken = process.env.ADMIN_SESSION_TOKEN

  if (!adminPassword || !sessionToken) {
    return NextResponse.json({ success: false, error: "Server not configured" }, { status: 500 })
  }

  // Brute-force protection — key per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const lockKey = `admin:login:lock:${ip}`
  const attemptsKey = `admin:login:attempts:${ip}`
  const r = getRedis()

  if (r) {
    const locked = await r.get(lockKey)
    if (locked) {
      const ttl = await r.ttl(lockKey)
      return NextResponse.json({
        success: false,
        error: `Too many failed attempts. Try again in ${Math.ceil(ttl / 60)} minute(s).`
      }, { status: 429 })
    }
  }

  if (password !== adminPassword) {
    // Track failed attempt
    if (r) {
      const attempts = await r.incr(attemptsKey)
      await r.expire(attemptsKey, LOCKOUT_SECONDS)
      if (attempts >= MAX_ATTEMPTS) {
        await r.setex(lockKey, LOCKOUT_SECONDS, "1")
        await r.del(attemptsKey)
        // Alert email on lockout
        const resendKey = process.env.RESEND_API_KEY
        if (resendKey) {
          fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "PolyRISE Football <noreply@polyrisefootball.com>",
              to: ["PolyRISE7v7@gmail.com"],
              subject: "⚠️ Admin Login — IP Locked Out",
              html: `<div style="font-family:sans-serif;padding:20px"><h2 style="color:#dc2626">Admin Login Locked</h2><p>${MAX_ATTEMPTS} failed login attempts from IP <strong>${ip}</strong>. Account locked for 15 minutes.</p><p style="color:#999;font-size:12px">${new Date().toLocaleString()}</p></div>`,
            }),
          }).catch(() => {})
        }
        return NextResponse.json({ success: false, error: "Too many failed attempts. Locked for 15 minutes." }, { status: 429 })
      }
      const remaining = MAX_ATTEMPTS - attempts
      return NextResponse.json({ success: false, error: `Incorrect password. ${remaining} attempt(s) remaining.` }, { status: 401 })
    }
    return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 })
  }

  // Correct password — clear any tracked attempts
  if (r) {
    await r.del(attemptsKey)
    await r.del(lockKey)
  }

  // Email alert on successful login
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "PolyRISE Football <noreply@polyrisefootball.com>",
        to: ["PolyRISE7v7@gmail.com"],
        subject: "✅ Admin Login — PolyRISE",
        html: `<div style="font-family:sans-serif;padding:20px"><h2 style="color:#16a34a">Admin Login Successful</h2><p>Someone logged into the PolyRISE admin panel.</p><p><strong>IP:</strong> ${ip}</p><p><strong>Time:</strong> ${new Date().toLocaleString()}</p><p style="color:#999;font-size:12px">If this wasn't you, change your ADMIN_PASSWORD immediately in Vercel.</p></div>`,
      }),
    }).catch(() => {})
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  })
  return res
}
