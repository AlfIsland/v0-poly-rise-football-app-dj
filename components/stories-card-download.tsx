"use client"

import { useState } from "react"
import { getAgeTier } from "@/lib/age-tiers"

interface Session {
  fortyYard?: number
  twentyYard?: number
  shuttle?: number
  threeCone?: number
  verticalJump?: number
  broadJump?: number
  benchPress?: number
  pushups?: number
  weight?: number
  height?: string
}

interface Props {
  athleteId: string
  name: string
  position?: string
  school?: string
  grade?: string
  classYear?: string
  age: number
  gender: "M" | "F"
  featured?: boolean
  photoUrl?: string
  twitterHandle?: string
  sessions: Session[]
  compact?: boolean
}

const METRICS = [
  { key: "fortyYard",    label: "40-YD DASH",  unit: "s",     lower: true  },
  { key: "verticalJump", label: "VERTICAL",     unit: '"',     lower: false },
  { key: "shuttle",      label: "5-10-5",       unit: "s",     lower: true  },
  { key: "broadJump",    label: "BROAD JUMP",   unit: '"',     lower: false },
  { key: "threeCone",    label: "3-CONE",       unit: "s",     lower: true  },
  { key: "benchPress",   label: "BENCH 135",    unit: " reps", lower: false },
] as const

type MetricKey = typeof METRICS[number]["key"]

function tierColor(tier: string | null): string {
  if (tier === "Elite")         return "#10B981"
  if (tier === "Above Average") return "#60A5FA"
  if (tier === "Average")       return "#FBBF24"
  return "#6B7280"
}

