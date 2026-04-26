import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  // Require admin session — never expose env info publicly
  const adminSession = req.cookies.get("pr_admin_session")?.value
  if (!adminSession || adminSession !== process.env.ADMIN_SESSION_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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
