import { NextRequest, NextResponse } from "next/server"
import twilio from "twilio"

export async function POST(req: NextRequest) {
  const { phone, athleteName, code } = await req.json()

  if (!phone || !code) {
    return NextResponse.json({ success: false, error: "Missing phone or code" }, { status: 400 })
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !fromNumber) {
    return NextResponse.json({ success: false, error: "SMS not configured" }, { status: 500 })
  }

  try {
    const client = twilio(accountSid, authToken)
    await client.messages.create({
      body: `Congrats ${athleteName}! Your PR-VERIFIED seal from PolyRISE Football is ready. View your official recruiting profile here:\n\nhttps://polyrisefootball.com/verify/${code}\n\nShare this link with coaches and recruiters.\n\n- Coach Jonathan | PolyRISE Football`,
      from: fromNumber,
      to: phone,
    })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error("[send-text]", err)
    const message = err instanceof Error ? err.message : "Failed to send text"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
