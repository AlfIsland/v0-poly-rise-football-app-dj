import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.slice(0, 10) ?? "MISSING",
    hasMonthlyPrice: !!process.env.STRIPE_MONTHLY_PRICE_ID,
    hasQuarterlyPrice: !!process.env.STRIPE_QUARTERLY_PRICE_ID,
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
  })
}
