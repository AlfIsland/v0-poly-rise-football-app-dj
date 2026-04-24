"use client"

import { useState } from "react"
import {
  filterSchools, getPositionGroup, getMatchQuality, MATCH_META,
  type Division, type Sport, type MatchQuality,
} from "@/lib/school-data"

const DIVISION_COLORS: Record<Division, string> = {
  D1:   "bg-yellow-900/60 text-yellow-300 border-yellow-700/50",
  D2:   "bg-red-900/60 text-red-300 border-red-700/50",
  D3:   "bg-blue-900/60 text-blue-300 border-blue-700/50",
  NAIA: "bg-green-900/60 text-green-300 border-green-700/50",
  JuCo: "bg-purple-900/60 text-purple-300 border-purple-700/50",
}

const DIVISION_DESC: Record<Division, string> = {
  D1:   "Highest level — full scholarships, top competition",
  D2:   "Partial scholarships — strong academics + athletics",
  D3:   "No athletic scholarships — academic aid available",
  NAIA: "Scholarship opportunities — smaller programs",
  JuCo: "2-year path — develop & transfer to D1/D2",
}

const FOOTBALL_POSITIONS = [
  "QB","RB","FB","WR","TE","OL","OT","OG","C",
  "DE","DT","NT","LB","CB","S","DB","K","P",
]

interface Props {
  sport?: string
  position?: string
  fortyYard?: number
}

