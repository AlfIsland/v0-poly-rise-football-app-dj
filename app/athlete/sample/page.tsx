import Image from "next/image"
import Link from "next/link"
import { calculateRatings } from "@/lib/athlete-ratings"

export const metadata = {
  title: "Sample Athlete Passport · PolyRISE Football",
  description: "See what a PolyRISE Football Athlete Passport looks like — verified combine metrics, national rankings, progress tracking, and recruiting tools.",
}

const SAMPLE_SESSIONS = [
  {
    date: "2024-09-12",
    fortyYard: 4.92,
    twentyYard: 2.87,
    shuttle: 4.61,
    threeCone: 7.24,
    verticalJump: 28,
    broadJump: 96,
    benchPress: 6,
  },
  {
    date: "2024-11-08",
    fortyYard: 4.81,
    twentyYard: 2.79,
    shuttle: 4.55,
    threeCone: 7.14,
    verticalJump: 30,
    broadJump: 99,
    benchPress: 8,
  },
  {
    date: "2025-02-14",
    fortyYard: 4.71,
    twentyYard: 2.74,
    shuttle: 4.48,
    threeCone: 7.03,
    verticalJump: 32,
    broadJump: 103,
    benchPress: 11,
  },
  {
    date: "2025-05-03",
    fortyYard: 4.62,
    twentyYard: 2.68,
    shuttle: 4.41,
    threeCone: 6.94,
    verticalJump: 34,
    broadJump: 107,
    benchPress: 14,
  },
]

const METRICS = [
  { key: "fortyYard",    label: "40-Yard Dash",    unit: "s",     lower: true  },
  { key: "twentyYard",  label: "20-Yard Dash",     unit: "s",     lower: true  },
  { key: "shuttle",     label: "5-10-5 Shuttle",   unit: "s",     lower: true  },
  { key: "threeCone",   label: "3-Cone Drill",     unit: "s",     lower: true  },
  { key: "verticalJump",label: "Vertical Jump",    unit: '"',     lower: false },
  { key: "broadJump",   label: "Broad Jump",       unit: '"',     lower: false },
  { key: "benchPress",  label: "Bench Press 135",  unit: " reps", lower: false },
] as const

