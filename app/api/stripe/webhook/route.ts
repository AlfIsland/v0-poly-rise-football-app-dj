import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getParentByStripeCustomer, getParent, saveParent } from "@/lib/parent-store"
import { getRegistrationBySession, saveRegistration } from "@/lib/registration-store"

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secretKey || !webhookSecret)
    return NextResponse.json({ error: "Not configured" }, { status: 500 })

  const stripe = new Stripe(secretKey)
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") ?? ""

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error("[webhook] signature failed", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Handle program registration checkout
        const registrationId = session.metadata?.registrationId
        if (registrationId) {
          const reg = await getRegistrationBySession(session.id)
          if (reg) {
            reg.status = "paid"
            reg.paidAt = new Date().toISOString()
            await saveRegistration(reg)

            // Send confirmation email to parent
            const resendKeyParent = process.env.RESEND_API_KEY
            if (resendKeyParent) {
              await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: { Authorization: `Bearer ${resendKeyParent}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                  from: "PolyRISE Football <onboarding@resend.dev>",
                  to: [reg.email],
                  subject: `Registration Confirmed — ${reg.programName}`,
                  html: `
                    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
                      <h2 style="color:#dc2626;margin-bottom:4px">You're Registered!</h2>
                      <p style="color:#444;margin-top:0">Hi ${reg.parentName}, thank you for registering with PolyRISE Football. Here's a summary of your registration.</p>
                      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
                        <tr style="background:#f9fafb"><td style="padding:10px 12px;color:#555;width:140px">Program</td><td style="padding:10px 12px;font-weight:bold">${reg.programName}</td></tr>
                        <tr><td style="padding:10px 12px;color:#555">Amount Paid</td><td style="padding:10px 12px;font-weight:bold;color:#16a34a">$${reg.amount}${reg.billing === "monthly" ? "/month" : ""}</td></tr>
                        <tr style="background:#f9fafb"><td style="padding:10px 12px;color:#555">Athlete</td><td style="padding:10px 12px">${reg.playerName}${reg.playerPosition ? ` · ${reg.playerPosition}` : ""}${reg.playerGrade ? ` · Grade ${reg.playerGrade}` : ""}</td></tr>
                        <tr><td style="padding:10px 12px;color:#555">School</td><td style="padding:10px 12px">${reg.playerSchool || "—"}</td></tr>
                      </table>
                      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-top:20px">
                        <p style="margin:0;color:#444;font-size:13px">A PolyRISE staff member will follow up with program details, schedule, and next steps. If you have any questions in the meantime:</p>
                        <p style="margin:8px 0 0;color:#444;font-size:13px"><strong>(817) 658-3300</strong> · <strong>polyrise@polyrisefootball.com</strong></p>
                      </div>
                      <p style="color:#999;font-size:12px;margin-top:20px">PolyRISE Football · Dripping Springs, TX · polyrisefootball.com</p>
                    </div>
                  `,
                }),
              }).catch(err => console.error("[webhook] parent confirmation email failed", err))
            }

            // Notify PolyRISE of new registration
            const resendKey = process.env.RESEND_API_KEY
            if (resendKey) {
              await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                  from: "PolyRISE Registrations <onboarding@resend.dev>",
                  to: ["PolyRISE7v7@gmail.com"],
                  subject: `New Registration: ${reg.playerName} — ${reg.programName}`,
                  html: `
                    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
                      <h2 style="color:#dc2626;margin-bottom:4px">New Program Registration</h2>
                      <p style="color:#666;font-size:13px;margin-top:0">Paid via Stripe · ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
                        <tr style="background:#f9fafb"><td style="padding:10px 12px;color:#555;width:140px">Program</td><td style="padding:10px 12px;font-weight:bold">${reg.programName}</td></tr>
                        <tr><td style="padding:10px 12px;color:#555">Amount</td><td style="padding:10px 12px;font-weight:bold;color:#16a34a">$${reg.amount}${reg.billing === "monthly" ? "/mo" : ""}</td></tr>
                        <tr style="background:#f9fafb"><td style="padding:10px 12px;color:#555">Player</td><td style="padding:10px 12px">${reg.playerName}${reg.playerAge ? ` · Age ${reg.playerAge}` : ""}${reg.playerGrade ? ` · ${reg.playerGrade}` : ""}${reg.playerPosition ? ` · ${reg.playerPosition}` : ""}</td></tr>
                        <tr><td style="padding:10px 12px;color:#555">School</td><td style="padding:10px 12px">${reg.playerSchool || "—"}</td></tr>
                        <tr style="background:#f9fafb"><td style="padding:10px 12px;color:#555">Parent</td><td style="padding:10px 12px">${reg.parentName}</td></tr>
                        <tr><td style="padding:10px 12px;color:#555">Email</td><td style="padding:10px 12px">${reg.email}</td></tr>
                        <tr style="background:#f9fafb"><td style="padding:10px 12px;color:#555">Phone</td><td style="padding:10px 12px">${reg.phone}</td></tr>
                        ${reg.discountCode ? `<tr><td style="padding:10px 12px;color:#555">Discount</td><td style="padding:10px 12px;color:#d97706">${reg.discountCode}</td></tr>` : ""}
                      </table>
                      <p style="margin-top:20px"><a href="https://polyrisefootball.com/admin/registrations" style="background:#dc2626;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">View All Registrations →</a></p>
                      <p style="color:#999;font-size:12px;margin-top:16px">PolyRISE Football · polyrisefootball.com</p>
                    </div>
                  `,
                }),
              }).catch(err => console.error("[webhook] notify email failed", err))
            }
          }
          break
        }

        // Handle parent subscription checkout
        const email = session.metadata?.email
        const plan = session.metadata?.plan as "monthly" | "quarterly"
        if (!email) break
        const parent = await getParentByStripeCustomer(session.customer as string)
          ?? await getParent(email)
        if (parent) {
          parent.tier = plan ?? "monthly"
          parent.stripeSubscriptionId = session.subscription as string
          parent.subscriptionStatus = "active"
          await saveParent(parent)
        }
        break
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        const parent = await getParentByStripeCustomer(invoice.customer as string)
        if (parent) {
          parent.subscriptionStatus = "active"
          const sub = invoice.lines.data[0]
          if (sub?.period?.end) {
            parent.subscriptionEnd = new Date(sub.period.end * 1000).toISOString()
          }
          await saveParent(parent)
        }
        break
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const parent = await getParentByStripeCustomer(invoice.customer as string)
        if (parent) { parent.subscriptionStatus = "past_due"; await saveParent(parent) }
        break
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const parent = await getParentByStripeCustomer(sub.customer as string)
        if (parent) { parent.subscriptionStatus = "canceled"; parent.tier = "none"; await saveParent(parent) }
        break
      }
    }
  } catch (err) {
    console.error("[webhook] handler error", err)
  }

  return NextResponse.json({ received: true })
}
