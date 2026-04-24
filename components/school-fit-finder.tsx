"use client"

import { useState } from "react"
import { filterSchools, type Division, type Sport } from "@/lib/school-data"

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

export default function SchoolFitFinder() {
  const [sport, setSport] = useState<Sport>("football")
  const [division, setDivision] = useState<Division | "Any">("Any")
  const [region, setRegion] = useState<"Texas" | "South" | "Nationwide">("Texas")
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState(filterSchools({ sport: "football", region: "Texas" }))

  function handleSearch() {
    const found = filterSchools({ sport, division, region })
    setResults(found)
    setSearched(true)
  }

  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950/60 to-gray-900 px-6 py-4 border-b border-white/10">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-0.5">PolyRISE Recruiting</p>
        <h2 className="text-white font-black text-lg">School Fit Finder</h2>
        <p className="text-gray-400 text-xs mt-0.5">Find college programs that match your athlete&apos;s goals and division level</p>
      </div>

      {/* Filters */}
      <div className="px-6 py-5 border-b border-white/5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Sport */}
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

          {/* Division */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Division</label>
            <select value={division} onChange={e => setDivision(e.target.value as Division | "Any")}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500">
              <option value="Any">All Divisions</option>
              <option value="D1">D1 — Top Level</option>
              <option value="D2">D2 — Partial Scholarships</option>
              <option value="D3">D3 — Academic Focus</option>
              <option value="NAIA">NAIA — Scholarships Available</option>
              <option value="JuCo">JuCo — 2-Year Path</option>
            </select>
          </div>

          {/* Region */}
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
          Find Matching Schools
        </button>
      </div>

      {/* Division guide */}
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
        </div>
      )}

      {/* Results */}
      {searched && (
        <div className="px-6 py-5">
          {results.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No matching schools found. Try broadening your filters.</p>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-4">
                <span className="text-white font-bold">{results.length}</span> programs found · Select a school to visit their athletics page
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.map(school => (
                  <a key={school.name} href={school.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-3 bg-gray-800/60 hover:bg-gray-800 border border-white/5 hover:border-white/20 rounded-xl px-4 py-3 transition-all group">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold leading-tight group-hover:text-blue-300 transition-colors truncate">
                        {school.name}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">{school.city}, {school.state}{school.conference ? ` · ${school.conference}` : ""}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold shrink-0 mt-0.5 ${DIVISION_COLORS[school.division]}`}>
                      {school.division}
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-5 bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3">
                <p className="text-xs text-red-300 font-bold mb-1">Ready to reach out?</p>
                <p className="text-xs text-gray-400">
                  Email Kevin Garrett at{" "}
                  <a href="mailto:kg@polyrisefootball.com" className="text-red-400 hover:text-red-300 font-semibold">
                    kg@polyrisefootball.com
                  </a>
                  {" "}for help crafting outreach emails to coaches at these schools.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
