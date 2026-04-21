"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

type Step = "plan" | "account"
type Plan = "passport" | "recruit" | "elite-recruit" | "free"

interface PlanOption {
  id: Plan
  name: string
  price: string
  period: string
  badge: string | null
  badgeColor: string
  borderSelected: string
  borderUnselected: string
  radioSelected: string
  dot: string
  group: string
  groupColor: string
  tagline: string
  features: string[]
}

const PLANS: PlanOption[] = [
  {
    id: "elite-recruit" as Plan,
    name: "Elite Recruit",
    price: "$49.99",
    period: "/month",
    badge: "MOST POPULAR",
    badgeColor: "bg-yellow-500",
    borderSelected: "border-yellow-500",
    borderUnselected: "border-gray-700",
    radioSelected: "border-yellow-500",
    dot: "bg-yellow-500",
    group: "High School Athletes",
    groupColor: "bg-yellow-900/60 text-yellow-300 border-yellow-700/50",
    tagline: "Full recruiting exposure + player development",
    features: [
      "Everything in Recruit",
      "Quarterly Kevin Garrett development report",
      "College program fit suggestions",
      "Prospect ranking by position & grade",
      "Early access to all PolyRISE camps & events",
      "Kevin Garrett (Former NFL) — Dir. of Player Dev",
    ],
  },
  {
    id: "recruit" as Plan,
    name: "Recruit",
    price: "$29.99",
    period: "/month",
    badge: null,
    badgeColor: "",
    borderSelected: "border-red-500",
    borderUnselected: "border-gray-700",
    radioSelected: "border-red-500",
    dot: "bg-red-500",
    group: "High School Athletes",
    groupColor: "bg-red-900/60 text-red-300 border-red-700/50",
    tagline: "Verified metrics + recruiting profile + visibility",
    features: [
      "Full athlete metrics tracking",
      "PR-VERIFIED seal on profile",
      "Shareable recruiting profile page",
      "Hudl film linked to profile",
      "Monthly X spotlight to college recruiters",
      "1 Free Combine Camp/Month",
    ],
  },
  {
    id: "passport" as Plan,
    name: "Passport",
    price: "$9.99",
    period: "/month",
    badge: null,
    badgeColor: "",
    borderSelected: "border-gray-400",
    borderUnselected: "border-gray-700",
    radioSelected: "border-gray-400",
    dot: "bg-gray-400",
    group: "Middle School & Younger",
    groupColor: "bg-blue-900/60 text-blue-300 border-blue-700/50",
    tagline: "Track your athlete's progress",
    features: [
      "Monthly progress reports & charts",
      "Full session history",
      "Baseline vs. current comparisons",
      "Downloadable PDF reports",
    ],
  },
]

function planLabel(plan: Plan) {
  if (plan === "elite-recruit") return "Elite Recruit · $49.99/mo"
  if (plan === "recruit") return "Recruit · $29.99/mo"
  if (plan === "passport") return "Passport · $9.99/mo"
  return "Program Member · Free"
}

export default function ParentRegisterPage() {
  const [step, setStep] = useState<Step>("plan")
  const [plan, setPlan] = useState<Plan>("recruit")

  const [name, setName] = useState("")
  const [athleteName, setAthleteName] = useState("")
  const [athleteId, setAthleteId] = useState("")
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
      const regRes = await fetch("/api/parent/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, athleteName, athleteId, plan }),
      })
      const regData = await regRes.json()

      if (!regData.success && !regData.error?.includes("already exists")) {
        setError(regData.error || "Registration failed."); setLoading(false); return
      }

      if (regData.error?.includes("already exists")) {
        const loginRes = await fetch("/api/parent/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        const loginData = await loginRes.json()
        if (!loginData.success) { setError("Account exists but password is incorrect."); setLoading(false); return }
      }

      if (plan === "free") {
        router.push("/parent/portal"); return
      }

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

        <div className="flex justify-center">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={160} height={60} className="object-contain" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-white">Get Recruited. Get Verified. Get Noticed.</h1>
          <p className="text-gray-400 text-sm">PolyRISE Football · Player Development & Recruiting</p>
          <div className="pt-1">
            <p className="text-white font-bold text-sm">Built for Every Athlete. Trusted by Coaches.</p>
            <p className="text-gray-500 text-xs mt-1">Football · Soccer · Track & Field · Basketball · Baseball · and more</p>
          </div>
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

            {/* Kevin Garrett banner */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-yellow-600/30 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-yellow-700 flex items-center justify-center text-white font-black text-sm shrink-0">KG</div>
              <div>
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Player Development</p>
                <p className="text-white text-sm font-semibold">Kevin Garrett · Former NFL · Director of Player Development</p>
              </div>
            </div>

            {PLANS.map(p => (
              <button key={p.id} onClick={() => setPlan(p.id)}
                className={`w-full rounded-2xl p-5 text-left transition-all border-2 relative ${plan === p.id ? p.borderSelected + " bg-gray-900" : p.borderUnselected + " bg-gray-900 hover:border-gray-500"}`}>
                {p.badge && (
                  <span className={`absolute top-3 right-3 ${p.badgeColor} text-white text-xs font-black px-2 py-0.5 rounded-full`}>{p.badge}</span>
                )}
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${plan === p.id ? p.radioSelected : "border-gray-600"}`}>
                        {plan === p.id && <div className={`w-2 h-2 rounded-full ${p.dot}`} />}
                      </div>
                      <p className="text-white font-bold">{p.name}</p>
                      {p.group && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${p.groupColor}`}>
                          {p.group}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs ml-6 mb-2">{p.tagline}</p>
                    {p.features.length > 0 && (
                      <ul className="ml-6 space-y-1">
                        {p.features.map(f => (
                          <li key={f} className="flex items-start gap-1.5 text-xs text-gray-300">
                            <span className="text-green-400 mt-0.5 shrink-0">✓</span> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-black text-white">{p.price}</p>
                    {p.period && <p className="text-gray-500 text-xs">{p.period}</p>}
                  </div>
                </div>
              </button>
            ))}

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
                <p className="text-white font-bold text-sm">{planLabel(plan)}</p>
                <button onClick={() => setStep("plan")} className="text-xs text-gray-500 hover:text-gray-300 underline">Change plan</button>
              </div>
              {plan === "elite-recruit" && <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full font-black">MOST POPULAR</span>}
              {plan === "recruit" && <span className="text-xs bg-red-700 text-white px-2 py-0.5 rounded-full font-bold">RECRUIT</span>}
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
                <label className="block text-sm text-gray-300 mb-1.5">Athlete ID <span className="text-gray-500 text-xs">(optional — e.g. TRN-0042)</span></label>
                <input value={athleteId} onChange={e => setAthleteId(e.target.value.toUpperCase())} placeholder="TRN-XXXX"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm font-mono" />
                <p className="text-xs text-gray-600 mt-1">Find this on your athlete&apos;s training profile or ask your coach</p>
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
