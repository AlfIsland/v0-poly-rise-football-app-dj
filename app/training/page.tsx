"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import LogoutButton from "@/components/logout-button"

const GRADES = [
  "3rd Grade","4th Grade","5th Grade","6th Grade","7th Grade","8th Grade",
  "9th Grade","10th Grade","11th Grade","12th Grade",
]

interface Athlete {
  id: string; name: string; age: number; grade: string
  school: string; position?: string; sport?: string; sessions: { date: string }[]; featured?: boolean
}

function MetricInput({ label, value, onChange, placeholder, step = "0.01" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; step?: string
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input type="number" step={step} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
    </div>
  )
}

function parseAthleteText(raw: string) {
  const t = raw

  // Grab first match only (so duplicate entries use the first value)
  const grab = (patterns: RegExp[]): string => {
    for (const p of patterns) {
      const m = t.match(p)
      if (m) return (m[1] ?? m[2] ?? "").trim()
    }
    return ""
  }

  // ── Name ──
  const nameLine = grab([/name[:\s]+([A-Za-z ,.'-]+)/i])
    || t.split(/\n/)[0].replace(/\b(best|age|grade|school|position|pos)\b.*/i, "").trim()

  // ── Age / Grade ──
  const age = grab([/age[:\s]+(\d+)/i, /(\d+)\s*(?:yrs?|years?\s*old)/i])
  const gradeNum = grab([/(\d+)(?:st|nd|rd|th)\s*grade/i, /grade[:\s]+(\d+)/i])
  const gradeSuffix = gradeNum ? (["1","2","3"].includes(gradeNum) ? ["st","nd","rd"][+gradeNum-1] : "th") : ""
  const gradeLabel = gradeNum ? `${gradeNum}${gradeSuffix} Grade` : ""

  // ── Position / School ──
  const position = grab([
    /pos(?:ition)?[:\s]+([A-Za-z/ ]+?)(?:[,\n|]|$)/i,
    /\b(QB|WR|RB|TE|OL|DL|LB|CB|DB|DE|FS|SS)\b/i,
  ])
  const school = grab([/school[:\s]+([A-Za-z0-9 .'-]+?)(?:[,\n|]|$)/i])

  // ── 40-Yard Dash ──
  // Handles: "4.8s 40-Yd", "40-yard: 4.8", "40: 4.8"
  const fortyYard = grab([
    /(\d+\.?\d*)\s*s\s*40[\s-]*(?:yd|yard|yard dash)?(?:\b|$)/i,
    /40[\s-]*(?:yard|yd)?[\s-]*(?:dash)?[:\s]+(\d+\.?\d*)/i,
  ])

  // ── Shuttle / 5-10-5 (take first match, ignore 5-10-50 typo as second entry) ──
  const shuttle = grab([
    /(\d+\.?\d*)\s*s\s*5[\s-]*10[\s-]*5(?!\d)/i,   // "4.73s 5-10-5" (NOT 5-10-50)
    /5[\s-]*10[\s-]*5(?!\d)[:\s]+(\d+\.?\d*)/i,
    /(\d+\.?\d*)\s*s\s*short[\s-]*shuttle/i,
    /short[\s-]*shuttle[:\s]+(\d+\.?\d*)/i,
    /(\d+\.?\d*)\s*s\s*shuttle(?!\s*run)/i,
    /shuttle[:\s]+(\d+\.?\d*)/i,
  ])

  // ── 3-Cone / L-Drill ──
  const threeCone = grab([
    /(\d+\.?\d*)\s*s\s*l[\s-]*drill/i,             // "4.91s L-Drill"
    /l[\s-]*drill[:\s]+(\d+\.?\d*)/i,
    /(\d+\.?\d*)\s*s\s*3[\s-]*cone/i,
    /3[\s-]*cone[:\s]+(\d+\.?\d*)/i,
    /(\d+\.?\d*)\s*s\s*three[\s-]*cone/i,
    /three[\s-]*cone[:\s]+(\d+\.?\d*)/i,
  ])

  // ── Vertical Jump ──
  const verticalJump = grab([
    /(\d+\.?\d*)\s*(?:"|in|inches?)\s*vert(?:ical)?/i,
    /vert(?:ical)?(?:\s*jump)?[:\s]+(\d+\.?\d*)/i,
  ])

  // ── Broad Jump — handles feet (ft) and inches (in/") ──
  const broadRaw = grab([
    /(\d+\.?\d*)\s*ft\s*(?:bj|broad)/i,            // "8.3 ft BJ" — feet
    /(\d+\.?\d*)\s*(?:ft|feet)\s*broad/i,
    /bj[:\s]+(\d+\.?\d*)\s*ft/i,
    /broad(?:\s*jump)?[:\s]+(\d+\.?\d*)\s*ft/i,
    /(\d+\.?\d*)\s*(?:"|in)\s*(?:bj|broad)/i,      // inches
    /bj[:\s]+(\d+\.?\d*)/i,
    /broad(?:\s*jump)?[:\s]+(\d+\.?\d*)/i,
  ])
  // Detect if value was in feet and convert to inches
  const broadInFeet = /(\d+\.?\d*)\s*ft\s*(?:bj|broad)/i.test(t)
    || /bj[:\s]+(\d+\.?\d*)\s*ft/i.test(t)
    || /broad(?:\s*jump)?[:\s]+(\d+\.?\d*)\s*ft/i.test(t)
    || /(\d+\.?\d*)\s*(?:ft|feet)\s*broad/i.test(t)
  const broadJump = broadRaw
    ? broadInFeet ? String((parseFloat(broadRaw) * 12).toFixed(1)) : broadRaw
    : ""

  // ── Bench Press ──
  const benchPress = grab([/bench(?:\s*press)?[:\s]+(\d+)/i])

  // ── Weight ──
  const weight = grab([/(?:body\s*)?weight[:\s]+(\d+\.?\d*)/i, /(\d+\.?\d*)\s*lbs/i])

  return { name: nameLine, age, grade: gradeLabel, position, school, fortyYard, shuttle, threeCone, verticalJump, broadJump, benchPress, weight }
}

export default function TrainingRosterPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loadingAthletes, setLoadingAthletes] = useState(true)
  const [showQuickEntry, setShowQuickEntry] = useState(false)
  const [entryTab, setEntryTab] = useState<"manual" | "paste">("paste")
  const [pasteText, setPasteText] = useState("")
  const [parsed, setParsed] = useState(false)

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [grade, setGrade] = useState("")
  const [position, setPosition] = useState("")
  const [school, setSchool] = useState("")
  const [sport, setSport] = useState<"football" | "soccer">("football")
  const [fortyYard, setFortyYard] = useState("")
  const [twentyYard, setTwentyYard] = useState("")
  const [shuttle, setShuttle] = useState("")
  const [threeCone, setThreeCone] = useState("")
  const [verticalJump, setVerticalJump] = useState("")
  const [broadJump, setBroadJump] = useState("")
  const [benchPress, setBenchPress] = useState("")
  const [weight, setWeight] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")
  const [duplicate, setDuplicate] = useState<{ id: string; name: string } | null>(null)

  const fetchAthletes = useCallback(async () => {
    try {
      const res = await fetch("/api/training")
      const data = await res.json()
      if (data.success) setAthletes(data.athletes)
    } catch { /* ignore */ }
    setLoadingAthletes(false)
  }, [])

  useEffect(() => { fetchAthletes() }, [fetchAthletes])

  const resetForm = () => {
    setName(""); setAge(""); setGrade(""); setPosition(""); setSchool(""); setSport("football")
    setFortyYard(""); setTwentyYard(""); setShuttle(""); setThreeCone("")
    setVerticalJump(""); setBroadJump(""); setBenchPress(""); setWeight("")
    setPasteText(""); setParsed(false); setDuplicate(null)
  }

  const checkDuplicate = (val: string) => {
    if (!val.trim()) { setDuplicate(null); return }
    const match = athletes.find(a =>
      a.name.trim().toLowerCase() === val.trim().toLowerCase()
    )
    setDuplicate(match ? { id: match.id, name: match.name } : null)
  }

  const handleParse = () => {
    if (!pasteText.trim()) return
    const r = parseAthleteText(pasteText)
    setName(r.name); setAge(r.age); setGrade(r.grade); setPosition(r.position)
    setSchool(r.school); setFortyYard(r.fortyYard); setTwentyYard(""); setShuttle(r.shuttle)
    setThreeCone(r.threeCone); setVerticalJump(r.verticalJump)
    setBroadJump(r.broadJump); setBenchPress(r.benchPress); setWeight(r.weight)
    setParsed(true)
    checkDuplicate(r.name)
  }

  const handleQuickSave = async () => {
    if (!name || !age || !grade) return
    setSaving(true); setSaveMsg("")
    try {
      const createRes = await fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, grade, school, position, sport }),
      })
      const createData = await createRes.json()
      if (!createData.success) { setSaveMsg("Error creating athlete."); setSaving(false); return }

      const id = createData.id
      const hasMetrics = fortyYard || twentyYard || shuttle || threeCone || verticalJump || broadJump || benchPress || weight
      if (hasMetrics) {
        await fetch("/api/training", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id, action: "add-session",
            date: new Date().toISOString().split("T")[0],
            fortyYard, twentyYard, shuttle, threeCone, verticalJump, broadJump, benchPress, weight,
          }),
        })
      }

      setSaveMsg(`✓ ${name} added${hasMetrics ? " with baseline metrics" : ""}`)
      resetForm()
      await fetchAthletes()
      setTimeout(() => setSaveMsg(""), 4000)
    } catch {
      setSaveMsg("Something went wrong.")
    }
    setSaving(false)
  }

  const fieldSection = (
    <div className="space-y-4">
      {parsed && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-green-400 font-semibold">Fields filled — review and correct if needed</p>
          <button onClick={() => { setParsed(false); setPasteText("") }} className="text-xs text-gray-500 hover:text-gray-300 underline">
            ← Paste again
          </button>
        </div>
      )}

      {/* Sport toggle */}
      <div className="flex gap-2 mb-1">
        <button onClick={() => setSport("football")}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${sport === "football" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"}`}>
          🏈 Football
        </button>
        <button onClick={() => setSport("soccer")}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${sport === "soccer" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"}`}>
          ⚽ Soccer
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Full Name <span className="text-red-500">*</span></label>
          <input value={name} onChange={e => { setName(e.target.value); checkDuplicate(e.target.value) }} placeholder="e.g. Marcus Johnson"
            className={`w-full bg-gray-800 text-white rounded-lg px-3 py-2 border focus:outline-none placeholder-gray-600 text-sm ${duplicate ? "border-yellow-500 focus:border-yellow-400" : "border-gray-700 focus:border-red-500"}`} />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Age <span className="text-red-500">*</span></label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 13" min="8" max="19"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Grade <span className="text-red-500">*</span></label>
          <select value={grade} onChange={e => setGrade(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm">
            <option value="">Select</option>
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Position</label>
          <input value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g. WR"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">School</label>
          <input value={school} onChange={e => setSchool(e.target.value)} placeholder="e.g. Austin Middle School"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Body Weight (lbs)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 145"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
        </div>
      </div>

      <div className="border-t border-gray-800 pt-4">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Metrics — leave blank if not tested</p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <MetricInput label="40-Yd Dash (s)" value={fortyYard} onChange={setFortyYard} placeholder="4.52" />
          <MetricInput label="20-Yd Dash (s)" value={twentyYard} onChange={setTwentyYard} placeholder="2.75" />
          <MetricInput label="5-10-5 (s)" value={shuttle} onChange={setShuttle} placeholder="4.21" />
          <MetricInput label="3-Cone (s)" value={threeCone} onChange={setThreeCone} placeholder="6.89" />
          <MetricInput label="Vertical (in)" value={verticalJump} onChange={setVerticalJump} placeholder="34" step="0.5" />
          <MetricInput label="Broad (in)" value={broadJump} onChange={setBroadJump} placeholder="108" step="0.5" />
          <MetricInput label="Bench (reps)" value={benchPress} onChange={setBenchPress} placeholder="12" step="1" />
        </div>
      </div>

      {duplicate && (
        <div className="bg-yellow-950 border border-yellow-700 rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="text-yellow-400 text-lg mt-0.5">⚠️</span>
          <div>
            <p className="text-yellow-300 font-semibold text-sm">Duplicate name detected</p>
            <p className="text-yellow-500 text-xs mt-0.5">
              <span className="font-mono text-yellow-400">{duplicate.name}</span> already exists in the system ({duplicate.id}).{" "}
              <a href={`/training/${duplicate.id}`} target="_blank" className="underline hover:text-yellow-300">View their profile →</a>
            </p>
            <p className="text-yellow-600 text-xs mt-1">Save anyway if this is a different athlete with the same name.</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 pt-1">
        <button onClick={handleQuickSave} disabled={!name || !age || !grade || saving}
          className={`font-bold rounded-xl px-8 py-2.5 transition-colors text-sm tracking-wide text-white ${duplicate ? "bg-yellow-700 hover:bg-yellow-600 disabled:bg-gray-700" : "bg-red-600 hover:bg-red-700 disabled:bg-gray-700"} disabled:cursor-not-allowed`}>
          {saving ? "Saving..." : duplicate ? "Save Anyway" : "Save Athlete"}
        </button>
        <button onClick={resetForm} className="text-xs text-gray-500 hover:text-gray-300 underline">Clear</button>
        {saveMsg && <p className="text-green-400 text-sm font-semibold">{saveMsg}</p>}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 border-b border-gray-800 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={40} height={40} className="object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-white">PolyRISE Training Tracker</h1>
              <p className="text-gray-400 text-sm">{athletes.length} athlete{athletes.length !== 1 ? "s" : ""} enrolled</p>
              <Link href="/admin/athletes" className="text-xs text-gray-600 hover:text-gray-400 underline mt-0.5 block">← PR-VERIFIED Roster</Link>
              <Link href="/training/dedup" className="text-xs text-yellow-600 hover:text-yellow-400 underline mt-0.5 block">🧹 Clean Duplicates</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowQuickEntry(v => !v); resetForm() }}
              className={`font-semibold px-4 py-2 rounded-xl text-sm transition-colors ${showQuickEntry ? "bg-gray-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}>
              {showQuickEntry ? "✕ Close" : "+ Quick Entry"}
            </button>
            <LogoutButton />
          </div>
        </div>

        {/* ── Quick Entry Panel ── */}
        {showQuickEntry && (
          <div className="bg-gray-900 rounded-2xl border border-red-900 p-6 mb-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-red-400 uppercase tracking-widest">Quick Entry</h2>
              <div className="flex gap-2">
                <button onClick={() => { setEntryTab("paste"); setParsed(false) }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${entryTab === "paste" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                  Smart Paste
                </button>
                <button onClick={() => setEntryTab("manual")}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${entryTab === "manual" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                  Manual
                </button>
              </div>
            </div>

            {/* Smart Paste — text input */}
            {entryTab === "paste" && !parsed && (
              <div className="space-y-3">
                <p className="text-xs text-gray-400">Paste anything — from Grok, your notes, a text message. The system reads it and fills everything in automatically.</p>
                <div className="bg-gray-800 rounded-xl p-3 text-xs text-gray-500 space-y-1 border border-gray-700">
                  <p className="text-gray-300 font-semibold mb-1">Works with any format, for example:</p>
                  <p className="text-gray-400">Marcus Johnson, age 13, 8th grade, WR, Austin Middle</p>
                  <p className="text-gray-400">40-yard: 5.12, Shuttle: 4.60, Vertical: 24, Broad: 84, 3-cone: 7.1</p>
                </div>
                <textarea value={pasteText} onChange={e => setPasteText(e.target.value)}
                  placeholder="Paste athlete info + metrics here..." rows={5}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm resize-none" />
                <button onClick={handleParse} disabled={!pasteText.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl px-6 py-2.5 text-sm transition-colors">
                  Parse & Fill Fields
                </button>
              </div>
            )}

            {/* Fields — shown after paste OR in manual mode */}
            {(entryTab === "manual" || parsed) && fieldSection}
          </div>
        )}

        {/* Roster */}
        {loadingAthletes ? (
          <div className="flex items-center justify-center py-24 text-gray-600">Loading...</div>
        ) : athletes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600 gap-3">
            <p className="text-lg">No training athletes yet.</p>
            <button onClick={() => setShowQuickEntry(true)} className="text-red-400 underline text-sm">Add your first athlete</button>
          </div>
        ) : (() => {
          const sorted = [...athletes].sort((a, b) => {
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1
            return 0
          })
          const spotlightCount = sorted.filter(a => a.featured).length
          return (
            <>
              {spotlightCount > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  <span className="text-xs text-yellow-400 font-semibold uppercase tracking-widest">
                    {spotlightCount} Athlete{spotlightCount > 1 ? "s" : ""} of the Month
                  </span>
                </div>
              )}

              {/* Desktop table */}
              <div className="hidden md:block bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="text-left px-6 py-4">Athlete</th>
                      <th className="text-left px-6 py-4">Age / Grade</th>
                      <th className="text-left px-6 py-4">School</th>
                      <th className="text-left px-6 py-4">Position</th>
                      <th className="text-left px-6 py-4">Sessions</th>
                      <th className="text-left px-6 py-4">Last Tested</th>
                      <th className="text-left px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((a) => {
                      const lastSession = a.sessions?.length ? a.sessions[a.sessions.length - 1] : null
                      const isSoccer = a.sport === "soccer"
                      return (
                        <tr key={a.id} className={`border-b transition-colors ${
                          a.featured
                            ? "bg-yellow-950/30 border-yellow-900/40 hover:bg-yellow-950/50"
                            : isSoccer
                              ? "bg-green-950/20 border-green-900/30 hover:bg-green-950/40"
                              : "border-gray-800 hover:bg-gray-800"
                        }`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {a.featured && (
                                <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className={`font-semibold ${a.featured ? "text-yellow-100" : "text-white"}`}>{a.name}</p>
                                  {isSoccer && <span className="text-xs bg-green-800 text-green-300 px-1.5 py-0.5 rounded font-medium">⚽ Soccer</span>}
                                </div>
                                <p className="text-xs text-gray-600 font-mono">{a.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{a.age} yrs · {a.grade}</td>
                          <td className="px-6 py-4 text-gray-300">{a.school || "—"}</td>
                          <td className="px-6 py-4 text-gray-300">{a.position || "—"}</td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-bold ${a.sessions?.length ? "text-white" : "text-gray-600"}`}>
                              {a.sessions?.length ?? 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-xs">
                            {lastSession ? new Date(lastSession.date).toLocaleDateString() : "Never"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Link href={`/training/${a.id}`}
                                className="text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors">
                                View
                              </Link>
                              <Link href={`/training/${a.id}/session`}
                                className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors">
                                + Test
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {sorted.map((a) => {
                  const lastSession = a.sessions?.length ? a.sessions[a.sessions.length - 1] : null
                  const isSoccer = a.sport === "soccer"
                  return (
                    <div key={a.id} className={`rounded-2xl p-4 border ${
                      a.featured ? "bg-yellow-950/30 border-yellow-700/40"
                      : isSoccer ? "bg-green-950/20 border-green-800/40"
                      : "bg-gray-900 border-gray-800"
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {a.featured && (
                            <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`font-bold ${a.featured ? "text-yellow-100" : "text-white"}`}>{a.name}</p>
                              {isSoccer && <span className="text-xs bg-green-800 text-green-300 px-1.5 py-0.5 rounded font-medium">⚽ Soccer</span>}
                            </div>
                            <p className="text-xs text-gray-600 font-mono">{a.id}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{a.sessions?.length ?? 0} sessions</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                        <p>Age: <span className="text-gray-300">{a.age} · {a.grade}</span></p>
                        <p>Position: <span className="text-gray-300">{a.position || "—"}</span></p>
                        <p className="col-span-2">Last tested: <span className="text-gray-300">{lastSession ? new Date(lastSession.date).toLocaleDateString() : "Never"}</span></p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/training/${a.id}`} className="flex-1 text-center text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg">View</Link>
                        <Link href={`/training/${a.id}/session`} className="flex-1 text-center text-xs bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg">+ Test</Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )
        })()}
      </div>
    </div>
  )
}
