import { ArrowRight, Trophy, Users, Target, MapPin, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ProtectedImage } from "@/components/protected-image"
import { EliteRecruitWaitlist } from "@/components/elite-recruit-waitlist"
import { BOARDS, TOTAL_EVENTS, TOTAL_BOARDS, uniqueSchoolCount } from "@/lib/the-board-data"
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
                href="/the-board"
                className="text-sm font-black text-[#c9973c] hover:text-[#966b27] transition-colors hidden md:inline tracking-wider uppercase"
              >
                The Board
              </Link>
              <Link
                href="/athletix-hub"
                className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors hidden md:inline"
              >
                Athletix Hub
              </Link>
              <Link
                href="/recruit-optin"
                className="text-sm font-medium bg-[#B91C1C] text-white px-4 py-2 rounded hover:bg-[#991b1b] transition-colors hidden md:inline"
              >
                College Opt-In
              </Link>
              <Link
                href="/plans"
                className="text-sm font-medium bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600/80 transition-colors"
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
                Where{" "}
                <span className="text-red-500">Central Texas</span>
                {" "}Athletes Are Built.
              </h1>

              <p className="text-lg lg:text-xl text-white leading-relaxed text-pretty">
                Athlete development with a core focus on football. PolyRISE Athletix delivers professional coaching and strength &amp; conditioning that starts with football fundamentals and builds complete athletes — across soccer, wrestling, baseball, softball, girls flag football and more. Plus recruiting exposure and PR-VERIFIED combine testing for high school athletes.
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

      {/* THE BOARD Teaser */}
      {(() => {
        const previewBoard = BOARDS.find(b => b.rows.length > 0)
        const schoolCount  = uniqueSchoolCount(BOARDS)
        const statCells    = [
          { value: TOTAL_BOARDS, label: "LEADERBOARDS" },
          { value: TOTAL_EVENTS, label: "EVENTS" },
          { value: schoolCount,  label: "SCHOOLS" },
        ]
        return (
          <section style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-14">
              <div style={{ maxWidth: 1024, margin: "0 auto" }}>

                {/* Header row */}
                <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs font-bold tracking-[0.05em]" style={{ color: "#c9973c" }}>
                        where coaches look.
                      </p>
                      <p className="text-sm text-white/70 mt-0.5">
                        Verified combine results. Updated every event.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/the-board"
                    className="hidden sm:inline-flex items-center gap-2 font-black text-sm tracking-widest uppercase px-5 py-2.5 rounded transition-colors"
                    style={{ background: "#966b27", color: "#fff" }}
                  >
                    VIEW THE BOARD
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>

                {/* Stat strip */}
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(3,1fr)",
                  border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12,
                  overflow: "hidden", marginBottom: 24,
                }}>
                  {statCells.map(({ value, label }, i) => (
                    <div key={label} style={{
                      background: "#0d1014", padding: "16px 12px",
                      borderRight: i < 2 ? "1px solid rgba(255,255,255,0.10)" : undefined,
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{value}</div>
                      <div style={{ fontSize: 9, color: "#8a919c", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 6, fontWeight: 700 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Preview board */}
                {previewBoard && (
                  <div style={{
                    background: "#0d1014", border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 12, overflow: "hidden", marginBottom: 24,
                  }}>
                    {/* Board header */}
                    <div style={{
                      borderLeft: "3px solid #966b27",
                      padding: "12px 16px 12px 14px",
                      borderBottom: "1px solid rgba(255,255,255,0.10)",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <span style={{ color: "#c9973c", fontWeight: 900, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {previewBoard.event}
                      </span>
                      <span style={{
                        color: "#8a919c", fontSize: 9, fontWeight: 700,
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        border: "1px solid rgba(255,255,255,0.10)", borderRadius: 100, padding: "3px 9px",
                      }}>
                        {previewBoard.div === "HS" ? "HIGH SCHOOL" : "MIDDLE SCHOOL"}
                      </span>
                    </div>
                    {/* Top 3 rows */}
                    {previewBoard.rows.slice(0, 3).map(([name, school, value, rank], j) => {
                      const isTop = rank === 1
                      return (
                        <div key={j} style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "12px 16px",
                          background: isTop ? "#e0342b" : "transparent",
                          borderTop: j > 0 ? "1px solid rgba(255,255,255,0.06)" : undefined,
                        }}>
                          <span style={{ fontSize: 15, fontWeight: 900, width: 28, flexShrink: 0, color: isTop ? "rgba(255,255,255,0.6)" : "#c9973c" }}>#{rank}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
                            {school && <p style={{ margin: "2px 0 0", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: isTop ? "rgba(255,255,255,0.5)" : "#8a919c" }}>{school}</p>}
                          </div>
                          <span style={{ fontSize: 20, fontWeight: 900, flexShrink: 0, color: isTop ? "#fff" : "#e0342b", fontVariantNumeric: "tabular-nums" }}>{value}</span>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Mobile CTA */}
                <div className="sm:hidden">
                  <Link
                    href="/the-board"
                    className="block text-center font-black text-sm tracking-widest uppercase py-3 rounded"
                    style={{ background: "#966b27", color: "#fff" }}
                  >
                    VIEW THE BOARD →
                  </Link>
                </div>

              </div>
            </div>
          </section>
        )
      })()}

      {/* Programs & Pricing */}
      <section id="programs" className="py-12 lg:py-20 bg-gray-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-red-500 font-bold text-xs uppercase tracking-widest mb-3">PolyRISE Athletix</p>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white">Programs & Pricing</h2>
            <p className="text-lg text-white mt-3 max-w-xl mx-auto">In-person training packages designed for every level of commitment.</p>
          </div>

          {/* Training Programs Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-6xl mx-auto">

              {/* Football Player Development */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-gray-600 transition-colors">
                <div>
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-red-900/60 text-red-300 mb-2">Most Popular</span>
                  <h4 className="text-sm font-bold text-white">Athlete Development</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Tuesday · 6:30–7:30pm. Complete athlete development with a football core — SAQ, S&amp;C, sport-specific drills, tournament entries, military character building events, PR-Verified Camp and free Athletic Training Passport (Tracker). Built for football players and multisport athletes alike.</p>
                </div>
                <div className="space-y-1.5 border-t border-gray-800 pt-2.5">
                  <div className="flex justify-between text-xs"><span className="text-gray-300">Once a Week</span><span className="font-bold text-white">$150/mo</span></div>
                </div>
                <Link href="/register?program=player-dev-1day" className="mt-auto block text-center text-xs font-bold bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">Register</Link>
              </div>

              {/* After School & Girls Development */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-gray-600 transition-colors">
                <div>
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-teal-900/60 text-teal-300 mb-2">Afterschool &amp; Girls</span>
                  <h4 className="text-sm font-bold text-white">After School &amp; Girls Development</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Tuesday · 5:30–6:30pm · Open to Elementary, Middle School &amp; Girl athletes</p>
                </div>
                <div className="space-y-1.5 border-t border-gray-800 pt-2.5">
                  <div className="flex justify-between text-xs"><span className="text-gray-300">Once a Week</span><span className="font-bold text-white">$150/mo</span></div>
                </div>
                <Link href="/register?program=afterschool" className="mt-auto block text-center text-xs font-bold bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">Register</Link>
              </div>

              {/* Group & Private Training */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-gray-600 transition-colors">
                <div>
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 mb-2">Group &amp; Private</span>
                  <h4 className="text-sm font-bold text-white">Group &amp; Private Training</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Group sessions &amp; 1-on-1 private training available. DM Coach at{" "}
                    <a href="tel:+18176583300" className="text-white hover:text-red-400 transition-colors">(817) 658-3300</a>
                    {" "}for pricing and info.
                  </p>
                </div>
                <div className="border-t border-gray-800 pt-2.5">
                  <a href="https://wa.me/18176583300" target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 hover:text-green-300 transition-colors">Message on WhatsApp →</a>
                </div>
                <a href="https://wa.me/18176583300" target="_blank" rel="noopener noreferrer" className="mt-auto block text-center text-xs font-bold bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">Contact Coach</a>
              </div>

              {/* Drop-In Training */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-gray-600 transition-colors">
                <div>
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 mb-2">Drop-In</span>
                  <h4 className="text-sm font-bold text-white">Drop-In Training</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Try a session before committing.</p>
                </div>
                <div className="space-y-1.5 border-t border-gray-800 pt-2.5">
                  <div className="flex justify-between text-xs"><span className="text-gray-300">1 Day</span><span className="font-bold text-white">$30</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-300">2 Days</span><span className="font-bold text-white">$50</span></div>
                </div>
                <Link href="/register?program=drop-in-1day" className="mt-auto block text-center text-xs font-bold bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">Register</Link>
              </div>

              {/* HS Recruiting & Exposure */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-gray-600 transition-colors">
                <div>
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-900/60 text-yellow-300 mb-2">High School</span>
                  <h4 className="text-sm font-bold text-white">HS Recruiting &amp; Exposure</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Social media blasts, coach outreach &amp; profile optimization for college visibility</p>
                </div>
                <div className="space-y-2 border-t border-gray-800 pt-2.5">
                  <div className="bg-gray-800 rounded-lg p-2.5">
                    <div className="flex justify-between text-xs mb-0.5"><span className="font-bold text-white">Elite Exposure</span><span className="font-bold text-white">$150/mo</span></div>
                    <p className="text-[11px] text-gray-400">2× social blast · 5 coach emails/mo · weekly report · 1-on-1 call</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-2.5">
                    <div className="flex justify-between text-xs mb-0.5"><span className="font-bold text-white">Pro Exposure</span><span className="font-bold text-white">$125/mo</span></div>
                    <p className="text-[11px] text-gray-400">1× social blast · 3 coach emails/mo · bi-weekly report</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-2.5">
                    <div className="flex justify-between text-xs mb-0.5"><span className="font-bold text-white">Basic Exposure</span><span className="font-bold text-white">$85/mo</span></div>
                    <p className="text-[11px] text-gray-400">Pro profile images · X blast · coach directory access</p>
                  </div>
                </div>
                <Link href="/register?program=hs-recruiting-elite" className="mt-auto block text-center text-xs font-bold bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">Get Started</Link>
              </div>

              {/* Leadership & Mentorship Hike */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-gray-600 transition-colors">
                <div>
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-green-900/60 text-green-300 mb-2">Leadership</span>
                  <h4 className="text-sm font-bold text-white">Leadership &amp; Mentorship Hike</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Character-building hike developing leadership, mentorship &amp; mental toughness beyond the field</p>
                </div>
                <div className="border-t border-gray-800 pt-2.5">
                  <div className="flex justify-between text-xs"><span className="text-gray-300">Per Athlete</span><span className="font-bold text-white">$25</span></div>
                </div>
                <Link href="/register?program=hike" className="mt-auto block text-center text-xs font-bold bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">Register</Link>
              </div>

              {/* Tackle Sessions */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-orange-800/60 transition-colors">
                <div>
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-orange-900/60 text-orange-300 mb-2">Aug – Sep</span>
                  <h4 className="text-sm font-bold text-white">Tackle Sessions</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Aug 8, 15 &amp; 22 · 9:30–11:00am · Tackling fundamentals, technique, and live reps coached by NFL-experienced staff</p>
                </div>
                <div className="space-y-1.5 border-t border-gray-800 pt-2.5">
                  <div className="flex justify-between text-xs"><span className="text-gray-300">Per Session</span><span className="font-bold text-white">$40</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-300">3 Sessions <span className="text-orange-400">· Best Value · No auto-draft</span></span><span className="font-bold text-white">$105</span></div>
                </div>
                <Link href="/register?program=tackle-session-monthly" className="mt-auto block text-center text-xs font-bold bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">Register</Link>
              </div>

              {/* PR-VERIFIED */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-[#DC143C]/40 transition-colors">
                <div>
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-[#DC143C]/15 text-[#DC143C] mb-2">PR-VERIFIED</span>
                  <h4 className="text-sm font-bold text-white">PR-VERIFIED</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Sign up for 1 combine event and get officially verified — or go annual and get 6 events throughout the year to keep your data current</p>
                </div>
                <div className="border-t border-gray-800 pt-2.5 flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs"><span className="text-gray-300">1 Event</span><span className="font-bold text-white">$40</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-300">Annual · 6 Events</span><span className="font-bold text-white">$130/yr</span></div>
                </div>
                <Link href="/register?program=pr-verified-single" className="mt-auto block text-center text-xs font-bold bg-[#DC143C] hover:bg-[#B01030] text-white py-2 rounded-lg transition-colors">Register</Link>
              </div>

              {/* Combine Metrics Camp */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-gray-600 transition-colors">
                <div>
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 mb-2">Camp</span>
                  <h4 className="text-sm font-bold text-white">Combine Metrics Camp</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Professional combine events · H.S. athletes record official metrics &amp; earn PR-VERIFIED seal</p>
                </div>
                <div className="border-t border-gray-800 pt-2.5">
                  <div className="flex justify-between text-xs"><span className="text-gray-300">Camp Registration</span><span className="font-bold text-white">$40</span></div>
                </div>
                <Link href="/register?program=combine" className="mt-auto block text-center text-xs font-bold bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">Register</Link>
              </div>

              {/* Summer Camp */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:col-span-2 lg:col-span-3 hover:border-gray-600 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 mb-2">Summer Camp</span>
                    <h4 className="text-sm font-bold text-white">Summer Athletix &amp; Leadership Camp 2027</h4>
                    <p className="text-xs text-gray-400 mt-1">June &amp; July · Mon, Tue &amp; Thu · 10:00am–12:00pm · Elementary &amp; Middle School · <span className="text-white font-semibold">Limited to 20 spots</span></p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Link href="/register?program=summer-ms" className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors whitespace-nowrap">Register Now</Link>
                  </div>
                </div>
              </div>

              {/* Recruiting */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:col-span-2 lg:col-span-3 hover:border-gray-600 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  <div className="flex-1">
                    <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-red-900/60 text-red-300 mb-2">Recruiting</span>
                    <h4 className="text-base font-bold text-white mb-1">PolyRISE Athletix Recruiting</h4>
                    <p className="text-xs text-gray-400 mb-2">PolyRISE Staff · Former NFL experience · COO / Director of Recruiting</p>
                    <p className="text-xs text-gray-300 leading-relaxed">Overseeing player profiles, college outreach strategies, and ensuring every athlete receives high-quality exposure to the right college programs — helping student-athletes navigate recruiting and earn collegiate opportunities.</p>
                    <p className="text-xs text-gray-400 mt-2">Contact: <a href="mailto:polyrise@polyrisefootball.com" className="text-red-400 hover:text-red-300">polyrise@polyrisefootball.com</a></p>
                    <div className="mt-3">
                      <Link href="#contact" className="inline-block bg-red-600 text-white px-5 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-xs font-bold">Get Started with Recruiting</Link>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <img src="/recruiting-athlete-1.jpeg" alt="Athlete Introduction Example" className="w-24 h-auto rounded-lg border border-gray-700" />
                    <img src="/recruiting-athlete-2.jpeg" alt="Athlete Introduction Example" className="w-24 h-auto rounded-lg border border-gray-700" />
                  </div>
                </div>
              </div>

          </div>

          {/* Athlete Tracking & Profile Plans */}
          <div className="mt-16 pt-12 border-t border-gray-800 max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-red-500 font-bold text-xs uppercase tracking-widest mb-2">Add-On</p>
              <h3 className="text-3xl lg:text-4xl font-display font-bold text-white">Athlete Tracking & Recruiting Profiles</h3>
              <p className="text-lg text-white mt-2">Enhance your athlete&apos;s development with verified metrics, a shareable recruiting profile, and college coach visibility.</p>
            </div>

            {/* Grade Guide */}
            <div className="max-w-2xl mx-auto mb-10">
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

              {/* Elite Recruit — Waitlist */}
              <div className="relative bg-gray-900 rounded-2xl border-2 border-yellow-500 flex flex-col overflow-hidden">
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
                  {["Everything in Recruit","Quarterly PolyRISE Staff development report","College program fit suggestions","Prospect ranking by position & grade","1 Free Combine Camp/Month","Early access to all PolyRISE camps & events"].map(f => (
                    <div key={f} className="flex items-start gap-2.5 text-sm text-white">
                      <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center bg-yellow-500">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
                <div className="px-6 pb-6 pt-4">
                  <EliteRecruitWaitlist />
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link href="/plans" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-colors text-sm">
                View Full Plan Details
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Parent & Supporter Testimonials */}
      <section className="py-12 lg:py-20 bg-gray-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-red-500 font-bold text-xs uppercase tracking-widest mb-3">Community</p>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">What Parents &amp; Supporters Are Saying</h2>
            <p className="text-base text-gray-400 mt-2 max-w-xl mx-auto">Real stories from families and coaches in Central Texas</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">

            <div className="bg-[#0f1117] border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-red-900/60 transition-colors">
              <p className="text-yellow-400 text-base tracking-widest">★★★★★</p>
              <p className="text-gray-300 text-sm leading-relaxed italic flex-1">&ldquo;My son walked in as a quiet 7th grader who barely believed in himself. Eight months later he&apos;s faster, stronger, and leading drills. The PolyRISE Athletix staff didn&apos;t just train him — they built his character. This program is the real deal.&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-800 mt-auto">
                <div className="w-10 h-10 rounded-full bg-red-900/60 border border-red-700/40 flex items-center justify-center text-white font-bold text-xs shrink-0">TM</div>
                <div>
                  <p className="text-white text-sm font-bold">Teresa M.</p>
                  <p className="text-gray-500 text-xs">Parent of 7th Grader · Dripping Springs</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0f1117] border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-blue-900/60 transition-colors">
              <p className="text-yellow-400 text-base tracking-widest">★★★★★</p>
              <p className="text-gray-300 text-sm leading-relaxed italic flex-1">&ldquo;Our son was invisible to college coaches until PolyRISE ran him through the PR-VERIFIED combine. Real, verified numbers changed everything — he now has three programs looking at his profile. Best investment we&apos;ve made in his future.&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-800 mt-auto">
                <div className="w-10 h-10 rounded-full bg-blue-900/60 border border-blue-700/40 flex items-center justify-center text-white font-bold text-xs shrink-0">MJ</div>
                <div>
                  <p className="text-white text-sm font-bold">Marcus &amp; Alicia J.</p>
                  <p className="text-gray-500 text-xs">Parents of 10th Grader · Austin</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0f1117] border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-red-900/60 transition-colors">
              <p className="text-yellow-400 text-base tracking-widest">★★★★★</p>
              <p className="text-gray-300 text-sm leading-relaxed italic flex-1">&ldquo;The military character-building events are what set PolyRISE apart. My daughter came home from the leadership hike standing taller and talking about who she wants to become. Sport skills AND life skills — that&apos;s rare for a youth program.&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-800 mt-auto">
                <div className="w-10 h-10 rounded-full bg-red-900/60 border border-red-700/40 flex items-center justify-center text-white font-bold text-xs shrink-0">JC</div>
                <div>
                  <p className="text-white text-sm font-bold">Jennifer C.</p>
                  <p className="text-gray-500 text-xs">Parent of 8th Grader · Dripping Springs</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0f1117] border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-green-900/60 transition-colors">
              <p className="text-yellow-400 text-base tracking-widest">★★★★★</p>
              <p className="text-gray-300 text-sm leading-relaxed italic flex-1">&ldquo;I refer every family to PolyRISE because I trust these coaches completely. NFL-level experience, real discipline, and they treat every kid like family. Central Texas has needed this program for a long time — proud to support it.&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-800 mt-auto">
                <div className="w-10 h-10 rounded-full bg-green-900/60 border border-green-700/40 flex items-center justify-center text-white font-bold text-xs shrink-0">RS</div>
                <div>
                  <p className="text-white text-sm font-bold">Coach R. Santos</p>
                  <p className="text-gray-500 text-xs">Youth League Director · Austin Metro</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
                  className="text-base font-semibold bg-red-600 text-white px-6 py-3 rounded hover:bg-red-600/80 transition-colors text-center"
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

      {/* Frequently Asked Questions */}
      <section className="py-10 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-sm text-gray-400">Quick answers about PolyRISE Athletix</p>
            </div>

            <div className="space-y-2">

              <details className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-white font-semibold text-sm hover:bg-gray-800 transition-colors [list-style:none] [&::-webkit-details-marker]:hidden">
                  <span>What programs are available and how much do they cost?</span>
                  <span className="text-gray-500 ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-xs select-none">▼</span>
                </summary>
                <div className="px-5 pb-4 pt-3 text-sm text-gray-300 leading-relaxed border-t border-gray-800">
                  <p>Athlete Development (Tue &amp; Thu, 6:30–7:30pm) is <strong className="text-white">$150/mo</strong> (once a week). After School &amp; Girls Development (Tue &amp; Thu, 5:30–6:30pm) is <strong className="text-white">$150/mo</strong> (once a week). Tackle Sessions (Aug–Sep, once/week) are <strong className="text-white">$40/session</strong> or $125/mo. HS Recruiting &amp; Exposure packages are $85–$150/mo. Athlete Tracking plans start at <strong className="text-white">$9.99/mo</strong>.</p>
                </div>
              </details>

              <details className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-white font-semibold text-sm hover:bg-gray-800 transition-colors [list-style:none] [&::-webkit-details-marker]:hidden">
                  <span>What is the training schedule?</span>
                  <span className="text-gray-500 ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-xs select-none">▼</span>
                </summary>
                <div className="px-5 pb-4 pt-3 text-sm text-gray-300 leading-relaxed border-t border-gray-800 space-y-1">
                  <p><strong className="text-white">Athlete Development:</strong> Tuesday · 6:30–7:30pm</p>
                  <p><strong className="text-white">After School &amp; Girls Development:</strong> Tuesday · 5:30–6:30pm (Elementary, Middle School &amp; Girls)</p>
                  <p><strong className="text-white">Tackle Sessions:</strong> Aug 8, 15 &amp; 22 · 9:30–11:00am</p>
                  <p className="text-gray-400 pt-1">Monthly camps, combine events, and leadership hikes held on weekends in Dripping Springs.</p>
                </div>
              </details>

              <details className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-white font-semibold text-sm hover:bg-gray-800 transition-colors [list-style:none] [&::-webkit-details-marker]:hidden">
                  <span>What is PR-VERIFIED and why does it matter for recruiting?</span>
                  <span className="text-gray-500 ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-xs select-none">▼</span>
                </summary>
                <div className="px-5 pb-4 pt-3 text-sm text-gray-300 leading-relaxed border-t border-gray-800">
                  <p>PR-VERIFIED is our seal of authenticity. Coaches with NFL and collegiate experience run standardized on-site combine testing: 40-yard dash, vertical jump, broad jump, 5-10-5 shuttle, 3-cone drill, and position evaluations. No self-reported times — just real, verifiable numbers athletes can put on any recruiting profile with confidence that college coaches and scouts will trust.</p>
                </div>
              </details>

              <details className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-white font-semibold text-sm hover:bg-gray-800 transition-colors [list-style:none] [&::-webkit-details-marker]:hidden">
                  <span>How does PolyRISE help my high schooler get recruited?</span>
                  <span className="text-gray-500 ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-xs select-none">▼</span>
                </summary>
                <div className="px-5 pb-4 pt-3 text-sm text-gray-300 leading-relaxed border-t border-gray-800">
                  <p>The <strong className="text-white">Recruit plan ($29.99/mo)</strong> includes a PR-VERIFIED shareable profile, Hudl integration, and monthly X spotlights to college recruiters. <strong className="text-white">HS Recruiting &amp; Exposure packages ($85–$150/mo)</strong> add personalized coach outreach, social media blasts, and 1-on-1 calls with PolyRISE staff. The Elite Recruit tier (launching 2026 season) adds quarterly development reports and college program fit analysis — join the waitlist on the plans page.</p>
                </div>
              </details>

              <details className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-white font-semibold text-sm hover:bg-gray-800 transition-colors [list-style:none] [&::-webkit-details-marker]:hidden">
                  <span>Who are the coaches?</span>
                  <span className="text-gray-500 ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-xs select-none">▼</span>
                </summary>
                <div className="px-5 pb-4 pt-3 text-sm text-gray-300 leading-relaxed border-t border-gray-800">
                  <ul className="space-y-1.5">
                    <li><strong className="text-white">Coach Jordan</strong> — XFL Draft 2022, 2× Omaha Beef Champion, HCU WR Coach</li>
                    <li><strong className="text-white">Coach Traves</strong> — Navy Safety &amp; LB, All-East teams 2011–12</li>
                    <li><strong className="text-white">Coach John</strong> — Navy Football QB, Naval Academy graduate &amp; officer</li>
                    <li><strong className="text-white">Coach Brayden</strong> — Baylor 2018–21, NFL Draft 2023, IFL All-Pro &amp; League Champion 2025</li>
                  </ul>
                </div>
              </details>

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
                      Training at local fields in Dripping Springs. Expanding to other cities nationwide.
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
                  <button type="submit" className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600/80 transition-colors">Send Message</button>
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
              Join PolyRISE Athletix for expert coaching and complete athlete development — built on a football core. Registration is now open for all programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="text-base bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600/80 transition-colors inline-flex items-center">
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
                <li><Link href="#programs" className="hover:text-foreground transition-colors">HS Recruiting &amp; Exposure</Link></li>
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
            <p>Copyright © 2026 PolyRISE Athletix - All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
