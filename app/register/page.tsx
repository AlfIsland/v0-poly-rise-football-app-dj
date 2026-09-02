"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

const PROGRAMS_DATA: Record<string, { name: string; price: number; priceLabel: string; billing: "one_time" | "monthly" }> = {
  // Training Memberships
  "membership-annual":       { name: "Year-Round Membership — 12-Month Commitment",     price: 189,  priceLabel: "$189/mo",          billing: "monthly"  },
  "membership-monthly":      { name: "Monthly Membership — No Contract",                price: 235,  priceLabel: "$235/mo",          billing: "monthly"  },
  // Football Player Development tiers
  "player-dev":              { name: "Football Player Development — Monthly",           price: 250,  priceLabel: "$250/mo",          billing: "one_time" },
  "player-dev-6mo":          { name: "Football Player Development — 6-Month",          price: 280,  priceLabel: "$280/mo (6-mo)",   billing: "monthly"  },
  "player-dev-annual":       { name: "Football Player Development — Annual",           price: 250,  priceLabel: "$250/mo (annual)", billing: "monthly"  },
  "player-dev-1day":         { name: "Football Player Development — Once a Week",      price: 150,  priceLabel: "$150/mo",          billing: "monthly"  },
  // Girls Player Development
  "girls-dev":               { name: "Girls Player Development — 2 Days/Week",    price: 250,   priceLabel: "$250/mo",   billing: "monthly"   },
  "girls-dev-3day":          { name: "Girls Player Development — 3 Days/Week",    price: 315,   priceLabel: "$315/mo",   billing: "monthly"   },
  // Drop-In
  "drop-in-1day":            { name: "Drop-In Training — 1 Day",                  price: 30,    priceLabel: "$30",       billing: "one_time"  },
  "drop-in-2day":            { name: "Drop-In Training — 2 Days",                 price: 50,    priceLabel: "$50",       billing: "one_time"  },
  // HS Recruiting & Exposure
  "hs-recruiting-elite":     { name: "HS Recruiting — Elite Exposure",            price: 150,   priceLabel: "$150/mo",   billing: "monthly"   },
  "hs-recruiting-pro":       { name: "HS Recruiting — Pro Exposure",              price: 125,   priceLabel: "$125/mo",   billing: "monthly"   },
  "hs-recruiting-basic":     { name: "HS Recruiting — Basic Exposure",            price: 85,    priceLabel: "$85/mo",    billing: "monthly"   },
  // After School & Girls Development
  "afterschool":             { name: "After School & Girls Development",          price: 150,   priceLabel: "$150/mo",  billing: "one_time" },
  "afterschool-monthly":     { name: "After School & Girls Development",          price: 150,   priceLabel: "$150/mo",  billing: "one_time" },
  // Tackle Sessions (Aug–Sep recurring)
  "tackle-session-single":   { name: "Tackle Sessions — Per Session",             price: 40,    priceLabel: "$40",       billing: "one_time"  },
  "tackle-session-monthly":  { name: "Tackle Sessions — 3 Sessions",              price: 105,   priceLabel: "$105",      billing: "one_time"  },
  // Events
  "combine":                 { name: "Combine Metrics Camp",                      price: 40,    priceLabel: "$40",       billing: "one_time"  },
  "pr-verified-single":      { name: "PR-VERIFIED — 1 Event",                     price: 40,    priceLabel: "$40",       billing: "one_time"  },
  "pr-verified-annual":      { name: "PR-VERIFIED — Annual (6 Events)",           price: 130,   priceLabel: "$130/yr",   billing: "one_time"  },
  "hike":                    { name: "Leadership & Mentorship Hike",              price: 25,    priceLabel: "$25",       billing: "one_time"  },
  // Athlete Tracking & Recruiting Profiles
  "passport":                { name: "Passport",                                  price: 9.99,  priceLabel: "$9.99/mo",  billing: "monthly"   },
  "recruit":                 { name: "Recruit",                                   price: 29.99, priceLabel: "$29.99/mo", billing: "monthly"   },
}

