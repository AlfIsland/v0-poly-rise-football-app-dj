"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DeleteAthleteButton({ athleteId, athleteName, redirectAfter = false }: {
  athleteId: string
  athleteName: string
  redirectAfter?: boolean
}) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/training?id=${athleteId}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        if (redirectAfter) {
          router.push("/training")
        } else {
          router.refresh()
        }
      }
    } catch { /* ignore */ }
    setDeleting(false)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-400 font-semibold">Delete {athleteName}?</span>
        <button onClick={handleDelete} disabled={deleting}
          className="text-xs bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg transition-colors">
          {deleting ? "Deleting..." : "Yes, Delete"}
        </button>
        <button onClick={() => setConfirming(false)}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg transition-colors">
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirming(true)}
      className="text-xs bg-gray-800 hover:bg-red-900/50 border border-gray-700 hover:border-red-700/60 text-gray-500 hover:text-red-400 font-semibold px-3 py-1.5 rounded-lg transition-colors">
      Delete
    </button>
  )
}
