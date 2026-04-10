import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getParent, saveParent, createSession, PARENT_COOKIE, SESSION_MAX_AGE } from "@/lib/parent-store"

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone, athleteName } = await req.json()
    if (!email || !password || !name)
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })

    const existing = await getParent(email)
    if (existing)
      return NextResponse.json({ success: false, error: "An account with this email already exists" }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 10)
    await saveParent({
      email: email.toLowerCase(),
      passwordHash,
      name,
      phone: phone || "",
      athleteName: athleteName || "",
      athleteIds: [],
      tier: "none",
      createdAt: new Date().toISOString(),
    })

    // Notify admin of new parent signup
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "PolyRISE Football <onboarding@resend.dev>",
          to: ["PolyRISE7v7@gmail.com"],
          subject: `New Parent Account — ${name}`,
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#0a0a0f;color:#fff">
              <h2 style="color:#dc2626">New Parent Account Created</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "—"}</p>
              <p><strong>Athlete Name:</strong> ${athleteName || "—"}</p>
              <p><strong>Signed up:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin-top:16px">
                <strong>Action needed:</strong> Go to your admin panel to link their athlete once they subscribe.
              </p>
              <p style="color:#999;font-size:12px;margin-top:16px">PolyRISE Football · polyrisefootball.com/admin/parents</p>
            </div>
          `,
        }),
      }).catch(err => console.error("[register notify]", err))
    }

    const token = await createSession(email)
    const res = NextResponse.json({ success: true })
    res.cookies.set(PARENT_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    })
    return res
  } catch (err) {
    console.error("[parent register]", err)
    return NextResponse.json({ success: false, error: "Failed to register" }, { status: 500 })
  }
}
