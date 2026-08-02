import { Archivo_Black } from "next/font/google"
import type { Metadata } from "next"
import TheBoardLeaderboard from "@/components/the-board-leaderboard"

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
})

export const metadata: Metadata = {
  title: "THE BOARD — PolyRISE Athletix",
  description: "Verified combine results from PolyRISE Athletix. Where coaches look. PR-VERIFIED data for 40 Yard Dash, Broad Jump, Vertical Jump, Bench, 5-10-5 Shuttle, and L-Drill.",
  openGraph: {
    title: "THE BOARD — PolyRISE Athletix",
    description: "Verified combine results. Where coaches look.",
    type: "website",
    url: "https://polyrisefootball.com/the-board",
    images: [
      {
        url: "https://polyrisefootball.com/the-board-logo.png",
        width: 1200,
        height: 630,
        alt: "THE BOARD — PolyRISE Athletix Verified Combine Leaderboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "THE BOARD — PolyRISE Athletix",
    description: "Verified combine results. Where coaches look.",
    images: ["https://polyrisefootball.com/the-board-logo.png"],
  },
}

export default function TheBoardPage() {
  return (
    <div className={archivoBlack.variable}>
      <TheBoardLeaderboard />
    </div>
  )
}
