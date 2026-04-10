"use client"

import { useState, useEffect, FormEvent, Suspense } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"

function Input({ label, value, onChange, placeholder, type = "text", step, hint }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder: string; type?: string; step?: string; hint?: string
}) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-600 mb-1.5">{hint}</p>}
      <input type={type} step={step} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
    </div>
  )
}

function EditSessionForm() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = (params.id as string).toUpperCase()
  const sessionIndex = parseInt(searchParams.get("i") ?? "0")

  const [athleteName, setAthleteName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [date, setDate] = useState("")
  const [weight, setWeight] = useState("")
  const [fortyYard, setFortyYard] = useState("")
  const [shuttle, setShuttle] = useState("")
  const [shuttleLeft, setShuttleLeft] = useState("")
  const [shuttleRight, setShuttleRight] = useState("")
  const [threeCone, setThreeCone] = useState("")
  const [verticalJump, setVerticalJump] = useState("")
  const [broadJump, setBroadJump] = useState("")
  const [benchPress, setBenchPress] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    fetch(`/api/training?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.athlete) {
          const a = data.athlete
          setAthleteName(a.name)
          const s = a.sessions?.[sessionIndex]
          if (s) {
            setDate(s.date ?? "")
            setWeight(s.weight != null ? String(s.weight) : "")
            setFortyYard(s.fortyYard != null ? String(s.fortyYard) : "")
            setShuttle(s.shuttle != null ? String(s.shuttle) : "")
            setShuttleLeft(s.shuttleLeft != null ? String(s.shuttleLeft) : "")
            setShuttleRight(s.shuttleRight != null ? String(s.shuttleRight) : "")
            setThreeCone(s.threeCone != null ? String(s.threeCone) : "")
            setVerticalJump(s.verticalJump != null ? String(s.verticalJump) : "")
            setBroadJump(s.broadJump != null ? String(s.broadJump) : "")
            setBenchPress(s.benchPress != null ? String(s.benchPress) : "")
            setNotes(s.notes ?? "")
          } else {
            setError("Session not found.")
          }
        }
        setLoading(false)
      })
      .catch(() => { setError("Failed to load."); setLoading(false) })
  }, [id, sessionIndex])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/training", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id, action: "edit-session", sessionIndex,
          date, weight, fortyYard, shuttle, shuttleLeft, shuttleRight, threeCone,
          verticalJump, broadJump, benchPress, notes,
        }),
      })
      const data = await res.json()
      if (data.success) {
        router.push(`/training/${id}`)
      } else {
        setError(data.error || "Failed to save")
      }
    } catch {
      setError("Something went wrong.")
    }
    setSaving(false)
  }

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">Loading...</div>

  const sessionLabel = sessionIndex === 0 ? "Baseline Test" : `Session #${sessionIndex + 1}`

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-xl mx-auto">

        <div className="mb-8 border-b border-gray-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Edit {sessionLabel}</h1>
            <p className="text-red-400 font-semibold">{athleteName}</p>
            <Link href={`/training/${id}`} className="text-xs text-gray-500 hover:text-gray-300 underline mt-0.5 block">← Back to Profile</Link>
          </div>
          <LogoutButton />
        </div>

        <div className="bg-yellow-950 border border-yellow-800 rounded-xl px-4 py-3 mb-6">
          <p className="text-yellow-300 font-semibold text-sm">Editing {sessionLabel}</p>
          <p className="text-yellow-500 text-xs mt-0.5">Leave a metric blank to clear it from this session.</p>
        </div>

        {error && <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Session Details</h2>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Test Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
            </div>
            <Input label="Body Weight (lbs)" value={weight} onChange={setWeight} placeholder="e.g. 145" type="number" hint="Leave blank to clear" />
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Speed & Agility</h2>
            <Input label="40-Yard Dash (sec)" value={fortyYard} onChange={setFortyYard} placeholder="e.g. 5.12" type="number" step="0.01" />
            <Input label="5-10-5 Shuttle — Overall (sec)" value={shuttle} onChange={setShuttle} placeholder="e.g. 4.60" type="number" step="0.01" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Shuttle Left (sec)" value={shuttleLeft} onChange={setShuttleLeft} placeholder="e.g. 4.55" type="number" step="0.01" hint="Starting left" />
              <Input label="Shuttle Right (sec)" value={shuttleRight} onChange={setShuttleRight} placeholder="e.g. 4.68" type="number" step="0.01" hint="Starting right" />
            </div>
            <Input label="3-Cone Drill (sec)" value={threeCone} onChange={setThreeCone} placeholder="e.g. 7.20" type="number" step="0.01" />
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Power & Strength</h2>
            <Input label="Vertical Jump (inches)" value={verticalJump} onChange={setVerticalJump} placeholder="e.g. 24" type="number" step="0.5" />
            <Input label="Broad Jump (inches)" value={broadJump} onChange={setBroadJump} placeholder="e.g. 84" type="number" step="0.5" />
            <Input label="Bench Press 225 (reps)" value={benchPress} onChange={setBenchPress} placeholder="e.g. 8" type="number" />
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Session Notes</h2>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Observations, highlights, corrections..." rows={3}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm resize-none" />
          </div>

          <div className="flex gap-3">
            <Link href={`/training/${id}`}
              className="flex-1 text-center bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl py-3 transition-colors text-sm">
              Cancel
            </Link>
            <button type="submit" disabled={saving}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold rounded-xl py-3 transition-colors text-sm">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EditSessionPage() {
  return <Suspense><EditSessionForm /></Suspense>
}
