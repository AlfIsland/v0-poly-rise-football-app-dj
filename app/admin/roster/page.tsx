"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"

interface ParentAccount {
  email: string
  name: string
  phone?: string
  athleteName?: string
  tier: string
  approvalStatus?: string
  athleteIds: string[]
  createdAt: string
  accessExpiry?: string
}

interface TrainingAthlete {
  id: string
  name: string
  age?: number
  grade?: string
  school?: string
  position?: string
  sport?: string
  sessions: { date: string }[]
}

type TierFilter = "all" | "elite-recruit" | "recruit" | "passport" | "monthly" | "quarterly" | "program" | "none"

function tierLabel(tier: string) {
  if (tier === "elite-recruit") return "Elite Recruit"
  if (tier === "recruit")       return "Recruit"
  if (tier === "passport" || tier === "monthly") return "Passport"
  if (tier === "quarterly")     return "Passport Quarterly"
  if (tier === "program")       return "Program Member"
  return "No Plan"
}

function tierBadge(tier: string) {
  if (tier === "elite-recruit") return "bg-yellow-900/60 text-yellow-300 border-yellow-700/50"
  if (tier === "recruit")       return "bg-red-900/60 text-red-300 border-red-700/50"
  if (tier === "passport" || tier === "monthly" || tier === "quarterly") return "bg-blue-900/60 text-blue-300 border-blue-700/50"
  if (tier === "program")       return "bg-green-900/60 text-green-300 border-green-700/50"
  return "bg-gray-800 text-gray-500 border-gray-700"
}

function statusBadge(status?: string) {
  if (status === "approved") return <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-300 border border-green-700/40 font-semibold">✓ Approved</span>
  if (status === "pending")  return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/60 text-yellow-300 border border-yellow-700/50 font-semibold">⏳ Pending</span>
  if (status === "denied")   return <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/50 text-red-300 border border-red-800/50 font-semibold">✕ Denied</span>
  return null
}

