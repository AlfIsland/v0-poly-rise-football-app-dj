"use client"

import { useState } from "react"

export default function SubscriptionToggle({ id, initialValue }: { id: string; initialValue: boolean }) {
  const [active, setActive] = useState(initialValue)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/training", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "toggle-subscription" }),
      })
      const data = await res.json()
      if (data.success) setActive(data.hasSubscription)
    } catch { /* ignore */ }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={active ? "Remove subscription" : "Mark as subscribed"}
      className={`flex items-center gap-1.5 font-semibold px-3 py-2 rounded-xl text-xs transition-colors disabled:opacity-60 ${
        active
          ? "bg-emerald-900/40 border border-emerald-700/60 text-emerald-400 hover:bg-emerald-900/60"
          : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-emerald-400 hover:border-emerald-700"
      }`}
    >
      {active ? "✓ Subscribed" : "No Sub"}
    </button>
  )
}
