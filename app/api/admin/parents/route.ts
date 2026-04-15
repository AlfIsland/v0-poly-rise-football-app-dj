import { NextRequest, NextResponse } from "next/server"
import { getAllParents, getParent, saveParent } from "@/lib/parent-store"
import Redis from "ioredis"

let redis: Redis | null = null
function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    redis.on("error", (err) => console.error("[Redis Admin Parents]", err))
  }
  return redis
}

async function sendAthleteLinkedEmail(parentEmail: string, parentName: string, athleteId: string) {
  const r = getRedis()
  let athleteName = athleteId
  if (r) {
    const raw = await r.get(`training:athlete:${athleteId.toUpperCase()}`)
    if (raw) athleteName = JSON.parse(raw).name
  }
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return
  fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "PolyRISE Football <noreply@polyrisefootball.com>",
      to: [parentEmail],
      subject: `Your athlete profile is ready — ${athleteName}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#0a0a0f;color:#fff">
          <h2 style="color:#dc2626">Your Athlete Profile Is Live</h2>
          <p>Hi ${parentName},</p>
          <p>Your PolyRISE account has been linked to <strong>${athleteName}</strong>'s training profile. You can now log in to view their stats, test results, progress charts, and more.</p>
          <p style="margin-top:20px">
            <a href="https://polyrisefootball.com/parent/portal" style="background:#dc2626;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px">View Athlete Profile →</a>
          </p>
          <p style="color:#999;font-size:13px;margin-top:24px">Questions? Call us at <strong>(817) 658-3300</strong> or email <strong>polyrise@polyrisefootball.com</strong></p>
          <p style="color:#555;font-size:12px;margin-top:8px">PolyRISE Football · Dripping Springs, TX · polyrisefootball.com</p>
        </div>
      `,
    }),
  }).catch(err => console.error("[admin parents] link email failed", err))
}

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("pr_admin_session")?.value
  return !!session && !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN
}

