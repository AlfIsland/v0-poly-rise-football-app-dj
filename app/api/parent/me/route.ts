import { NextRequest, NextResponse } from "next/server"
import { getParent, getSessionEmail, PARENT_COOKIE } from "@/lib/parent-store"
import { getRedis } from "@/lib/parent-store"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(PARENT_COOKIE)?.value
    if (!token) return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 })

    const email = await getSessionEmail(token)
    if (!email) return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 })

    const parent = await getParent(email)
    if (!parent) return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 })

    // Fetch linked athletes
    const athletes = []
    if (parent.athleteIds.length) {
      const r = getRedis()
      if (r) {
        const values = await r.mget(...parent.athleteIds.map(id => `training:athlete:${id.toUpperCase()}`))
        for (const v of values) {
          if (v) athletes.push(JSON.parse(v))
        }
      }
    }

    return NextResponse.json({
      success: true,
      parent: {
        email: parent.email,
        name: parent.name,
        tier: parent.tier,
        subscriptionStatus: parent.subscriptionStatus,
        subscriptionEnd: parent.subscriptionEnd,
        athleteIds: parent.athleteIds,
      },
      athletes,
    })
  } catch (err) {
    console.error("[parent me]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}

// PATCH — admin links athlete to parent or updates tier
export async function PATCH(req: NextRequest) {
  try {
    const { email, athleteId, tier, action } = await req.json()
    if (!email) return NextResponse.json({ success: false, error: "Missing email" }, { status: 400 })

    const parent = await getParent(email)
    if (!parent) return NextResponse.json({ success: false, error: "Parent not found" }, { status: 404 })

    if (action === "link-athlete" && athleteId) {
      if (!parent.athleteIds.includes(athleteId)) parent.athleteIds.push(athleteId)
    }
    if (action === "unlink-athlete" && athleteId) {
      parent.athleteIds = parent.athleteIds.filter(id => id !== athleteId)
    }
    if (tier) parent.tier = tier

    const { saveParent } = await import("@/lib/parent-store")
    await saveParent(parent)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[parent PATCH]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}
