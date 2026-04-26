import Redis from "ioredis"

let redis: Redis | null = null
function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 2, connectTimeout: 4000 })
    redis.on("error", () => {})
  }
  return redis
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds?: number
}

/**
 * Check and increment a rate limit counter.
 * @param key     Unique key (e.g. "login:127.0.0.1")
 * @param limit   Max allowed hits in the window
 * @param windowSeconds  Window duration in seconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const r = getRedis()
  if (!r) return { allowed: true, remaining: limit } // fail open if Redis unavailable

  const redisKey = `rl:${key}`
  try {
    const current = await r.incr(redisKey)
    if (current === 1) {
      // First hit — set expiry
      await r.expire(redisKey, windowSeconds)
    }
    if (current > limit) {
      const ttl = await r.ttl(redisKey)
      return { allowed: false, remaining: 0, retryAfterSeconds: ttl > 0 ? ttl : windowSeconds }
    }
    return { allowed: true, remaining: limit - current }
  } catch {
    return { allowed: true, remaining: limit } // fail open on Redis error
  }
}

export function getClientIp(req: Request): string {
  const forwarded = (req.headers as Headers).get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() ?? "unknown"
}
