"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface CollegeTarget {
  id: string
  school: string
  division: string
  state: string
  coachName: string
  emailed: boolean
}

interface RecruitingRoadmapData {
  ncaaId?: string
  instagram?: string
  checklist: Record<string, boolean>
  colleges: CollegeTarget[]
  updatedAt: string
}

interface Props {
  athleteId: string
  grade: string
  sport?: string
  twitterHandle?: string
  instagram?: string
  ncaaId?: string
}

function gradeToNum(grade: string): number {
  const g = grade.toLowerCase()
  if (g.startsWith("k")) return 0
  const m = g.match(/(\d+)/)
  return m ? parseInt(m[1]) : 0
}

function gradeTier(grade: string): number {
  const n = gradeToNum(grade)
  if (n <= 7) return 1
  if (n === 8) return 2
  if (n <= 10) return 3
  if (n === 11) return 4
  return 5
}

const TIER_LABELS: Record<number, string> = {
  1: "Foundation",
  2: "Getting Started (Grade 8)",
  3: "Build Your Brand (Grades 9–10)",
  4: "Go Time (Grade 11)",
  5: "Decision (Grade 12)",
}

const ITEMS = [
  // Tier 1 — Foundation (Grades K-7)
  { id: "first-session",   tier: 1, label: "Attended first PolyRISE training session" },
  { id: "first-combine",   tier: 1, label: "Got PR-VERIFIED at a Combine Metrics Camp" },
  { id: "hudl-created",    tier: 1, label: "Built a Hudl / film reel" },

  // Tier 2 — Transition (Grade 8+)
  { id: "twitter",         tier: 2, label: "Created X (Twitter) account for recruiting" },
  { id: "instagram",       tier: 2, label: "Created Instagram account for recruiting" },
  { id: "ncaa-registered", tier: 2, label: "Registered at NCAA Eligibility Center (ncaaeligibilitycenter.org)" },
  { id: "ncaa-id",         tier: 2, label: "Received NCAA ID number" },
  { id: "target-list",     tier: 2, label: "Built college target list (use list below)" },
  { id: "core-courses",    tier: 2, label: "Reviewed NCAA core course requirements with school counselor" },

  // Tier 3 — Build Your Brand (Grades 9-10)
  { id: "emailed-coaches", tier: 3, label: "Emailed coaches at 5+ target schools" },
  { id: "attended-camp",   tier: 3, label: "Attended a camp at a target school" },
  { id: "sat-prep",        tier: 3, label: "Started SAT/ACT prep" },
  { id: "updated-hudl",    tier: 3, label: "Updated Hudl highlights this season" },
  { id: "polyrise-staff",  tier: 3, label: "Connected with PolyRISE recruiting staff" },

  // Tier 4 — Go Time (Grade 11)
  { id: "sat-submitted",   tier: 4, label: "SAT/ACT score submitted to target schools" },
  { id: "transcripts",     tier: 4, label: "Requested official transcripts from counselor" },
  { id: "coach-contact",   tier: 4, label: "Received contact from a college coach" },
  { id: "campus-visit",    tier: 4, label: "Scheduled official campus visit" },
  { id: "narrowed-list",   tier: 4, label: "Narrowed target list to top 5" },

  // Tier 5 — Decision (Grade 12)
  { id: "final-transcripts", tier: 5, label: "Submitted final transcripts to target schools" },
  { id: "official-visit",    tier: 5, label: "Completed official campus visit" },
  { id: "offer-received",    tier: 5, label: "Received official scholarship offer" },
  { id: "nli-signed",        tier: 5, label: "Signed National Letter of Intent (NLI)" },
  { id: "notified-coach",    tier: 5, label: "Notified PolyRISE coaches of commitment" },
]

const DIVISIONS = [
  "D1 – Power 4",
  "D1 – Group of 5",
  "D1 – FCS",
  "D2",
  "D3",
  "NAIA",
  "JUCO",
  "Open",
]

function emptyRoadmap(instagram?: string, ncaaId?: string): RecruitingRoadmapData {
  return {
    ncaaId: ncaaId ?? "",
    instagram: instagram ?? "",
    checklist: {},
    colleges: [],
    updatedAt: "",
  }
}

