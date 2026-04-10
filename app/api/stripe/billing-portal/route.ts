import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getParent, getSessionEmail, PARENT_COOKIE } from "@/lib/parent-store"

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(PARENT_COOKIE)?.value
    if (!token) return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 })
    const email = await getSessionEmail(token)
    if (!email) return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 })
    const parent = await getParent(email)
    if (!parent?.stripeCustomerId) return NextResponse.json({ success: false, error: "No subscription found" }, { status: 404 })

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.billingPortal.sessions.create({
      customer: parent.stripeCustomerId,
      return_url: `${req.nextUrl.origin}/parent/portal`,
    })
    return NextResponse.json({ success: true, url: session.url })
  } catch (err) {
    console.error("[billing portal]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}
