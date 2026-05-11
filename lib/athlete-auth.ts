import Redis from "ioredis"
import crypto from "crypto"
import bcrypt from "bcryptjs"

export const ATHLETE_COOKIE = "pr_athlete_session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 14 // 14 days
const INVITE_TTL      = 60 * 60 * 24 * 7  // 7 days

export interface AthleteAccount {
  athleteId: string   // TRN-xxxx — links to training athlete
  email: string       // lowercase
  passwordHash: string
  name: string
  createdAt: string
}

let redis: Redis | null = null
function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  if (!redis || redis.status === "end") {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    redis.on("error", (err) => console.error("[Redis AthleteAuth]", err))
  }
  return redis
}

// ── Account storage ──────────────────────────────────────────────────────────
export async function getAthleteAccount(athleteId: string): Promise<AthleteAccount | null> {
  const r = getRedis()
  if (!r) return null
  const raw = await r.get(`athlete:account:${athleteId.toUpperCase()}`)
  return raw ? JSON.parse(raw) : null
}

export async function getAthleteAccountByEmail(email: string): Promise<AthleteAccount | null> {
  const r = getRedis()
  if (!r) return null
  const athleteId = await r.get(`athlete:email:${email.toLowerCase()}`)
  if (!athleteId) return null
  return getAthleteAccount(athleteId)
}

export async function saveAthleteAccount(account: AthleteAccount): Promise<void> {
  const r = getRedis()
  if (!r) return
  await r.set(`athlete:account:${account.athleteId.toUpperCase()}`, JSON.stringify(account))
  await r.set(`athlete:email:${account.email.toLowerCase()}`, account.athleteId.toUpperCase())
}

// ── Sessions ─────────────────────────────────────────────────────────────────
export async function createAthleteSession(athleteId: string): Promise<string> {
  const token = crypto.randomUUID()
  const r = getRedis()
  if (r) await r.setex(`athlete:session:${token}`, SESSION_MAX_AGE, athleteId.toUpperCase())
  return token
}

export async function getAthleteIdFromSession(token: string): Promise<string | null> {
  const r = getRedis()
  if (!r) return null
  return await r.get(`athlete:session:${token}`)
}

export async function deleteAthleteSession(token: string): Promise<void> {
  const r = getRedis()
  if (r) await r.del(`athlete:session:${token}`)
}

// ── Invite tokens ─────────────────────────────────────────────────────────────
export async function createInviteToken(athleteId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex")
  const r = getRedis()
  if (r) await r.setex(`athlete:invite:${token}`, INVITE_TTL, athleteId.toUpperCase())
  return token
}

export async function redeemInviteToken(token: string): Promise<string | null> {
  const r = getRedis()
  if (!r) return null
  const athleteId = await r.get(`athlete:invite:${token}`)
  if (athleteId) await r.del(`athlete:invite:${token}`) // one-time use
  return athleteId
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export const SESSION_MAX_AGE_MS = SESSION_MAX_AGE

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