export default function RosterPage() {
  const [parents, setParents] = useState<ParentAccount[]>([])
  const [athletes, setAthletes] = useState<TrainingAthlete[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [tierFilter, setTierFilter] = useState<TierFilter>("all")

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/parents").then(r => r.json()),
      fetch("/api/training").then(r => r.json()),
    ]).then(([pd, td]) => {
      if (pd.success) setParents(pd.parents)
      if (td.success) setAthletes(td.athletes)
    }).finally(() => setLoading(false))
  }, [])

  const athleteMap = Object.fromEntries(athletes.map(a => [a.id.toUpperCase(), a]))

  const filtered = parents.filter(p => {
    if (tierFilter !== "all") {
      const t = p.tier
      if (tierFilter === "passport" && t !== "passport" && t !== "monthly") return false
      else if (tierFilter !== "passport" && t !== tierFilter) return false
    }
    if (search) {
      const q = search.toLowerCase()
      const linkedNames = p.athleteIds.map(id => athleteMap[id.toUpperCase()]?.name ?? "").join(" ")
      return (
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.athleteName ?? "").toLowerCase().includes(q) ||
        linkedNames.toLowerCase().includes(q)
      )
    }
    return true
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const counts = {
    total: parents.length,
    eliteRecruit: parents.filter(p => p.tier === "elite-recruit").length,
    recruit: parents.filter(p => p.tier === "recruit").length,
    passport: parents.filter(p => p.tier === "passport" || p.tier === "monthly" || p.tier === "quarterly").length,
    program: parents.filter(p => p.tier === "program").length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/training" className="text-gray-400 hover:text-white text-sm">← Training</Link>
          <div>
            <h1 className="text-xl font-bold">Subscriber Roster</h1>
            <p className="text-xs text-gray-500 mt-0.5">{parents.length} total · {counts.eliteRecruit + counts.recruit} paid recruiting plans</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/parents" className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-2 rounded-xl border border-white/10 transition-colors">
            Manage Access
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Elite Recruit", value: counts.eliteRecruit, color: "text-yellow-400" },
            { label: "Recruit", value: counts.recruit, color: "text-red-400" },
            { label: "Passport", value: counts.passport, color: "text-blue-400" },
            { label: "Program Member", value: counts.program, color: "text-green-400" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search parent, athlete, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500"
          />
          <div className="flex gap-2 flex-wrap">
            {([
              { key: "all", label: "All" },
              { key: "elite-recruit", label: "Elite Recruit" },
              { key: "recruit", label: "Recruit" },
              { key: "passport", label: "Passport" },
              { key: "program", label: "Program" },
            ] as { key: TierFilter; label: string }[]).map(f => (
              <button key={f.key} onClick={() => setTierFilter(f.key)}
                className={`text-xs px-3 py-2 rounded-xl transition-colors border ${tierFilter === f.key ? "bg-red-600 border-red-500 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="text-center text-gray-500 py-12">Loading...</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">{search ? "No results." : "No subscribers yet."}</p>
        )}

        {/* Desktop table */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="hidden md:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Parent</th>
                    <th className="text-left px-5 py-3">Plan</th>
                    <th className="text-left px-5 py-3">Athlete(s)</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Joined</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(parent => {
                    const linked = parent.athleteIds.map(id => athleteMap[id.toUpperCase()]).filter(Boolean)
                    return (
                      <tr key={parent.email} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-semibold text-white">{parent.name}</p>
                          <p className="text-xs text-gray-500">{parent.email}</p>
                          {parent.phone && <p className="text-xs text-gray-600">{parent.phone}</p>}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${tierBadge(parent.tier)}`}>
                            {tierLabel(parent.tier)}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {linked.length > 0 ? (
                            <div className="space-y-1">
                              {linked.map(a => (
                                <div key={a.id} className="flex items-center gap-2">
                                  <span className="text-white text-xs font-semibold">{a.name}</span>
                                  <span className="text-gray-500 text-xs">{a.position || ""} · {a.grade || ""}</span>
                                  <span className="font-mono text-blue-400 text-xs">{a.id}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-600">
                              {parent.athleteName || "Not linked yet"}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3">{statusBadge(parent.approvalStatus)}</td>
                        <td className="px-5 py-3 text-gray-500 text-xs">
                          {new Date(parent.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-1.5 flex-wrap">
                            {linked.map(a => (
                              <Link key={a.id} href={`/training/${a.id}`}
                                className="text-xs bg-blue-800 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg transition-colors">
                                View {a.name.split(" ")[0]}
                              </Link>
                            ))}
                            {linked.map(a => (
                              <Link key={a.id + "-edit"} href={`/training/${a.id}/edit`}
                                className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2.5 py-1 rounded-lg transition-colors">
                                Edit
                              </Link>
                            ))}
                            <Link href={`/admin/parents`}
                              className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-2.5 py-1 rounded-lg transition-colors">
                              Access
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map(parent => {
                const linked = parent.athleteIds.map(id => athleteMap[id.toUpperCase()]).filter(Boolean)
                return (
                  <div key={parent.email} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-white">{parent.name}</p>
                        <p className="text-xs text-gray-500">{parent.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${tierBadge(parent.tier)}`}>
                        {tierLabel(parent.tier)}
                      </span>
                    </div>

                    <div className="mb-2">{statusBadge(parent.approvalStatus)}</div>

                    {linked.length > 0 ? (
                      <div className="space-y-1 mb-3">
                        {linked.map(a => (
                          <div key={a.id} className="bg-black/20 rounded-lg px-3 py-2">
                            <p className="text-white text-sm font-semibold">{a.name}</p>
                            <p className="text-gray-500 text-xs">{[a.position, a.grade, a.school].filter(Boolean).join(" · ")}</p>
                            <p className="font-mono text-blue-400 text-xs">{a.id} · {a.sessions?.length ?? 0} sessions</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 mb-3">{parent.athleteName || "No athlete linked yet"}</p>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {linked.map(a => (
                        <Link key={a.id} href={`/training/${a.id}`}
                          className="text-xs bg-blue-800 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg">
                          View Profile
                        </Link>
                      ))}
                      {linked.map(a => (
                        <Link key={a.id + "-edit"} href={`/training/${a.id}/edit`}
                          className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg">
                          Edit Athlete
                        </Link>
                      ))}
                      <Link href="/admin/parents"
                        className="text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg">
                        Manage Access
                      </Link>
                    </div>

                    <p className="text-xs text-gray-600 mt-2">
                      Joined {new Date(parent.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
