import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Redis from "ioredis"
import LogoutButton from "@/components/logout-button"
import ProgressReportDownload from "@/components/progress-report-download"
import SendTrainingReport from "@/components/send-training-report"

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
  { key: "shuttle", label: "20-Yd Shuttle", unit: "sec", lower: true },
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
  const athlete = await getAthlete(params.id)
  if (!athlete) notFound()

  const sessions = athlete.sessions ?? []
  const baseline = sessions[0]
  const current = sessions[sessions.length - 1]
  const hasProgress = sessions.length >= 2

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="border-b border-gray-800 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={36} height={36} className="object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-white">{athlete.name}</h1>
              <p className="text-gray-400 text-sm">{athlete.age} yrs · {athlete.grade} · {athlete.school || "—"}</p>
              <Link href="/training" className="text-xs text-gray-600 hover:text-gray-400 underline mt-0.5 block">← Training Roster</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
                  if (bVal == null) return null
                  const imp = cVal != null ? (m.lower ? bVal - cVal : cVal - bVal) : 0
                  const pct = cVal != null ? ((Math.abs(imp) / bVal) * 100).toFixed(1) : null

                  return (
                    <div key={m.key} className={`rounded-xl px-4 py-3 border ${hasProgress && cVal != null ? impBg(imp) : "bg-gray-800 border-gray-700"}`}>
                      <p className="text-xs text-gray-400 mb-1">{m.label}</p>
                      <div className="flex items-end justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-xs text-gray-500">Baseline</p>
                            <p className="text-white font-bold">{fmt(bVal, m.unit)}</p>
                          </div>
                          {hasProgress && cVal != null && (
                            <>
                              <span className="text-gray-600 text-lg">→</span>
                              <div>
                                <p className="text-xs text-gray-400">Current</p>
                                <p className="text-white font-bold">{fmt(cVal, m.unit)}</p>
                              </div>
                            </>
                          )}
                        </div>
                        {hasProgress && cVal != null && pct && (
                          <div className="text-right">
                            <p className={`text-lg font-bold ${impColor(imp)}`}>
                              {imp > 0 ? "+" : imp < 0 ? "" : ""}{m.lower ? (imp >= 0 ? `-${imp.toFixed(2)}s` : `+${Math.abs(imp).toFixed(2)}s`) : (imp >= 0 ? `+${imp.toFixed(1)}"` : `-${Math.abs(imp).toFixed(1)}"`)}
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
                        <th className="text-left px-4 py-3">Shuttle</th>
                        <th className="text-left px-4 py-3">3-Cone</th>
                        <th className="text-left px-4 py-3">Vertical</th>
                        <th className="text-left px-4 py-3">Broad</th>
                        <th className="text-left px-4 py-3">Bench</th>
                        <th className="text-left px-4 py-3">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...sessions].reverse().map((s: typeof sessions[0], i: number) => (
                        <tr key={i} className={`border-b border-gray-800 ${i === 0 ? "bg-gray-800/50" : ""}`}>
                          <td className="px-4 py-3 font-semibold text-white">
                            {new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                            {i === 0 && <span className="ml-1 text-xs text-green-400">(latest)</span>}
                          </td>
                          <td className="px-4 py-3 text-gray-300">{s.fortyYard != null ? `${s.fortyYard}s` : "—"}</td>
                          <td className="px-4 py-3 text-gray-300">{s.shuttle != null ? `${s.shuttle}s` : "—"}</td>
                          <td className="px-4 py-3 text-gray-300">{s.threeCone != null ? `${s.threeCone}s` : "—"}</td>
                          <td className="px-4 py-3 text-gray-300">{s.verticalJump != null ? `${s.verticalJump}"` : "—"}</td>
                          <td className="px-4 py-3 text-gray-300">{s.broadJump != null ? `${s.broadJump}"` : "—"}</td>
                          <td className="px-4 py-3 text-gray-300">{s.benchPress != null ? `${s.benchPress}` : "—"}</td>
                          <td className="px-4 py-3 text-gray-300">{s.weight != null ? `${s.weight} lbs` : "—"}</td>
                        </tr>
                      ))}
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
