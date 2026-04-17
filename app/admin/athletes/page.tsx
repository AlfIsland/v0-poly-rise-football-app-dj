"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"

interface PRVAthlete {
  code: string
  athleteName: string
  position?: string
  school?: string
  gradYear?: string
  issuedAt?: string
  expiresAt?: string
}

interface ATPAthlete {
  id: string
  name: string
  position?: string
  school?: string
  grade?: string
  sport?: string
  joinedAt?: string
}

interface UnifiedAthlete {
  key: string
  name: string
  position?: string
  school?: string
  gradYear?: string
  type: "prv" | "atp" | "both"
  prvCode?: string
  atpId?: string
  issuedAt?: string
  sport?: string
}

function normName(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "")
}

export default function AthletesRosterPage() {
  const [athletes, setAthletes] = useState<UnifiedAthlete[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterSchool, setFilterSchool] = useState("")
  const [sortBy, setSortBy] = useState<"latest" | "name" | "school">("latest")

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/athletes").then(r => r.json()),
      fetch("/api/training").then(r => r.json()),
    ]).then(([prvData, atpData]) => {
      const prv: PRVAthlete[] = prvData.success ? (prvData.athletes ?? []) : []
      const atp: ATPAthlete[] = atpData.success ? (atpData.athletes ?? []) : []

      const unified: UnifiedAthlete[] = []
      const matchedATPIds = new Set<string>()

      // Start with PR-V athletes, try to match ATP by name
      for (const p of prv) {
        const match = atp.find(a => normName(a.name) === normName(p.athleteName))
        if (match) {
          matchedATPIds.add(match.id)
          unified.push({
            key: p.code,
            name: p.athleteName,
            position: p.position,
            school: p.school,
            gradYear: p.gradYear,
            type: "both",
            prvCode: p.code,
            atpId: match.id,
            issuedAt: p.issuedAt,
            sport: match.sport,
          })
        } else {
          unified.push({
            key: p.code,
            name: p.athleteName,
            position: p.position,
            school: p.school,
            gradYear: p.gradYear,
            type: "prv",
            prvCode: p.code,
            issuedAt: p.issuedAt,
          })
        }
      }

      // Add ATP-only athletes (not matched above)
      for (const a of atp) {
        if (!matchedATPIds.has(a.id)) {
          unified.push({
            key: a.id,
            name: a.name,
            position: a.position,
            school: a.school,
            gradYear: a.grade,
            type: "atp",
            atpId: a.id,
            issuedAt: a.joinedAt,
            sport: a.sport,
          })
        }
      }

      setAthletes(unified)
    }).finally(() => setLoading(false))
  }, [])

  const schools = [...new Set(athletes.map(a => a.school).filter(Boolean))].sort() as string[]

  const filtered = athletes
    .filter(a => {
      if (filterType !== "all" && a.type !== filterType) return false
      if (filterSchool && a.school !== filterSchool) return false
      if (search) {
        const q = search.toLowerCase()
        return a.name.toLowerCase().includes(q)
          || (a.prvCode ?? "").toLowerCase().includes(q)
          || (a.atpId ?? "").toLowerCase().includes(q)
          || (a.school ?? "").toLowerCase().includes(q)
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "latest") return new Date(b.issuedAt ?? 0).getTime() - new Date(a.issuedAt ?? 0).getTime()
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "school") return (a.school ?? "").localeCompare(b.school ?? "")
      return 0
    })

  const stats = {
    total: athletes.length,
    prv: athletes.filter(a => a.type === "prv" || a.type === "both").length,
    atp: athletes.filter(a => a.type === "atp" || a.type === "both").length,
    both: athletes.filter(a => a.type === "both").length,
  }

  const TypeBadge = ({ type }: { type: UnifiedAthlete["type"] }) => {
    if (type === "both") return (
      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-yellow-900 text-yellow-300">⚡ Both</span>
    )
    if (type === "prv") return (
      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-900 text-red-300">🔴 PR-V</span>
    )
    return (
      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-900 text-blue-300">🔵 ATP</span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 border-b border-gray-800 pb-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/poly-rise-logo.png" alt="PolyRISE" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-white">Athlete Roster</h1>
              <p className="text-gray-500 text-sm">{filtered.length} of {athletes.length} athletes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/athletes/new"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
              + Add Athlete
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Athletes", value: stats.total, color: "text-white" },
            { label: "PR-VERIFIED", value: stats.prv, color: "text-red-400" },
            { label: "ATP Passport", value: stats.atp, color: "text-blue-400" },
            { label: "In Both Systems", value: stats.both, color: "text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 mb-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, seal code, ATP ID, school..."
              className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm placeholder-gray-500" />
            <select value={filterSchool} onChange={e => setFilterSchool(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm">
              <option value="">All Schools</option>
              {schools.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-gray-500">Type:</span>
            {[
              { key: "all", label: "All" },
              { key: "prv", label: "🔴 PR-V" },
              { key: "atp", label: "🔵 ATP" },
              { key: "both", label: "⚡ Both" },
            ].map(f => (
              <button key={f.key} onClick={() => setFilterType(f.key)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${filterType === f.key ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                {f.label}
              </button>
            ))}
            <span className="text-xs text-gray-500 ml-2">Sort:</span>
            {(["latest", "name", "school"] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${sortBy === s ? "bg-gray-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                {s === "latest" ? "Latest" : s === "name" ? "Name A–Z" : "School"}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-20 space-y-3">
            <p>{athletes.length === 0 ? "No athletes yet." : "No athletes match your filters."}</p>
            <Link href="/admin/athletes/new" className="text-red-400 underline text-sm block">Add your first athlete →</Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Athlete</th>
                    <th className="text-left px-5 py-3">Type</th>
                    <th className="text-left px-5 py-3">IDs</th>
                    <th className="text-left px-5 py-3">Position</th>
                    <th className="text-left px-5 py-3">School</th>
                    <th className="text-left px-5 py-3">Class</th>
                    <th className="text-left px-5 py-3">Added</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.key} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3 font-semibold text-white">
                        {a.name}
                        {a.sport === "soccer" && <span className="ml-2 text-xs text-green-400">⚽</span>}
                      </td>
                      <td className="px-5 py-3"><TypeBadge type={a.type} /></td>
                      <td className="px-5 py-3 space-y-0.5">
                        {a.prvCode && <p className="font-mono text-red-400 text-xs font-bold">{a.prvCode}</p>}
                        {a.atpId && <p className="font-mono text-blue-400 text-xs font-bold">{a.atpId}</p>}
                      </td>
                      <td className="px-5 py-3 text-gray-300">{a.position || "—"}</td>
                      <td className="px-5 py-3 text-gray-300">{a.school || "—"}</td>
                      <td className="px-5 py-3 text-gray-400">{a.gradYear || "—"}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{a.issuedAt ? new Date(a.issuedAt).toLocaleDateString() : "—"}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {a.prvCode && (
                            <>
                              <Link href={`/admin/athletes/edit?code=${a.prvCode}`}
                                className="text-xs bg-red-800 hover:bg-red-700 px-2.5 py-1 rounded-lg text-white">Edit PR-V</Link>
                              <Link href={`/verify/${a.prvCode}`} target="_blank"
                                className="text-xs bg-gray-700 hover:bg-gray-600 px-2.5 py-1 rounded-lg text-white">View Seal</Link>
                            </>
                          )}
                          {a.atpId && (
                            <Link href={`/training/${a.atpId}`}
                              className="text-xs bg-blue-800 hover:bg-blue-700 px-2.5 py-1 rounded-lg text-white">ATP Profile</Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map(a => (
                <div key={a.key} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-white">{a.name} {a.sport === "soccer" && <span className="text-green-400 text-sm">⚽</span>}</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <TypeBadge type={a.type} />
                        {a.prvCode && <span className="font-mono text-red-400 text-xs font-bold">{a.prvCode}</span>}
                        {a.atpId && <span className="font-mono text-blue-400 text-xs font-bold">{a.atpId}</span>}
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">{a.issuedAt ? new Date(a.issuedAt).toLocaleDateString() : ""}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 mb-3">
                    <p>Position: <span className="text-gray-300">{a.position || "—"}</span></p>
                    <p>Class: <span className="text-gray-300">{a.gradYear || "—"}</span></p>
                    <p className="col-span-2">School: <span className="text-gray-300">{a.school || "—"}</span></p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {a.prvCode && (
                      <>
                        <Link href={`/admin/athletes/edit?code=${a.prvCode}`}
                          className="text-xs bg-red-800 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg">Edit PR-V</Link>
                        <Link href={`/verify/${a.prvCode}`} target="_blank"
                          className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg">View Seal</Link>
                      </>
                    )}
                    {a.atpId && (
                      <Link href={`/training/${a.atpId}`}
                        className="text-xs bg-blue-800 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg">ATP Profile</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
