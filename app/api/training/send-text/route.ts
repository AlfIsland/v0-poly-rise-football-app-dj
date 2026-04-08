import { NextRequest, NextResponse } from "next/server"
import twilio from "twilio"

export async function POST(req: NextRequest) {
  const { phone, athleteName, id, sessionCount, improvement } = await req.json()

  if (!phone || !id) return NextResponse.json({ success: false, error: "Missing phone or id" }, { status: 400 })

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !fromNumber)
    return NextResponse.json({ success: false, error: "SMS not configured" }, { status: 500 })

  try {
    const client = twilio(accountSid, authToken)
    const improvementLine = improvement ? `\n\nTop improvement this month: ${improvement}` : ""
    await client.messages.create({
      body: `Hey ${athleteName}! Your PolyRISE Football monthly progress report is ready.\n\nYou now have ${sessionCount} test session${sessionCount !== 1 ? "s" : ""} on record.${improvementLine}\n\nKeep up the great work! 💪\n\n- Coach Jonathan | PolyRISE Football\n(817) 658-3300`,
      from: fromNumber,
      to: phone,
    })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
