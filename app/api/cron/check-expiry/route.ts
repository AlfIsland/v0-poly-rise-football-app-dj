import { NextRequest, NextResponse } from "next/server"
import { getAllParents, saveParent } from "@/lib/parent-store"

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && auth === `Bearer ${cronSecret}`) return true
  // Vercel cron calls include this header automatically
  if (req.headers.get("x-vercel-cron") === "1") return true
  return false
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || "PolyRISE7v7@gmail.com"

  try {
    const parents = await getAllParents()
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const expiredList: string[] = []
    const soonList: string[] = []

    for (const parent of parents) {
      if (parent.tier !== "program" || parent.approvalStatus !== "approved" || !parent.accessExpiry) continue

      const exp = new Date(parent.accessExpiry + "T00:00:00")
      const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays < 0) {
        // Already expired — revoke access
        parent.tier = "none"
        parent.approvalStatus = "denied"
        await saveParent(parent)
        expiredList.push(`${parent.name} (${parent.email}) — expired ${parent.accessExpiry}`)
      } else if (diffDays <= 3) {
        soonList.push(`${parent.name} (${parent.email}) — expires ${parent.accessExpiry} (${diffDays}d)`)
      }
    }

    // Send summary email to admin if anything notable
    if (resendKey && (expiredList.length > 0 || soonList.length > 0)) {
      const lines: string[] = []
      if (expiredList.length > 0) {
        lines.push(`<h3 style="color:#dc2626;margin:0 0 8px">Access Revoked (Expired)</h3>`)
        lines.push(`<ul style="color:#ccc;font-size:14px;margin:0 0 16px;padding-left:20px">`)
        expiredList.forEach(l => lines.push(`<li>${l}</li>`))
        lines.push(`</ul>`)
      }
      if (soonList.length > 0) {
        lines.push(`<h3 style="color:#f59e0b;margin:0 0 8px">Expiring Within 3 Days</h3>`)
        lines.push(`<ul style="color:#ccc;font-size:14px;margin:0 0 16px;padding-left:20px">`)
        soonList.forEach(l => lines.push(`<li>${l}</li>`))
        lines.push(`</ul>`)
      }

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "PolyRISE Football <noreply@polyrisefootball.com>",
          to: [adminEmail],
          subject: `PolyRISE Access Expiry Alert — ${expiredList.length} revoked, ${soonList.length} expiring soon`,
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#0a0a0f;color:#fff">
              <h2 style="color:#dc2626;margin:0 0 16px">Daily Access Expiry Report</h2>
              <p style="color:#999;font-size:13px;margin:0 0 20px">${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
              ${lines.join("\n")}
              <p style="margin-top:24px">
                <a href="https://polyrisefootball.com/admin/parents?filter=expiring" style="background:#dc2626;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">View in Admin →</a>
              </p>
              <p style="color:#555;font-size:12px;margin-top:16px">PolyRISE Football · polyrisefootball.com</p>
            </div>
          `,
        }),
      }).catch(err => console.error("[check-expiry] email failed", err))
    }

    return NextResponse.json({
      success: true,
      revoked: expiredList.length,
      expiringSoon: soonList.length,
      checked: parents.length,
    })
  } catch (err) {
    console.error("[check-expiry]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}
