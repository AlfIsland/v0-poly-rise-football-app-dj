"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"
import SendContactButtons from "@/components/send-contact-buttons"

interface Athlete {
  code: string; athleteName: string; position?: string
  school?: string; gradYear?: string; issuedAt?: string; expiresAt?: string
}

function getSealStatus(expiresAt?: string) {
  if (!expiresAt) return { label: "—", color: "text-gray-600" }
  const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000)
  if (days <= 0) return { label: "EXPIRED", color: "text-red-400 font-semibold" }
  if (days <= 30) return { label: `${new Date(expiresAt).toLocaleDateString()} (${days}d)`, color: "text-yellow-400" }
  return { label: new Date(expiresAt).toLocaleDateString(), color: "text-gray-400" }
}

export default function AthletesRosterPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterSchool, setFilterSchool] = useState("")
  const [filterPosition, setFilterPosition] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [sortBy, setSortBy] = useState<"latest" | "name" | "school" | "class">("latest")

  useEffect(() => {
    fetch("/api/admin/athletes")
      .then(r => r.json())
      .then(d => { if (d.success) setAthletes(d.athletes) })
      .finally(() => setLoading(false))
  }, [])

  // Unique values for filter dropdowns
  const schools = [...new Set(athletes.map(a => a.school).filter(Boolean))].sort() as string[]
  const positions = [...new Set(athletes.map(a => a.position).filter(Boolean))].sort() as string[]
  const classes = [...new Set(athletes.map(a => a.gradYear).filter(Boolean))].sort() as string[]

  const filtered = athletes
    .filter(a => {
      if (search && !a.athleteName.toLowerCase().includes(search.toLowerCase()) &&
          !a.code.toLowerCase().includes(search.toLowerCase())) return false
      if (filterSchool && a.school !== filterSchool) return false
      if (filterPosition && a.position !== filterPosition) return false
      if (filterClass && a.gradYear !== filterClass) return false
      if (filterStatus === "active") {
        const days = a.expiresAt ? Math.ceil((new Date(a.expiresAt).getTime() - Date.now()) / 86400000) : 999
        if (days <= 0) return false
      }
      if (filterStatus === "expired") {
        const days = a.expiresAt ? Math.ceil((new Date(a.expiresAt).getTime() - Date.now()) / 86400000) : 999
        if (days > 0) return false
      }
      if (filterStatus === "expiring") {
        const days = a.expiresAt ? Math.ceil((new Date(a.expiresAt).getTime() - Date.now()) / 86400000) : 999
        if (days <= 0 || days > 30) return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "latest") return new Date(b.issuedAt ?? 0).getTime() - new Date(a.issuedAt ?? 0).getTime()
      if (sortBy === "name") return a.athleteName.localeCompare(b.athleteName)
      if (sortBy === "school") return (a.school ?? "").localeCompare(b.school ?? "")
      if (sortBy === "class") return (a.gradYear ?? "").localeCompare(b.gradYear ?? "")
      return 0
    })

  const clearFilters = () => {
    setSearch(""); setFilterSchool(""); setFilterPosition("")
    setFilterClass(""); setFilterStatus(""); setSortBy("latest")
  }
  const hasFilters = search || filterSchool || filterPosition || filterClass || filterStatus || sortBy !== "latest"

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 border-b border-gray-800 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={40} height={40} className="object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-white">PR-VERIFIED Athlete Roster</h1>
              <p className="text-gray-400 text-sm">{filtered.length} of {athletes.length} athlete{athletes.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/seal-generator" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
              + New Seal
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filter & Sort</p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 underline">Clear all</button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or code..."
              className="col-span-2 md:col-span-3 lg:col-span-2 bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />

            <select value={filterSchool} onChange={e => setFilterSchool(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm">
              <option value="">All Schools</option>
              {schools.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select value={filterPosition} onChange={e => setFilterPosition(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm">
              <option value="">All Positions</option>
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm">
              <option value="">All Classes</option>
              {classes.map(c => <option key={c} value={c}>Class of {c}</option>)}
            </select>

            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Sort buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Sort:</span>
            {(["latest", "name", "school", "class"] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`text-xs px-3 py-1 rounded-full capitalize transition-colors ${sortBy === s ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                {s === "latest" ? "Latest First" : s === "name" ? "Name A–Z" : s === "school" ? "School" : "Class Year"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-600">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600 gap-3">
            <p className="text-lg">{athletes.length === 0 ? "No athletes registered yet." : "No athletes match your filters."}</p>
            {athletes.length === 0
              ? <Link href="/admin/seal-generator" className="text-red-400 underline text-sm">Generate your first seal</Link>
              : <button onClick={clearFilters} className="text-red-400 underline text-sm">Clear filters</button>
            }
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="text-left px-6 py-4">#</th>
                    <th className="text-left px-6 py-4">Athlete</th>
                    <th className="text-left px-6 py-4">Seal Code</th>
                    <th className="text-left px-6 py-4">Position</th>
                    <th className="text-left px-6 py-4">School</th>
                    <th className="text-left px-6 py-4">Class</th>
                    <th className="text-left px-6 py-4">Issued</th>
                    <th className="text-left px-6 py-4">Expires</th>
                    <th className="text-left px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => {
                    const seal = getSealStatus(a.expiresAt)
                    return (
                      <tr key={a.code} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 text-gray-500">{filtered.length - i}</td>
                        <td className="px-6 py-4 font-semibold text-white">{a.athleteName}</td>
                        <td className="px-6 py-4 font-mono text-red-400 font-bold">{a.code}</td>
                        <td className="px-6 py-4 text-gray-300">{a.position || "—"}</td>
                        <td className="px-6 py-4 text-gray-300">{a.school || "—"}</td>
                        <td className="px-6 py-4 text-gray-300">{a.gradYear || "—"}</td>
                        <td className="px-6 py-4 text-gray-500">{a.issuedAt ? new Date(a.issuedAt).toLocaleDateString() : "—"}</td>
                        <td className={`px-6 py-4 text-xs ${seal.color}`}>{seal.label}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/athletes/edit?code=${a.code}`}
                              className="text-xs bg-red-700 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors text-white">Edit</Link>
                            <Link href={`/verify/${a.code}`} target="_blank"
                              className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors">View</Link>
                            <SendContactButtons athlete={a} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((a, i) => {
                const seal = getSealStatus(a.expiresAt)
                return (
                  <div key={a.code} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-white">{a.athleteName}</p>
                        <p className="font-mono text-red-400 text-sm font-bold">{a.code}</p>
                      </div>
                      <span className="text-gray-600 text-xs">#{filtered.length - i}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                      <p>Position: <span className="text-gray-300">{a.position || "—"}</span></p>
                      <p>Class: <span className="text-gray-300">{a.gradYear || "—"}</span></p>
                      <p className="col-span-2">School: <span className="text-gray-300">{a.school || "—"}</span></p>
                      <p>Issued: <span className="text-gray-300">{a.issuedAt ? new Date(a.issuedAt).toLocaleDateString() : "—"}</span></p>
                      <p>Expires: <span className={seal.color}>{seal.label}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/athletes/edit?code=${a.code}`}
                        className="flex-1 text-center text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors">Edit</Link>
                      <Link href={`/verify/${a.code}`} target="_blank"
                        className="flex-1 text-center text-xs bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors">View Profile →</Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
