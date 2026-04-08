import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { saveRegistration, Registration } from "@/lib/registration-store"

export const PROGRAMS: Record<string, { name: string; price: number; billing: "one_time" | "monthly" }> = {
  "player-dev":           { name: "Player Development",                      price: 350, billing: "monthly" },
  "elite-360":            { name: "360 Elite",                               price: 500, billing: "monthly" },
  "girls-dev":            { name: "Girls Player Development",                price: 250, billing: "monthly" },
  "summer-k5":            { name: "Summer Camp (Elementary K-5)",            price: 265, billing: "one_time" },
  "summer-ms":            { name: "Summer Camp (Middle School)",             price: 265, billing: "one_time" },
  "summer-hs":            { name: "Summer Camp (High School)",               price: 265, billing: "one_time" },
  "combine":              { name: "PR-VERIFIED Combine Camp",                price: 50,  billing: "one_time" },
  "hike":                 { name: "Leadership Hike",                         price: 25,  billing: "one_time" },
  "tournament-ms":        { name: "Football Tournament (Middle School)",     price: 400, billing: "one_time" },
  "tournament-hs":        { name: "Football Tournament (High School)",       price: 425, billing: "one_time" },
  "exposure-basic-3":     { name: "Basic Exposure Package (3 months)",       price: 165, billing: "one_time" },
  "exposure-basic-6":     { name: "Basic Exposure Package (6 months)",       price: 330, billing: "one_time" },
  "exposure-basic-12":    { name: "Basic Exposure Package (12 months)",      price: 660, billing: "one_time" },
  "exposure-enhanced-3":  { name: "Enhanced Exposure Package (3 months)",    price: 225, billing: "one_time" },
  "exposure-enhanced-6":  { name: "Enhanced Exposure Package (6 months)",    price: 450, billing: "one_time" },
  "exposure-enhanced-12": { name: "Enhanced Exposure Package (12 months)",   price: 900, billing: "one_time" },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { programIds, playerName, playerAge, playerGrade, playerSchool, playerPosition, parentName, email, phone } = body

    const ids: string[] = programIds ?? (body.programId ? [body.programId] : [])
    if (!ids.length || !playerName || !parentName || !email || !phone)
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })

    const programs = ids.map(id => ({ id, ...PROGRAMS[id] })).filter(p => p.name)
    if (!programs.length) return NextResponse.json({ success: false, error: "Invalid program(s)" }, { status: 400 })

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) return NextResponse.json({ success: false, error: "Stripe not configured" }, { status: 500 })

    const stripe = new Stripe(secretKey)
    const origin = req.nextUrl.origin
    const regId = crypto.randomUUID()
    const totalAmount = programs.reduce((sum, p) => sum + p.price, 0)

    const monthlyItems = programs.filter(p => p.billing === "monthly")
    const oneTimeItems = programs.filter(p => p.billing === "one_time")
    const isMixed = monthlyItems.length > 0 && oneTimeItems.length > 0

    // Save one registration record for all items
    const reg: Registration = {
      id: regId,
      program: ids.join(","),
      programName: programs.map(p => p.name).join(", "),
      playerName, playerAge, playerGrade, playerSchool, playerPosition,
      parentName, email, phone,
      amount: totalAmount,
      billing: monthlyItems.length > 0 ? "monthly" : "one_time",
      status: "pending",
      createdAt: new Date().toISOString(),
    }
    await saveRegistration(reg)

    let session: Stripe.Checkout.Session

    if (isMixed) {
      // Mixed cart: charge monthly items first, then redirect to one-time payment
      // success_url takes them to an intermediate page that triggers the one-time checkout
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: monthlyItems.map(p => ({
          price_data: {
            currency: "usd",
            product_data: { name: p.name },
            unit_amount: p.price * 100,
            recurring: { interval: "month" },
          },
          quantity: 1,
        })),
        mode: "subscription",
        success_url: `${origin}/register/pay-remaining?id=${regId}`,
        cancel_url: `${origin}/register?canceled=1`,
        customer_email: email,
        metadata: { registrationId: regId },
      })
    } else if (monthlyItems.length > 0) {
      // Only monthly items
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: monthlyItems.map(p => ({
          price_data: {
            currency: "usd",
            product_data: { name: p.name },
            unit_amount: p.price * 100,
            recurring: { interval: "month" },
          },
          quantity: 1,
        })),
        mode: "subscription",
        success_url: `${origin}/register/success?id=${regId}`,
        cancel_url: `${origin}/register?canceled=1`,
        customer_email: email,
        metadata: { registrationId: regId },
      })
    } else {
      // Only one-time items
      session = await stripe.checkout.sessions.create({
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
        success_url: `${origin}/register/success?id=${regId}`,
        cancel_url: `${origin}/register?canceled=1`,
        customer_email: email,
        metadata: { registrationId: regId },
      })
    }

    reg.stripeSessionId = session.id
    await saveRegistration(reg)

    return NextResponse.json({ success: true, url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create checkout"
    console.error("[register checkout]", err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
