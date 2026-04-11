import { ArrowRight, Trophy, Users, Target, Calendar, MapPin, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ProtectedImage } from "@/components/protected-image"
import { MindBodyWidget } from "@/components/mindbody-widget"


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
                alt="PolyRISE Football Logo"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
              <span className="font-display font-bold text-xl hidden sm:inline">PolyRISE Football</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="#programs"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:inline"
              >
                Programs
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:inline"
              >
                About
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:inline"
              >
                Contact
              </Link>
              <Link
                href="#register"
                className="text-sm font-medium bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors"
              >
                Register Now
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
                Elite Youth Football Player Development for{" "}
                <span className="text-white">Austin & Central Texas Athletes</span>
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed text-pretty">
                PolyRISE Football develops K-12 athletes in Austin and Central Texas with pro-level training, recruiting support, and the PR-VERIFIED seal that college scouts trust.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#register"
                  className="text-base font-semibold bg-[#FF6600] text-white px-6 py-3 rounded hover:bg-[#FF6600]/80 transition-colors text-center"
                >
                  Register Now
                </Link>
                <Link
                  href="#programs"
                  className="text-base font-semibold bg-transparent border-2 border-white text-white px-6 py-3 rounded hover:bg-white/10 transition-colors text-center"
                >
                  View Programs
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border bg-muted">
                <Image
                  src="/combine-training-athletes.jpg"
                  alt="Youth athlete training at PolyRISE Football"
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
                    <div className="text-sm text-muted-foreground">Professional Coaching</div>
                  </div>
                </div>
              </div>
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
                PR-VERIFIED <span className="text-xl lg:text-2xl font-normal text-gray-300">(Seal of Authenticity)</span>
              </h2>
              <p className="text-base lg:text-lg text-gray-300 mb-4 leading-relaxed">
                The PR-VERIFIED seal is awarded exclusively to athletes who complete PolyRISE Football programs, camps, or tryouts. Overseen by a board of coaches with NFL and collegiate playing/coaching experience conducts standardized, pro-style combine testing using consistent protocols and multiple trials for maximum reliability. This seal certifies that the athlete&apos;s metrics were directly measured and verified by our team on-site. No self-reported times or inflated numbers. The data is accurate, unbiased, and built to stand up under recruiter scrutiny.
              </p>
              <div className="mb-4">
                <p className="text-white font-semibold mb-2">Tested Events Include:</p>
                <ul className="text-gray-300 text-sm lg:text-base space-y-1 list-disc list-inside">
                  <li>40-Yard Dash</li>
                  <li>Broad Jump</li>
                  <li>Vertical Jump</li>
                  <li>3-Cone Drill (L-Drill)</li>
                  <li>5-10-5 Shuttle (Pro-Agility/Short Shuttle)</li>
                  <li>Skill-specific evaluations: Catching, Throwing, Footwork, and position drills</li>
                </ul>
              </div>
              <p className="text-base lg:text-lg text-gray-300 leading-relaxed">
                Athletes earning the PR-VERIFIED seal receive official documentation and a digital badge they can display on recruiting profiles. This gives coaches and scouts immediate confidence that the numbers are real and PolyRISE-vetted.
              </p>
            </div>
            <ProtectedImage
              src="/pr-verified-badge.png"
              alt="PolyRISE PR-VERIFIED Badge - Copyright 2026 PolyRISE Football All Rights Reserved"
              className="w-full h-full object-contain"
              containerClassName="w-48 h-48 md:w-64 md:h-64 flex-shrink-0"
            />
          </div>
        </div>
      </section>

      {/* PolyRISE Football Coaches Board Section */}
      <section className="py-10 lg:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4 text-balance">
              PolyRISE Football Coaches Board
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn from coaches with professional playing experience at the highest levels
            </p>
          </div>
          
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-primary">
                <img 
                  src="/coach-garrett.jpg" 
                  alt="Head Coach Kevin Garrett - St. Louis Rams #21"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h3 className="font-bold text-foreground mb-1">Head Coach Garrett</h3>
              <p className="text-xs text-primary font-semibold mb-2">DB Coach</p>
              <p className="text-xs text-muted-foreground">7 yrs NFL (Rams, Texans), 3 yrs CFL, Drafted 2003 from SMU</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-primary">
                <img 
                  src="/coach-jordan.jpg" 
                  alt="Coach Jordan - Omaha Beef #18"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h3 className="font-bold text-foreground mb-1">Coach Jordan</h3>
              <p className="text-xs text-primary font-semibold mb-2">WR/TE</p>
              <p className="text-xs text-muted-foreground">XFL Draft 2022, Omaha Beef 2X Champion, HCU Assistant WR Coach</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary/20">
                <img
                  src="/coach-traves.jpg"
                  alt="Coach Traves - Former Navy Safety and LB"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-foreground mb-1">Coach Traves</h3>
              <p className="text-xs text-primary font-semibold mb-2">RB/S</p>
              <p className="text-xs text-muted-foreground">Former Navy Safety & LB, All-East Teams 2011-12, Citadel Football</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary/20">
                <img
                  src="/coach-john.jpg"
                  alt="Coach John - Former Navy Football QB"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-foreground mb-1">Coach John</h3>
              <p className="text-xs text-primary font-semibold mb-2">QB</p>
              <p className="text-xs text-muted-foreground">Former Navy Football QB, Naval Academy Graduate & Officer</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary/20">
                <img
                  src="/coach-brayden.jpg"
                  alt="Coach Brayden - Baylor Football, NFL Draft, IFL All-Pro"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-foreground mb-1">Coach Brayden</h3>
              <p className="text-xs text-primary font-semibold mb-2">LB/DL</p>
              <p className="text-xs text-muted-foreground">Baylor 18-21, NFL Draft 2023, IFL All-Pro & League Champion 2025</p>
            </div>
          </div>
        </div>
      </section>



      {/* Programs Preview */}
      <section id="programs" className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-display font-bold">Programs</h2>
              <p className="text-lg text-muted-foreground">Training packages designed for every level of commitment</p>
            </div>
            <Link
              href="#programs"
              className="hidden md:inline-flex bg-transparent border border-primary px-4 py-2 rounded hover:bg-primary/10 transition-colors"
            >
              View All Programs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src="/athlete-training-drill.jpg"
                  alt="Player Development Training"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-sm font-medium">
                  Most Popular
                </div>
              </div>
              <div className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-display font-bold mb-2">Player Development</h3>
                  <div className="text-lg font-bold text-white mb-3">$350/mo</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    16 sessions a month including SAQ, S&C, football drills, tournament entries, film study, and
                    quarterly military character building events.
                  </p>
                </div>
                <Link
                  href="#register"
                  className="w-full bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>

            <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors relative">
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                ELITE
              </div>
              <div className="aspect-video relative overflow-hidden">
                <img
                  src="/elite-360-training.jpg"
                  alt="360 Elite Training"
                  className="w-full h-full object-cover object-[50%_35%] group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-display font-bold mb-2">360 Elite</h3>
                  <div className="text-lg font-bold text-white mb-3">$500/mo</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Everything in Player Development plus one-on-one coaching from NFL experience staff, recruiting profile,
                    7 email blasts a month, and exclusive benefits.
                  </p>
                </div>
                <Link
                  href="#register"
                  className="w-full bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>

            {/* PolyRISE Football Tournament */}
            <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
              <div className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-display font-bold mb-1">PolyRISE Football Tournament</h3>
                  <p className="text-sm font-display font-semibold text-primary italic mb-2">Rise of Warriors</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                    Middle School (10-team, May 29th - $400) and High School (8-team, May 30th - $425). Minimum 3
                    games, single game elimination.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Middle School: 10 teams - $400</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">High School: 8 teams - $425</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Min. 3 games, single elimination</span>
                  </div>
                </div>
                <Link
                  href="#register"
                  className="w-full bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors"
                >
                  Register Team
                </Link>
              </div>
            </div>

            {/* Girls Player Development */}
            <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
              <div className="pt-6 space-y-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                    <span className="text-sm font-medium text-primary">Girls Program</span>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2">Girls Player Development</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    Program is on Monday & Friday (5-6:30pm) in May. June and July is player development on Monday & Friday at (1-2:30pm).
                  </p>
                </div>
                <div className="border-t border-dashed border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">2 Days a Week</span>
                    <span className="text-lg font-bold text-white">$250/mo</span>
                  </div>
                </div>
                <Link
                  href="#register"
                  className="w-full bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>

            {/* Multi-Sport Program */}
            <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
              <div className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-display font-bold mb-2">Multi-Sport Program</h3>
                  <div className="text-lg font-bold text-white mb-3">$175/mo</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Cross-training program designed to develop well-rounded athletes through multiple sports disciplines.
                  </p>
                </div>
                <Link
                  href="#register"
                  className="w-full bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>

            {/* Camp PR-VERIFIED & Leadership Hike */}
            <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
              <div className="pt-6 space-y-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                    <span className="text-sm font-medium text-primary">Camp</span>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2">Camp PR-VERIFIED</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                    Professional Combine Events. H.S Athletes record official metrics.
                  </p>
                </div>
                <div className="border-t border-dashed border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Camp Registration</span>
                    <span className="text-lg font-bold text-white">$50</span>
                  </div>
                </div>
                
                {/* Leadership Hike */}
                <div className="border-t border-dashed border-border pt-4">
                  <h4 className="text-lg font-display font-bold mb-2">Leadership Hike</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    2201 Barton Springs Rd, Austin
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Hike Registration</span>
                    <span className="text-lg font-bold text-white">$25</span>
                  </div>
                </div>
                <Link
                  href="#register"
                  className="w-full bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>

            {/* Summer Camp */}
            <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors">
              <div className="pt-6 space-y-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                    <span className="text-sm font-medium text-primary">Summer Camp</span>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2">Summer Camp</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                    Athlete Development & Leadership (June & July) - <span className="text-white font-semibold">Limited to 20 spots ONLY</span>
                  </p>
                </div>
                <div className="border-t border-dashed border-border pt-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Elementary (K-5) Summer Camp</span>
                      <span className="text-lg font-bold text-white">$265/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Mon-Thu, 8:00am - 10:00am</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Middle School Summer Camp</span>
                      <span className="text-lg font-bold text-white">$265/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Mon-Thu, 10:00am - 12:00pm</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">High School Summer Camp</span>
                      <span className="text-lg font-bold text-white">$265/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Mon-Thu, 2:00pm - 4:00pm</p>
                  </div>
                </div>
                <Link
                  href="#register"
                  className="w-full bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors"
                >
                  Register Now
                </Link>
              </div>
            </div>

            {/* Recruiting Package */}
            <div className="bg-card border-primary/50 border-2 overflow-hidden group hover:border-primary transition-colors md:col-span-2 lg:col-span-3">
              <div className="pt-6 space-y-4">
                <div className="text-center">
                  <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">Recruiting</h2>
                  <h3 className="text-xl font-display font-bold mb-2 text-white">Kevin Garrett</h3>
                  <p className="text-xs text-white font-semibold mb-2">Former NFL | COO / Director of PolyRISE Football Recruiting</p>
                  <p className="text-white text-sm leading-relaxed">
                    With extensive experience in football recruiting, Kevin leads all operations at PolyRISE Football Recruiting. He personally oversees player profiles, college outreach strategies, and ensures every athlete receives high-quality exposure to the right college programs. Kevin is passionate about helping student-athletes navigate the recruiting process and has helped dozens of players earn opportunities at the collegiate level.
                  </p>
                  <p className="text-sm text-white mt-3">
                    Contact Kevin directly: <a href="mailto:KG@polyrisefootball.com" className="text-red-500 underline hover:text-red-400">KG@polyrisefootball.com</a>
                  </p>
                </div>
                
                {/* Athlete Profile Examples */}
                <div className="flex flex-wrap justify-center gap-4 px-4">
                  <img 
                    src="/recruiting-athlete-1.jpeg" 
                    alt="Athlete Introduction Example - James Cabarrus III" 
                    className="w-48 h-auto rounded-lg border border-primary/20"
                  />
                  <img 
                    src="/recruiting-athlete-2.jpeg" 
                    alt="Athlete Introduction Example - Gevariah Kneubuhl" 
                    className="w-48 h-auto rounded-lg border border-primary/20"
                  />
                </div>

                <div className="border-t border-dashed border-border pt-4 space-y-4">
                  <div>
                    <div className="font-medium text-white mb-1">Option 1 - Basic Exposure Package</div>
                    <p className="text-xs text-muted-foreground mb-2">Professional player image/profile + 5 emails per month to colleges of your choice</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center justify-between flex-1 min-w-[150px]">
                        <span className="text-sm text-muted-foreground">3 Months</span>
                        <span className="text-lg font-bold text-white">$165</span>
                      </div>
                      <div className="flex items-center justify-between flex-1 min-w-[150px]">
                        <span className="text-sm text-muted-foreground">6 Months</span>
                        <span className="text-lg font-bold text-white">$330</span>
                      </div>
                      <div className="flex items-center justify-between flex-1 min-w-[150px]">
                        <span className="text-sm text-muted-foreground">12 Months</span>
                        <span className="text-lg font-bold text-white">$660</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Option 2 - Enhanced Exposure Package</div>
                    <p className="text-xs text-muted-foreground mb-2">Professional player image/profile + 10 emails per month to colleges of your choice</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center justify-between flex-1 min-w-[150px]">
                        <span className="text-sm text-muted-foreground">3 Months</span>
                        <span className="text-lg font-bold text-white">$225</span>
                      </div>
                      <div className="flex items-center justify-between flex-1 min-w-[150px]">
                        <span className="text-sm text-muted-foreground">6 Months</span>
                        <span className="text-lg font-bold text-white">$450</span>
                      </div>
                      <div className="flex items-center justify-between flex-1 min-w-[150px]">
                        <span className="text-sm text-muted-foreground">12 Months</span>
                        <span className="text-lg font-bold text-white">$900</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href="#register"
                  className="w-full bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </div>

          {/* High School Recruiting Section */}
          <div className="mt-12 pt-12 border-t border-border">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">Get Noticed by College Coaches</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our recruiting team, led by Head Coach Kevin Garrett (7-year NFL veteran), is actively helping high school athletes get in front of college programs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Basic Exposure Package */}
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-display font-bold text-white mb-2">Option 1 - Basic Exposure Package</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>Professional player profile</li>
                    <li>5 college emails per month</li>
                  </ul>
                </div>
                <div className="border-t border-dashed border-border pt-4 space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">3 Months</span>
                    <span className="text-lg font-bold text-white">$165</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">6 Months</span>
                    <span className="text-lg font-bold text-white">$330</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">12 Months</span>
                    <span className="text-lg font-bold text-white">$660</span>
                  </div>
                </div>
                <Link
                  href="#contact"
                  className="block w-full text-center bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors"
                >
                  Get Started
                </Link>
              </div>

              {/* Enhanced Exposure Package */}
              <div className="bg-card border-2 border-primary/50 rounded-lg p-6 hover:border-primary transition-colors relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
                <div className="text-center mb-4">
                  <h3 className="text-xl font-display font-bold text-white mb-2">Option 2 - Enhanced Exposure Package</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>Professional player profile</li>
                    <li>10 college emails per month</li>
                  </ul>
                </div>
                <div className="border-t border-dashed border-border pt-4 space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">3 Months</span>
                    <span className="text-lg font-bold text-white">$225</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">6 Months</span>
                    <span className="text-lg font-bold text-white">$450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">12 Months</span>
                    <span className="text-lg font-bold text-white">$900</span>
                  </div>
                </div>
                <Link
                  href="#contact"
                  className="block w-full text-center bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="#programs"
            className="w-full mt-8 md:hidden bg-transparent border border-primary px-4 py-2 rounded hover:bg-primary/10 transition-colors"
          >
            View All Programs
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-balance">About PolyRISE Football</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border-border">
              <div className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold">Athletic Excellence</h3>
                <p className="text-muted-foreground leading-relaxed">
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
                <p className="text-muted-foreground leading-relaxed">
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
                <p className="text-muted-foreground leading-relaxed">
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
              <p className="text-lg text-muted-foreground">Everything you need to know about PolyRISE Football</p>
            </div>

            <div className="space-y-6">
              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">
                    What age groups does PolyRISE Football train?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    PolyRISE Football provides elite training for K-12 athletes, including youth, middle school, and
                    high school players. Our programs are designed to develop athletes at every level, from beginners to
                    those preparing for college recruitment.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">Where is PolyRISE Football located?</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    PolyRISE Football is based in Dripping Springs, Texas (Austin area), with training sessions held at Swift Sessions and local fields. We are expanding to other cities nationwide. Contact us to find out when we&apos;re coming to your location.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">
                    What is included in the Player Development program?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Player Development ($350/month) includes 2 training sessions weekly, (PolyRISE tee after 3 months), SAQ, S&C training, football drills, monthly camp/tryout, leadership event, film study.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">
                    What makes 360 Elite different from Player Development?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
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
                  <p className="text-muted-foreground leading-relaxed">
                  Tuesday 6:30-7:45pm and Thursday 6:30-7:45pm intense player development. Monthly camp/tryout and a monthly leadership event on Saturday or Sunday.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">
                    Does PolyRISE Football have coaches with NFL experience?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Yes, PolyRISE Football has coaches with NFL experience on staff who provide one-on-one coaching,
                    film study, and advanced training for athletes in the 360 Elite program.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">What is SAQ and S&C training?</h3>
                  <p className="text-muted-foreground leading-relaxed">
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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We are grateful for the support that help make our program possible.
            </p>
          </div>

