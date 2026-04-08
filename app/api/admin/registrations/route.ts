import { NextResponse } from "next/server"
import { getAllRegistrations } from "@/lib/registration-store"

export async function GET() {
  try {
    const registrations = await getAllRegistrations()
    return NextResponse.json({ success: true, registrations })
  } catch (err) {
    console.error("[admin/registrations]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}
