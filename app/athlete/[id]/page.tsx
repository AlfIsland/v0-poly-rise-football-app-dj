import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Redis from "ioredis"
import { getAgeTier, tierStyle } from "@/lib/age-tiers"
import CopyLinkButton from "@/components/copy-link-button"
import ShareCardDownload from "@/components/share-card-download"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const athlete = await getAthlete(params.id)
  if (!athlete) return { title: "Athlete Profile · PolyRISE Football" }
  return {
    title: `${athlete.name} · PolyRISE Football Recruiting Profile`,
    description: `${athlete.position ?? "Athlete"} · ${athlete.grade ?? ""} · ${athlete.school ?? ""}. Verified combine metrics from PolyRISE Football.`,
    openGraph: {
      title: `${athlete.name} — PolyRISE Football`,
      description: `${athlete.position ?? "Athlete"} · ${athlete.school ?? ""}. View verified combine metrics.`,
      images: athlete.photoUrl ? [athlete.photoUrl] : ["/poly-rise-logo.png"],
    },
  }
}

async function getAthlete(id: string) {
  try {
    if (!process.env.REDIS_URL) return null
    const redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 })
    const raw = await redis.get(`training:athlete:${id.toUpperCase()}`)
    await redis.quit()
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const METRICS = [
  { key: "fortyYard",    label: "40-Yard Dash",     unit: "s",     lower: true  },
  { key: "twentyYard",  label: "20-Yard Dash",      unit: "s",     lower: true  },
  { key: "shuttle",     label: "5-10-5 Shuttle",    unit: "s",     lower: true  },
  { key: "threeCone",   label: "3-Cone Drill",      unit: "s",     lower: true  },
  { key: "verticalJump",label: "Vertical Jump",     unit: '"',     lower: false },
  { key: "broadJump",   label: "Broad Jump",        unit: '"',     lower: false },
  { key: "benchPress",  label: "Bench Press 135",   unit: " reps", lower: false },
  { key: "pushups",     label: "Push-Ups",          unit: " reps", lower: false },
] as const

