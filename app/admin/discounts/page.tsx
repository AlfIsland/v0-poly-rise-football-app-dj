"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"

interface Discount {
  code: string; type: "percent" | "fixed"; value: number
  maxUses: number; usedCount: number; expiresAt?: string
  active: boolean; note?: string; createdAt: string
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [code, setCode] = useState("")
  const [type, setType] = useState<"percent" | "fixed">("percent")
  const [value, setValue] = useState("")
  const [maxUses, setMaxUses] = useState("50")
  const [expiresAt, setExpiresAt] = useState("")
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const load = async () => {
    const res = await fetch("/api/admin/discounts")
    const data = await res.json()
    if (data.success) setDiscounts(data.discounts)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    if (!code || !value) return
    setSaving(true); setMsg("")
    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, type, value: Number(value), maxUses: Number(maxUses), expiresAt: expiresAt || undefined, note }),
    })
    const data = await res.json()
    if (data.success) {
      setMsg(`✓ Code ${code.toUpperCase()} created`)
      setCode(""); setValue(""); setMaxUses("50"); setExpiresAt(""); setNote("")
      setShowAdd(false)
      await load()
      setTimeout(() => setMsg(""), 4000)
    } else {
      setMsg("Error: " + data.error)
    }
    setSaving(false)
  }

  const toggleActive = async (c: Discount) => {
    await fetch("/api/admin/discounts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: c.code, active: !c.active }),
    })
    await load()
  }

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    const rand = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    setCode(`POLY${rand}`)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 border-b border-gray-800 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={40} height={40} className="object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-white">Discount Codes</h1>
              <p className="text-gray-400 text-sm">Create and manage promo codes for registration</p>
              <div className="flex gap-4 mt-0.5">
                <Link href="/admin/registrations" className="text-xs text-gray-600 hover:text-gray-400 underline">Registrations</Link>
                <Link href="/admin/crm" className="text-xs text-gray-600 hover:text-gray-400 underline">Parent CRM</Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAdd(v => !v)}
              className={`font-semibold px-4 py-2 rounded-xl text-sm transition-colors ${showAdd ? "bg-gray-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}>
              {showAdd ? "✕ Close" : "+ New Code"}
            </button>
            <LogoutButton />
          </div>
        </div>

        {msg && <div className="bg-green-950 border border-green-800 rounded-xl px-4 py-3 text-green-300 text-sm mb-6">{msg}</div>}

        {/* Add form */}
        {showAdd && (
          <div className="bg-gray-900 rounded-2xl border border-red-900 p-6 mb-8 space-y-4">
            <h2 className="text-sm font-bold text-red-400 uppercase tracking-widest">Create Discount Code</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Code *</label>
                <div className="flex gap-2">
                  <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. POLY2025"
                    className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm font-mono uppercase" />
                  <button onClick={generateCode} className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-3 rounded-lg">Auto</button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Discount Type *</label>
                <select value={type} onChange={e => setType(e.target.value as "percent" | "fixed")}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm">
                  <option value="percent">Percentage (% off)</option>
                  <option value="fixed">Fixed Amount ($ off)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Value * {type === "percent" ? "(e.g. 10 = 10% off)" : "(e.g. 25 = $25 off)"}</label>
                <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder={type === "percent" ? "10" : "25"}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Max Uses (0 = unlimited)</label>
                <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="50"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Expires (optional)</label>
                <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Note (internal only)</label>
                <input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Spring camp promo"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
              </div>
            </div>
            <button onClick={handleAdd} disabled={!code || !value || saving}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold rounded-xl px-8 py-2.5 text-sm transition-colors">
              {saving ? "Creating..." : "Create Code"}
            </button>
          </div>
        )}

        {/* Codes table */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-600">Loading...</div>
        ) : discounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600 gap-2">
            <p>No discount codes yet.</p>
            <button onClick={() => setShowAdd(true)} className="text-red-400 underline text-sm">Create your first code</button>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-4">Code</th>
                  <th className="text-left px-5 py-4">Discount</th>
                  <th className="text-left px-5 py-4">Uses</th>
                  <th className="text-left px-5 py-4">Expires</th>
                  <th className="text-left px-5 py-4">Status</th>
                  <th className="text-left px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map(d => (
                  <tr key={d.code} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-mono font-bold text-white">{d.code}</p>
                      {d.note && <p className="text-xs text-gray-500">{d.note}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-yellow-400 font-bold">
                        {d.type === "percent" ? `${d.value}% off` : `$${d.value} off`}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white">{d.usedCount} / {d.maxUses === 0 ? "∞" : d.maxUses}</p>
                      {d.maxUses > 0 && (
                        <div className="w-20 bg-gray-700 rounded-full h-1 mt-1">
                          <div className="bg-red-500 h-1 rounded-full" style={{ width: `${Math.min(100, (d.usedCount / d.maxUses) * 100)}%` }} />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-400">
                        {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Never"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${d.active ? "bg-green-900 text-green-300" : "bg-gray-800 text-gray-500"}`}>
                        {d.active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleActive(d)}
                        className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1 rounded-lg transition-colors">
                        {d.active ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
