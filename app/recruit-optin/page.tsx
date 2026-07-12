"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

const SPORTS = ["Football", "Basketball", "Baseball", "Soccer", "Track & Field", "Wrestling", "Volleyball", "Softball", "Lacrosse", "Tennis", "Other"]
const GRAD_YEARS = ["2026", "2027", "2028", "2029", "2030", "2031"]

function generateOptInId() {
  const d = new Date()
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `POLY-OPT-${date}-${rand}`
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-200">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {children}
    </div>
  )
}

const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
const selectClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors appearance-none"

export default function RecruitOptInPage() {
  const [athleteName, setAthleteName]   = useState("")
  const [highSchool, setHighSchool]     = useState("")
  const [gradYear, setGradYear]         = useState("")
  const [sport, setSport]               = useState("")
  const [position, setPosition]         = useState("")
  const [height, setHeight]             = useState("")
  const [weight, setWeight]             = useState("")
  const [passportId, setPassportId]     = useState("")
  const [parentName, setParentName]     = useState("")
  const [parentEmail, setParentEmail]   = useState("")
  const [parentPhone, setParentPhone]   = useState("")
  const [check1, setCheck1]             = useState(false)
  const [check2, setCheck2]             = useState(false)
  const [submitted, setSubmitted]       = useState(false)
  const [optInId, setOptInId]           = useState("")
  const [copied, setCopied]             = useState(false)
  const [error, setError]               = useState("")

  const canSubmit = athleteName && highSchool && gradYear && sport && parentName && parentEmail && check1 && check2

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) { setError("Please complete all required fields and check both consent boxes."); return }
    setOptInId(generateOptInId())
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const copyId = () => {
    navigator.clipboard.writeText(optInId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/poly-rise-logo.png" alt="PolyRISE Athletics" width={36} height={36} className="h-8 w-auto" />
            <span className="font-black text-white text-sm tracking-wide hidden sm:inline">PolyRISE Athletics</span>
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            ← Back to PolyRISE
          </Link>
        </div>
      </nav>

      {submitted ? (

        /* ── SUCCESS STATE ── */
        <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">

          {/* Check + headline */}
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-900/40 border-2 border-green-500 flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-white">You&apos;re All Set!</h1>
            <p className="text-gray-300 text-lg">
              <span className="text-white font-bold">{athleteName}</span> is officially opted in for college recruiting contact under the new rules.
            </p>
          </div>

          {/* Opt-In ID */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Your Official Opt-In ID</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="font-mono text-2xl font-black text-white tracking-wider">{optInId}</span>
              <button
                onClick={copyId}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                style={{ background: copied ? "#166534" : "#B91C1C", color: "white" }}
              >
                {copied ? "✓ Copied!" : "Copy ID"}
              </button>
            </div>
            <p className="text-xs text-gray-500">Save this ID — you&apos;ll need it for your recruiting profile.</p>
          </div>

          {/* Digital badge */}
          <div className="flex justify-center">
            <div
              className="rounded-2xl border-2 p-6 w-80 text-center space-y-3 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", borderColor: "#B91C1C" }}
            >
              {/* stripe accent */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #B91C1C, #1E3A8A, #B91C1C)" }} />
              <div className="flex items-center justify-center gap-2">
                <Image src="/poly-rise-logo.png" alt="PolyRISE" width={28} height={28} className="h-7 w-auto" />
                <span className="font-black text-sm tracking-widest text-white">POLYRISE</span>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">Officially Opted In</p>
                <p className="text-white font-black text-lg mt-1">{athleteName}</p>
                <p className="text-gray-400 text-xs">{highSchool} · {sport}{position ? ` · ${position}` : ""} · {gradYear}</p>
              </div>
              <div className="border-t border-white/10 pt-3">
                <p className="font-mono text-xs text-gray-400 tracking-wider">{optInId}</p>
                <p className="text-gray-600 text-xs mt-1">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              </div>
              <p className="text-gray-600 text-xs">polyrisefootball.com</p>
            </div>
          </div>

          <p className="text-xs text-gray-600 italic">Screenshot this badge to share with your coach, upload to Hudl, or use in your recruiting profile.</p>

          {/* Next steps */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left space-y-4">
            <p className="text-sm font-black text-white uppercase tracking-widest">Next Steps</p>
            {[
              { num: "1", text: "Add your Opt-In ID to your free AI recruiting profile", link: { label: "polyrisefootball.com/free-profile", href: "/free-profile" } },
              { num: "2", text: "Share your Opt-In ID with your high school coach so they can add it to your recruiting file", link: null },
              { num: "3", text: "Upload the badge to your Hudl profile or any recruiting platform where coaches look you up", link: null },
            ].map(step => (
              <div key={step.num} className="flex gap-4">
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white mt-0.5" style={{ background: "#B91C1C" }}>
                  {step.num}
                </div>
                <div>
                  <p className="text-gray-300 text-sm">{step.text}</p>
                  {step.link && (
                    <Link href={step.link.href} className="text-xs font-bold text-red-400 hover:text-red-300 underline">{step.link.label} →</Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Link href="/" className="inline-block text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to PolyRISE
          </Link>
        </div>

      ) : (

        <>
          {/* ── HERO ── */}
          <section className="relative py-16 md:py-24 px-4 overflow-hidden">
            {/* background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl" style={{ background: "#B91C1C" }} />
            </div>

            <div className="relative max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest" style={{ borderColor: "#B91C1C", color: "#fca5a5", background: "rgba(185,28,28,0.1)" }}>
                New NCAA Rule · Protect College Sports Act
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] tracking-tight">
                College Coaches Won&apos;t Be Able to Contact Your Athlete Anymore&hellip;{" "}
                <span style={{ color: "#fca5a5" }}>Unless You Do This First</span>
              </h1>

              <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                A new federal rule requires high school athletes to officially <strong className="text-white">opt in</strong> before college coaches are allowed to contact them. If your athlete hasn&apos;t opted in, coaches&apos; hands are tied — no calls, no texts, no offers.
              </p>

              <a
                href="#opt-in-form"
                className="inline-block text-white font-black text-lg px-10 py-4 rounded-xl shadow-lg transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#B91C1C", boxShadow: "0 0 40px rgba(185,28,28,0.4)" }}
              >
                Opt In My Athlete Now
              </a>

              <p className="text-gray-500 text-sm">
                100% Free &nbsp;·&nbsp; Takes less than 2 minutes &nbsp;·&nbsp; Connects to your free AI recruiting profile
              </p>
            </div>
          </section>

          {/* ── WHY THIS MATTERS ── */}
          <section className="bg-slate-50 py-14 px-4">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#B91C1C" }}>What You Need to Know</p>
                <h2 className="text-3xl font-black text-gray-900 leading-tight">Why This Matters for Your Athlete</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: "📋",
                    heading: "What Just Changed",
                    body: "Under the new Protect College Sports Act, college coaches must have written opt-in permission from a parent before they can contact a high school athlete about recruiting — by phone, email, or social media.",
                  },
                  {
                    icon: "✅",
                    heading: "What \"Opt In\" Means",
                    body: "Think of it as a permission slip. You're telling the recruiting world: \"College coaches, you are allowed to contact my athlete.\" Without it, even coaches who are interested in your athlete cannot legally reach out.",
                  },
                  {
                    icon: "🏈",
                    heading: "Why Do It With PolyRISE",
                    body: "When you opt in through PolyRISE, your athlete gets a unique Opt-In ID tied to their free recruiting profile — so coaches see their verified metrics, film links, and official opt-in status all in one place.",
                  },
                ].map(card => (
                  <div key={card.heading} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <div className="text-3xl mb-3">{card.icon}</div>
                    <h3 className="font-black text-gray-900 text-base mb-2">{card.heading}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{card.body}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Before Opt-In</p>
                    {[
                      "Coaches are legally blocked from contacting your athlete",
                      "Being talented isn't enough — you're invisible to recruiters",
                      "Your athlete could miss their window entirely",
                    ].map(t => (
                      <div key={t} className="flex items-start gap-2 mb-2">
                        <span className="text-red-500 mt-0.5 text-sm font-bold flex-shrink-0">✗</span>
                        <p className="text-gray-700 text-sm">{t}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">After Opt-In with PolyRISE</p>
                    {[
                      "College coaches can legally call, text, or email your athlete",
                      "Your Opt-In ID lives on your recruiting profile — verifiable",
                      "PolyRISE notifies our coaching network that your athlete is available",
                    ].map(t => (
                      <div key={t} className="flex items-start gap-2 mb-2">
                        <span className="text-green-600 mt-0.5 text-sm font-bold flex-shrink-0">✓</span>
                        <p className="text-gray-700 text-sm">{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── FORM ── */}
          <section id="opt-in-form" className="py-16 px-4">
            <div className="max-w-2xl mx-auto">

              <div className="text-center mb-10 space-y-2">
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#fca5a5" }}>Official Opt-In</p>
                <h2 className="text-3xl font-black text-white">Register Your Athlete</h2>
                <p className="text-gray-400 text-sm">Free, instant, and takes less than 2 minutes.</p>
              </div>

              <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-8">

                {/* Athlete info */}
                <div className="space-y-5">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-3">Athlete Information</p>

                  <Field label="Athlete Full Name" required>
                    <input value={athleteName} onChange={e => setAthleteName(e.target.value)} placeholder="First Last" className={inputClass} />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="High School" required>
                      <input value={highSchool} onChange={e => setHighSchool(e.target.value)} placeholder="School name" className={inputClass} />
                    </Field>
                    <Field label="Graduation Year" required>
                      <select value={gradYear} onChange={e => setGradYear(e.target.value)} className={selectClass}>
                        <option value="">Year...</option>
                        {GRAD_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Primary Sport" required>
                      <select value={sport} onChange={e => setSport(e.target.value)} className={selectClass}>
                        <option value="">Select sport...</option>
                        {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Position">
                      <input value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g. QB, WR, CB" className={inputClass} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Height" hint="Optional but encouraged">
                      <input value={height} onChange={e => setHeight(e.target.value)} placeholder='e.g. 6\'2"' className={inputClass} />
                    </Field>
                    <Field label="Weight" hint="Optional but encouraged">
                      <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 185 lbs" className={inputClass} />
                    </Field>
                  </div>

                  <Field label="PR-VERIFIED Passport ID" hint="Optional — only if you already have one from PolyRISE">
                    <input value={passportId} onChange={e => setPassportId(e.target.value)} placeholder="e.g. PR-2026-XXXXX" className={inputClass} />
                  </Field>
                </div>

                {/* Parent / Guardian */}
                <div className="space-y-5">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-3">Parent / Guardian</p>

                  <Field label="Parent or Guardian Full Name" required>
                    <input value={parentName} onChange={e => setParentName(e.target.value)} placeholder="First Last" className={inputClass} />
                  </Field>

                  <Field label="Parent Email Address" required>
                    <input type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} placeholder="email@example.com" className={inputClass} />
                  </Field>

                  <Field label="Parent Phone Number" hint="Optional">
                    <input type="tel" value={parentPhone} onChange={e => setParentPhone(e.target.value)} placeholder="(555) 555-1234" className={inputClass} />
                  </Field>
                </div>

                {/* Consent */}
                <div className="space-y-4">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-3">Consent & Authorization</p>

                  {[
                    { state: check1, setter: setCheck1, text: "I am the parent or legal guardian of the athlete listed above and have the authority to make this decision on their behalf." },
                    { state: check2, setter: setCheck2, text: "I give clear permission for college coaches, athletic programs, and recruiting staff to contact my athlete about college recruiting opportunities, in compliance with applicable NCAA and federal rules including the Protect College Sports Act." },
                  ].map((c, i) => (
                    <label key={i} className="flex items-start gap-3 cursor-pointer group">
                      <div
                        onClick={() => c.setter(!c.state)}
                        className="mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors"
                        style={{ background: c.state ? "#B91C1C" : "transparent", borderColor: c.state ? "#B91C1C" : "#4b5563" }}
                      >
                        {c.state && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{c.text}</p>
                    </label>
                  ))}
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-950/50 border border-red-900 rounded-xl px-4 py-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full text-white font-black text-base py-4 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: canSubmit ? "#B91C1C" : "#374151" }}
                >
                  Submit Opt-In →
                </button>

                <p className="text-center text-xs text-gray-600">
                  Your information is kept private and used only for recruiting purposes. &nbsp;
                  <Link href="/privacy" className="underline hover:text-gray-400">Privacy Policy</Link>
                </p>
              </form>
            </div>
          </section>
        </>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-8 px-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Image src="/poly-rise-logo.png" alt="PolyRISE" width={28} height={28} className="h-6 w-auto opacity-60" />
          <span className="text-gray-600 text-xs font-bold tracking-wide">PolyRISE Athletics</span>
        </div>
        <p className="text-gray-700 text-xs">Veteran-Owned &nbsp;·&nbsp; Dripping Springs, TX &nbsp;·&nbsp; polyrisefootball.com</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <Link href="/terms" className="text-gray-700 hover:text-gray-500 text-xs underline">Terms</Link>
          <Link href="/privacy" className="text-gray-700 hover:text-gray-500 text-xs underline">Privacy</Link>
          <Link href="/" className="text-gray-700 hover:text-gray-500 text-xs underline">Home</Link>
        </div>
      </footer>

    </div>
  )
}
