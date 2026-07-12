"use client"

import { useState } from "react"

export function EliteRecruitWaitlist() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tier: "elite-recruit" }),
      })
      const data = await res.json()
      if (data.success) {
        setDone(true)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="text-center py-3 space-y-1">
        <p className="text-green-400 text-sm font-bold">You&apos;re on the list.</p>
        <p className="text-gray-400 text-xs">We&apos;ll reach out before launch with founding-member pricing.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      <p className="text-yellow-300 text-xs font-semibold text-center leading-snug">
        Launching for the 2026 season. Waitlist members get founding-member pricing.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 min-w-0 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-yellow-500 placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={loading || !email}
          className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-xs px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
        >
          {loading ? "..." : "Join the Waitlist"}
        </button>
      </form>
      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
      <p className="text-gray-600 text-xs text-center">Grades 11–12 only. Limited founding spots.</p>
    </div>
  )
}
