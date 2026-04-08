"use client"

import { useState, FormEvent, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/parent/portal"

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/parent/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) { router.push(from); router.refresh() }
      else setError(data.error || "Login failed")
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
            <h1 className="text-white font-bold text-lg">Parent Portal</h1>
            <p className="text-red-200 text-xs">Sign in to view your athlete&apos;s progress</p>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                placeholder="your@email.com"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                placeholder="Your password"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
            </div>
            {error && <p className="text-red-400 text-sm bg-red-950 border border-red-900 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading || !email || !password}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm">
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <p className="text-center text-gray-500 text-xs">
              Don&apos;t have an account?{" "}
              <Link href="/parent/subscribe" className="text-red-400 hover:text-red-300 underline">Subscribe here</Link>
            </p>
          </form>
        </div>
        <p className="text-center text-gray-700 text-xs">PolyRISE Football · Austin, TX</p>
      </div>
    </div>
  )
}

export default function ParentLoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
