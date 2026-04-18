"use client"

import { useState } from "react"

interface Session {
  date: string
  fortyYard?: number
  twentyYard?: number
  shuttle?: number
  shuttleLeft?: number
  shuttleRight?: number
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
  { key: "fortyYard",    label: "40-Yard Dash",  unit: "sec",  lower: true  },
  { key: "twentyYard",   label: "20-Yard Dash",  unit: "sec",  lower: true  },
  { key: "shuttle",      label: "5-10-5 Shuttle", unit: "sec",  lower: true  },
  { key: "threeCone",    label: "3-Cone Drill",   unit: "sec",  lower: true  },
  { key: "verticalJump", label: "Vertical Jump",  unit: "in",   lower: false },
  { key: "broadJump",    label: "Broad Jump",     unit: "in",   lower: false },
  { key: "benchPress",   label: "Bench Press",    unit: "reps", lower: false },
] as const

function improvement(baseline: number, current: number, lower: boolean): number {
  return lower ? baseline - current : current - baseline
}

function pctChange(baseline: number, current: number, lower: boolean): string {
  const imp = improvement(baseline, current, lower)
  const pct = (Math.abs(imp) / baseline) * 100
  return `${imp >= 0 ? "+" : "-"}${pct.toFixed(1)}%`
}

function fmtVal(val: number, unit: string): string {
  if (unit === "in")   return `${val}"`
  if (unit === "sec")  return `${val}s`
  return `${val}`
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

      const sessions = athlete.sessions
      const baseline = sessions[0]
      const current = sessions[sessions.length - 1]
      const sessionCount = sessions.length
      const isFirstSession = sessionCount === 1

      // ── Logo ──
      const logoBase64 = await new Promise<string | null>((resolve) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          const canvas = document.createElement("canvas")
          canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
          const ctx = canvas.getContext("2d")
          if (!ctx) { resolve(null); return }
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL("image/png"))
        }
        img.onerror = () => resolve(null)
        img.src = "/poly-rise-logo.png"
      })

      // helper: add new page with dark bg
      function newPage() {
        doc.addPage()
        doc.setFillColor(10, 10, 15)
        doc.rect(0, 0, W, pageH, "F")
        return 20
      }

      function checkPage(y: number, needed = 20): number {
        if (y + needed > pageH - 24) return newPage()
        return y
      }

      // ── Page 1 bg ──
      doc.setFillColor(10, 10, 15)
      doc.rect(0, 0, W, pageH, "F")

      // ── Header bar ──
      doc.setFillColor(180, 10, 10)
      doc.rect(0, 0, W, 28, "F")
      if (logoBase64) doc.addImage(logoBase64, "PNG", margin, 2, 24, 24)
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14); doc.setFont("helvetica", "bold")
      doc.text("PolyRISE Football", margin + 27, 13)
      doc.setFontSize(9); doc.setFont("helvetica", "normal")
      doc.setTextColor(255, 200, 200)
      doc.text("ATHLETE PROGRESS REPORT", W - margin, 11, { align: "right" })
      doc.setFontSize(8); doc.setTextColor(255, 220, 220)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, W - margin, 18, { align: "right" })

      // ── Athlete header ──
      let y = 42
      doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont("helvetica", "bold")
      doc.text(athlete.name.toUpperCase(), margin, y)
      y += 7
      doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(200, 200, 200)
      const info = [
        `Age ${athlete.age}`, athlete.grade, athlete.school, athlete.position
      ].filter(Boolean).join("  ·  ")
      doc.text(info, margin, y)
      y += 5
      doc.setFontSize(8); doc.setTextColor(140, 140, 140)
      const joined = new Date(athlete.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      doc.text(`Member since ${joined}  ·  ${sessionCount} test session${sessionCount !== 1 ? "s" : ""}  ·  Athlete ID: ${athlete.id}`, margin, y)

      // ── Red divider ──
      y += 5
      doc.setDrawColor(180, 10, 10); doc.setLineWidth(0.5)
      doc.line(margin, y, W - margin, y)

      // ─────────────────────────────────────────
      // SECTION 1: Progress Snapshot
      // ─────────────────────────────────────────
      y += 8
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(150, 150, 150)
      doc.text(isFirstSession ? "BASELINE MEASUREMENTS" : "PROGRESS SNAPSHOT — BASELINE vs. CURRENT", margin, y)

      y += 7
      const c1 = margin, c2 = margin + 52, c3 = margin + 85, c4 = margin + 118, c5 = margin + 155
      doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 100, 100)
      doc.text("METRIC", c1, y); doc.text("BASELINE", c2, y)
      if (!isFirstSession) {
        doc.text("CURRENT", c3, y); doc.text("CHANGE", c4, y); doc.text("% CHANGE", c5, y)
      }
      y += 2; doc.setDrawColor(40, 40, 50); doc.setLineWidth(0.3)
      doc.line(margin, y, W - margin, y)

      for (const m of METRICS) {
        const bVal = baseline[m.key as keyof Session] as number | undefined
        const cVal = current[m.key as keyof Session] as number | undefined
        if (bVal == null) continue
        y = checkPage(y, 8); y += 7
        doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(200, 200, 200)
        doc.text(m.label, c1, y)
        doc.setFont("helvetica", "bold"); doc.setTextColor(180, 180, 180)
        doc.text(fmtVal(bVal, m.unit), c2, y)
        if (!isFirstSession && cVal != null) {
          doc.setTextColor(255, 255, 255)
          doc.text(fmtVal(cVal, m.unit), c3, y)
          const imp = improvement(bVal, cVal, m.lower)
          const color: [number, number, number] = imp > 0 ? [52, 211, 153] : imp < 0 ? [248, 113, 113] : [150, 150, 150]
          doc.setTextColor(...color)
          const sign = imp > 0 ? "+" : ""
          const changeStr = m.unit === "in" ? `${sign}${imp.toFixed(1)}"` : m.unit === "sec" ? `${sign}${imp.toFixed(2)}s` : `${sign}${imp}`
          doc.text(changeStr, c4, y)
          doc.setFont("helvetica", "bold")
          doc.text(pctChange(bVal, cVal, m.lower), c5, y)
        }
      }

      // ─────────────────────────────────────────
      // SECTION 2: L/R Shuttle Analysis
      // ─────────────────────────────────────────
      const latestLR = [...sessions].reverse().find(s => s.shuttleLeft != null && s.shuttleRight != null)
      if (latestLR?.shuttleLeft != null && latestLR?.shuttleRight != null) {
        const L = latestLR.shuttleLeft
        const R = latestLR.shuttleRight
        const diff = Math.abs(L - R)
        const weaker = L > R ? "Left" : R > L ? "Right" : null
        const pct = ((diff / Math.min(L, R)) * 100).toFixed(1)

        y = checkPage(y, 38); y += 10
        doc.setDrawColor(40, 40, 50); doc.line(margin, y - 3, W - margin, y - 3)
        doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(150, 150, 150)
        doc.text("5-10-5 SHUTTLE — LEFT vs. RIGHT ANALYSIS", margin, y)
        y += 7

        // L box
        const boxW = (contentW - 8) / 2
        const lColor: [number, number, number] = L > R ? [50, 20, 20] : [20, 50, 35]
        const rColor: [number, number, number] = R > L ? [50, 20, 20] : [20, 50, 35]
        doc.setFillColor(...lColor); doc.roundedRect(margin, y, boxW, 22, 2, 2, "F")
        doc.setFillColor(...rColor); doc.roundedRect(margin + boxW + 8, y, boxW, 22, 2, 2, "F")

        doc.setFontSize(8); doc.setFont("helvetica", "bold")
        doc.setTextColor(L > R ? 248 : 52, L > R ? 113 : 211, L > R ? 113 : 153)
        doc.text("LEFT START", margin + 4, y + 7)
        doc.setFontSize(14); doc.setTextColor(255, 255, 255)
        doc.text(`${L}s`, margin + 4, y + 17)
        if (weaker === "Left") { doc.setFontSize(7); doc.setTextColor(248, 113, 113); doc.text("WEAKER SIDE", margin + 4 + 14, y + 17) }

        doc.setFontSize(8); doc.setFont("helvetica", "bold")
        doc.setTextColor(R > L ? 248 : 52, R > L ? 113 : 211, R > L ? 113 : 153)
        doc.text("RIGHT START", margin + boxW + 12, y + 7)
        doc.setFontSize(14); doc.setTextColor(255, 255, 255)
        doc.text(`${R}s`, margin + boxW + 12, y + 17)
        if (weaker === "Right") { doc.setFontSize(7); doc.setTextColor(248, 113, 113); doc.text("WEAKER SIDE", margin + boxW + 12 + 14, y + 17) }

        y += 26
        if (weaker) {
          doc.setFillColor(50, 35, 10)
          doc.roundedRect(margin, y, contentW, 14, 2, 2, "F")
          doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(251, 191, 36)
          doc.text(`${pct}% imbalance — ${diff.toFixed(2)}s difference. ${weaker}-side start is slower.`, margin + 4, y + 6)
          doc.setFont("helvetica", "normal"); doc.setTextColor(220, 190, 120)
          doc.text(`Training focus: ${weaker.toLowerCase()} lateral drive, first-step explosion, hip rotation.`, margin + 4, y + 11)
          y += 18
        } else {
          doc.setFillColor(20, 50, 35)
          doc.roundedRect(margin, y, contentW, 10, 2, 2, "F")
          doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(52, 211, 153)
          doc.text("Balanced — equal lateral quickness from both sides. Excellent symmetry.", margin + 4, y + 7)
          y += 14
        }
      }

      // ─────────────────────────────────────────
      // SECTION 3: Session History (full)
      // ─────────────────────────────────────────
      y = checkPage(y, 30); y += 8
      doc.setDrawColor(40, 40, 50); doc.line(margin, y - 3, W - margin, y - 3)
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(150, 150, 150)
      doc.text("SESSION HISTORY", margin, y)
      y += 6

      // Table header
      const tC = [margin, margin + 20, margin + 44, margin + 68, margin + 92, margin + 112, margin + 132, margin + 152, margin + 172]
      const tH  = ["DATE", "40-YD", "SHUTTLE", "L/R", "3-CONE", "VERT", "BROAD", "BENCH", "WT"]
      doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 100, 100)
      tH.forEach((h, i) => doc.text(h, tC[i], y))
      y += 2; doc.setDrawColor(40, 40, 50); doc.setLineWidth(0.2)
      doc.line(margin, y, W - margin, y)

      for (let si = 0; si < sessions.length; si++) {
        const s = sessions[si]
        y = checkPage(y, 12); y += 5
        doc.setFontSize(7); doc.setFont(si === sessions.length - 1 ? "helvetica" : "helvetica", si === sessions.length - 1 ? "bold" : "normal")
        doc.setTextColor(si === sessions.length - 1 ? 255 : 180, si === sessions.length - 1 ? 255 : 180, si === sessions.length - 1 ? 255 : 180)

        const lr = (s.shuttleLeft != null && s.shuttleRight != null)
          ? `${s.shuttleLeft}/${s.shuttleRight}`
          : (s.shuttleLeft != null ? `L:${s.shuttleLeft}` : s.shuttleRight != null ? `R:${s.shuttleRight}` : "—")

        const vals = [
          new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" }),
          s.fortyYard != null ? `${s.fortyYard}s` : "—",
          s.shuttle != null ? `${s.shuttle}s` : "—",
          lr,
          s.threeCone != null ? `${s.threeCone}s` : "—",
          s.verticalJump != null ? `${s.verticalJump}"` : "—",
          s.broadJump != null ? `${s.broadJump}"` : "—",
          s.benchPress != null ? `${s.benchPress}` : "—",
          s.weight != null ? `${s.weight}lbs` : "—",
        ]
        vals.forEach((v, i) => doc.text(v, tC[i], y))

        // Session notes inline
        if (s.notes) {
          y = checkPage(y, 8); y += 4
          doc.setFont("helvetica", "italic"); doc.setFontSize(7); doc.setTextColor(120, 120, 140)
          const noteLines = doc.splitTextToSize(`Note: ${s.notes}`, contentW - 10)
          doc.text(noteLines, margin + 4, y)
          y += (noteLines.length - 1) * 3.5
        }
      }

      // ─────────────────────────────────────────
      // SECTION 4: Strengths & Focus Areas
      // ─────────────────────────────────────────
      if (sessionCount > 1) {
        const improvements: { label: string; imp: number; pct: string }[] = []
        for (const m of METRICS) {
          const bVal = baseline[m.key as keyof Session] as number | undefined
          const cVal = current[m.key as keyof Session] as number | undefined
          if (bVal == null || cVal == null) continue
          improvements.push({ label: m.label, imp: improvement(bVal, cVal, m.lower), pct: pctChange(bVal, cVal, m.lower) })
        }

        if (improvements.length >= 2) {
          improvements.sort((a, b) => b.imp - a.imp)
          const strengths  = improvements.filter(i => i.imp > 0).slice(0, 3)
          const focusAreas = [...improvements].sort((a, b) => a.imp - b.imp).filter(i => i.imp <= 0).slice(0, 3)

          y = checkPage(y, 40); y += 10
          doc.setDrawColor(40, 40, 50); doc.line(margin, y - 3, W - margin, y - 3)

          const halfW = contentW / 2 - 4
          const boxH = Math.max(strengths.length, focusAreas.length) * 7 + 14

          if (strengths.length) {
            doc.setFillColor(20, 50, 35); doc.roundedRect(margin, y, halfW, boxH, 2, 2, "F")
            doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(52, 211, 153)
            doc.text("STRENGTHS", margin + 4, y + 7)
            doc.setFont("helvetica", "normal"); doc.setTextColor(200, 230, 215)
            strengths.forEach((s, i) => doc.text(`• ${s.label}: ${s.pct}`, margin + 4, y + 14 + i * 7))
          }

          const fx = margin + halfW + 8
          if (focusAreas.length) {
            doc.setFillColor(50, 25, 20); doc.roundedRect(fx, y, halfW, boxH, 2, 2, "F")
            doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(248, 113, 113)
            doc.text("FOCUS AREAS", fx + 4, y + 7)
            doc.setFont("helvetica", "normal"); doc.setTextColor(230, 200, 200)
            focusAreas.forEach((f, i) => doc.text(`• ${f.label}: Keep working!`, fx + 4, y + 14 + i * 7))
          } else {
            doc.setFillColor(20, 30, 50); doc.roundedRect(fx, y, halfW, boxH, 2, 2, "F")
            doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(96, 165, 250)
            doc.text("ALL METRICS IMPROVING!", fx + 4, y + 14)
            doc.setFont("helvetica", "normal"); doc.setTextColor(150, 180, 230)
            doc.text("Outstanding work!", fx + 4, y + 21)
          }
          y += boxH + 4
        }
      }

      // ─────────────────────────────────────────
      // SECTION 5: Coach Notes
      // ─────────────────────────────────────────
      if (athlete.coachNotes) {
        y = checkPage(y, 30); y += 8
        doc.setDrawColor(60, 60, 70); doc.line(margin, y - 2, W - margin, y - 2)
        doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(150, 150, 150)
        doc.text("COACH NOTES", margin, y + 4)
        doc.setFont("helvetica", "italic"); doc.setFontSize(9); doc.setTextColor(200, 200, 200)
        const noteLines = doc.splitTextToSize(`"${athlete.coachNotes}"`, contentW)
        doc.text(noteLines, margin, y + 11)
        y += 11 + noteLines.length * 5
      }

      // ─────────────────────────────────────────
      // FOOTER on every page
      // ─────────────────────────────────────────
      const totalPages = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages()
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p)
        const footerY = pageH - 20
        doc.setFillColor(20, 20, 25); doc.rect(0, footerY, W, 20, "F")
        doc.setDrawColor(180, 10, 10); doc.setLineWidth(0.4)
        doc.line(0, footerY, W, footerY)
        doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(140, 140, 140)
        doc.text("PolyRISE Football · Austin, Texas · polyrisefootball.com · (817) 658-3300", W / 2, footerY + 8, { align: "center" })
        doc.setTextColor(100, 100, 100)
        doc.text(`Athlete ID: ${athlete.id}`, margin, footerY + 14)
        doc.text(`Page ${p} of ${totalPages}`, W - margin, footerY + 14, { align: "right" })
      }

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
