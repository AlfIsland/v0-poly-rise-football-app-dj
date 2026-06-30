import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getRegistration } from "@/lib/registration-store"

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 })

    const reg = await getRegistration(id)
    if (!reg || !reg.stripeSessionId)
      return NextResponse.json({ success: false, error: "Registration not found" }, { status: 404 })

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) return NextResponse.json({ success: false, error: "Stripe not configured" }, { status: 500 })

    const stripe = new Stripe(secretKey)

    // Retrieve the completed checkout session to get the subscription ID
    const session = await stripe.checkout.sessions.retrieve(reg.stripeSessionId)
    if (!session.subscription) return NextResponse.json({ success: true, note: "No subscription found" })

    const subscriptionId = typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id

    // Get cancelMonths from session metadata (covers player dev commitments + recruiting picker)
    const cancelMonths = session.metadata?.cancelMonths
      ? Number(session.metadata.cancelMonths)
      : null

    if (!cancelMonths) return NextResponse.json({ success: true, note: "No commitment period set" })

    // Calculate cancel_at date
    const cancelAt = new Date()
    cancelAt.setMonth(cancelAt.getMonth() + cancelMonths)
    const cancelAtTimestamp = Math.floor(cancelAt.getTime() / 1000)

    // Update subscription with cancel_at
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at: cancelAtTimestamp,
    })

    return NextResponse.json({ success: true, cancelAt: cancelAt.toISOString(), months: cancelMonths })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed"
    console.error("[finalize-subscription]", err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
