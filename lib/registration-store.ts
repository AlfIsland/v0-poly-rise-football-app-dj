import Redis from "ioredis"

let redis: Redis | null = null
function getRedis() {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    redis.on("error", err => console.error("[Redis Reg]", err))
  }
  return redis
}

export interface Registration {
  id: string
  program: string
  programName: string
  playerName: string
  playerAge: string
  playerGrade: string
  playerSchool: string
  playerPosition: string
  parentName: string
  email: string
  phone: string
  amount: number
  billing: "one_time" | "monthly"
  stripeSessionId?: string
  status: "pending" | "paid" | "canceled"
  createdAt: string
  paidAt?: string
}

export async function saveRegistration(reg: Registration) {
  const r = getRedis()
  if (!r) return
  await r.set(`registration:${reg.id}`, JSON.stringify(reg))
  await r.sadd("registration:roster", reg.id)
}

export async function getRegistration(id: string): Promise<Registration | null> {
  const r = getRedis()
  if (!r) return null
  const raw = await r.get(`registration:${id}`)
  return raw ? JSON.parse(raw) : null
}

export async function getRegistrationBySession(sessionId: string): Promise<Registration | null> {
  const regs = await getAllRegistrations()
  return regs.find(r => r.stripeSessionId === sessionId) ?? null
}

export async function getAllRegistrations(): Promise<Registration[]> {
  const r = getRedis()
  if (!r) return []
  const ids = await r.smembers("registration:roster")
  if (!ids.length) return []
  const values = await r.mget(...ids.map(id => `registration:${id}`))
  return values.filter(Boolean).map(v => JSON.parse(v!))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
