"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DeleteSessionButton({
  athleteId, sessionIndex, sessionDate
}: {
  athleteId: string
  sessionIndex: number
  sessionDate: string
}) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const label = sessionIndex === 0 ? "Baseline" : `Session #${sessionIndex + 1}`
  const date = new Date(sessionDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })

  async function handleDelete() {
    setDeleting(true)
    try {
      await fetch("/api/training", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: athleteId, action: "delete-session", sessionIndex }),
      })
      router.refresh()
    } catch { /* ignore */ }
    setDeleting(false)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <span className="text-xs text-red-400 font-semibold whitespace-nowrap">Delete {label} ({date})?</span>
        <button onClick={handleDelete} disabled={deleting}
          className="text-xs bg-red-700 hover:bg-red-600 text-white px-2 py-1 rounded-lg disabled:opacity-50">
          {deleting ? "..." : "Yes"}
        </button>
        <button onClick={() => setConfirming(false)}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded-lg">
          No
        </button>
      </span>
    )
  }

  return (
    <button onClick={() => setConfirming(true)}
      className="text-xs bg-red-900/50 hover:bg-red-800 text-red-400 hover:text-red-200 px-2.5 py-1 rounded-lg transition-colors">
      Delete
    </button>
  )
}
