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
  monthly:   { label: "Monthly",   cls: "bg-blue-900/60 text-blue-300 border border-blue-700/50" },
  quarterly: { label: "Quarterly", cls: "bg-purple-900/60 text-purple-300 border border-purple-700/50" },
  program:   { label: "Program",   cls: "bg-green-900/60 text-green-300 border border-green-700/50" },
  none:      { label: "No Sub",    cls: "bg-gray-800 text-gray-500 border border-gray-700" },
}

function defaultExpiry(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  return d.toISOString().split("T")[0]
}

function expiryStatus(parent: ParentAccount): "expired" | "soon" | "ok" | null {
  if (parent.tier !== "program" || parent.approvalStatus !== "approved" || !parent.accessExpiry) return null
  const days = Math.ceil((new Date(parent.accessExpiry + "T00:00:00").getTime() - Date.now()) / 86400000)
  if (days < 0) return "expired"
  if (days <= 3) return "soon"
  return "ok"
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

function isRegistered(p: ParentAccount) {
  return p.approvalStatus === "approved" && ["program", "monthly", "quarterly"].includes(p.tier)
}

export default function AdminParentsPage() {
  const [parents, setParents] = useState<ParentAccount[]>([])
  const [athletes, setAthletes] = useState<TrainingAthlete[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"registered" | "not-registered">("registered")
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState<string | null>(null)

  // Per-card expand state
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null)

  // Inline action state
  const [approvingEmail, setApprovingEmail] = useState<string | null>(null)
  const [approveSelect, setApproveSelect] = useState("")
  const [approveExpiry, setApproveExpiry] = useState(defaultExpiry())
  const [extendingEmail, setExtendingEmail] = useState<string | null>(null)
  const [extendExpiry, setExtendExpiry] = useState(defaultExpiry())
  const [linkingEmail, setLinkingEmail] = useState<string | null>(null)
  const [linkSelect, setLinkSelect] = useState("")
  const [resetSent, setResetSent] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/parents").then(r => r.json()),
      fetch("/api/training").then(r => r.json()),
    ]).then(([pd, td]) => {
      if (pd.success) setParents(pd.parents)
      if (td.success) setAthletes(td.athletes)
    }).finally(() => setLoading(false))
  }, [])

  // ── Actions ──────────────────────────────────────────────────────────────────

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
      setTab("registered")
    }
    setApprovingEmail(null); setApproveSelect(""); setApproveExpiry(defaultExpiry())
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
    setExtendingEmail(null); setExtendExpiry(defaultExpiry())
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
    if (res.success) setParents(prev => prev.map(p => p.email === email ? { ...p, athleteIds: res.athleteIds } : p))
    setLinkingEmail(null); setLinkSelect("")
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

  // ── Derived data ─────────────────────────────────────────────────────────────

  const registered = parents.filter(isRegistered)
  const notRegistered = parents.filter(p => !isRegistered(p))
  const pending = notRegistered.filter(p => p.approvalStatus === "pending")

  const q = search.toLowerCase()
  const visibleRegistered = registered.filter(p =>
    !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) ||
    athletes.filter(a => p.athleteIds.includes(a.id)).some(a => a.name.toLowerCase().includes(q))
  )
  const visibleNotRegistered = notRegistered.filter(p =>
    !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) ||
    (p.athleteName || "").toLowerCase().includes(q)
  )

  const current = tab === "registered" ? visibleRegistered : visibleNotRegistered

  // ── Card render ──────────────────────────────────────────────────────────────

  function ParentCard({ parent }: { parent: ParentAccount }) {
    const linkedAthletes = athletes.filter(a => parent.athleteIds.includes(a.id))
    const tier = TIER_LABELS[parent.tier] ?? TIER_LABELS.none
    const expStatus = expiryStatus(parent)
    const isPending = parent.approvalStatus === "pending"
    const isDenied = parent.approvalStatus === "denied"
    const isExpanded = expandedEmail === parent.email
    const isSaving = saving === parent.email

    // Suggested athlete match for pending parents
    const unlinked = athletes.filter(a => !parent.athleteIds.includes(a.id))
    const exact = parent.requestedAthleteId ? unlinked.find(a => a.id === parent.requestedAthleteId) : null
    const suggestion = exact ? { athlete: exact, score: 100 } : parent.athleteName ? findBestMatch(parent.athleteName, unlinked) : null
    const approveAthlete = approvingEmail === parent.email ? approveSelect : (suggestion?.athlete.id ?? "")

    // Expiry display
    let expiryLabel = ""
    if (parent.accessExpiry) {
      const days = Math.ceil((new Date(parent.accessExpiry + "T00:00:00").getTime() - Date.now()) / 86400000)
      expiryLabel = days < 0 ? "EXPIRED" : days === 0 ? "Expires today" : `${days}d left`
    }

    const cardBorder =
      isPending ? "border-yellow-700/50 bg-yellow-950/10" :
      expStatus === "expired" ? "border-red-700/50 bg-red-950/10" :
      expStatus === "soon" ? "border-orange-700/50 bg-orange-950/10" :
      isDenied ? "border-gray-700/30 bg-gray-900/40 opacity-60" :
      "border-white/10 bg-white/5"

    return (
      <div className={`rounded-2xl border ${cardBorder} overflow-hidden transition-all`}>

        {/* Card header — always visible */}
        <div className="px-5 py-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {/* Name + badges */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="font-bold text-white text-sm">{parent.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${tier.cls}`}>{tier.label}</span>
              {isPending && <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-yellow-900/60 text-yellow-300 border border-yellow-700/50">Pending</span>}
              {isDenied && <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-gray-800 text-gray-500 border border-gray-700">Denied</span>}
              {expStatus === "expired" && <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-900/60 text-red-300 border border-red-700/50">Expired</span>}
              {expStatus === "soon" && <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-orange-900/60 text-orange-300 border border-orange-700/50">Expiring Soon</span>}
            </div>

            {/* Email */}
            <p className="text-xs text-gray-400">{parent.email}</p>
            {parent.phone && <p className="text-xs text-gray-600 mt-0.5">{parent.phone}</p>}

            {/* Linked athletes */}
            {linkedAthletes.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {linkedAthletes.map(a => (
                  <span key={a.id} className="text-xs bg-gray-800 text-gray-300 border border-gray-700 px-2 py-0.5 rounded-lg font-mono">
                    {a.name} · {a.id}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600 mt-1.5">No athlete linked</p>
            )}

            {/* Expiry */}
            {expiryLabel && (
              <p className={`text-xs mt-1.5 font-semibold ${expStatus === "expired" ? "text-red-400" : expStatus === "soon" ? "text-orange-400" : "text-gray-500"}`}>
                Access: {new Date(parent.accessExpiry! + "T00:00:00").toLocaleDateString()} · {expiryLabel}
              </p>
            )}
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpandedEmail(isExpanded ? null : parent.email)}
            className="shrink-0 text-gray-500 hover:text-white text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg transition-colors"
          >
            {isExpanded ? "▲ Less" : "▼ Actions"}
          </button>
        </div>

        {/* Expanded actions */}
        {isExpanded && (
          <div className="border-t border-white/10 px-5 py-4 space-y-4 bg-black/20">

            {/* Pending approval */}
            {isPending && (
              <div className="bg-yellow-950/30 border border-yellow-700/40 rounded-xl p-4 space-y-3">
                <p className="text-yellow-300 font-bold text-sm">⏳ Approve Program Access</p>
                {suggestion && (
                  <div className="flex items-center gap-2 bg-green-950/40 border border-green-700/40 rounded-lg px-3 py-2">
                    <span className="text-green-400 text-xs font-bold">Suggested:</span>
                    <span className="text-green-300 text-xs">{suggestion.athlete.name} ({suggestion.athlete.id})</span>
                    <span className="text-green-600 text-xs ml-auto">{Math.round(suggestion.score)}% match</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 items-end">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Athlete</p>
                    <select
                      value={approveAthlete}
                      onChange={e => { setApprovingEmail(parent.email); setApproveSelect(e.target.value) }}
                      className="bg-[#0a0a0f] border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-green-500"
                    >
                      <option value="">Select athlete…</option>
                      {athletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Access until</p>
                    <input
                      type="date"
                      value={approvingEmail === parent.email ? approveExpiry : defaultExpiry()}
                      onChange={e => { setApprovingEmail(parent.email); setApproveExpiry(e.target.value) }}
                      className="bg-[#0a0a0f] border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-green-500"
                    />
                  </div>
                  <button
                    onClick={() => handleApprove(parent.email, approveAthlete, approvingEmail === parent.email ? approveExpiry : defaultExpiry())}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    {isSaving ? "Approving…" : "✓ Approve"}
                  </button>
                  <button
                    onClick={() => handleDeny(parent.email)}
                    disabled={isSaving}
                    className="px-4 py-2 bg-red-900 hover:bg-red-800 disabled:opacity-40 text-red-300 text-xs font-bold rounded-lg transition-colors"
                  >
                    ✕ Deny
                  </button>
                </div>
              </div>
            )}

            {/* Extend access (program members) */}
            {parent.tier === "program" && parent.approvalStatus === "approved" && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Extend Access</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    type="date"
                    value={extendingEmail === parent.email ? extendExpiry : defaultExpiry()}
                    onChange={e => { setExtendingEmail(parent.email); setExtendExpiry(e.target.value) }}
                    className="bg-[#0a0a0f] border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleExtend(parent.email, extendingEmail === parent.email ? extendExpiry : defaultExpiry())}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    {isSaving ? "Saving…" : "Extend"}
                  </button>
                  {(expStatus === "expired" || expStatus === "soon") && (
                    <button
                      onClick={() => handleDeny(parent.email)}
                      disabled={isSaving}
                      className="px-4 py-2 bg-red-900/60 hover:bg-red-800 text-red-300 text-xs font-bold rounded-lg border border-red-800/50 transition-colors"
                    >
                      Revoke Access
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Link / Unlink athletes */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Linked Athletes</p>
              {linkedAthletes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {linkedAthletes.map(a => (
                    <div key={a.id} className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5">
                      <span className="text-xs text-white font-mono">{a.name} · {a.id}</span>
                      <button
                        onClick={() => handleUnlink(parent.email, a.id)}
                        disabled={isSaving}
                        className="text-red-500 hover:text-red-300 text-xs font-bold disabled:opacity-40"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 items-center">
                <select
                  value={linkingEmail === parent.email ? linkSelect : ""}
                  onChange={e => { setLinkingEmail(parent.email); setLinkSelect(e.target.value) }}
                  className="bg-[#0a0a0f] border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                >
                  <option value="">Link an athlete…</option>
                  {athletes.filter(a => !parent.athleteIds.includes(a.id)).map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.id})</option>
                  ))}
                </select>
                {linkingEmail === parent.email && linkSelect && (
                  <button
                    onClick={() => handleLink(parent.email, linkSelect)}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    {isSaving ? "Linking…" : "Link"}
                  </button>
                )}
              </div>
            </div>

            {/* Bottom actions row */}
            <div className="flex flex-wrap gap-2">
              {/* Send reset link */}
              <button
                onClick={() => handleSendReset(parent.email)}
                disabled={isSaving || resetSent === parent.email}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors ${
                  resetSent === parent.email
                    ? "bg-green-900/40 text-green-300 border-green-700/50"
                    : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:border-white/30"
                }`}
              >
                {resetSent === parent.email ? "✓ Reset Link Sent" : "📧 Send Password Reset"}
              </button>

              {/* Re-approve denied */}
              {isDenied && (
                <button
                  onClick={() => { setApprovingEmail(parent.email); setExpandedEmail(parent.email) }}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-green-700/50 bg-green-900/20 text-green-300 hover:bg-green-900/40 transition-colors"
                >
                  Re-Approve
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  const regCount = registered.length
  const notRegCount = notRegistered.length
  const pendingCount = pending.length

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Admin</Link>
          <h1 className="text-xl font-bold">Parent Accounts</h1>
        </div>
        <LogoutButton />
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Parents", value: parents.length, color: "text-white" },
            { label: "Registered", value: regCount, color: "text-green-400" },
            { label: "Not Registered", value: notRegCount, color: "text-gray-400" },
            { label: "Pending Approval", value: pendingCount, color: "text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab("registered")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors border ${
              tab === "registered"
                ? "bg-green-600 text-white border-green-500"
                : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            ✓ Registered ({regCount})
          </button>
          <button
            onClick={() => setTab("not-registered")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors border relative ${
              tab === "not-registered"
                ? "bg-yellow-600 text-white border-yellow-500"
                : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            Not Registered ({notRegCount})
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, email, or athlete..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500 mb-5"
        />

        {/* Cards */}
        {loading ? (
          <div className="text-center text-gray-500 py-16">Loading...</div>
        ) : current.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">
              {search ? "No results found." : tab === "registered" ? "No registered parents yet." : "No unregistered parents."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {current.map(p => <ParentCard key={p.email} parent={p} />)}
          </div>
        )}

      </main>
    </div>
  )
}