function tierShortLabel(tier: string | null): string {
  if (tier === "Above Average") return "ABOVE AVG"
  if (!tier) return ""
  return tier.toUpperCase()
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number | [number, number, number, number],
) {
  const [tl, tr, br, bl] = Array.isArray(r) ? r : [r, r, r, r]
  ctx.beginPath()
  ctx.moveTo(x + tl, y)
  ctx.lineTo(x + w - tr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr)
  ctx.lineTo(x + w, y + h - br)
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h)
  ctx.lineTo(x + bl, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl)
  ctx.lineTo(x, y + tl)
  ctx.quadraticCurveTo(x, y, x + tl, y)
  ctx.closePath()
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload  = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export default function StoriesCardDownload({
  athleteId, name, position, school, grade, classYear,
  age, gender, featured, photoUrl, twitterHandle, sessions, compact,
}: Props) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const W      = 1080
      const H      = 1920
      const MARGIN = 72
      const canvas = document.createElement("canvas")
      canvas.width  = W
      canvas.height = H
      const ctx = canvas.getContext("2d")!

      // ── Background ──
      ctx.fillStyle = "#080810"
      ctx.fillRect(0, 0, W, H)

      // Subtle diagonal grid
      ctx.save()
      ctx.strokeStyle = "rgba(255,255,255,0.022)"
      ctx.lineWidth = 1
      for (let i = -H; i < W + H; i += 80) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke()
      }
      ctx.restore()

      // Red glow — top center
      const glow = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, 900)
      glow.addColorStop(0, "rgba(180,10,10,0.28)")
      glow.addColorStop(1, "rgba(180,10,10,0)")
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, H)

      // Bottom purple/dark glow for depth
      const glowBot = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, 700)
      glowBot.addColorStop(0, "rgba(60,10,80,0.25)")
      glowBot.addColorStop(1, "rgba(60,10,80,0)")
      ctx.fillStyle = glowBot
      ctx.fillRect(0, 0, W, H)

      // ── Top bar ──
      const topBar = ctx.createLinearGradient(0, 0, W, 0)
      topBar.addColorStop(0,   "#B40A0A")
      topBar.addColorStop(0.5, "#DC2626")
      topBar.addColorStop(1,   "#7F1D1D")
      ctx.fillStyle = topBar
      ctx.fillRect(0, 0, W, 14)

      // ── Load assets ──
      const [logo, photo] = await Promise.all([
        loadImage("/poly-rise-logo.png"),
        photoUrl ? loadImage(photoUrl) : Promise.resolve(null),
      ])

      // ── PolyRISE header — centered ──
      const headerY = 80
      if (logo) {
        ctx.drawImage(logo, W / 2 - 22, headerY, 44, 44)
      }
      ctx.fillStyle = "#B40A0A"
      ctx.font      = "bold 22px Arial, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("POLYRISE FOOTBALL", W / 2, headerY + 62)
      ctx.fillStyle = "#4B5563"
      ctx.font      = "18px Arial, sans-serif"
      ctx.fillText("VERIFIED RECRUITING PROFILE", W / 2, headerY + 84)
      ctx.textAlign = "left"

      // ── Photo — large centered circle ──
      const PHOTO_R  = 210
      const PHOTO_CX = W / 2
      const PHOTO_CY = headerY + 84 + 60 + PHOTO_R  // ~520

      if (photo) {
        // Outer glow
        ctx.save()
        ctx.shadowColor = "#DC2626"
        ctx.shadowBlur  = 40
        ctx.strokeStyle = "#B40A0A"
        ctx.lineWidth   = 5
        ctx.beginPath()
        ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R + 3, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()

        // Clipped photo
        ctx.save()
        ctx.beginPath()
        ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(photo, PHOTO_CX - PHOTO_R, PHOTO_CY - PHOTO_R, PHOTO_R * 2, PHOTO_R * 2)
        ctx.restore()

        // Border ring
        ctx.strokeStyle = "#B40A0A"
        ctx.lineWidth   = 4
        ctx.beginPath()
        ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R, 0, Math.PI * 2)
        ctx.stroke()
      } else {
        // Placeholder
        ctx.fillStyle = "rgba(180,10,10,0.12)"
        ctx.beginPath()
        ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "rgba(180,10,10,0.35)"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R, 0, Math.PI * 2)
        ctx.stroke()
        ctx.font      = "100px Arial"
        ctx.textAlign = "center"
        ctx.fillText("🏈", PHOTO_CX, PHOTO_CY + 36)
        ctx.textAlign = "left"
      }

      // ── Name — centered, big ──
      const nameY     = PHOTO_CY + PHOTO_R + 70
      const NAME_MAX  = W - MARGIN * 2
      const nameUpper = name.toUpperCase()
      const nameParts = nameUpper.split(" ")
      let namePx = 86
      ctx.font = `bold ${namePx}px Arial, sans-serif`
      const longest = nameParts.reduce((a, b) => a.length > b.length ? a : b, "")
      while (namePx > 52 && ctx.measureText(longest).width > NAME_MAX) {
        namePx -= 4
        ctx.font = `bold ${namePx}px Arial, sans-serif`
      }
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "center"
      const nameLineH = Math.round(namePx * 1.12)
      if (ctx.measureText(nameUpper).width <= NAME_MAX) {
        ctx.fillText(nameUpper, W / 2, nameY)
      } else {
        let line1 = "", line2 = nameUpper
        for (let i = nameParts.length - 1; i >= 1; i--) {
          const candidate = nameParts.slice(0, i).join(" ")
          if (ctx.measureText(candidate).width <= NAME_MAX) {
            line1 = candidate; line2 = nameParts.slice(i).join(" "); break
          }
        }
        if (!line1) { line1 = nameParts[0]; line2 = nameParts.slice(1).join(" ") }
        ctx.fillText(line1, W / 2, nameY)
        ctx.fillText(line2, W / 2, nameY + nameLineH)
      }
      ctx.textAlign = "left"

      // ── Position · Class of XXXX ──
      const subY     = nameY + nameLineH + 12
      const subParts = [
        position ?? null,
        classYear ? `CLASS OF ${classYear}` : (grade ? `${grade.toUpperCase()}` : null),
      ].filter(Boolean) as string[]

      ctx.font      = "bold 30px Arial, sans-serif"
      ctx.textAlign = "center"
      // Measure total width for centering
      let totalSubW = 0
      subParts.forEach((p, i) => {
        totalSubW += ctx.measureText(p).width
        if (i < subParts.length - 1) totalSubW += ctx.measureText("  ·  ").width
      })
      let subX = W / 2 - totalSubW / 2
      ctx.textAlign = "left"
      subParts.forEach((part, i) => {
        ctx.fillStyle = "#9CA3AF"
        ctx.fillText(part, subX, subY)
        subX += ctx.measureText(part).width
        if (i < subParts.length - 1) {
          ctx.fillStyle = "#B40A0A"
          ctx.fillText("  ·  ", subX, subY)
          subX += ctx.measureText("  ·  ").width
        }
      })

      // School
      if (school) {
        ctx.font      = "26px Arial, sans-serif"
        ctx.fillStyle = "#6B7280"
        ctx.textAlign = "center"
        ctx.fillText(school, W / 2, subY + 36)
        ctx.textAlign = "left"
      }

      // ── Divider ──
      const divY   = subY + (school ? 72 : 48)
      const divGrd = ctx.createLinearGradient(MARGIN, 0, W - MARGIN, 0)
      divGrd.addColorStop(0,   "rgba(180,10,10,0.08)")
      divGrd.addColorStop(0.5, "#DC2626")
      divGrd.addColorStop(1,   "rgba(180,10,10,0.08)")
      ctx.strokeStyle = divGrd
      ctx.lineWidth   = 2
      ctx.beginPath()
      ctx.moveTo(MARGIN, divY); ctx.lineTo(W - MARGIN, divY)
      ctx.stroke()

      // ── Metrics Grid ──
      const baseline = sessions[0] ?? {}
      const latest   = sessions[sessions.length - 1] ?? {}
      const metricsToShow: { label: string; value: string; tier: string | null }[] = []
      for (const m of METRICS) {
        const val = (latest   as Record<string, number | undefined>)[m.key]
               ?? (baseline as Record<string, number | undefined>)[m.key]
        if (val == null) continue
        const tier = getAgeTier(m.key as MetricKey, val, age, gender)
        metricsToShow.push({ label: m.label, value: `${val}${m.unit}`, tier })
        if (metricsToShow.length >= 6) break
      }

      const gridTop  = divY + 32
      const cols     = 2
      const gutter   = 20
      const cellW    = (W - MARGIN * 2 - gutter) / cols
      const cellH    = 170
      const rows     = Math.ceil(metricsToShow.length / cols)

      metricsToShow.forEach((m, i) => {
        const col   = i % cols
        const row   = Math.floor(i / cols)
        const cx    = MARGIN + col * (cellW + gutter)
        const cy    = gridTop + row * (cellH + gutter)
        const color = tierColor(m.tier)

        ctx.fillStyle = "rgba(255,255,255,0.04)"
        roundRect(ctx, cx, cy, cellW, cellH, 18)
        ctx.fill()

        // Accent strip
        const strip = ctx.createLinearGradient(cx, cy, cx, cy + cellH)
        strip.addColorStop(0, color)
        strip.addColorStop(1, color + "44")
        ctx.fillStyle = strip
        roundRect(ctx, cx, cy, 7, cellH, [10, 0, 0, 10])
        ctx.fill()

        ctx.fillStyle = "#6B7280"
        ctx.font      = "bold 21px Arial, sans-serif"
        ctx.fillText(m.label, cx + 24, cy + 44)

        ctx.fillStyle = "#FFFFFF"
        ctx.font      = "bold 56px Arial, sans-serif"
        ctx.fillText(m.value, cx + 24, cy + 112)

        if (m.tier) {
          const bl = tierShortLabel(m.tier)
          ctx.font  = "bold 17px Arial, sans-serif"
          const bw  = ctx.measureText(bl).width + 24
          ctx.fillStyle = color + "28"
          roundRect(ctx, cx + 24, cy + 124, bw, 30, 7)
          ctx.fill()
          ctx.fillStyle = color
          ctx.fillText(bl, cx + 36, cy + 145)
        }
      })

      // ── Bottom section ──
      const gridBottom = gridTop + rows * (cellH + gutter)
      let   botY       = gridBottom + 36

      // PR-VERIFIED badge (if featured)
      if (featured) {
        const prW = 270
        const prX = W / 2 - prW / 2
        ctx.fillStyle   = "rgba(127,29,29,0.5)"
        roundRect(ctx, prX, botY, prW, 56, 14)
        ctx.fill()
        ctx.strokeStyle = "#B40A0A"
        ctx.lineWidth   = 1.5
        roundRect(ctx, prX, botY, prW, 56, 14)
        ctx.stroke()
        ctx.fillStyle = "#FCA5A5"
        ctx.font      = "bold 24px Arial, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("✓  PR-VERIFIED ATHLETE", W / 2, botY + 36)
        ctx.textAlign = "left"
        botY += 76
      }

      // X handle (if set)
      if (twitterHandle) {
        const handle = "@" + twitterHandle.replace(/^@/, "")
        ctx.font         = "bold 26px Arial, sans-serif"
        ctx.fillStyle    = "#38BDF8"
        ctx.textAlign    = "center"
        ctx.fillText(`𝕏 ${handle}`, W / 2, botY + 32)
        ctx.textAlign    = "left"
        botY += 52
      }

      // ── Dark footer strip ──
      const footerH = 200
      const footerY = H - footerH
      ctx.fillStyle = "rgba(0,0,0,0.6)"
      ctx.fillRect(0, footerY, W, footerH)
      ctx.strokeStyle = "#B40A0A"
      ctx.lineWidth   = 1.5
      ctx.beginPath()
      ctx.moveTo(0, footerY); ctx.lineTo(W, footerY)
      ctx.stroke()

      // Tag line — baked into card so the athlete tags PolyRISE automatically
      ctx.font      = "bold 28px Arial, sans-serif"
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "center"
      ctx.fillText("@polyrisefootball", W / 2, footerY + 50)

      ctx.font      = "22px Arial, sans-serif"
      ctx.fillStyle = "#EF4444"
      ctx.fillText(`polyrisefootball.com/athlete/${athleteId}`, W / 2, footerY + 86)

      ctx.font      = "18px Arial, sans-serif"
      ctx.fillStyle = "#374151"
      ctx.fillText("PolyRISE Football  ·  Dripping Springs, TX", W / 2, footerY + 118)

      // Sessions line
      if (sessions.length > 0) {
        ctx.font      = "17px Arial, sans-serif"
        ctx.fillStyle = "#4B5563"
        ctx.fillText(`${sessions.length} verified training session${sessions.length !== 1 ? "s" : ""}`, W / 2, footerY + 148)
      }
      ctx.textAlign = "left"

      // ── Bottom bar ──
      ctx.fillStyle = topBar
      ctx.fillRect(0, H - 14, W, 14)

      // ── Download ──
      const link    = document.createElement("a")
      link.download = `${name.replace(/\s+/g, "-").toLowerCase()}-polyrise-story.png`
      link.href     = canvas.toDataURL("image/png", 1.0)
      link.click()

    } catch (err) {
      console.error("Stories card generation failed:", err)
    }
    setLoading(false)
  }

  if (compact) {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        title="Download Stories Card"
        className="flex items-center gap-1.5 bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-black px-3 py-2 rounded-xl text-xs transition-colors uppercase tracking-wide whitespace-nowrap"
      >
        {loading ? "..." : "📱 Story"}
      </button>
    )
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 hover:from-purple-600 hover:via-pink-500 hover:to-purple-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-black rounded-xl py-4 transition-all text-sm tracking-widest uppercase shadow-xl shadow-purple-900/30 border border-purple-500/20"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Building Story...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12" y2="18"/>
          </svg>
          Save Story Card · Post to Instagram
        </>
      )}
    </button>
  )
}
