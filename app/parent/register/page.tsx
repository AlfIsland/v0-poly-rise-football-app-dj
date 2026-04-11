"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function ParentRegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [phone, setPhone] = useState("")
  const [athleteName, setAthleteName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError("Passwords do not match."); return }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return }
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/parent/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, athleteName }),
      })
      const data = await res.json()
      if (data.success) {
        router.push("/parent/portal")
      } else {
        setError(data.error || "Registration failed.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={160} height={60} className="object-contain" />
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="bg-red-700 px-6 py-4">
            <h1 className="text-white font-bold text-lg">Create Parent Account</h1>
            <p className="text-red-200 text-xs">Sign up to access your athlete&apos;s progress portal</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="Parent / Guardian name"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Athlete&apos;s Name</label>
              <input value={athleteName} onChange={e => setAthleteName(e.target.value)} placeholder="Your athlete's full name"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Email <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="your@email.com"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Phone (optional)</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(817) 555-1234"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Password <span className="text-red-500">*</span></label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" placeholder="At least 6 characters"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" placeholder="Re-enter password"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
            </div>

            {error && <p className="text-red-400 text-sm bg-red-950 border border-red-900 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={!name || !email || !password || !confirm || loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm">
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link href="/parent/login" className="text-red-400 hover:text-red-300 underline">Sign in</Link>
            </p>
          </form>
        </div>

        <p className="text-center text-gray-700 text-xs">PolyRISE Football · Austin, TX</p>
      </div>
    </div>
  )
}
