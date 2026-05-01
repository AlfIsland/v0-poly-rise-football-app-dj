import Link from "next/link"
import Image from "next/image"

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Nav */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={48} height={48} className="h-10 w-auto" />
        </Link>
        <Link href="/parent/login" className="text-sm text-gray-400 hover:text-white transition-colors">
          Already a member? Log in →
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center pt-16 pb-12 px-6 max-w-4xl mx-auto">
        <p className="text-red-500 font-black text-xs uppercase tracking-[0.3em] mb-4">PolyRISE Football</p>
        <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.05] mb-6">
          Your Athlete Is Working Hard.<br />
          <span className="text-red-500">Is Anyone Watching?</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Every week athletes train, sweat, and grind — but without verified metrics and a professional profile, college coaches and recruiters simply can&apos;t find them. PolyRISE changes that.
        </p>
      </div>

      {/* The Problem */}
      <div className="bg-white/5 border-y border-white/10 py-12 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-black text-red-500 mb-2">98%</p>
            <p className="text-gray-400 text-sm leading-relaxed">of high school athletes never get seen by a college recruiter — not because they aren&apos;t good enough, but because they&apos;re invisible.</p>
          </div>
          <div>
            <p className="text-4xl font-black text-red-500 mb-2">0</p>
            <p className="text-gray-400 text-sm leading-relaxed">college coaches can verify self-reported metrics. Without a verified seal, your athlete&apos;s times mean nothing to a recruiter.</p>
          </div>
          <div>
            <p className="text-4xl font-black text-red-500 mb-2">1</p>
            <p className="text-gray-400 text-sm leading-relaxed">professional recruiting profile backed by NFL-coached combine data is all it takes to stand out. That&apos;s exactly what we build.</p>
          </div>
        </div>
      </div>

      {/* The Story */}
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-red-500 font-black text-xs uppercase tracking-widest mb-4">The PolyRISE Difference</p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
          We Don&apos;t Just Track Athletes.<br />We Build Their Legacy.
        </h2>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
          PolyRISE was built by coaches who played and coached at the highest level — NFL, XFL, collegiate — coaches who know exactly what scouts look for and what separates a recruited athlete from one who gets overlooked.
        </p>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          Every metric we record is coach-verified. Every profile we build is designed to be found. Every spotlight we post puts your athlete in front of real college programs. This isn&apos;t a highlights app. <strong className="text-white">This is a recruiting machine built for your child.</strong>
        </p>
      </div>

      {/* Grade Guide */}
      <div className="max-w-3xl mx-auto px-6 mb-6">
        <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-4 font-bold">Which plan is right for your athlete?</p>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Middle School</p>
            <p className="text-white font-bold text-sm">Grades 6–8</p>
            <p className="text-gray-400 mt-1 text-xs">→ <span className="text-gray-300 font-semibold">Passport</span></p>
          </div>
          <div className="border-l border-r border-gray-700 px-2">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">High School</p>
            <p className="text-white font-bold text-sm">Grades 9–12</p>
            <p className="text-gray-400 mt-1 text-xs">→ <span className="text-red-400 font-semibold">Recruit</span></p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Upper High School</p>
            <p className="text-white font-bold text-sm">Grades 11–12</p>
            <p className="text-gray-400 mt-1 text-xs">→ <span className="text-yellow-400 font-semibold">Elite Recruit</span></p>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="max-w-5xl mx-auto px-6 pb-8 grid md:grid-cols-3 gap-6">

        {/* Passport */}
        <div className="relative bg-gray-900 rounded-2xl border-2 border-gray-600 flex flex-col overflow-hidden">
          <div className="p-7">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/40 mb-5">Middle School & Up — Grades 6+</span>
            <h2 className="text-3xl font-black text-white mb-1">Passport</h2>
            <p className="text-gray-400 text-sm mb-4">Start the journey. Know the numbers.</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-black text-white">$9.99</span>
              <span className="text-gray-500 text-sm mb-2">/month</span>
            </div>
            <p className="text-gray-600 text-xs">Less than $0.33/day</p>
          </div>

          <div className="bg-gray-800/50 px-7 py-4 mx-0">
            <p className="text-gray-300 text-sm leading-relaxed italic">&ldquo;My kid is in 7th grade — I just want to see how they&apos;re progressing and have a record of their growth.&rdquo; Passport is built for exactly this moment.</p>
          </div>

          <div className="border-t border-gray-800 px-7 py-5 flex-1 space-y-3">
            {[
              "Full athlete metrics dashboard",
              "Monthly progress reports & charts",
              "Baseline vs. current comparisons",
              "Full session history",
              "Downloadable PDF progress reports",
              "Parent portal access — view anytime",
            ].map(f => (
              <div key={f} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-500">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
                {f}
              </div>
            ))}
          </div>
          <div className="px-7 pb-7 pt-5">
            <Link href="/parent/register" className="block w-full text-center font-black rounded-xl py-4 text-sm bg-gray-700 hover:bg-gray-600 text-white transition-colors tracking-wide">
              Start with Passport
            </Link>
          </div>
        </div>

        {/* Recruit — Most Popular */}
        <div className="relative bg-gray-900 rounded-2xl border-2 border-red-500 flex flex-col overflow-hidden shadow-2xl shadow-red-900/30 scale-[1.02]">
          <div className="bg-red-600 text-white text-center py-2 text-xs font-black tracking-[0.2em] uppercase">⭐ MOST POPULAR</div>
          <div className="p-7">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-red-900/50 text-red-300 border border-red-700/40 mb-5">High School Athletes — Grades 9–12</span>
            <h2 className="text-3xl font-black text-red-400 mb-1">Recruit</h2>
            <p className="text-gray-400 text-sm mb-4">Get seen. Get verified. Get recruited.</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-black text-white">$29.99</span>
              <span className="text-gray-500 text-sm mb-2">/month</span>
            </div>
            <p className="text-gray-600 text-xs">Less than $1/day for a shot at a college scholarship</p>
          </div>

          <div className="bg-red-950/40 border-y border-red-900/40 px-7 py-4">
            <p className="text-red-200 text-sm leading-relaxed italic">&ldquo;College coaches don&apos;t have time to find athletes — they need athletes to come to them with verified numbers and a professional profile. That&apos;s exactly what Recruit gives your child.&rdquo;</p>
            <p className="text-red-400 text-xs mt-2 font-semibold">— Coach Kevin Garrett, Former NFL</p>
          </div>

          <div className="border-t border-gray-800 px-7 py-5 flex-1 space-y-3">
            {[
              "Everything in Passport",
              "PR-VERIFIED seal — coach-confirmed metrics",
              "Professional shareable recruiting profile",
              "Hudl film linked directly to your profile",
              "Monthly X (Twitter) spotlight to college recruiters",
              "1 Free Combine Camp per month",
              "Profile visible to PolyRISE recruiting network",
            ].map(f => (
              <div key={f} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-red-500">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
                {f}
              </div>
            ))}
          </div>
          <div className="px-7 pb-7 pt-5">
            <Link href="/parent/register" className="block w-full text-center font-black rounded-xl py-4 text-sm bg-red-600 hover:bg-red-500 text-white transition-colors tracking-wide">
              Get Recruit — $29.99/mo
            </Link>
          </div>
        </div>

        {/* Elite Recruit — Coming Soon */}
        <div className="relative bg-gray-900 rounded-2xl border-2 border-yellow-500 flex flex-col overflow-hidden">
          {/* Coming Soon overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-black/75 backdrop-blur-sm">
            <span className="text-5xl mb-3">🏆</span>
            <p className="text-white font-black text-2xl tracking-widest uppercase mb-2">Coming Soon</p>
            <p className="text-gray-400 text-sm text-center px-8 leading-relaxed">We&apos;re putting the finishing touches on our most powerful package. Check back soon.</p>
            <div className="mt-4 px-6 py-2 rounded-full border border-yellow-500/50 text-yellow-400 text-xs font-bold tracking-widest">ELITE RECRUIT</div>
          </div>
          <div className="p-7">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-yellow-900/50 text-yellow-300 border border-yellow-700/40 mb-5">High School Athletes — Grades 11–12</span>
            <h2 className="text-3xl font-black text-yellow-400 mb-1">Elite Recruit</h2>
            <p className="text-gray-400 text-sm mb-4">Maximum exposure. NFL-level development.</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-black text-white">$49.99</span>
              <span className="text-gray-500 text-sm mb-2">/month</span>
            </div>
          </div>
          <div className="border-t border-gray-800 px-7 py-5 flex-1 space-y-3">
            {[
              "Everything in Recruit",
              "Quarterly 1-on-1 Kevin Garrett development report",
              "College program fit analysis by position & grade",
              "Prospect ranking among PolyRISE athletes",
              "1 Free Combine Camp per month",
              "Early access to all PolyRISE camps & events",
              "Direct line to Kevin Garrett — Former NFL",
            ].map(f => (
              <div key={f} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-yellow-500">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
                {f}
              </div>
            ))}
          </div>
          <div className="px-7 pb-7 pt-5">
            <button disabled className="block w-full text-center font-black rounded-xl py-4 text-sm bg-yellow-500/40 text-yellow-200/50 cursor-not-allowed tracking-wide">
              Coming Soon
            </button>
          </div>
        </div>

      </div>

      {/* Why This Works */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-center text-red-500 font-black text-xs uppercase tracking-widest mb-4">Why It Works</p>
        <h2 className="text-center text-3xl md:text-4xl font-black text-white mb-12">Built by coaches who&apos;ve been on both sides of the recruiting table.</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🔴</div>
            <h3 className="font-black text-white text-lg mb-2">PR-VERIFIED Seal</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Every metric is recorded by a PolyRISE coach on-site using pro-combine protocols. No self-reported numbers. No inflated times. Just the truth — and that&apos;s what scouts respect.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-black text-white text-lg mb-2">Real Progress Tracking</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Parents get a clear picture of how their athlete is developing — session by session, month by month — with charts, comparisons, and downloadable reports to share anywhere.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📡</div>
            <h3 className="font-black text-white text-lg mb-2">Recruiting Visibility</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Monthly X spotlights put your athlete in front of college programs. A shareable profile with verified metrics means coaches can find your child — and trust what they see.</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-red-950/40 border-y border-red-900/40 py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">The window to get recruited is short.<br /><span className="text-red-400">Don&apos;t let it close.</span></h2>
        <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto mb-8">High school goes fast. Junior year comes faster. The athletes who get recruited are the ones who started building their profile early — with real numbers and real visibility.</p>
        <Link href="/parent/register" className="inline-block bg-red-600 hover:bg-red-500 text-white font-black text-lg px-10 py-4 rounded-xl transition-colors tracking-wide shadow-lg shadow-red-900/40">
          Register Your Athlete Today
        </Link>
        <p className="text-gray-600 text-xs mt-4">After registering, a PolyRISE coach will link your account to your athlete. Questions? <a href="mailto:polyrise@polyrisefootball.com" className="text-red-500 hover:text-red-400 underline">polyrise@polyrisefootball.com</a></p>
      </div>

      {/* Footer */}
      <div className="text-center py-10 px-6 space-y-3">
        <p className="text-gray-600 text-xs">
          Already registered?{" "}
          <Link href="/parent/login" className="underline hover:text-gray-400">Log in to your portal here.</Link>
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/terms" className="text-gray-700 hover:text-gray-500 text-xs underline">Terms of Service</Link>
          <Link href="/privacy" className="text-gray-700 hover:text-gray-500 text-xs underline">Privacy Policy</Link>
        </div>
        <p className="text-gray-700 text-xs">PolyRISE Football · Dripping Springs, TX · polyrisefootball.com</p>
      </div>

    </div>
  )
}
