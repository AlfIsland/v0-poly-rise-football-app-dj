"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"

const GRADES = [
  "3rd Grade","4th Grade","5th Grade","6th Grade","7th Grade","8th Grade",
  "9th Grade (Freshman)","10th Grade (Sophomore)","11th Grade (Junior)","12th Grade (Senior)",
]

function Input({ label, required, value, onChange, placeholder, type = "text" }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder: string; type?: string
}) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
    </div>
  )
}

export default function NewTrainingAthletePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [grade, setGrade] = useState("")
  const [school, setSchool] = useState("")
  const [position, setPosition] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [coachNotes, setCoachNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, grade, school, position, phone, email, coachNotes }),
      })
      const data = await res.json()
      if (data.success) {
        router.push(`/training/${data.id}`)
      } else {
        setError(data.error || "Failed to save")
      }
    } catch {
      setError("Something went wrong.")
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-xl mx-auto">

        <div className="mb-8 border-b border-gray-800 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/poly-rise-logo.png" alt="PolyRISE" className="h-10 w-auto" />
            <div>
              <h1 className="text-2xl font-bold text-white">Add Training Athlete</h1>
              <Link href="/training" className="text-xs text-gray-500 hover:text-gray-300 underline mt-0.5 block">← Back to Roster</Link>
            </div>
          </div>
          <LogoutButton />
        </div>

        {error && <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
          <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Athlete Info</h2>

          <Input label="Full Name" required value={name} onChange={setName} placeholder="e.g. Marcus Johnson" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Age" required value={age} onChange={setAge} placeholder="e.g. 13" type="number" />
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Grade <span className="text-red-500">*</span></label>
              <select value={grade} onChange={e => setGrade(e.target.value)} required
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none text-sm">
                <option value="">Select grade</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <Input label="School" value={school} onChange={setSchool} placeholder="e.g. Austin Middle School" />
          <Input label="Position" value={position} onChange={setPosition} placeholder="e.g. Running Back" />
          <Input label="Phone" value={phone} onChange={setPhone} placeholder="e.g. 512-555-1234" type="tel" />
          <Input label="Email" value={email} onChange={setEmail} placeholder="e.g. parent@email.com" type="email" />

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Coach Notes</label>
            <textarea value={coachNotes} onChange={e => setCoachNotes(e.target.value)}
              placeholder="Initial observations, goals, areas to focus on..." rows={3} maxLength={500}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm resize-none" />
          </div>

          <button type="submit" disabled={!name || !age || !grade || saving}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm tracking-wide">
            {saving ? "Saving..." : "Add Athlete"}
          </button>
        </form>
      </div>
    </div>
  )
}
