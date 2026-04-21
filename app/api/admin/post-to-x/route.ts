import { NextRequest, NextResponse } from "next/server"
import { TwitterApi } from "twitter-api-v2"
import Redis from "ioredis"

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("pr_admin_session")?.value
  return !!session && !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN
}

function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  return new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const { atpId, preview } = await req.json()
  if (!atpId) return NextResponse.json({ success: false, error: "Missing atpId" }, { status: 400 })

  const { TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET } = process.env

  const r = getRedis()
  if (!r) return NextResponse.json({ success: false, error: "No Redis" }, { status: 500 })

  try {
    // Load training athlete
    const raw = await r.get(`training:athlete:${atpId.toUpperCase()}`)
    if (!raw) return NextResponse.json({ success: false, error: "Athlete not found" }, { status: 404 })
    const athlete = JSON.parse(raw)

    // Try to find matching PR-V athlete by name for seal code
    // Also use videoLink directly from training athlete record if available
    const codes = await r.smembers("athlete:roster")
    let videoLink: string = athlete.videoLink ?? ""
    let sealCode = ""
    if (codes.length) {
      const values = await r.mget(...codes.map((c: string) => `athlete:${c}`))
      const normName = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "")
      for (const v of values) {
        if (!v) continue
        const prv = JSON.parse(v)
        if (normName(prv.athleteName) === normName(athlete.name)) {
          if (!videoLink) videoLink = prv.videoLink ?? ""
          sealCode = prv.code ?? ""
          break
        }
      }
    }

    await r.quit()

    // Build tweet text
    const sessions = athlete.sessions ?? []
    const latest = sessions[sessions.length - 1]

    const lines: string[] = []
    lines.push(`🏈 Athlete Spotlight — PolyRISE Football`)
    lines.push(`${athlete.name} | ${athlete.position || "ATH"} | ${athlete.grade || ""} | ${athlete.school || ""}`)
    lines.push("")

    const metrics: string[] = []
    if (latest?.fortyYard)    metrics.push(`40-YD: ${latest.fortyYard}s`)
    if (latest?.verticalJump) metrics.push(`Vertical: ${latest.verticalJump}"`)
    if (latest?.broadJump)    metrics.push(`Broad: ${latest.broadJump}"`)
    if (latest?.shuttle)      metrics.push(`Shuttle: ${latest.shuttle}s`)
    if (metrics.length) lines.push(metrics.join(" · "))

    lines.push("")
    if (videoLink) lines.push(`🎬 Hudl Film: ${videoLink}`)
    if (sealCode)  lines.push(`📋 Profile: https://polyrisefootball.com/verify/${sealCode}`)
    lines.push("")
    lines.push(`📩 Recruiting: kg@polyrisefootball.com`)
    lines.push(`Kevin Garrett (Former NFL) | Director of Player Development`)
    lines.push(`#PolyRISE #FootballRecruiting`)

    const text = lines.join("\n")

    // Preview mode — return text without posting
    if (preview) return NextResponse.json({ success: true, preview: true, text })

    if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET)
      return NextResponse.json({ success: false, error: "X API not configured" }, { status: 500 })

    const client = new TwitterApi({
      appKey: TWITTER_API_KEY,
      appSecret: TWITTER_API_SECRET,
      accessToken: TWITTER_ACCESS_TOKEN,
      accessSecret: TWITTER_ACCESS_SECRET,
    })

    const tweet = await client.v2.tweet(text)
    return NextResponse.json({ success: true, tweetId: tweet.data.id })
  } catch (err: unknown) {
    console.error("[post-to-x]", err)
    const message = err instanceof Error ? err.message : "Failed to post"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
