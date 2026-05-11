"use client"

import { useState, FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const from         = searchParams.get("from") ?? "/athlete/portal"

  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res  = await fetch("/api/athlete/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const data = await res.json()
      if (data.success) {
        router.refresh()
        router.push(from)
      } else {
        setError(data.error ?? "Login failed")
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
          <h1 className="text-xl font-black text-white">Athlete Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your PolyRISE profile</p>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Email</label>
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
            <label className="block text-sm text-gray-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 border border-gray-700 focus:border-purple-500 focus:outline-none placeholder-gray-600 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-black rounded-xl py-3 transition-colors text-sm tracking-wide"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <span className="text-gray-400">Check your email for an invite from your coach.</span>
        </p>
        <p className="text-center mt-4">
          <Link href="/" className="text-xs text-gray-700 hover:text-gray-500 underline">← Back to PolyRISE</Link>
        </p>
      </div>
    </div>
  )
}

export default function AthleteLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