export default function SchoolFitFinder({ sport: athleteSport, position: athletePosition, fortyYard }: Props) {
  const [sport, setSport] = useState<Sport>((athleteSport as Sport) ?? "football")
  const [division, setDivision] = useState<Division | "Any">("Any")
  const [region, setRegion] = useState<"Texas" | "South" | "Nationwide">("Texas")
  const [position, setPosition] = useState(athletePosition ?? "")
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState<ReturnType<typeof buildResults>>([])

  const posGroup = getPositionGroup(position || athletePosition)
  const hasMetrics = !!fortyYard

  function buildResults() {
    const schools = filterSchools({ sport, division, region })
    return schools.map(school => {
      const match: MatchQuality | null = hasMetrics && sport === "football"
        ? getMatchQuality(fortyYard!, posGroup, school.division)
        : null
      return { ...school, match }
    }).sort((a, b) => {
      // Sort: metrics-matched first by quality, then unmatched alphabetically
      const ao = a.match ? MATCH_META[a.match].order : 99
      const bo = b.match ? MATCH_META[b.match].order : 99
      if (ao !== bo) return ao - bo
      return a.name.localeCompare(b.name)
    })
  }

  function handleSearch() {
    setResults(buildResults())
    setSearched(true)
  }

  const matchGroups = searched && hasMetrics ? {
    elite:    results.filter(r => r.match === "elite"),
    strong:   results.filter(r => r.match === "strong"),
    possible: results.filter(r => r.match === "possible"),
    reach:    results.filter(r => r.match === "reach"),
    unrated:  results.filter(r => !r.match),
  } : null

  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950/60 to-gray-900 px-6 py-4 border-b border-white/10">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-0.5">PolyRISE Recruiting</p>
        <h2 className="text-white font-black text-lg">School Fit Finder</h2>
        <p className="text-gray-400 text-xs mt-0.5">
          {hasMetrics
            ? "Matching schools based on your athlete's verified metrics"
            : "Find college programs that match your athlete's goals"}
        </p>
      </div>

      {/* Metrics banner */}
      {hasMetrics && (
        <div className="px-6 py-3 bg-green-950/30 border-b border-green-800/30 flex items-center gap-2">
          <span className="text-green-400 text-xs font-bold">✓ Using verified metrics</span>
          <span className="text-gray-500 text-xs">· 40-Yard: {fortyYard}s{position ? ` · Position: ${position}` : ""}</span>
        </div>
      )}

      {/* Filters */}
      <div className="px-6 py-5 border-b border-white/5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Sport</label>
            <select value={sport} onChange={e => setSport(e.target.value as Sport)}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500">
              <option value="football">Football</option>
              <option value="soccer">Soccer</option>
              <option value="basketball">Basketball</option>
              <option value="baseball">Baseball</option>
              <option value="softball">Softball</option>
              <option value="track">Track & Field</option>
            </select>
          </div>

          {sport === "football" && (
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Position</label>
              <select value={position} onChange={e => setPosition(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500">
                <option value="">Any Position</option>
                {FOOTBALL_POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Division</label>
            <select value={division} onChange={e => setDivision(e.target.value as Division | "Any")}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500">
              <option value="Any">All Divisions</option>
              <option value="D1">D1</option>
              <option value="D2">D2</option>
              <option value="D3">D3</option>
              <option value="NAIA">NAIA</option>
              <option value="JuCo">JuCo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Region</label>
            <select value={region} onChange={e => setRegion(e.target.value as "Texas" | "South" | "Nationwide")}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500">
              <option value="Texas">Texas Only</option>
              <option value="South">South / Southeast</option>
              <option value="Nationwide">Nationwide</option>
            </select>
          </div>
        </div>

        <button onClick={handleSearch}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl transition-colors">
          {hasMetrics ? "Find My Best Fit Schools" : "Find Matching Schools"}
        </button>
      </div>

      {/* Division guide — before search */}
      {!searched && (
        <div className="px-6 py-5">
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-3">Division Guide</p>
          <div className="space-y-2">
            {(Object.entries(DIVISION_DESC) as [Division, string][]).map(([div, desc]) => (
              <div key={div} className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-bold w-12 text-center shrink-0 ${DIVISION_COLORS[div]}`}>{div}</span>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
          {hasMetrics && (
            <div className="mt-4 bg-blue-950/30 border border-blue-800/30 rounded-xl px-4 py-3">
              <p className="text-blue-300 text-xs font-bold mb-1">Metrics matching is ON</p>
              <p className="text-gray-500 text-xs">Results will show how well your athlete&apos;s 40-yard time matches each division&apos;s typical {position || "athlete"} standard.</p>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {searched && (
        <div className="px-6 py-5">
          {results.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No matching schools. Try broadening your filters.</p>
          ) : matchGroups ? (
            // Metrics-based grouped results
            <div className="space-y-5">
              <p className="text-xs text-gray-500">
                <span className="text-white font-bold">{results.filter(r => r.match).length}</span> schools matched to your athlete&apos;s metrics
                {results.filter(r => !r.match).length > 0 && <span className="text-gray-600"> · {results.filter(r => !r.match).length} additional schools shown</span>}
              </p>

              {(["elite","strong","possible","reach"] as MatchQuality[]).map(q => {
                const group = matchGroups[q]
                if (!group.length) return null
                const meta = MATCH_META[q]
                return (
                  <div key={q}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${meta.color}`}>{meta.label}</span>
                      <span className="text-xs text-gray-600">{group.length} school{group.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.map(school => (
                        <a key={school.name} href={school.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-start gap-3 bg-gray-800/60 hover:bg-gray-800 border border-white/5 hover:border-white/20 rounded-xl px-4 py-3 transition-all group">
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold leading-tight group-hover:text-blue-300 transition-colors truncate">{school.name}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{school.city}, {school.state}{school.conference ? ` · ${school.conference}` : ""}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-bold shrink-0 mt-0.5 ${DIVISION_COLORS[school.division]}`}>{school.division}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )
              })}

              {matchGroups.unrated.length > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mb-2">All other programs in your region</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchGroups.unrated.map(school => (
                      <a key={school.name} href={school.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-start gap-3 bg-gray-800/30 border border-white/5 hover:border-white/10 rounded-xl px-4 py-3 transition-all group opacity-60 hover:opacity-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold leading-tight truncate">{school.name}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{school.city}, {school.state}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-bold shrink-0 mt-0.5 ${DIVISION_COLORS[school.division]}`}>{school.division}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3">
                <p className="text-xs text-red-300 font-bold mb-1">Ready to reach out?</p>
                <p className="text-xs text-gray-400">
                  Use the Coach Outreach Templates below to email coaches at these schools.
                  Start with your <span className="text-green-400 font-semibold">Elite Fit</span> and <span className="text-blue-400 font-semibold">Strong Fit</span> schools first.
                </p>
              </div>
            </div>
          ) : (
            // Standard results (no metrics)
            <>
              <p className="text-xs text-gray-500 mb-4">
                <span className="text-white font-bold">{results.length}</span> programs found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.map(school => (
                  <a key={school.name} href={school.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-3 bg-gray-800/60 hover:bg-gray-800 border border-white/5 hover:border-white/20 rounded-xl px-4 py-3 transition-all group">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold leading-tight group-hover:text-blue-300 transition-colors truncate">{school.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{school.city}, {school.state}{school.conference ? ` · ${school.conference}` : ""}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold shrink-0 mt-0.5 ${DIVISION_COLORS[school.division]}`}>{school.division}</span>
                  </a>
                ))}
              </div>
              <div className="mt-4 bg-blue-950/30 border border-blue-800/30 rounded-xl px-4 py-3">
                <p className="text-blue-300 text-xs font-bold mb-1">Want smarter matching?</p>
                <p className="text-xs text-gray-400">Ask your coach to record your 40-yard dash at the next combine camp — we&apos;ll match schools to your actual speed.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
