"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Fragment } from "react"

const ProgressChart = dynamic(() => import("@/components/progress-chart"), { ssr: false })

const METRICS = [
  { key: "fortyYard",    label: "40-Yard Dash",    unit: "s",     lower: true  },
  { key: "twentyYard",   label: "20-Yard Dash",    unit: "s",     lower: true  },
  { key: "shuttle",      label: "Shuttle",          unit: "s",     lower: true  },
  { key: "threeCone",    label: "3-Cone / L-Drill", unit: "s",     lower: true  },
  { key: "verticalJump", label: "Vertical Jump",    unit: '"',     lower: false },
  { key: "broadJump",    label: "Broad Jump",       unit: '"',     lower: false },
  { key: "benchPress",   label: "Bench Press",      unit: " reps", lower: false },
  { key: "weight",       label: "Weight",           unit: " lbs",  lower: false },
] as const

interface Session {
  date: string
  fortyYard?: number; twentyYard?: number; shuttle?: number; shuttleLeft?: number; shuttleRight?: number
  threeCone?: number; verticalJump?: number; broadJump?: number
  benchPress?: number; weight?: number; notes?: string
}
interface Athlete {
  id: string; name: string; age: number; grade: string
  school: string; position?: string; joinedAt: string; sessions: Session[]
}
interface Parent {
  email: string; name: string; tier: string
  approvalStatus?: string
  subscriptionStatus?: string; subscriptionEnd?: string; athleteIds: string[]
}

function fmt(val: number | undefined, unit: string) {
  if (val == null) return "—"
  return `${val}${unit}`
}

