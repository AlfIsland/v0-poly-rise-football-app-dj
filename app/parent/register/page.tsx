"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

type Step = "plan" | "account"
type Plan = "monthly" | "quarterly" | "free"

export default function ParentRegisterPage() {
  const [step, setStep] = useState<Step>("plan")
  const [plan, setPlan] = useState<Plan>("monthly")

  const [name, setName] = useState("")
  const [athleteName, setAthleteName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleContinue = async () => {
    if (password !== confirm) { setError("Passwords do not match."); return }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return }
    setLoading(true); setError("")

    try {
      // Register account
      const regRes = await fetch("/api/parent/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, athleteName, plan }),
      })
      const regData = await regRes.json()

      if (!regData.success && !regData.error?.includes("already exists")) {
        setError(regData.error || "Registration failed."); setLoading(false); return
      }

      // If account already exists, log them in
      if (regData.error?.includes("already exists")) {
        const loginRes = await fetch("/api/parent/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        const loginData = await loginRes.json()
        if (!loginData.success) { setError("Account exists but password is incorrect."); setLoading(false); return }
      }

      // Free/program tier — go straight to portal
      if (plan === "free") {
        router.push("/parent/portal"); return
      }

      // Paid plan — go to Stripe checkout
      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const checkoutData = await checkoutRes.json()
      if (checkoutData.success && checkoutData.url) {
        window.location.href = checkoutData.url
      } else {
        setError(checkoutData.error || "Failed to start checkout.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Logo */}
        <div className="flex justify-center">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={160} height={60} className="object-contain" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-black text-white">Athlete Tracking Passport</h1>
          <p className="text-gray-400 text-sm mt-1">Create your parent account to track your athlete&apos;s progress</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 justify-center">
          {(["plan", "account"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s ? "bg-red-600 text-white" : i < ["plan","account"].indexOf(step) ? "bg-green-600 text-white" : "bg-gray-700 text-gray-400"
              }`}>
                {i < ["plan","account"].indexOf(step) ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-medium ${step === s ? "text-white" : "text-gray-500"}`}>
                {s === "plan" ? "Choose Plan" : "Create Account"}
              </span>
              {i < 1 && <div className="w-8 h-0.5 bg-gray-700 mx-1" />}
            </div>
          ))}
        </div>

        {/* ── Step 1: Choose Plan ── */}
        {step === "plan" && (
          <div className="space-y-3">
            {/* Monthly */}
            <button onClick={() => setPlan("monthly")}
              className={`w-full rounded-2xl p-5 text-left transition-all border-2 ${plan === "monthly" ? "border-red-500 bg-gray-900" : "border-gray-700 bg-gray-900 hover:border-gray-500"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${plan === "monthly" ? "border-red-500" : "border-gray-600"}`}>
                      {plan === "monthly" && <div className="w-2 h-2 rounded-full bg-red-500" />}
                    </div>
                    <p className="text-white font-bold">Monthly</p>
                  </div>
                  <p className="text-gray-400 text-xs ml-6">Full access · cancel anytime</p>
                  <ul className="mt-2 ml-6 space-y-1 text-xs text-gray-300">
                    <li className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Progress reports & charts</li>
                    <li className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Full session history</li>
                    <li className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Downloadable PDF reports</li>
                  </ul>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-2xl font-black text-white">$9.99</p>
                  <p className="text-gray-500 text-xs">/month</p>
                </div>
              </div>
            </button>

            {/* Quarterly */}
            <button onClick={() => setPlan("quarterly")}
              className={`w-full rounded-2xl p-5 text-left transition-all border-2 relative ${plan === "quarterly" ? "border-red-500 bg-gray-900" : "border-gray-700 bg-gray-900 hover:border-gray-500"}`}>
              <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">BEST VALUE</div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${plan === "quarterly" ? "border-red-500" : "border-gray-600"}`}>
                      {plan === "quarterly" && <div className="w-2 h-2 rounded-full bg-red-500" />}
                    </div>
                    <p className="text-white font-bold">Quarterly</p>
                  </div>
                  <p className="text-gray-400 text-xs ml-6">3 months · save 17%</p>
                  <ul className="mt-2 ml-6 space-y-1 text-xs text-gray-300">
                    <li className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Everything in Monthly</li>
                    <li className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Quarterly trend analysis</li>
                  </ul>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-2xl font-black text-white">$24.99</p>
                  <p className="text-gray-500 text-xs">/quarter</p>
                  <p className="text-green-400 text-xs">~$8.33/mo</p>
                </div>
              </div>
            </button>

            {/* Program member */}
            <button onClick={() => setPlan("free")}
              className={`w-full rounded-2xl p-4 text-left transition-all border-2 ${plan === "free" ? "border-blue-500 bg-gray-900" : "border-gray-700 bg-gray-900 hover:border-gray-500"}`}>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${plan === "free" ? "border-blue-500" : "border-gray-600"}`}>
                  {plan === "free" && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">PolyRISE Program Member</p>
                  <p className="text-gray-400 text-xs">Access included with your program enrollment</p>
                </div>
              </div>
            </button>

            <button onClick={() => setStep("account")}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-3 transition-colors text-sm mt-2">
              Continue →
            </button>

            <p className="text-center text-xs text-gray-600">
              Already have an account?{" "}
              <Link href="/parent/login" className="text-red-400 hover:text-red-300 underline">Sign in</Link>
            </p>
          </div>
        )}

        {/* ── Step 2: Create Account ── */}
        {step === "account" && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="bg-gray-800 px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">
                  {plan === "monthly" ? "Monthly · $9.99/mo" : plan === "quarterly" ? "Quarterly · $24.99/quarter" : "Program Member · Free"}
                </p>
                <button onClick={() => setStep("plan")} className="text-xs text-gray-500 hover:text-gray-300 underline">Change plan</button>
              </div>
              {plan !== "free" && <span className="text-xs bg-red-700 text-white px-2 py-0.5 rounded-full font-bold">
                {plan === "quarterly" ? "BEST VALUE" : "MONTHLY"}
              </span>}
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Your Full Name <span className="text-red-500">*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Parent / Guardian name"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Athlete&apos;s Name</label>
                <input value={athleteName} onChange={e => setAthleteName(e.target.value)} placeholder="Your athlete's full name"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Email <span className="text-red-500">*</span></label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" placeholder="your@email.com"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Phone (optional)</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(817) 555-1234"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Password <span className="text-red-500">*</span></label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 6 characters"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" placeholder="Re-enter password"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm" />
              </div>

              {error && <p className="text-red-400 text-sm bg-red-950 border border-red-900 rounded-lg px-3 py-2">{error}</p>}

              <button onClick={handleContinue} disabled={!name || !email || !password || !confirm || loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm">
                {loading ? "Setting up..." : plan === "free" ? "Create Account →" : "Continue to Payment →"}
              </button>

              <p className="text-center text-xs text-gray-600">
                {plan !== "free" && "Secure payment powered by Stripe. Cancel anytime. · "}
                Already have an account?{" "}
                <Link href="/parent/login" className="text-red-400 hover:text-red-300 underline">Sign in</Link>
              </p>
            </div>
          </div>
        )}

        <p className="text-center text-gray-700 text-xs">PolyRISE Football · (817) 658-3300 · polyrisefootball.com</p>
      </div>
    </div>
  )
}
