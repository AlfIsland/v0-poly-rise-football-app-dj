import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getParent, saveParent, getSessionEmail, PARENT_COOKIE } from "@/lib/parent-store"

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json() // "monthly" | "quarterly"
    const token = req.cookies.get(PARENT_COOKIE)?.value
    if (!token) return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 })

    const email = await getSessionEmail(token)
    if (!email) return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 })

    const parent = await getParent(email)
    if (!parent) return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 })

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) return NextResponse.json({ success: false, error: "Stripe not configured" }, { status: 500 })

    const stripe = new Stripe(secretKey)
    const priceId = plan === "quarterly"
      ? process.env.STRIPE_QUARTERLY_PRICE_ID
      : process.env.STRIPE_MONTHLY_PRICE_ID

    if (!priceId) return NextResponse.json({ success: false, error: "Price not configured" }, { status: 500 })

    const origin = req.nextUrl.origin

    // Create or reuse Stripe customer
    let customerId = parent.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({ email: parent.email, name: parent.name })
      customerId = customer.id
      parent.stripeCustomerId = customerId
      await saveParent(parent)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${origin}/parent/portal?success=1`,
      cancel_url: `${origin}/parent/subscribe?canceled=1`,
      metadata: { email: parent.email, plan },
    })

    return NextResponse.json({ success: true, url: session.url })
  } catch (err) {
    console.error("[stripe checkout]", err)
    return NextResponse.json({ success: false, error: "Failed to create checkout" }, { status: 500 })
  }
}
