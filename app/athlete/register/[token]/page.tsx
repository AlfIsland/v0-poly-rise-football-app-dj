"use client"

import { useState, FormEvent } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"

export default function AthleteRegisterPage() {
  const router = useRouter()
  const params = useParams()
  const token  = params.token as string

  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [confirm,  setConfirm]  = useState("")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError("Passwords don't match"); return }
    if (password.length < 6)  { setError("Password must be at least 6 characters"); return }
    setLoading(true)
    setError("")
    try {
      const res  = await fetch("/api/athlete/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email: email.trim().toLowerCase(), password }),
      })
      const data = await res.json()
      if (data.success) {
        router.push(`/athlete/${data.athleteId}`)
      } else {
        setError(data.error ?? "Registration failed")
      }
    } catch {
      setError("Something went wrong. Try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/poly-rise-logo.png" alt="PolyRISE" width={56} height={56} className="object-contain mb-3" />
          <h1 className="text-xl font-black text-white">Create Your Account</h1>
          <p className="text-sm text-gray-500 mt-1">Your coach has set up your PolyRISE profile</p>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
          <div className="bg-purple-950/40 border border-purple-700/40 rounded-xl px-4 py-3">
            <p className="text-xs text-purple-300 font-semibold">You&apos;re one step away from accessing your recruiting profile, metrics, and more.</p>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 border border-gray-700 focus:border-purple-500 focus:outline-none placeholder-gray-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Create Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              autoComplete="new-password"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 border border-gray-700 focus:border-purple-500 focus:outline-none placeholder-gray-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 border border-gray-700 focus:border-purple-500 focus:outline-none placeholder-gray-600 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email || !password || !confirm}
            className="w-full bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-black rounded-xl py-3 transition-colors text-sm tracking-wide"
          >
            {loading ? "Creating account…" : "Create Account & View My Profile"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/athlete/login" className="text-purple-400 hover:text-purple-300 underline">Sign in</a>
        </p>
      </div>
    </div>
  )
}
