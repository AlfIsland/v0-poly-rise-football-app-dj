import { NextResponse } from "next/server"
import Redis from "ioredis"

export interface Camp {
  id: string
  name: string
  organizer: string
  type: "polyrise" | "college" | "elite" | "regional"
  sports: string[]
  grades: string[]   // empty = all grades
  date: string       // display string e.g. "June 14, 2026" or "Summer 2026"
  location: string
  description: string
  registrationUrl: string
  featured: boolean
  active: boolean
  createdAt: string
}

function getRedis() {
  return new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: 2, connectTimeout: 4000 })
}

export async function GET() {
  const r = getRedis()
  try {
    const keys = await r.keys("camp:*")
    if (!keys.length) return NextResponse.json({ success: true, camps: [] })
    const raws = await r.mget(...keys)
    const camps = raws
      .filter(Boolean)
      .map(v => JSON.parse(v!) as Camp)
      .filter(c => c.active)
      .sort((a, b) => {
        // PolyRISE camps first, then featured, then by date
        if (a.type === "polyrise" && b.type !== "polyrise") return -1
        if (b.type === "polyrise" && a.type !== "polyrise") return 1
        if (a.featured && !b.featured) return -1
        if (b.featured && !a.featured) return 1
        return a.date.localeCompare(b.date)
      })
    return NextResponse.json({ success: true, camps })
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  } finally {
    await r.quit()
  }
}