// GET /api/admin/parents — list all parent accounts
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  try {
    const parents = await getAllParents()
    return NextResponse.json({ success: true, parents })
  } catch (err) {
    console.error("[admin parents GET]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}

// PATCH /api/admin/parents — link or unlink athlete to parent
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  try {
    const { email, action, athleteId } = await req.json()
    if (!email || !action) return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 })

    const parent = await getParent(email)
    if (!parent) return NextResponse.json({ success: false, error: "Parent not found" }, { status: 404 })

    if (action === "link") {
      if (!athleteId) return NextResponse.json({ success: false, error: "Missing athleteId" }, { status: 400 })
      if (!parent.athleteIds.includes(athleteId)) parent.athleteIds.push(athleteId)
      await saveParent(parent)
      await sendAthleteLinkedEmail(parent.email, parent.name, athleteId)

    } else if (action === "unlink") {
      if (!athleteId) return NextResponse.json({ success: false, error: "Missing athleteId" }, { status: 400 })
      parent.athleteIds = parent.athleteIds.filter(id => id !== athleteId)
      await saveParent(parent)

    } else if (action === "approve") {
      // Approve program member — set tier, mark approved, link athlete if provided
      parent.tier = "program"
      parent.approvalStatus = "approved"
      if (athleteId && !parent.athleteIds.includes(athleteId)) parent.athleteIds.push(athleteId)
      await saveParent(parent)
      // Send access email
      const linkedId = athleteId || parent.athleteIds[0]
      if (linkedId) await sendAthleteLinkedEmail(parent.email, parent.name, linkedId)
      else {
        // No athlete linked yet — send generic approval email
        const resendKey = process.env.RESEND_API_KEY
        if (resendKey) {
          fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "PolyRISE Football <noreply@polyrisefootball.com>",
              to: [parent.email],
              subject: "Your PolyRISE Program Access is Approved",
              html: `
                <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#0a0a0f;color:#fff">
                  <h2 style="color:#16a34a">You're Approved!</h2>
                  <p>Hi ${parent.name},</p>
                  <p>Your PolyRISE Program Member access has been approved. Your athlete's profile will be linked shortly — you'll receive another email once it's ready.</p>
                  <p style="color:#999;font-size:13px;margin-top:24px">Questions? Call <strong>(817) 658-3300</strong></p>
                  <p style="color:#555;font-size:12px;margin-top:8px">PolyRISE Football · polyrisefootball.com</p>
                </div>
              `,
            }),
          }).catch(err => console.error("[admin parents] approve email failed", err))
        }
      }

    } else if (action === "deny") {
      // Deny program member — keep account but mark denied, send subscribe email
      parent.approvalStatus = "denied"
      await saveParent(parent)
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "PolyRISE Football <noreply@polyrisefootball.com>",
            to: [parent.email],
            subject: "Your PolyRISE Portal Access",
            html: `
              <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#0a0a0f;color:#fff">
                <h2 style="color:#dc2626">Action Required — Subscription Needed</h2>
                <p>Hi ${parent.name},</p>
                <p>We were unable to verify your athlete's enrollment in a PolyRISE program. To access your athlete's training metrics and progress reports, a subscription is required.</p>
                <p style="margin-top:16px"><strong>Subscribe starting at $9.99/month</strong> to unlock:</p>
                <ul style="color:#ccc;font-size:14px;margin-top:8px;padding-left:20px">
                  <li>Monthly progress reports</li>
                  <li>Full session history & charts</li>
                  <li>Baseline vs. current comparisons</li>
                  <li>Downloadable PDF reports</li>
                </ul>
                <p style="margin-top:24px">
                  <a href="https://polyrisefootball.com/parent/register" style="background:#dc2626;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px">Subscribe Now →</a>
                </p>
                <p style="color:#999;font-size:13px;margin-top:24px">Questions? Call <strong>(817) 658-3300</strong> or email <strong>polyrise@polyrisefootball.com</strong></p>
                <p style="color:#555;font-size:12px;margin-top:8px">PolyRISE Football · Dripping Springs, TX · polyrisefootball.com</p>
              </div>
            `,
          }),
        }).catch(err => console.error("[admin parents] deny email failed", err))
      }
      return NextResponse.json({ success: true, denied: true })

    } else if (action === "resend-email") {
      // Resend the portal access email for all linked athletes
      const r = getRedis()
      const names: string[] = []
      for (const id of parent.athleteIds) {
        if (r) {
          const raw = await r.get(`training:athlete:${id.toUpperCase()}`)
          if (raw) names.push(JSON.parse(raw).name)
        }
      }
      const athleteList = names.length ? names.join(", ") : "your athlete"
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "PolyRISE Football <noreply@polyrisefootball.com>",
            to: [parent.email],
            subject: `Your PolyRISE athlete profile — ${athleteList}`,
            html: `
              <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#0a0a0f;color:#fff">
                <h2 style="color:#dc2626">Access Your Athlete Profile</h2>
                <p>Hi ${parent.name},</p>
                <p>Your PolyRISE account is linked to <strong>${athleteList}</strong>. Log in anytime to view stats, test results, progress charts, and more.</p>
                <p style="margin-top:20px">
                  <a href="https://polyrisefootball.com/parent/portal" style="background:#dc2626;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px">View Athlete Profile →</a>
                </p>
                <p style="color:#999;font-size:13px;margin-top:24px">Questions? Call us at <strong>(817) 658-3300</strong> or email <strong>polyrise@polyrisefootball.com</strong></p>
                <p style="color:#555;font-size:12px;margin-top:8px">PolyRISE Football · Dripping Springs, TX · polyrisefootball.com</p>
              </div>
            `,
          }),
        }).catch(err => console.error("[admin parents] resend email failed", err))
      }
      return NextResponse.json({ success: true, sent: true })

    } else {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ success: true, athleteIds: parent.athleteIds })
  } catch (err) {
    console.error("[admin parents PATCH]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}
