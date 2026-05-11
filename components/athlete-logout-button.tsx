"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AthleteLogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await fetch("/api/athlete/auth", { method: "DELETE" })
    router.refresh()
    router.push("/athlete/login")
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? "Signing out…" : "Sign Out"}
    </button>
  )
}
