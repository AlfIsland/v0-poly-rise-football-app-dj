import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getParent, saveParent, createSession, PARENT_COOKIE, SESSION_MAX_AGE } from "@/lib/parent-store"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 registrations per hour per IP
    const ip = getClientIp(req)
    const rl = await rateLimit(`parent:register:${ip}`, 5, 60 * 60)
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      )
    }

    const { email, password, name, phone, athleteName, athleteId, plan } = await req.json()
    if (!email || !password || !name)
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })

    const existing = await getParent(email)
    if (existing)
      return NextResponse.json({ success: false, error: "An account with this email already exists" }, { status: 409 })

    const isProgramMember = plan === "free"
    const planLabel =
      plan === "elite-recruit" ? "Elite Recruit — $49.99/mo" :
      plan === "recruit"       ? "Recruit — $29.99/mo" :
      plan === "passport"      ? "Passport — $9.99/mo" :
      plan === "monthly"       ? "Passport — $9.99/mo" :
      plan === "quarterly"     ? "Passport Quarterly — $24.99/quarter" :
      plan === "free"          ? "Program Member (Free)" : plan
    const passwordHash = await bcrypt.hash(password, 10)
    await saveParent({
      email: email.toLowerCase(),
      passwordHash,
      name,
      phone: phone || "",
      athleteName: athleteName || "",
      requestedAthleteId: athleteId ? athleteId.toUpperCase() : undefined,
      athleteIds: [],
      tier: "none",
      approvalStatus: isProgramMember ? "pending" : undefined,
      createdAt: new Date().toISOString(),
    })

    // Notify admin
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "PolyRISE Football <noreply@polyrisefootball.com>",
          to: ["PolyRISE7v7@gmail.com"],
          subject: isProgramMember
            ? `⏳ Program Member Approval Needed — ${name}`
            : `🆕 New Signup: ${planLabel} — ${name}`,
          html: isProgramMember ? `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#0a0a0f;color:#fff">
              <h2 style="color:#f59e0b">Program Member Approval Needed</h2>
              <p>A parent signed up claiming to be a PolyRISE Program Member. Please verify and approve or deny.</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "—"}</p>
              <p><strong>Athlete Name:</strong> ${athleteName || "—"}</p>
              <p><strong>Plan:</strong> ${planLabel}</p>
              <p><strong>Signed up:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin-top:20px">
                <a href="https://polyrisefootball.com/admin/parents" style="background:#dc2626;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">Approve or Deny →</a>
              </p>
              <p style="color:#999;font-size:12px;margin-top:16px">PolyRISE Football · polyrisefootball.com/admin/parents</p>
            </div>
          ` : `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#0a0a0f;color:#fff">
              <h2 style="color:#dc2626">New Parent Signup</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "—"}</p>
              <p><strong>Athlete Name:</strong> ${athleteName || "—"}</p>
              <p><strong>Plan:</strong> ${planLabel}</p>
              <p><strong>Signed up:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin-top:16px"><strong>Action needed:</strong> Link their athlete once payment is confirmed.</p>
              <p style="margin-top:12px">
                <a href="https://polyrisefootball.com/admin/parents" style="background:#dc2626;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">Manage Parents →</a>
              </p>
              <p style="color:#999;font-size:12px;margin-top:16px">PolyRISE Football · polyrisefootball.com/admin/parents</p>
            </div>
          `,
        }),
      }).catch(err => console.error("[register notify]", err))

    }

    const token = await createSession(email)
    const res = NextResponse.json({ success: true })
    res.cookies.set(PARENT_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    })
    return res
  } catch (err) {
    console.error("[parent register]", err)
    return NextResponse.json({ success: false, error: "Failed to register" }, { status: 500 })
  }
}
