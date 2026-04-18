import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Redis from "ioredis"
import LogoutButton from "@/components/logout-button"
import ProgressReportDownload from "@/components/progress-report-download"
import SendTrainingReport from "@/components/send-training-report"
import FeaturedToggle from "@/components/featured-toggle"
import ProgressChart from "@/components/progress-chart"
import DeleteSessionButton from "@/components/delete-session-button"
import InviteParentButton from "@/components/invite-parent-button"
import { calculateRatings } from "@/lib/athlete-ratings"
import { gradeToClassYear } from "@/lib/grade-to-class-year"
import { getAllParents } from "@/lib/parent-store"

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
  { key: "fortyYard", label: "40-Yard Dash", unit: "sec", lower: true },
  { key: "twentyYard", label: "20-Yard Dash", unit: "sec", lower: true },
  { key: "shuttle", label: "5-10-5 Shuttle", unit: "sec", lower: true },
  { key: "threeCone", label: "3-Cone Drill", unit: "sec", lower: true },
  { key: "verticalJump", label: "Vertical Jump", unit: "in", lower: false },
  { key: "broadJump", label: "Broad Jump", unit: "in", lower: false },
  { key: "benchPress", label: "Bench Press", unit: "reps", lower: false },
] as const

function fmt(val: number, unit: string) {
  if (unit === "sec") return `${val}s`
  if (unit === "in") return `${val}"`
  return `${val}`
}

function impColor(imp: number) {
  if (imp > 0) return "text-green-400"
  if (imp < 0) return "text-red-400"
  return "text-gray-500"
}

function impBg(imp: number) {
  if (imp > 0) return "bg-green-900/40 border-green-800"
  if (imp < 0) return "bg-red-900/30 border-red-900"
  return "bg-gray-800 border-gray-700"
}

