import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { saveRegistration, Registration } from "@/lib/registration-store"
import { getDiscount, validateDiscount, incrementUsage } from "@/lib/discount-store"

export const PROGRAMS: Record<string, { name: string; price: number; billing: "one_time" | "monthly" }> = {
  // Football Player Development tiers
  "player-dev":              { name: "Football Player Development — Monthly",           price: 325,  billing: "monthly"  },
  "player-dev-6mo":          { name: "Football Player Development — 6-Month",          price: 280,  billing: "monthly"  },
  "player-dev-annual":       { name: "Football Player Development — Annual",           price: 250,  billing: "monthly"  },
  "player-dev-1day":         { name: "Football Player Development — Once a Week",      price: 175,  billing: "monthly"  },
  // Multi-Sport Development
  "multi-sport-dev":         { name: "Multi-Sport Development",                         price: 265,   billing: "monthly"  },
  // Girls Player Development
  "girls-dev":               { name: "Girls Player Development — 2 Days/Week",         price: 250,   billing: "monthly"  },
  "girls-dev-3day":          { name: "Girls Player Development — 3 Days/Week",         price: 315,   billing: "monthly"  },
  // Multi-Sport Athlete
  "multi-sport":             { name: "Multi-Sport Athlete",                             price: 175,   billing: "monthly"  },
  // Drop-In Training
  "drop-in-1day":            { name: "Drop-In Training — 1 Day",                       price: 45,    billing: "one_time" },
  "drop-in-2day":            { name: "Drop-In Training — 2 Days",                      price: 80,    billing: "one_time" },
  // HS Recruiting & Exposure
  "hs-recruiting-elite":     { name: "HS Recruiting — Elite Exposure",                 price: 150,   billing: "monthly"  },
  "hs-recruiting-pro":       { name: "HS Recruiting — Pro Exposure",                   price: 125,   billing: "monthly"  },
  "hs-recruiting-basic":     { name: "HS Recruiting — Basic Exposure",                 price: 85,    billing: "monthly"  },
  // Summer / Athletic Camp
  "summer-ms":               { name: "Athletic Camp",                                  price: 265,   billing: "monthly"  },
  // Events
  "combine":                 { name: "Combine Metrics Camp",                           price: 25,    billing: "one_time" },
  "tackling-camp":           { name: "Tackling Camp",                                  price: 25,    billing: "one_time" },
  "hike":                    { name: "Leadership & Mentorship Hike",                   price: 25,    billing: "one_time" },
  // Athlete Tracking & Recruiting Profiles
  "passport":                { name: "Passport",                                        price: 9.99,  billing: "monthly"  },
  "recruit":                 { name: "Recruit",                                         price: 29.99, billing: "monthly"  },
  "elite-recruit":           { name: "Elite Recruit",                                   price: 49.99, billing: "monthly"  },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { programIds, playerName, playerAge, playerGrade, playerSchool, playerPosition, parentName, email, phone, discountCode, billingMonth, recruitingMonths } = body

    const ids: string[] = programIds ?? (body.programId ? [body.programId] : [])
    if (!ids.length || !playerName || !parentName || !email || !phone)
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })

    const programs = ids.map(id => ({ id, ...PROGRAMS[id] })).filter(p => p.name)
    if (!programs.length) return NextResponse.json({ success: false, error: "Invalid program(s)" }, { status: 400 })

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) return NextResponse.json({ success: false, error: "Stripe not configured" }, { status: 500 })

    // Validate and apply discount
    let discountMultiplier = 1
    let discountFixed = 0
    let appliedCode: string | undefined
    if (discountCode) {
      const discount = await getDiscount(discountCode)
      if (discount) {
        const { valid } = validateDiscount(discount)
        if (valid) {
          appliedCode = discount.code
          if (discount.type === "percent") discountMultiplier = 1 - discount.value / 100
          else discountFixed = discount.value
        }
      }
    }

    const applyPrice = (price: number) => Math.max(1, Math.round((price * discountMultiplier) - discountFixed / programs.length))

    const stripe = new Stripe(secretKey)
    const origin = req.nextUrl.origin
    const regId = crypto.randomUUID()
    const totalAmount = programs.reduce((sum, p) => sum + applyPrice(p.price), 0)

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
      discountCode: appliedCode,
      billing: monthlyItems.length > 0 ? "monthly" : "one_time",
      billingMonth: billingMonth || undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    }
    await saveRegistration(reg)

    let session: Stripe.Checkout.Session

    if (isMixed) {
      // Mixed cart: Stripe doesn't allow mixing subscription + one-time in one session.
      // Charge everything as a single payment (first month + one-time fees).
      // Admin is notified to set up ongoing monthly billing in Stripe dashboard.
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          ...monthlyItems.map(p => ({
            price_data: {
              currency: "usd",
              product_data: { name: `${p.name} — 1st Month` },
              unit_amount: Math.round(applyPrice(p.price) * 100),
            },
            quantity: 1,
          })),
          ...oneTimeItems.map(p => ({
            price_data: {
              currency: "usd",
              product_data: { name: p.name },
              unit_amount: Math.round(applyPrice(p.price) * 100),
            },
            quantity: 1,
          })),
        ],
        mode: "payment",
        success_url: `${origin}/register/success?id=${regId}`,
        cancel_url: `${origin}/register?canceled=1`,
        customer_email: email,
        metadata: { registrationId: regId, requiresMonthlySetup: "true", monthlyItems: monthlyItems.map(p => `${p.name} $${p.price}/mo`).join(", "), ...(billingMonth ? { billingMonth } : {}) },
      })
    } else if (monthlyItems.length > 0) {
      // Only monthly items — use subscription mode for automatic recurring billing
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: monthlyItems.map(p => ({
          price_data: {
            currency: "usd",
            product_data: { name: p.name },
            unit_amount: Math.round(applyPrice(p.price) * 100),
            recurring: { interval: "month" },
          },
          quantity: 1,
        })),
        mode: "subscription",
        subscription_data: {
          metadata: {
            ...(recruitingMonths ? { recruitingMonths: String(recruitingMonths) } : {}),
          },
        },
        success_url: `${origin}/register/success?id=${regId}`,
        cancel_url: `${origin}/register?canceled=1`,
        customer_email: email,
        metadata: { registrationId: regId, ...(billingMonth ? { billingMonth } : {}), ...(recruitingMonths ? { recruitingMonths: String(recruitingMonths) } : {}) },
      })
    } else {
      // Only one-time items
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: oneTimeItems.map(p => ({
          price_data: {
            currency: "usd",
            product_data: { name: p.name },
            unit_amount: Math.round(applyPrice(p.price) * 100),
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
    if (appliedCode) await incrementUsage(appliedCode)
    await saveRegistration(reg)

    return NextResponse.json({ success: true, url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create checkout"
    console.error("[register checkout]", err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
