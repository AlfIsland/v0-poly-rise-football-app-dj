import Link from "next/link"
import Image from "next/image"

const PLANS = [
  {
    name: "Elite Recruit",
    price: "$49.99",
    badge: null,
    badgeColor: "",
    border: "border-yellow-500",
    accentText: "text-yellow-400",
    accentBg: "bg-yellow-500",
    group: "High School Athletes — Grades 11–12",
    groupColor: "bg-yellow-900/50 text-yellow-300 border border-yellow-700/40",
    tagline: "Full recruiting exposure + player development",
    cta: "Get Elite Recruit",
    ctaStyle: "bg-yellow-500 hover:bg-yellow-400 text-black",
    comingSoon: true,
    features: [
      "Everything in Recruit",
      "Quarterly Kevin Garrett development report",
      "College program fit suggestions",
      "Prospect ranking by position & grade",
      "1 Free Combine Camp/Month",
      "Early access to all PolyRISE camps & events",
      "Kevin Garrett (Former NFL) — Dir. of Player Dev",
    ],
  },
  {
    name: "Recruit",
    price: "$29.99",
    badge: "MOST POPULAR",
    badgeColor: "bg-red-600 text-white",
    border: "border-red-500",
    accentText: "text-red-400",
    accentBg: "bg-red-500",
    group: "High School Athletes — Grades 9–12",
    groupColor: "bg-red-900/50 text-red-300 border border-red-700/40",
    tagline: "Verified metrics + recruiting profile + visibility",
    cta: "Get Recruit",
    ctaStyle: "bg-red-600 hover:bg-red-500 text-white",
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
    name: "Passport",
    price: "$9.99",
    badge: null,
    badgeColor: "",
    border: "border-gray-500",
    accentText: "text-gray-300",
    accentBg: "bg-gray-500",
    group: "All Athletes — Middle School & Up",
    groupColor: "bg-blue-900/50 text-blue-300 border border-blue-700/40",
    tagline: "Track your athlete's progress from day one",
    cta: "Get Passport",
    ctaStyle: "bg-gray-700 hover:bg-gray-600 text-white",
    features: [
      "Monthly progress reports & charts",
      "Full session history",
      "Baseline vs. current comparisons",
      "Downloadable PDF reports",
    ],
  },
]

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={48} height={48} className="h-10 w-auto" />
        </Link>
        <Link href="/parent/login" className="text-sm text-gray-400 hover:text-white transition-colors">
          Already a member? Log in
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center pt-14 pb-10 px-6">
        <p className="text-red-500 font-bold text-xs uppercase tracking-widest mb-3">PolyRISE Football</p>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
          Choose Your Plan
        </h1>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto text-base">
          Every athlete is at a different stage. Pick the plan that fits where your child is right now — you can always upgrade later.
        </p>
      </div>

      {/* Grade Guide Banner */}
      <div className="max-w-3xl mx-auto px-6 mb-10">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="py-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1 hidden sm:block">Middle School</p>
            <p className="text-white font-semibold text-xs sm:text-sm">Grades 6–8</p>
            <p className="text-gray-400 mt-1 text-xs sm:text-sm">→ <span className="text-gray-300 font-semibold">Passport</span></p>
          </div>
          <div className="border-l border-r border-gray-700 px-2 py-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1 hidden sm:block">Early High School</p>
            <p className="text-white font-semibold text-xs sm:text-sm">Grades 9–10</p>
            <p className="text-gray-400 mt-1 text-xs sm:text-sm">→ <span className="text-red-400 font-semibold">Recruit</span></p>
          </div>
          <div className="py-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1 hidden sm:block">Upper High School</p>
            <p className="text-white font-semibold text-xs sm:text-sm">Grades 11–12</p>
            <p className="text-gray-400 mt-1 text-xs sm:text-sm">→ <span className="text-yellow-400 font-semibold">Elite Recruit</span></p>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="max-w-5xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-gray-900 rounded-2xl border-2 ${plan.border} flex flex-col overflow-hidden`}
          >
            {plan.badge && (
              <div className={`absolute top-0 left-0 right-0 text-center py-1.5 text-xs font-black tracking-widest ${plan.badgeColor}`}>
                {plan.badge}
              </div>
            )}

            {"comingSoon" in plan && plan.comingSoon && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-black/70 backdrop-blur-sm">
                <span className="text-yellow-400 text-3xl mb-2">🏆</span>
                <p className="text-white font-black text-xl tracking-widest uppercase">Coming Soon</p>
                <p className="text-gray-400 text-xs mt-2 text-center px-6">We&apos;re finalizing this package.<br />Check back soon.</p>
              </div>
            )}

            <div className={`p-6 ${plan.badge ? "pt-10" : ""}`}>
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${plan.groupColor} mb-4`}>
                {plan.group}
              </span>
              <h2 className={`text-2xl font-black ${plan.accentText}`}>{plan.name}</h2>
              <div className="flex items-end gap-1 mt-1 mb-2">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-gray-500 text-sm mb-1">/month</span>
              </div>
              <p className="text-gray-400 text-sm">{plan.tagline}</p>
            </div>

            <div className="border-t border-gray-800 px-6 py-5 flex-1">
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <span className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${plan.accentBg}`}>
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 pb-6 pt-4">
              <Link
                href="/parent/register"
                className={`block w-full text-center font-bold rounded-xl py-3 text-sm transition-colors ${plan.ctaStyle}`}
              >
                {plan.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="text-center pb-12 px-6">
        <p className="text-gray-600 text-xs">
          After registering, your account will be linked to your athlete by a PolyRISE coach.{" "}
          <Link href="/parent/login" className="underline hover:text-gray-400">Already registered? Log in here.</Link>
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Link href="/terms" className="text-gray-700 hover:text-gray-500 text-xs underline">Terms of Service</Link>
          <Link href="/privacy" className="text-gray-700 hover:text-gray-500 text-xs underline">Privacy Policy</Link>
        </div>
      </div>

    </div>
  )
}
