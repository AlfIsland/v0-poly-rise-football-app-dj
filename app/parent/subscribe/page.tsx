"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

function SubscribePage() {
  const [step, setStep] = useState<"pricing" | "register">("pricing")
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "quarterly">("monthly")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const canceled = searchParams.get("canceled")

  const handleRegisterAndCheckout = async () => {
    if (!name || !email || !password) return
    setLoading(true); setError("")
    try {
      // Register account
      const regRes = await fetch("/api/parent/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      })
      const regData = await regRes.json()
      if (!regData.success) {
        // If already exists, try logging in instead
        if (regData.error?.includes("already exists")) {
          const loginRes = await fetch("/api/parent/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })
          const loginData = await loginRes.json()
          if (!loginData.success) { setError("Account exists but password is wrong."); setLoading(false); return }
        } else {
          setError(regData.error || "Registration failed"); setLoading(false); return
        }
      }

      // Create Stripe checkout
      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      })
      const checkoutData = await checkoutRes.json()
      if (checkoutData.success && checkoutData.url) {
        window.location.href = checkoutData.url
      } else {
        setError(checkoutData.error || "Failed to start checkout")
      }
    } catch { setError("Something went wrong.") }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-center">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={160} height={60} className="object-contain" />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Athlete Progress Reports</h1>
          <p className="text-gray-400 mt-2">Track your athlete&apos;s development with monthly PolyRISE Football reports</p>
        </div>

        {canceled && (
          <div className="bg-yellow-950 border border-yellow-800 rounded-xl px-4 py-3 text-yellow-300 text-sm text-center">
            Checkout was canceled. No charge was made.
          </div>
        )}

        {step === "pricing" && (
          <div className="space-y-4">
            {/* Monthly */}
            <button onClick={() => { setSelectedPlan("monthly"); setStep("register") }}
              className="w-full bg-gray-900 hover:bg-gray-800 border-2 border-gray-700 hover:border-red-600 rounded-2xl p-6 text-left transition-all group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-bold text-xl">Monthly</p>
                  <p className="text-gray-400 text-sm mt-1">Full access · cancel anytime</p>
                  <ul className="mt-3 space-y-1.5 text-sm text-gray-300">
                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Monthly progress report</li>
                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Baseline vs current comparison</li>
                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Strengths + focus areas</li>
                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Full session history</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">$9.99</p>
                  <p className="text-gray-500 text-sm">/month</p>
                </div>
              </div>
            </button>

            {/* Quarterly */}
            <button onClick={() => { setSelectedPlan("quarterly"); setStep("register") }}
              className="w-full bg-gray-900 hover:bg-gray-800 border-2 border-red-800 hover:border-red-500 rounded-2xl p-6 text-left transition-all relative">
              <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">BEST VALUE</div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-bold text-xl">Quarterly</p>
                  <p className="text-gray-400 text-sm mt-1">3 months · save 17%</p>
                  <ul className="mt-3 space-y-1.5 text-sm text-gray-300">
                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Everything in Monthly</li>
                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Quarterly trend analysis</li>
                    <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Best value for committed athletes</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">$24.99</p>
                  <p className="text-gray-500 text-sm">/quarter</p>
                  <p className="text-green-400 text-xs">~$8.33/mo</p>
                </div>
              </div>
            </button>

            <p className="text-center text-gray-600 text-xs">
              PolyRISE Program members get access free.{" "}
              <Link href="/parent/login" className="text-red-400 underline">Already have an account?</Link>
            </p>
          </div>
        )}

        {step === "register" && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white font-bold text-lg">Create Your Account</h2>
              <span className="text-sm text-gray-400">
                {selectedPlan === "monthly" ? "$9.99/month" : "$24.99/quarter"}
                <button onClick={() => setStep("pricing")} className="ml-2 text-xs text-gray-600 hover:text-gray-400 underline">Change</button>
              </span>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Parent / Guardian name"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Phone (optional)</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(817) 555-1234"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
            </div>

            {error && <p className="text-red-400 text-sm bg-red-950 border border-red-900 rounded-lg px-3 py-2">{error}</p>}

            <button onClick={handleRegisterAndCheckout} disabled={!name || !email || !password || loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm">
              {loading ? "Setting up..." : `Continue to Payment →`}
            </button>
            <p className="text-xs text-gray-600 text-center">Secure payment powered by Stripe. Cancel anytime.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SubscribePageWrapper() {
  return <Suspense><SubscribePage /></Suspense>
}
