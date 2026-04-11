"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter, useParams } from "next/navigation"
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
      <label className="block text-sm text-gray-300 mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
    </div>
  )
}

export default function EditTrainingAthletePage() {
  const router = useRouter()
  const params = useParams()
  const id = (params.id as string).toUpperCase()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [grade, setGrade] = useState("")
  const [school, setSchool] = useState("")
  const [position, setPosition] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [coachNotes, setCoachNotes] = useState("")
  const [sport, setSport] = useState<"football" | "soccer">("football")

  useEffect(() => {
    fetch(`/api/training?id=${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.athlete) {
          const a = d.athlete
          setName(a.name ?? "")
          setAge(String(a.age ?? ""))
          setGrade(a.grade ?? "")
          setSchool(a.school ?? "")
          setPosition(a.position ?? "")
          setPhone(a.phone ?? "")
          setEmail(a.email ?? "")
          setCoachNotes(a.coachNotes ?? "")
          setSport(a.sport === "soccer" ? "soccer" : "football")
        } else {
          setError("Athlete not found.")
        }
      })
      .catch(() => setError("Failed to load athlete."))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)
    try {
      const res = await fetch("/api/training", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, age, grade, school, position, phone, email, coachNotes, sport }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        setTimeout(() => router.push(`/training/${id}`), 800)
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
              <h1 className="text-2xl font-bold text-white">Edit Athlete</h1>
              <Link href={`/training/${id}`} className="text-xs text-gray-500 hover:text-gray-300 underline mt-0.5 block">
                ← Back to Athlete
              </Link>
            </div>
          </div>
          <LogoutButton />
        </div>

        {loading ? (
          <div className="text-gray-500 text-center py-16">Loading...</div>
        ) : (
          <>
            {error && <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm mb-6">{error}</div>}
            {success && <div className="bg-green-950 border border-green-800 rounded-xl px-4 py-3 text-green-300 text-sm mb-6">Saved! Redirecting...</div>}

            <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
              <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Athlete Info</h2>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Sport</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSport("football")}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${sport === "football" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"}`}>
                    🏈 Football
                  </button>
                  <button type="button" onClick={() => setSport("soccer")}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${sport === "soccer" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"}`}>
                    ⚽ Soccer
                  </button>
                </div>
              </div>

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
                  placeholder="Observations, goals, areas to focus on..." rows={4} maxLength={1000}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm resize-none" />
                <p className="text-xs text-gray-600 mt-1 text-right">{coachNotes.length}/1000</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Link href={`/training/${id}`}
                  className="flex-1 text-center bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl py-3 transition-colors text-sm">
                  Cancel
                </Link>
                <button type="submit" disabled={!name || !age || !grade || saving}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
