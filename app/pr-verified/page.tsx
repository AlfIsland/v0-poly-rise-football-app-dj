import { Archivo_Black } from "next/font/google"
import type { Metadata } from "next"
import PRVerifiedLeaderboard from "@/components/pr-verified-leaderboard"

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
})

export const metadata: Metadata = {
  title: "PR-VERIFIED Leaderboard | PolyRISE Athletix",
  description:
    "Official PolyRISE Athletix combine metrics leaderboard. Verified athlete performance data — no self-reported numbers. 40 Yard Dash, Broad Jump, Bench Press, Vertical Jump, Shuttle, and PR Score rankings.",
}

export default function PRVerifiedPage() {
  return (
    <div className={archivoBlack.variable}>
      <PRVerifiedLeaderboard />
    </div>
  )
}