function Portal() {
  const [parent, setParent] = useState<Parent | null>(null)
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [prvRecords, setPrvRecords] = useState<Record<string, { code: string; verifyUrl: string } | null>>({})
  const [loading, setLoading] = useState(true)
  const [managingBilling, setManagingBilling] = useState(false)
  const [activeTab, setActiveTab] = useState<Record<string, "overview" | "history" | "chart">>({})
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get("success")

  useEffect(() => {
    fetch("/api/parent/me")
      .then(r => r.json())
      .then(data => {
        if (!data.success) { router.push("/parent/login"); return }
        setParent(data.parent)
        setAthletes(data.athletes)
        setLoading(false)
        // Fetch PR-V records for each athlete by name
        data.athletes.forEach((a: Athlete) => {
          fetch(`/api/athletes?name=${encodeURIComponent(a.name)}`)
            .then(r => r.json())
            .then(prv => {
              if (prv.success && prv.athlete?.code) {
                setPrvRecords(prev => ({ ...prev, [a.id]: {
                  code: prv.athlete.code,
                  verifyUrl: `https://polyrisefootball.com/verify/${prv.athlete.code}`,
                }}))
              }
            })
            .catch(() => {})
        })
      })
      .catch(() => router.push("/parent/login"))
  }, [router])

  const handleLogout = async () => {
    await fetch("/api/parent/logout", { method: "POST" })
    router.push("/parent/login")
  }

  const handleManageBilling = async () => {
    setManagingBilling(true)
    const res = await fetch("/api/stripe/billing-portal", { method: "POST" })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    setManagingBilling(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">Loading your portal...</div>
  )

  // Program members always have access regardless of subscriptionStatus
  const hasAccess =
    (parent?.tier === "program" && parent?.approvalStatus === "approved") ||
    (parent?.tier !== "none" && parent?.tier !== "program" && parent?.subscriptionStatus !== "canceled")

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={36} height={36} className="object-contain" />
            <div>
              <p className="text-white font-bold">Welcome, {parent?.name}</p>
              <p className="text-gray-500 text-xs">{parent?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasAccess && (
              <button onClick={handleManageBilling} disabled={managingBilling}
                className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors">
                {managingBilling ? "Loading..." : "Manage Billing"}
              </button>
            )}
            <button onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-gray-300 border border-gray-700 px-3 py-1.5 rounded-lg transition-colors">
              Sign Out
            </button>
          </div>
        </div>

        {/* Success banner */}
        {success && (
          <div className="bg-green-900 border border-green-700 rounded-xl px-4 py-3 text-green-300 text-sm">
            ✓ Subscription activated! Your athlete&apos;s profile will appear below once linked by PolyRISE staff.
          </div>
        )}

        {/* Subscription status */}
        {parent?.approvalStatus === "pending" ? (
          <div className="bg-yellow-950 border border-yellow-800 rounded-xl px-4 py-3 text-sm text-yellow-300">
            <p className="font-bold">⏳ Approval Pending</p>
            <p className="text-yellow-500 text-xs mt-1">Your PolyRISE Program Member request is being reviewed. You will receive an email once your athlete&apos;s profile is ready to view.</p>
            <p className="text-yellow-600 text-xs mt-1">Questions? Call (817) 658-3300</p>
          </div>
        ) : parent?.approvalStatus === "denied" ? (
          <div className="bg-red-950 border border-red-900 rounded-xl px-4 py-3 text-sm text-red-300">
            <p className="font-bold">Access Not Confirmed</p>
            <p className="text-red-400 text-xs mt-1">We could not verify your program enrollment. Subscribe below to access your athlete&apos;s profile.</p>
            <Link href="/parent/register" className="inline-block mt-2 text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded-lg">Subscribe Now →</Link>
          </div>
        ) : (
          <div className={`rounded-xl px-4 py-3 border text-sm ${
            parent?.tier === "program" ? "bg-blue-950 border-blue-800 text-blue-300" :
            hasAccess ? "bg-green-950 border-green-800 text-green-300" :
            "bg-red-950 border-red-900 text-red-300"
          }`}>
            {parent?.tier === "program" ? (
              <p><span className="font-bold">PolyRISE Program Member</span> — Full access included</p>
            ) : hasAccess ? (
              <p><span className="font-bold capitalize">{parent?.tier} Subscriber</span>
                {parent?.subscriptionEnd && ` · Renews ${new Date(parent.subscriptionEnd).toLocaleDateString()}`}
              </p>
            ) : (
              <p>No active subscription. <Link href="/parent/register" className="underline font-bold">Subscribe to view reports →</Link></p>
            )}
          </div>
        )}

        {/* No athletes linked */}
        {athletes.length === 0 && hasAccess && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center space-y-3">
            <p className="text-gray-400 font-semibold">No athletes linked yet</p>
            <p className="text-gray-600 text-sm">Contact PolyRISE Football to link your athlete to this account.</p>
            <p className="text-gray-600 text-sm">(817) 658-3300 · polyrise@polyrisefootball.com</p>
          </div>
        )}

        {/* Athlete profiles */}
        {hasAccess && athletes.map((athlete) => {
          const sessions = athlete.sessions ?? []
          const baseline = sessions[0]
          const current = sessions[sessions.length - 1]
          const hasProgress = sessions.length >= 2
          const tab = activeTab[athlete.id] ?? "overview"

          // L/R shuttle analysis
          const lrSessions = sessions.filter(s => s.shuttleLeft != null && s.shuttleRight != null)
          const latestLR = lrSessions[lrSessions.length - 1]
          const hasLR = latestLR != null

          return (
            <div key={athlete.id} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">

              {/* Athlete header */}
              <div className="bg-gray-800 px-6 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-bold text-xl">{athlete.name}</p>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {athlete.age} yrs · {athlete.grade} · {athlete.school || "—"}
                      {athlete.position ? ` · ${athlete.position}` : ""}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {sessions.length} session{sessions.length !== 1 ? "s" : ""} recorded · Member since {new Date(athlete.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                  {prvRecords[athlete.id] && (
                    <a href={prvRecords[athlete.id]!.verifyUrl} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 flex flex-col items-center bg-red-950/60 border border-red-800/50 rounded-xl px-3 py-2 hover:bg-red-900/60 transition-colors">
                      <span className="text-red-400 text-xs font-bold uppercase tracking-widest">PR-VERIFIED</span>
                      <span className="font-mono text-white text-xs font-bold mt-0.5">{prvRecords[athlete.id]!.code}</span>
                      <span className="text-red-600 text-xs mt-0.5">View Seal →</span>
                    </a>
                  )}
                </div>
              </div>

              {sessions.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-600 text-sm">No test sessions recorded yet.</div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="flex border-b border-gray-800">
                    {(["overview", "history", "chart"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setActiveTab(prev => ({ ...prev, [athlete.id]: t }))}
                        className={`px-5 py-3 text-sm font-medium capitalize transition-colors ${
                          tab === t
                            ? "border-b-2 border-red-500 text-white"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {t === "chart" ? "Progress Chart" : t === "history" ? "Full History" : "Overview"}
                      </button>
                    ))}
                  </div>

                  {/* Overview tab */}
                  {tab === "overview" && (
                    <div className="px-6 py-5 space-y-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        {hasProgress ? "Baseline → Current Progress" : "Baseline Measurements"}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {METRICS.map(m => {
                          const bVal = baseline?.[m.key] as number | undefined
                          const cVal = hasProgress ? current?.[m.key] as number | undefined : undefined
                          if (bVal == null) return null
                          const imp = cVal != null ? (m.lower ? bVal - cVal : cVal - bVal) : 0
                          const improved = imp > 0
                          const pct = cVal != null ? ((Math.abs(imp) / bVal) * 100).toFixed(1) : null

                          return (
                            <div key={m.key} className={`rounded-xl px-4 py-3 border ${
                              hasProgress && cVal != null
                                ? improved ? "bg-green-950/30 border-green-900" : imp < 0 ? "bg-red-950/20 border-red-900" : "bg-gray-800 border-gray-700"
                                : "bg-gray-800 border-gray-700"
                            }`}>
                              <p className="text-xs text-gray-400 mb-2">{m.label}</p>
                              <div className="flex items-end justify-between">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <p className="text-xs text-gray-500">Start</p>
                                    <p className="text-white font-bold">{bVal}{m.unit}</p>
                                  </div>
                                  {hasProgress && cVal != null && (
                                    <>
                                      <span className="text-gray-600">→</span>
                                      <div>
                                        <p className="text-xs text-gray-400">Now</p>
                                        <p className="text-white font-bold">{cVal}{m.unit}</p>
                                      </div>
                                    </>
                                  )}
                                </div>
                                {hasProgress && cVal != null && pct && (
                                  <p className={`text-sm font-bold ${improved ? "text-green-400" : imp < 0 ? "text-red-400" : "text-gray-500"}`}>
                                    {improved ? "+" : ""}{pct}%
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* L/R Shuttle Analysis */}
                      {hasLR && (
                        <div className="mt-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Lateral Speed Analysis</p>
                          <div className="flex gap-4 mb-3">
                            <div className="flex-1 bg-blue-950/40 border border-blue-800 rounded-lg px-4 py-3 text-center">
                              <p className="text-xs text-blue-400 mb-1">Left Side</p>
                              <p className="text-2xl font-bold text-white">{latestLR.shuttleLeft}s</p>
                            </div>
                            <div className="flex-1 bg-purple-950/40 border border-purple-800 rounded-lg px-4 py-3 text-center">
                              <p className="text-xs text-purple-400 mb-1">Right Side</p>
                              <p className="text-2xl font-bold text-white">{latestLR.shuttleRight}s</p>
                            </div>
                          </div>
                          {(() => {
                            const diff = Math.abs((latestLR.shuttleLeft ?? 0) - (latestLR.shuttleRight ?? 0))
                            const slower = (latestLR.shuttleLeft ?? 0) > (latestLR.shuttleRight ?? 0) ? "Left" : "Right"
                            const pct = (latestLR.shuttleLeft && latestLR.shuttleRight)
                              ? ((diff / Math.min(latestLR.shuttleLeft, latestLR.shuttleRight)) * 100).toFixed(1)
                              : null
                            if (diff < 0.05) return <p className="text-xs text-green-400 text-center">✓ Lateral speed is well balanced</p>
                            return <p className="text-xs text-yellow-400 text-center">{slower} side is {diff.toFixed(2)}s slower ({pct}% imbalance) — focus area for training</p>
                          })()}
                        </div>
                      )}

                      <div className="border-t border-gray-800 pt-3">
                        <p className="text-xs text-gray-600">
                          Test dates: {sessions.map(s => new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })).join(" · ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Full History tab */}
                  {tab === "history" && (
                    <div className="px-4 py-5 overflow-x-auto">
                      <table className="w-full text-sm min-w-[600px]">
                        <thead>
                          <tr className="text-xs text-gray-500 border-b border-gray-800">
                            <th className="text-left py-2 px-2">Date</th>
                            <th className="text-right py-2 px-2">40-Yd</th>
                            <th className="text-right py-2 px-2">20-Yd</th>
                            <th className="text-right py-2 px-2">Shuttle</th>
                            <th className="text-right py-2 px-2">L / R</th>
                            <th className="text-right py-2 px-2">3-Cone</th>
                            <th className="text-right py-2 px-2">Vert</th>
                            <th className="text-right py-2 px-2">Broad</th>
                            <th className="text-right py-2 px-2">Bench</th>
                            <th className="text-right py-2 px-2">Wt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.map((s, i) => (
                            <Fragment key={i}>
                              <tr className={`border-b border-gray-800/50 ${i === 0 ? "text-blue-300" : i === sessions.length - 1 && sessions.length > 1 ? "text-green-300" : "text-gray-300"}`}>
                                <td className="py-2 px-2 whitespace-nowrap">
                                  {new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                  {i === 0 && <span className="ml-1 text-xs text-blue-500">(baseline)</span>}
                                </td>
                                <td className="text-right py-2 px-2">{fmt(s.fortyYard, "s")}</td>
                                <td className="text-right py-2 px-2">{fmt(s.twentyYard, "s")}</td>
                                <td className="text-right py-2 px-2">{fmt(s.shuttle, "s")}</td>
                                <td className="text-right py-2 px-2 text-xs">
                                  {s.shuttleLeft != null && s.shuttleRight != null
                                    ? `${s.shuttleLeft}/${s.shuttleRight}`
                                    : "—"}
                                </td>
                                <td className="text-right py-2 px-2">{fmt(s.threeCone, "s")}</td>
                                <td className="text-right py-2 px-2">{fmt(s.verticalJump, '"')}</td>
                                <td className="text-right py-2 px-2">{fmt(s.broadJump, '"')}</td>
                                <td className="text-right py-2 px-2">{fmt(s.benchPress, "")}</td>
                                <td className="text-right py-2 px-2">{fmt(s.weight, "")}</td>
                              </tr>
                              {s.notes && (
                                <tr className="border-b border-gray-800/30">
                                  <td colSpan={9} className="px-2 pb-2 pt-0 text-xs text-gray-500 italic">
                                    Note: {s.notes}
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Chart tab */}
                  {tab === "chart" && (
                    <div className="px-4 py-5">
                      <ProgressChart sessions={sessions} />
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}

        <p className="text-center text-gray-700 text-xs pb-4">
          PolyRISE Football · (817) 658-3300 · polyrise@polyrisefootball.com
        </p>
      </div>
    </div>
  )
}

export default function ParentPortalPage() {
  return <Suspense><Portal /></Suspense>
}
