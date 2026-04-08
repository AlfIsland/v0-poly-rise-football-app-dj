"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

const PROGRAMS_DATA: Record<string, { name: string; price: number; priceLabel: string; billing: "one_time" | "monthly" }> = {
  "player-dev":           { name: "Player Development",                    price: 350, priceLabel: "$350/mo",  billing: "monthly" },
  "elite-360":            { name: "360 Elite",                             price: 500, priceLabel: "$500/mo",  billing: "monthly" },
  "girls-dev":            { name: "Girls Player Development",              price: 250, priceLabel: "$250/mo",  billing: "monthly" },
  "summer-k5":            { name: "Summer Camp — Elementary (K-5)",        price: 265, priceLabel: "$265",      billing: "one_time" },
  "summer-ms":            { name: "Summer Camp — Middle School",           price: 265, priceLabel: "$265",      billing: "one_time" },
  "summer-hs":            { name: "Summer Camp — High School",             price: 265, priceLabel: "$265",      billing: "one_time" },
  "combine":              { name: "PR-VERIFIED Combine Camp",              price: 50,  priceLabel: "$50",       billing: "one_time" },
  "hike":                 { name: "Leadership Hike",                       price: 25,  priceLabel: "$25",       billing: "one_time" },
  "tournament-ms":        { name: "Football Tournament (Middle School)",   price: 400, priceLabel: "$400",      billing: "one_time" },
  "tournament-hs":        { name: "Football Tournament (High School)",     price: 425, priceLabel: "$425",      billing: "one_time" },
  "exposure-basic-3":     { name: "Basic Exposure — 3 Months",            price: 165, priceLabel: "$165",      billing: "one_time" },
  "exposure-basic-6":     { name: "Basic Exposure — 6 Months",            price: 330, priceLabel: "$330",      billing: "one_time" },
  "exposure-basic-12":    { name: "Basic Exposure — 12 Months",           price: 660, priceLabel: "$660",      billing: "one_time" },
  "exposure-enhanced-3":  { name: "Enhanced Exposure — 3 Months",         price: 225, priceLabel: "$225",      billing: "one_time" },
  "exposure-enhanced-6":  { name: "Enhanced Exposure — 6 Months",         price: 450, priceLabel: "$450",      billing: "one_time" },
  "exposure-enhanced-12": { name: "Enhanced Exposure — 12 Months",        price: 900, priceLabel: "$900",      billing: "one_time" },
}

const CATEGORIES = [
  {
    label: "Training Programs", badge: "bg-red-900 text-red-300", color: "border-red-800 hover:border-red-500",
    programs: [
      { id: "player-dev", desc: "16 sessions/month · SAQ, S&C, football drills, tournament entries, film study & quarterly character events" },
      { id: "elite-360",  desc: "Everything in Player Development + 1-on-1 NFL coaching, recruiting profile & 7 college email blasts/month", highlight: "BEST" },
      { id: "girls-dev",  desc: "May: Mon & Fri 5–6:30pm · June–July: Mon & Fri 1–2:30pm" },
    ],
  },
  {
    label: "Summer Camps", badge: "bg-blue-900 text-blue-300", color: "border-blue-800 hover:border-blue-500",
    programs: [
      { id: "summer-k5", desc: "June–July · Mon–Thu · Limited to 20 participants per session" },
      { id: "summer-ms", desc: "June–July · Mon–Thu · Limited to 20 participants per session" },
      { id: "summer-hs", desc: "June–July · Mon–Thu · Limited to 20 participants per session" },
    ],
  },
  {
    label: "Events", badge: "bg-green-900 text-green-300", color: "border-green-800 hover:border-green-500",
    programs: [
      { id: "combine",       desc: "40-yard dash, vertical jump, 3-cone drill & position-specific evaluations" },
      { id: "tournament-ms", desc: "May 29–30 · 8–10 team bracket · Minimum 3 games guaranteed" },
      { id: "tournament-hs", desc: "May 29–30 · 8–10 team bracket · Minimum 3 games guaranteed" },
      { id: "hike",          desc: "2201 Barton Springs Rd, Austin · Military character building event" },
    ],
  },
  {
    label: "Recruiting Exposure", badge: "bg-purple-900 text-purple-300", color: "border-purple-800 hover:border-purple-500",
    programs: [
      { id: "exposure-basic-3",     desc: "Professional player profile + 5 monthly college outreach emails" },
      { id: "exposure-basic-6",     desc: "Professional player profile + 5 monthly college outreach emails · Save 17%" },
      { id: "exposure-basic-12",    desc: "Professional player profile + 5 monthly college outreach emails · Best value" },
      { id: "exposure-enhanced-3",  desc: "Professional profile + 10 monthly college contact emails", highlight: "POPULAR" },
      { id: "exposure-enhanced-6",  desc: "Professional profile + 10 monthly college contact emails · Save 17%" },
      { id: "exposure-enhanced-12", desc: "Professional profile + 10 monthly college contact emails · Best value" },
    ],
  },
]

