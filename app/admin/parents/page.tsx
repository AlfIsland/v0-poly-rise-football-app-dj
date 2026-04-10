"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"

interface ParentAccount {
  email: string
  name: string
  phone?: string
  athleteName?: string
  athleteIds: string[]
  tier: string
  subscriptionStatus?: string
  subscriptionEnd?: string
  createdAt: string
}

interface TrainingAthlete {
  id: string
  name: string
  grade: string
  school: string
  position?: string
}

const TIER_LABELS: Record<string, { label: string; cls: string }> = {
  monthly:   { label: "Monthly",   cls: "bg-blue-900 text-blue-300" },
  quarterly: { label: "Quarterly", cls: "bg-purple-900 text-purple-300" },
  program:   { label: "Program",   cls: "bg-green-900 text-green-300" },
  none:      { label: "No Sub",    cls: "bg-gray-800 text-gray-500" },
}

const STATUS_COLORS: Record<string, string> = {
  active:   "bg-green-900 text-green-300",
  past_due: "bg-yellow-900 text-yellow-300",
  canceled: "bg-gray-800 text-gray-500",
}

export default function AdminParentsPage() {
  const [parents, setParents] = useState<ParentAccount[]>([])
  const [athletes, setAthletes] = useState<TrainingAthlete[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [linkingEmail, setLinkingEmail] = useState<string | null>(null)
  const [linkSelect, setLinkSelect] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/parents").then(r => r.json()),
      fetch("/api/training").then(r => r.json()),
    ]).then(([pd, td]) => {
      if (pd.success) setParents(pd.parents)
      if (td.success) setAthletes(td.athletes)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = parents.filter(p => {
    if (filter === "active" && p.subscriptionStatus !== "active") return false
    if (filter === "no-sub" && p.tier !== "none") return false
    if (search) {
      const q = search.toLowerCase()
      return p.name.toLowerCase().includes(q)
        || p.email.toLowerCase().includes(q)
        || (p.athleteName || "").toLowerCase().includes(q)
    }
    return true
  })

  async function handleLink(email: string, athleteId: string) {
    if (!athleteId) return
    setSaving(true)
    const res = await fetch("/api/admin/parents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "link", athleteId }),
    }).then(r => r.json())
    if (res.success) {
      setParents(prev => prev.map(p => p.email === email ? { ...p, athleteIds: res.athleteIds } : p))
    }
    setLinkingEmail(null)
    setLinkSelect("")
    setSaving(false)
  }

  async function handleUnlink(email: string, athleteId: string) {
    setSaving(true)
    const res = await fetch("/api/admin/parents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "unlink", athleteId }),
    }).then(r => r.json())
    if (res.success) {
      setParents(prev => prev.map(p => p.email === email ? { ...p, athleteIds: res.athleteIds } : p))
    }
    setSaving(false)
  }

  const stats = {
    total: parents.length,
    active: parents.filter(p => p.subscriptionStatus === "active").length,
    linked: parents.filter(p => p.athleteIds.length > 0).length,
    noSub: parents.filter(p => p.tier === "none").length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Admin</Link>
          <h1 className="text-xl font-bold text-white">Parent Accounts</h1>
        </div>
        <LogoutButton />
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Parents", value: stats.total, color: "text-white" },
            { label: "Active Subs", value: stats.active, color: "text-green-400" },
            { label: "Athletes Linked", value: stats.linked, color: "text-blue-400" },
            { label: "No Subscription", value: stats.noSub, color: "text-gray-400" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or athlete..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500"
          />
          <div className="flex gap-2">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "no-sub", label: "No Sub" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f.key
                    ? "bg-red-600 text-white"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center text-gray-500 py-16">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-16">No parents found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(parent => {
              const tier = TIER_LABELS[parent.tier] ?? TIER_LABELS.none
              const statusCls = parent.subscriptionStatus ? (STATUS_COLORS[parent.subscriptionStatus] ?? "bg-gray-800 text-gray-500") : ""
              const linkedAthletes = athletes.filter(a => parent.athleteIds.includes(a.id))
              const isLinking = linkingEmail === parent.email

              return (
                <div key={parent.email} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Parent Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-base">{parent.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tier.cls}`}>{tier.label}</span>
                        {parent.subscriptionStatus && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCls}`}>
                            {parent.subscriptionStatus}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">{parent.email}</div>
                      {parent.phone && <div className="text-sm text-gray-500">{parent.phone}</div>}
                      {parent.athleteName && (
                        <div className="text-xs text-gray-500 mt-1">Athlete name given: <span className="text-gray-300">{parent.athleteName}</span></div>
                      )}
                      <div className="text-xs text-gray-600 mt-1">
                        Joined {new Date(parent.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>

                    {/* Linked Athletes */}
                    <div className="sm:w-72 shrink-0">
                      <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Linked Athletes</div>
                      {linkedAthletes.length === 0 ? (
                        <div className="text-xs text-gray-600 italic mb-2">No athletes linked</div>
                      ) : (
                        <div className="space-y-1.5 mb-2">
                          {linkedAthletes.map(a => (
                            <div key={a.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                              <div>
                                <span className="text-sm text-white font-medium">{a.name}</span>
                                <span className="text-xs text-gray-400 ml-2">{a.id}</span>
                                {a.position && <span className="text-xs text-gray-500 ml-1">· {a.position}</span>}
                              </div>
                              <button
                                onClick={() => handleUnlink(parent.email, a.id)}
                                disabled={saving}
                                className="text-xs text-red-400 hover:text-red-300 ml-2 shrink-0"
                              >
                                Unlink
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {isLinking ? (
                        <div className="flex gap-2 mt-1">
                          <select
                            value={linkSelect}
                            onChange={e => setLinkSelect(e.target.value)}
                            className="flex-1 bg-[#0a0a0f] border border-white/20 rounded-lg px-2 py-1.5 text-sm text-white outline-none"
                          >
                            <option value="">Select athlete…</option>
                            {athletes
                              .filter(a => !parent.athleteIds.includes(a.id))
                              .map(a => (
                                <option key={a.id} value={a.id}>
                                  {a.name} ({a.id})
                                </option>
                              ))}
                          </select>
                          <button
                            onClick={() => handleLink(parent.email, linkSelect)}
                            disabled={!linkSelect || saving}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-sm rounded-lg font-medium"
                          >
                            Link
                          </button>
                          <button
                            onClick={() => { setLinkingEmail(null); setLinkSelect("") }}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setLinkingEmail(parent.email)}
                          className="text-xs text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-400/60 rounded-lg px-3 py-1.5 transition-colors"
                        >
                          + Link Athlete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
