import { ArrowRight, Trophy, Users, Target, MapPin, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ProtectedImage } from "@/components/protected-image"


export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/poly-rise-logo.png"
                alt="PolyRISE Athletix Logo"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
              <span className="font-display font-bold text-xl hidden sm:inline">PolyRISE Athletix</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="#programs"
                className="text-sm font-medium text-white hover:text-foreground transition-colors hidden md:inline"
              >
                Programs
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-white hover:text-foreground transition-colors hidden md:inline"
              >
                About
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium text-white hover:text-foreground transition-colors hidden md:inline"
              >
                Contact
              </Link>
              <Link
                href="/passport"
                className="text-sm font-medium text-white hover:text-foreground transition-colors hidden md:inline"
              >
                Athlete Passport
              </Link>
              <Link
                href="/plans"
                className="text-sm font-medium bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors"
              >
                View Plans
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight text-balance">
                Elite Youth Multi-Sport Athlete Development for{" "}
                <span className="text-white">Austin & Central Texas</span>
              </h1>

              <p className="text-lg lg:text-xl text-white leading-relaxed text-pretty">
                Professional level training in football, soccer, baseball, softball, girls flag football, wrestling and more — plus expert recruiting & exposure for H.S. athletes with trusted PR-VERIFIED metrics.
              </p>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border bg-muted">
                <Image
                  src="/combine-training-athletes.jpg"
                  alt="Youth athlete training at PolyRISE Athletix"
                  width={800}
                  height={1000}
                  priority
                  quality={85}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg">Elite Training</div>
                    <div className="text-sm text-white">Professional Coaching</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans & Pricing */}
      <section id="programs" className="py-12 lg:py-20 bg-gray-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-4">
            <p className="text-red-500 font-bold text-xs uppercase tracking-widest mb-3">PolyRISE Athletix</p>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white">Plans & Pricing</h2>
            <p className="text-lg text-white mt-3 max-w-xl mx-auto">Every athlete is at a different stage. Pick the plan that fits where your child is right now.</p>
          </div>

          {/* Grade Guide */}
          <div className="max-w-2xl mx-auto mb-10 mt-8">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 grid grid-cols-3 gap-3 text-center text-sm">
              <div>
                <p className="text-white text-xs uppercase tracking-widest mb-1">Middle School</p>
                <p className="text-white font-semibold">Grades 6–8</p>
                <p className="text-white mt-1 text-xs">→ <span className="text-white font-semibold">Passport</span></p>
              </div>
              <div className="border-l border-r border-gray-700 px-2">
                <p className="text-white text-xs uppercase tracking-widest mb-1">High School</p>
                <p className="text-white font-semibold">Grades 9–12</p>
                <p className="text-white mt-1 text-xs">→ <span className="text-red-400 font-semibold">Recruit</span></p>
              </div>
              <div>
                <p className="text-white text-xs uppercase tracking-widest mb-1">Upper HS</p>
                <p className="text-white font-semibold">Grades 11–12</p>
                <p className="text-white mt-1 text-xs">→ <span className="text-yellow-400 font-semibold">Elite Recruit</span></p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Passport */}
            <div className="relative bg-gray-900 rounded-2xl border-2 border-gray-500 flex flex-col overflow-hidden">
              <div className="p-6">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/40 mb-4">All Athletes — Middle School &amp; Up</span>
                <h3 className="text-2xl font-black text-white">Passport</h3>
                <div className="flex items-end gap-1 mt-1 mb-2">
                  <span className="text-4xl font-black text-white">$9.99</span>
                  <span className="text-white text-sm mb-1">/month</span>
                </div>
                <p className="text-white text-sm">Track your athlete&apos;s progress from day one</p>
              </div>
              <div className="border-t border-gray-800 px-6 py-5 flex-1 space-y-3">
                {["Monthly progress reports & charts","Full session history","Baseline vs. current comparisons","Downloadable PDF reports"].map(f => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-white">
                    <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-500">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    {f}
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6 pt-4">
                <Link href="/parent/register" className="block w-full text-center font-bold rounded-xl py-3 text-sm bg-gray-700 hover:bg-gray-600 text-white transition-colors">Get Passport</Link>
              </div>
            </div>

            {/* Recruit — Most Popular */}
            <div className="relative bg-gray-900 rounded-2xl border-2 border-red-500 flex flex-col overflow-hidden">
              <div className="absolute top-0 left-0 right-0 text-center py-1.5 text-xs font-black tracking-widest bg-red-600 text-white">MOST POPULAR</div>
              <div className="p-6 pt-10">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-red-900/50 text-red-300 border border-red-700/40 mb-4">High School Athletes — Grades 9–12</span>
                <h3 className="text-2xl font-black text-red-400">Recruit</h3>
                <div className="flex items-end gap-1 mt-1 mb-2">
                  <span className="text-4xl font-black text-white">$29.99</span>
                  <span className="text-white text-sm mb-1">/month</span>
                </div>
                <p className="text-white text-sm">Verified metrics + recruiting profile + visibility</p>
              </div>
              <div className="border-t border-gray-800 px-6 py-5 flex-1 space-y-3">
                {["Full athlete metrics tracking","PR-VERIFIED seal on profile","Shareable recruiting profile page","Hudl film linked to profile","Monthly X spotlight to college recruiters","1 Free Combine Camp/Month"].map(f => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-white">
                    <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-red-500">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    {f}
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6 pt-4">
                <Link href="/parent/register" className="block w-full text-center font-bold rounded-xl py-3 text-sm bg-red-600 hover:bg-red-500 text-white transition-colors">Get Recruit</Link>
              </div>
            </div>

            {/* Elite Recruit — Coming Soon */}
            <div className="relative bg-gray-900 rounded-2xl border-2 border-yellow-500 flex flex-col overflow-hidden">
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-black/70 backdrop-blur-sm">
                <span className="text-yellow-400 text-3xl mb-2">🏆</span>
                <p className="text-white font-black text-xl tracking-widest uppercase">Coming Soon</p>
                <p className="text-white text-xs mt-2 text-center px-6">We&apos;re finalizing this package.<br />Check back soon.</p>
              </div>
              <div className="p-6">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-yellow-900/50 text-yellow-300 border border-yellow-700/40 mb-4">High School Athletes — Grades 11–12</span>
                <h3 className="text-2xl font-black text-yellow-400">Elite Recruit</h3>
                <div className="flex items-end gap-1 mt-1 mb-2">
                  <span className="text-4xl font-black text-white">$49.99</span>
                  <span className="text-white text-sm mb-1">/month</span>
                </div>
                <p className="text-white text-sm">Full recruiting exposure + player development</p>
              </div>
              <div className="border-t border-gray-800 px-6 py-5 flex-1 space-y-3">
                {["Everything in Recruit","Quarterly Kevin Garrett development report","College program fit suggestions","Prospect ranking by position & grade","1 Free Combine Camp/Month","Early access to all PolyRISE camps & events"].map(f => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-white">
                    <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-yellow-500">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    {f}
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6 pt-4">
                <Link href="/parent/register" className="block w-full text-center font-bold rounded-xl py-3 text-sm bg-yellow-500 hover:bg-yellow-400 text-black transition-colors">Get Elite Recruit</Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/plans" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-colors text-sm">
              View Full Plan Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Training Programs */}
          <div className="mt-16 pt-12 border-t border-gray-800">
            <div className="mb-10">
              <h3 className="text-3xl lg:text-4xl font-display font-bold text-white">Training Programs</h3>
              <p className="text-lg text-white mt-2">In-person training packages designed for every level of commitment</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Player Development */}
              <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
                <div className="aspect-video relative overflow-hidden">
                  <img src="/athlete-training-drill.jpg" alt="Player Development Training" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-sm font-medium">Most Popular</div>
                </div>
                <div className="pt-6 px-6 pb-6 space-y-4">
                  <div>
                    <h4 className="text-xl font-display font-bold mb-2">Football Player Development</h4>
                    <p className="text-white text-sm leading-relaxed mb-4">Tuesday &amp; Thursday (6:30–7:30pm) including SAQ, S&amp;C, football drills, tournament entries, military character building events, PR-Verified Camp and Free Athletic Training Passport (Tracker).</p>
                    <div className="space-y-2 border-t border-dashed border-border pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Monthly</span>
                        <span className="text-lg font-bold text-white">$315/mo</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Annual <span className="text-xs text-primary font-semibold">Save more</span></span>
                        <span className="text-lg font-bold text-white">$250/mo</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Once a Week</span>
                        <span className="text-lg font-bold text-white">$175/mo</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Drop-In</span>
                        <span className="text-lg font-bold text-white">$40</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/register?program=player-dev" className="block w-full text-center bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors">Register</Link>
                </div>
              </div>

              {/* Multi-Sport Development */}
              <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors relative">
                <div className="aspect-video relative overflow-hidden">
                  <img src="/elite-360-training.jpg" alt="Multi-Sport Development Training" className="w-full h-full object-cover object-[50%_35%] group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="pt-6 px-6 pb-6 space-y-4">
                  <div>
                    <h4 className="text-xl font-display font-bold mb-2">Multi-Sport Development</h4>
                    <div className="text-lg font-bold text-white mb-3">$265/mo</div>
                    <p className="text-white text-sm leading-relaxed">Youth sports development training covering wrestling, girls flag football, soccer, baseball, softball, and more — building well-rounded athletes across multiple sports.</p>
                  </div>
                  <Link href="/register?program=multi-sport-dev" className="block w-full text-center bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors">Register</Link>
                </div>
              </div>

              {/* HS Athlete Recruiting & Exposure */}
              <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
                <div className="pt-6 px-6 pb-6 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                      <span className="text-sm font-medium text-primary">High School</span>
                    </div>
                    <h4 className="text-xl font-display font-bold mb-1">HS Athlete Recruiting & Exposure</h4>
                    <p className="text-white text-sm leading-relaxed mb-4">Professional recruiting exposure packages built to get your athlete seen by college coaches — social media blasts, personalized coach outreach, and profile optimization.</p>
                    <div className="space-y-3">
                      {/* Elite Exposure */}
                      <div className="rounded-lg border border-primary/40 bg-primary/5 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white text-sm">Elite Exposure</span>
                          <span className="text-lg font-bold text-red-500">$150<span className="text-xs font-normal text-white">/mo</span></span>
                        </div>
                        <ul className="space-y-1">
                          <li className="flex items-start gap-2 text-xs text-white"><CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />X (Twitter) blast + Instagram blast</li>
                          <li className="flex items-start gap-2 text-xs text-white"><CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />5 personalized emails to college coaches/mo</li>
                          <li className="flex items-start gap-2 text-xs text-white"><CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />Profile optimization</li>
                        </ul>
                        <p className="text-xs text-gray-400 mt-2 italic">Best for: Serious recruits</p>
                      </div>
                      {/* Pro Exposure */}
                      <div className="rounded-lg border border-border bg-card p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white text-sm">Pro Exposure</span>
                          <span className="text-lg font-bold text-red-500">$125<span className="text-xs font-normal text-white">/mo</span></span>
                        </div>
                        <ul className="space-y-1">
                          <li className="flex items-start gap-2 text-xs text-white"><CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />X (Twitter) blast + Instagram blast</li>
                          <li className="flex items-start gap-2 text-xs text-white"><CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />3 personalized emails to college coaches/mo</li>
                          <li className="flex items-start gap-2 text-xs text-white"><CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />Profile optimization</li>
                        </ul>
                        <p className="text-xs text-gray-400 mt-2 italic">Best for: Recruits targeting strong exposure</p>
                      </div>
                      {/* Basic Exposure */}
                      <div className="rounded-lg border border-border bg-card p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white text-sm">Basic Exposure</span>
                          <span className="text-lg font-bold text-red-500">$85<span className="text-xs font-normal text-white">/mo</span></span>
                        </div>
                        <ul className="space-y-1">
                          <li className="flex items-start gap-2 text-xs text-white"><CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />Professional profile image package</li>
                          <li className="flex items-start gap-2 text-xs text-white"><CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />X (Twitter) blast (1–2x monthly)</li>
                        </ul>
                        <p className="text-xs text-gray-400 mt-2 italic">Best for: Athletes testing the waters or building initial visibility</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/register?program=hs-recruiting-exposure" className="block w-full text-center bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors">Get Started</Link>
                </div>
              </div>

              {/* Girls Player Development */}
              <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
                <div className="pt-6 px-6 pb-6 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                      <span className="text-sm font-medium text-primary">Girls Program</span>
                    </div>
                    <h4 className="text-xl font-display font-bold mb-2">Girls Player Development</h4>
                    <p className="text-white text-sm leading-relaxed mb-2">Monday &amp; Friday (5–6:30pm) in May · June &amp; July: Mon &amp; Fri (1–2:30pm). Add Wednesday for more reps and faster development.</p>
                    <div className="space-y-2 border-t border-dashed border-border pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">2 Days a Week · Mon &amp; Fri</span>
                        <span className="text-lg font-bold text-white">$250/mo</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">3 Days a Week · Mon, Wed &amp; Fri</span>
                        <span className="text-lg font-bold text-white">$315/mo</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/register?program=girls-dev" className="block w-full text-center bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors">Register</Link>
                </div>
              </div>

              {/* Multi-Sport Athlete */}
              <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
                <div className="pt-6 px-6 pb-6 space-y-4">
                  <div>
                    <h4 className="text-xl font-display font-bold mb-2">Multi-Sport Athlete</h4>
                    <div className="text-lg font-bold text-white mb-3">$175/mo</div>
                    <p className="text-white text-sm leading-relaxed">One day a week (Tue or Thur) with camps/events included.</p>
                  </div>
                  <Link href="/register?program=multi-sport" className="block w-full text-center bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors">Register</Link>
                </div>
              </div>

              {/* Drop-In */}
              <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
                <div className="pt-6 px-6 pb-6 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                      <span className="text-sm font-medium text-primary">Drop-In</span>
                    </div>
                    <h4 className="text-xl font-display font-bold mb-2">Drop-In Training</h4>
                    <p className="text-white text-sm leading-relaxed mb-2">Try a session before committing to a full program. Add a second day for just $35 more.</p>
                    <div className="space-y-2 border-t border-dashed border-border pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">1 Day</span>
                        <span className="text-lg font-bold text-white">$45</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">2 Days</span>
                        <span className="text-lg font-bold text-white">$80</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/register?program=drop-in-1day" className="block w-full text-center bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors">Register</Link>
                </div>
              </div>

              {/* Leadership & Mentorship Hike */}
              <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
                <div className="pt-6 px-6 pb-6 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                      <span className="text-sm font-medium text-primary">Leadership</span>
                    </div>
                    <h4 className="text-xl font-display font-bold mb-2">Leadership &amp; Mentorship Hike</h4>
                    <p className="text-white text-sm leading-relaxed mb-2">A character-building hike experience focused on developing leadership, mentorship, and mental toughness beyond the field.</p>
                    <div className="flex items-center justify-between border-t border-dashed border-border pt-4">
                      <span className="font-medium text-sm">Per Athlete</span>
                      <span className="text-lg font-bold text-white">$25</span>
                    </div>
                  </div>
                  <Link href="/register?program=hike" className="block w-full text-center bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors">Register</Link>
                </div>
              </div>

              {/* Tackling Camp */}
              <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
                <div className="pt-6 px-6 pb-6 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                      <span className="text-sm font-medium text-primary">Camp</span>
                    </div>
                    <h4 className="text-xl font-display font-bold mb-2">Tackling Camp</h4>
                    <p className="text-white text-sm leading-relaxed mb-2">Proper tackling technique &amp; fundamentals coached by NFL-experienced staff.</p>
                    <div className="flex items-center justify-between border-t border-dashed border-border pt-4">
                      <span className="font-medium text-sm">June 12 · 9:00am · Dripping Springs</span>
                      <span className="text-lg font-bold text-white">$25</span>
                    </div>
                  </div>
                  <Link href="/register?program=tackling-camp" className="block w-full text-center bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors">Register</Link>
                </div>
              </div>

              {/* PR-VERIFIED Combine Camp */}
              <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
                <div className="pt-6 px-6 pb-6 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                      <span className="text-sm font-medium text-primary">Camp</span>
                    </div>
                    <h4 className="text-xl font-display font-bold mb-2">Combine Metrics Camp</h4>
                    <p className="text-white text-sm leading-relaxed mb-2">Professional Combine Events. H.S Athletes record official metrics.</p>
                    <div className="flex items-center justify-between border-t border-dashed border-border pt-4">
                      <span className="font-medium">Camp Registration</span>
                      <span className="text-lg font-bold text-white">$25</span>
                    </div>
                  </div>
                  <Link href="/register?program=combine" className="block w-full text-center bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors">Register</Link>
                </div>
              </div>

              {/* Summer Camp */}
              <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors lg:col-span-3">
                <div className="pt-6 px-6 pb-6 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                      <span className="text-sm font-medium text-primary">Summer Camp</span>
                    </div>
                    <h4 className="text-xl font-display font-bold mb-2">Summer Camp</h4>
                    <p className="text-white text-sm leading-relaxed mb-2">Athlete Development &amp; Leadership (June &amp; July) — <span className="text-white font-semibold">Limited to 20 spots ONLY</span></p>
                    <div className="border-t border-dashed border-border pt-4">
                      <div><div className="flex items-center justify-between"><span className="font-medium">Athletic Camp</span><span className="text-lg font-bold text-white">$265/mo</span></div><p className="text-xs text-white mt-1">Open to all Elementary &amp; Middle School athletes · Mon, Tue &amp; Thu · 10:00am – 12:00pm (noon)</p></div>
                    </div>
                  </div>
                  <Link href="/register?program=summer-ms" className="block w-full text-center bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors">Register Now</Link>
                </div>
              </div>

              {/* Recruiting — Kevin Garrett */}
              <div className="bg-card border-primary/50 border-2 overflow-hidden lg:col-span-3">
                <div className="pt-6 px-6 pb-6 space-y-4">
                  <div className="text-center">
                    <h4 className="text-4xl lg:text-5xl font-display font-bold mb-4">Recruiting</h4>
                    <h5 className="text-xl font-display font-bold mb-1 text-white">Kevin Garrett</h5>
                    <p className="text-xs text-white font-semibold mb-3">Former NFL | COO / Director of PolyRISE Athletix Recruiting</p>
                    <p className="text-white text-sm leading-relaxed max-w-3xl mx-auto">With extensive experience in football recruiting, Kevin leads all operations at PolyRISE Athletix Recruiting. He personally oversees player profiles, college outreach strategies, and ensures every athlete receives high-quality exposure to the right college programs. Kevin is passionate about helping student-athletes navigate the recruiting process and has helped dozens of players earn opportunities at the collegiate level.</p>
                    <p className="text-sm text-white mt-3">Contact Kevin directly: <a href="mailto:KG@polyrisefootball.com" className="text-red-500 underline hover:text-red-400">KG@polyrisefootball.com</a> · <a href="mailto:polyrise@polyrisefootball.com" className="text-red-500 underline hover:text-red-400">polyrise@polyrisefootball.com</a></p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <img src="/recruiting-athlete-1.jpeg" alt="Athlete Introduction Example - James Cabarrus III" className="w-48 h-auto rounded-lg border border-primary/20" />
                    <img src="/recruiting-athlete-2.jpeg" alt="Athlete Introduction Example - Gevariah Kneubuhl" className="w-48 h-auto rounded-lg border border-primary/20" />
                  </div>
                  <div className="text-center">
                    <Link href="#contact" className="inline-block bg-[#FF6600] text-white px-8 py-3 rounded hover:bg-[#FF6600]/80 transition-colors font-semibold">Get Started with Recruiting</Link>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* PolyRISE Athletix Coaches Board Section */}
      <section className="py-10 lg:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4 text-balance">
              PolyRISE Athletix Coaches Board
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Learn from coaches with professional playing experience at the highest levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-primary">
                <img src="/coach-garrett.jpg" alt="Head Coach Kevin Garrett - St. Louis Rams #21" className="w-full h-full object-cover object-top" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Head Coach Garrett</h3>
              <p className="text-xs text-primary font-semibold mb-2">DB Coach</p>
              <p className="text-xs text-white">7 yrs NFL (Rams, Texans), 3 yrs CFL, Drafted 2003 from SMU</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-primary">
                <img src="/coach-jordan.jpg" alt="Coach Jordan - Omaha Beef #18" className="w-full h-full object-cover object-top" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Coach Jordan</h3>
              <p className="text-xs text-primary font-semibold mb-2">WR/TE</p>
              <p className="text-xs text-white">XFL Draft 2022, Omaha Beef 2X Champion, HCU Assistant WR Coach</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary/20">
                <img src="/coach-traves.jpg" alt="Coach Traves - Former Navy Safety and LB" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Coach Traves</h3>
              <p className="text-xs text-primary font-semibold mb-2">RB/S</p>
              <p className="text-xs text-white">Former Navy Safety & LB, All-East Teams 2011-12, Citadel Football</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary/20">
                <img src="/coach-john.jpg" alt="Coach John - Former Navy Football QB" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Coach John</h3>
              <p className="text-xs text-primary font-semibold mb-2">QB</p>
              <p className="text-xs text-white">Former Navy Football QB, Naval Academy Graduate & Officer</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary/20">
                <img src="/coach-brayden.jpg" alt="Coach Brayden - Baylor Football, NFL Draft, IFL All-Pro" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Coach Brayden</h3>
              <p className="text-xs text-primary font-semibold mb-2">LB/DL</p>
              <p className="text-xs text-white">Baylor 18-21, NFL Draft 2023, IFL All-Pro & League Champion 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* PR-VERIFIED Section */}
      <section className="py-8 lg:py-12 bg-black text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="text-center md:text-left max-w-3xl">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4 text-balance">
                PR-VERIFIED <span className="text-xl lg:text-2xl font-normal text-white">(Seal of Authenticity)</span>
              </h2>
              <p className="text-base lg:text-lg text-white mb-4 leading-relaxed">
                The PR-VERIFIED seal is awarded exclusively to athletes who complete PolyRISE Athletix programs, camps, or tryouts. Overseen by a board of coaches with NFL and collegiate playing/coaching experience conducts standardized, pro-style combine testing using consistent protocols and multiple trials for maximum reliability. This seal certifies that the athlete&apos;s metrics were directly measured and verified by our team on-site. No self-reported times or inflated numbers. The data is accurate, unbiased, and built to stand up under recruiter scrutiny.
              </p>
              <div className="mb-4">
                <p className="text-white font-semibold mb-2">Tested Events Include:</p>
                <ul className="text-white text-sm lg:text-base space-y-1 list-disc list-inside">
                  <li>40-Yard Dash</li>
                  <li>Broad Jump</li>
                  <li>Vertical Jump</li>
                  <li>3-Cone Drill (L-Drill)</li>
                  <li>5-10-5 Shuttle (Pro-Agility/Short Shuttle)</li>
                  <li>Skill-specific evaluations: Catching, Throwing, Footwork, and position drills</li>
                </ul>
              </div>
              <p className="text-base lg:text-lg text-white leading-relaxed">
                Athletes earning the PR-VERIFIED seal receive official documentation and a digital badge they can display on recruiting profiles. This gives coaches and scouts immediate confidence that the numbers are real and PolyRISE-vetted.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center mb-4 gap-3">
                <Link
                  href="/plans"
                  className="text-base font-semibold bg-[#FF6600] text-white px-6 py-3 rounded hover:bg-[#FF6600]/80 transition-colors text-center"
                >
                  Athlete Tracking Passport & Recruiting
                </Link>
                <Link
                  href="/free-profile"
                  className="text-base font-semibold bg-green-700 text-white px-6 py-3 rounded hover:bg-green-800 transition-colors text-center"
                >
                  Get Your FREE Athlete Profile
                </Link>
                <span className="text-sm text-white italic mt-1">Athlete&apos;s Performance Journey</span>
              </div>
              <ProtectedImage
                src="/pr-verified-badge.png"
                alt="PolyRISE PR-VERIFIED Badge - Copyright 2026 PolyRISE Athletix All Rights Reserved"
                className="w-full h-full object-contain"
                containerClassName="w-48 h-48 md:w-64 md:h-64 flex-shrink-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-balance">About PolyRISE Athletix</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border-border">
              <div className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold">Athletic Excellence</h3>
                <p className="text-white leading-relaxed">
                  Top-tier training with NFL experience staff, including Speed, Agility, Quickness (SAQ) and Strength &
                  Conditioning (S&C) programs designed to maximize potential.
                </p>
              </div>
            </div>

            <div className="bg-card border-border">
              <div className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-display font-bold">Character Development</h3>
                <p className="text-white leading-relaxed">
                  Building discipline, leadership, and integrity through military character building events and
                  structured programs that emphasize growth beyond the game.
                </p>
              </div>
            </div>

            <div className="bg-card border-border">
              <div className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold">Complete Development</h3>
                <p className="text-white leading-relaxed">
                  Film study, college visits, NIL & financial literacy classes, and tournament opportunities to prepare
                  athletes for the next level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-white">Everything you need to know about PolyRISE Athletix</p>
            </div>

            <div className="space-y-6">
              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">What age groups does PolyRISE Athletix train?</h3>
                  <p className="text-white leading-relaxed">
                    PolyRISE Athletix provides elite training for K-12 athletes, including youth, middle school, and
                    high school players. Our programs are designed to develop athletes at every level, from beginners to
                    those preparing for college recruitment.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">Where is PolyRISE Athletix located?</h3>
                  <p className="text-white leading-relaxed">
                    PolyRISE Athletix is based in Dripping Springs, Texas (Austin area), with training sessions held at Swift Sessions and local fields. We are expanding to other cities nationwide. Contact us to find out when we&apos;re coming to your location.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">What is included in the Player Development program?</h3>
                  <p className="text-white leading-relaxed">
                    Player Development ($300/month) includes 2 training sessions weekly, (PolyRISE tee after 3 months), SAQ, S&C training, football drills, monthly camp/tryout, leadership event, film study.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">What makes 360 Elite different from Player Development?</h3>
                  <p className="text-white leading-relaxed">
                    360 Elite ($500/month) includes everything in Player Development plus a recruiting profile, 7 email blasts a month, one-on-one coaching from NFL
                    experience staff, weekly film study, unlimited free camps, monthly character building events,
                    college visits, NIL & financial literacy classes, and discounts at affiliated sports medicine and
                    nutrition shops.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">What is the training schedule?</h3>
                  <p className="text-white leading-relaxed">
                    Tuesday 6:30-7:45pm and Thursday 6:30-7:45pm intense player development. Monthly camp/tryout and a monthly leadership event on Saturday or Sunday.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">Does PolyRISE Athletix have coaches with NFL experience?</h3>
                  <p className="text-white leading-relaxed">
                    Yes, PolyRISE Athletix has coaches with NFL experience on staff who provide one-on-one coaching,
                    film study, and advanced training for athletes in the 360 Elite program.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">What is SAQ and S&C training?</h3>
                  <p className="text-white leading-relaxed">
                    SAQ stands for Speed, Agility, and Quickness training - focused on improving footwork, reaction
                    time, and movement efficiency. S&C stands for Strength and Conditioning - building physical power,
                    endurance, and injury prevention through targeted exercises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">Our Sponsors</h2>
            <p className="text-lg text-white max-w-2xl mx-auto leading-relaxed">
              We are grateful for the support that help make our program possible.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            <div className="w-44 h-40 rounded-lg border-2 border-primary/20 bg-white flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors p-4">
              <img src="/sponsor-sgm.png" alt="SGM Sponsor" className="w-full h-full object-contain" />
            </div>
            <div className="w-44 h-40 rounded-lg border-2 border-primary/20 bg-white flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors p-4">
              <img src="/sponsor-grease-monkey.png" alt="Grease Monkey - Oil Changes & More" className="w-full h-full object-contain" />
            </div>
            <div className="w-44 h-40 rounded-lg border-2 border-primary/20 bg-white flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors p-4">
              <img src="/sponsor-swift-sessions.png" alt="Swift Sessions" className="w-full h-full object-contain" />
            </div>
            <div className="w-44 h-40 rounded-lg border-2 border-primary/20 bg-white flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors p-4">
              <img src="/sponsor-main-design.png" alt="Main Design Print Co." className="w-full h-full object-contain" />
            </div>
            <div className="w-44 h-40 rounded-lg border-2 border-primary/20 bg-white flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors p-4">
              <img src="/sponsor-longhorn-mobile-detailing.jpg" alt="Longhorn Mobile Detailing" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-white mb-4">Interested in becoming a sponsor?</p>
            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-display font-bold mb-4">Send Message</h2>
                <p className="text-lg text-white leading-relaxed">
                  Do you have questions or comments about our youth football program and improving your football skills?
                  Send me a message, and I will get back to you soon.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Location</div>
                    <div className="text-white">Dripping Springs, Texas (Austin area)</div>
                    <div className="text-sm text-white">
                      Training at Swift Sessions and local fields. Expanding to other cities nationwide.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1 text-white">WhatsApp</div>
                    <a href="https://wa.me/18176583300" className="text-white hover:underline">+1 (817) 658-3300</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1 text-white">Email</div>
                    <a href="mailto:polyrise@polyrisefootball.com" className="text-white hover:underline block">polyrise@polyrisefootball.com</a>
                    <a href="mailto:kg@polyrisefootball.com" className="text-white hover:underline block">kg@polyrisefootball.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1 text-white">Phone</div>
                    <a href="tel:+18176583300" className="text-white hover:underline">+1 (817) 658-3300</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border-border">
              <div className="pt-6">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <input id="name" type="text" className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email *</label>
                    <input id="email" type="email" required className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <textarea id="message" rows={6} className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Your message..." />
                  </div>
                  <button type="submit" className="w-full bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors">Send Message</button>
                  <p className="text-xs text-white text-center">This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section id="register" className="py-12 lg:py-20 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary-foreground text-balance">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Join our football program for expert coaching and football skills development. Registration is now open for all programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="text-base bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors inline-flex items-center">
                Register for Training
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/free-profile" className="text-base bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors inline-flex items-center">
                Free Athlete Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="#contact" className="text-base bg-transparent border border-primary px-4 py-2 rounded hover:bg-primary/10 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-display font-bold">PR</span>
                </div>
                <span className="font-display font-bold">PolyRISE Athletix</span>
              </div>
              <p className="text-sm text-white leading-relaxed">
                Building stronger, faster, and character-driven young athletes in Dripping Springs, Texas (Austin area) and beyond.
              </p>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">Programs</h4>
              <ul className="space-y-2 text-sm text-white">
                <li><Link href="/passport" className="hover:text-foreground transition-colors">Athlete Passport</Link></li>
                <li><Link href="#programs" className="hover:text-foreground transition-colors">Player Development</Link></li>
                <li><Link href="#programs" className="hover:text-foreground transition-colors">{"Player Dev & Recruiting"}</Link></li>
                <li><Link href="#programs" className="hover:text-foreground transition-colors">360 Elite</Link></li>
                <li><Link href="#programs" className="hover:text-foreground transition-colors">HS Recruiting & Exposure</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white">
                <li><Link href="/#about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/#contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/register" className="hover:text-foreground transition-colors">Register</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/profile.php?id=61573903568901" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://www.x.com/PolyRise7v7" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/polyrise_football/" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center text-sm text-white">
            <p>Copyright © 2025 PolyRISE Athletix - All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
