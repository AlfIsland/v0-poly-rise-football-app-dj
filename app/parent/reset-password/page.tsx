"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const handleSubmit = async () => {
    if (!password || !confirm) return
    if (password !== confirm) { setError("Passwords don't match"); return }
    if (!token) { setError("Invalid reset link"); return }
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/parent/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (data.success) {
        setDone(true)
        setTimeout(() => router.push("/parent/login"), 2500)
      } else {
        setError(data.error || "Something went wrong")
      }
    } catch { setError("Something went wrong.") }
    setLoading(false)
  }

  if (!token) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center space-y-3">
        <p className="text-red-400">Invalid or missing reset link.</p>
        <Link href="/parent/login" className="text-gray-400 underline text-sm">Back to login</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={160} height={60} className="object-contain" />
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="bg-red-700 px-6 py-4">
            <h1 className="text-white font-bold text-lg">Set New Password</h1>
            <p className="text-red-200 text-xs">Choose a new password for your account</p>
          </div>

          {done ? (
            <div className="px-6 py-8 text-center space-y-2">
              <p className="text-green-400 font-semibold">✓ Password updated!</p>
              <p className="text-gray-500 text-sm">Redirecting to login...</p>
            </div>
          ) : (
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">New Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Confirm Password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
              </div>
              {error && <p className="text-red-400 text-sm bg-red-950 border border-red-900 rounded-lg px-3 py-2">{error}</p>}
              <button onClick={handleSubmit} disabled={!password || !confirm || loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm">
                {loading ? "Saving..." : "Set New Password"}
              </button>
              <p className="text-center">
                <Link href="/parent/login" className="text-gray-600 hover:text-gray-400 text-xs underline">Back to login</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPageWrapper() {
  return <Suspense><ResetPasswordPage /></Suspense>
}
