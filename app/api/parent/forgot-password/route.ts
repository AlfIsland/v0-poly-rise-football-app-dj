import { NextRequest, NextResponse } from "next/server"
import { getParent, getRedis } from "@/lib/parent-store"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ success: false, error: "Email required" }, { status: 400 })

    const parent = await getParent(email)
    // Always return success to avoid email enumeration
    if (!parent) return NextResponse.json({ success: true })

    const token = crypto.randomUUID()
    const r = getRedis()
    if (r) await r.setex(`parent:reset:${token}`, 60 * 60, email.toLowerCase()) // 1 hour TTL

    const origin = req.nextUrl.origin
    const resetLink = `${origin}/parent/reset-password?token=${token}`

    // Send via Resend if configured
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "PolyRISE Football <noreply@polyrisefootball.com>",
          to: [parent.email],
          subject: "Reset Your PolyRISE Password",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#dc2626">PolyRISE Football</h2>
              <p>Hi ${parent.name},</p>
              <p>We received a request to reset your password. Click the button below to set a new password. This link expires in 1 hour.</p>
              <a href="${resetLink}" style="display:inline-block;background:#dc2626;color:#fff;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0">Reset Password</a>
              <p style="color:#666;font-size:13px">If you didn't request this, you can ignore this email.</p>
              <p style="color:#999;font-size:12px">PolyRISE Football · (817) 658-3300 · polyrise@polyrisefootball.com</p>
            </div>
          `,
        }),
      })
    } else {
      // Log reset link when Resend not configured (dev mode)
      console.log("[forgot-password] reset link:", resetLink)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[forgot-password]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}