export default async function TrainingAthletePage({ params }: { params: { id: string } }) {
  const [athlete, allParents] = await Promise.all([
    getAthlete(params.id),
    getAllParents().catch(() => []),
  ])
  if (!athlete) notFound()
  const linkedParent = allParents.find(p => p.athleteIds.includes(params.id.toUpperCase()))

  const sessions = athlete.sessions ?? []
  const baseline = sessions[0]
  const current = sessions[sessions.length - 1]
  const hasProgress = sessions.length >= 2

  // Calculate rankings using most recent session metrics
  const latestSession = sessions[sessions.length - 1]
  const classYear = gradeToClassYear(athlete.grade ?? "")
  const ratings = latestSession ? calculateRatings({
    fortyYard: latestSession.fortyYard,
    twentyYard: latestSession.twentyYard,
    shuttle: latestSession.shuttle,
    threeCone: latestSession.threeCone,
    verticalJump: latestSession.verticalJump,
    broadJump: latestSession.broadJump,
    benchPress: latestSession.benchPress,
  }, athlete.position ?? "", classYear) : null

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="border-b border-gray-800 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={36} height={36} className="object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{athlete.name}</h1>
                {athlete.sport === "soccer"
                  ? <span className="text-xs bg-green-800 text-green-300 px-2 py-0.5 rounded-full font-semibold">⚽ Soccer</span>
                  : <span className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded-full font-semibold">🏈 Football</span>
                }
              </div>
              <p className="text-gray-400 text-sm">{athlete.age} yrs · {athlete.grade} · {athlete.school || "—"}</p>
              <Link href="/training" className="text-xs text-gray-600 hover:text-gray-400 underline mt-0.5 block">← Training Roster</Link>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <FeaturedToggle id={athlete.id} initialFeatured={athlete.featured ?? false} />
            {/* Parent linked indicator */}
            {linkedParent ? (
              <span className="text-xs bg-green-900/50 border border-green-700/50 text-green-300 px-3 py-2 rounded-xl font-semibold">
                ✓ Parent: {linkedParent.name}
              </span>
            ) : (
              <InviteParentButton athleteId={athlete.id} athleteName={athlete.name} />
            )}
            <Link href={`/admin/athletes/new?mode=prv&name=${encodeURIComponent(athlete.name)}&position=${encodeURIComponent(athlete.position ?? "")}&school=${encodeURIComponent(athlete.school ?? "")}&gradYear=${encodeURIComponent(classYear ?? "")}`}
              className="bg-yellow-700 hover:bg-yellow-600 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors">
              🔴 Add PR-V Seal
            </Link>
            <Link href={`/training/${athlete.id}/edit`}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
              Edit Info
            </Link>
            <Link href={`/training/${athlete.id}/session`}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
              + Add Test
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Athlete info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Position", value: athlete.position || "—" },
            { label: "Sessions", value: sessions.length },
            { label: "Member Since", value: new Date(athlete.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
            { label: "Athlete ID", value: athlete.id },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-900 rounded-xl px-4 py-3 border border-gray-800">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
              <p className="text-white font-semibold text-sm">{value}</p>
            </div>
          ))}
        </div>

        {sessions.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 flex flex-col items-center gap-4 text-gray-500">
            <p className="text-lg">No test sessions yet.</p>
            <Link href={`/training/${athlete.id}/session`}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
              Record Baseline Test
            </Link>
          </div>
        ) : (
          <>
            {/* Progress Snapshot */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">
                    {hasProgress ? "Progress Snapshot — Baseline vs. Current" : "Baseline Measurements"}
                  </p>
                  {hasProgress && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {sessions.length} sessions · {new Date(baseline.date).toLocaleDateString()} → {new Date(current.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {hasProgress && <span className="text-xs text-green-400 font-semibold">{sessions.length - 1} month{sessions.length > 2 ? "s" : ""} of data</span>}
              </div>

              <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                {METRICS.map(m => {
                  const bVal = baseline[m.key as keyof typeof baseline] as number | undefined
                  const cVal = hasProgress ? current[m.key as keyof typeof current] as number | undefined : undefined
                  // Find first session with this metric (baseline may predate when the metric was added)
                  const firstVal = bVal != null ? bVal : sessions.find(s => s[m.key as keyof typeof s] != null)?.[m.key as keyof typeof s] as number | undefined
                  if (firstVal == null && cVal == null) return null
                  const refVal = firstVal ?? cVal!
                  const imp = (firstVal != null && cVal != null) ? (m.lower ? firstVal - cVal : cVal - firstVal) : 0
                  const pct = (firstVal != null && cVal != null) ? ((Math.abs(imp) / firstVal) * 100).toFixed(1) : null
                  const hasComparison = firstVal != null && cVal != null

                  return (
                    <div key={m.key} className={`rounded-xl px-4 py-3 border ${hasComparison ? impBg(imp) : "bg-gray-800 border-gray-700"}`}>
                      <p className="text-xs text-gray-400 mb-1">{m.label}</p>
                      <div className="flex items-end justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-xs text-gray-500">{bVal != null ? "Baseline" : "First"}</p>
                            <p className="text-white font-bold">{fmt(refVal, m.unit)}</p>
                          </div>
                          {hasComparison && (
                            <>
                              <span className="text-gray-600 text-lg">→</span>
                              <div>
                                <p className="text-xs text-gray-400">Current</p>
                                <p className="text-white font-bold">{fmt(cVal!, m.unit)}</p>
                              </div>
                            </>
                          )}
                          {!hasComparison && cVal != null && firstVal == null && (
                            <>
                              <span className="text-gray-600 text-lg">→</span>
                              <div>
                                <p className="text-xs text-gray-400">Current</p>
                                <p className="text-white font-bold">{fmt(cVal, m.unit)}</p>
                              </div>
                            </>
                          )}
                        </div>
                        {hasComparison && pct && (
                          <div className="text-right">
                            <p className={`text-lg font-bold ${impColor(imp)}`}>
                              {m.lower ? (imp >= 0 ? `-${imp.toFixed(2)}s` : `+${Math.abs(imp).toFixed(2)}s`) : (imp >= 0 ? `+${imp.toFixed(1)}"` : `-${Math.abs(imp).toFixed(1)}"`)}
                            </p>
                            <p className={`text-xs ${impColor(imp)}`}>{imp > 0 ? "+" : imp < 0 ? "-" : ""}{pct}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Prospect Rankings */}
            {ratings && ratings.metrics.length > 0 && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Prospect Rankings</p>
                    <p className="text-xs text-gray-500 mt-0.5">{ratings.positionGroup} · {ratings.comparedAgainst.split("·").pop()?.trim()}</p>
                  </div>
                </div>

                {/* Overall percentile */}
                <div className="px-6 pt-5 pb-2 grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">National Percentile</p>
                    <p className="text-3xl font-black text-white">{ratings.overallPercentile}<span className="text-lg text-gray-400">th</span></p>
                    <div className="mt-2 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                      <div className="h-full rounded-full bg-red-500" style={{ width: `${ratings.overallPercentile}%` }} />
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Texas Percentile</p>
                    <p className="text-3xl font-black text-white">{ratings.texasPercentile}<span className="text-lg text-gray-400">th</span></p>
                    <div className="mt-2 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                      <div className="h-full rounded-full bg-orange-500" style={{ width: `${ratings.texasPercentile}%` }} />
                    </div>
                  </div>
                </div>

                {/* Per-metric breakdown */}
                <div className="px-6 pb-5 space-y-3 mt-3">
                  {ratings.metrics.map(m => (
                    <div key={m.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-300">{m.label}</span>
                          <span className="text-xs text-gray-600">
                            {m.unit === "sec" ? `${m.value}s` : m.unit === "in" ? `${m.value}"` : `${m.value} reps`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className={`font-semibold ${m.nationalPercentile >= 75 ? "text-green-400" : m.nationalPercentile >= 50 ? "text-yellow-400" : "text-gray-400"}`}>
                            {m.nationalPercentile}th <span className="text-gray-600 font-normal">Nat.</span>
                          </span>
                          <span className={`font-semibold ${m.texasPercentile >= 75 ? "text-green-400" : m.texasPercentile >= 50 ? "text-yellow-400" : "text-gray-400"}`}>
                            {m.texasPercentile}th <span className="text-gray-600 font-normal">TX</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            m.rank === "Elite" ? "bg-yellow-900/50 text-yellow-300" :
                            m.rank === "Excellent" ? "bg-green-900/50 text-green-300" :
                            m.rank === "Above Average" ? "bg-blue-900/40 text-blue-300" :
                            "bg-gray-800 text-gray-400"
                          }`}>{m.rank}</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            m.nationalPercentile >= 75 ? "bg-green-500" :
                            m.nationalPercentile >= 50 ? "bg-yellow-500" :
                            "bg-gray-600"
                          }`}
                          style={{ width: `${m.nationalPercentile}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-800 px-6 py-3">
                  <p className="text-xs text-gray-600 italic">{ratings.description}</p>
                </div>
              </div>
            )}

            {/* Shuttle L vs R Analysis */}
            {(() => {
              const latest = sessions.filter((s: { shuttleLeft?: number; shuttleRight?: number }) => s.shuttleLeft != null || s.shuttleRight != null).slice(-1)[0]
              if (!latest) return null
              const L = latest.shuttleLeft
              const R = latest.shuttleRight
              if (L == null || R == null) return null
              const diff = Math.abs(L - R).toFixed(2)
              const weaker = L > R ? "Left" : R > L ? "Right" : null
              const stronger = L < R ? "Left" : R < L ? "Right" : null
              const pct = ((Math.abs(L - R) / Math.min(L, R)) * 100).toFixed(1)
              return (
                <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                  <div className="bg-gray-800 px-6 py-4">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">5-10-5 Shuttle — Left vs Right Analysis</p>
                    <p className="text-xs text-gray-500 mt-0.5">Identifies lateral dominance and movement imbalance</p>
                  </div>
                  <div className="px-6 py-5">
                    {/* L vs R bars */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className={`rounded-xl px-4 py-4 border text-center ${L > R ? "bg-red-950/30 border-red-900/50" : "bg-green-900/20 border-green-800/50"}`}>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Left Start</p>
                        <p className="text-3xl font-black text-white">{L}<span className="text-lg text-gray-400">s</span></p>
                        {weaker === "Left" && <p className="text-xs text-red-400 font-semibold mt-1">Weaker side</p>}
                        {stronger === "Left" && <p className="text-xs text-green-400 font-semibold mt-1">Stronger side</p>}
                      </div>
                      <div className={`rounded-xl px-4 py-4 border text-center ${R > L ? "bg-red-950/30 border-red-900/50" : "bg-green-900/20 border-green-800/50"}`}>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Right Start</p>
                        <p className="text-3xl font-black text-white">{R}<span className="text-lg text-gray-400">s</span></p>
                        {weaker === "Right" && <p className="text-xs text-red-400 font-semibold mt-1">Weaker side</p>}
                        {stronger === "Right" && <p className="text-xs text-green-400 font-semibold mt-1">Stronger side</p>}
                      </div>
                    </div>

                    {/* Visual bar comparison */}
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-6">L</span>
                        <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${L > R ? "bg-red-500" : "bg-green-500"}`}
                            style={{ width: `${Math.min((L / Math.max(L, R)) * 100, 100)}%` }} />
                        </div>
                        <span className="text-xs text-white font-mono w-10 text-right">{L}s</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-6">R</span>
                        <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${R > L ? "bg-red-500" : "bg-green-500"}`}
                            style={{ width: `${Math.min((R / Math.max(L, R)) * 100, 100)}%` }} />
                        </div>
                        <span className="text-xs text-white font-mono w-10 text-right">{R}s</span>
                      </div>
                    </div>

                    {/* Imbalance callout */}
                    {weaker ? (
                      <div className="bg-yellow-950/40 border border-yellow-800/50 rounded-xl px-4 py-3">
                        <p className="text-yellow-300 font-semibold text-sm">
                          {pct}% imbalance detected — {diff}s difference
                        </p>
                        <p className="text-yellow-500 text-xs mt-1">
                          {weaker}-side start is slower. Focus training on {weaker.toLowerCase()} lateral drive, first-step explosion, and hip rotation to close the gap.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-green-950/30 border border-green-800/50 rounded-xl px-4 py-3">
                        <p className="text-green-300 font-semibold text-sm">Balanced — no significant side difference</p>
                        <p className="text-green-600 text-xs mt-1">Equal lateral quickness from both sides. Excellent symmetry.</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}

            {/* Progress Chart */}
            <ProgressChart sessions={sessions} />

            {/* Session history table */}
            {sessions.length > 1 && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="bg-gray-800 px-6 py-4">
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Session History</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 uppercase tracking-wider">
                        <th className="text-left px-4 py-3">Date</th>
                        <th className="text-left px-4 py-3">40-Yd</th>
                        <th className="text-left px-4 py-3">20-Yd Sprint</th>
                        <th className="text-left px-4 py-3">5-10-5 (L / R)</th>
                        <th className="text-left px-4 py-3">3-Cone</th>
                        <th className="text-left px-4 py-3">Vertical</th>
                        <th className="text-left px-4 py-3">Broad</th>
                        <th className="text-left px-4 py-3">Bench</th>
                        <th className="text-left px-4 py-3">Weight</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...sessions].reverse().map((s: typeof sessions[0], i: number) => {
                        const realIndex = sessions.length - 1 - i
                        return (
                        <tr key={i} className={`border-b border-gray-800 ${i === 0 ? "bg-gray-800/50" : ""}`}>
                          <td className="px-4 py-3 font-semibold text-white">
                            {new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                            {i === 0 && <span className="ml-1 text-xs text-green-400">(latest)</span>}
                          </td>
                          <td className="px-4 py-3 text-gray-300">{s.fortyYard != null ? `${s.fortyYard}s` : "—"}</td>
                          <td className="px-4 py-3 text-gray-300">{s.twentyYard != null ? `${s.twentyYard}s` : "—"}</td>
                          <td className="px-4 py-3 text-gray-300">
                            {s.shuttle != null ? `${s.shuttle}s` : "—"}
                            {(s.shuttleLeft != null || s.shuttleRight != null) && (
                              <span className="block text-xs text-gray-500 mt-0.5">
                                L: {s.shuttleLeft != null ? `${s.shuttleLeft}s` : "—"} · R: {s.shuttleRight != null ? `${s.shuttleRight}s` : "—"}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-300">{s.threeCone != null ? `${s.threeCone}s` : "—"}</td>
                          <td className="px-4 py-3 text-gray-300">{s.verticalJump != null ? `${s.verticalJump}"` : "—"}</td>
                          <td className="px-4 py-3 text-gray-300">{s.broadJump != null ? `${s.broadJump}"` : "—"}</td>
                          <td className="px-4 py-3 text-gray-300">{s.benchPress != null ? `${s.benchPress}` : "—"}</td>
                          <td className="px-4 py-3 text-gray-300">{s.weight != null ? `${s.weight} lbs` : "—"}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <Link href={`/training/${athlete.id}/session/edit?i=${realIndex}`}
                                className="text-xs bg-gray-700 hover:bg-gray-600 px-2.5 py-1 rounded-lg transition-colors text-gray-300">
                                Edit
                              </Link>
                              <DeleteSessionButton athleteId={athlete.id} sessionIndex={realIndex} sessionDate={s.date} />
                            </div>
                          </td>
                        </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Coach Notes */}
            {athlete.coachNotes && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 px-6 py-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Coach Notes</p>
                <p className="text-gray-300 text-sm leading-relaxed">{athlete.coachNotes}</p>
              </div>
            )}

            {/* Send report */}
            <SendTrainingReport athlete={athlete} />

            {/* Download report */}
            <ProgressReportDownload athlete={athlete} />
          </>
        )}

      </div>
    </div>
  )
}
