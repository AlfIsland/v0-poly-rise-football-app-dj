import Link from "next/link"
import Image from "next/image"
import { ProtectedImage } from "@/components/protected-image"

const WHAT_INSIDE = [
  {
    icon: "🏅",
    title: "Coach-Verified Combine Metrics",
    desc: "Every number on your passport was measured by a PolyRISE coach using pro combine protocols — 40-yard dash, vertical, shuttle, 3-cone, broad jump, and more. No self-reported times. No guesswork.",
    accent: "border-red-700/40 bg-red-950/20",
    iconBg: "bg-red-900/50",
  },
  {
    icon: "📊",
    title: "National & Texas Percentile Rankings",
    desc: "See exactly where your athlete stands compared to players at their position and class year — nationally and across Texas. Updated every time they test.",
    accent: "border-blue-700/40 bg-blue-950/20",
    iconBg: "bg-blue-900/50",
  },
  {
    icon: "📈",
    title: "Progress Since Baseline",
    desc: "Every session is tracked. Your passport shows the improvement arc from first test to today — proof of coachability that no highlight reel can show.",
    accent: "border-green-700/40 bg-green-950/20",
    iconBg: "bg-green-900/50",
  },
  {
    icon: "🗺️",
    title: "Recruiting Roadmap",
    desc: "An interactive checklist: NCAA ID, film, coach emails, campus visits. Track every step of the recruiting process in one place.",
    accent: "border-purple-700/40 bg-purple-950/20",
    iconBg: "bg-purple-900/50",
  },
  {
    icon: "📲",
    title: "Share Tools Built In",
    desc: "Instagram Story card with your metrics baked in. Pre-written coach email template with your real data. One-click profile link. Everything you need to get in front of coaches.",
    accent: "border-yellow-700/40 bg-yellow-950/20",
    iconBg: "bg-yellow-900/50",
  },
]

const RANKINGS_EXAMPLES = [
  {
    metric: "4.65",
    unit: "40-Yard Dash",
    position: "Linebacker",
    classYear: "Class of 2027",
    national: 78,
    texas: 74,
    color: "from-red-950 to-gray-900",
    barColor: "bg-red-500",
  },
  {
    metric: "38\"",
    unit: "Vertical Jump",
    position: "Wide Receiver",
    classYear: "Class of 2026",
    national: 91,
    texas: 87,
    color: "from-blue-950 to-gray-900",
    barColor: "bg-blue-500",
  },
  {
    metric: "4.28",
    unit: "5-10-5 Shuttle",
    position: "Cornerback",
    classYear: "Class of 2028",
    national: 83,
    texas: 80,
    color: "from-purple-950 to-gray-900",
    barColor: "bg-purple-500",
  },
]

const WITHOUT = [
  "Self-reported times coaches can't verify",
  "Generic Hudl profile with no rankings",
  "Cold emails coaches ignore",
  "No record of improvement over time",
  "Invisible among 1.1M HS players",
]

const WITH = [
  "Coach-measured at every session",
  "Verified percentile rankings by position & class",
  "Email template with real metrics built in",
  "Full testing history showing coachability",
  "Shareable profile + Instagram story card",
]

