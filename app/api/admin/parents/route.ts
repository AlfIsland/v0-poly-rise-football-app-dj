import { NextRequest, NextResponse } from "next/server"
import { getAllParents, getParent, saveParent } from "@/lib/parent-store"

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("pr_admin_session")?.value
  return !!session && !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN
}

// GET /api/admin/parents — list all parent accounts
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  try {
    const parents = await getAllParents()
    return NextResponse.json({ success: true, parents })
  } catch (err) {
    console.error("[admin parents GET]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}

// PATCH /api/admin/parents — link or unlink athlete to parent
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  try {
    const { email, action, athleteId } = await req.json()
    if (!email || !action) return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 })

    const parent = await getParent(email)
    if (!parent) return NextResponse.json({ success: false, error: "Parent not found" }, { status: 404 })

    if (action === "link") {
      if (!athleteId) return NextResponse.json({ success: false, error: "Missing athleteId" }, { status: 400 })
      if (!parent.athleteIds.includes(athleteId)) parent.athleteIds.push(athleteId)
    } else if (action === "unlink") {
      if (!athleteId) return NextResponse.json({ success: false, error: "Missing athleteId" }, { status: 400 })
      parent.athleteIds = parent.athleteIds.filter(id => id !== athleteId)
    } else {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }

    await saveParent(parent)
    return NextResponse.json({ success: true, athleteIds: parent.athleteIds })
  } catch (err) {
    console.error("[admin parents PATCH]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}
