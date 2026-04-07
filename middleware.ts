import { NextRequest, NextResponse } from "next/server"

const ADMIN_PREFIX = "/admin"
const TRAINING_PREFIX = "/training"
const LOGIN_PATH = "/admin/login"
const COOKIE_NAME = "pr_admin_session"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /admin routes (not /admin/login itself)
  if ((!pathname.startsWith(ADMIN_PREFIX) && !pathname.startsWith(TRAINING_PREFIX)) || pathname === LOGIN_PATH) {
    return NextResponse.next()
  }

  const session = req.cookies.get(COOKIE_NAME)?.value
  const validToken = process.env.ADMIN_SESSION_TOKEN

  if (!session || !validToken || session !== validToken) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = LOGIN_PATH
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/training/:path*"],
}
