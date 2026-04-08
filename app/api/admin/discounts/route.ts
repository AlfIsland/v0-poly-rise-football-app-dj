import { NextRequest, NextResponse } from "next/server"
import { getAllDiscounts, saveDiscount, getDiscount, DiscountCode } from "@/lib/discount-store"

export async function GET() {
  try {
    const discounts = await getAllDiscounts()
    return NextResponse.json({ success: true, discounts })
  } catch (err) {
    console.error("[admin/discounts GET]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, type, value, maxUses, expiresAt, note } = await req.json()
    if (!code || !type || !value)
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 })

    const existing = await getDiscount(code)
    if (existing)
      return NextResponse.json({ success: false, error: "Code already exists" }, { status: 409 })

    const discount: DiscountCode = {
      code: code.toUpperCase().trim(),
      type, value: Number(value),
      maxUses: Number(maxUses) || 0,
      usedCount: 0,
      expiresAt: expiresAt || undefined,
      active: true,
      note: note || "",
      createdAt: new Date().toISOString(),
    }
    await saveDiscount(discount)
    return NextResponse.json({ success: true, discount })
  } catch (err) {
    console.error("[admin/discounts POST]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { code, active } = await req.json()
    const discount = await getDiscount(code)
    if (!discount) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
    discount.active = active
    await saveDiscount(discount)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[admin/discounts PATCH]", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}
