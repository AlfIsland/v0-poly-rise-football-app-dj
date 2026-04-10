import { NextRequest, NextResponse } from "next/server"
import Redis from "ioredis"

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 })

    if (!process.env.REDIS_URL) return NextResponse.json({ success: false, error: "No Redis" }, { status: 500 })

    const redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    const upperCode = id.toUpperCase()
    await redis.del(`training:athlete:${upperCode}`)
    await redis.srem("training:roster", upperCode)
    await redis.quit()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[training DELETE]", err)
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 })
  }
}
