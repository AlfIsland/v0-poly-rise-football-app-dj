"use client"

import { useState, useEffect, FormEvent, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"
import SendContactButtons from "@/components/send-contact-buttons"

function Input({ label, value, onChange, placeholder, type = "text", step, required }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder: string; type?: string; step?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type} step={step} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm"
      />
    </div>
  )
}

function EditForm() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")?.toUpperCase() ?? ""

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  // Athlete info
  const [athleteName, setAthleteName] = useState("")
  const [position, setPosition] = useState("")
  const [school, setSchool] = useState("")
  const [gradYear, setGradYear] = useState("")
  const [heightFt, setHeightFt] = useState("")
  const [heightIn, setHeightIn] = useState("")
  const [weight, setWeight] = useState("")
  const [gpa, setGpa] = useState("")
  const [coachNotes, setCoachNotes] = useState("")
  const [videoLink, setVideoLink] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  // Combine metrics
  const [fortyYard, setFortyYard] = useState("")
  const [twentyYard, setTwentyYard] = useState("")
  const [shuttle, setShuttle] = useState("")
  const [threeCone, setThreeCone] = useState("")
  const [verticalJump, setVerticalJump] = useState("")
  const [broadJump, setBroadJump] = useState("")
  const [benchPress, setBenchPress] = useState("")

  // Meta (read-only display)
  const [issuedAt, setIssuedAt] = useState("")
  const [expiresAt, setExpiresAt] = useState("")

  useEffect(() => {
    if (!code) { setLoading(false); return }
    fetch(`/api/athletes?code=${code}`)
      .then(r => r.json())
      .then(data => {
        if (!data.success) { setError("Athlete not found."); setLoading(false); return }
        const a = data.athlete
        setAthleteName(a.athleteName ?? "")
        setPosition(a.position ?? "")
        setSchool(a.school ?? "")
        setGradYear(a.gradYear ?? "")
        if (a.height) {
          const parts = a.height.match(/(\d+)'(\d+)"/)
          if (parts) { setHeightFt(parts[1]); setHeightIn(parts[2]) }
          else setHeightFt(a.height)
        }
        setWeight(a.weight ?? "")
        setGpa(a.gpa ?? "")
        setCoachNotes(a.coachNotes ?? "")
        setVideoLink(a.videoLink ?? "")
        setPhone(a.phone ?? "")
        setEmail(a.email ?? "")
        setFortyYard(a.metrics?.fortyYard?.toString() ?? "")
        setTwentyYard(a.metrics?.twentyYard?.toString() ?? "")
        setShuttle(a.metrics?.shuttle?.toString() ?? "")
        setThreeCone(a.metrics?.threeCone?.toString() ?? "")
        setVerticalJump(a.metrics?.verticalJump?.toString() ?? "")
        setBroadJump(a.metrics?.broadJump?.toString() ?? "")
        setBenchPress(a.metrics?.benchPress?.toString() ?? "")
        setIssuedAt(a.issuedAt ?? "")
        setExpiresAt(a.expiresAt ?? "")
        setLoading(false)
      })
      .catch(() => { setError("Failed to load athlete."); setLoading(false) })
  }, [code])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    const metrics: Record<string, number> = {}
    if (fortyYard) metrics.fortyYard = parseFloat(fortyYard)
    if (twentyYard) metrics.twentyYard = parseFloat(twentyYard)
    if (shuttle) metrics.shuttle = parseFloat(shuttle)
    if (threeCone) metrics.threeCone = parseFloat(threeCone)
    if (verticalJump) metrics.verticalJump = parseFloat(verticalJump)
    if (broadJump) metrics.broadJump = parseFloat(broadJump)
    if (benchPress) metrics.benchPress = parseInt(benchPress)

    try {
      const res = await fetch("/api/athletes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          athleteName,
          position,
          school,
          gradYear,
          height: heightFt && heightIn ? `${heightFt}'${heightIn}"` : "",
          weight,
          gpa,
          coachNotes,
          videoLink,
          phone,
          email,
          metrics,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(data.error || "Failed to save.")
      }
    } catch {
      setError("Something went wrong.")
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">
        Loading athlete...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 border-b border-gray-800 pb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/poly-rise-logo.png" alt="PolyRISE" className="h-10 w-auto" />
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Athlete</h1>
              <p className="font-mono text-red-400 text-sm font-bold">{code}</p>
              <Link href="/admin/athletes" className="text-xs text-gray-500 hover:text-gray-300 underline mt-0.5 block">← Back to Roster</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {athleteName && (
              <Link
                href={`/admin/athletes/new?mode=atp&name=${encodeURIComponent(athleteName)}&position=${encodeURIComponent(position)}&school=${encodeURIComponent(school)}&gradYear=${encodeURIComponent(gradYear)}`}
                className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors"
              >
                🔵 Add ATP Profile
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm mb-6">{error}</div>
        )}

        {/* Seal meta */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900 rounded-xl px-4 py-3 border border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Issued</p>
            <p className="text-sm text-gray-300">{issuedAt ? new Date(issuedAt).toLocaleDateString() : "—"}</p>
          </div>
          <div className="bg-gray-900 rounded-xl px-4 py-3 border border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Expires</p>
            {expiresAt ? (() => {
              const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000)
              return <p className={`text-sm font-semibold ${days <= 0 ? "text-red-400" : days <= 30 ? "text-yellow-400" : "text-gray-300"}`}>
                {new Date(expiresAt).toLocaleDateString()} {days <= 0 ? "(EXPIRED)" : days <= 30 ? `(${days}d left)` : ""}
              </p>
            })() : <p className="text-sm text-gray-600">—</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Athlete Info</h2>
            <Input label="Full Name" required value={athleteName} onChange={setAthleteName} placeholder="Jordan Marcus Wells" />
            <Input label="Position" value={position} onChange={setPosition} placeholder="e.g. Wide Receiver" />
            <Input label="School" value={school} onChange={setSchool} placeholder="e.g. Austin High School" />
            <Input label="Class Year" value={gradYear} onChange={setGradYear} placeholder="e.g. 2026" />
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Height</label>
              <div className="flex gap-2">
                <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="ft" min="4" max="7"
                  className="w-1/2 bg-gray-800 text-white rounded-lg px-3 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
                <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="in" min="0" max="11"
                  className="w-1/2 bg-gray-800 text-white rounded-lg px-3 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
              </div>
            </div>
            <Input label="Weight (lbs)" value={weight} onChange={setWeight} placeholder="e.g. 185" type="number" />
            <Input label="GPA" value={gpa} onChange={setGpa} placeholder="e.g. 3.8" type="number" step="0.1" />
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">PolyRISE Coach Notes</label>
              <textarea value={coachNotes} onChange={e => setCoachNotes(e.target.value)}
                placeholder="Coach scouting notes..." rows={4} maxLength={1000}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm resize-none"
              />
              <p className="text-xs text-gray-600 mt-1">{coachNotes.length}/1000</p>
            </div>
            <Input label="Hudl / Film Link" value={videoLink} onChange={setVideoLink} placeholder="https://hudl.com/v/..." />
            <Input label="Phone Number" value={phone} onChange={setPhone} placeholder="e.g. 512-555-1234" type="tel" />
            <Input label="Email Address" value={email} onChange={setEmail} placeholder="e.g. athlete@email.com" type="email" />
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">NFL Combine Metrics</h2>
            <div className="grid grid-cols-2 gap-3">
              <Input label="40-Yard Dash (sec)" value={fortyYard} onChange={setFortyYard} placeholder="e.g. 4.52" type="number" step="0.01" />
              <Input label="20-Yard Dash (sec)" value={twentyYard} onChange={setTwentyYard} placeholder="e.g. 2.75" type="number" step="0.01" />
            </div>
            <Input label="5-10-5 Shuttle (sec)" value={shuttle} onChange={setShuttle} placeholder="e.g. 4.21" type="number" step="0.01" />
            <Input label="3-Cone Drill (sec)" value={threeCone} onChange={setThreeCone} placeholder="e.g. 6.89" type="number" step="0.01" />
            <Input label="Vertical Jump (inches)" value={verticalJump} onChange={setVerticalJump} placeholder="e.g. 34" type="number" step="0.5" />
            <Input label="Broad Jump (inches)" value={broadJump} onChange={setBroadJump} placeholder="e.g. 108" type="number" step="0.5" />
            <Input label="Max Bench — 135 Bar (lbs)" value={benchPress} onChange={setBenchPress} placeholder="e.g. 185" type="number" />
          </div>

          <button
            type="submit"
            disabled={saving || !athleteName}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm tracking-wide"
          >
            {saving ? "Saving..." : saved ? "✓ Athlete Updated" : "Save Changes"}
          </button>

          {saved && (
            <p className="text-center text-green-400 text-sm">
              Changes saved.{" "}
              <a href={`/verify/${code}`} target="_blank" className="underline">View profile →</a>
            </p>
          )}
        </form>

        {/* Send profile link */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mt-6 space-y-3">
          <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Send Profile Link</h2>
          <p className="text-xs text-gray-500">Send the athlete their PR-VERIFIED profile link via text or email.</p>
          {!phone && !email && (
            <p className="text-xs text-yellow-500">Add a phone number or email above and save first.</p>
          )}
          <SendContactButtons athlete={{ code, athleteName, phone, email, position, school, gradYear, expiresAt }} />
        </div>

      </div>
    </div>
  )
}

export default function EditAthletePage() {
  return (
    <Suspense>
      <EditForm />
    </Suspense>
  )
}
