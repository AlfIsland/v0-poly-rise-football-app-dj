"use client"

import { useState } from "react"

interface Props {
  athleteId: string
  athleteName: string
  athleteEmail?: string
}

export default function InviteAthleteButton({ athleteId, athleteName, athleteEmail }: Props) {
  const [open, setOpen]       = useState(false)
  const [email, setEmail]     = useState(athleteEmail ?? "")
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState("")

  async function send() {
    if (!email.trim()) return
    setSending(true)
    setError("")
    try {
      const res = await fetch("/api/admin/invite-athlete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ athleteId, athleteName, email: email.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setSent(true)
        setTimeout(() => { setSent(false); setOpen(false) }, 3000)
      } else {
        setError(data.error ?? "Failed to send")
      }
    } catch {
      setError("Something went wrong")
    }
    setSending(false)
  }

  if (sent) {
    return (
      <span className="text-xs bg-green-900/40 border border-green-700/50 text-green-400 px-3 py-1.5 rounded-lg font-semibold">
        ✓ Invite Sent
      </span>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-purple-300 font-semibold px-3 py-1.5 rounded-lg transition-colors"
      >
        🎓 Invite Athlete
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Athlete's email"
        className="text-xs bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-1.5 focus:border-purple-500 focus:outline-none placeholder-gray-600 w-48"
        onKeyDown={e => e.key === "Enter" && send()}
        autoFocus
      />
      <button
        onClick={send}
        disabled={sending || !email.trim()}
        className="text-xs bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
      >
        {sending ? "Sending…" : "Send"}
      </button>
      <button onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:text-gray-300 px-1">✕</button>
      {error && <p className="text-xs text-red-400 w-full">{error}</p>}
    </div>
  )
}
