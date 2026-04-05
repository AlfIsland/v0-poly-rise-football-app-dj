import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "AI Integration Guide - PolyRISE Football",
  description:
    "Complete guide for AI agents to integrate with PolyRISE Football for seamless program discovery and registration within chat conversations.",
}

export default function AiGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={40} height={40} />
            <span className="text-xl font-bold">PolyRISE Football</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/api-docs" className="text-sm text-muted-foreground hover:text-foreground">
              API Docs
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Hero */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">AI Agent Integration Guide</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Complete guide for AI assistants to help parents discover and register for PolyRISE Football programs
            </p>
          </div>

          {/* Quick Start */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold">Quick Start</h2>
            <p className="text-muted-foreground leading-relaxed">
              PolyRISE Football provides public REST APIs that enable AI agents (ChatGPT, Grok, Gemini, Claude, etc.)
              to help parents find the right football training program and submit registration inquiries without leaving
              the chat conversation.
            </p>
            <div className="space-y-2">
              <p className="font-semibold">Base URL:</p>
              <code className="block bg-background p-3 rounded text-sm">/api</code>
              <p className="text-xs text-muted-foreground">
                All endpoints use relative paths and work on any deployment environment
              </p>
            </div>
          </section>

          {/* Use Cases */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Common Use Cases</h2>
            <div className="grid gap-4">
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Program Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  User asks: "What football training programs are available for my 13-year-old?"
                </p>
                <p className="text-sm mt-2">
                  → Query <code>GET /api/programs</code> and present options with pricing
                </p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Location Availability</h3>
                <p className="text-sm text-muted-foreground">User asks: "Do you have programs in Dallas?"</p>
                <p className="text-sm mt-2">
                  → Query <code>GET /api/availability?city=Dallas</code>
                </p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Registration Inquiry</h3>
                <p className="text-sm text-muted-foreground">User wants to sign up for PolyRISE Select</p>
                <p className="text-sm mt-2">
                  → Collect info and submit <code>POST /api/inquiry</code>
                </p>
              </div>
            </div>
          </section>

          {/* Step-by-Step */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Step-by-Step Integration</h2>

            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">Step 1: Check Availability</h3>
                <p className="text-sm text-muted-foreground">
                  When a user mentions their location, check if programs are available in their city.
                </p>
                <code className="block bg-muted p-3 rounded text-sm">
                  GET /api/availability?city=Austin&ageGroup=8th-grade
                </code>
              </div>

              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">Step 2: Show Programs</h3>
                <p className="text-sm text-muted-foreground">
                  Retrieve all available programs with pricing and features.
                </p>
                <code className="block bg-muted p-3 rounded text-sm">GET /api/programs</code>
              </div>

              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">Step 3: Get Program Details</h3>
                <p className="text-sm text-muted-foreground">
                  If user asks about a specific program, get detailed information.
                </p>
                <code className="block bg-muted p-3 rounded text-sm">GET /api/programs/polyrise-select</code>
              </div>

              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">Step 4: Collect Information</h3>
                <p className="text-sm text-muted-foreground">
                  When user is ready to register, collect required information:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Parent name, email, phone</li>
                  <li>Athlete name, age, grade</li>
                  <li>City and state</li>
                  <li>Program of interest</li>
                  <li>Optional message</li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">Step 5: Submit Inquiry</h3>
                <p className="text-sm text-muted-foreground">Submit the registration inquiry via POST request.</p>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`POST /api/inquiry
Content-Type: application/json

{
  "parentName": "Sarah Johnson",
  "parentEmail": "sarah@example.com",
  "parentPhone": "512-555-0123",
  "athleteName": "Michael Johnson",
  "athleteAge": 13,
  "athleteGrade": "8th",
  "city": "Austin",
  "state": "TX",
  "programInterest": "polyrise-select",
  "message": "Interested in January training"
}`}
                </pre>
              </div>

              <div className="border-l-4 border-primary pl-4 space-y-2">
                <h3 className="font-semibold">Step 6: Confirm Submission</h3>
                <p className="text-sm text-muted-foreground">
                  Inform the user that their inquiry was submitted successfully and the coach will follow up within
                  24-48 hours.
                </p>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Best Practices</h2>
            <div className="space-y-3">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">✓ Always Verify Location First</h3>
                <p className="text-sm text-muted-foreground">
                  Check availability for the user's city before presenting programs. PolyRISE is expanding to new
                  cities.
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">✓ Present Options Clearly</h3>
                <p className="text-sm text-muted-foreground">
                  Show program names, pricing, and key features side-by-side so parents can compare.
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">✓ Collect Complete Information</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure all required fields are collected before submitting the inquiry to avoid validation errors.
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">✓ Set Expectations</h3>
                <p className="text-sm text-muted-foreground">
                  Let users know that submitting an inquiry is not final registration - the coach will follow up to
                  complete the process.
                </p>
              </div>
            </div>
          </section>

          {/* Structured Data */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Structured Data Discovery</h2>
            <p className="text-muted-foreground leading-relaxed">
              The PolyRISE Football website includes JSON-LD structured data with PotentialAction schemas to help AI
              agents automatically discover these APIs when analyzing the site.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Available Actions:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>SearchAction - Query programs with search terms</li>
                <li>RegisterAction - Submit registration inquiries via POST</li>
              </ul>
            </div>
          </section>

          {/* Rate Limits */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Rate Limits & Fair Use</h2>
            <p className="text-muted-foreground leading-relaxed">
              All endpoints are publicly accessible with reasonable rate limits for fair use. For high-volume
              integrations or custom needs, please contact us.
            </p>
          </section>

          {/* Support */}
          <section className="bg-muted p-6 rounded-lg space-y-4">
            <h2 className="text-2xl font-bold">Need Help?</h2>
            <p className="text-muted-foreground">
              Questions about integration? Want to test endpoints? Contact our team:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:polyrise@polyrisefootball.com" className="text-primary hover:underline">
                  polyrise@polyrisefootball.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href="tel:+18176583300" className="text-primary hover:underline">
                  +1 (817) 658-3300
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2026 PolyRISE Football. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/api-docs" className="text-sm text-primary hover:underline">
                API Documentation
              </Link>
              <Link href="/" className="text-sm text-primary hover:underline">
                Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
