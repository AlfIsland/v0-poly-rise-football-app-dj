import Redis from "ioredis"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Read REDIS_URL from .env.local
const envPath = path.join(__dirname, "../.env.local")
const envContent = fs.readFileSync(envPath, "utf-8")
const redisUrlMatch = envContent.match(/^REDIS_URL=(.+)$/m)
if (!redisUrlMatch) { console.error("REDIS_URL not found in .env.local"); process.exit(1) }
const REDIS_URL = redisUrlMatch[1].trim().replace(/^["']|["']$/g, "")

// Grade advancement maps — covers both "Xth Grade" and short "Xth" formats
const GRADE_MAP = {
  "K": "1st",
  "1st": "2nd",
  "2nd": "3rd",
  "3rd": "4th",
  "4th": "5th",
  "5th": "6th",
  "6th": "7th",
  "7th": "8th",
  "8th": "9th",
  "9th": "10th",
  "10th": "11th",
  "11th": "12th",
  "3rd Grade": "4th Grade",
  "4th Grade": "5th Grade",
  "5th Grade": "6th Grade",
  "6th Grade": "7th Grade",
  "7th Grade": "8th Grade",
  "8th Grade": "9th Grade",
  "9th Grade": "10th Grade",
  "10th Grade": "11th Grade",
  "11th Grade": "12th Grade",
  "9th Grade (Freshman)": "10th Grade (Sophomore)",
  "10th Grade (Sophomore)": "11th Grade (Junior)",
  "11th Grade (Junior)": "12th Grade (Senior)",
}

const redis = new Redis(REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 8000 })

async function main() {
  const ids = await redis.smembers("training:roster")
  console.log(`Found ${ids.length} athletes in roster`)

  let updated = 0
  let skipped = 0
  let seniors = 0

  for (const id of ids) {
    const key = `training:athlete:${id}`
    const raw = await redis.get(key)
    if (!raw) { skipped++; continue }

    const athlete = JSON.parse(raw)
    const oldGrade = athlete.grade ?? ""
    const newGrade = GRADE_MAP[oldGrade]

    if (!newGrade) {
      if (oldGrade === "12th" || oldGrade === "12th Grade" || oldGrade === "12th Grade (Senior)") {
        console.log(`  SENIOR (keeping 12th): ${athlete.name} [${id}]`)
        seniors++
      } else {
        console.log(`  UNKNOWN GRADE "${oldGrade}": ${athlete.name} [${id}] — skipped`)
        skipped++
      }
      continue
    }

    athlete.grade = newGrade
    await redis.set(key, JSON.stringify(athlete))
    console.log(`  ${athlete.name} [${id}]: "${oldGrade}" → "${newGrade}"`)
    updated++
  }

  console.log(`\nDone — ${updated} updated, ${seniors} seniors kept at 12th, ${skipped} skipped`)
  await redis.quit()
}

main().catch(err => { console.error(err); process.exit(1) })
