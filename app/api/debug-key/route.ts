import { NextResponse } from "next/server"

export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return NextResponse.json({ status: "NOT SET" })
  return NextResponse.json({
    status: "SET",
    length: key.length,
    prefix: key.substring(0, 12),
    suffix: key.substring(key.length - 4),
  })
}
