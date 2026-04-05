import { NextResponse } from "next/server"

// POST /api/inquiry - Submit registration inquiry for AI agents
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      parentName,
      parentEmail,
      parentPhone,
      athleteName,
      athleteAge,
      athleteGrade,
      programInterest,
      city,
      state,
      message,
      source = "api",
    } = body

    // Validate required fields
    if (!parentName || !parentEmail || !athleteName) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: parentName, parentEmail, athleteName",
        },
        { status: 400 },
      )
    }

    // NOTE: This currently only logs the inquiry. To make this fully functional,
    // integrate with an email service to send to polyrise@polyrisefootball.com
    const inquiry = {
      id: `INQ-${Date.now()}`,
      timestamp: new Date().toISOString(),
      data: {
        parentName,
        parentEmail,
        parentPhone,
        athleteName,
        athleteAge,
        athleteGrade,
        programInterest,
        city,
        state,
        message,
        source,
      },
    }

    console.log("[v0] Inquiry received:", inquiry)

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
      message:
        "Your inquiry has been logged. To complete registration, please contact PolyRISE Football directly or register via TeamLinkt.",
      note: "This is a demo endpoint. For guaranteed response, use the contact methods below.",
      nextSteps: [
        "Call or text: 817-658-3300",
        "Email: polyrise@polyrisefootball.com",
        "WhatsApp: +1-817-658-3300",
        "Complete registration at: https://app.teamlinkt.com/register/find/polyrisefootball",
      ],
      contact: {
        phone: "817-658-3300",
        email: "polyrise@polyrisefootball.com",
        whatsapp: "+1-817-658-3300",
      },
      registrationUrl: "https://app.teamlinkt.com/register/find/polyrisefootball",
    })
  } catch (error) {
    console.error("[v0] Error processing inquiry:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process inquiry",
      },
      { status: 500 },
    )
  }
}

// GET /api/inquiry - Returns inquiry form schema for AI agents
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/inquiry",
    method: "POST",
    description: "Submit registration inquiry for PolyRISE Football programs",
    requiredFields: ["parentName", "parentEmail", "athleteName"],
    optionalFields: [
      "parentPhone",
      "athleteAge",
      "athleteGrade",
      "programInterest",
      "city",
      "state",
      "message",
      "source",
    ],
    schema: {
      parentName: "string - Full name of parent/guardian",
      parentEmail: "string - Email address for contact",
      parentPhone: "string - Phone number (optional)",
      athleteName: "string - Full name of athlete",
      athleteAge: "number - Age of athlete",
      athleteGrade: "string - Current grade (K-12)",
      programInterest: "string - Program ID (polyrise-select, 360-elite, winter-season)",
      city: "string - City of residence",
      state: "string - State of residence",
      message: "string - Additional questions or information",
      source: 'string - Source of inquiry (defaults to "api")',
    },
    example: {
      parentName: "John Smith",
      parentEmail: "john.smith@example.com",
      parentPhone: "512-555-0123",
      athleteName: "Mike Smith",
      athleteAge: 14,
      athleteGrade: "9th",
      programInterest: "360-elite",
      city: "Austin",
      state: "Texas",
      message: "Interested in elite training for high school athlete",
      source: "chatgpt",
    },
  })
}