export default function PassportLandingPage() {

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={40} height={40} className="object-contain" />
            <span className="font-bold text-white hidden sm:inline">PolyRISE Football</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:inline">← Back to Site</Link>
            <Link href="/register?program=recruit" className="text-sm font-bold bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors">
              Get Your Passport
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-gray-950 to-gray-950 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-900/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — Copy */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-red-950/60 border border-red-700/50 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-red-300 uppercase tracking-widest">PolyRISE Athlete Passport</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                Your Athlete.{" "}
                <span className="text-red-500">Verified.</span>{" "}
                Ranked.{" "}
                <span className="text-red-500">Recruitable.</span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed">
                The PolyRISE Passport gives high school athletes a coach-verified athletic profile with national rankings, progress tracking, and the tools to get in front of college coaches — without spending thousands on a recruiting service.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register?program=recruit"
                  className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-6 py-3.5 rounded-xl text-base transition-colors">
                  Get Your Passport
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <Link href="/athlete/sample"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-base transition-colors">
                  See a Sample Passport
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  NFL-experienced coaches
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Pro combine protocols
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Based in Dripping Springs, TX
                </div>
              </div>
            </div>

            {/* Right — Passport mockup card */}
            <div className="relative">
              <div className="relative bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
                {/* Red accent top bar */}
                <div className="h-1.5 bg-gradient-to-r from-red-600 to-red-800" />
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-red-500 uppercase tracking-widest">PolyRISE Football</p>
                      <p className="text-xs text-gray-500">Athlete Recruiting Profile</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-green-900/40 border border-green-700/50 rounded-full px-3 py-1">
                      <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <span className="text-xs font-bold text-green-400">PR-VERIFIED</span>
                    </div>
                  </div>

                  {/* Athlete identity */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-red-600/50 flex items-center justify-center text-2xl">
                      🏈
                    </div>
                    <div>
                      <p className="font-black text-white text-lg">Athlete Name</p>
                      <p className="text-sm text-gray-400">Linebacker · Class of 2027</p>
                      <p className="text-xs text-gray-500">Dripping Springs HS · Age 16</p>
                    </div>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "40-Yard Dash", val: "4.65s", pct: 78 },
                      { label: "Vertical Jump", val: "34\"", pct: 72 },
                      { label: "5-10-5 Shuttle", val: "4.42s", pct: 81 },
                      { label: "Broad Jump", val: "108\"", pct: 69 },
                    ].map(m => (
                      <div key={m.label} className="bg-gray-800 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-0.5">{m.label}</p>
                        <p className="text-base font-black text-white">{m.val}</p>
                        <div className="mt-1.5 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${m.pct}%` }} />
                        </div>
                        <p className="text-xs text-red-400 font-semibold mt-1">{m.pct}th national</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar teaser */}
                  <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-400 mb-1">📈 Progress Since Baseline</p>
                    <p className="text-xs text-gray-400">40-Yard Dash improved from 4.92s → 4.65s <span className="text-green-400 font-semibold">(+5.9%)</span></p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-red-600 rounded-2xl px-4 py-3 shadow-xl border border-red-500/50">
                <p className="text-xs font-bold text-white">78th</p>
                <p className="text-xs text-red-200">National</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="py-16 lg:py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">The Reality</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white">Most athletes are invisible to college coaches</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">There are 1.1 million high school football players in the U.S. Without verified data and a professional profile, your athlete is one of them.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "❌",
                title: "No verified data",
                desc: "Self-reported times don't impress college coaches. Every parent says their son runs a 4.5. Prove it.",
                bg: "bg-red-950/30 border-red-800/40",
              },
              {
                icon: "👁️",
                title: "No visibility",
                desc: "College coaches can't find athletes they've never heard of. A profile no one knows about is the same as no profile.",
                bg: "bg-gray-900 border-gray-700",
              },
              {
                icon: "💸",
                title: "Recruiting services cost thousands",
                desc: "Most families can't afford $3,000–$5,000/year just to get a coach's attention. There's a better way.",
                bg: "bg-gray-900 border-gray-700",
              },
            ].map(p => (
              <div key={p.title} className={`rounded-2xl border p-6 ${p.bg}`}>
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="text-lg font-black text-white mb-2">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's Inside ── */}
      <section className="py-16 lg:py-24 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">What's Inside</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white">Everything a recruiting service charges for — built into your passport</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHAT_INSIDE.map(item => (
              <div key={item.title} className={`rounded-2xl border p-6 ${item.accent}`}>
                <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center text-2xl mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-base font-black text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Sample ── */}
      <section className="py-16 lg:py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">See the Real Thing</p>
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">This is what a PolyRISE Passport looks like</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">Explore a sample profile — verified metrics, national rankings, progress tracking, and recruiting tools, all in one place.</p>

          {/* Sample card */}
          <div className="relative bg-gray-900 rounded-2xl border border-red-700/40 overflow-hidden max-w-sm mx-auto shadow-2xl">
            <div className="h-1 bg-gradient-to-r from-red-600 to-red-800" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-widest">PolyRISE Football</p>
                  <p className="text-xs text-gray-500">Athlete Recruiting Profile</p>
                </div>
                <div className="flex items-center gap-1.5 bg-green-900/40 border border-green-700/50 rounded-full px-2.5 py-1">
                  <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <span className="text-xs font-bold text-green-400">PR-VERIFIED</span>
                </div>
              </div>

              <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-3 flex items-center justify-center text-3xl border-2 border-red-600/40">🏈</div>
              <p className="font-black text-white text-lg">Fname M. Lname</p>
              <p className="text-sm text-gray-400">Linebacker · 10th Grade</p>
              <p className="text-xs text-gray-500 mt-0.5">Dripping Springs HS · Class of 2027</p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {[{ l: "40-Yard Dash", v: "4.62s", pct: 76 }, { l: "Vertical Jump", v: "34\"", pct: 71 }, { l: "5-10-5 Shuttle", v: "4.41s", pct: 79 }, { l: "Broad Jump", v: "107\"", pct: 68 }].map(m => (
                  <div key={m.l} className="bg-gray-800 rounded-xl p-2.5 text-left">
                    <p className="text-xs text-gray-500">{m.l}</p>
                    <p className="text-sm font-black text-white">{m.v}</p>
                    <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${m.pct}%` }} />
                    </div>
                    <p className="text-xs text-red-400 font-semibold mt-0.5">{m.pct}th national</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500">4 sessions tracked · progress since baseline</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/athlete/sample"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-8 py-4 rounded-xl text-base transition-colors">
              View Full Sample Passport
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <p className="text-xs text-gray-600 mt-3">Sample data only — no real athlete information</p>
          </div>
        </div>
      </section>

      {/* ── Rankings Teaser ── */}
      <section className="py-16 lg:py-24 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">National Rankings</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">Do you know where your athlete ranks?</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Your passport calculates national and Texas percentile rankings by position and class year — updated every time your athlete tests.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {RANKINGS_EXAMPLES.map(ex => (
              <div key={ex.metric} className={`relative rounded-2xl border border-gray-700 overflow-hidden bg-gradient-to-br ${ex.color} p-6`}>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">{ex.position} · {ex.classYear}</p>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-4xl font-black text-white">{ex.metric}</span>
                  <span className="text-sm text-gray-400 mb-1">{ex.unit}</span>
                </div>

                <div className="space-y-3 mt-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">National Percentile</span>
                      <span className="font-black text-white">{ex.national}th</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${ex.barColor} rounded-full transition-all`} style={{ width: `${ex.national}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Texas Percentile</span>
                      <span className="font-black text-white">{ex.texas}th</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${ex.barColor} rounded-full opacity-70`} style={{ width: `${ex.texas}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500">These are real benchmark ranges from our ratings engine. Your athlete's actual rankings appear on their passport.</p>
        </div>
      </section>

      {/* ── Verified vs Self-Reported ── */}
      <section className="py-16 lg:py-20 bg-black">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">The Verified Difference</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white">College coaches know the difference</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">A PR-VERIFIED seal tells coaches the metrics are real — measured on site by coaches with NFL experience using consistent, pro-style protocols.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Without */}
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6">
              <p className="text-sm font-black text-gray-500 uppercase tracking-widest mb-5">Without PolyRISE</p>
              <div className="space-y-3">
                {WITHOUT.map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <span className="text-sm text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* With */}
            <div className="bg-gradient-to-br from-red-950/40 to-gray-900 rounded-2xl border border-red-700/40 p-6">
              <p className="text-sm font-black text-red-400 uppercase tracking-widest mb-5">With PolyRISE Passport</p>
              <div className="space-y-3">
                {WITH.map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-900/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PR-VERIFIED badge */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6 bg-gray-900 rounded-2xl border border-gray-700 p-6">
            <ProtectedImage
              src="/pr-verified-badge.png"
              alt="PR-VERIFIED Badge"
              className="w-full h-full object-contain"
              containerClassName="w-24 h-24 flex-shrink-0"
            />
            <div>
              <p className="text-lg font-black text-white mb-1">The PR-VERIFIED Seal</p>
              <p className="text-sm text-gray-400 leading-relaxed max-w-lg">Awarded exclusively to athletes who complete PolyRISE programs or camps. Overseen by a board of coaches with NFL and collegiate experience. No self-reported times. No inflated numbers. Built to stand up under recruiter scrutiny.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Instagram / Social ── */}
      <section className="py-16 lg:py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Social Exposure</p>
              <h2 className="text-3xl font-black text-white mb-4">Post your passport. Get seen.</h2>
              <p className="text-gray-400 leading-relaxed mb-4">Every passport includes a downloadable Instagram Story card with your metrics and rankings baked in. Post it, tag <span className="text-purple-400 font-semibold">@polyrisefootball</span>, and we'll repost the best ones to our growing audience of coaches and recruiters.</p>
              <p className="text-gray-400 leading-relaxed">Your story card isn't just a flex — it puts verified numbers in front of anyone who sees it, including coaches who follow the PolyRISE account.</p>
              <div className="mt-6">
                <Link href="/register?program=recruit"
                  className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors">
                  Get Your Passport + Story Card
                </Link>
              </div>
            </div>

            {/* Story card mockup */}
            <div className="flex justify-center">
              <div className="relative w-52 bg-gradient-to-b from-gray-900 to-black rounded-3xl border border-gray-700 overflow-hidden shadow-2xl" style={{ aspectRatio: "9/16" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-red-950/40 via-transparent to-black/80" />
                <div className="relative p-5 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-auto">
                    <div className="text-xs font-black text-red-400 uppercase tracking-widest">PolyRISE</div>
                    <div className="text-xs bg-green-900/50 border border-green-700/50 rounded-full px-2 py-0.5 text-green-400 font-bold">✓ VERIFIED</div>
                  </div>
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-red-600/50 mx-auto mb-2 flex items-center justify-center text-xl">🏈</div>
                    <p className="font-black text-white text-sm">Athlete Name</p>
                    <p className="text-xs text-gray-400">LB · Class of 2027</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-4">
                    {[{ l: "40-Yard", v: "4.65s" }, { l: "Vertical", v: "34\"" }, { l: "Shuttle", v: "4.42s" }, { l: "Broad Jump", v: "108\"" }].map(m => (
                      <div key={m.l} className="bg-white/10 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-400">{m.l}</p>
                        <p className="text-sm font-black text-white">{m.v}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-xs text-gray-500">@polyrisefootball</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-16 lg:py-24 bg-black">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">Pick the passport that fits your athlete</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Every passport starts with a training session. Your first session is all it takes to get your athlete on the board.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Passport */}
            <div className="bg-gray-900 rounded-2xl border-2 border-gray-600 overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/40 mb-4">Middle School & Up</span>
                <h3 className="text-2xl font-black text-gray-300">Passport</h3>
                <div className="flex items-end gap-1 mt-1 mb-3">
                  <span className="text-4xl font-black text-white">$9.99</span>
                  <span className="text-gray-500 text-sm mb-1">/month</span>
                </div>
                <p className="text-gray-400 text-sm mb-5">Track your athlete's progress from day one</p>
                <div className="space-y-2.5">
                  {["Monthly progress reports & charts", "Full session history", "Baseline vs. current comparisons", "Downloadable PDF reports"].map(f => (
                    <div key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-600">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 pb-6">
                <Link href="/register?program=passport" className="block w-full text-center font-bold rounded-xl py-3 text-sm bg-gray-700 hover:bg-gray-600 text-white transition-colors">Get Passport</Link>
              </div>
            </div>

            {/* Recruit — Most Popular */}
            <div className="relative bg-gray-900 rounded-2xl border-2 border-red-500 overflow-hidden flex flex-col">
              <div className="bg-red-600 text-center py-1.5 text-xs font-black tracking-widest text-white">MOST POPULAR</div>
              <div className="p-6 flex-1">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-red-900/50 text-red-300 border border-red-700/40 mb-4">High School · Grades 9–12</span>
                <h3 className="text-2xl font-black text-red-400">Recruit</h3>
                <div className="flex items-end gap-1 mt-1 mb-3">
                  <span className="text-4xl font-black text-white">$29.99</span>
                  <span className="text-gray-500 text-sm mb-1">/month</span>
                </div>
                <p className="text-gray-400 text-sm mb-5">Verified metrics + recruiting profile + visibility</p>
                <div className="space-y-2.5">
                  {["Full athlete metrics tracking", "PR-VERIFIED seal on profile", "Shareable recruiting profile page", "National & Texas percentile rankings", "Coach email template built in", "Instagram Story card download", "Recruiting Roadmap checklist", "1 Free Combine Camp/Month"].map(f => (
                    <div key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-red-500">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 pb-6">
                <Link href="/register?program=recruit" className="block w-full text-center font-bold rounded-xl py-3 text-sm bg-red-600 hover:bg-red-500 text-white transition-colors">Get Recruit</Link>
              </div>
            </div>

            {/* Elite Recruit — Coming Soon */}
            <div className="relative bg-gray-900 rounded-2xl border-2 border-yellow-500 overflow-hidden flex flex-col">
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-black/70 backdrop-blur-sm">
                <span className="text-yellow-400 text-3xl mb-2">🏆</span>
                <p className="text-white font-black text-xl tracking-widest uppercase">Coming Soon</p>
                <p className="text-gray-400 text-xs mt-2 text-center px-6">We're finalizing this package.<br />Check back soon.</p>
              </div>
              <div className="p-6 flex-1">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-yellow-900/50 text-yellow-300 border border-yellow-700/40 mb-4">Upper HS · Grades 11–12</span>
                <h3 className="text-2xl font-black text-yellow-400">Elite Recruit</h3>
                <div className="flex items-end gap-1 mt-1 mb-3">
                  <span className="text-4xl font-black text-white">$49.99</span>
                  <span className="text-gray-500 text-sm mb-1">/month</span>
                </div>
                <p className="text-gray-400 text-sm mb-5">Full recruiting exposure + personal development</p>
                <div className="space-y-2.5">
                  {["Everything in Recruit", "Quarterly Coach Garrett development report", "College program fit suggestions", "Prospect ranking by position & class", "1 Free Combine Camp/Month"].map(f => (
                    <div key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-yellow-500">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 pb-6">
                <button disabled className="block w-full text-center font-bold rounded-xl py-3 text-sm bg-gray-700 text-gray-500 cursor-not-allowed">Coming Soon</button>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">All passport plans include your athlete profile page. Training session required for combine metrics and PR-VERIFIED seal.</p>
        </div>
      </section>

      {/* ── Coaches Board callout ── */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">Who's Behind the Passport</p>
          <h2 className="text-3xl font-black text-white mb-4">Metrics measured by coaches who played at the highest level</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Your athlete's passport is verified by a board of coaches with NFL, CFL, and collegiate experience — the same people who know what combine numbers colleges are actually looking for.</p>
          <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
            {["Kevin Garrett — 7 yrs NFL (Rams, Texans)", "Coach Jordan — XFL Draft, HCU Asst Coach", "Coach Traves — Former Navy Safety & LB", "Coach John — Former Navy QB", "Coach Brayden — Baylor, NFL Draft 2023"].map(c => (
              <span key={c} className="text-sm bg-gray-900 border border-gray-700 text-gray-300 px-4 py-2 rounded-full">{c}</span>
            ))}
          </div>
          <Link href="/" className="text-sm text-red-400 hover:text-red-300 underline">Learn more about the PolyRISE Coaches Board →</Link>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-red-950/40 to-gray-950 border-t border-red-900/30">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Your athlete's passport is one session away.</h2>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">Book a training session. We measure everything. Your passport goes live the same day with verified metrics, national rankings, and all the sharing tools built in.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?program=recruit"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-8 py-4 rounded-xl text-lg transition-colors">
              Get Your Passport
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <Link href="/#contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors">
              Talk to a Coach
            </Link>
          </div>
          <p className="text-xs text-gray-600 mt-6">Questions? Email <a href="mailto:polyrise@polyrisefootball.com" className="text-red-500 hover:text-red-400 underline">polyrise@polyrisefootball.com</a></p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 py-8 bg-black">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={32} height={32} className="object-contain" />
            <span className="text-sm text-gray-500">PolyRISE Football · Dripping Springs, TX</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
            <Link href="/register" className="hover:text-gray-400 transition-colors">Register</Link>
            <Link href="/plans" className="hover:text-gray-400 transition-colors">All Plans</Link>
            <a href="mailto:polyrise@polyrisefootball.com" className="hover:text-gray-400 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-gray-700">© 2026 PolyRISE Football. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
