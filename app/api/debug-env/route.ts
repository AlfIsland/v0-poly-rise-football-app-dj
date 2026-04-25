import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.slice(0, 10) ?? "MISSING",
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_MONTHLY_PRICE_ID: process.env.STRIPE_MONTHLY_PRICE_ID ?? "MISSING",
    STRIPE_RECRUIT_PRICE_ID: process.env.STRIPE_RECRUIT_PRICE_ID ?? "MISSING",
    STRIPE_ELITE_RECRUIT_PRICE_ID: process.env.STRIPE_ELITE_RECRUIT_PRICE_ID ?? "MISSING",
    STRIPE_QUARTERLY_PRICE_ID: process.env.STRIPE_QUARTERLY_PRICE_ID ?? "MISSING",
  })
}
