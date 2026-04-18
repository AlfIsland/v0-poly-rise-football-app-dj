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

// Default expiry = end of current month
function defaultExpiry(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  return d.toISOString().split("T")[0]
}

// Returns expiry status for a program member
function expiryStatus(parent: ParentAccount): "expired" | "soon" | "ok" | null {
  if (parent.tier !== "program" || parent.approvalStatus !== "approved" || !parent.accessExpiry) return null
  const now = new Date()
  const exp = new Date(parent.accessExpiry + "T00:00:00")
  const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return "expired"
  if (diffDays <= 3) return "soon"
  return "ok"
}

// Fuzzy name match — returns best matching athlete id (score > 0) or null
function findBestMatch(athleteName: string, athletes: TrainingAthlete[]): { athlete: TrainingAthlete; score: number } | null {
  if (!athleteName || !athletes.length) return null
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim()
  const tokens = (s: string) => normalize(s).split(/\s+/).filter(Boolean)
  const query = tokens(athleteName)
  if (!query.length) return null

  let best: { athlete: TrainingAthlete; score: number } | null = null
  for (const a of athletes) {
    const aTokens = tokens(a.name)
    if (normalize(a.name) === normalize(athleteName)) {
      return { athlete: a, score: 100 }
    }
    const matches = query.filter(q => aTokens.some(t => t.startsWith(q) || q.startsWith(t)))
    const score = (matches.length / Math.max(query.length, aTokens.length)) * 100
    if (score > 40 && (!best || score > best.score)) {
      best = { athlete: a, score }
    }
  }
  return best
}

