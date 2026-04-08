import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getParentByStripeCustomer, saveParent } from "@/lib/parent-store"

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
        const email = session.metadata?.email
        const plan = session.metadata?.plan as "monthly" | "quarterly"
        if (!email) break
        const parent = await getParentByStripeCustomer(session.customer as string)
          ?? (await import("@/lib/parent-store")).then(m => m.getParent(email))
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
          // Set end date based on period end
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
