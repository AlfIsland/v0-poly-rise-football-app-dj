"use client"

import { useState } from "react"
import {
  filterSchools, getPositionGroup, getDetailedMatch, getScholarshipNote, MATCH_META,
  type Division, type Sport, type MatchQuality, type MatchBreakdown,
} from "@/lib/school-data"

const DIVISION_COLORS: Record<Division, string> = {
  D1:   "bg-yellow-900/60 text-yellow-300 border-yellow-700/50",
  D2:   "bg-red-900/60 text-red-300 border-red-700/50",
  D3:   "bg-blue-900/60 text-blue-300 border-blue-700/50",
  NAIA: "bg-green-900/60 text-green-300 border-green-700/50",
  JuCo: "bg-purple-900/60 text-purple-300 border-purple-700/50",
}

const FOOTBALL_POSITIONS = [
  "QB","RB","FB","WR","TE","OL","OT","OG","C",
  "DE","DT","NT","LB","CB","S","DB","K","P",
]

interface Props {
  sport?: string
  position?: string
  fortyYard?: number
  weight?: number
  verticalJump?: number
}

type SchoolResult = ReturnType<typeof filterSchools>[number] & {
  quality: MatchQuality | null
  breakdown: MatchBreakdown
}

export default function SchoolFitFinder({
  sport: athleteSport,
  position: athletePosition,
  fortyYard,
  weight,
  verticalJump,
}: Props) {
  const [sport, setSport] = useState<Sport>((athleteSport as Sport) ?? "football")
  const [division, setDivision] = useState<Division | "Any">("Any")
  const [region, setRegion] = useState<"Texas" | "South" | "Nationwide">("Texas")
  const [position, setPosition] = useState(athletePosition ?? "")
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState<SchoolResult[]>([])
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null)

  const posGroup = getPositionGroup(position || athletePosition)
  const metrics = { fortyYard, weight, verticalJump }
  const metricsCount = [fortyYard, weight, verticalJump].filter(v => v != null).length
  const hasMetrics = metricsCount > 0

  function buildResults(): SchoolResult[] {
    const schools = filterSchools({ sport, division, region })
    return schools.map(school => {
      const { quality, breakdown } = hasMetrics && sport === "football"
        ? getDetailedMatch(metrics, posGroup, school.division)
        : { quality: null, breakdown: { score: 0, metricsUsed: 0 } }
      return { ...school, quality, breakdown }
    }).sort((a, b) => {
      const ao = a.quality ? MATCH_META[a.quality].order : 99
      const bo = b.quality ? MATCH_META[b.quality].order : 99
      if (ao !== bo) return ao - bo
      if (a.breakdown.score !== b.breakdown.score) return b.breakdown.score - a.breakdown.score
      return a.name.localeCompare(b.name)
    })
  }

  function handleSearch() {
    setResults(buildResults())
    setSearched(true)
    setExpandedSchool(null)
  }

  const matchGroups = searched && hasMetrics ? {
    elite:    results.filter(r => r.quality === "elite"),
    strong:   results.filter(r => r.quality === "strong"),
    possible: results.filter(r => r.quality === "possible"),
    reach:    results.filter(r => r.quality === "reach"),
    unrated:  results.filter(r => !r.quality),
  } : null

  const totalMatched = results.filter(r => r.quality).length

  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950/60 to-gray-900 px-6 py-4 border-b border-white/10">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-0.5">PolyRISE Recruiting</p>
        <h2 className="text-white font-black text-lg">School Fit Finder</h2>
        <p className="text-gray-400 text-xs mt-0.5">
          {hasMetrics
            ? `Matching schools using ${metricsCount} verified metric${metricsCount !== 1 ? "s" : ""}`
            : "Find college programs that match your athlete's goals"}
        </p>
      </div>

      {/* Metrics banner */}
      {hasMetrics && (
        <div className="px-6 py-3 bg-green-950/30 border-b border-green-800/30">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-green-400 text-xs font-bold">✓ Using verified metrics</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {fortyYard != null && (
              <span className="text-xs bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-gray-300">
                <span className="text-gray-500">40-Yard</span> <span className="font-bold text-white">{fortyYard}s</span>
              </span>
            )}
            {weight != null && (
              <span className="text-xs bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-gray-300">
                <span className="text-gray-500">Weight</span> <span className="font-bold text-white">{weight} lbs</span>
              </span>
            )}
            {verticalJump != null && (
              <span className="text-xs bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-gray-300">
                <span className="text-gray-500">Vertical</span> <span className="font-bold text-white">{verticalJump}"</span>
              </span>
            )}
            {position && (
              <span className="text-xs bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-gray-300">
                <span className="text-gray-500">Position</span> <span className="font-bold text-white">{position}</span>
                <span className="text-gray-600 ml-1">({posGroup})</span>
              </span>
            )}
          </div>
          {metricsCount < 3 && (
            <p className="text-gray-600 text-xs mt-2">
              💡 More test data = more accurate matches. Missing: {[
                fortyYard == null && "40-yard dash",
                weight == null && "weight",
                verticalJump == null && "vertical jump",
              ].filter(Boolean).join(", ")} — get tested at a PolyRISE combine camp.
            </p>
          )}
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
        <div className="px-6 py-5 space-y-4">
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-3">Division Guide & Scholarships</p>
            <div className="space-y-2">
              {(["D1","D2","D3","NAIA","JuCo"] as Division[]).map(div => {
                const scholarship = getScholarshipNote(div)
                return (
                  <div key={div} className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold w-12 text-center shrink-0 ${DIVISION_COLORS[div]}`}>{div}</span>
                    <p className={`text-xs font-semibold ${scholarship.color}`}>{scholarship.note}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {hasMetrics && (
            <div className="bg-blue-950/30 border border-blue-800/30 rounded-xl px-4 py-3">
              <p className="text-blue-300 text-xs font-bold mb-1">Smart matching is ON</p>
              <p className="text-gray-500 text-xs">
                Results will show a match score (0–100) based on your athlete&apos;s {[
                  fortyYard != null && "40-yard dash",
                  weight != null && "weight",
                  verticalJump != null && "vertical jump",
                ].filter(Boolean).join(", ")} vs. each division&apos;s benchmarks for {position || "their position group"}.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {searched && (
        <div className="px-6 py-5 space-y-5">

          {results.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No matching schools. Try broadening your filters.</p>
          ) : matchGroups ? (
            <>
              {/* Summary bar */}
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-xs text-gray-500">
                  <span className="text-white font-bold">{totalMatched}</span> schools matched to athlete metrics
                  {matchGroups.unrated.length > 0 && <span className="text-gray-600"> · {matchGroups.unrated.length} additional</span>}
                </p>
                {metricsCount > 0 && (
                  <span className="text-xs bg-gray-800 border border-gray-700 rounded-full px-2 py-0.5 text-gray-400">
                    {metricsCount} metric{metricsCount !== 1 ? "s" : ""} used
                  </span>
                )}
              </div>

              {/* Match groups */}
              {(["elite","strong","possible","reach"] as MatchQuality[]).map(q => {
                const group = matchGroups[q]
                if (!group.length) return null
                const meta = MATCH_META[q]
                return (
                  <div key={q}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${meta.color}`}>{meta.label}</span>
                      <span className="text-xs text-gray-600">{group.length} school{group.length !== 1 ? "s" : ""}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{meta.desc}</p>
                    <div className="space-y-2">
                      {group.map(school => (
                        <SchoolCard
                          key={school.name}
                          school={school}
                          expanded={expandedSchool === school.name}
                          onToggle={() => setExpandedSchool(expandedSchool === school.name ? null : school.name)}
                          showScore
                        />
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Unrated schools */}
              {matchGroups.unrated.length > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mb-2">Other programs in your region</p>
                  <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                    {matchGroups.unrated.map(school => (
                      <SchoolCard
                        key={school.name}
                        school={school}
                        expanded={false}
                        onToggle={() => {}}
                        showScore={false}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3">
                <p className="text-xs text-red-300 font-bold mb-1">Ready to reach out?</p>
                <p className="text-xs text-gray-400">
                  Use the Coach Outreach Templates below to email coaches at your{" "}
                  <span className="text-green-400 font-semibold">Elite Fit</span> and{" "}
                  <span className="text-blue-400 font-semibold">Strong Fit</span> schools first.
                  Attach your athlete&apos;s PolyRISE recruiting profile link.
                </p>
              </div>
            </>
          ) : (
            // No metrics — standard list
            <>
              <p className="text-xs text-gray-500">
                <span className="text-white font-bold">{results.length}</span> programs found
              </p>
              <div className="space-y-2">
                {results.map(school => (
                  <SchoolCard
                    key={school.name}
                    school={school}
                    expanded={false}
                    onToggle={() => {}}
                    showScore={false}
                  />
                ))}
              </div>
              <div className="bg-blue-950/30 border border-blue-800/30 rounded-xl px-4 py-3">
                <p className="text-blue-300 text-xs font-bold mb-1">Want smarter matching?</p>
                <p className="text-xs text-gray-400">
                  Get tested at a PolyRISE combine camp — your 40-yard dash, weight, and vertical will unlock a
                  real match score against each school&apos;s benchmarks.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── School Card Component ────────────────────────────────────────────────────
function SchoolCard({
  school,
  expanded,
  onToggle,
  showScore,
}: {
  school: SchoolResult
  expanded: boolean
  onToggle: () => void
  showScore: boolean
}) {
  const scholarship = getScholarshipNote(school.division)
  const bd = school.breakdown
  const hasBreakdown = showScore && bd.metricsUsed > 0

  return (
    <div className={`bg-gray-800/60 border rounded-xl overflow-hidden transition-all ${
      expanded ? "border-white/20" : "border-white/5 hover:border-white/15"
    }`}>
      {/* Main row */}
      <div
        className={`flex items-start gap-3 px-4 py-3 ${hasBreakdown ? "cursor-pointer" : ""}`}
        onClick={hasBreakdown ? onToggle : undefined}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <a
              href={school.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm font-semibold leading-tight hover:text-blue-300 transition-colors truncate"
              onClick={e => e.stopPropagation()}
            >
              {school.name}
            </a>
          </div>
          <p className="text-gray-500 text-xs mt-0.5">
            {school.city}, {school.state}
            {school.conference ? ` · ${school.conference}` : ""}
          </p>
          <p className={`text-xs mt-0.5 ${scholarship.color}`}>{scholarship.note}</p>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${DIVISION_COLORS[school.division]}`}>
            {school.division}
          </span>
          {showScore && bd.metricsUsed > 0 && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-lg font-black text-white leading-none">{bd.score}</span>
              <span className="text-gray-600 text-xs leading-none">/ 100</span>
            </div>
          )}
          {hasBreakdown && (
            <MetricDots breakdown={bd} />
          )}
          {hasBreakdown && (
            <span className="text-gray-600 text-xs">{expanded ? "▲" : "▼"}</span>
          )}
        </div>
      </div>

      {/* Expanded breakdown */}
      {expanded && hasBreakdown && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-2">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Match Breakdown</p>

          {bd.speed && (
            <BreakdownRow
              label="Speed (40-yd)"
              value={`${bd.speed.value}s`}
              benchmark={`${bd.speed.benchmark}s benchmark`}
              description={bd.speed.label}
              pass={bd.speed.pass}
            />
          )}
          {bd.size && (
            <BreakdownRow
              label="Size (weight)"
              value={`${bd.size.value} lbs`}
              benchmark={`${bd.size.min}–${bd.size.max} lbs typical`}
              description={bd.size.label}
              pass={bd.size.pass}
            />
          )}
          {bd.vertical && (
            <BreakdownRow
              label="Athleticism (vert)"
              value={`${bd.vertical.value}"`}
              benchmark={`${bd.vertical.benchmark}" benchmark`}
              description={bd.vertical.label}
              pass={bd.vertical.pass}
            />
          )}

          <div className="pt-1">
            <a
              href={school.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              View {school.name} Athletics →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Metric indicator dots ────────────────────────────────────────────────────
function MetricDots({ breakdown }: { breakdown: MatchBreakdown }) {
  return (
    <div className="flex items-center gap-1">
      {breakdown.speed && (
        <span title={`Speed: ${breakdown.speed.label}`}
          className={`w-2 h-2 rounded-full ${breakdown.speed.pass ? "bg-green-400" : "bg-orange-500"}`} />
      )}
      {breakdown.size && (
        <span title={`Size: ${breakdown.size.label}`}
          className={`w-2 h-2 rounded-full ${breakdown.size.pass ? "bg-green-400" : "bg-orange-500"}`} />
      )}
      {breakdown.vertical && (
        <span title={`Vertical: ${breakdown.vertical.label}`}
          className={`w-2 h-2 rounded-full ${breakdown.vertical.pass ? "bg-green-400" : "bg-orange-500"}`} />
      )}
    </div>
  )
}

// ─── Breakdown row ────────────────────────────────────────────────────────────
function BreakdownRow({
  label, value, benchmark, description, pass,
}: {
  label: string; value: string; benchmark: string; description: string; pass: boolean
}) {
  return (
    <div className="flex items-start gap-2">
      <span className={`mt-0.5 text-xs shrink-0 font-bold ${pass ? "text-green-400" : "text-orange-400"}`}>
        {pass ? "✓" : "~"}
      </span>
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs text-gray-400 font-semibold">{label}</span>
          <span className="text-xs text-white font-bold">{value}</span>
        </div>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
        <p className="text-xs text-gray-700">{benchmark}</p>
      </div>
    </div>
  )
}
