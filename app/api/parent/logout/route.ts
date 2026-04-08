import { NextRequest, NextResponse } from "next/server"
import { deleteSession, PARENT_COOKIE } from "@/lib/parent-store"

export async function POST(req: NextRequest) {
  const token = req.cookies.get(PARENT_COOKIE)?.value
  if (token) await deleteSession(token)
  const res = NextResponse.json({ success: true })
  res.cookies.set(PARENT_COOKIE, "", { maxAge: 0, path: "/" })
  return res
}