<div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
  {/* SGM Sponsor */}
  <div className="w-44 h-40 rounded-lg border-2 border-primary/20 bg-white flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors p-4">
  <img
    src="/sponsor-sgm.png"
    alt="SGM Sponsor"
    className="w-full h-full object-contain"
  />
  </div>
  {/* Grease Monkey Sponsor */}
  <div className="w-44 h-40 rounded-lg border-2 border-primary/20 bg-white flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors p-4">
  <img
    src="/sponsor-grease-monkey.png"
    alt="Grease Monkey - Oil Changes & More"
    className="w-full h-full object-contain"
  />
  </div>
  {/* Swift Sessions Sponsor */}
  <div className="w-44 h-40 rounded-lg border-2 border-primary/20 bg-white flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors p-4">
  <img
    src="/sponsor-swift-sessions.png"
    alt="Swift Sessions"
    className="w-full h-full object-contain"
  />
  </div>
  {/* Main Design Print Co. Sponsor */}
  <div className="w-44 h-40 rounded-lg border-2 border-primary/20 bg-white flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors p-4">
  <img
    src="/sponsor-main-design.png"
    alt="Main Design Print Co."
    className="w-full h-full object-contain"
  />
  </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Interested in becoming a sponsor?</p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-12 lg:py-20 bg-primary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">Register Now</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join PolyRISE Football and start your journey to becoming an elite athlete. Select your program below to get started.
            </p>
            <div className="bg-card border border-border rounded-lg p-6">
              <MindBodyWidget />
            </div>
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
                <p className="text-lg text-muted-foreground leading-relaxed">
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
                    <div className="text-muted-foreground">Dripping Springs, Texas (Austin area)</div>
                    <div className="text-sm text-muted-foreground">
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
                    <a href="https://wa.me/18176583300" className="text-white hover:underline">
                      +1 (817) 658-3300
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1 text-white">Email</div>
                    <a href="mailto:polyrise@polyrisefootball.com" className="text-white hover:underline block">
                      polyrise@polyrisefootball.com
                    </a>
                    <a href="mailto:kg@polyrisefootball.com" className="text-white hover:underline block">
                      kg@polyrisefootball.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium mb-1 text-white">Phone</div>
                    <a href="tel:+18176583300" className="text-white hover:underline">
                      +1 (817) 658-3300
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border-border">
              <div className="pt-6">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors"
                  >
                    Send Message
                  </button>
                  <p className="text-xs text-muted-foreground text-center">
                    This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                  </p>
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
              Join our football program for expert coaching and football skills development. Registration is now open
              for all programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#register"
                className="text-base bg-[#FF6600] text-white px-4 py-2 rounded hover:bg-[#FF6600]/80 transition-colors inline-flex items-center"
              >
                Register for Training
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="#contact"
                className="text-base bg-transparent border border-primary px-4 py-2 rounded hover:bg-primary/10 transition-colors"
              >
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
                <span className="font-display font-bold">PolyRISE Football</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Building stronger, faster, and character-driven young athletes in Dripping Springs, Texas (Austin area) and beyond.
              </p>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">Programs</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#programs" className="hover:text-foreground transition-colors">
                    Player Development
                  </Link>
                </li>
                <li>
                  <Link href="#programs" className="hover:text-foreground transition-colors">
                    {"Player Dev & Recruiting"}
                  </Link>
                </li>
                <li>
                  <Link href="#programs" className="hover:text-foreground transition-colors">
                    360 Elite
                  </Link>
                </li>
                <li>
                  <Link href="#programs" className="hover:text-foreground transition-colors">
                    Football Tournament
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/#about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#register"
                    className="hover:text-foreground transition-colors"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61573903568901"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.x.com/PolyRise7v7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/polyrise_football/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>Copyright © 2025 PolyRISE Football - All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
