"use client"

import { useState } from "react"

export default function ProfileVisibilityToggle({ id, initialPublic }: { id: string; initialPublic: boolean }) {
  const [isPublic, setIsPublic] = useState(initialPublic)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/training", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "toggle-public" }),
      })
      const data = await res.json()
      if (data.success) setIsPublic(data.profilePublic)
    } catch { /* ignore */ }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={isPublic ? "Make profile private" : "Make profile public"}
      className={`flex items-center gap-1.5 font-semibold px-3 py-2 rounded-xl text-xs transition-colors disabled:opacity-60 ${
        isPublic
          ? "bg-green-900/40 border border-green-700/60 text-green-400 hover:bg-green-900/60"
          : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-green-400 hover:border-green-700"
      }`}
    >
      {isPublic ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Public
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Private
        </>
      )}
    </button>
  )
}
