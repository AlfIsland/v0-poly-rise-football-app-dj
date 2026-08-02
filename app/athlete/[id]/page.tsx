import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Redis from "ioredis"
import { cookies } from "next/headers"
import { getAgeTier, tierStyle } from "@/lib/age-tiers"
import LockedProfilePage from "@/components/locked-profile-page"
import { calculateRatings } from "@/lib/athlete-ratings"
import { gradeToClassYear } from "@/lib/grade-to-class-year"
import { ATHLETE_COOKIE, getAthleteIdFromSession } from "@/lib/athlete-auth"
import type { MetricKey, VideoTestRecord } from "@/app/api/training/route"
import { accoladeColors, accoladeEmoji } from "@/lib/accolades"
import { getSport } from "@/lib/sports"
import CopyLinkButton from "@/components/copy-link-button"
import ShareCardDownload from "@/components/share-card-download"
import StoriesCardDownload from "@/components/stories-card-download"
import ShareProfileCard from "@/components/share-profile-card"
import AthleteLogoutButton from "@/components/athlete-logout-button"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const athlete = await getAthlete(params.id)
  if (!athlete) return { title: "Athlete Profile · PolyRISE Athletix" }
  return {
    title: `${athlete.name} · PolyRISE Athletix Recruiting Profile`,
    description: `${athlete.position ?? "Athlete"} · ${athlete.grade ?? ""} · ${athlete.school ?? ""}. Verified combine metrics from PolyRISE Athletix.`,
    openGraph: {
      title: `${athlete.name} — PolyRISE Athletix`,
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

  // Detect logged-in athlete owner and admin
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(ATHLETE_COOKIE)?.value
  const adminToken = cookieStore.get("pr_admin_session")?.value
  const isAdmin = !!adminToken && !!process.env.ADMIN_SESSION_TOKEN && adminToken === process.env.ADMIN_SESSION_TOKEN
  const loggedInAthleteId = sessionToken ? await getAthleteIdFromSession(sessionToken) : null
  const isOwner = !!loggedInAthleteId && loggedInAthleteId.toUpperCase() === params.id.toUpperCase()
  const pendingCount = (athlete.pendingVideoTests ?? []).filter((t: { status: string }) => t.status === "pending").length

  // Private profile gate — undefined/missing defaults to public for existing athletes
  const isPublic = athlete.profilePublic !== false
  if (!isPublic && !isOwner && !isAdmin) {
    return <LockedProfilePage athleteId={athlete.id} />
  }

  const sessions = athlete.sessions ?? []
  const baseline = sessions[0] ?? null
  const current = sessions[sessions.length - 1] ?? null
  const age: number = athlete.age ?? 16
  const gender: "M" | "F" = athlete.gender ?? "M"

  // Class year — use stored gradYear if available, else derive from grade string
  const classYear = athlete.gradYear ? String(athlete.gradYear) : gradeToClassYear(athlete.grade ?? "")

  // Rankings from latest session
  const ratings = current ? calculateRatings({
    fortyYard: current.fortyYard,
    twentyYard: current.twentyYard,
    shuttle: current.shuttle,
    threeCone: current.threeCone,
    verticalJump: current.verticalJump,
    broadJump: current.broadJump,
    benchPress: current.benchPress,
  }, athlete.position ?? "", classYear) : null

  // Progress highlights — top improvements since baseline
  const improvements: { label: string; unit: string; from: number; to: number; delta: number; pct: number; lower: boolean }[] = []
  if (baseline && current && sessions.length >= 2) {
    for (const m of METRICS) {
      const bVal = baseline[m.key as keyof typeof baseline] as number | undefined
      const cVal = current[m.key as keyof typeof current] as number | undefined
      if (bVal == null || cVal == null || bVal === cVal) continue
      const improvement = m.lower ? bVal - cVal : cVal - bVal
      if (improvement > 0) {
        improvements.push({
          label: m.label, unit: m.unit,
          from: bVal, to: cVal,
          delta: Math.abs(bVal - cVal),
          pct: (improvement / bVal) * 100,
          lower: m.lower,
        })
      }
    }
    improvements.sort((a, b) => b.pct - a.pct)
  }

  const sport      = getSport(athlete.sport)
  const sportLabel = sport.label
  const sportEmoji = sport.emoji
  const memberSince = athlete.joinedAt
    ? new Date(athlete.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null

  const profileUrl = `https://polyrisefootball.com/athlete/${athlete.id}`

  function absUrl(url: string): string {
    if (!url) return url
    return /^https?:\/\//i.test(url) ? url : `https://${url}`
  }

  // Build coach email template with real athlete data
  const metricLines = METRICS
    .map(m => {
      const val = current?.[m.key as keyof typeof current] ?? baseline?.[m.key as keyof typeof baseline]
      if (val == null) return null
      return `  • ${m.label}: ${val}${m.unit}`
    })
    .filter(Boolean)
    .join("\n")

  const rankingLine = ratings
    ? `\nNational Percentile: ${ratings.overallPercentile}th  |  Texas Percentile: ${ratings.texasPercentile}th\n`
    : ""

  const emailSubject = `Recruiting Inquiry — ${athlete.name} | ${athlete.position ?? "Athlete"} | Class of ${classYear}`
  const emailTemplate = `Coach [Last Name],

My name is ${athlete.name} and I am a Class of ${classYear} ${athlete.position ?? "athlete"}${athlete.school ? ` from ${athlete.school}` : ""}. I wanted to reach out and introduce myself as a prospective student-athlete interested in your program.

Here are my most recent combine metrics, verified by PolyRISE Athletix:
${metricLines}${rankingLine ? `\n${rankingLine}` : ""}
You can view my full recruiting profile here:
${profileUrl}

I would love to learn more about [School Name]'s program and the opportunity to compete at the next level. Please let me know if you have any questions or would like additional information.

Thank you for your time and consideration.

${athlete.name}${athlete.phone ? `\n${athlete.phone}` : ""}${athlete.email ? `\n${athlete.email}` : ""}${athlete.twitterHandle ? `\nTwitter/X: @${athlete.twitterHandle.replace(/^@/, "")}` : ""}`

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-black px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Athletix" width={32} height={32} className="object-contain shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest truncate">PolyRISE Athletix</p>
            <p className="text-xs text-gray-500 truncate">Athlete Recruiting Profile</p>
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
          {isOwner && <AthleteLogoutButton />}
          {!isOwner && !sessionToken && (
            <Link href="/athlete/login" className="text-xs bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700/50 text-purple-300 font-semibold px-3 py-1.5 rounded-lg transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Welcome banner */}
        {isWelcome && (
          <div className="relative overflow-hidden bg-gradient-to-br from-red-950/80 to-gray-900 border border-red-700/50 rounded-2xl p-5">
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

        {/* ── Hero Card ── */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Photo */}
              <div className="shrink-0">
                {athlete.photoUrl ? (
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 border-red-700/40">
                    <Image src={athlete.photoUrl} alt={athlete.name} fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-gray-800 border-2 border-white/10 flex items-center justify-center text-5xl">
                    {sportEmoji}
                  </div>
                )}
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">{athlete.name}</h1>

                {/* Position + Class year */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {athlete.position && (
                    <span className="text-sm bg-red-900/60 text-red-300 border border-red-700/50 px-2.5 py-0.5 rounded-full font-bold">
                      {athlete.position}
                    </span>
                  )}
                  {classYear && (
                    <span className="text-sm bg-white/10 text-white border border-white/20 px-2.5 py-0.5 rounded-full font-bold">
                      Class of {classYear}
                    </span>
                  )}
                  <span className="text-xs bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">
                    {sportLabel}
                  </span>
                </div>

                {/* School */}
                {athlete.school && (
                  <p className="text-gray-300 text-sm mt-2 font-semibold">{athlete.school}</p>
                )}

                {/* Secondary details */}
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
                  {athlete.gpa && (
                    <p className="text-yellow-400 text-xs font-semibold">GPA {athlete.gpa}</p>
                  )}
                  {athlete.age && (
                    <p className="text-gray-500 text-xs">Age {athlete.age}</p>
                  )}
                  {athlete.twitterHandle && (
                    <p className="text-blue-400 text-xs">@{athlete.twitterHandle.replace(/^@/, "")}</p>
                  )}
                </div>

                {athlete.mlsTeam && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-green-900/40 border border-green-600/50 rounded-lg px-3 py-1.5">
                    <span className="text-base leading-none">⚽</span>
                    <div>
                      <p className="text-xs text-green-400 font-bold uppercase tracking-wider leading-none mb-0.5">MLS League / Team</p>
                      <p className="text-sm text-green-200 font-semibold leading-none">{athlete.mlsTeam}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* PR-VERIFIED seal */}
              {athlete.featured && (
                <Link href={`/verify/${athlete.id}`} target="_blank"
                  className="shrink-0 flex flex-col items-center gap-1 bg-red-950 border-2 border-red-600 rounded-xl px-3 py-2.5 hover:bg-red-900 transition-colors">
                  <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-red-400 font-black uppercase tracking-wide leading-none">PR-VERIFIED</p>
                  <p className="text-xs text-gray-500 font-mono leading-none mt-0.5">{athlete.id}</p>
                </Link>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/5 text-center">
              <div>
                <p className="text-2xl font-black text-white">{sessions.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Training Sessions</p>
              </div>
              <div className="border-x border-white/5">
                <p className="text-2xl font-black text-white">{improvements.length > 0 ? `${improvements.length}` : "—"}</p>
                <p className="text-xs text-gray-500 mt-0.5">Metrics Improved</p>
              </div>
              <div>
                <p className="text-sm font-black text-white leading-tight mt-1">{memberSince ?? "—"}</p>
                <p className="text-xs text-gray-500 mt-0.5">Training Since</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── National & Texas Rankings ── */}
        {ratings && ratings.metrics.length > 0 && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-950/80 to-gray-900 px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-red-600 rounded-full" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">National Rankings</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 ml-3.5">{ratings.positionGroup} · {ratings.comparedAgainst.split("·").pop()?.trim()}</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-800 rounded-xl px-4 py-4 border border-gray-700 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">National Percentile</p>
                  <p className="text-4xl font-black text-white leading-none">{ratings.overallPercentile}<span className="text-xl text-gray-400">th</span></p>
                  <div className="mt-3 h-2 rounded-full bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full bg-red-500 transition-all" style={{ width: `${ratings.overallPercentile}%` }} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5">Better than {ratings.overallPercentile}% of athletes</p>
                </div>
                <div className="bg-gray-800 rounded-xl px-4 py-4 border border-gray-700 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Texas Percentile</p>
                  <p className="text-4xl font-black text-white leading-none">{ratings.texasPercentile}<span className="text-xl text-gray-400">th</span></p>
                  <div className="mt-3 h-2 rounded-full bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${ratings.texasPercentile}%` }} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5">Better than {ratings.texasPercentile}% in Texas</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 italic">{ratings.description}</p>
            </div>
          </div>
        )}

        {/* ── Accolades ── */}
        {athlete.accolades && athlete.accolades.length > 0 && (
          <div className="bg-gray-900 border border-yellow-700/30 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
              <div className="w-1.5 h-5 bg-yellow-500 rounded-full" />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Accolades & Awards</h2>
              <span className="ml-auto text-xs bg-yellow-900/50 text-yellow-400 border border-yellow-700/40 px-2 py-0.5 rounded-full font-bold">
                {athlete.accolades.length} award{athlete.accolades.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {athlete.accolades.map(a => {
                const colors = accoladeColors(a.type)
                return (
                  <div key={a.id} className={`flex items-start gap-3 rounded-xl border p-3.5 ${colors.bg} ${colors.border}`}>
                    <span className="text-2xl shrink-0 mt-0.5">{accoladeEmoji(a.type)}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-black leading-tight ${colors.text}`}>{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {a.year}{a.organization ? ` · ${a.organization}` : ""}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Academic Achievements ── */}
        {athlete.educationAccolades && athlete.educationAccolades.length > 0 && (
          <div className="bg-gray-900 border border-green-700/30 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
              <div className="w-1.5 h-5 bg-green-500 rounded-full" />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Academic Achievements</h2>
              <span className="ml-auto text-xs bg-green-900/50 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full font-bold">
                {athlete.educationAccolades.length}
              </span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {athlete.educationAccolades.map(a => (
                <div key={a.id} className="flex items-start gap-3 rounded-xl border border-green-800/40 bg-green-950/30 p-3.5">
                  <span className="text-xl shrink-0 mt-0.5">📚</span>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-green-300 leading-tight">{a.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {a.year}{a.detail ? ` · ${a.detail}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Progress Highlights ── */}
        {improvements.length > 0 && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-green-600 rounded-full" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Progress Since Baseline</h2>
                <span className="ml-auto text-xs bg-green-900/50 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full font-bold">
                  {sessions.length} sessions
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 ml-3.5">Improvement from first test to most recent</p>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {improvements.slice(0, 4).map(imp => (
                <div key={imp.label} className="bg-green-950/30 border border-green-800/40 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400">{imp.label}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-gray-500 text-sm">{imp.from}{imp.unit}</span>
                      <span className="text-gray-600 text-xs">→</span>
                      <span className="text-white font-bold text-sm">{imp.to}{imp.unit}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-green-400 font-black text-lg leading-none">
                      {imp.lower ? "−" : "+"}{imp.delta.toFixed(imp.unit === "s" ? 2 : 1)}{imp.unit}
                    </p>
                    <p className="text-green-600 text-xs mt-0.5">▲ {imp.pct.toFixed(1)}% better</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Share Cards ── */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-950">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "18px 18px" }} />
          <div className="relative p-5 space-y-4">

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">📲</span>
                <p className="text-base font-black text-white uppercase tracking-wide">Download Your Card</p>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Send to coaches or post on social. Tag <span className="text-pink-400 font-bold">@polyrisefootball</span> and we&apos;ll repost the best ones.
              </p>
            </div>

            {/* Square card — email / Twitter */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Square — Email to Coaches / Twitter</p>
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
                accolades={athlete.accolades}
              />
              <p className="text-xs text-gray-600 mt-1.5 text-center">1080×1080 PNG</p>
            </div>

            {/* Stories card — Instagram / Snapchat */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Story — Instagram / Snapchat</p>
              <StoriesCardDownload
                athleteId={athlete.id}
                name={athlete.name}
                position={athlete.position}
                school={athlete.school}
                grade={athlete.grade}
                classYear={classYear}
                age={age}
                gender={gender}
                featured={athlete.featured}
                photoUrl={athlete.photoUrl}
                twitterHandle={athlete.twitterHandle}
                sessions={sessions}
                accolades={athlete.accolades}
              />
              <p className="text-xs text-gray-600 mt-1.5 text-center">1080×1920 PNG · fits Instagram &amp; Snapchat Stories perfectly</p>
            </div>

            {/* Tag us callout */}
            <div className="bg-gradient-to-r from-purple-950/60 to-pink-950/40 border border-purple-700/30 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-2xl shrink-0">🔁</span>
              <div>
                <p className="text-sm font-bold text-white">Tag us and get reposted</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Post on Instagram and tag <span className="text-pink-400 font-semibold">@polyrisefootball</span> — we repost top athletes to our followers.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ── Share Profile ── */}
        <ShareProfileCard
          profileUrl={profileUrl}
          emailTemplate={emailTemplate}
          emailSubject={emailSubject}
        />

        {/* ── Performance Metrics ── */}
        {(baseline || current) && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-red-600 rounded-full" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Performance Metrics</h2>
              </div>
              <div className="flex items-center gap-2">
                {athlete.featured && (
                  <span className="text-xs bg-red-900/50 text-red-400 border border-red-700/40 px-2 py-0.5 rounded-full font-bold">
                    ✓ Coach-Verified
                  </span>
                )}
              </div>
            </div>
            {(isOwner || isAdmin) && (
              <div className="px-5 pt-4 flex items-center justify-between gap-3 flex-wrap">
                <Link href={`/athlete/${athlete.id}/upload-test`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg transition-colors">
                  🎥 Upload Test Video
                </Link>
                {pendingCount > 0 && (
                  <span className="text-xs text-yellow-400">
                    {pendingCount} test{pendingCount !== 1 ? "s" : ""} awaiting staff review
                  </span>
                )}
              </div>
            )}
            <div className="px-5 py-1">
              <p className="text-xs text-gray-600 py-3">Compared to {sportLabel} athletes age {age}</p>
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
                const videoTest = current?.verifiedMetrics?.includes(m.key as MetricKey)
                  ? current?.videoTests?.find((v: VideoTestRecord) => v.metric === m.key)
                  : undefined

                return (
                  <div key={m.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-gray-300 text-sm">{m.label}</p>
                      {tier && (
                        <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-lg ${tierStyle(tier)}`}>
                          {tier === "Above Average" ? "Above Avg" : tier}
                        </span>
                      )}
                      {videoTest && (
                        <a href={videoTest.videoUrl} target="_blank" rel="noreferrer"
                          className="shrink-0 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-900/50 text-blue-300 border border-blue-700/40 hover:bg-blue-800/60"
                          title="Watch the verification video">
                          🎥 Video-Verified
                        </a>
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
              <p className="text-xs text-gray-600 py-4">
                Metrics recorded at PolyRISE Athletix combine camps · Dripping Springs, TX
              </p>
            </div>
          </div>
        )}

        {/* ── Film ── */}
        {athlete.videoLink && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-5 bg-red-600 rounded-full" />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Film</h2>
            </div>
            <a href={absUrl(athlete.videoLink)} target="_blank" rel="noopener noreferrer"
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

        {/* ── Recruiting Contact ── */}
        <div className="bg-gradient-to-br from-red-950/60 to-gray-900 border border-red-800/40 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-5 bg-red-600 rounded-full" />
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Recruiting Inquiries</h2>
          </div>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-700 flex items-center justify-center text-white font-black text-sm shrink-0">KG</div>
            <div>
              <p className="text-yellow-300 font-bold text-sm">Kevin Garrett · Former NFL</p>
              <p className="text-gray-400 text-xs">Director of Player Development · PolyRISE Athletix</p>
              <a href="mailto:polyrise@polyrisefootball.com" className="text-red-400 hover:text-red-300 text-xs font-bold mt-0.5 block">
                polyrise@polyrisefootball.com
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="mailto:polyrise@polyrisefootball.com"
              className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl transition-colors">
              Email PolyRISE Staff
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
            <p className="text-xs text-gray-600">PolyRISE Athletix · polyrisefootball.com</p>
          </div>
          <Link href="/plans" className="text-xs text-gray-600 hover:text-gray-400 underline transition-colors">
            Join PolyRISE →
          </Link>
        </div>

      </main>
    </div>
  )
}