export default function RecruitingRoadmap({ athleteId, grade, instagram, ncaaId }: Props) {
  const tier = gradeTier(grade)
  const visibleItems = ITEMS.filter(item => item.tier <= tier)

  const [roadmap, setRoadmap] = useState<RecruitingRoadmapData>(emptyRoadmap(instagram, ncaaId))
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialLoadRef = useRef(false)

  // Load on mount
  useEffect(() => {
    fetch(`/api/training/roadmap?id=${athleteId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.roadmap) {
          setRoadmap(prev => ({
            ...emptyRoadmap(instagram, ncaaId),
            ...data.roadmap,
            instagram: data.roadmap.instagram ?? instagram ?? "",
            ncaaId: data.roadmap.ncaaId ?? ncaaId ?? "",
          }))
        }
        initialLoadRef.current = true
      })
      .catch(() => { initialLoadRef.current = true })
  }, [athleteId, instagram, ncaaId])

  const save = useCallback((data: RecruitingRoadmapData) => {
    if (!initialLoadRef.current) return
    setSaveStatus("saving")
    fetch("/api/training/roadmap", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: athleteId, roadmap: data }),
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) setSaveStatus("saved")
        else setSaveStatus("idle")
      })
      .catch(() => setSaveStatus("idle"))
  }, [athleteId])

  const schedulesSave = useCallback((next: RecruitingRoadmapData) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => save(next), 800)
  }, [save])

  const updateRoadmap = useCallback((updater: (prev: RecruitingRoadmapData) => RecruitingRoadmapData) => {
    setRoadmap(prev => {
      const next = updater(prev)
      schedulesSave(next)
      return next
    })
  }, [schedulesSave])

  // Checklist
  const toggleCheck = (id: string) => {
    updateRoadmap(prev => ({
      ...prev,
      checklist: { ...prev.checklist, [id]: !prev.checklist[id] },
    }))
  }

  // NCAA ID / Instagram
  const setField = (field: "ncaaId" | "instagram", value: string) => {
    updateRoadmap(prev => ({ ...prev, [field]: value }))
  }

  // College list
  const addCollege = () => {
    if (roadmap.colleges.length >= 10) return
    updateRoadmap(prev => ({
      ...prev,
      colleges: [
        ...prev.colleges,
        { id: Date.now().toString(36), school: "", division: "D3", state: "", coachName: "", emailed: false },
      ],
    }))
  }

  const removeCollege = (id: string) => {
    updateRoadmap(prev => ({
      ...prev,
      colleges: prev.colleges.filter(c => c.id !== id),
    }))
  }

  const updateCollege = (id: string, field: keyof CollegeTarget, value: string | boolean) => {
    updateRoadmap(prev => ({
      ...prev,
      colleges: prev.colleges.map(c => c.id === id ? { ...c, [field]: value } : c),
    }))
  }

  // Progress
  const checked = visibleItems.filter(i => roadmap.checklist[i.id]).length
  const total = visibleItems.length
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0

  const emailedCount = roadmap.colleges.filter(c => c.emailed).length

  // Group visible items by tier
  const tierGroups: Record<number, typeof ITEMS> = {}
  for (const item of visibleItems) {
    if (!tierGroups[item.tier]) tierGroups[item.tier] = []
    tierGroups[item.tier].push(item)
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">PolyRISE Recruiting</p>
          <h2 className="text-white font-black text-lg leading-tight">Recruiting Roadmap</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            {checked} of {total} milestones complete
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`text-xs font-semibold transition-opacity ${
            saveStatus === "saving" ? "text-yellow-400 opacity-100" :
            saveStatus === "saved" ? "text-green-400 opacity-100" :
            "opacity-0"
          }`}>
            {saveStatus === "saving" ? "Saving..." : "Saved ✓"}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 font-mono w-8 text-right">{pct}%</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-6">

        {/* Checklist by tier */}
        {Object.entries(tierGroups).map(([tierStr, items]) => {
          const t = parseInt(tierStr)
          return (
            <div key={t}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                {TIER_LABELS[t]}
              </p>
              <div className="space-y-2">
                {items.map(item => {
                  const done = !!roadmap.checklist[item.id]
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className="w-full flex items-center gap-3 text-left group"
                    >
                      <span className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        done
                          ? "bg-green-600 border-green-600"
                          : "border-gray-600 group-hover:border-gray-400"
                      }`}>
                        {done && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-sm transition-colors ${
                        done ? "text-gray-500 line-through" : "text-gray-300 group-hover:text-white"
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* NCAA ID + Instagram */}
        <div className="border-t border-gray-800 pt-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Recruiting Info</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">NCAA ID Number</label>
              <input
                type="text"
                value={roadmap.ncaaId ?? ""}
                onChange={e => setField("ncaaId", e.target.value)}
                placeholder="e.g. 2301234567"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:border-red-500 focus:outline-none placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Instagram Handle</label>
              <input
                type="text"
                value={roadmap.instagram ?? ""}
                onChange={e => setField("instagram", e.target.value)}
                placeholder="@AthleteHandle"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:border-red-500 focus:outline-none placeholder-gray-600"
              />
            </div>
          </div>
        </div>

        {/* College Target List */}
        <div className="border-t border-gray-800 pt-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">College Target List</p>
              <p className="text-xs text-gray-600 mt-0.5">{emailedCount} of {roadmap.colleges.length} school{roadmap.colleges.length !== 1 ? "s" : ""} emailed</p>
            </div>
            <button
              onClick={addCollege}
              disabled={roadmap.colleges.length >= 10}
              className="text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-3 py-1.5 rounded-xl transition-colors shrink-0"
            >
              + Add School
            </button>
          </div>

          {roadmap.colleges.length === 0 ? (
            <p className="text-xs text-gray-600 italic">No schools added yet. Add up to 10 target schools.</p>
          ) : (
            <div className="space-y-2">
              {/* Header row */}
              <div className="hidden sm:grid grid-cols-[1fr_140px_80px_1fr_44px_28px] gap-2 px-3 py-1">
                <p className="text-xs text-gray-600 uppercase tracking-wider">School</p>
                <p className="text-xs text-gray-600 uppercase tracking-wider">Division</p>
                <p className="text-xs text-gray-600 uppercase tracking-wider">State</p>
                <p className="text-xs text-gray-600 uppercase tracking-wider">Coach</p>
                <p className="text-xs text-gray-600 uppercase tracking-wider text-center">Emailed</p>
                <span />
              </div>
              {roadmap.colleges.map(college => (
                <div key={college.id} className="bg-gray-800 rounded-xl border border-gray-700 p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_80px_1fr_44px_28px] gap-2 items-center">
                    <input
                      type="text"
                      value={college.school}
                      onChange={e => updateCollege(college.id, "school", e.target.value)}
                      placeholder="School name"
                      className="bg-gray-900 border border-gray-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:border-red-500 focus:outline-none placeholder-gray-600"
                    />
                    <select
                      value={college.division}
                      onChange={e => updateCollege(college.id, "division", e.target.value)}
                      className="bg-gray-900 border border-gray-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:border-red-500 focus:outline-none"
                    >
                      {DIVISIONS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={college.state}
                      onChange={e => updateCollege(college.id, "state", e.target.value)}
                      placeholder="TX"
                      className="bg-gray-900 border border-gray-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:border-red-500 focus:outline-none placeholder-gray-600"
                    />
                    <input
                      type="text"
                      value={college.coachName}
                      onChange={e => updateCollege(college.id, "coachName", e.target.value)}
                      placeholder="Coach name"
                      className="bg-gray-900 border border-gray-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:border-red-500 focus:outline-none placeholder-gray-600"
                    />
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={college.emailed}
                          onChange={e => updateCollege(college.id, "emailed", e.target.checked)}
                          className="w-4 h-4 accent-green-500 cursor-pointer"
                        />
                        <span className="text-xs text-gray-500 sm:hidden">Emailed</span>
                      </label>
                    </div>
                    <button
                      onClick={() => removeCollege(college.id)}
                      className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-950/30 transition-colors mx-auto sm:mx-0"
                      title="Remove school"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4h12M5 4V2.5A.5.5 0 015.5 2h5a.5.5 0 01.5.5V4M6 7v5M10 7v5M3 4l1 9.5A.5.5 0 004.5 14h7a.5.5 0 00.5-.5L13 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {roadmap.colleges.length > 0 && (
                <div className="flex items-center gap-2 mt-1 px-1">
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full transition-all duration-500"
                      style={{ width: roadmap.colleges.length > 0 ? `${(emailedCount / roadmap.colleges.length) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">{emailedCount} of {roadmap.colleges.length} emailed</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
