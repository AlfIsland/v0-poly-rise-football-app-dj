import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Poly Rise Football | Elite Youth Football Training in Austin, TX",
  description:
    "Elite youth football training in Austin, Texas focused on developing athletic excellence, discipline, and leadership. Professional coaching for K-12 athletes. Expanding to cities nationwide.",
  generator: "v0.app",
  keywords: [
    "football training",
    "youth football",
    "Austin",
    "Texas",
    "K-12 sports",
    "athletic training",
    "character development",
    "7v7 football",
    "youth sports training",
    "football camps",
    "speed and agility training",
    "strength and conditioning",
    "SAQ training",
    "S&C training",
    "football skills development",
    "youth athlete development",
    "Austin youth sports",
    "Texas football training",
    "NFL coaching",
    "PolyRISE Select",
    "360 Elite",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/poly-rise-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://polyrisefootball.com",
    siteName: "Poly Rise Football",
    title: "Poly Rise Football | Elite Youth Football Training in Austin, TX",
    description:
      "Elite youth football training in Austin, Texas. Professional coaching, SAQ & S&C programs, 7v7 tournaments, character development for K-12 athletes.",
    images: [
      {
        url: "/poly-rise-logo.png",
        width: 1200,
        height: 630,
        alt: "Poly Rise Football - Elite Youth Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Poly Rise Football | Elite Youth Football Training",
    description: "Elite youth football training in Austin, TX. Professional coaching for K-12 athletes.",
    images: ["/poly-rise-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://polyrisefootball.com",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsOrganization",
              name: "Poly Rise Football",
              description:
                "Elite youth football training organization focused on developing athletic excellence, discipline, and leadership in K-12 athletes.",
              url: "https://polyrisefootball.com",
              logo: "https://polyrisefootball.com/poly-rise-logo.png",
              image: "https://polyrisefootball.com/poly-rise-logo.png",
              telephone: "+1-512-593-3933",
              email: "coachjonathan@polyrisefootball.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Austin",
                addressRegion: "TX",
                addressCountry: "US",
              },
              areaServed: {
                "@type": "Place",
                name: "Austin, Texas and expanding nationwide",
              },
              sport: "American Football",
              sameAs: [
                "https://www.instagram.com/polyrisefootball/",
                "https://www.facebook.com/PolyRiseFootball",
                "https://www.tiktok.com/@polyrisefootball",
                "https://www.youtube.com/@PolyRiseFootball",
              ],
              offers: [
                {
                  "@type": "Offer",
                  name: "PolyRISE Select",
                  description:
                    "Comprehensive monthly training package with 16 sessions, gear package, SAQ & S&C training, 7v7 tournaments, and character development",
                  price: "400",
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  url: "https://app.teamlinkt.com/register/find/polyrisefootball",
                  category: "Youth Football Training Program",
                },
                {
                  "@type": "Offer",
                  name: "360 Elite",
                  description:
                    "Premium training package with everything in Select plus one-on-one NFL experience coaching, weekly film study, college visits, and NIL classes",
                  price: "750",
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  url: "https://app.teamlinkt.com/register/find/polyrisefootball",
                  category: "Elite Youth Football Training Program",
                },
                {
                  "@type": "Offer",
                  name: "Winter Season",
                  description: "7v7 competitive season with tournament entries and team training",
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  url: "https://app.teamlinkt.com/register/find/polyrisefootball",
                  category: "Seasonal Football Program",
                },
              ],
              potentialAction: [
                {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "/api/programs?search={search_term}",
                    description: "Search available football training programs",
                  },
                  "query-input": "required name=search_term",
                },
                {
                  "@type": "CheckAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "/api/availability?city={city}",
                    description: "Check program availability in a specific city",
                  },
                  "query-input": "required name=city",
                },
                {
                  "@type": "RegisterAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "/api/inquiry",
                    httpMethod: "POST",
                    contentType: "application/json",
                    description: "Submit registration inquiry with athlete and parent information",
                  },
                  object: {
                    "@type": "RegisterAction",
                    description:
                      "Submit registration inquiry. Required fields: parentName, parentEmail, athleteName, athleteAge, city, programInterest",
                  },
                },
              ],
            }),
          }}
        />
        <Script
          id="webapi-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebAPI",
              name: "Poly Rise Football API",
              description:
                "Public REST API for AI agents and developers to query football training programs, check availability by city, and submit registration inquiries programmatically",
              url: "/api",
              documentation: "/api-docs",
              provider: {
                "@type": "SportsOrganization",
                name: "Poly Rise Football",
              },
              termsOfService: "/terms",
              potentialAction: [
                {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "/api/programs",
                    actionPlatform: [
                      "http://schema.org/DesktopWebPlatform",
                      "http://schema.org/MobileWebPlatform",
                      "http://schema.org/APIReference",
                    ],
                  },
                  result: {
                    "@type": "ItemList",
                    description: "List of available training programs with pricing and details",
                  },
                },
                {
                  "@type": "CheckAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "/api/availability?city={city}&ageGroup={ageGroup}",
                    actionPlatform: [
                      "http://schema.org/DesktopWebPlatform",
                      "http://schema.org/MobileWebPlatform",
                      "http://schema.org/APIReference",
                    ],
                  },
                  "query-input": ["required name=city", "optional name=ageGroup"],
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
