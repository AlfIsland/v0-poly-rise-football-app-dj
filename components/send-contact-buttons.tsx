"use client"

import { useState } from "react"

interface Props {
  athlete: {
    code: string
    athleteName: string
    phone?: string
    email?: string
    position?: string
    school?: string
    gradYear?: string
    expiresAt?: string
  }
}

export default function SendContactButtons({ athlete }: Props) {
  const [textStatus, setTextStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [textError, setTextError] = useState("")
  const [emailError, setEmailError] = useState("")

  const sendText = async () => {
    if (!athlete.phone) return
    setTextStatus("sending")
    setTextError("")
    try {
      const res = await fetch("/api/send-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: athlete.phone,
          athleteName: athlete.athleteName,
          code: athlete.code,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setTextStatus("sent")
        setTimeout(() => setTextStatus("idle"), 4000)
      } else {
        setTextError(data.error || "Failed to send")
        setTextStatus("error")
        setTimeout(() => setTextStatus("idle"), 5000)
      }
    } catch {
      setTextStatus("error")
      setTextError("Something went wrong")
      setTimeout(() => setTextStatus("idle"), 5000)
    }
  }

  const sendEmail = async () => {
    if (!athlete.email) return
    setEmailStatus("sending")
    setEmailError("")
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: athlete.email,
          athleteName: athlete.athleteName,
          code: athlete.code,
          position: athlete.position,
          school: athlete.school,
          gradYear: athlete.gradYear,
          expiresAt: athlete.expiresAt,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setEmailStatus("sent")
        setTimeout(() => setEmailStatus("idle"), 4000)
      } else {
        setEmailError(data.error || "Failed to send")
        setEmailStatus("error")
        setTimeout(() => setEmailStatus("idle"), 5000)
      }
    } catch {
      setEmailStatus("error")
      setEmailError("Something went wrong")
      setTimeout(() => setEmailStatus("idle"), 5000)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Text button */}
      <button
        onClick={sendText}
        disabled={!athlete.phone || textStatus === "sending"}
        title={!athlete.phone ? "No phone number on file" : `Text ${athlete.phone}`}
        className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          !athlete.phone ? "bg-gray-800 text-gray-600 cursor-not-allowed" :
          textStatus === "sent" ? "bg-green-700 text-white" :
          textStatus === "error" ? "bg-red-900 text-red-300" :
          "bg-blue-700 hover:bg-blue-600 text-white"
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        {textStatus === "sending" ? "Sending..." : textStatus === "sent" ? "Sent!" : textStatus === "error" ? "Failed" : "Text"}
      </button>
      {textStatus === "error" && textError && (
        <p className="text-xs text-red-400">{textError}</p>
      )}

      {/* Email button */}
      <button
        onClick={sendEmail}
        disabled={!athlete.email || emailStatus === "sending"}
        title={!athlete.email ? "No email on file" : `Email ${athlete.email}`}
        className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          !athlete.email ? "bg-gray-800 text-gray-600 cursor-not-allowed" :
          emailStatus === "sent" ? "bg-green-700 text-white" :
          emailStatus === "error" ? "bg-red-900 text-red-300" :
          "bg-purple-700 hover:bg-purple-600 text-white"
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {emailStatus === "sending" ? "Sending..." : emailStatus === "sent" ? "Sent!" : emailStatus === "error" ? "Failed" : "Email"}
      </button>
      {emailStatus === "error" && emailError && (
        <p className="text-xs text-red-400">{emailError}</p>
      )}
    </div>
  )
}
