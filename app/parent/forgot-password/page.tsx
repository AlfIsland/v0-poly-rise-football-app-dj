"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!email) return
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/parent/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) setSent(true)
      else setError(data.error || "Something went wrong")
    } catch { setError("Something went wrong.") }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={160} height={60} className="object-contain" />
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="bg-red-700 px-6 py-4">
            <h1 className="text-white font-bold text-lg">Forgot Password</h1>
            <p className="text-red-200 text-xs">We&apos;ll send a reset link to your email</p>
          </div>

          {sent ? (
            <div className="px-6 py-8 text-center space-y-3">
              <p className="text-green-400 font-semibold">✓ Check your email</p>
              <p className="text-gray-400 text-sm">If an account exists for <span className="text-white">{email}</span>, a reset link has been sent.</p>
              <p className="text-gray-600 text-xs">Didn&apos;t get it? Check your spam folder or call (817) 658-3300.</p>
              <Link href="/parent/login" className="block text-red-400 underline text-sm mt-2">Back to login</Link>
            </div>
          ) : (
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
              </div>
              {error && <p className="text-red-400 text-sm bg-red-950 border border-red-900 rounded-lg px-3 py-2">{error}</p>}
              <button onClick={handleSubmit} disabled={!email || loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <p className="text-center">
                <Link href="/parent/login" className="text-gray-600 hover:text-gray-400 text-xs underline">Back to login</Link>
              </p>
            </div>
          )}
        </div>
        <p className="text-center text-gray-700 text-xs">PolyRISE Football · (817) 658-3300</p>
      </div>
    </div>
  )
}