export default function AdminParentsPage() {
  const [parents, setParents] = useState<ParentAccount[]>([])
  const [athletes, setAthletes] = useState<TrainingAthlete[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [linkingEmail, setLinkingEmail] = useState<string | null>(null)
  const [linkSelect, setLinkSelect] = useState("")
  const [approvingEmail, setApprovingEmail] = useState<string | null>(null)
  const [approveSelect, setApproveSelect] = useState("")
  const [approveExpiry, setApproveExpiry] = useState(defaultExpiry())
  const [extendingEmail, setExtendingEmail] = useState<string | null>(null)
  const [extendExpiry, setExtendExpiry] = useState("")
  const [saving, setSaving] = useState(false)
  const [sentEmail, setSentEmail] = useState<string | null>(null)
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [bulkResult, setBulkResult] = useState<{ approved: number; skipped: number } | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/parents").then(r => r.json()),
      fetch("/api/training").then(r => r.json()),
    ]).then(([pd, td]) => {
      if (pd.success) setParents(pd.parents)
      if (td.success) setAthletes(td.athletes)
    }).finally(() => setLoading(false))
  }, [])

  const expiringSoon = parents.filter(p => {
    const s = expiryStatus(p)
    return s === "soon" || s === "expired"
  }).length

  const filtered = parents.filter(p => {
    if (filter === "pending" && p.approvalStatus !== "pending") return false
    if (filter === "active" && p.subscriptionStatus !== "active") return false
    if (filter === "no-sub" && p.tier !== "none") return false
    if (filter === "expiring") {
      const s = expiryStatus(p)
      if (s !== "soon" && s !== "expired") return false
    }
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

  async function handleApprove(email: string, athleteId: string, expiry?: string) {
    setSaving(true)
    const res = await fetch("/api/admin/parents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "approve", athleteId, accessExpiry: expiry || approveExpiry }),
    }).then(r => r.json())
    if (res.success) {
      setParents(prev => prev.map(p => p.email === email
        ? { ...p, tier: "program", approvalStatus: "approved", athleteIds: res.athleteIds ?? p.athleteIds, accessExpiry: expiry || approveExpiry }
        : p))
    }
    setLinkingEmail(null)
    setLinkSelect("")
    setApprovingEmail(null)
    setApproveSelect("")
    setApproveExpiry(defaultExpiry())
    setSaving(false)
  }

  async function handleExtend(email: string, expiry: string) {
    setSaving(true)
    const res = await fetch("/api/admin/parents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "extend", accessExpiry: expiry }),
    }).then(r => r.json())
    if (res.success) {
      setParents(prev => prev.map(p => p.email === email ? { ...p, accessExpiry: expiry } : p))
    }
    setExtendingEmail(null)
    setExtendExpiry("")
    setSaving(false)
  }

  async function handleBulkApprove() {
    if (!selectedEmails.length) return
    setSaving(true)
    setBulkResult(null)
    const pending = parents.filter(p => selectedEmails.includes(p.email) && p.approvalStatus === "pending")
    const expiry = defaultExpiry()
    const results = await Promise.all(pending.map(async p => {
      const match = p.athleteName ? findBestMatch(p.athleteName, athletes.filter(a => !p.athleteIds.includes(a.id))) : null
      const athleteId = match?.athlete.id ?? ""
      const res = await fetch("/api/admin/parents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: p.email, action: "approve", athleteId, accessExpiry: expiry }),
      }).then(r => r.json())
      return { email: p.email, success: res.success, athleteIds: res.athleteIds }
    }))
    const approved = results.filter(r => r.success).length
    const skipped = results.length - approved
    setParents(prev => prev.map(p => {
      const r = results.find(x => x.email === p.email)
      if (!r?.success) return p
      return { ...p, tier: "program", approvalStatus: "approved", athleteIds: r.athleteIds ?? p.athleteIds, accessExpiry: expiry }
    }))
    setSelectedEmails([])
    setBulkResult({ approved, skipped })
    setTimeout(() => setBulkResult(null), 5000)
    setSaving(false)
  }

  async function handleDeny(email: string) {
    setSaving(true)
    await fetch("/api/admin/parents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "deny" }),
    })
    setParents(prev => prev.map(p => p.email === email ? { ...p, approvalStatus: "denied", tier: "none" } : p))
    setSaving(false)
  }

  async function handleResendEmail(email: string) {
    setSaving(true)
    await fetch("/api/admin/parents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "resend-email" }),
    })
    setSentEmail(email)
    setTimeout(() => setSentEmail(null), 3000)
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
    pending: parents.filter(p => p.approvalStatus === "pending").length,
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
            { label: "Pending Approval", value: stats.pending, color: "text-yellow-400" },
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
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "All" },
              { key: "pending", label: `Pending${stats.pending > 0 ? ` (${stats.pending})` : ""}` },
              { key: "expiring", label: `Expiring${expiringSoon > 0 ? ` (${expiringSoon})` : ""}` },
              { key: "active", label: "Active" },
              { key: "no-sub", label: "No Sub" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f.key
                    ? f.key === "expiring" ? "bg-orange-600 text-white" : "bg-red-600 text-white"
                    : f.key === "expiring" && expiringSoon > 0
                      ? "bg-orange-950/40 border border-orange-700/50 text-orange-300 hover:text-white"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk action bar — visible when pending parents exist */}
        {stats.pending > 0 && !loading && (() => {
          const pendingInView = filtered.filter(p => p.approvalStatus === "pending")
          const allSelected = pendingInView.length > 0 && pendingInView.every(p => selectedEmails.includes(p.email))
          return (
            <div className="flex flex-wrap items-center gap-3 bg-yellow-950/30 border border-yellow-700/40 rounded-xl px-4 py-3 mb-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => {
                    if (allSelected) setSelectedEmails([])
                    else setSelectedEmails(pendingInView.map(p => p.email))
                  }}
                  className="w-4 h-4 accent-yellow-500"
                />
                <span className="text-yellow-300 text-sm font-medium">
                  Select all pending ({pendingInView.length})
                </span>
              </label>
              {selectedEmails.length > 0 && (
                <>
                  <span className="text-yellow-600 text-xs">{selectedEmails.length} selected</span>
                  <button
                    onClick={handleBulkApprove}
                    disabled={saving}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-sm font-bold rounded-lg"
                  >
                    ✓ Bulk Approve ({selectedEmails.length})
                  </button>
                  <button
                    onClick={() => setSelectedEmails([])}
                    className="text-xs text-gray-500 hover:text-gray-300"
                  >
                    Clear
                  </button>
                </>
              )}
              {bulkResult && (
                <span className="text-green-400 text-xs font-medium ml-auto">
                  ✓ Approved {bulkResult.approved}{bulkResult.skipped > 0 ? ` · ${bulkResult.skipped} skipped` : ""}
                </span>
              )}
            </div>
          )
        })()}

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
              const expStatus = expiryStatus(parent)

              const isPending = parent.approvalStatus === "pending"
              const isDenied = parent.approvalStatus === "denied"
              const isExtending = extendingEmail === parent.email

              return (
                <div key={parent.email} className={`rounded-xl p-5 border ${
                  isPending ? "bg-yellow-950/20 border-yellow-700/40" :
                  expStatus === "expired" ? "bg-red-950/20 border-red-700/40" :
                  expStatus === "soon" ? "bg-orange-950/20 border-orange-700/40" :
                  isDenied ? "bg-gray-900 border-gray-700/40 opacity-60" :
                  "bg-white/5 border-white/10"
                }`}>

                  {/* Pending checkbox */}
                  {isPending && (
                    <label className="flex items-center gap-2 cursor-pointer select-none mb-3">
                      <input
                        type="checkbox"
                        checked={selectedEmails.includes(parent.email)}
                        onChange={() => setSelectedEmails(prev =>
                          prev.includes(parent.email)
                            ? prev.filter(e => e !== parent.email)
                            : [...prev, parent.email]
                        )}
                        className="w-4 h-4 accent-yellow-500"
                      />
                      <span className="text-yellow-600 text-xs">Select for bulk approve</span>
                    </label>
                  )}

                  {/* Pending approval banner */}
                  {isPending && (() => {
                    const unlinked = athletes.filter(a => !parent.athleteIds.includes(a.id))
                    const exactMatch = parent.requestedAthleteId ? unlinked.find(a => a.id === parent.requestedAthleteId) : null
                    const suggestion = exactMatch
                      ? { athlete: exactMatch, score: 100 }
                      : parent.athleteName ? findBestMatch(parent.athleteName, unlinked) : null
                    const currentSelect = approvingEmail === parent.email ? approveSelect : (suggestion?.athlete.id ?? "")
                    return (
                      <div className="flex flex-col gap-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg px-4 py-3 mb-4">
                        <div>
                          <p className="text-yellow-300 font-bold text-sm">⏳ Program Member — Approval Needed</p>
                          <p className="text-yellow-500 text-xs mt-0.5">Verify enrollment then approve or deny.</p>
                        </div>
                        {suggestion && (
                          <div className="flex items-center gap-2 bg-green-950/40 border border-green-700/40 rounded-lg px-3 py-2">
                            <span className="text-green-400 text-xs font-bold">Suggested match:</span>
                            <span className="text-green-300 text-xs">{suggestion.athlete.name}</span>
                            <span className="text-green-600 text-xs">({suggestion.athlete.id})</span>
                            <span className="text-green-700 text-xs ml-auto">{Math.round(suggestion.score)}% match</span>
                          </div>
                        )}
                        <div className="flex gap-2 flex-wrap items-center">
                          <select
                            value={currentSelect}
                            onChange={e => { setApprovingEmail(parent.email); setApproveSelect(e.target.value) }}
                            className={`bg-[#0a0a0f] border rounded-lg px-2 py-1.5 text-xs text-white outline-none ${suggestion && currentSelect === suggestion.athlete.id ? "border-green-600" : "border-white/20"}`}
                          >
                            <option value="">Select athlete…</option>
                            {athletes.map(a => (
                              <option key={a.id} value={a.id}>{a.name} ({a.id})</option>
                            ))}
                          </select>
                          <div className="flex flex-col gap-0.5">
                            <label className="text-xs text-gray-500">Access until</label>
                            <input
                              type="date"
                              value={approvingEmail === parent.email ? approveExpiry : defaultExpiry()}
                              onChange={e => { setApprovingEmail(parent.email); setApproveExpiry(e.target.value) }}
                              className="bg-[#0a0a0f] border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-green-600"
                            />
                          </div>
                          <button
                            onClick={() => handleApprove(parent.email, currentSelect, approvingEmail === parent.email ? approveExpiry : defaultExpiry())}
                            disabled={saving || !currentSelect}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs rounded-lg font-bold"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleDeny(parent.email)}
                            disabled={saving}
                            className="px-3 py-1.5 bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white text-xs rounded-lg font-bold"
                          >
                            ✕ Deny
                          </button>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Expiry warning banner */}
                  {(expStatus === "expired" || expStatus === "soon") && !isPending && (
                    <div className={`flex items-center justify-between rounded-lg px-3 py-2 mb-3 text-xs font-medium ${
                      expStatus === "expired"
                        ? "bg-red-950/60 border border-red-700/50 text-red-300"
                        : "bg-orange-950/50 border border-orange-700/40 text-orange-300"
                    }`}>
                      <span>
                        {expStatus === "expired"
                          ? `⚠ Access EXPIRED — ${new Date(parent.accessExpiry! + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                          : `⏰ Expiring soon — ${new Date(parent.accessExpiry! + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                      </span>
                      {!isExtending && (
                        <button
                          onClick={() => { setExtendingEmail(parent.email); setExtendExpiry(defaultExpiry()) }}
                          className="ml-3 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-xs font-bold"
                        >
                          Extend →
                        </button>
                      )}
                    </div>
                  )}

                  {/* Extend expiry inline */}
                  {isExtending && (
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3">
                      <span className="text-xs text-gray-400">New expiry:</span>
                      <input
                        type="date"
                        value={extendExpiry}
                        onChange={e => setExtendExpiry(e.target.value)}
                        className="bg-[#0a0a0f] border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-green-600"
                      />
                      <button
                        onClick={() => handleExtend(parent.email, extendExpiry)}
                        disabled={!extendExpiry || saving}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-xs rounded-lg font-bold"
                      >
                        ✓ Save
                      </button>
                      <button
                        onClick={() => { setExtendingEmail(null); setExtendExpiry("") }}
                        className="text-xs text-gray-500 hover:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {isDenied && (
                    <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2 mb-3">
                      ✕ Denied — subscribe email sent
                    </div>
                  )}

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
                        {parent.approvalStatus === "pending" && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-900 text-yellow-300">⏳ Pending</span>
                        )}
                        {parent.approvalStatus === "approved" && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-900 text-green-300">✓ Approved</span>
                        )}
                        {parent.approvalStatus === "denied" && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-900 text-red-400">✕ Denied</span>
                        )}
                        {/* Expiry badge */}
                        {expStatus === "expired" && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-900 text-red-300">EXPIRED</span>
                        )}
                        {expStatus === "soon" && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-900 text-orange-300">
                            Expires {new Date(parent.accessExpiry! + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                        {expStatus === "ok" && parent.accessExpiry && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-800 text-gray-400">
                            Until {new Date(parent.accessExpiry + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">{parent.email}</div>
                      {parent.phone && <div className="text-sm text-gray-500">{parent.phone}</div>}
                      {parent.athleteName && (
                        <div className="text-xs text-gray-500 mt-1">Athlete name: <span className="text-gray-300">{parent.athleteName}</span></div>
                      )}
                      {parent.requestedAthleteId && (
                        <div className="text-xs text-gray-500 mt-0.5">Athlete ID provided: <span className="font-mono text-blue-400 font-bold">{parent.requestedAthleteId}</span></div>
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
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => setLinkingEmail(parent.email)}
                            className="text-xs text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-400/60 rounded-lg px-3 py-1.5 transition-colors"
                          >
                            + Link Athlete
                          </button>
                          {parent.athleteIds.length > 0 && (
                            <button
                              onClick={() => handleResendEmail(parent.email)}
                              disabled={saving}
                              className={`text-xs border rounded-lg px-3 py-1.5 transition-colors ${
                                sentEmail === parent.email
                                  ? "text-green-400 border-green-400/40"
                                  : "text-yellow-400 hover:text-yellow-300 border-yellow-400/30 hover:border-yellow-400/60"
                              }`}
                            >
                              {sentEmail === parent.email ? "✓ Email Sent" : "Resend Email"}
                            </button>
                          )}
                          {/* Extend button for approved program members without expiry warning shown */}
                          {parent.approvalStatus === "approved" && parent.tier === "program" && expStatus === "ok" && !isExtending && (
                            <button
                              onClick={() => { setExtendingEmail(parent.email); setExtendExpiry(defaultExpiry()) }}
                              className="text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 rounded-lg px-3 py-1.5 transition-colors"
                            >
                              Extend
                            </button>
                          )}
                          {/* Manual approve — shows inline athlete picker */}
                          {parent.approvalStatus !== "approved" && !isPending && (
                            approvingEmail === parent.email ? (
                              <>
                                <select
                                  value={approveSelect}
                                  onChange={e => setApproveSelect(e.target.value)}
                                  className="text-xs bg-gray-800 border border-white/20 rounded-lg px-2 py-1.5 text-white outline-none"
                                >
                                  <option value="">Select athlete…</option>
                                  {athletes.map(a => (
                                    <option key={a.id} value={a.id}>{a.name} ({a.id})</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => handleApprove(parent.email, approveSelect)}
                                  disabled={!approveSelect || saving}
                                  className="text-xs bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-3 py-1.5 font-bold"
                                >
                                  ✓ Confirm
                                </button>
                                <button
                                  onClick={() => { setApprovingEmail(null); setApproveSelect("") }}
                                  className="text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg px-2 py-1.5"
                                >
                                  ✕
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => { setApprovingEmail(parent.email); setApproveSelect("") }}
                                disabled={saving}
                                className="text-xs text-green-400 hover:text-green-300 border border-green-400/30 hover:border-green-400/60 rounded-lg px-3 py-1.5 transition-colors"
                              >
                                ✓ Approve
                              </button>
                            )
                          )}
                          {parent.approvalStatus !== "denied" && !isPending && (
                            <button
                              onClick={() => handleDeny(parent.email)}
                              disabled={saving}
                              className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/60 rounded-lg px-3 py-1.5 transition-colors"
                            >
                              {parent.approvalStatus === "approved" ? "✕ Revoke Access" : "✕ Deny"}
                            </button>
                          )}
                        </div>
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
