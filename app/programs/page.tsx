import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Users, Target, Trophy, Zap, Star, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Training Programs | Poly Rise Football",
  description:
    "Explore our comprehensive football training programs: PolyRISE Select ($400/mo), 360 Elite ($750/mo), and Winter Season. Expert coaching, SAQ & S&C training, tournaments, and character development in Austin, Texas.",
  openGraph: {
    title: "Training Programs | Poly Rise Football",
    description:
      "PolyRISE Select ($400/mo) and 360 Elite ($750/mo) football training programs with NFL experience coaching, SAQ & S&C training, 7v7 tournaments in Austin, Texas.",
    url: "https://polyrisefootball.com/programs",
  },
}

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Poly Rise Football Training Programs",
            description: "Youth football training programs in Austin, Texas",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@type": "Service",
                  name: "PolyRISE Select",
                  description:
                    "Comprehensive monthly training package including 16 sessions, complete gear package, SAQ & S&C training, 7v7 tournament entries, film study, and character development events",
                  provider: {
                    "@type": "SportsOrganization",
                    name: "Poly Rise Football",
                  },
                  areaServed: "Austin, Texas",
                  audience: {
                    "@type": "Audience",
                    audienceType: "K-12 Athletes",
                  },
                  offers: {
                    "@type": "Offer",
                    price: "400",
                    priceCurrency: "USD",
                    priceValidUntil: "2026-12-31",
                    availability: "https://schema.org/InStock",
                    url: "https://app.teamlinkt.com/register/find/polyrisefootball",
                  },
                },
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@type": "Service",
                  name: "360 Elite",
                  description:
                    "Premium training package with everything in Select plus one-on-one NFL experience coaching, weekly film study, college visits, NIL & financial literacy classes",
                  provider: {
                    "@type": "SportsOrganization",
                    name: "Poly Rise Football",
                  },
                  areaServed: "Austin, Texas",
                  audience: {
                    "@type": "Audience",
                    audienceType: "K-12 Athletes",
                  },
                  offers: {
                    "@type": "Offer",
                    price: "750",
                    priceCurrency: "USD",
                    priceValidUntil: "2026-12-31",
                    availability: "https://schema.org/InStock",
                    url: "https://app.teamlinkt.com/register/find/polyrisefootball",
                  },
                },
              },
              {
                "@type": "ListItem",
                position: 3,
                item: {
                  "@type": "Service",
                  name: "Winter Season",
                  description: "7v7 competitive season with tournament entries and team training",
                  provider: {
                    "@type": "SportsOrganization",
                    name: "Poly Rise Football",
                  },
                  areaServed: "Austin, Texas",
                  audience: {
                    "@type": "Audience",
                    audienceType: "K-12 Athletes",
                  },
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                    url: "https://app.teamlinkt.com/register/find/polyrisefootball",
                  },
                },
              },
            ],
          }),
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
              <Link href="/programs" className="text-sm font-medium text-foreground">
                Programs
              </Link>
              <Link
                href="/#about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:inline"
              >
                About
              </Link>
              <Link
                href="/#contact"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:inline"
              >
                Contact
              </Link>
              <Button size="sm" asChild>
                <a
                  href="https://app.teamlinkt.com/register/find/polyrisefootball"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register Now
                </a>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6 text-balance">
              Youth Football Training Programs in Austin, Texas
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Expert football coaching and comprehensive training programs for K-12 athletes. Choose from PolyRISE
              Select, 360 Elite with NFL experience coaching, or seasonal Winter programs. Originally based in Austin,
              Texas and expanding to new cities - contact us to find out when we're coming to your location.
            </p>
          </div>
        </div>
      </section>

      {/* Main Programs */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-16">
            {/* PolyRISE Select */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Most Popular</span>
                </div>

                <div>
                  <h2 className="text-4xl font-display font-bold mb-3">PolyRISE Select</h2>
                  <p className="text-3xl font-bold text-primary mb-4">$400/Monthly</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Comprehensive training package including 16 sessions per month (4 weekly), complete gear package,
                    tournament entries, and character development events.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display font-bold text-lg">What's Included:</h3>
                  {[
                    "PolyRISE tee, shorts, gloves, headband, hoodie top & bottom",
                    "16 sessions a month (4 weekly)",
                    "Speed, Agility, Quickness (SAQ) training",
                    "Strength & Condition (S&C) sessions",
                    "Football drills and technique training",
                    "Local & Regional 7v7 showcase tournament entries",
                    "Film study sessions",
                    "Social media blast promotion",
                    "Quarterly military character building event",
                    "3 free PolyRISE camps annually",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <a
                    href="https://app.teamlinkt.com/register/find/polyrisefootball"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pay Now
                  </a>
                </Button>
              </div>

              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border">
                  <Image
                    src="/young-kids-playing-football-practice-team.jpg"
                    alt="PolyRISE Select Training"
                    width={600}
                    height={400}
                    quality={85}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 360 Elite */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary border border-primary">
                  <Trophy className="w-4 h-4 text-primary-foreground" />
                  <span className="text-sm font-medium text-primary-foreground">Elite Package</span>
                </div>

                <div>
                  <h2 className="text-4xl font-display font-bold mb-3">360 Elite</h2>
                  <p className="text-3xl font-bold text-primary mb-4">$750/Monthly</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Our premium package includes everything in PolyRISE Select plus exclusive one-on-one coaching from
                    NFL experience staff, enhanced benefits, and college preparation resources.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display font-bold text-lg">Everything in Select, Plus:</h3>
                  {[
                    "All PolyRISE camps free (no limit)",
                    "One-on-one coaching from NFL experience staff",
                    "Weekly film study with NFL experience staff",
                    "Monthly military character building event",
                    "Discounts at affiliated sports medicine and nutrition shops",
                    "Yearly college visits",
                    "Quarterly NIL & Financial literacy classes",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <a
                    href="https://app.teamlinkt.com/register/find/polyrisefootball"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pay Now
                  </a>
                </Button>
              </div>

              <div className="relative lg:order-1">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-primary/50 border-2">
                  <Image
                    src="/middle-school-football-player-training-focused.jpg"
                    alt="360 Elite Training"
                    width={600}
                    height={400}
                    quality={85}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Winter Season */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Seasonal Program</span>
                </div>

                <div>
                  <h2 className="text-4xl font-display font-bold mb-3">Winter Season</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Join our PolyRISE 7v7 winter season for competitive team play, tournament opportunities, and
                    intensive game preparation throughout the winter months.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display font-bold text-lg">Program Features:</h3>
                  {[
                    "7v7 competitive team play",
                    "Multiple tournament entries throughout the season",
                    "Regular team practice sessions",
                    "Game strategy and preparation",
                    "Position-specific training in game situations",
                    "Team bonding and leadership development",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <a
                    href="https://app.teamlinkt.com/register/find/polyrisefootball"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pay Now
                  </a>
                </Button>
              </div>

              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border">
                  <Image
                    src="/high-school-football-athlete-intense-training.jpg"
                    alt="Winter Season 7v7"
                    width={600}
                    height={400}
                    quality={85}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Schedule */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold mb-4">Training Schedule</h2>
              <p className="text-lg text-muted-foreground">January - February 2026</p>
              <p className="text-sm text-muted-foreground mt-2">Starting January 6, 2026</p>
            </div>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <p className="text-muted-foreground text-center">
                    Exactly 4 sessions per week (Tue, Wed, Sat, Sun), totaling 16 per month.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-muted/50 border-border">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Target className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-bold">Tuesday</div>
                            <div className="text-sm text-muted-foreground">6:00 PM</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">S&C - Strength & Conditioning</div>
                          <div className="text-sm text-muted-foreground">at Swift Sessions</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50 border-border">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-bold">Wednesday</div>
                            <div className="text-sm text-muted-foreground">6:00 PM</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">SAQ - Speed, Agility & Quickness</div>
                          <div className="text-sm text-muted-foreground">at Swift Sessions</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50 border-border">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-bold">Saturday</div>
                            <div className="text-sm text-muted-foreground">9:00 AM</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Field Practice</div>
                          <div className="text-sm text-muted-foreground">at TBD Field</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50 border-border">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-bold">Sunday</div>
                            <div className="text-sm text-muted-foreground">3:00 PM</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Field Practice</div>
                          <div className="text-sm text-muted-foreground">at TBD Field</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary-foreground text-balance">
              Ready to Join?
            </h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Register now for our training programs and start your journey to becoming a better athlete both on and off
              the field.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a
                  href="https://app.teamlinkt.com/register/find/polyrisefootball"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register Now
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/#contact">Contact Us</Link>
              </Button>
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
                <Image
                  src="/poly-rise-logo.png"
                  alt="Poly Rise Football"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
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
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/polyrise_football/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057 1.645.069 4.849.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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
