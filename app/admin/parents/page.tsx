"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"

interface ParentAccount {
  email: string
  name: string
  phone?: string
  athleteName?: string
  requestedAthleteId?: string
  accessExpiry?: string
  athleteIds: string[]
  tier: string
  approvalStatus?: "pending" | "approved" | "denied"
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

function defaultExpiry(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  return d.toISOString().split("T")[0]
}

function findBestMatch(athleteName: string, athletes: TrainingAthlete[]) {
  if (!athleteName || !athletes.length) return null
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim()
  const tok = (s: string) => norm(s).split(/\s+/).filter(Boolean)
  const q = tok(athleteName)
  if (!q.length) return null
  let best: { athlete: TrainingAthlete; score: number } | null = null
  for (const a of athletes) {
    if (norm(a.name) === norm(athleteName)) return { athlete: a, score: 100 }
    const aT = tok(a.name)
    const matches = q.filter(x => aT.some(t => t.startsWith(x) || x.startsWith(t)))
    const score = (matches.length / Math.max(q.length, aT.length)) * 100
    if (score > 40 && (!best || score > best.score)) best = { athlete: a, score }
  }
  return best
}

export default function AdminParentsPage() {
  const [parents, setParents] = useState<ParentAccount[]>([])
  const [athletes, setAthletes] = useState<TrainingAthlete[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState<string | null>(null)

  // Per-parent action state
  const [approveSelect, setApproveSelect] = useState<Record<string, string>>({})
  const [approveExpiry, setApproveExpiry] = useState<Record<string, string>>({})
  const [extendExpiry, setExtendExpiry] = useState<Record<string, string>>({})
  const [linkSelect, setLinkSelect] = useState<Record<string, string>>({})

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/parents").then(r => r.json()),
      fetch("/api/training").then(r => r.json()),
    ]).then(([pd, td]) => {
      if (pd.success) setParents(pd.parents)
      if (td.success) setAthletes(td.athletes)
    }).finally(() => setLoading(false))
  }, [])

  async function handleApprove(email: string, athleteId: string, expiry: string) {
    setSaving(email)
    const res = await fetch("/api/admin/parents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "approve", athleteId, accessExpiry: expiry }),
    }).then(r => r.json())
    if (res.success) {
      setParents(prev => prev.map(p => p.email === email
        ? { ...p, tier: "program", approvalStatus: "approved", athleteIds: res.athleteIds ?? p.athleteIds, accessExpiry: expiry }
        : p))
    }
    setSaving(null)
  }

  async function handleDeny(email: string) {
    setSaving(email)
    await fetch("/api/admin/parents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "deny" }),
    })
    setParents(prev => prev.map(p => p.email === email ? { ...p, approvalStatus: "denied", tier: "none" } : p))
    setSaving(null)
  }

  async function handleExtend(email: string, expiry: string) {
    setSaving(email)
    const res = await fetch("/api/admin/parents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "extend", accessExpiry: expiry }),
    }).then(r => r.json())
    if (res.success) setParents(prev => prev.map(p => p.email === email ? { ...p, accessExpiry: expiry } : p))
    setSaving(null)
  }

  async function handleLink(email: string, athleteId: string) {
    if (!athleteId) return
    setSaving(email)
    const res = await fetch("/api/admin/parents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "link", athleteId }),
    }).then(r => r.json())
    if (res.success) {
      setParents(prev => prev.map(p => p.email === email ? { ...p, athleteIds: res.athleteIds } : p))
      setLinkSelect(prev => ({ ...prev, [email]: "" }))
    }
    setSaving(null)
  }

  async function handleUnlink(email: string, athleteId: string) {
    setSaving(email)
    const res = await fetch("/api/admin/parents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "unlink", athleteId }),
    }).then(r => r.json())
    if (res.success) setParents(prev => prev.map(p => p.email === email ? { ...p, athleteIds: res.athleteIds } : p))
    setSaving(null)
  }

  async function handleSendReset(email: string) {
    setSaving(email)
    await fetch("/api/parent/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setResetSent(email)
    setTimeout(() => setResetSent(null), 4000)
    setSaving(null)
  }

  // Sort: pending first → approved → denied
  const sorted = [...parents].sort((a, b) => {
    const order = { pending: 0, approved: 1, denied: 2 }
    return (order[a.approvalStatus ?? "denied"] ?? 2) - (order[b.approvalStatus ?? "denied"] ?? 2)
  })

  const q = search.toLowerCase()
  const filtered = sorted.filter(p =>
    !q ||
    p.name.toLowerCase().includes(q) ||
    p.email.toLowerCase().includes(q) ||
    athletes.filter(a => p.athleteIds.includes(a.id)).some(a => a.name.toLowerCase().includes(q)) ||
    (p.athleteName || "").toLowerCase().includes(q)
  )

  const pendingCount = parents.filter(p => p.approvalStatus === "pending").length

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Admin</Link>
          <div>
            <h1 className="text-xl font-bold">Parent Accounts</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {parents.length} total · {parents.filter(p => p.approvalStatus === "approved").length} registered
              {pendingCount > 0 && <span className="text-yellow-400 font-semibold"> · {pendingCount} pending</span>}
            </p>
          </div>
        </div>
        <LogoutButton />
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">

        <input
          type="text"
          placeholder="Search by name, email, or athlete..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500 mb-5"
        />

        {loading ? (
          <div className="text-center text-gray-500 py-16">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm">
            {search ? "No results." : "No parent accounts yet."}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(parent => {
              const isSaving = saving === parent.email
              const isPending = parent.approvalStatus === "pending"
              const isApproved = parent.approvalStatus === "approved"
              const isDenied = parent.approvalStatus === "denied"
              const linkedAthletes = athletes.filter(a => parent.athleteIds.includes(a.id))
              const unlinkedAthletes = athletes.filter(a => !parent.athleteIds.includes(a.id))

              // Expiry info
              let expiryText = ""
              let expiryColor = "text-gray-500"
              if (parent.accessExpiry) {
                const days = Math.ceil((new Date(parent.accessExpiry + "T00:00:00").getTime() - Date.now()) / 86400000)
                if (days < 0) { expiryText = "EXPIRED"; expiryColor = "text-red-400" }
                else if (days === 0) { expiryText = "Expires today"; expiryColor = "text-orange-400" }
                else if (days <= 3) { expiryText = `${days}d left`; expiryColor = "text-orange-400" }
                else { expiryText = `${days}d left`; expiryColor = "text-gray-500" }
              }

              // Suggested match for pending
              const suggestion = parent.requestedAthleteId
                ? unlinkedAthletes.find(a => a.id === parent.requestedAthleteId)
                  ? { athlete: unlinkedAthletes.find(a => a.id === parent.requestedAthleteId)!, score: 100 }
                  : parent.athleteName ? findBestMatch(parent.athleteName, unlinkedAthletes) : null
                : parent.athleteName ? findBestMatch(parent.athleteName, unlinkedAthletes) : null

              const cardBorder = isPending
                ? "border-yellow-700/50"
                : isDenied
                ? "border-white/5 opacity-50"
                : "border-white/10"

              return (
                <div key={parent.email} className={`bg-white/5 rounded-2xl border ${cardBorder} overflow-hidden`}>

                  {/* Top row: identity + status */}
                  <div className="px-5 py-4 flex flex-wrap items-start gap-3 justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-white">{parent.name}</p>
                        {isPending && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/60 text-yellow-300 border border-yellow-700/50 font-semibold">Pending</span>}
                        {isApproved && <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-300 border border-green-700/40 font-semibold">✓ Registered</span>}
                        {isDenied && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 border border-gray-700 font-semibold">Denied</span>}
                        {parent.tier === "monthly" && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 font-semibold">Monthly</span>}
                        {parent.tier === "quarterly" && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 font-semibold">Quarterly</span>}
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5">{parent.email}</p>
                      {parent.phone && <p className="text-xs text-gray-600">{parent.phone}</p>}
                      {expiryText && <p className={`text-xs mt-1 font-semibold ${expiryColor}`}>Access expires: {new Date(parent.accessExpiry! + "T00:00:00").toLocaleDateString()} · {expiryText}</p>}
                    </div>

                    {/* Linked athletes */}
                    <div className="text-right">
                      {linkedAthletes.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {linkedAthletes.map(a => (
                            <div key={a.id} className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1">
                              <span className="text-xs text-white font-mono">{a.name}</span>
                              <button onClick={() => handleUnlink(parent.email, a.id)} disabled={isSaving}
                                className="text-red-500 hover:text-red-300 text-xs font-bold disabled:opacity-40">✕</button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-600">No athlete linked</p>
                      )}
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="border-t border-white/5 px-5 py-3 bg-black/20 flex flex-wrap gap-3 items-end">

                    {/* Pending: approve */}
                    {isPending && (
                      <div className="flex flex-wrap gap-2 items-end">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Athlete</p>
                          <select
                            value={approveSelect[parent.email] ?? suggestion?.athlete.id ?? ""}
                            onChange={e => setApproveSelect(prev => ({ ...prev, [parent.email]: e.target.value }))}
                            className="bg-[#0a0a0f] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-yellow-500"
                          >
                            <option value="">Select athlete…</option>
                            {athletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
                          </select>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Access until</p>
                          <input type="date"
                            value={approveExpiry[parent.email] ?? defaultExpiry()}
                            onChange={e => setApproveExpiry(prev => ({ ...prev, [parent.email]: e.target.value }))}
                            className="bg-[#0a0a0f] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-yellow-500"
                          />
                        </div>
                        <button
                          onClick={() => handleApprove(parent.email, approveSelect[parent.email] ?? suggestion?.athlete.id ?? "", approveExpiry[parent.email] ?? defaultExpiry())}
                          disabled={isSaving}
                          className="px-4 py-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          {isSaving ? "Approving…" : "✓ Approve"}
                        </button>
                        <button onClick={() => handleDeny(parent.email)} disabled={isSaving}
                          className="px-4 py-1.5 bg-red-900 hover:bg-red-800 text-red-300 text-xs font-bold rounded-lg border border-red-800/50 transition-colors">
                          ✕ Deny
                        </button>
                      </div>
                    )}

                    {/* Approved: extend access */}
                    {isApproved && parent.tier === "program" && (
                      <div className="flex gap-2 items-end">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Extend to</p>
                          <input type="date"
                            value={extendExpiry[parent.email] ?? defaultExpiry()}
                            onChange={e => setExtendExpiry(prev => ({ ...prev, [parent.email]: e.target.value }))}
                            className="bg-[#0a0a0f] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                          />
                        </div>
                        <button onClick={() => handleExtend(parent.email, extendExpiry[parent.email] ?? defaultExpiry())} disabled={isSaving}
                          className="px-4 py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors">
                          {isSaving ? "Saving…" : "Extend"}
                        </button>
                      </div>
                    )}

                    {/* Link athlete */}
                    {unlinkedAthletes.length > 0 && (
                      <div className="flex gap-2 items-end">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Link athlete</p>
                          <select
                            value={linkSelect[parent.email] ?? ""}
                            onChange={e => setLinkSelect(prev => ({ ...prev, [parent.email]: e.target.value }))}
                            className="bg-[#0a0a0f] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                          >
                            <option value="">Select…</option>
                            {unlinkedAthletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
                          </select>
                        </div>
                        {linkSelect[parent.email] && (
                          <button onClick={() => handleLink(parent.email, linkSelect[parent.email])} disabled={isSaving}
                            className="px-4 py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors">
                            {isSaving ? "Linking…" : "Link"}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Password reset */}
                    <button
                      onClick={() => handleSendReset(parent.email)}
                      disabled={isSaving || resetSent === parent.email}
                      className={`ml-auto px-4 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                        resetSent === parent.email
                          ? "bg-green-900/40 text-green-300 border-green-700/50"
                          : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {resetSent === parent.email ? "✓ Reset Sent" : "Send Password Reset"}
                    </button>

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