export default function SamplePassportPage() {
  const baseline = SAMPLE_SESSIONS[0]
  const current  = SAMPLE_SESSIONS[SAMPLE_SESSIONS.length - 1]
  const classYear = "2027"

  const ratings = calculateRatings({
    fortyYard:    current.fortyYard,
    twentyYard:   current.twentyYard,
    shuttle:      current.shuttle,
    threeCone:    current.threeCone,
    verticalJump: current.verticalJump,
    broadJump:    current.broadJump,
    benchPress:   current.benchPress,
  }, "LB", classYear)

  // Progress highlights
  const improvements = METRICS.map(m => {
    const bVal = baseline[m.key as keyof typeof baseline] as number
    const cVal = current[m.key  as keyof typeof current]  as number
    const improvement = m.lower ? bVal - cVal : cVal - bVal
    if (improvement <= 0) return null
    return {
      label: m.label, unit: m.unit,
      from: bVal, to: cVal,
      delta: Math.abs(bVal - cVal),
      pct: (improvement / bVal) * 100,
      lower: m.lower,
    }
  }).filter(Boolean).sort((a, b) => b!.pct - a!.pct).slice(0, 4) as {
    label: string; unit: string; from: number; to: number; delta: number; pct: number; lower: boolean
  }[]

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-black px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={32} height={32} className="object-contain shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest truncate">PolyRISE Football</p>
            <p className="text-xs text-gray-500 truncate">Athlete Recruiting Profile</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/passport"
            className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-semibold px-3 py-1.5 rounded-lg transition-colors">
            ← Back to Passport Page
          </Link>
          <Link href="/register?program=recruit"
            className="text-xs bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors">
            Get My Passport
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Demo banner */}
        <div className="bg-yellow-950/50 border border-yellow-700/60 rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="text-yellow-400 text-lg shrink-0">ℹ️</span>
          <div>
            <p className="text-xs font-bold text-yellow-300 mb-0.5">This is a sample passport</p>
            <p className="text-xs text-yellow-200/70">All data is fictional and for demonstration purposes only. <Link href="/register?program=recruit" className="underline hover:text-yellow-300">Get your real passport →</Link></p>
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-950">
          <div className="h-1.5 bg-gradient-to-r from-red-600 to-red-900" />
          <div className="p-6">
            <div className="flex items-start gap-5">
              {/* Photo placeholder */}
              <div className="w-24 h-24 rounded-full bg-gray-700 border-2 border-red-600/50 flex items-center justify-center text-4xl shrink-0 select-none">
                🏈
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl font-black text-white">Fname M. Lname</h1>
                  <span className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded-full font-semibold">🏈 Football</span>
                  <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full font-semibold">Male</span>
                </div>
                <p className="text-gray-400 text-sm">Age 16 · 10th Grade · Linebacker · Dripping Springs HS</p>
                <p className="text-xs text-gray-500 mt-0.5">Class of 2027 · {SAMPLE_SESSIONS.length} sessions tracked</p>

                {/* PR-VERIFIED */}
                <div className="mt-3 inline-flex items-center gap-2 bg-green-900/30 border border-green-700/40 rounded-full px-3 py-1.5">
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-black text-green-400 uppercase tracking-wide">PR-VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* National Rankings */}
        {ratings && ratings.metrics.length > 0 && (
          <div className="rounded-2xl border border-blue-800/40 bg-gradient-to-br from-blue-950/30 to-gray-900 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-0.5">National Rankings</p>
                <p className="text-sm text-gray-400">LB · Class of 2027 · {ratings.comparedAgainst}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white">{ratings.overallPercentile}<span className="text-sm font-normal text-gray-400">th</span></p>
                <p className="text-xs text-blue-400 font-semibold">National Overall</p>
              </div>
            </div>
            <div className="space-y-3">
              {ratings.metrics.slice(0, 4).map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{m.label} <span className="text-white font-semibold">{m.value}{m.unit}</span></span>
                    <span className="text-blue-300 font-bold">{m.nationalPercentile}th national · {m.texasPercentile}th TX</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${m.nationalPercentile}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Since Baseline */}
        {improvements.length > 0 && (
          <div className="rounded-2xl border border-green-800/40 bg-gradient-to-br from-green-950/30 to-gray-900 p-5">
            <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">📈 Progress Since Baseline</p>
            <div className="grid grid-cols-2 gap-3">
              {improvements.map(imp => (
                <div key={imp.label} className="bg-green-900/20 border border-green-800/40 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">{imp.label}</p>
                  <div className="flex items-end gap-1.5">
                    <span className="text-base font-black text-white">{imp.to}{imp.unit}</span>
                    <span className="text-xs text-green-400 font-bold mb-0.5">
                      +{imp.pct.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">from {imp.from}{imp.unit}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Metrics */}
        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Current Metrics — Most Recent Session</p>
          <div className="grid grid-cols-2 gap-3">
            {METRICS.map(m => {
              const val = current[m.key as keyof typeof current] as number | undefined
              if (!val) return null
              const baseVal = baseline[m.key as keyof typeof baseline] as number | undefined
              const imp = baseVal != null ? (m.lower ? baseVal - val : val - baseVal) : 0
              return (
                <div key={m.key} className="bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">{m.label}</p>
                  <p className="text-lg font-black text-white">{val}{m.unit}</p>
                  {imp > 0 && baseVal != null && (
                    <p className="text-xs text-green-400 font-semibold mt-0.5">
                      ↑ {m.lower ? "-" : "+"}{Math.abs(val - baseVal).toFixed(2).replace(/\.?0+$/, "")}{m.unit} since baseline
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Session History */}
        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Session History</p>
          <div className="space-y-2">
            {SAMPLE_SESSIONS.map((s, i) => (
              <div key={s.date} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16">{new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}</span>
                  <span className="text-xs text-gray-500">{i === 0 ? "Baseline" : `Session ${i + 1}`}</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-400">40yd: <span className="text-white font-semibold">{s.fortyYard}s</span></span>
                  <span className="text-gray-400">Vert: <span className="text-white font-semibold">{s.verticalJump}"</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-red-700/40 bg-gradient-to-br from-red-950/40 to-gray-900 p-6 text-center">
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Ready to Build Yours?</p>
          <h2 className="text-xl font-black text-white mb-2">This could be your athlete's passport.</h2>
          <p className="text-sm text-gray-400 mb-5">Book one training session. We measure everything on site. Your passport goes live the same day.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register?program=recruit"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-6 py-3 rounded-xl text-sm transition-colors">
              Get My Passport
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <Link href="/passport"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
              Back to Passport Page
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
