import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    ADMIN_PASSWORD_set: !!process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_TOKEN_set: !!process.env.ADMIN_SESSION_TOKEN,
    REDIS_URL_set: !!process.env.REDIS_URL,
  })
}
