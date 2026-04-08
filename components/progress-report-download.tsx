"use client"

import { useState } from "react"

interface Session {
  date: string
  fortyYard?: number
  shuttle?: number
  threeCone?: number
  verticalJump?: number
  broadJump?: number
  benchPress?: number
  weight?: number
  notes?: string
}

interface Athlete {
  id: string
  name: string
  age: number
  grade: string
  school: string
  position?: string
  coachNotes?: string
  joinedAt: string
  sessions: Session[]
}

const METRICS = [
  { key: "fortyYard", label: "40-Yard Dash", unit: "sec", lower: true },
  { key: "shuttle", label: "20-Yd Shuttle", unit: "sec", lower: true },
  { key: "threeCone", label: "3-Cone Drill", unit: "sec", lower: true },
  { key: "verticalJump", label: "Vertical Jump", unit: "in", lower: false },
  { key: "broadJump", label: "Broad Jump", unit: "in", lower: false },
  { key: "benchPress", label: "Bench Press", unit: "reps", lower: false },
] as const

function improvement(baseline: number, current: number, lower: boolean): number {
  if (lower) return baseline - current   // lower is better (times)
  return current - baseline              // higher is better (jumps)
}

function pctChange(baseline: number, current: number, lower: boolean): string {
  const imp = improvement(baseline, current, lower)
  const pct = (Math.abs(imp) / baseline) * 100
  const sign = imp > 0 ? "+" : imp < 0 ? "-" : ""
  return `${sign}${pct.toFixed(1)}%`
}

