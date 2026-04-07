"use client"

import { useState } from "react"

interface Metric {
  label: string
  value: number
  unit: string
  nationalPercentile: number
  texasPercentile: number
  rank: string
}

interface Athlete {
  athleteName: string
  position?: string
  school?: string
  gradYear?: string
  height?: string
  weight?: string
  gpa?: string
  code: string
  issuedAt?: string
  coachNotes?: string
}

interface Ratings {
  stars: number
  texasStars: number
  label: string
  texasLabel: string
  overallPercentile: number
  texasPercentile: number
  metrics: Metric[]
  description: string
  comparedAgainst: string
}

export default function RecruitingCardDownload({
  athlete,
  ratings,
}: {
  athlete: Athlete
  ratings: Ratings | null
}) {
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

      // ── Background ──
      doc.setFillColor(10, 10, 15)
      doc.rect(0, 0, W, pageH, "F")

      // ── Header bar ──
      doc.setFillColor(180, 10, 10)
      doc.rect(0, 0, W, 22, "F")

      // ── PolyRISE Football title ──
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(13)
      doc.setFont("helvetica", "bold")
      doc.text("PolyRISE Football", margin, 14)

      // ── PR-VERIFIED badge text ──
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(255, 220, 220)
      doc.text("PR-VERIFIED RECRUITING PROFILE", W - margin, 14, { align: "right" })

      // ── Athlete Name ──
      let y = 36
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(26)
      doc.setFont("helvetica", "bold")
      doc.text(athlete.athleteName.toUpperCase(), margin, y)

      // ── Position / School / Class ──
      y += 8
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(200, 200, 200)
      const subtitle = [athlete.position, athlete.school, athlete.gradYear ? `Class of ${athlete.gradYear}` : ""].filter(Boolean).join("  ·  ")
      doc.text(subtitle, margin, y)

      // ── Physical stats ──
      y += 6
      doc.setFontSize(10)
      doc.setTextColor(160, 160, 160)
      const physicals = [
        athlete.height ? `HT: ${athlete.height}` : "",
        athlete.weight ? `WT: ${athlete.weight} lbs` : "",
        athlete.gpa ? `GPA: ${athlete.gpa}` : "",
      ].filter(Boolean).join("    ")
      doc.text(physicals, margin, y)

      // ── Divider ──
      y += 5
      doc.setDrawColor(180, 10, 10)
      doc.setLineWidth(0.5)
      doc.line(margin, y, W - margin, y)

      // ── Ratings section ──
      if (ratings) {
        y += 8
        doc.setFontSize(9)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(150, 150, 150)
        doc.text("POLYRISE FOOTBALL RATINGS", margin, y)

        y += 6
        // National percentile
        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(255, 255, 255)
        doc.text(`NATIONAL: ${ratings.overallPercentile}th percentile`, margin, y)

        // Texas stars
        y += 6
        doc.setTextColor(255, 140, 0)
        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        const txStars = `TEXAS: ${ratings.texasStars} of 5 Stars  (${ratings.texasPercentile}th percentile)`
        doc.text(txStars, margin, y)
        doc.setFont("helvetica", "normal")

        y += 5
        doc.setFontSize(8)
        doc.setTextColor(120, 120, 120)
        doc.text(`Compared against: ${ratings.comparedAgainst}`, margin, y)

        // ── Metrics ──
        y += 8
        doc.setFontSize(9)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(150, 150, 150)
        doc.text("COMBINE METRICS", margin, y)
        y += 2

        for (const m of ratings.metrics) {
          y += 7
          const barWidth = contentW * 0.55
          const barH = 3.5
          const barX = margin + 52

          // Label + value
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(220, 220, 220)
          doc.text(m.label, margin, y)

          doc.setFont("helvetica", "bold")
          doc.setTextColor(255, 255, 255)
          const valStr = m.unit === "in" ? `${m.value}"` : `${m.value} ${m.unit}`
          doc.text(valStr, margin + 32, y)

          // Bar background
          doc.setFillColor(40, 40, 50)
          doc.roundedRect(barX, y - 3, barWidth, barH, 1, 1, "F")

          // Bar fill — color by percentile
          const pct = m.nationalPercentile
          if (pct >= 90) doc.setFillColor(52, 211, 153)       // green
          else if (pct >= 75) doc.setFillColor(96, 165, 250)   // blue
          else if (pct >= 50) doc.setFillColor(251, 191, 36)   // yellow
          else doc.setFillColor(248, 113, 113)                  // red

          const fillW = Math.max(2, barWidth * (pct / 100))
          doc.roundedRect(barX, y - 3, fillW, barH, 1, 1, "F")

          // Percentile label
          doc.setFontSize(8)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(180, 180, 180)
          doc.text(`${pct}th`, barX + barWidth + 2, y)
          doc.setTextColor(255, 140, 0)
          doc.text(`TX ${m.texasPercentile}th`, barX + barWidth + 10, y)
        }
      }

      // ── Coach Notes ──
      if (athlete.coachNotes) {
        y += 10
        doc.setDrawColor(60, 60, 70)
        doc.setLineWidth(0.3)
        doc.line(margin, y - 3, W - margin, y - 3)
        doc.setFontSize(9)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(150, 150, 150)
        doc.text("POLYRISE COACH NOTES", margin, y)
        y += 5
        doc.setFont("helvetica", "italic")
        doc.setFontSize(9)
        doc.setTextColor(200, 200, 200)
        const noteLines = doc.splitTextToSize(`"${athlete.coachNotes}"`, contentW)
        doc.text(noteLines, margin, y)
        y += noteLines.length * 5
      }

      // ── Footer ──
      const footerY = pageH - 28
      doc.setFillColor(20, 20, 25)
      doc.rect(0, footerY, W, 28, "F")
      doc.setDrawColor(180, 10, 10)
      doc.setLineWidth(0.5)
      doc.line(0, footerY, W, footerY)

      // QR placeholder text (can't embed image easily without canvas)
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(120, 120, 120)
      doc.text("Scan to verify:", margin, footerY + 8)
      doc.setTextColor(220, 80, 80)
      doc.setFontSize(9)
      doc.text(`polyrisefootball.com/verify/${athlete.code}`, margin, footerY + 14)

      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(`Seal Code: ${athlete.code}`, margin, footerY + 20)

      if (athlete.issuedAt) {
        doc.text(`Issued: ${new Date(athlete.issuedAt).toLocaleDateString()}`, W - margin, footerY + 20, { align: "right" })
      }

      doc.setTextColor(140, 140, 140)
      doc.setFontSize(8)
      doc.text("PolyRISE Football · Austin, Texas · polyrisefootball.com", W / 2, footerY + 14, { align: "center" })

      doc.save(`${athlete.code}-recruiting-card.pdf`)
    } catch (err) {
      console.error("PDF generation failed:", err)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm tracking-wide mt-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Generating PDF...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
          Download Recruiting Card (PDF)
        </>
      )}
    </button>
  )
}
