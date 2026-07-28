import { ArrowRight, Trophy, Users, Target, Star, Calendar, MapPin, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Top25Players } from "@/components/top-25-players"

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "Poly Rise Football",
    description: "Elite youth football training and development programs in Austin, Texas",
    logo: "https://polyrisefootball.com/poly-rise-logo.png",
    image: "https://polyrisefootball.com/combine-training-athletes.jpg",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Austin",
      addressRegion: "TX",
      addressCountry: "US",
    },
    url: "https://polyrisefootball.com",
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/poly-rise-logo.png"
                alt="Poly Rise Football Logo"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
              <span className="font-display font-bold text-xl hidden sm:inline">Poly Rise Football</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/programs"
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
                className="text-sm font-medium bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors"
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
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Elite Youth Football Training</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight text-balance">
                Elite Football Training and Skills Development for{" "}
                <span className="text-primary">Youth Athletes (4th - 12th)</span>
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed text-pretty">
                Join Poly Rise Football for expert coaching and comprehensive football skills development. Professional
                SAQ (Speed, Agility, Quickness) and S&C (Strength & Conditioning) training with NFL experience staff.
                Building stronger, faster, and character-driven young athletes in Austin, Texas and expanding to cities
                nationwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="https://app.teamlinkt.com/register/find/polyrisefootball"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors"
                >
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="#about"
                  className="text-base bg-transparent border border-primary px-4 py-2 rounded hover:bg-primary/10 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border bg-muted">
                <Image
                  src="/combine-training-athletes.jpg"
                  alt="Youth athlete training at Poly Rise Football"
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

      {/* PolyRISE 7v7 Tournament Section */}
      <section className="py-12 lg:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4 text-balance">
            PolyRISE 7v7 Tournament
          </h2>
          <p className="text-xl lg:text-2xl font-semibold mb-2">
            1st Annual PolyRISE Football 7v7 Showcase
          </p>
          <div className="flex items-center justify-center gap-3 text-lg lg:text-xl">
            <Calendar className="w-6 h-6" />
            <span className="font-medium">May 30, 2026</span>
          </div>
        </div>
      </section>

      {/* PolyRISE Football Coaches Board Section */}
      <section className="py-16 lg:py-24 bg-background">
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
              <h3 className="font-bold text-foreground mb-1">Coach Traves</h3>
              <p className="text-xs text-primary font-semibold mb-2">RB/S</p>
              <p className="text-xs text-muted-foreground">Former Navy Safety & LB, All-East Teams 2011-12, Citadel Football</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <h3 className="font-bold text-foreground mb-1">Coach John</h3>
              <p className="text-xs text-primary font-semibold mb-2">QB</p>
              <p className="text-xs text-muted-foreground">Former Navy Football QB, Naval Academy Graduate & Officer</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <h3 className="font-bold text-foreground mb-1">Coach Brayden</h3>
              <p className="text-xs text-primary font-semibold mb-2">LB/DL</p>
              <p className="text-xs text-muted-foreground">Baylor 18-21, NFL Draft 2023, IFL All-Pro & League Champion 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top 5 Players Section */}
      <Top25Players />

      {/* Mission Section */}
      <section id="about" className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-balance">About Poly Rise Football</h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              At Poly Rise Football, we are dedicated to building stronger, faster, and character-driven young athletes.
              Our mission is to provide top-tier training and resources that enhance their football skills and elevate
              them both on and off the field.
            </p>
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

      {/* Programs Preview */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-display font-bold">Programs</h2>
              <p className="text-lg text-muted-foreground">Training packages designed for every level of commitment</p>
            </div>
            <Link
              href="/programs"
              className="hidden md:inline-flex bg-transparent border border-primary px-4 py-2 rounded hover:bg-primary/10 transition-colors"
            >
              View All Programs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src="/athlete-training-drill.jpg"
                  alt="PolyRISE Select Training"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-sm font-medium">
                  Most Popular
                </div>
              </div>
              <div className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-display font-bold mb-2">PolyRISE Select</h3>
                  <div className="text-2xl font-bold text-primary mb-3">$400/Monthly</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    16 sessions a month including SAQ, S&C, football drills, tournament entries, film study, and
                    quarterly military character building events.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">PolyRISE gear package included</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Local & regional 7v7 tournaments</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">3 free PolyRISE camps annually</span>
                  </div>
                </div>
                <Link
                  href="https://app.teamlinkt.com/register/find/polyrisefootball"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors"
                >
                  Pay Now
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
                  <div className="text-2xl font-bold text-primary mb-3">$750/Monthly</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Everything in Select plus one-on-one coaching from NFL experience staff, weekly film study, and
                    exclusive benefits.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">All PolyRISE camps free</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">One-on-one NFL experience coaching</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Yearly college visits & NIL classes</span>
                  </div>
                </div>
                <Link
                  href="https://app.teamlinkt.com/register/find/polyrisefootball"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors"
                >
                  Pay Now
                </Link>
              </div>
            </div>

            <div className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src="/athlete-agility-drills.jpg"
                  alt="Winter Season"
                  className="w-full h-full object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-sm font-medium">
                  Seasonal
                </div>
              </div>
              <div className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-display font-bold mb-2">Winter Season</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    PolyRISE 7v7 winter season program. Competitive team play with tournament opportunities throughout
                    the winter months.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">7v7 competitive play</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Tournament entries</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Team training sessions</span>
                  </div>
                </div>
                <Link
                  href="https://app.teamlinkt.com/register/find/polyrisefootball"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors"
                >
                  Pay Now
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/programs"
            className="w-full mt-8 md:hidden bg-transparent border border-primary px-4 py-2 rounded hover:bg-primary/10 transition-colors"
          >
            View All Programs
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* Training Schedule Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">Football Training Schedule</h2>
              <p className="text-lg text-muted-foreground">January - February 2026</p>
              <p className="text-sm text-muted-foreground mt-2">Starting January 6, 2026</p>
            </div>

            <div className="bg-card border-border">
              <div className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg mb-4">Weekly Training Sessions</h3>
                    <p className="text-muted-foreground mb-4">
                      Exactly 4 sessions per week (Tue, Wed, Sat, Sun), totaling 16 per month.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium mb-1">Tuesday: S&C</div>
                          <div className="text-sm text-muted-foreground">Strength & Conditioning</div>
                          <div className="text-sm text-muted-foreground">6:00 PM at Swift Sessions</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium mb-1">Wednesday: SAQ</div>
                          <div className="text-sm text-muted-foreground">Speed, Agility & Quickness</div>
                          <div className="text-sm text-muted-foreground">6:00 PM at Swift Sessions</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium mb-1">Saturday: Field Practice</div>
                          <div className="text-sm text-muted-foreground">Football drills & scrimmage</div>
                          <div className="text-sm text-muted-foreground">9:00 AM at TBD Field</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium mb-1">Sunday: Field Practice</div>
                          <div className="text-sm text-muted-foreground">Football drills & scrimmage</div>
                          <div className="text-sm text-muted-foreground">3:00 PM at TBD Field</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">Everything you need to know about Poly Rise Football</p>
            </div>

            <div className="space-y-6">
              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">
                    What age groups does Poly Rise Football train?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Poly Rise Football provides elite training for K-12 athletes, including youth, middle school, and
                    high school players. Our programs are designed to develop athletes at every level, from beginners to
                    those preparing for college recruitment.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">Where is Poly Rise Football located?</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Poly Rise Football is based in Austin, Texas, with training sessions at Swift Sessions and local
                    fields. We are expanding to other cities nationwide. Contact us to find out when we're coming to
                    your location.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">
                    What is included in the PolyRISE Select program?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    PolyRISE Select ($400/month) includes 16 training sessions monthly, complete gear package (tee,
                    shorts, gloves, headband, hoodie), SAQ and S&C training, football drills, local & regional 7v7
                    tournament entries, film study, quarterly military character building events, and 3 free camps
                    annually.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">
                    What makes 360 Elite different from PolyRISE Select?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    360 Elite ($750/month) includes everything in PolyRISE Select plus one-on-one coaching from NFL
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
                    Training includes 4 weekly sessions (16 per month): Tuesday 6pm S&C at Swift Sessions, Wednesday 6pm
                    SAQ at Swift Sessions, Saturday 9am field practice, and Sunday 3pm field practice. The current
                    schedule runs January-February 2026 starting January 6.
                  </p>
                </div>
              </div>

              <div className="bg-card border-border">
                <div className="pt-6">
                  <h3 className="font-display font-bold text-lg mb-2">
                    Does Poly Rise Football have coaches with NFL experience?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Yes, Poly Rise Football has coaches with NFL experience on staff who provide one-on-one coaching,
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

      {/* Contact Section */}
      <section id="contact" className="py-20 lg:py-32 bg-muted/30">
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
                    <div className="text-muted-foreground">Austin, Texas</div>
                    <div className="text-sm text-muted-foreground">
                      Expanding to other cities - Contact us to find out when we're coming to your location
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
                    <div className="font-medium mb-1">WhatsApp</div>
                    <a href="https://wa.me/18176583300" className="text-primary hover:underline">
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
                    <div className="font-medium mb-1">Email</div>
                    <a href="mailto:polyrise@polyrisefootball.com" className="text-primary hover:underline">
                      polyrise@polyrisefootball.com
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
                    <div className="font-medium mb-1">Phone</div>
                    <a href="tel:+18176583300" className="text-primary hover:underline">
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
                    className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors"
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
      <section id="register" className="py-20 lg:py-32 bg-primary">
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
                href="https://app.teamlinkt.com/register/find/polyrisefootball"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors"
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
                <span className="font-display font-bold">Poly Rise Football</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Building stronger, faster, and character-driven young athletes in Austin, Texas and beyond.
              </p>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">Programs</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/programs" className="hover:text-foreground transition-colors">
                    PolyRISE Select
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="hover:text-foreground transition-colors">
                    360 Elite
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="hover:text-foreground transition-colors">
                    Winter Season
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
                  <a
                    href="https://app.teamlinkt.com/register/find/polyrisefootball"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Register
                  </a>
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
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.644-.07-4.849-.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.281-.073-1.689-.073-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.69-.073 4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.057-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" />
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
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>Copyright © 2025 poly rise football - All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
