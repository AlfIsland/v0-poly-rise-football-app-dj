"use client"

import { useState } from "react"

export default function FeaturedToggle({ id, initialFeatured }: { id: string; initialFeatured: boolean }) {
  const [featured, setFeatured] = useState(initialFeatured)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/training", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "toggle-featured" }),
      })
      const data = await res.json()
      if (data.success) setFeatured(data.featured)
    } catch { /* ignore */ }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={featured ? "Remove spotlight" : "Spotlight as Athlete of the Month"}
      className={`flex items-center gap-1.5 font-semibold px-3 py-2 rounded-xl text-sm transition-colors disabled:opacity-60 ${
        featured
          ? "bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30"
          : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-yellow-400 hover:border-yellow-600"
      }`}
    >
      <svg className="w-4 h-4" fill={featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth={featured ? 0 : 1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
      {featured ? "Spotlighted" : "Spotlight"}
    </button>
  )
}
