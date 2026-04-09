import "iterator-helpers-polyfill"

import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import ChatWidget from "@/components/chat-widget"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "PolyRISE Football | Elite Youth Football Training in Austin & Dripping Springs, TX",
  description:
    "PolyRISE Football offers NFL-coached youth, middle school, and high school football training in Dripping Springs and Austin, TX. PR-VERIFIED combine testing, recruiting packages, and elite player development for K-12 athletes.",
  generator: "v0.app",
  keywords: [
    "youth football training Dripping Springs TX",
    "youth football training Austin TX",
    "kids football program",
    "youth sports development",
    "football training for kids",
    "best youth football program Austin",
    "football camps for kids Texas",
    "youth athlete development",
    "high school football training",
    "middle school football program",
    "girls football training",
    "female youth football",
    "7v7 football tournaments",
    "college football recruitment help",
    "NFL coaching for youth",
    "speed agility training kids",
    "strength conditioning youth athletes",
    "character development sports",
    "after school football program",
    "weekend football training",
    "summer football camp Austin",
    "youth sports near me",
    "football skills training",
    "quarterback training Austin",
    "wide receiver training",
    "defensive back training",
    "youth football combine",
    "PR-VERIFIED combine testing",
    "PolyRISE Football",
    "360 Elite program",
    "Player Development football",
    "Dripping Springs football",
    "Central Texas youth football",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/poly-rise-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://polyrisefootball.com",
    siteName: "PolyRISE Football",
    title: "PolyRISE Football | Elite Youth Football Training in Austin & Dripping Springs, TX",
    description:
      "NFL-coached youth football training in Dripping Springs and Austin, TX. PR-VERIFIED combine testing, recruiting packages, and elite player development for K-12 athletes.",
    images: [
      {
        url: "https://polyrisefootball.com/poly-rise-logo.png",
        width: 1200,
        height: 630,
        alt: "PolyRISE Football - Elite Youth Football Training in Dripping Springs and Austin Texas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@polyrisefootball",
    title: "PolyRISE Football | Elite Youth Football Training in Austin & Dripping Springs, TX",
    description: "NFL-coached youth football training in Dripping Springs and Austin, TX. PR-VERIFIED combine testing and elite player development for K-12 athletes.",
    images: ["https://polyrisefootball.com/poly-rise-logo.png"],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* AI Agent Discovery Links */}
        <link rel="ai-plugin" href="/.well-known/ai-plugin.json" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Information" />
        <link rel="alternate" type="application/json" href="/api/openapi.json" title="OpenAPI Specification" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <ChatWidget />
        <Analytics />
      {/* v0 – built-with badge */}
  <div dangerouslySetInnerHTML={{ __html: `<div id="v0-built-with-button-53655db8-e3ba-46d8-b99f-50b8a4630d68" style="
border: 1px solid hsl(0deg 0% 100% / 12%);
position: fixed;
bottom: 24px;
right: 24px;
z-index: 1000;
background: #121212;
color: white;
padding: 8px 12px;
border-radius: 8px;
font-weight: 400;
font-size: 14px;
box-shadow: 0 2px 8px rgba(0,0,0,0.12);
letter-spacing: 0.02em;
transition: all 0.2s;
display: flex;
align-items: center;
gap: 4px;
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
">
<a
  href="https://v0.app/chat/api/open/built-with-v0/b_TrTiyalm9d8?ref=QRH4EB"
  target="_blank"
  rel="noopener"
  style="
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
  "
>
  Built with
  <svg
    fill="currentColor"
    viewBox="0 0 147 70"
    xmlns="http://www.w3.org/2000/svg"
    style="width: 20px; height: 20px;"
  >
    <path d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z" />
    <path d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z" />
  </svg>
</a>

<button
  onclick="document.getElementById('v0-built-with-button-53655db8-e3ba-46d8-b99f-50b8a4630d68').style.display='none'"
  onmouseenter="this.style.opacity='1'"
  onmouseleave="this.style.opacity='0.7'"
  style="
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 2px;
    margin-left: 4px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    opacity: 0.7;
    transition: opacity 0.2s;
    transform: translateZ(0);
  "
  aria-label="Close"
>
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
</button>

<span style="
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
">
  v0
</span>
</div>` }} />
</body>
    </html>
  )
}
