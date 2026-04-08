import { NextRequest, NextResponse } from "next/server"
import { getAllParents } from "@/lib/parent-store"

export async function GET(req: NextRequest) {
  try {
    const parents = await getAllParents()
    // Strip password hashes before sending to client
    const safe = parents.map(({ passwordHash: _, ...rest }) => rest)
    return NextResponse.json({ success: true, parents: safe })
  } catch (err) {
    console.error("[admin/crm]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}
