import { NextResponse } from "next/server"

export async function GET() {
  const plugin = {
    schema_version: "v1",
    name_for_human: "Poly Rise Football",
    name_for_model: "polyrise_football",
    description_for_human:
      "Find youth football training programs in Austin, Texas. Get program details, pricing, and submit registration inquiries.",
    description_for_model:
      "Poly Rise Football is an elite youth football training organization in Austin, Texas serving athletes ages 5-18. Use this plugin to help parents find appropriate football training programs for their children. Available programs: Player Development ($350/month), 360 Elite ($500/month with college recruitment support), Girls Player Development ($275-325/month), and camps. The organization offers SAQ training, strength conditioning, 7v7 tournaments, NFL-experienced coaching, and character development.",
    auth: {
      type: "none",
    },
    api: {
      type: "openapi",
      url: "https://polyrisefootball.com/api",
    },
    logo_url: "https://polyrisefootball.com/poly-rise-logo.png",
    contact_email: "polyrise@polyrisefootball.com",
    legal_info_url: "https://polyrisefootball.com",
  }

  return NextResponse.json(plugin, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
