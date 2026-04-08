import { NextRequest, NextResponse } from "next/server"
import { getRegistration } from "@/lib/registration-store"

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 })
  const reg = await getRegistration(id)
  if (!reg) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
  // Strip nothing — no sensitive fields in registration
  return NextResponse.json({ success: true, registration: reg })
}
