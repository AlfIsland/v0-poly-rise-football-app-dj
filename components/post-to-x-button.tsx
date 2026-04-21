"use client"

import { useState } from "react"

export default function PostToXButton({ atpId, athleteName }: { atpId: string; athleteName: string }) {
  const [status, setStatus] = useState<"idle" | "posting" | "done" | "error">("idle")
  const [error, setError] = useState("")

  async function handlePost() {
    if (!confirm(`Post ${athleteName}'s profile to @PolyRISEFB on X?`)) return
    setStatus("posting")
    setError("")
    try {
      const res = await fetch("/api/admin/post-to-x", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ atpId }),
      }).then(r => r.json())

      if (res.success) {
        setStatus("done")
        setTimeout(() => setStatus("idle"), 5000)
      } else {
        setError(res.error || "Failed to post")
        setStatus("error")
        setTimeout(() => setStatus("idle"), 5000)
      }
    } catch {
      setError("Network error")
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  if (status === "done") return (
    <span className="text-xs bg-sky-900/60 border border-sky-700/50 text-sky-300 px-3 py-2 rounded-xl font-semibold">
      ✓ Posted to X
    </span>
  )

  if (status === "error") return (
    <span className="text-xs bg-red-900/60 border border-red-700/50 text-red-300 px-3 py-2 rounded-xl font-semibold">
      ✕ {error}
    </span>
  )

  return (
    <button
      onClick={handlePost}
      disabled={status === "posting"}
      className="bg-sky-700 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors"
    >
      {status === "posting" ? "Posting…" : "𝕏 Post to X"}
    </button>
  )
}
