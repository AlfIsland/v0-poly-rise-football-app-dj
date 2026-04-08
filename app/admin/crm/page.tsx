"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import LogoutButton from "@/components/logout-button"

interface Parent {
  email: string; name: string; phone?: string; tier: string
  subscriptionStatus?: string; subscriptionEnd?: string
  athleteIds: string[]; createdAt: string; stripeCustomerId?: string
}

interface Athlete { id: string; name: string; grade: string; position?: string }

const TIER_COLORS: Record<string, string> = {
  program: "bg-blue-900 text-blue-300",
  monthly: "bg-green-900 text-green-300",
  quarterly: "bg-purple-900 text-purple-300",
  none: "bg-gray-800 text-gray-500",
}

export default function CRMPage() {
  const [parents, setParents] = useState<Parent[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [addEmail, setAddEmail] = useState("")
  const [addName, setAddName] = useState("")
  const [addPhone, setAddPhone] = useState("")
  const [addTier, setAddTier] = useState<"program" | "monthly" | "quarterly">("program")
  const [addAthleteId, setAddAthleteId] = useState("")
  const [addPassword, setAddPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const fetch_ = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        fetch("/api/admin/crm"),
        fetch("/api/training"),
      ])
      const pData = await pRes.json()
      const aData = await aRes.json()
      if (pData.success) setParents(pData.parents)
      if (aData.success) setAthletes(aData.athletes)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetch_() }, [])

  const handleAddParent = async () => {
    if (!addEmail || !addName || !addPassword) return
    setSaving(true); setMsg("")
    try {
      // Register the parent account
      const regRes = await fetch("/api/parent/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addEmail, name: addName, phone: addPhone, password: addPassword }),
      })
      const regData = await regRes.json()
      if (!regData.success && !regData.error?.includes("already exists")) {
        setMsg("Error: " + regData.error); setSaving(false); return
      }

      // Set tier
      await fetch("/api/parent/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addEmail, tier: addTier }),
      })

      // Link athlete if selected
      if (addAthleteId) {
        await fetch("/api/parent/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: addEmail, action: "link-athlete", athleteId: addAthleteId }),
        })
      }

      setMsg(`✓ ${addName} added as ${addTier} member`)
      setAddEmail(""); setAddName(""); setAddPhone(""); setAddAthleteId(""); setAddPassword("")
      setShowAdd(false)
      await fetch_()
      setTimeout(() => setMsg(""), 4000)
    } catch { setMsg("Something went wrong.") }
    setSaving(false)
  }

  const handleLinkAthlete = async (parentEmail: string, athleteId: string) => {
    await fetch("/api/parent/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: parentEmail, action: "link-athlete", athleteId }),
    })
    await fetch_()
  }

  const handleSetTier = async (parentEmail: string, tier: string) => {
    await fetch("/api/parent/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: parentEmail, tier }),
    })
    await fetch_()
  }

  const stats = {
    total: parents.length,
    program: parents.filter(p => p.tier === "program").length,
    paying: parents.filter(p => p.tier === "monthly" || p.tier === "quarterly").length,
    mrr: parents.filter(p => p.tier === "monthly").length * 9.99
      + parents.filter(p => p.tier === "quarterly").length * (24.99 / 3),
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 border-b border-gray-800 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={40} height={40} className="object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-white">Parent CRM</h1>
              <p className="text-gray-400 text-sm">Manage parent accounts, subscriptions & athlete links</p>
              <div className="flex gap-4 mt-0.5">
                <Link href="/admin/athletes" className="text-xs text-gray-600 hover:text-gray-400 underline">PR-VERIFIED Roster</Link>
                <Link href="/training" className="text-xs text-gray-600 hover:text-gray-400 underline">Training Tracker</Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAdd(v => !v)}
              className={`font-semibold px-4 py-2 rounded-xl text-sm transition-colors ${showAdd ? "bg-gray-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}>
              {showAdd ? "✕ Close" : "+ Add Parent"}
            </button>
            <LogoutButton />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Parents", value: stats.total, color: "text-white" },
            { label: "Program Members", value: stats.program, color: "text-blue-400" },
            { label: "Paying Subscribers", value: stats.paying, color: "text-green-400" },
            { label: "Est. MRR", value: `$${stats.mrr.toFixed(2)}`, color: "text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 rounded-xl px-4 py-3 border border-gray-800">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {msg && <div className="bg-green-950 border border-green-800 rounded-xl px-4 py-3 text-green-300 text-sm mb-6">{msg}</div>}

        {/* Add parent form */}
        {showAdd && (
          <div className="bg-gray-900 rounded-2xl border border-red-900 p-6 mb-8 space-y-4">
            <h2 className="text-sm font-bold text-red-400 uppercase tracking-widest">Add Parent Account</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Parent Name *</label>
                <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="e.g. Maria Johnson"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email *</label>
                <input type="email" value={addEmail} onChange={e => setAddEmail(e.target.value)} placeholder="parent@email.com"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Temp Password * (parent can change)</label>
                <input type="text" value={addPassword} onChange={e => setAddPassword(e.target.value)} placeholder="e.g. PolyRISE2025!"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Phone</label>
                <input value={addPhone} onChange={e => setAddPhone(e.target.value)} placeholder="(817) 555-1234"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tier</label>
                <select value={addTier} onChange={e => setAddTier(e.target.value as "program" | "monthly" | "quarterly")}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm">
                  <option value="program">Program Member (Free)</option>
                  <option value="monthly">Monthly Subscriber</option>
                  <option value="quarterly">Quarterly Subscriber</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Link Athlete (optional)</label>
                <select value={addAthleteId} onChange={e => setAddAthleteId(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm">
                  <option value="">Select athlete...</option>
                  {athletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleAddParent} disabled={!addEmail || !addName || !addPassword || saving}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl px-8 py-2.5 text-sm transition-colors">
              {saving ? "Adding..." : "Add Parent"}
            </button>
          </div>
        )}

        {/* Parents table */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-600">Loading...</div>
        ) : parents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600 gap-3">
            <p className="text-lg">No parent accounts yet.</p>
            <button onClick={() => setShowAdd(true)} className="text-red-400 underline text-sm">Add your first parent</button>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-4">Parent</th>
                  <th className="text-left px-6 py-4">Tier</th>
                  <th className="text-left px-6 py-4">Athletes</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Link Athlete</th>
                </tr>
              </thead>
              <tbody>
                {parents.map(p => {
                  const linkedAthletes = athletes.filter(a => p.athleteIds.includes(a.id))
                  return (
                    <tr key={p.email} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.email}</p>
                        {p.phone && <p className="text-xs text-gray-600">{p.phone}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <select value={p.tier}
                          onChange={e => handleSetTier(p.email, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${TIER_COLORS[p.tier] ?? "bg-gray-800 text-gray-400"}`}>
                          <option value="program">Program</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="none">None</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {linkedAthletes.length ? (
                          <div className="space-y-0.5">
                            {linkedAthletes.map(a => (
                              <p key={a.id} className="text-xs text-gray-300">{a.name} <span className="text-gray-600 font-mono">({a.id})</span></p>
                            ))}
                          </div>
                        ) : <span className="text-gray-600 text-xs">None linked</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold ${
                          p.subscriptionStatus === "active" ? "text-green-400" :
                          p.subscriptionStatus === "past_due" ? "text-yellow-400" :
                          p.tier === "program" ? "text-blue-400" : "text-gray-600"
                        }`}>
                          {p.tier === "program" ? "Program Member" : p.subscriptionStatus ?? "—"}
                        </span>
                        {p.subscriptionEnd && (
                          <p className="text-xs text-gray-600">Renews {new Date(p.subscriptionEnd).toLocaleDateString()}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select defaultValue=""
                          onChange={e => { if (e.target.value) { handleLinkAthlete(p.email, e.target.value); e.target.value = "" } }}
                          className="text-xs bg-gray-700 text-white rounded-lg px-2 py-1 border border-gray-600 focus:outline-none">
                          <option value="">+ Link athlete</option>
                          {athletes.filter(a => !p.athleteIds.includes(a.id)).map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