const CATEGORIES = [
  {
    label: "Training Memberships", badge: "bg-red-900 text-red-300", color: "border-red-800 hover:border-red-500",
    programs: [
      { id: "membership-annual",  desc: "4 gym sessions/mo (SAQ, S&C & Hill Sprints) · 2 field sessions/mo (position training + recruiting & leadership talk) · 6 sessions total · 12-month commitment", highlight: "BEST VALUE" },
      { id: "membership-monthly", desc: "4 gym sessions/mo (SAQ, S&C & Hill Sprints) · 2 field sessions/mo (position training + recruiting & leadership talk) · 6 sessions total · No contract required" },
    ],
  },
  {
    label: "Training Programs", badge: "bg-red-900 text-red-300", color: "border-red-800 hover:border-red-500",
    programs: [
      { id: "player-dev-1day",   desc: "Thursday · 5:30–6:30pm · SAQ, S&C, football drills, tournament entries, military character events, PR-Verified Camp & Free Athletic Training Passport", highlight: "POPULAR" },
      { id: "drop-in-1day",      desc: "Single day training session · Try a session before committing to a full program" },
      { id: "drop-in-2day",      desc: "2 day training package" },
    ],
  },
  {
    label: "HS Recruiting & Exposure", badge: "bg-orange-900 text-orange-300", color: "border-orange-800 hover:border-orange-500",
    programs: [
      { id: "hs-recruiting-elite", desc: "2× X + Instagram blast/mo · 5 personalized coach emails/mo · Profile optimization · Weekly recruiting report · 1-on-1 coach call", highlight: "ELITE" },
      { id: "hs-recruiting-pro",   desc: "X + Instagram blast · 3 personalized coach emails/mo · Profile optimization · Bi-weekly recruiting report" },
      { id: "hs-recruiting-basic", desc: "Pro profile image package · X blast (1–2× monthly) · Access to coach directory" },
    ],
  },
  {
    label: "After School & Girls Development", badge: "bg-teal-900 text-teal-300", color: "border-teal-800 hover:border-teal-500",
    programs: [
      { id: "afterschool", desc: "Tuesday · 5:30–6:30pm · Open to Elementary, Middle School & Girl athletes · $150/mo" },
    ],
  },
  {
    label: "Tackle Sessions", badge: "bg-orange-900 text-orange-300", color: "border-orange-800 hover:border-orange-500",
    programs: [
      { id: "tackle-session-single",  desc: "Pay per session · Aug 8, 15 & 22 · 9:30–11:00am · Tackling fundamentals & live reps coached by NFL-experienced staff" },
      { id: "tackle-session-monthly", desc: "All 3 sessions · Aug 8, 15 & 22 · 9:30–11:00am · No auto-draft · Best value", highlight: "BEST VALUE" },
    ],
  },
  {
    label: "Events", badge: "bg-green-900 text-green-300", color: "border-green-800 hover:border-green-500",
    programs: [
      { id: "combine",            desc: "Professional Combine Events · H.S. athletes record official metrics · Earn your PR-VERIFIED seal" },
      { id: "pr-verified-single", desc: "1 combine event · Get officially PR-VERIFIED · Standardized pro-style testing on-site" },
      { id: "pr-verified-annual", desc: "6 combine events throughout the year · Keep your verified data current all season long", highlight: "BEST VALUE" },
      { id: "hike",          desc: "Leadership & Mentorship Hike · Character-building experience developing leadership, mentorship & mental toughness" },
    ],
  },
  {
    label: "Athlete Tracking & Profiles", badge: "bg-purple-900 text-purple-300", color: "border-purple-800 hover:border-purple-500",
    programs: [
      { id: "passport",      desc: "Monthly progress reports, session history, baseline comparisons, downloadable PDFs · All athletes MS & up" },
      { id: "recruit",       desc: "PR-VERIFIED profile, Hudl integration, monthly X spotlight to college recruiters, 1 free combine/mo · Grades 9–12", highlight: "POPULAR" },
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
  const [discountCode, setDiscountCode] = useState("")
  const [discountResult, setDiscountResult] = useState<{ valid: boolean; label?: string; savings?: number; code?: string } | null>(null)
  const [validatingCode, setValidatingCode] = useState(false)
  const [billingMonth, setBillingMonth] = useState(() => {
    const now = new Date()
    return `${now.toLocaleString("en-US", { month: "long" })} ${now.getFullYear()}`
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [waiverAccepted, setWaiverAccepted] = useState(false)
  const [waiverExpanded, setWaiverExpanded] = useState(false)
  const [subscriptionAcknowledged, setSubscriptionAcknowledged] = useState(false)
  const [subscriptionExpanded, setSubscriptionExpanded] = useState(false)
  const [recruitingMonths, setRecruitingMonths] = useState<3 | 6 | 12>(3)

  const billingMonthOptions = (() => {
    const opts: string[] = []
    const now = new Date()
    for (let i = 0; i < 5; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
      opts.push(`${d.toLocaleString("en-US", { month: "long" })} ${d.getFullYear()}`)
    }
    return opts
  })()
  const searchParams = useSearchParams()
  const canceled = searchParams.get("canceled")

  useEffect(() => {
    const program = searchParams.get("program")
    if (program && PROGRAMS_DATA[program] && !cart.includes(program)) {
      addToCart(program)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addToCart = (id: string) => {
    if (!cart.includes(id)) setCart(prev => [...prev, id])
    setShowForm(true)
    setTimeout(() => document.getElementById("cart-section")?.scrollIntoView({ behavior: "smooth" }), 50)
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i !== id))
  }

  const hasAfterschool = cart.includes("afterschool")
  const cartTotal = cart.reduce((sum, id) => sum + (PROGRAMS_DATA[id]?.price ?? 0), 0)
  const hasOtherMonthly = cart.some(id => id !== "afterschool" && id !== "membership-monthly" && PROGRAMS_DATA[id]?.billing === "monthly")
  const hasMonthly = hasOtherMonthly
  const hasRecruiting = cart.some(id => id.startsWith("hs-recruiting"))

  const validateCode = async () => {
    if (!discountCode.trim()) return
    setValidatingCode(true)
    const res = await fetch("/api/register/validate-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: discountCode.trim(), amount: cartTotal }),
    })
    const data = await res.json()
    setDiscountResult(data)
    setValidatingCode(false)
  }

  const handleCheckout = async () => {
    if (!cart.length || !playerName || !parentName || !email || !phone) return
    setLoading(true); setError("")
    const actualCart = cart.map(id => id === "afterschool" ? "afterschool-monthly" : id)
    try {
      const res = await fetch("/api/register/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programIds: actualCart, playerName, playerAge, playerGrade, playerSchool, playerPosition, parentName, email, phone, discountCode: discountResult?.valid ? discountResult.code : undefined, billingMonth: hasMonthly ? billingMonth : undefined, recruitingMonths: hasRecruiting ? recruitingMonths : undefined }),
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
            <Image src="/poly-rise-logo.png" alt="PolyRISE Athletix" width={60} height={60} className="object-contain" />
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
                const displayBilling = prog?.billing
                const displayPrice = prog?.priceLabel
                return (
                  <div key={id} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-white text-sm font-semibold">{prog?.name}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${displayBilling === "monthly" ? "bg-blue-900 text-blue-300" : "bg-gray-700 text-gray-400"}`}>
                        {displayBilling === "monthly" ? "Monthly recurring" : "One-time payment"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-white font-bold text-sm">{displayPrice}</p>
                      <button onClick={() => removeFromCart(id)} className="text-gray-600 hover:text-red-400 text-sm">✕</button>
                    </div>
                  </div>
                )
              })}
              <div className="flex justify-between px-4 py-2 border-t border-gray-700 mt-2">
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-white font-bold">${cartTotal}{hasMonthly ? "/mo" : ""}</p>
              </div>
              {(() => {
                const actualBillings = cart.map(id => PROGRAMS_DATA[id]?.billing)
                return actualBillings.includes("monthly") && actualBillings.includes("one_time") && (
                  <div className="bg-blue-950 border border-blue-800 rounded-xl px-4 py-3 text-blue-300 text-xs">
                    Your cart has both monthly and one-time items. You will complete <strong>2 payments</strong> — first your monthly subscription, then your one-time charges.
                  </div>
                )
              })()}

            </div>

            {/* Recruiting Subscription Length */}
            {hasRecruiting && (
              <div className="bg-red-950/40 border border-red-800 rounded-xl px-4 py-4 space-y-3">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Recruiting Subscription Length</p>
                <p className="text-xs text-gray-400">Choose how many months you want to subscribe. Your card will be auto-drafted monthly for the duration you select.</p>
                <div className="grid grid-cols-3 gap-3">
                  {([3, 6, 12] as const).map(months => {
                    const recruitingTotal = cart
                      .filter(id => id.startsWith("hs-recruiting"))
                      .reduce((sum, id) => sum + (PROGRAMS_DATA[id]?.price ?? 0), 0)
                    const total = recruitingTotal * months
                    return (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setRecruitingMonths(months)}
                        className={`rounded-xl border-2 p-3 text-center transition-all ${recruitingMonths === months ? "border-red-500 bg-red-950" : "border-gray-700 bg-gray-800 hover:border-gray-500"}`}
                      >
                        <p className={`text-sm font-black ${recruitingMonths === months ? "text-red-400" : "text-white"}`}>{months} mo</p>
                        <p className="text-xs text-gray-400 mt-0.5">${total} total</p>
                        {months === 12 && <p className="text-xs text-green-400 font-semibold mt-1">Best Value</p>}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-500">Subscription auto-cancels after {recruitingMonths} month{recruitingMonths > 1 ? "s" : ""}. No surprise charges.</p>
              </div>
            )}

            {/* Billing Month — only shown for monthly programs */}
            {hasMonthly && (
              <div className="bg-blue-950/50 border border-blue-800 rounded-xl px-4 py-4 space-y-2">
                <p className="text-xs font-bold text-blue-300 uppercase tracking-widest">Billing Month</p>
                <p className="text-xs text-blue-400">Which month is this payment for?</p>
                <select value={billingMonth} onChange={e => setBillingMonth(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-blue-700 focus:border-blue-400 focus:outline-none text-sm font-semibold">
                  {billingMonthOptions.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}

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

            {/* Discount code */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Discount Code</p>
              <div className="flex gap-2 pt-1">
                <input value={discountCode} onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setDiscountResult(null) }}
                  placeholder="Enter code (optional)"
                  className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-red-500 focus:outline-none text-sm font-mono uppercase" />
                <button onClick={validateCode} disabled={!discountCode.trim() || validatingCode}
                  className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white text-xs font-bold px-4 rounded-lg transition-colors">
                  {validatingCode ? "..." : "Apply"}
                </button>
              </div>
              {discountResult && (
                discountResult.valid
                  ? <p className="text-green-400 text-xs">✓ {discountResult.label} applied — saves ${discountResult.savings}</p>
                  : <p className="text-red-400 text-xs">✗ {(discountResult as { error?: string }).error ?? "Invalid code"}</p>
              )}
            </div>

            {/* Waiver */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Liability Waiver & Release</p>
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setWaiverExpanded(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-white font-semibold hover:bg-gray-750 transition-colors"
                >
                  <span>Read Full Waiver</span>
                  <span className="text-gray-400 text-xs">{waiverExpanded ? "▲ Collapse" : "▼ Expand"}</span>
                </button>
                {waiverExpanded && (
                  <div className="px-4 pb-4 text-xs text-gray-300 leading-relaxed space-y-3 border-t border-gray-700 pt-3 max-h-64 overflow-y-auto">
                    <p><strong className="text-white">WAIVER OF LIABILITY, ASSUMPTION OF RISK, AND INDEMNITY AGREEMENT</strong></p>
                    <p>In consideration of being permitted to participate in any and all PolyRISE Athletix programs, camps, events, training sessions, and activities (collectively, &quot;Activities&quot;), I, the undersigned parent or legal guardian, on behalf of myself and the minor participant named in this registration form, hereby agree to the following:</p>
                    <p><strong className="text-white">1. ASSUMPTION OF RISK.</strong> I acknowledge that participation in athletic training and sports activities involves inherent risks of injury, including but not limited to sprains, strains, fractures, concussions, and other serious injuries. These risks include, but are not limited to, risks arising from the use of the training facility, gym, gymnasium equipment, outdoor fields, weights, training tools, and any other venues or equipment used by or associated with PolyRISE Athletix. I voluntarily assume all such risks — known and unknown — on behalf of the minor participant.</p>
                    <p><strong className="text-white">2. RELEASE OF LIABILITY.</strong> I hereby release, waive, discharge, and covenant not to sue PolyRISE Athletix, its coaches, staff, volunteers, sponsors, and affiliates (collectively, &quot;Released Parties&quot;) from any and all claims, damages, losses, or liability of any kind — including but not limited to injuries, accidents, property damage, or death — arising out of or related to the minor participant&apos;s participation in the Activities, use of the training facility or gym, use of any equipment, or presence on any property associated with PolyRISE Athletix. This release includes claims arising from the negligence of the Released Parties. PolyRISE Athletix is not liable for any injury, accident, loss, or damage of any kind occurring at or in connection with the gym, training facility, or any program or event.</p>
                    <p><strong className="text-white">3. MEDICAL AUTHORIZATION.</strong> In the event of an injury or medical emergency, I authorize the Released Parties to seek and consent to emergency medical treatment for the minor participant. I agree to be responsible for all medical costs incurred.</p>
                    <p><strong className="text-white">4. PHOTO & MEDIA CONSENT.</strong> I grant PolyRISE Athletix permission to photograph and/or video record the minor participant during Activities and to use such images or footage for promotional, educational, and marketing purposes without compensation.</p>
                    <p><strong className="text-white">5. CODE OF CONDUCT.</strong> I agree that the minor participant will conduct themselves in a respectful, sportsmanlike manner at all times. PolyRISE Athletix reserves the right to remove any participant who engages in disruptive or unsafe behavior without refund.</p>
                    <p><strong className="text-white">6. INDEMNIFICATION.</strong> I agree to indemnify and hold harmless the Released Parties from any claims, damages, or expenses (including attorneys&apos; fees) arising from the minor participant&apos;s participation in the Activities.</p>
                    <p><strong className="text-white">7. GOVERNING LAW.</strong> This agreement shall be governed by the laws of the State of Texas. If any provision is found to be unenforceable, the remaining provisions shall remain in full effect.</p>
                    <p>By checking the box below, I confirm that I am the parent or legal guardian of the minor participant, that I have read and understand this waiver in its entirety, and that I agree to be bound by its terms.</p>
                  </div>
                )}
              </div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={waiverAccepted}
                  onChange={e => setWaiverAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-red-600 cursor-pointer shrink-0"
                />
                <span className="text-sm text-white leading-snug group-hover:text-gray-200 transition-colors">
                  I have read and agree to the <button type="button" onClick={() => setWaiverExpanded(true)} className="text-red-400 underline hover:text-red-300">Liability Waiver & Release</button>. I am the parent or legal guardian of the athlete named above and accept all terms on their behalf.
                </span>
              </label>
              {!waiverAccepted && cart.length > 0 && playerName && parentName && email && phone && (
                <p className="text-yellow-400 text-xs">⚠ You must accept the waiver before proceeding to payment.</p>
              )}
            </div>

            {/* Subscription Acknowledgment — only shown for non-afterschool monthly programs */}
            {hasOtherMonthly && (() => {
              const monthlyItems = cart.filter(id => id !== "afterschool" && PROGRAMS_DATA[id]?.billing === "monthly")
              const commitmentMonths =
                cart.includes("membership-annual") ? 12
                : cart.includes("player-dev-annual") ? 12
                : cart.includes("player-dev-6mo") ? 6
                : hasRecruiting ? recruitingMonths
                : null
              const isCommitment = commitmentMonths !== null
              return (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Subscription & Billing Authorization</p>
                  <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setSubscriptionExpanded(v => !v)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-white font-semibold hover:bg-gray-750 transition-colors"
                    >
                      <span>Read Billing Terms</span>
                      <span className="text-gray-400 text-xs">{subscriptionExpanded ? "▲ Collapse" : "▼ Expand"}</span>
                    </button>
                    {subscriptionExpanded && (
                      <div className="px-4 pb-4 text-xs text-gray-300 leading-relaxed space-y-3 border-t border-gray-700 pt-3 max-h-64 overflow-y-auto">
                        <p><strong className="text-white">SUBSCRIPTION & AUTO-BILLING AGREEMENT</strong></p>
                        <p>By completing this registration, you authorize PolyRISE Athletix to charge the payment method you provide through Stripe for the following monthly subscription{monthlyItems.length > 1 ? "s" : ""}:</p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                          {monthlyItems.map(id => (
                            <li key={id}><strong className="text-white">{PROGRAMS_DATA[id]?.name}</strong> — {PROGRAMS_DATA[id]?.priceLabel}</li>
                          ))}
                        </ul>
                        <p><strong className="text-white">AUTO-DRAFT.</strong> Your card will be automatically charged on the same day each month. Charges will appear on your statement as &quot;PolyRISE Athletix.&quot; You will receive a receipt via email after each successful charge.</p>
                        {isCommitment ? (
                          <p><strong className="text-white">COMMITMENT PERIOD.</strong> This subscription is a <strong className="text-white">{commitmentMonths}-month commitment</strong>. Your card will be auto-drafted monthly for {commitmentMonths} months, after which your subscription will automatically cancel — no action required. Early cancellation is not available for commitment-based plans.</p>
                        ) : (
                          <p><strong className="text-white">MONTH-TO-MONTH.</strong> This is a month-to-month subscription with no minimum commitment. You may cancel at any time by contacting PolyRISE Athletix at least 7 days before your next billing date.</p>
                        )}
                        <p><strong className="text-white">CANCELLATION.</strong> To cancel or modify your subscription, contact us at (817) 658-3300 or polyrise7v7@gmail.com at least 7 days before your next billing date. Cancellation requests submitted after the billing date will take effect the following month.</p>
                        <p><strong className="text-white">REFUND POLICY.</strong> Monthly subscription charges are non-refundable once processed. If a charge fails, Stripe will automatically retry. After 3 failed attempts, your subscription access may be paused until payment is resolved.</p>
                        <p>By checking the box below, you confirm that you understand and authorize recurring charges as described above and agree to these billing terms.</p>
                      </div>
                    )}
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={subscriptionAcknowledged}
                      onChange={e => setSubscriptionAcknowledged(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-red-600 cursor-pointer shrink-0"
                    />
                    <span className="text-sm text-white leading-snug group-hover:text-gray-200 transition-colors">
                      I authorize PolyRISE Athletix to auto-draft my card monthly
                      {isCommitment ? ` for ${commitmentMonths} months` : " on a month-to-month basis"}
                      {" "}and I have read and agree to the{" "}
                      <button type="button" onClick={() => setSubscriptionExpanded(true)} className="text-blue-400 underline hover:text-blue-300">Subscription & Billing Terms</button>.
                    </span>
                  </label>
                  {!subscriptionAcknowledged && cart.length > 0 && playerName && parentName && email && phone && waiverAccepted && (
                    <p className="text-yellow-400 text-xs">⚠ You must authorize the subscription billing before proceeding to payment.</p>
                  )}
                </div>
              )
            })()}

            {error && <p className="text-red-400 text-sm bg-red-950 border border-red-900 rounded-lg px-3 py-2">{error}</p>}

            <button onClick={handleCheckout}
              disabled={!cart.length || !playerName || !parentName || !email || !phone || !waiverAccepted || (hasOtherMonthly && !subscriptionAcknowledged) || loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm">
              {loading ? "Setting up..." : `Pay $${discountResult?.valid ? cartTotal - (discountResult.savings ?? 0) : cartTotal}${hasMonthly ? "/mo" : ""} →`}
            </button>
            <p className="text-xs text-gray-600 text-center">Secure payment powered by Stripe.</p>
          </div>
        )}

        <p className="text-center text-gray-700 text-xs pb-4">
          PolyRISE Athletix · (817) 658-3300 · polyrise@polyrisefootball.com · Dripping Springs, TX
        </p>
      </div>
    </div>
  )
}

export default function RegisterPageWrapper() {
  return <Suspense><RegisterPage /></Suspense>
}
