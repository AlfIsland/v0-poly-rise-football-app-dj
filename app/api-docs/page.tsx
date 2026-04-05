import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "API Documentation - PolyRISE Football",
  description:
    "Public REST API documentation for AI agents and developers to integrate with PolyRISE Football programs, check availability, and submit registration inquiries.",
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={40} height={40} />
            <span className="text-xl font-bold">PolyRISE Football</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Hero */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">API Documentation</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Public REST API for AI agents and developers to integrate with PolyRISE Football
            </p>
          </div>

          {/* Overview */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              The PolyRISE Football API enables AI agents (ChatGPT, Grok, Gemini, Claude) and developers to
              programmatically access program information, check availability by location, and submit registration
              inquiries on behalf of users.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold mb-2">Base URL:</p>
              <code className="text-sm">/api</code>
              <p className="text-xs text-muted-foreground mt-2">
                Note: All endpoints use relative paths and work on any deployment (preview, staging, production)
              </p>
            </div>
          </section>

          {/* Authentication */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Authentication</h2>
            <p className="text-muted-foreground leading-relaxed">
              No authentication required. All endpoints are publicly accessible for AI agents and developers. Rate
              limiting applies for fair use.
            </p>
          </section>

          {/* Endpoints */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Endpoints</h2>

            {/* GET /api */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded text-sm font-semibold">GET</span>
                <code className="text-lg">/api</code>
              </div>
              <p className="text-muted-foreground">Get API documentation and available endpoints</p>
              <div className="bg-muted p-4 rounded">
                <p className="text-sm font-semibold mb-2">Example Request:</p>
                <code className="text-sm">GET /api</code>
              </div>
            </div>

            {/* GET /api/programs */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded text-sm font-semibold">GET</span>
                <code className="text-lg">/api/programs</code>
              </div>
              <p className="text-muted-foreground">
                List all available training programs with pricing, features, and details
              </p>
              <div className="bg-muted p-4 rounded space-y-2">
                <p className="text-sm font-semibold">Example Request:</p>
                <code className="text-sm block">GET /api/programs</code>
                <p className="text-sm font-semibold mt-4">Response:</p>
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(
                    {
                      programs: [
                        {
                          id: "polyrise-select",
                          name: "PolyRISE Select",
                          price: 400,
                          currency: "USD",
                        },
                      ],
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>

            {/* GET /api/programs/[id] */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded text-sm font-semibold">GET</span>
                <code className="text-lg">/api/programs/:id</code>
              </div>
              <p className="text-muted-foreground">Get detailed information about a specific program</p>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Path Parameters:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    <code>id</code> - Program ID (polyrise-select, 360-elite, winter-season)
                  </li>
                </ul>
              </div>
              <div className="bg-muted p-4 rounded">
                <p className="text-sm font-semibold mb-2">Example Request:</p>
                <code className="text-sm">GET /api/programs/polyrise-select</code>
              </div>
            </div>

            {/* GET /api/availability */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded text-sm font-semibold">GET</span>
                <code className="text-lg">/api/availability</code>
              </div>
              <p className="text-muted-foreground">Check program availability by location and age group</p>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Query Parameters:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    <code>city</code> - City name (optional)
                  </li>
                  <li>
                    <code>ageGroup</code> - Age or grade level (optional)
                  </li>
                </ul>
              </div>
              <div className="bg-muted p-4 rounded">
                <p className="text-sm font-semibold mb-2">Example Request:</p>
                <code className="text-sm">GET /api/availability?city=Austin</code>
              </div>
            </div>

            {/* POST /api/inquiry */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm font-semibold">POST</span>
                <code className="text-lg">/api/inquiry</code>
              </div>
              <p className="text-muted-foreground">Submit registration inquiry or lead</p>
              <div className="bg-muted p-4 rounded space-y-2">
                <p className="text-sm font-semibold">Example Request:</p>
                <pre className="text-xs overflow-x-auto">
                  {`POST /api/inquiry
Content-Type: application/json

{
  "parentName": "John Smith",
  "parentEmail": "john@example.com",
  "parentPhone": "512-555-0100",
  "athleteName": "Mike Smith",
  "athleteAge": 14,
  "athleteGrade": "8th",
  "city": "Austin",
  "state": "TX",
  "programInterest": "polyrise-select",
  "message": "Interested in winter training"
}`}
                </pre>
              </div>
            </div>

            {/* GET /api/inquiry */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded text-sm font-semibold">GET</span>
                <code className="text-lg">/api/inquiry</code>
              </div>
              <p className="text-muted-foreground">Get inquiry form schema and requirements</p>
            </div>
          </section>

          {/* AI Agent Usage */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">AI Agent Usage</h2>
            <p className="text-muted-foreground leading-relaxed">
              AI agents can use these endpoints to help parents find the right program for their athlete, compare
              options, check if programs are available in their city, and submit registration inquiries on behalf of
              users within the chat conversation.
            </p>
            <div className="bg-muted p-6 rounded-lg space-y-3">
              <p className="font-semibold">Example Workflow:</p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>User asks AI agent about youth football training in Austin</li>
                <li>
                  AI agent queries <code>GET /api/availability?city=Austin</code>
                </li>
                <li>
                  AI agent queries <code>GET /api/programs</code> to show options
                </li>
                <li>User selects program and provides athlete information</li>
                <li>
                  AI agent submits <code>POST /api/inquiry</code> with user data
                </li>
                <li>Confirmation returned - coach will follow up directly</li>
              </ol>
            </div>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Support</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about the API? Need higher rate limits? Contact our team:
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
            <Link href="/" className="text-sm text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
