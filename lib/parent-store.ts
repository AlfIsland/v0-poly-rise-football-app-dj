import Redis from "ioredis"

let redis: Redis | null = null
export function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    redis.on("error", (err) => console.error("[Redis Parent]", err))
  }
  return redis
}

export interface ParentAccount {
  email: string
  passwordHash: string
  name: string
  phone?: string
  athleteName?: string           // athlete name provided at signup
  athleteIds: string[]           // training athlete IDs linked to this parent
  tier: "program" | "monthly" | "quarterly" | "none"
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  subscriptionStatus?: string    // active, past_due, canceled, etc.
  subscriptionEnd?: string       // ISO date
  createdAt: string
}

export async function getParent(email: string): Promise<ParentAccount | null> {
  const r = getRedis()
  if (!r) return null
  const raw = await r.get(`parent:${email.toLowerCase()}`)
  return raw ? JSON.parse(raw) : null
}

export async function saveParent(parent: ParentAccount): Promise<void> {
  const r = getRedis()
  if (!r) return
  await r.set(`parent:${parent.email.toLowerCase()}`, JSON.stringify(parent))
  await r.sadd("parent:roster", parent.email.toLowerCase())
}

export async function getAllParents(): Promise<ParentAccount[]> {
  const r = getRedis()
  if (!r) return []
  const emails = await r.smembers("parent:roster")
  if (!emails.length) return []
  const values = await r.mget(...emails.map(e => `parent:${e}`))
  return values.filter(Boolean).map(v => JSON.parse(v!))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getParentByStripeCustomer(customerId: string): Promise<ParentAccount | null> {
  const parents = await getAllParents()
  return parents.find(p => p.stripeCustomerId === customerId) ?? null
}

// Session cookie helpers
export const PARENT_COOKIE = "pr_parent_session"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 14 // 14 days

export async function createSession(email: string): Promise<string> {
  const token = crypto.randomUUID()
  const r = getRedis()
  if (r) await r.setex(`parent:session:${token}`, SESSION_MAX_AGE, email.toLowerCase())
  return token
}

export async function getSessionEmail(token: string): Promise<string | null> {
  const r = getRedis()
  if (!r) return null
  return await r.get(`parent:session:${token}`)
}

export async function deleteSession(token: string): Promise<void> {
  const r = getRedis()
  if (r) await r.del(`parent:session:${token}`)
}