export default function ProgressReportDownload({ athlete }: { athlete: Athlete }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" })

      const W = 215.9
      const pageH = 279.4
      const margin = 14
      const contentW = W - margin * 2

      const baseline = athlete.sessions[0]
      const current = athlete.sessions[athlete.sessions.length - 1]
      const sessionCount = athlete.sessions.length
      const isFirstSession = sessionCount === 1

      // ── Load logo as base64 ──
      const logoBase64 = await new Promise<string | null>((resolve) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          const canvas = document.createElement("canvas")
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext("2d")
          if (!ctx) { resolve(null); return }
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL("image/png"))
        }
        img.onerror = () => resolve(null)
        img.src = "/poly-rise-logo.png"
      })

      // ── Background ──
      doc.setFillColor(10, 10, 15)
      doc.rect(0, 0, W, pageH, "F")

      // ── Header bar ──
      doc.setFillColor(180, 10, 10)
      doc.rect(0, 0, W, 28, "F")

      // ── Logo in header ──
      if (logoBase64) {
        doc.addImage(logoBase64, "PNG", margin, 2, 24, 24)
      }

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("PolyRISE Football", margin + 27, 13)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(255, 200, 200)
      doc.text("ATHLETE PROGRESS REPORT", W - margin, 11, { align: "right" })
      doc.setFontSize(8)
      doc.setTextColor(255, 220, 220)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, W - margin, 18, { align: "right" })

      // ── Athlete name ──
      let y = 42
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text(athlete.name.toUpperCase(), margin, y)

      y += 7
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(200, 200, 200)
      const info = [
        `Age ${athlete.age}`,
        athlete.grade,
        athlete.school,
        athlete.position,
      ].filter(Boolean).join("  ·  ")
      doc.text(info, margin, y)

      y += 5
      doc.setFontSize(9)
      doc.setTextColor(140, 140, 140)
      const joined = new Date(athlete.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      doc.text(`PolyRISE Member since ${joined}  ·  ${sessionCount} test session${sessionCount !== 1 ? "s" : ""}`, margin, y)

      // ── Divider ──
      y += 5
      doc.setDrawColor(180, 10, 10)
      doc.setLineWidth(0.5)
      doc.line(margin, y, W - margin, y)

      // ── Progress Snapshot ──
      y += 8
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(150, 150, 150)
      doc.text(isFirstSession ? "BASELINE MEASUREMENTS" : "PROGRESS SNAPSHOT  —  BASELINE vs. CURRENT", margin, y)

      y += 7

      // Column headers
      const col1 = margin
      const col2 = margin + 52
      const col3 = margin + 85
      const col4 = margin + 118
      const col5 = margin + 155

      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(100, 100, 100)
      doc.text("METRIC", col1, y)
      doc.text("BASELINE", col2, y)
      if (!isFirstSession) {
        doc.text("CURRENT", col3, y)
        doc.text("CHANGE", col4, y)
        doc.text("IMPROVEMENT", col5, y)
      }

      y += 2
      doc.setDrawColor(40, 40, 50)
      doc.setLineWidth(0.3)
      doc.line(margin, y, W - margin, y)

      for (const m of METRICS) {
        const bVal = baseline[m.key as keyof Session] as number | undefined
        const cVal = current[m.key as keyof Session] as number | undefined
        if (bVal == null) continue

        y += 7
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(200, 200, 200)
        doc.text(m.label, col1, y)

        // Baseline value
        doc.setFont("helvetica", "bold")
        doc.setTextColor(180, 180, 180)
        const bStr = m.unit === "in" ? `${bVal}"` : m.unit === "sec" ? `${bVal}s` : `${bVal}`
        doc.text(bStr, col2, y)

        if (!isFirstSession && cVal != null) {
          // Current value
          doc.setTextColor(255, 255, 255)
          const cStr = m.unit === "in" ? `${cVal}"` : m.unit === "sec" ? `${cVal}s` : `${cVal}`
          doc.text(cStr, col3, y)

          // Raw change
          const imp = improvement(bVal, cVal, m.lower)
          const impColor: [number, number, number] = imp > 0 ? [52, 211, 153] : imp < 0 ? [248, 113, 113] : [150, 150, 150]
          doc.setTextColor(...impColor)
          const changeSign = imp > 0 ? "+" : ""
          const changeStr = m.unit === "in" ? `${changeSign}${imp.toFixed(1)}"` : m.unit === "sec" ? `${changeSign}${imp.toFixed(2)}s` : `${changeSign}${imp}`
          doc.text(changeStr, col4, y)

          // Pct improvement
          doc.setFont("helvetica", "bold")
          doc.setFontSize(9)
          doc.text(pctChange(bVal, cVal, m.lower), col5, y)
          doc.setFont("helvetica", "normal")
        }
      }

      // ── Month-by-month table ──
      if (sessionCount > 1) {
        y += 10
        doc.setDrawColor(40, 40, 50)
        doc.line(margin, y - 3, W - margin, y - 3)
        doc.setFontSize(9)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(150, 150, 150)
        doc.text("SESSION HISTORY", margin, y)
        y += 5

        // Table header
        const tCols = [margin, margin + 22, margin + 48, margin + 74, margin + 100, margin + 126, margin + 152, margin + 178]
        const tHeaders = ["DATE", "40-YD", "SHUTTLE", "3-CONE", "VERT", "BROAD", "BENCH", "WT"]
        doc.setFontSize(7)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(100, 100, 100)
        tHeaders.forEach((h, i) => doc.text(h, tCols[i], y))
        y += 2
        doc.line(margin, y, W - margin, y)

        for (const s of athlete.sessions) {
          y += 5
          if (y > pageH - 40) {
            doc.addPage()
            doc.setFillColor(10, 10, 15)
            doc.rect(0, 0, W, pageH, "F")
            y = 20
          }
          doc.setFontSize(7)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(180, 180, 180)
          const vals = [
            new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            s.fortyYard != null ? `${s.fortyYard}s` : "—",
            s.shuttle != null ? `${s.shuttle}s` : "—",
            s.threeCone != null ? `${s.threeCone}s` : "—",
            s.verticalJump != null ? `${s.verticalJump}"` : "—",
            s.broadJump != null ? `${s.broadJump}"` : "—",
            s.benchPress != null ? `${s.benchPress}` : "—",
            s.weight != null ? `${s.weight}` : "—",
          ]
          vals.forEach((v, i) => doc.text(v, tCols[i], y))
        }
      }

      // ── Strengths & Focus Areas ──
      if (sessionCount > 1) {
        const improvements: { label: string; imp: number; pct: string }[] = []
        for (const m of METRICS) {
          const bVal = baseline[m.key as keyof Session] as number | undefined
          const cVal = current[m.key as keyof Session] as number | undefined
          if (bVal == null || cVal == null) continue
          const imp = improvement(bVal, cVal, m.lower)
          improvements.push({ label: m.label, imp, pct: pctChange(bVal, cVal, m.lower) })
        }

        if (improvements.length >= 2) {
          improvements.sort((a, b) => b.imp - a.imp)
          const strengths = improvements.filter(i => i.imp > 0).slice(0, 2)
          const focusAreas = [...improvements].sort((a, b) => a.imp - b.imp).filter(i => i.imp <= 0).slice(0, 2)

          y += 10
          if (y > pageH - 50) {
            doc.addPage()
            doc.setFillColor(10, 10, 15)
            doc.rect(0, 0, W, pageH, "F")
            y = 20
          }

          doc.setDrawColor(40, 40, 50)
          doc.line(margin, y - 3, W - margin, y - 3)

          const halfW = contentW / 2 - 4

          if (strengths.length) {
            doc.setFillColor(20, 50, 35)
            doc.roundedRect(margin, y, halfW, 28, 2, 2, "F")
            doc.setFontSize(8)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(52, 211, 153)
            doc.text("STRENGTHS", margin + 4, y + 7)
            doc.setFontSize(8)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(200, 230, 215)
            strengths.forEach((s, i) => {
              doc.text(`${s.label}: ${s.pct} improvement`, margin + 4, y + 14 + i * 6)
            })
          }

          if (focusAreas.length) {
            const fx = margin + halfW + 8
            doc.setFillColor(50, 25, 20)
            doc.roundedRect(fx, y, halfW, 28, 2, 2, "F")
            doc.setFontSize(8)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(248, 113, 113)
            doc.text("FOCUS AREAS", fx + 4, y + 7)
            doc.setFontSize(8)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(230, 200, 200)
            focusAreas.forEach((f, i) => {
              doc.text(`${f.label}: Keep working!`, fx + 4, y + 14 + i * 6)
            })
          } else if (strengths.length) {
            const fx = margin + halfW + 8
            doc.setFillColor(20, 30, 50)
            doc.roundedRect(fx, y, halfW, 28, 2, 2, "F")
            doc.setFontSize(8)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(96, 165, 250)
            doc.text("ALL METRICS IMPROVING!", fx + 4, y + 14)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(150, 180, 230)
            doc.text("Outstanding work!", fx + 4, y + 20)
          }

          y += 32
        }
      }

      // ── Coach Notes ──
      if (athlete.coachNotes) {
        y += 5
        if (y > pageH - 40) {
          doc.addPage()
          doc.setFillColor(10, 10, 15)
          doc.rect(0, 0, W, pageH, "F")
          y = 20
        }
        doc.setDrawColor(60, 60, 70)
        doc.line(margin, y - 2, W - margin, y - 2)
        doc.setFontSize(9)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(150, 150, 150)
        doc.text("COACH NOTES", margin, y + 4)
        doc.setFont("helvetica", "italic")
        doc.setFontSize(9)
        doc.setTextColor(200, 200, 200)
        const noteLines = doc.splitTextToSize(`"${athlete.coachNotes}"`, contentW)
        doc.text(noteLines, margin, y + 11)
        y += 11 + noteLines.length * 5
      }

      // ── Footer ──
      const footerY = pageH - 20
      doc.setFillColor(20, 20, 25)
      doc.rect(0, footerY, W, 20, "F")
      doc.setDrawColor(180, 10, 10)
      doc.setLineWidth(0.4)
      doc.line(0, footerY, W, footerY)
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(140, 140, 140)
      doc.text("PolyRISE Football · Austin, Texas · polyrisefootball.com · (817) 658-3300", W / 2, footerY + 8, { align: "center" })
      doc.setTextColor(100, 100, 100)
      doc.text(`Athlete ID: ${athlete.id}`, margin, footerY + 14)
      doc.text(`polyrise@polyrisefootball.com`, W - margin, footerY + 14, { align: "right" })

      const safeName = athlete.name.replace(/\s+/g, "-")
      doc.save(`${safeName}-progress-report.pdf`)
    } catch (err) {
      console.error("PDF generation failed:", err)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading || !athlete.sessions.length}
      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm tracking-wide"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Generating Report...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
          Download Progress Report (PDF)
        </>
      )}
    </button>
  )
}
