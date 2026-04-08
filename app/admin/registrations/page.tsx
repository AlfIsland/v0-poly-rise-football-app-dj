"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"

interface Registration {
  id: string; program: string; programName: string
  playerName: string; playerAge: string; playerGrade: string
  playerSchool: string; playerPosition: string
  parentName: string; email: string; phone: string
  amount: number; billing: string; status: string
  createdAt: string; paidAt?: string
}

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-900 text-green-300",
  pending: "bg-yellow-900 text-yellow-300",
  canceled: "bg-gray-800 text-gray-500",
}

const CATEGORY_LABELS: Record<string, string> = {
  "player-dev": "Training", "elite-360": "Training", "girls-dev": "Training",
  "summer-k5": "Camp", "summer-ms": "Camp", "summer-hs": "Camp",
  "combine": "Event", "hike": "Event", "tournament-ms": "Event", "tournament-hs": "Event",
  "exposure-basic-3": "Recruiting", "exposure-basic-6": "Recruiting", "exposure-basic-12": "Recruiting",
  "exposure-enhanced-3": "Recruiting", "exposure-enhanced-6": "Recruiting", "exposure-enhanced-12": "Recruiting",
}

export default function RegistrationsPage() {
  const [regs, setRegs] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/admin/registrations")
      .then(r => r.json())
      .then(d => { if (d.success) setRegs(d.registrations) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = regs.filter(r => {
    if (filter !== "all" && r.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return r.playerName.toLowerCase().includes(q)
        || r.parentName.toLowerCase().includes(q)
        || r.email.toLowerCase().includes(q)
        || r.programName.toLowerCase().includes(q)
    }
    return true
  })

  const stats = {
    total: regs.length,
    paid: regs.filter(r => r.status === "paid").length,
    pending: regs.filter(r => r.status === "pending").length,
    revenue: regs.filter(r => r.status === "paid").reduce((s, r) => s + r.amount, 0),
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 border-b border-gray-800 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={40} height={40} className="object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-white">Program Registrations</h1>
              <p className="text-gray-400 text-sm">All program sign-ups and payments</p>
              <div className="flex gap-4 mt-0.5">
                <Link href="/admin/athletes" className="text-xs text-gray-600 hover:text-gray-400 underline">PR-VERIFIED Roster</Link>
                <Link href="/admin/crm" className="text-xs text-gray-600 hover:text-gray-400 underline">Parent CRM</Link>
                <Link href="/training" className="text-xs text-gray-600 hover:text-gray-400 underline">Training Tracker</Link>
              </div>
            </div>
          </div>
          <LogoutButton />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Registrations", value: stats.total, color: "text-white" },
            { label: "Paid", value: stats.paid, color: "text-green-400" },
            { label: "Pending", value: stats.pending, color: "text-yellow-400" },
            { label: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, color: "text-red-400" },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 rounded-xl px-4 py-3 border border-gray-800">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search player, parent, email, program..."
            className="flex-1 bg-gray-900 text-white rounded-xl px-4 py-2.5 border border-gray-800 focus:border-red-500 focus:outline-none text-sm" />
          <div className="flex gap-2">
            {["all", "paid", "pending", "canceled"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${filter === s ? "bg-red-600 text-white" : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-600">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600 gap-2">
            <p>No registrations found.</p>
            <Link href="/register" className="text-red-400 underline text-sm" target="_blank">View registration page →</Link>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-4">Player</th>
                    <th className="text-left px-5 py-4">Parent / Contact</th>
                    <th className="text-left px-5 py-4">Program</th>
                    <th className="text-left px-5 py-4">Amount</th>
                    <th className="text-left px-5 py-4">Status</th>
                    <th className="text-left px-5 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{r.playerName}</p>
                        <p className="text-xs text-gray-500">{[r.playerAge && `Age ${r.playerAge}`, r.playerGrade && `${r.playerGrade} grade`, r.playerPosition].filter(Boolean).join(" · ")}</p>
                        {r.playerSchool && <p className="text-xs text-gray-600">{r.playerSchool}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white">{r.parentName}</p>
                        <p className="text-xs text-gray-500">{r.email}</p>
                        <p className="text-xs text-gray-600">{r.phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white text-xs font-semibold">{r.programName}</p>
                        <span className="text-xs text-gray-500">{CATEGORY_LABELS[r.program] ?? "—"} · {r.billing === "monthly" ? "Monthly" : "One-time"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white font-semibold">${r.amount}{r.billing === "monthly" ? "/mo" : ""}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUS_COLORS[r.status] ?? "bg-gray-800 text-gray-400"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        {r.paidAt && <p className="text-xs text-green-600">Paid {new Date(r.paidAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
