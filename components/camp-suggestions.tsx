"use client"

import { useState, useEffect } from "react"
import { type Camp } from "@/app/api/camps/route"

const TYPE_LABELS = { polyrise: "PolyRISE", college: "College", elite: "Elite/Showcase", regional: "Regional" }
const TYPE_COLORS = {
  polyrise: "bg-red-900/60 text-red-300 border-red-700/50",
  college:  "bg-blue-900/60 text-blue-300 border-blue-700/50",
  elite:    "bg-yellow-900/60 text-yellow-300 border-yellow-700/50",
  regional: "bg-green-900/60 text-green-300 border-green-700/50",
}

interface Props {
  sport?: string
  grade?: string
}

export default function CampSuggestions({ sport, grade }: Props) {
  const [camps, setCamps] = useState<Camp[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Camp["type"] | "all">("all")

  useEffect(() => {
    fetch("/api/camps")
      .then(r => r.json())
      .then(data => { if (data.success) setCamps(data.camps) })
      .finally(() => setLoading(false))
  }, [])

  const gradeNum = parseInt((grade ?? "").replace(/\D/g, "")) || 0

  const relevant = camps.filter(c => {
    if (filter !== "all" && c.type !== filter) return false
    // Sport filter — show if camp includes athlete's sport or has no sport restriction
    if (sport && c.sports.length > 0 && !c.sports.includes(sport)) return false
    // Grade filter — show if camp has no grade restriction or includes athlete's grade
    if (gradeNum > 0 && c.grades.length > 0 && !c.grades.includes(String(gradeNum))) return false
    return true
  })

  const counts = {
    all: camps.length,
    polyrise: camps.filter(c => c.type === "polyrise").length,
    college: camps.filter(c => c.type === "college").length,
    elite: camps.filter(c => c.type === "elite").length,
    regional: camps.filter(c => c.type === "regional").length,
  }

  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-950/60 to-gray-900 px-6 py-4 border-b border-white/10">
        <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-0.5">PolyRISE Recruiting</p>
        <h2 className="text-white font-black text-lg">Recommended Camps</h2>
        <p className="text-gray-400 text-xs mt-0.5">Camps your athlete should attend to get noticed by college coaches</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-6 pt-4 flex-wrap">
        {([
          { key: "all",      label: `All (${counts.all})` },
          { key: "polyrise", label: `PolyRISE (${counts.polyrise})` },
          { key: "elite",    label: `Elite (${counts.elite})` },
          { key: "college",  label: `College (${counts.college})` },
          { key: "regional", label: `Regional (${counts.regional})` },
        ] as { key: Camp["type"] | "all"; label: string }[]).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-colors ${filter === f.key ? "bg-yellow-900/60 text-yellow-300 border-yellow-700/50" : "border-gray-700 text-gray-500 hover:text-white"}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="p-6 pt-4">
        {loading && <p className="text-gray-500 text-sm text-center py-8">Loading camps...</p>}

        {!loading && relevant.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No camps available right now.</p>
            <p className="text-gray-600 text-xs mt-1">Check back soon — new camps are added regularly.</p>
          </div>
        )}

        {!loading && relevant.length > 0 && (
          <div className="space-y-3">
            {relevant.map(camp => (
              <div key={camp.id} className={`border rounded-2xl p-4 ${camp.type === "polyrise" ? "border-red-800/40 bg-red-950/20" : "border-white/5 bg-gray-800/40"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${TYPE_COLORS[camp.type]}`}>
                        {TYPE_LABELS[camp.type]}
                      </span>
                      {camp.featured && (
                        <span className="text-xs bg-yellow-500 text-black font-black px-2 py-0.5 rounded-full">RECOMMENDED</span>
                      )}
                    </div>
                    <p className="text-white font-bold text-sm">{camp.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {camp.organizer}
                      {camp.date ? ` · ${camp.date}` : ""}
                      {camp.location ? ` · ${camp.location}` : ""}
                    </p>
                    {camp.description && (
                      <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{camp.description}</p>
                    )}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {camp.sports.map(s => (
                        <span key={s} className="text-xs bg-gray-800 text-gray-500 border border-gray-700 px-2 py-0.5 rounded-full capitalize">{s}</span>
                      ))}
                    </div>
                  </div>
                  <a href={camp.registrationUrl} target="_blank" rel="noopener noreferrer"
                    className={`shrink-0 text-xs font-bold px-4 py-2 rounded-xl transition-colors ${camp.type === "polyrise" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-white/10 hover:bg-white/20 text-white border border-white/10"}`}>
                    Register ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && relevant.length > 0 && (
          <p className="text-xs text-gray-600 mt-4 text-center">
            Camps curated by PolyRISE coaching staff · Updated regularly
          </p>
        )}
      </div>
    </div>
  )
}
