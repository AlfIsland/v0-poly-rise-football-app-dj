import { NextResponse } from "next/server"

// GET /api/programs - Returns all available programs with structured data
export async function GET() {
  const programs = [
    {
      id: "polyrise-select",
      name: "PolyRISE Select",
      type: "Monthly Training Program",
      price: {
        amount: 400,
        currency: "USD",
        frequency: "monthly",
      },
      description:
        "Comprehensive training program with 16 sessions monthly including SAQ, S&C, football drills, tournament entries, film study, and quarterly military character building events.",
      features: [
        "16 training sessions per month (4 per week)",
        "Complete PolyRISE gear package (tee, shorts, gloves, headband, hoodie)",
        "Speed, Agility, Quickness (SAQ) training",
        "Strength & Conditioning (S&C) training",
        "Football fundamentals and advanced drills",
        "Local & regional 7v7 tournament entries",
        "Film study sessions",
        "Quarterly military character building events",
        "3 free PolyRISE camps annually",
      ],
      schedule: {
        frequency: "4 sessions per week",
        sessions: [
          { day: "Tuesday", time: "6:00 PM", type: "S&C", location: "Swift Sessions" },
          { day: "Wednesday", time: "6:00 PM", type: "SAQ", location: "Swift Sessions" },
          { day: "Saturday", time: "9:00 AM", type: "Field Practice", location: "Local Field" },
          { day: "Sunday", time: "3:00 PM", type: "Field Practice", location: "Local Field" },
        ],
        currentSeason: "January-February 2026",
        startDate: "2026-01-06",
      },
      ageGroups: ["K-12", "Youth", "Middle School", "High School"],
      registrationUrl: "https://app.teamlinkt.com/register/find/polyrisefootball",
      available: true,
    },
    {
      id: "360-elite",
      name: "360 Elite",
      type: "Premium Training Program",
      price: {
        amount: 750,
        currency: "USD",
        frequency: "monthly",
      },
      description:
        "Elite program with everything in PolyRISE Select plus one-on-one coaching from NFL experience staff, weekly film study, unlimited camps, and exclusive development opportunities.",
      features: [
        "Everything included in PolyRISE Select",
        "One-on-one coaching from NFL experience staff",
        "Weekly film study (vs quarterly in Select)",
        "Unlimited free PolyRISE camps (vs 3 per year)",
        "Monthly military character building events (vs quarterly)",
        "Yearly college visits and recruitment guidance",
        "NIL (Name, Image, Likeness) education classes",
        "Financial literacy classes",
        "Discounts at affiliated sports medicine shops",
        "Discounts at affiliated nutrition shops",
      ],
      schedule: {
        frequency: "4 sessions per week plus individual coaching",
        sessions: [
          { day: "Tuesday", time: "6:00 PM", type: "S&C", location: "Swift Sessions" },
          { day: "Wednesday", time: "6:00 PM", type: "SAQ", location: "Swift Sessions" },
          { day: "Saturday", time: "9:00 AM", type: "Field Practice", location: "Local Field" },
          { day: "Sunday", time: "3:00 PM", type: "Field Practice", location: "Local Field" },
          { day: "Flexible", time: "By appointment", type: "1-on-1 Coaching", location: "Various" },
        ],
        currentSeason: "January-February 2026",
        startDate: "2026-01-06",
      },
      ageGroups: ["K-12", "Youth", "Middle School", "High School"],
      registrationUrl: "https://app.teamlinkt.com/register/find/polyrisefootball",
      available: true,
      recommended: true,
    },
    {
      id: "winter-season",
      name: "Winter Season",
      type: "Seasonal Program",
      description:
        "PolyRISE 7v7 winter season program with competitive team play and tournament opportunities throughout the winter months.",
      features: [
        "7v7 competitive team play",
        "Multiple tournament opportunities",
        "Team training sessions",
        "Game strategy and film review",
        "Seasonal roster placement",
      ],
      schedule: {
        currentSeason: "Winter 2026",
        startDate: "2026-01-06",
      },
      ageGroups: ["K-12", "Youth", "Middle School", "High School"],
      registrationUrl: "https://app.teamlinkt.com/register/find/polyrisefootball",
      available: true,
      contactForPricing: true,
    },
  ]

  return NextResponse.json(
    {
      organization: "Poly Rise Football",
      location: "Austin, Texas",
      expanding: true,
      programs: programs,
      contact: {
        phone: "817-658-3300",
        email: "polyrise@polyrisefootball.com",
        whatsapp: "+1-817-658-3300",
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  )
}
