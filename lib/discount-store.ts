import Redis from "ioredis"

let redis: Redis | null = null
function getRedis() {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    redis.on("error", err => console.error("[Redis Discount]", err))
  }
  return redis
}

export interface DiscountCode {
  code: string
  type: "percent" | "fixed"   // percent off or $ off
  value: number               // 20 = 20% or $20
  maxUses: number             // 0 = unlimited
  usedCount: number
  expiresAt?: string          // ISO date, optional
  active: boolean
  createdAt: string
  note?: string               // e.g. "Spring 2025 promo"
}

export async function getDiscount(code: string): Promise<DiscountCode | null> {
  const r = getRedis()
  if (!r) return null
  const raw = await r.get(`discount:${code.toUpperCase()}`)
  return raw ? JSON.parse(raw) : null
}

export async function saveDiscount(d: DiscountCode): Promise<void> {
  const r = getRedis()
  if (!r) return
  await r.set(`discount:${d.code.toUpperCase()}`, JSON.stringify(d))
  await r.sadd("discount:roster", d.code.toUpperCase())
}

export async function getAllDiscounts(): Promise<DiscountCode[]> {
  const r = getRedis()
  if (!r) return []
  const codes = await r.smembers("discount:roster")
  if (!codes.length) return []
  const values = await r.mget(...codes.map(c => `discount:${c}`))
  return values.filter(Boolean).map(v => JSON.parse(v!))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function incrementUsage(code: string): Promise<void> {
  const d = await getDiscount(code)
  if (!d) return
  d.usedCount += 1
  await saveDiscount(d)
}

export function applyDiscount(amount: number, d: DiscountCode): number {
  if (d.type === "percent") return Math.round(amount * (1 - d.value / 100))
  return Math.max(0, amount - d.value)
}

export function validateDiscount(d: DiscountCode): { valid: boolean; error?: string } {
  if (!d.active) return { valid: false, error: "This code is no longer active" }
  if (d.maxUses > 0 && d.usedCount >= d.maxUses) return { valid: false, error: "This code has reached its usage limit" }
  if (d.expiresAt && new Date(d.expiresAt) < new Date()) return { valid: false, error: "This code has expired" }
  return { valid: true }
}
