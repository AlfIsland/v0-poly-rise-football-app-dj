import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getRegistration, saveRegistration } from "@/lib/registration-store"
import { PROGRAMS } from "../checkout/route"

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 })

    const reg = await getRegistration(id)
    if (!reg) return NextResponse.json({ success: false, error: "Registration not found" }, { status: 404 })

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) return NextResponse.json({ success: false, error: "Stripe not configured" }, { status: 500 })

    const allIds = reg.program.split(",")
    const oneTimeItems = allIds.map(pid => ({ id: pid, ...PROGRAMS[pid] }))
      .filter(p => p.name && p.billing === "one_time")

    if (!oneTimeItems.length) {
      // Nothing left to charge — go straight to success
      return NextResponse.json({ success: true, url: null })
    }

    const stripe = new Stripe(secretKey)
    const origin = req.nextUrl.origin

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: oneTimeItems.map(p => ({
        price_data: {
          currency: "usd",
          product_data: { name: p.name },
          unit_amount: p.price * 100,
        },
        quantity: 1,
      })),
      mode: "payment",
      success_url: `${origin}/register/success?id=${id}`,
      cancel_url: `${origin}/register?canceled=1`,
      customer_email: reg.email,
      metadata: { registrationId: id },
    })

    reg.status = "paid" // monthly part already paid
    await saveRegistration(reg)

    return NextResponse.json({ success: true, url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed"
    console.error("[checkout-remaining]", err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
