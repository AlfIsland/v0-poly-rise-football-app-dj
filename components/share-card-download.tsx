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

interface ShareCardProps {
  athleteId: string
  name: string
  position?: string
  school?: string
  grade?: string
  age: number
  gender: "M" | "F"
  featured?: boolean
  photoUrl?: string
  videoLink?: string
  twitterHandle?: string
  sessions: Session[]
  accolades?: import("@/lib/accolades").Accolade[]
  compact?: boolean
}

const METRICS = [
  { key: "fortyYard",    label: "40-YD DASH",   unit: "s",     lower: true  },
  { key: "verticalJump", label: "VERTICAL",      unit: '"',     lower: false },
  { key: "shuttle",      label: "5-10-5",        unit: "s",     lower: true  },
  { key: "broadJump",    label: "BROAD JUMP",    unit: '"',     lower: false },
  { key: "threeCone",    label: "3-CONE",        unit: "s",     lower: true  },
  { key: "benchPress",   label: "BENCH 135",     unit: " reps", lower: false },
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


export default function ShareCardDownload({
  athleteId, name, position, school, grade, age, gender,
  featured, photoUrl, videoLink, twitterHandle, sessions, accolades, compact,
}: ShareCardProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const SIZE   = 1080
      const MARGIN = 64
      const canvas = document.createElement("canvas")
      canvas.width  = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext("2d")!

      // ── Deep dark background ──
      ctx.fillStyle = "#080810"
      ctx.fillRect(0, 0, SIZE, SIZE)

      // ── Subtle diagonal grid ──
      ctx.save()
      ctx.strokeStyle = "rgba(255,255,255,0.025)"
      ctx.lineWidth = 1
      for (let i = -SIZE; i < SIZE * 2; i += 72) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + SIZE, SIZE); ctx.stroke()
      }
      ctx.restore()

      // ── Red glow top-left ──
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 580)
      glow.addColorStop(0, "rgba(180,10,10,0.20)")
      glow.addColorStop(1, "rgba(180,10,10,0)")
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, SIZE, SIZE)

      // ── Top accent bar ──
      const topBar = ctx.createLinearGradient(0, 0, SIZE, 0)
      topBar.addColorStop(0,   "#B40A0A")
      topBar.addColorStop(0.6, "#DC2626")
      topBar.addColorStop(1,   "#7F1D1D")
      ctx.fillStyle = topBar
      ctx.fillRect(0, 0, SIZE, 10)

      // ── Load assets in parallel ──
      const [logo, photo] = await Promise.all([
        loadImage("/poly-rise-logo.png"),
        photoUrl ? loadImage(photoUrl) : Promise.resolve(null),
      ])

      // ── Photo — large circle, top-right ──
      const PHOTO_SIZE = 240
      const PHOTO_X    = SIZE - MARGIN - PHOTO_SIZE
      const PHOTO_Y    = 20
      const photoCX    = PHOTO_X + PHOTO_SIZE / 2
      const photoCY    = PHOTO_Y + PHOTO_SIZE / 2
      const photoR     = PHOTO_SIZE / 2

      if (photo) {
        // Outer glow ring
        ctx.save()
        ctx.shadowColor = "#DC2626"
        ctx.shadowBlur  = 24
        ctx.strokeStyle = "#B40A0A"
        ctx.lineWidth   = 4
        ctx.beginPath()
        ctx.arc(photoCX, photoCY, photoR + 2, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()

        // Clipped photo
        ctx.save()
        ctx.beginPath()
        ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(photo, PHOTO_X, PHOTO_Y, PHOTO_SIZE, PHOTO_SIZE)
        ctx.restore()

        // Crisp border on top
        ctx.strokeStyle = "#B40A0A"
        ctx.lineWidth   = 3
        ctx.beginPath()
        ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2)
        ctx.stroke()
      } else {
        // Placeholder circle when no photo
        ctx.fillStyle = "rgba(180,10,10,0.12)"
        ctx.beginPath()
        ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "rgba(180,10,10,0.3)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2)
        ctx.stroke()
        // Football emoji placeholder
        ctx.font = "80px Arial"
        ctx.textAlign = "center"
        ctx.fillText("🏈", photoCX, photoCY + 28)
        ctx.textAlign = "left"
      }

      // ── PolyRISE header label ──
      const headerY = 58
      if (logo) ctx.drawImage(logo, MARGIN, headerY - 24, 40, 40)
      const labelX = logo ? MARGIN + 52 : MARGIN
      ctx.fillStyle = "#B40A0A"
      ctx.font      = "bold 21px Arial, sans-serif"
      ctx.fillText("PolyRISE Athletix", labelX, headerY - 4)
      ctx.fillStyle = "#4B5563"
      ctx.font      = "17px Arial, sans-serif"
      ctx.fillText("VERIFIED RECRUITING PROFILE", labelX, headerY + 16)

      // ── Athlete Name (constrained left of photo, wraps to two lines) ──
      const NAME_MAX_W  = PHOTO_X - MARGIN - 28   // stay clear of photo
      const nameUpper   = name.toUpperCase()
      const nameParts   = nameUpper.split(" ")

      // Start at 68px and shrink until the longest single word fits
      let nameFontPx = 68
      ctx.font = `bold ${nameFontPx}px Arial, sans-serif`
      const longestWord = nameParts.reduce((a, b) => a.length > b.length ? a : b, "")
      while (nameFontPx > 40 && ctx.measureText(longestWord).width > NAME_MAX_W) {
        nameFontPx -= 4
        ctx.font = `bold ${nameFontPx}px Arial, sans-serif`
      }

      // Check if full name fits on one line
      ctx.font = `bold ${nameFontPx}px Arial, sans-serif`
      ctx.fillStyle = "#FFFFFF"
      const nameLineH = Math.round(nameFontPx * 1.1)
      let nameY = 210

      if (ctx.measureText(nameUpper).width <= NAME_MAX_W) {
        // One line
        ctx.fillText(nameUpper, MARGIN, nameY)
      } else {
        // Two lines — split at the last space that fits on line 1
        let line1 = ""
        let line2 = nameUpper
        for (let i = nameParts.length - 1; i >= 1; i--) {
          const candidate = nameParts.slice(0, i).join(" ")
          if (ctx.measureText(candidate).width <= NAME_MAX_W) {
            line1 = candidate
            line2 = nameParts.slice(i).join(" ")
            break
          }
        }
        if (!line1) { line1 = nameParts[0]; line2 = nameParts.slice(1).join(" ") }
        ctx.fillText(line1, MARGIN, nameY)
        nameY += nameLineH
        ctx.fillText(line2, MARGIN, nameY)
      }

      // ── Position · School · Grade ──
      const subY    = nameY + 42
      const subParts = [position, school, grade ? `Grade ${grade}` : null].filter(Boolean) as string[]
      ctx.font      = "bold 26px Arial, sans-serif"
      let subX      = MARGIN
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

      // ── X (Twitter) handle ──
      let xHandleH = 0
      const xHandleY = subY + 18
      if (twitterHandle) {
        const handle     = "@" + twitterHandle.replace(/^@/, "")
        const xIcon      = "𝕏 "   // Unicode X logo approximation
        const xText      = xIcon + handle
        ctx.font         = "bold 24px Arial, sans-serif"
        const xTextW     = ctx.measureText(xText).width + 28
        xHandleH         = 44

        // Blue pill background
        ctx.fillStyle = "rgba(29,155,240,0.15)"
        roundRect(ctx, MARGIN, xHandleY, xTextW, xHandleH, 10)
        ctx.fill()
        ctx.strokeStyle = "rgba(29,155,240,0.35)"
        ctx.lineWidth   = 1
        roundRect(ctx, MARGIN, xHandleY, xTextW, xHandleH, 10)
        ctx.stroke()

        // Handle text
        ctx.fillStyle = "#38BDF8"
        ctx.fillText(xText, MARGIN + 14, xHandleY + 30)
      }

      // ── Divider ──
      const dividerY  = xHandleY + xHandleH + 20
      const divGrad   = ctx.createLinearGradient(MARGIN, 0, SIZE - MARGIN, 0)
      divGrad.addColorStop(0,   "#B40A0A")
      divGrad.addColorStop(0.5, "#DC2626")
      divGrad.addColorStop(1,   "rgba(180,10,10,0.08)")
      ctx.strokeStyle = divGrad
      ctx.lineWidth   = 2
      ctx.beginPath()
      ctx.moveTo(MARGIN, dividerY)
      ctx.lineTo(SIZE - MARGIN, dividerY)
      ctx.stroke()

      // ── Collect top metrics ──
      const baseline = sessions[0] ?? {}
      const current  = sessions[sessions.length - 1] ?? {}
      const metricsToShow: { label: string; value: string; tier: string | null }[] = []
      for (const m of METRICS) {
        const val = (current  as Record<string, number | undefined>)[m.key]
               ?? (baseline as Record<string, number | undefined>)[m.key]
        if (val == null) continue
        const tier = getAgeTier(m.key as MetricKey, val, age, gender)
        metricsToShow.push({ label: m.label, value: `${val}${m.unit}`, tier })
        if (metricsToShow.length >= 4) break
      }

      // ── Metrics Grid (2 × 2) ──
      const gridTop = dividerY + 24
      const cols    = 2
      const gutter  = 18
      const cellW   = (SIZE - MARGIN * 2 - gutter) / cols
      const cellH   = 158

      metricsToShow.slice(0, 4).forEach((m, i) => {
        const col   = i % cols
        const row   = Math.floor(i / cols)
        const cx    = MARGIN + col * (cellW + gutter)
        const cy    = gridTop + row * (cellH + gutter)
        const color = tierColor(m.tier)

        // Card bg
        ctx.fillStyle = "rgba(255,255,255,0.045)"
        roundRect(ctx, cx, cy, cellW, cellH, 16)
        ctx.fill()

        // Left accent strip
        const strip = ctx.createLinearGradient(cx, cy, cx, cy + cellH)
        strip.addColorStop(0, color)
        strip.addColorStop(1, color + "44")
        ctx.fillStyle = strip
        roundRect(ctx, cx, cy, 6, cellH, [8, 0, 0, 8])
        ctx.fill()

        // Label
        ctx.fillStyle = "#6B7280"
        ctx.font      = "bold 19px Arial, sans-serif"
        ctx.fillText(m.label, cx + 22, cy + 40)

        // Value
        ctx.fillStyle = "#FFFFFF"
        ctx.font      = "bold 50px Arial, sans-serif"
        ctx.fillText(m.value, cx + 22, cy + 102)

        // Tier badge
        if (m.tier) {
          const badgeLabel = tierShortLabel(m.tier)
          ctx.font         = "bold 16px Arial, sans-serif"
          const badgeW     = ctx.measureText(badgeLabel).width + 22
          ctx.fillStyle    = color + "28"
          roundRect(ctx, cx + 22, cy + 114, badgeW, 28, 6)
          ctx.fill()
          ctx.fillStyle = color
          ctx.fillText(badgeLabel, cx + 33, cy + 132)
        }
      })

      // ── Badge row: PR-VERIFIED + Hudl ──
      const gridBottom = gridTop + Math.ceil(Math.min(metricsToShow.length, 4) / 2) * (cellH + gutter)
      const badgeRowY  = gridBottom + 24
      let   badgeRowX  = MARGIN

      if (featured) {
        const prW = 230
        ctx.fillStyle   = "rgba(127,29,29,0.5)"
        roundRect(ctx, badgeRowX, badgeRowY, prW, 50, 12)
        ctx.fill()
        ctx.strokeStyle = "#B40A0A"
        ctx.lineWidth   = 1.5
        roundRect(ctx, badgeRowX, badgeRowY, prW, 50, 12)
        ctx.stroke()
        ctx.fillStyle = "#FCA5A5"
        ctx.font      = "bold 21px Arial, sans-serif"
        ctx.fillText("✓  PR-VERIFIED", badgeRowX + 18, badgeRowY + 33)
        badgeRowX += prW + 16
      }

      if (videoLink) {
        // Trim to a readable label
        const hudlLabel = "🎬  View Film on Hudl"
        ctx.font        = "bold 19px Arial, sans-serif"
        const hudlW     = ctx.measureText(hudlLabel).width + 28
        ctx.fillStyle   = "rgba(255,255,255,0.07)"
        roundRect(ctx, badgeRowX, badgeRowY, hudlW, 50, 12)
        ctx.fill()
        ctx.strokeStyle = "rgba(255,255,255,0.12)"
        ctx.lineWidth   = 1
        roundRect(ctx, badgeRowX, badgeRowY, hudlW, 50, 12)
        ctx.stroke()
        ctx.fillStyle = "#D1D5DB"
        ctx.fillText(hudlLabel, badgeRowX + 14, badgeRowY + 33)
      }

      // ── Accolades strip (top 2) ──
      const topAccolades = (accolades ?? []).slice(0, 2)
      if (topAccolades.length > 0) {
        const accY = SIZE - 220
        ctx.fillStyle = "rgba(234,179,8,0.12)"
        roundRect(ctx, MARGIN, accY - 36, SIZE - MARGIN * 2, topAccolades.length * 44 + 16, 10)
        ctx.fill()
        ctx.strokeStyle = "rgba(234,179,8,0.4)"
        ctx.lineWidth = 1
        ctx.stroke()
        topAccolades.forEach((a, i) => {
          const emoji = a.type === "mvp" ? "🏆" : a.type === "offensive" ? "🏈" : a.type === "defensive" ? "🛡️" : a.type === "academic" ? "📚" : a.type === "character" ? "🎖️" : "⭐"
          ctx.font      = "bold 22px Arial, sans-serif"
          ctx.fillStyle = "#FDE68A"
          ctx.textAlign = "left"
          ctx.fillText(`${emoji}  ${a.title}  ·  ${a.year}`, MARGIN + 14, accY - 6 + i * 44)
        })
      }

      // ── Footer ──
      const footerY = SIZE - 152

      ctx.fillStyle = "rgba(0,0,0,0.55)"
      ctx.fillRect(0, footerY, SIZE, 152)

      ctx.strokeStyle = "#B40A0A"
      ctx.lineWidth   = 1.5
      ctx.beginPath()
      ctx.moveTo(0, footerY)
      ctx.lineTo(SIZE, footerY)
      ctx.stroke()

      // Profile URL label
      ctx.fillStyle = "#6B7280"
      ctx.font      = "19px Arial, sans-serif"
      ctx.fillText("Full recruiting profile:", MARGIN, footerY + 36)

      // Profile URL value
      ctx.fillStyle = "#EF4444"
      ctx.font      = "bold 23px Arial, sans-serif"
      ctx.fillText(`polyrisefootball.com/athlete/${athleteId}`, MARGIN, footerY + 66)

      // Hudl URL in footer (if present)
      if (videoLink) {
        ctx.fillStyle = "#6B7280"
        ctx.font      = "19px Arial, sans-serif"
        ctx.fillText("Film:", MARGIN, footerY + 98)
        ctx.fillStyle = "#9CA3AF"
        ctx.font      = "18px Arial, sans-serif"
        const shortHudl = videoLink.replace(/^https?:\/\//, "").slice(0, 52)
        ctx.fillText(shortHudl + (videoLink.replace(/^https?:\/\//, "").length > 52 ? "…" : ""), MARGIN + 54, footerY + 98)
      }

      // Branding
      ctx.fillStyle = "#374151"
      ctx.font      = "18px Arial, sans-serif"
      ctx.fillText("PolyRISE Athletix  ·  Austin, Texas  ·  polyrisefootball.com", MARGIN, footerY + 124)

      // ── Bottom red bar ──
      ctx.fillStyle = topBar
      ctx.fillRect(0, SIZE - 10, SIZE, 10)

      // ── Trigger download ──
      const link    = document.createElement("a")
      link.download = `${name.replace(/\s+/g, "-").toLowerCase()}-polyrise-card.png`
      link.href     = canvas.toDataURL("image/png", 1.0)
      link.click()

    } catch (err) {
      console.error("Share card generation failed:", err)
    }
    setLoading(false)
  }

  if (compact) {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        title="Download Recruiting Card"
        className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-black px-3 py-2 rounded-xl text-xs transition-colors uppercase tracking-wide whitespace-nowrap"
      >
        {loading ? (
          <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        {loading ? "..." : "📲 Get Card"}
      </button>
    )
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:via-red-500 hover:to-red-600 active:from-red-800 active:to-red-800 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-black rounded-xl py-4 transition-all text-sm tracking-widest uppercase shadow-xl shadow-red-900/30 border border-red-500/20"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Building Card...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Save Card · Post to Instagram
        </>
      )}
    </button>
  )
}
