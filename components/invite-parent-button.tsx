"use client"

import { useState } from "react"

export default function InviteParentButton({ athleteId, athleteName }: { athleteId: string; athleteName: string }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [parentName, setParentName] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSend = async () => {
    if (!email) return
    setSending(true); setError("")
    try {
      const res = await fetch("/api/admin/invite-parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, parentName, athleteId, athleteName }),
      }).then(r => r.json())
      if (res.success) { setSent(true); setTimeout(() => { setSent(false); setOpen(false); setEmail(""); setParentName("") }, 3000) }
      else setError(res.error || "Failed to send")
    } catch { setError("Something went wrong.") }
    setSending(false)
  }

  if (sent) return (
    <span className="text-xs bg-green-800 text-green-300 px-3 py-2 rounded-xl font-semibold">✓ Invite Sent</span>
  )

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors">
      📧 Invite Parent
    </button>
  )

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <input value={parentName} onChange={e => setParentName(e.target.value)} placeholder="Parent name"
        className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none w-32 placeholder-gray-500" />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Parent email"
        className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none w-44 placeholder-gray-500" />
      <button onClick={handleSend} disabled={!email || sending}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold px-3 py-2 rounded-lg">
        {sending ? "Sending..." : "Send Invite"}
      </button>
      <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-300 text-xs">✕</button>
      {error && <p className="text-red-400 text-xs w-full">{error}</p>}
    </div>
  )
}
