"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

const METRICS = [
  { key: "fortyYard", label: "40-Yard Dash", unit: "s", lower: true },
  { key: "shuttle", label: "Shuttle", unit: "s", lower: true },
  { key: "threeCone", label: "3-Cone / L-Drill", unit: "s", lower: true },
  { key: "verticalJump", label: "Vertical Jump", unit: '"', lower: false },
  { key: "broadJump", label: "Broad Jump", unit: '"', lower: false },
  { key: "benchPress", label: "Bench Press", unit: " reps", lower: false },
] as const

interface Session { date: string; [key: string]: number | string | undefined }
interface Athlete {
  id: string; name: string; age: number; grade: string
  school: string; position?: string; joinedAt: string; sessions: Session[]
}
interface Parent {
  email: string; name: string; tier: string
  subscriptionStatus?: string; subscriptionEnd?: string; athleteIds: string[]
}

function Portal() {
  const [parent, setParent] = useState<Parent | null>(null)
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [managingBilling, setManagingBilling] = useState(false)
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

  const hasAccess = parent?.tier !== "none" && parent?.subscriptionStatus !== "canceled"

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
            {parent?.stripeCustomerId && (
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
            <p>No active subscription. <Link href="/parent/subscribe" className="underline font-bold">Subscribe to view reports →</Link></p>
          )}
        </div>

        {/* No athletes linked yet */}
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

          return (
            <div key={athlete.id} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {/* Athlete header */}
              <div className="bg-gray-800 px-6 py-4">
                <p className="text-white font-bold text-xl">{athlete.name}</p>
                <p className="text-gray-400 text-sm">{athlete.age} yrs · {athlete.grade} · {athlete.school || "—"} · {athlete.position || "—"}</p>
                <p className="text-gray-600 text-xs mt-0.5">
                  {sessions.length} session{sessions.length !== 1 ? "s" : ""} recorded ·
                  Member since {new Date(athlete.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>

              {sessions.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-600 text-sm">No test sessions recorded yet.</div>
              ) : (
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

                  {/* Session dates */}
                  <div className="border-t border-gray-800 pt-3">
                    <p className="text-xs text-gray-600">
                      Test dates: {sessions.map((s: Session) => new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })).join(" · ")}
                    </p>
                  </div>
                </div>
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
