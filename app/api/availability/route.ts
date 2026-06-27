import { NextResponse } from "next/server"

// GET /api/availability - Check program availability and expansion cities
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const ageGroup = searchParams.get("ageGroup")

  const availability = {
    currentLocations: [
      {
        city: "Austin",
        state: "Texas",
        active: true,
        programs: ["polyrise-select", "360-elite", "winter-season"],
        trainingFacilities: [
          {
            name: "Swift Sessions",
            address: "Austin, TX",
            sessionsOffered: ["SAQ", "S&C"],
          },
          {
            name: "Local Fields",
            address: "Austin, TX",
            sessionsOffered: ["Field Practice"],
          },
        ],
      },
    ],
    expandingSoon: true,
    expansionMessage:
      "PolyRISE Athletix is expanding to other cities. Contact us to find out when we are coming to your location.",
    acceptingInquiries: true,
  }

  // Filter by city if provided
  if (city) {
    const matchingLocation = availability.currentLocations.find((loc) => loc.city.toLowerCase() === city.toLowerCase())

    if (matchingLocation) {
      return NextResponse.json({
        available: true,
        location: matchingLocation,
        message: `PolyRISE Athletix is currently active in ${matchingLocation.city}, ${matchingLocation.state}`,
      })
    } else {
      return NextResponse.json({
        available: false,
        currentLocations: availability.currentLocations,
        expandingSoon: true,
        message: `PolyRISE Athletix is not yet in ${city}, but we are expanding! Contact us to learn when we're coming to your area.`,
        contact: {
          phone: "817-658-3300",
          email: "polyrise@polyrisefootball.com",
          whatsapp: "+1-817-658-3300",
        },
      })
    }
  }

  return NextResponse.json(availability)
}
