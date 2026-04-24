import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"

function getRedis() {
  return new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: 2, connectTimeout: 4000 })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const r = getRedis()
  try {
    const upper = id.toUpperCase()
    const raw = await r.get(`training:athlete:${upper}`)
    if (!raw) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })

    const data = JSON.parse(raw)

    // Find matching PR-V seal by athlete name
    let prvCode: string | null = null
    const prvKeys = await r.keys("athlete:*")
    for (const key of prvKeys) {
      const prvRaw = await r.get(key)
      if (prvRaw) {
        const prv = JSON.parse(prvRaw)
        if (prv.athleteName?.toLowerCase() === data.name?.toLowerCase()) {
          prvCode = prv.code
          break
        }
      }
    }

    const sessions = data.sessions ?? []
    const baseline = sessions[0] ?? null
    const current = sessions[sessions.length - 1] ?? null

    return NextResponse.json({
      success: true,
      athlete: {
        id: data.id,
        name: data.name,
        position: data.position ?? null,
        grade: data.grade ?? null,
        school: data.school ?? null,
        sport: data.sport ?? null,
        videoLink: data.videoLink ?? null,
        twitterHandle: data.twitterHandle ?? null,
        joinedAt: data.joinedAt ?? null,
        sessionCount: sessions.length,
        baseline,
        current,
        prvCode,
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  } finally {
    await r.quit()
  }
}
