"use client"

import { useState } from "react"

interface Session {
  date: string
  fortyYard?: number
  twentyYard?: number
  shuttle?: number
  threeCone?: number
  verticalJump?: number
  broadJump?: number
  benchPress?: number
}

interface Athlete {
  id: string
  name: string
  age: number
  grade: string
  school: string
  position?: string
  phone?: string
  email?: string
  joinedAt: string
  sessions: Session[]
}

const METRICS = [
  { key: "fortyYard", label: "40-Yard Dash", unit: "s", lower: true },
  { key: "twentyYard", label: "20-Yard Dash", unit: "s", lower: true },
  { key: "shuttle", label: "Shuttle", unit: "s", lower: true },
  { key: "threeCone", label: "3-Cone / L-Drill", unit: "s", lower: true },
  { key: "verticalJump", label: "Vertical Jump", unit: '"', lower: false },
  { key: "broadJump", label: "Broad Jump", unit: '"', lower: false },
  { key: "benchPress", label: "Bench Press", unit: " reps", lower: false },
] as const

export default function SendTrainingReport({ athlete }: { athlete: Athlete }) {
  const [textStatus, setTextStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [textError, setTextError] = useState("")
  const [emailError, setEmailError] = useState("")

  const baseline = athlete.sessions[0]
  const current = athlete.sessions[athlete.sessions.length - 1]

  // Build metrics comparison for email
  const metricsData = METRICS.map(m => {
    const bVal = baseline?.[m.key as keyof Session] as number | undefined
    const cVal = current?.[m.key as keyof Session] as number | undefined
    if (bVal == null) return null
    const imp = cVal != null ? (m.lower ? bVal - cVal : cVal - bVal) : 0
    const sign = imp > 0 ? "+" : ""
    return {
      label: m.label,
      baseline: bVal + m.unit,
      current: cVal != null ? cVal + m.unit : "—",
      change: cVal != null ? `${sign}${m.lower ? (imp >= 0 ? `-${imp.toFixed(2)}` : `+${Math.abs(imp).toFixed(2)}`) : (imp >= 0 ? `+${imp.toFixed(1)}` : `-${Math.abs(imp).toFixed(1)}`)}${m.unit}` : "—",
      improved: imp > 0,
    }
  }).filter(Boolean)

  // Best improvement for text message
  const bestImp = metricsData.filter(m => m?.improved).sort((a, b) => 0)[0]
  const improvementLine = bestImp ? `${bestImp.label}: ${bestImp.change}` : ""

  const sendText = async () => {
    if (!athlete.phone) return
    setTextStatus("sending"); setTextError("")
    try {
      const res = await fetch("/api/training/send-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: athlete.phone,
          athleteName: athlete.name,
          id: athlete.id,
          sessionCount: athlete.sessions.length,
          improvement: improvementLine,
        }),
      })
      const data = await res.json()
      if (data.success) { setTextStatus("sent"); setTimeout(() => setTextStatus("idle"), 4000) }
      else { setTextError(data.error || "Failed"); setTextStatus("error"); setTimeout(() => setTextStatus("idle"), 5000) }
    } catch { setTextStatus("error"); setTextError("Something went wrong"); setTimeout(() => setTextStatus("idle"), 5000) }
  }

  const sendEmail = async () => {
    if (!athlete.email) return
    setEmailStatus("sending"); setEmailError("")
    try {
      const res = await fetch("/api/training/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: athlete.email,
          athleteName: athlete.name,
          id: athlete.id,
          age: athlete.age,
          grade: athlete.grade,
          school: athlete.school,
          position: athlete.position,
          sessionCount: athlete.sessions.length,
          joinedAt: athlete.joinedAt,
          metrics: metricsData,
        }),
      })
      const data = await res.json()
      if (data.success) { setEmailStatus("sent"); setTimeout(() => setEmailStatus("idle"), 4000) }
      else { setEmailError(data.error || "Failed"); setEmailStatus("error"); setTimeout(() => setEmailStatus("idle"), 5000) }
    } catch { setEmailStatus("error"); setEmailError("Something went wrong"); setTimeout(() => setEmailStatus("idle"), 5000) }
  }

  const noContact = !athlete.phone && !athlete.email

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 px-6 py-5">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Send Monthly Report</p>
      {noContact && (
        <p className="text-xs text-yellow-500 mb-3">No phone or email on file. <a href={`/training/${athlete.id}/edit`} className="underline">Add contact info →</a></p>
      )}
      <div className="flex gap-3">
        <button onClick={sendText} disabled={!athlete.phone || textStatus === "sending"}
          title={!athlete.phone ? "No phone on file" : `Text ${athlete.phone}`}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            !athlete.phone ? "bg-gray-800 text-gray-600 cursor-not-allowed" :
            textStatus === "sent" ? "bg-green-700 text-white" :
            textStatus === "error" ? "bg-red-900 text-red-300" :
            "bg-blue-700 hover:bg-blue-600 text-white"}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {textStatus === "sending" ? "Sending..." : textStatus === "sent" ? "Sent!" : textStatus === "error" ? "Failed" : "Text Report"}
        </button>

        <button onClick={sendEmail} disabled={!athlete.email || emailStatus === "sending"}
          title={!athlete.email ? "No email on file" : `Email ${athlete.email}`}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            !athlete.email ? "bg-gray-800 text-gray-600 cursor-not-allowed" :
            emailStatus === "sent" ? "bg-green-700 text-white" :
            emailStatus === "error" ? "bg-red-900 text-red-300" :
            "bg-purple-700 hover:bg-purple-600 text-white"}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {emailStatus === "sending" ? "Sending..." : emailStatus === "sent" ? "Sent!" : emailStatus === "error" ? "Failed" : "Email Report"}
        </button>
      </div>
      {textError && <p className="text-xs text-red-400 mt-2">{textError}</p>}
      {emailError && <p className="text-xs text-red-400 mt-2">{emailError}</p>}
    </div>
  )
}