export default async function AthleteProfilePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { welcome?: string }
}) {
  const athlete = await getAthlete(params.id)
  if (!athlete) notFound()
  const isWelcome = searchParams.welcome === "1"

  const sessions = athlete.sessions ?? []
  const baseline = sessions[0] ?? null
  const current = sessions[sessions.length - 1] ?? null
  const age: number = athlete.age ?? 16
  const gender: "M" | "F" = athlete.gender ?? "M"

  // Top metrics for the highlight bar
  const highlights: { label: string; value: string; tier: string | null }[] = []
  for (const m of METRICS) {
    const val = current?.[m.key] ?? baseline?.[m.key]
    if (val == null) continue
    const tier = getAgeTier(m.key, val, age, gender)
    if (tier === "Elite" || tier === "Above Average") {
      highlights.push({ label: m.label, value: `${val}${m.unit}`, tier })
      if (highlights.length >= 3) break
    }
  }

  const sportLabel = athlete.sport === "soccer" ? "Soccer" : "Football"
  const sportEmoji = athlete.sport === "soccer" ? "⚽" : "🏈"

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-black px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={32} height={32} className="object-contain shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest truncate">PolyRISE Football</p>
            <p className="text-xs text-gray-500 truncate">{athlete.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ShareCardDownload
            athleteId={athlete.id}
            name={athlete.name}
            position={athlete.position}
            school={athlete.school}
            grade={athlete.grade}
            age={age}
            gender={gender}
            featured={athlete.featured}
            photoUrl={athlete.photoUrl}
            videoLink={athlete.videoLink}
            twitterHandle={athlete.twitterHandle}
            sessions={sessions}
            compact
          />
          <CopyLinkButton />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Welcome banner — shown when athlete arrives via parent invite */}
        {isWelcome && (
          <div className="relative overflow-hidden bg-gradient-to-br from-red-950/80 to-gray-900 border border-red-700/50 rounded-2xl p-5">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent pointer-events-none" />
            <div className="relative">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Welcome to PolyRISE</p>
              <h2 className="text-xl font-black text-white mb-1">
                {athlete.name.split(" ")[0]}, this is your profile.
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Your verified combine metrics and national ranking are below. Scroll down to download your recruiting card and share it.
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 rounded-lg px-3 py-1.5">
                  <span className="text-green-400 font-bold text-sm">✓</span>
                  <span className="text-xs text-gray-300 font-semibold">Metrics verified by PolyRISE coaches</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 rounded-lg px-3 py-1.5">
                  <span className="text-red-400 font-bold text-sm">↓</span>
                  <span className="text-xs text-gray-300 font-semibold">Scroll down to grab your recruiting card</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero card */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            {/* Photo */}
            <div className="shrink-0">
              {athlete.photoUrl ? (
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border border-white/10">
                  <Image src={athlete.photoUrl} alt={athlete.name} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gray-800 border border-white/10 flex items-center justify-center text-4xl">
                  {sportEmoji}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">{athlete.name}</h1>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {athlete.position && (
                  <span className="text-xs bg-red-900/50 text-red-300 border border-red-700/50 px-2.5 py-0.5 rounded-full font-semibold">
                    {athlete.position}
                  </span>
                )}
                {athlete.grade && (
                  <span className="text-xs bg-white/10 text-gray-300 border border-white/10 px-2.5 py-0.5 rounded-full font-semibold">
                    Grade {athlete.grade}
                  </span>
                )}
                {athlete.age && (
                  <span className="text-xs bg-white/10 text-gray-300 border border-white/10 px-2.5 py-0.5 rounded-full font-semibold">
                    Age {athlete.age}
                  </span>
                )}
                <span className="text-xs bg-white/10 text-gray-300 border border-white/10 px-2.5 py-0.5 rounded-full font-semibold">
                  {sportLabel}
                </span>
              </div>
              {athlete.school && (
                <p className="text-gray-400 text-sm mt-2 font-medium">{athlete.school}</p>
              )}
              {athlete.gpa && (
                <p className="text-yellow-400 text-xs mt-1 font-semibold">GPA {athlete.gpa}</p>
              )}
              {athlete.mlsTeam && (
                <div className="mt-2 inline-flex items-center gap-2 bg-green-900/40 border border-green-600/50 rounded-lg px-3 py-1.5">
                  <span className="text-base leading-none">⚽</span>
                  <div>
                    <p className="text-xs text-green-400 font-bold uppercase tracking-wider leading-none mb-0.5">MLS League / Team</p>
                    <p className="text-sm text-green-200 font-semibold leading-none">{athlete.mlsTeam}</p>
                  </div>
                </div>
              )}
              {athlete.twitterHandle && (
                <p className="text-blue-400 text-xs mt-1">@{athlete.twitterHandle.replace(/^@/, "")}</p>
              )}
            </div>

            {/* PR-VERIFIED */}
            {athlete.featured && (
              <Link href={`/verify/${athlete.id}`} target="_blank"
                className="shrink-0 flex flex-col items-center gap-1 bg-red-950/60 border border-red-700/50 rounded-xl px-3 py-2 hover:bg-red-950 transition-colors">
                <p className="text-xs text-red-400 font-black uppercase tracking-wide">PR-VERIFIED</p>
                <p className="text-xs text-gray-400 font-mono">{athlete.id}</p>
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/5 text-center">
            <div>
              <p className="text-2xl font-black text-white">{sessions.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Sessions</p>
            </div>
            <div className="border-x border-white/5">
              <p className="text-2xl font-black text-red-400">{athlete.featured ? "✓" : "—"}</p>
              <p className="text-xs text-gray-500 mt-0.5">PR-Verified</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">
                {athlete.joinedAt ? new Date(athlete.joinedAt).getFullYear() : "—"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Member Since</p>
            </div>
          </div>
        </div>

        {/* ── Share Card — prominent, right under hero ── */}
        <div className="relative overflow-hidden rounded-2xl border border-red-700/40 bg-gradient-to-br from-red-950 via-gray-900 to-gray-950">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "18px 18px" }} />

          <div className="relative p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📲</span>
              <p className="text-base font-black text-white uppercase tracking-wide">Your Recruiting Card</p>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Download your card and post it to Instagram, Twitter, or send directly to college coaches.
            </p>

            <ShareCardDownload
              athleteId={athlete.id}
              name={athlete.name}
              position={athlete.position}
              school={athlete.school}
              grade={athlete.grade}
              age={age}
              gender={gender}
              featured={athlete.featured}
              photoUrl={athlete.photoUrl}
              videoLink={athlete.videoLink}
              twitterHandle={athlete.twitterHandle}
              sessions={sessions}
            />

            <p className="text-xs text-gray-600 mt-3 text-center">
              1080×1080 PNG · ready to post on Instagram, Twitter, or send to coaches
            </p>
          </div>
        </div>

        {/* Highlight bar — top metrics */}
        {highlights.length > 0 && (
          <div className="bg-gradient-to-r from-red-950/50 to-gray-900 border border-red-800/30 rounded-2xl px-5 py-4">
            <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-3">Top Metrics for Age {age}</p>
            <div className="flex flex-wrap gap-3">
              {highlights.map(h => (
                <div key={h.label} className="flex items-center gap-2 bg-black/30 rounded-xl px-3 py-2">
                  <span className="text-white font-black text-lg">{h.value}</span>
                  <div>
                    <p className="text-gray-400 text-xs">{h.label}</p>
                    {h.tier && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${tierStyle(h.tier as "Elite" | "Above Average" | "Average" | "Below Average")}`}>
                        {h.tier === "Above Average" ? "Above Avg" : h.tier}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {(baseline || current) && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-5 bg-red-600 rounded-full" />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Performance Metrics</h2>
              {athlete.featured && (
                <span className="ml-auto text-xs bg-red-900/50 text-red-400 border border-red-700/40 px-2 py-0.5 rounded-full font-bold">
                  Coach-Verified
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-4 ml-4">Compared to athletes age {age}</p>

            <div>
              {METRICS.map(m => {
                const bVal: number | undefined = baseline?.[m.key]
                const cVal: number | undefined = current?.[m.key]
                if (!bVal && !cVal) return null
                const displayVal = cVal ?? bVal!
                const baseVal = bVal
                const tier = getAgeTier(m.key, displayVal, age, gender)
                const change = (baseVal && cVal && baseVal !== cVal)
                  ? ((m.lower ? baseVal - cVal : cVal - baseVal) / baseVal * 100)
                  : null
                const improved = change !== null ? change > 0 : null

                return (
                  <div key={m.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-gray-300 text-sm">{m.label}</p>
                      {tier && (
                        <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-lg ${tierStyle(tier)}`}>
                          {tier === "Above Average" ? "Above Avg" : tier}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {baseVal && cVal && baseVal !== cVal && (
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-gray-600">Baseline</p>
                          <p className="text-gray-500 text-sm">{baseVal}{m.unit}</p>
                        </div>
                      )}
                      <div className="text-right">
                        {baseVal && cVal && baseVal !== cVal && <p className="text-xs text-gray-500">Current</p>}
                        <p className="text-white font-bold text-sm">{displayVal}{m.unit}</p>
                      </div>
                      {change !== null && Math.abs(change) > 0.5 && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${improved ? "bg-green-900/60 text-green-400" : "bg-red-900/60 text-red-400"}`}>
                          {improved ? "▲" : "▼"}{Math.abs(change).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
              {(baseline?.weight || current?.weight) && (
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <p className="text-gray-300 text-sm">Weight</p>
                  <p className="text-white font-bold text-sm">{current?.weight ?? baseline?.weight} lbs</p>
                </div>
              )}
              {(baseline?.height || current?.height) && (
                <div className="flex items-center justify-between py-3">
                  <p className="text-gray-300 text-sm">Height</p>
                  <p className="text-white font-bold text-sm">{current?.height ?? baseline?.height}</p>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-600 mt-4">
              Metrics recorded at PolyRISE Football combine camps · Dripping Springs, TX
            </p>
          </div>
        )}

        {/* Film */}
        {athlete.videoLink && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-5 bg-red-600 rounded-full" />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Film</h2>
            </div>
            <a href={athlete.videoLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-4 py-3 transition-colors group">
              <span className="text-2xl">🎬</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm group-hover:text-red-400 transition-colors">Watch Hudl Film</p>
                <p className="text-xs text-gray-500 truncate">{athlete.videoLink}</p>
              </div>
              <span className="text-gray-500 group-hover:text-white transition-colors">↗</span>
            </a>
          </div>
        )}

        {/* Recruiting contact */}
        <div className="bg-gradient-to-br from-red-950/60 to-gray-900 border border-red-800/40 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-5 bg-red-600 rounded-full" />
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Recruiting Inquiries</h2>
          </div>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-700 flex items-center justify-center text-white font-black text-sm shrink-0">KG</div>
            <div>
              <p className="text-yellow-300 font-bold text-sm">Kevin Garrett · Former NFL</p>
              <p className="text-gray-400 text-xs">Director of Player Development · PolyRISE Football</p>
              <a href="mailto:kg@polyrisefootball.com" className="text-red-400 hover:text-red-300 text-xs font-bold mt-1 inline-block">
                kg@polyrisefootball.com
              </a>
              <a href="mailto:polyrise@polyrisefootball.com" className="text-red-400 hover:text-red-300 text-xs font-bold mt-0.5 inline-block">
                polyrise@polyrisefootball.com
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="mailto:kg@polyrisefootball.com"
              className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl transition-colors">
              Email Kevin Garrett
            </a>
            <a href="mailto:polyrise@polyrisefootball.com"
              className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 font-semibold px-4 py-2 rounded-xl border border-white/10 transition-colors">
              Email PolyRISE
            </a>
            <a href="tel:+18176583300"
              className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 font-semibold px-4 py-2 rounded-xl border border-white/10 transition-colors">
              (817) 658-3300
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <div className="flex items-center gap-2">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={24} height={24} className="object-contain opacity-50" />
            <p className="text-xs text-gray-600">PolyRISE Football · polyrisefootball.com</p>
          </div>
          <Link href="/plans" className="text-xs text-gray-600 hover:text-gray-400 underline transition-colors">
            Join PolyRISE →
          </Link>
        </div>

      </main>
    </div>
  )
}
