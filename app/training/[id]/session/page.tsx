"use client"

import { useState, useEffect, FormEvent, Suspense } from "react"
import { useRouter, useParams } from "next/navigation"
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

function SessionForm() {
  const params = useParams()
  const router = useRouter()
  const id = (params.id as string).toUpperCase()

  const [athleteName, setAthleteName] = useState("")
  const [sessionCount, setSessionCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [weight, setWeight] = useState("")
  const [fortyYard, setFortyYard] = useState("")
  const [shuttle, setShuttle] = useState("")
  const [threeCone, setThreeCone] = useState("")
  const [verticalJump, setVerticalJump] = useState("")
  const [broadJump, setBroadJump] = useState("")
  const [benchPress, setBenchPress] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/training?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setAthleteName(data.athlete.name)
          setSessionCount(data.athlete.sessions?.length ?? 0)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/training", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id, action: "add-session",
          date, weight, fortyYard, shuttle, threeCone,
          verticalJump, broadJump, benchPress, notes,
        }),
      })
      const data = await res.json()
      if (data.success) {
        router.push(`/training/${id}`)
      } else {
        setError(data.error || "Failed to save session")
      }
    } catch {
      setError("Something went wrong.")
    }
    setSaving(false)
  }

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">Loading...</div>

  const isBaseline = sessionCount === 0

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-xl mx-auto">

        <div className="mb-8 border-b border-gray-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{isBaseline ? "Baseline Test" : `Session #${sessionCount + 1}`}</h1>
            <p className="text-red-400 font-semibold">{athleteName}</p>
            <Link href={`/training/${id}`} className="text-xs text-gray-500 hover:text-gray-300 underline mt-0.5 block">← Back to Profile</Link>
          </div>
          <LogoutButton />
        </div>

        {isBaseline && (
          <div className="bg-blue-950 border border-blue-800 rounded-xl px-4 py-3 mb-6">
            <p className="text-blue-300 font-semibold text-sm">This is the baseline test</p>
            <p className="text-blue-400 text-xs mt-0.5">All future progress will be measured against these numbers.</p>
          </div>
        )}

        {error && <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Session Details</h2>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Test Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
            </div>
            <Input label="Body Weight (lbs)" value={weight} onChange={setWeight} placeholder="e.g. 145" type="number" hint="Optional — tracks body composition over time" />
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Speed & Agility</h2>
            <p className="text-xs text-gray-500">Leave blank for any metrics not tested this session.</p>
            <Input label="40-Yard Dash (sec)" value={fortyYard} onChange={setFortyYard} placeholder="e.g. 5.12" type="number" step="0.01" />
            <Input label="20-Yard Shuttle (sec)" value={shuttle} onChange={setShuttle} placeholder="e.g. 4.60" type="number" step="0.01" />
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
              placeholder="How did the athlete perform? Any observations, highlights, or concerns..." rows={3}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm resize-none" />
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold rounded-xl py-3 transition-colors text-sm tracking-wide">
            {saving ? "Saving..." : isBaseline ? "Save Baseline" : "Save Session"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AddSessionPage() {
  return <Suspense><SessionForm /></Suspense>
}
