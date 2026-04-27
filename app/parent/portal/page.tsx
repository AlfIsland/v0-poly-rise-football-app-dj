"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import AthletePhotoUpload from "@/components/athlete-photo-upload"
import CoachOutreach from "@/components/coach-outreach"
import CampSuggestions from "@/components/camp-suggestions"
import { Fragment } from "react"

const ProgressChart = dynamic(() => import("@/components/progress-chart"), { ssr: false })

const METRICS = [
  { key: "fortyYard",    label: "40-Yard Dash",    unit: "s",     lower: true  },
  { key: "twentyYard",   label: "20-Yard Dash",    unit: "s",     lower: true  },
  { key: "shuttle",      label: "5-10-5 Shuttle",   unit: "s",     lower: true  },
  { key: "threeCone",    label: "3-Cone / L-Drill", unit: "s",     lower: true  },
  { key: "verticalJump", label: "Vertical Jump",    unit: '"',     lower: false },
  { key: "broadJump",    label: "Broad Jump",       unit: '"',     lower: false },
  { key: "benchPress",   label: "Bench Press 135",  unit: " reps", lower: false },
  { key: "pushups",      label: "Push-Ups",         unit: " reps", lower: false },
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
  school: string; position?: string; sport?: string; joinedAt: string; sessions: Session[]
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
        <div className="flex items-center justify-between border-b border-gray-800 pb-6 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={36} height={36} className="object-contain shrink-0" />
            <div className="min-w-0">
              <p className="text-white font-bold truncate">Welcome, {parent?.name}</p>
              <p className="text-gray-500 text-xs truncate">{parent?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {hasAccess && (
              <button onClick={handleManageBilling} disabled={managingBilling}
                className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                {managingBilling ? "..." : "Billing"}
              </button>
            )}
            <button onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-gray-300 border border-gray-700 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap">
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
              <div className="bg-gray-800 px-4 py-4 md:px-6">
                <div className="flex items-start gap-3">
                  <AthletePhotoUpload
                    athleteId={athlete.id}
                    athleteName={athlete.name}
                    currentPhotoUrl={(athlete as {photoUrl?: string}).photoUrl ?? null}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-lg md:text-xl leading-tight">{athlete.name}</p>
                    <p className="text-gray-400 text-xs md:text-sm mt-0.5">
                      {athlete.age} yrs · {athlete.grade} · {athlete.school || "—"}
                      {athlete.position ? ` · ${athlete.position}` : ""}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {sessions.length} session{sessions.length !== 1 ? "s" : ""} · Since {new Date(athlete.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                {/* Badges row — below info on all screen sizes */}
                {(prvRecords[athlete.id] || parent?.tier === "recruit" || parent?.tier === "elite-recruit") && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {prvRecords[athlete.id] && (
                      <a href={prvRecords[athlete.id]!.verifyUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-red-950/60 border border-red-800/50 rounded-xl px-3 py-2 hover:bg-red-900/60 transition-colors">
                        <span className="text-red-400 text-xs font-bold uppercase tracking-widest">PR-VERIFIED</span>
                        <span className="font-mono text-white text-xs font-bold">{prvRecords[athlete.id]!.code}</span>
                        <span className="text-red-600 text-xs">→</span>
                      </a>
                    )}
                    {(parent?.tier === "recruit" || parent?.tier === "elite-recruit") && (
                      <a href={`/athlete/${athlete.id}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-950/60 border border-blue-800/50 rounded-xl px-3 py-2 hover:bg-blue-900/60 transition-colors">
                        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Recruiting Profile</span>
                        <span className="text-blue-600 text-xs">↗</span>
                      </a>
                    )}
                  </div>
                )}
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
                        className={`flex-1 px-2 py-3 text-xs md:text-sm font-medium text-center transition-colors ${
                          tab === t
                            ? "border-b-2 border-red-500 text-white"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {t === "chart" ? "Chart" : t === "history" ? "History" : "Overview"}
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
                      <p className="text-xs text-gray-600 mb-3 md:hidden">← Swipe to see all metrics</p>
                      <table className="w-full text-sm min-w-[600px]">
                        <thead>
                          <tr className="text-xs text-gray-500 border-b border-gray-800">
                            <th className="text-left py-2 px-2">Date</th>
                            <th className="text-right py-2 px-2">40-Yd</th>
                            <th className="text-right py-2 px-2">20-Yd Sprint</th>
                            <th className="text-right py-2 px-2">5-10-5</th>
                            <th className="text-right py-2 px-2">L / R</th>
                            <th className="text-right py-2 px-2">3-Cone</th>
                            <th className="text-right py-2 px-2">Vert</th>
                            <th className="text-right py-2 px-2">Broad</th>
                            <th className="text-right py-2 px-2">Bench</th>
                            <th className="text-right py-2 px-2">Push-Ups</th>
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
                                <td className="text-right py-2 px-2">{fmt((s as {pushups?: number}).pushups, "")}</td>
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


        {/* Camp Suggestions */}
        {hasAccess && (
          <CampSuggestions
            sport={athletes[0]?.sport}
            grade={athletes[0]?.grade}
          />
        )}

        {/* Coach Outreach Templates */}
        {hasAccess && athletes.length > 0 && (
          <CoachOutreach
            athlete={athletes[0]}
            parentName={parent?.name ?? ""}
            parentEmail={parent?.email ?? ""}
          />
        )}

        {/* Recruiting Roadmap — all subscribers */}
        {hasAccess && (() => {
          const athleteGrade = athletes[0]?.grade ?? ""
          const gradeNumRaw = (() => {
            const lower = athleteGrade.toLowerCase()
            const numMatch = athleteGrade.match(/\b(\d{1,2})\b/)
            if (numMatch) return parseInt(numMatch[1])
            if (lower.includes("freshman")  || lower.includes("9th"))  return 9
            if (lower.includes("sophomore") || lower.includes("10th")) return 10
            if (lower.includes("junior")    || lower.includes("11th")) return 11
            if (lower.includes("senior")    || lower.includes("12th")) return 12
            if (lower.includes("8th")) return 8
            if (lower.includes("7th")) return 7
            if (lower.includes("6th")) return 6
            return 0
          })()
          const gradeNum = gradeNumRaw

          const stages = [
            {
              grade: "Grade 8 & Under",
              match: gradeNum > 0 && gradeNum <= 8,
              color: "border-blue-600",
              dot: "bg-blue-600",
              label: "Building the Foundation",
              items: [
                "Get baseline athletic testing done at a PolyRISE combine camp",
                "Create your Athlete Training Passport (ATP) profile",
                "Focus on fundamentals — speed, agility, and position skills",
                "Build your GPA now — coaches check grades from day one",
                "Attend monthly PolyRISE combine camps for consistent tracking",
              ],
            },
            {
              grade: "Freshman · Grade 9",
              match: gradeNum === 9,
              color: "border-green-600",
              dot: "bg-green-600",
              label: "Establish Your Baseline",
              items: [
                "Complete your first PR-VERIFIED combine test",
                "Start a highlight reel — practice and game clips both count",
                "Research realistic division levels (D1 / D2 / D3 / NAIA / JuCo)",
                "Maintain a minimum 2.5 GPA for NCAA eligibility — but top college programs want to see 3.5+. The higher your GPA, the more doors open.",
                "Register on Hudl and link your film to your PolyRISE profile",
                "Identify 10–15 schools you like at your realistic division level",
              ],
            },
            {
              grade: "Sophomore · Grade 10",
              match: gradeNum === 10,
              color: "border-yellow-500",
              dot: "bg-yellow-500",
              label: "Build Visibility",
              items: [
                "Update your PR-VERIFIED metrics every camp cycle",
                "Build Hudl highlight film with game and camp footage",
                "Email 5–10 college coaches introducing your athlete",
                "Take the PSAT — start preparing for SAT/ACT",
                "Share your PolyRISE recruiting profile link with target schools",
                "Attend at least one college football camp at a target school",
              ],
            },
            {
              grade: "Junior · Grade 11",
              match: gradeNum === 11,
              color: "border-red-500",
              dot: "bg-red-500",
              label: "Most Critical Year",
              badge: "ACTION NOW",
              items: [
                "Register with NCAA Eligibility Center at eligibilitycenter.org",
                "Take SAT/ACT — aim for NCAA qualifying scores",
                "Send your recruiting profile to every school on your list",
                "Attend official and unofficial visits at target schools",
                "Request a Kevin Garrett quarterly development review",
                "Update Hudl with current season game film immediately after games",
                "Follow up with coaches monthly — persistence matters",
              ],
            },
            {
              grade: "Senior · Grade 12",
              match: gradeNum === 12,
              color: "border-purple-500",
              dot: "bg-purple-500",
              label: "Signing & Committing",
              items: [
                "Finalize your NCAA / NAIA eligibility certification",
                "Accept official visits from schools making offers",
                "Sign your NLI (National Letter of Intent) — Early Signing: Dec, Regular: Feb",
                "Keep grades up — conditional offers can be pulled for academic issues",
                "Notify PolyRISE staff of your commitment so we can celebrate you",
                "Continue training — college coaches watch film through spring",
              ],
            },
          ]

          return (
            <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-950/60 to-gray-900 px-6 py-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-0.5">PolyRISE Recruiting</p>
                    <h2 className="text-white font-black text-lg">Recruiting Roadmap</h2>
                    <p className="text-gray-400 text-xs mt-0.5">Your step-by-step guide to getting recruited at the next level</p>
                  </div>
                  {gradeNum > 0 && (
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-500">Current Grade</p>
                      <p className="text-2xl font-black text-white">{gradeNum}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {stages.map((stage) => (
                  <div key={stage.grade} className={`p-5 ${stage.match ? "bg-white/5" : ""}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${stage.dot} ${stage.match ? "ring-2 ring-white/30 ring-offset-1 ring-offset-gray-900" : "opacity-50"}`} />
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-black ${stage.match ? "text-white" : "text-gray-500"}`}>{stage.grade}</p>
                        <p className={`text-xs ${stage.match ? "text-gray-400" : "text-gray-600"}`}>· {stage.label}</p>
                        {stage.match && (
                          <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">YOU ARE HERE</span>
                        )}
                        {stage.badge && stage.match && (
                          <span className="text-xs bg-yellow-500 text-black font-black px-2 py-0.5 rounded-full">{stage.badge}</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-6 space-y-1.5">
                      {stage.items.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <span className={`text-xs mt-0.5 shrink-0 ${stage.match ? "text-red-400" : "text-gray-600"}`}>→</span>
                          <p className={`text-xs leading-relaxed ${stage.match ? "text-gray-300" : "text-gray-600"}`}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-700 flex items-center justify-center text-white font-black text-xs shrink-0">KG</div>
                  <div>
                    <p className="text-yellow-300 text-xs font-bold">Questions about your recruiting path?</p>
                    <a href="mailto:kg@polyrisefootball.com" className="text-gray-400 text-xs hover:text-white transition-colors">
                      Kevin Garrett · kg@polyrisefootball.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

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
