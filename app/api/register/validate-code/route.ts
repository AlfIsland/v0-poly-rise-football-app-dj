import { NextRequest, NextResponse } from "next/server"
import { getDiscount, validateDiscount } from "@/lib/discount-store"

export async function POST(req: NextRequest) {
  try {
    const { code, amount } = await req.json()
    if (!code) return NextResponse.json({ valid: false, error: "No code entered" })

    const discount = await getDiscount(code.trim())
    if (!discount) return NextResponse.json({ valid: false, error: "Invalid discount code" })

    const { valid, error } = validateDiscount(discount)
    if (!valid) return NextResponse.json({ valid: false, error })

    const savings = discount.type === "percent"
      ? Math.round(amount * (discount.value / 100))
      : Math.min(discount.value, amount)

    return NextResponse.json({
      valid: true,
      code: discount.code,
      type: discount.type,
      value: discount.value,
      savings,
      label: discount.type === "percent" ? `${discount.value}% off` : `$${discount.value} off`,
    })
  } catch (err) {
    console.error("[validate-code]", err)
    return NextResponse.json({ valid: false, error: "Failed to validate" })
  }
}