const POSITIONS = ["QB", "WR", "RB", "TE", "OL", "DL", "LB", "CB", "S", "K/P", "ATH"]
const GRADES = ["K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"]

function RegisterPage() {
  const [cart, setCart] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [playerName, setPlayerName] = useState("")
  const [playerAge, setPlayerAge] = useState("")
  const [playerGrade, setPlayerGrade] = useState("")
  const [playerSchool, setPlayerSchool] = useState("")
  const [playerPosition, setPlayerPosition] = useState("")
  const [parentName, setParentName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const searchParams = useSearchParams()
  const canceled = searchParams.get("canceled")

  const addToCart = (id: string) => {
    if (!cart.includes(id)) setCart(prev => [...prev, id])
    setShowForm(true)
    setTimeout(() => document.getElementById("cart-section")?.scrollIntoView({ behavior: "smooth" }), 50)
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i !== id))
  }

  const cartTotal = cart.reduce((sum, id) => sum + (PROGRAMS_DATA[id]?.price ?? 0), 0)
  const hasMonthly = cart.some(id => PROGRAMS_DATA[id]?.billing === "monthly")

  const handleCheckout = async () => {
    if (!cart.length || !playerName || !parentName || !email || !phone) return
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/register/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programIds: cart, playerName, playerAge, playerGrade, playerSchool, playerPosition, parentName, email, phone }),
      })
      const data = await res.json()
      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Something went wrong")
      }
    } catch { setError("Something went wrong.") }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={60} height={60} className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white">Register for Programs</h1>
          <p className="text-gray-400">Add one or more programs to your cart, then check out together.</p>
          <p className="text-gray-600 text-sm">Questions? Call (817) 658-3300 · polyrise@polyrisefootball.com</p>
        </div>

        {canceled && (
          <div className="bg-yellow-950 border border-yellow-800 rounded-xl px-4 py-3 text-yellow-300 text-sm text-center">
            Checkout was canceled. No charge was made.
          </div>
        )}

        {/* Cart summary bar — shows when items are in cart */}
        {cart.length > 0 && (
          <div className="sticky top-4 z-10 bg-gray-900 border border-red-800 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{cart.length} item{cart.length > 1 ? "s" : ""}</span>
              <div className="flex flex-wrap gap-1">
                {cart.map(id => (
                  <span key={id} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    {PROGRAMS_DATA[id]?.name}
                    <button onClick={() => removeFromCart(id)} className="text-gray-500 hover:text-red-400 ml-1 font-bold">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-white font-bold">${cartTotal}{hasMonthly ? "/mo+" : ""}</p>
              <button onClick={() => { setShowForm(true); setTimeout(() => document.getElementById("cart-section")?.scrollIntoView({ behavior: "smooth" }), 50) }}
                className="text-xs text-red-400 underline">Checkout →</button>
            </div>
          </div>
        )}

        {/* Program categories */}
        {CATEGORIES.map(cat => (
          <div key={cat.label} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${cat.badge}`}>{cat.label.toUpperCase()}</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
            <div className="space-y-2">
              {cat.programs.map(p => {
                const prog = PROGRAMS_DATA[p.id]
                const inCart = cart.includes(p.id)
                return (
                  <div key={p.id} className={`bg-gray-900 rounded-xl border-2 px-5 py-4 transition-all ${inCart ? "border-green-600 bg-gray-800" : cat.color + " border-gray-800"}`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-white text-sm">{prog?.name}</p>
                          {"highlight" in p && p.highlight && (
                            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">{p.highlight}</span>
                          )}
                          {inCart && <span className="text-xs bg-green-700 text-green-200 px-2 py-0.5 rounded-full font-bold">✓ IN CART</span>}
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5">{p.desc}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <p className="text-white font-bold text-sm">{prog?.priceLabel}</p>
                        {inCart ? (
                          <button onClick={() => removeFromCart(p.id)}
                            className="text-xs bg-gray-700 hover:bg-red-900 text-gray-300 hover:text-red-300 px-3 py-1.5 rounded-lg transition-colors">
                            Remove
                          </button>
                        ) : (
                          <button onClick={() => addToCart(p.id)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors">
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Cart + Form */}
        {showForm && cart.length > 0 && (
          <div id="cart-section" className="bg-gray-900 rounded-2xl border border-red-900 p-6 space-y-6">
            <div>
              <h2 className="text-white font-bold text-lg">Your Cart</h2>
              <p className="text-gray-500 text-sm">Review your selections then fill in player info.</p>
            </div>

            {/* Cart items */}
            <div className="space-y-2">
              {cart.map(id => {
                const prog = PROGRAMS_DATA[id]
                return (
                  <div key={id} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-white text-sm font-semibold">{prog?.name}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${prog?.billing === "monthly" ? "bg-blue-900 text-blue-300" : "bg-gray-700 text-gray-400"}`}>
                        {prog?.billing === "monthly" ? "Monthly recurring" : "One-time payment"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-white font-bold text-sm">{prog?.priceLabel}</p>
                      <button onClick={() => removeFromCart(id)} className="text-gray-600 hover:text-red-400 text-sm">✕</button>
                    </div>
                  </div>
                )
              })}
              <div className="flex justify-between px-4 py-2 border-t border-gray-700 mt-2">
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-white font-bold">${cartTotal}{hasMonthly ? "/mo" : ""}</p>
              </div>
              {hasMonthly && cart.some(id => PROGRAMS_DATA[id]?.billing === "one_time") && (
                <div className="bg-blue-950 border border-blue-800 rounded-xl px-4 py-3 text-blue-300 text-xs">
                  Your cart has both monthly and one-time items. You will complete <strong>2 payments</strong> — first your monthly subscription, then your one-time charges.
                </div>
              )}
            </div>

            {/* Player info */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Player Info</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Player Name *</label>
                  <input value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="First Last"
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Age</label>
                  <input value={playerAge} onChange={e => setPlayerAge(e.target.value)} placeholder="e.g. 14"
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Grade</label>
                  <select value={playerGrade} onChange={e => setPlayerGrade(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm">
                    <option value="">Select grade...</option>
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">School</label>
                  <input value={playerSchool} onChange={e => setPlayerSchool(e.target.value)} placeholder="School name"
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Position</label>
                  <select value={playerPosition} onChange={e => setPlayerPosition(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm">
                    <option value="">Select position...</option>
                    {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Parent info */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Parent / Guardian</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Parent Name *</label>
                  <input value={parentName} onChange={e => setParentName(e.target.value)} placeholder="First Last"
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="parent@email.com"
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Phone *</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(817) 555-1234"
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
                </div>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm bg-red-950 border border-red-900 rounded-lg px-3 py-2">{error}</p>}

            <button onClick={handleCheckout}
              disabled={!cart.length || !playerName || !parentName || !email || !phone || loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm">
              {loading ? "Setting up..." : `Pay $${cartTotal}${hasMonthly ? " + monthly" : ""} →`}
            </button>
            <p className="text-xs text-gray-600 text-center">Secure payment powered by Stripe.</p>
          </div>
        )}

        <p className="text-center text-gray-700 text-xs pb-4">
          PolyRISE Football · (817) 658-3300 · polyrise@polyrisefootball.com · Dripping Springs, TX
        </p>
      </div>
    </div>
  )
}

export default function RegisterPageWrapper() {
  return <Suspense><RegisterPage /></Suspense>
}
