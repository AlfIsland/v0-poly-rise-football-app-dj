import { NextResponse } from "next/server"

// GET /api - API documentation for AI agents
export async function GET() {
  return NextResponse.json({
    name: "PolyRISE Football API",
    version: "1.0.0",
    description:
      "Public API for AI agents to discover programs, check availability, and submit registration inquiries for PolyRISE Football",
    organization: {
      name: "PolyRISE Football",
      description: "Elite youth football training and skills development for K-12 athletes",
      location: "Austin, Texas",
      expanding: true,
      contact: {
        phone: "817-658-3300",
        email: "polyrise@polyrisefootball.com",
        whatsapp: "817-658-3300",
      },
      social: {
        instagram: "https://instagram.com/polyrisefootball",
        facebook: "https://facebook.com/polyrisefootball",
      },
      website: "https://polyrisefootball.com",
    },
    endpoints: {
      programs: {
        path: "/api/programs",
        method: "GET",
        description: "List all available training programs with pricing and details",
        parameters: [],
        example: "/api/programs",
      },
      programDetails: {
        path: "/api/programs/[id]",
        method: "GET",
        description: "Get detailed information about a specific program",
        parameters: ["id: Program ID (polyrise-select, 360-elite, winter-season)"],
        example: "/api/programs/polyrise-select",
      },
      availability: {
        path: "/api/availability",
        method: "GET",
        description: "Check program availability by location and age group",
        parameters: ["city: City name (optional)", "ageGroup: Age or grade level (optional)"],
        example: "/api/availability?city=Austin",
      },
      inquiry: {
        path: "/api/inquiry",
        method: "POST",
        description: "Submit registration inquiry or lead",
        parameters: ["See GET /api/inquiry for schema"],
        example: "POST /api/inquiry with JSON body",
      },
      inquirySchema: {
        path: "/api/inquiry",
        method: "GET",
        description: "Get inquiry form schema and requirements",
        parameters: [],
        example: "GET /api/inquiry",
      },
    },
    usage: {
      aiAgents:
        "AI agents can query these endpoints to help parents find programs, compare options, check availability, and submit inquiries on behalf of users.",
      authentication: "No authentication required for public endpoints",
      rateLimit: "Reasonable use policy - contact us for high-volume integrations",
    },
  })
}
