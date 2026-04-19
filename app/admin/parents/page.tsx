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
  approvalStatus?: string
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

export default function AdminParentsPage() {
  const [parents, setParents] = useState<ParentAccount[]>([])
  const [athletes, setAthletes] = useState<TrainingAthlete[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  // Per-parent state for selects/dates
  const [athleteSelect, setAthleteSelect] = useState<Record<string, string>>({})
  const [expiryDate, setExpiryDate] = useState<Record<string, string>>({})
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

  async function handleApprove(email: string) {
    const athleteId = athleteSelect[email] ?? ""
    const expiry = expiryDate[email] ?? defaultExpiry()
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

  async function handleExtend(email: string) {
    const expiry = expiryDate[email] ?? defaultExpiry()
    setSaving(email)
    const res = await fetch("/api/admin/parents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "extend", accessExpiry: expiry }),
    }).then(r => r.json())
    if (res.success) setParents(prev => prev.map(p => p.email === email ? { ...p, accessExpiry: expiry } : p))
    setSaving(null)
  }

  async function handleLink(email: string) {
    const athleteId = linkSelect[email]
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

  async function handleReset(email: string) {
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

  const q = search.toLowerCase()
  const filtered = parents.filter(p =>
    !q ||
    p.name.toLowerCase().includes(q) ||
    p.email.toLowerCase().includes(q) ||
    athletes.filter(a => p.athleteIds.includes(a.id)).some(a => a.name.toLowerCase().includes(q))
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
              {parents.length} total
              {pendingCount > 0 && <span className="text-yellow-400 font-semibold"> · {pendingCount} pending approval</span>}
            </p>
          </div>
        </div>
        <LogoutButton />
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        <input
          type="text"
          placeholder="Search by name, email, or athlete..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500"
        />

        {loading && <p className="text-center text-gray-500 py-12">Loading...</p>}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">{search ? "No results." : "No parent accounts yet."}</p>
        )}

        {filtered.map(parent => {
          const isSaving = saving === parent.email
          const isOpen = expanded === parent.email
          const linkedAthletes = athletes.filter(a => parent.athleteIds.includes(a.id))
          const unlinkedAthletes = athletes.filter(a => !parent.athleteIds.includes(a.id))
          const status = parent.approvalStatus
          const isApproved = status === "approved"
          const isDenied = status === "denied"
          const isPending = status === "pending"

          let expiryText = ""
          let expiryColor = "text-gray-500"
          if (parent.accessExpiry) {
            const days = Math.ceil((new Date(parent.accessExpiry + "T00:00:00").getTime() - Date.now()) / 86400000)
            if (days < 0) { expiryText = "EXPIRED"; expiryColor = "text-red-400" }
            else if (days <= 3) { expiryText = `${days}d left`; expiryColor = "text-orange-400" }
            else expiryText = `${days}d left`
          }

          const borderColor = isPending ? "border-yellow-600/50" : isDenied ? "border-white/5" : isApproved ? "border-white/10" : "border-white/10"

          return (
            <div key={parent.email} className={`rounded-2xl border ${borderColor} bg-white/5 overflow-hidden`}>

              {/* Info + action buttons */}
              <div className="px-5 py-4">
                {/* Name row */}
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-bold text-white text-base">{parent.name}</p>
                  {isPending  && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/60 text-yellow-300 border border-yellow-700/50 font-semibold">⏳ Pending</span>}
                  {isApproved && <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-300 border border-green-700/40 font-semibold">✓ Approved</span>}
                  {isDenied   && <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/50 text-red-300 border border-red-800/50 font-semibold">✕ Denied</span>}
                  {!status    && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 border border-gray-700 font-semibold">No Status</span>}
                  {parent.tier === "monthly"   && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 font-semibold">Monthly</span>}
                  {parent.tier === "quarterly" && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 font-semibold">Quarterly</span>}
                  {parent.tier === "program"   && <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/60 text-green-300 border border-green-700/50 font-semibold">Program</span>}
                </div>

                <p className="text-sm text-gray-400">{parent.email}</p>
                {parent.phone && <p className="text-xs text-gray-600 mt-0.5">{parent.phone}</p>}

                {/* Linked athletes */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {linkedAthletes.length > 0
                    ? linkedAthletes.map(a => (
                        <span key={a.id} className="text-xs bg-gray-800 text-gray-300 border border-gray-700 px-2 py-0.5 rounded-lg">
                          {a.name} · <span className="font-mono">{a.id}</span>
                        </span>
                      ))
                    : <span className="text-xs text-gray-600">No athlete linked</span>
                  }
                </div>

                {/* Expiry */}
                {expiryText && (
                  <p className={`text-xs mt-1 font-semibold ${expiryColor}`}>
                    Access expires: {new Date(parent.accessExpiry! + "T00:00:00").toLocaleDateString()} · {expiryText}
                  </p>
                )}

                {/* ── Action buttons — ALWAYS VISIBLE ── */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleApprove(parent.email)}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    {isSaving ? "Saving…" : isApproved ? "Re-Approve" : "✓ Approve"}
                  </button>

                  <button
                    onClick={() => handleDeny(parent.email)}
                    disabled={isSaving}
                    className="px-4 py-2 bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    {isApproved ? "Revoke Access" : "✕ Deny"}
                  </button>

                  <button
                    onClick={() => setExpanded(isOpen ? null : parent.email)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs font-bold rounded-xl border border-white/10 transition-colors"
                  >
                    {isOpen ? "▲ Less" : "⚙ More Options"}
                  </button>
                </div>
              </div>

              {/* ── Expanded: link athletes, extend access, reset password ── */}
              {isOpen && (
                <div className="border-t border-white/10 px-5 py-4 bg-black/20 space-y-5">

                  {/* Athlete + expiry for approve */}
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Approve Settings</p>
                    <div className="flex flex-wrap gap-3 items-end">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Athlete</p>
                        <select
                          value={athleteSelect[parent.email] ?? ""}
                          onChange={e => setAthleteSelect(prev => ({ ...prev, [parent.email]: e.target.value }))}
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
                          value={expiryDate[parent.email] ?? defaultExpiry()}
                          onChange={e => setExpiryDate(prev => ({ ...prev, [parent.email]: e.target.value }))}
                          className="bg-[#0a0a0f] border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Extend access */}
                  {isApproved && parent.tier === "program" && (
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Extend Access</p>
                      <div className="flex flex-wrap gap-2 items-center">
                        <input
                          type="date"
                          value={expiryDate[parent.email] ?? defaultExpiry()}
                          onChange={e => setExpiryDate(prev => ({ ...prev, [parent.email]: e.target.value }))}
                          className="bg-[#0a0a0f] border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none"
                        />
                        <button onClick={() => handleExtend(parent.email)} disabled={isSaving}
                          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors">
                          {isSaving ? "Saving…" : "Extend"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Link / Unlink athletes */}
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Linked Athletes</p>
                    {linkedAthletes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {linkedAthletes.map(a => (
                          <div key={a.id} className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5">
                            <span className="text-xs text-white font-mono">{a.name} · {a.id}</span>
                            <button onClick={() => handleUnlink(parent.email, a.id)} disabled={isSaving}
                              className="text-red-400 hover:text-red-200 text-xs font-bold">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                    {unlinkedAthletes.length > 0 && (
                      <div className="flex gap-2 items-center">
                        <select
                          value={linkSelect[parent.email] ?? ""}
                          onChange={e => setLinkSelect(prev => ({ ...prev, [parent.email]: e.target.value }))}
                          className="bg-[#0a0a0f] border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none"
                        >
                          <option value="">Link an athlete…</option>
                          {unlinkedAthletes.map(a => (
                            <option key={a.id} value={a.id}>{a.name} ({a.id})</option>
                          ))}
                        </select>
                        {linkSelect[parent.email] && (
                          <button onClick={() => handleLink(parent.email)} disabled={isSaving}
                            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors">
                            {isSaving ? "Linking…" : "Link"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Password reset */}
                  <button
                    onClick={() => handleReset(parent.email)}
                    disabled={isSaving || resetSent === parent.email}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors ${
                      resetSent === parent.email
                        ? "bg-green-900/40 text-green-300 border-green-700/50"
                        : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                    }`}
                  >
                    {resetSent === parent.email ? "✓ Reset Link Sent" : "📧 Send Password Reset"}
                  </button>

                </div>
              )}
            </div>
          )
        })}
      </main>
    </div>
  )
}
