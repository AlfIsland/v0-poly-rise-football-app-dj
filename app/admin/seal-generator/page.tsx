"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import QRCode from "qrcode"
import { calculateRatings, type AthleteMetrics } from "@/lib/athlete-ratings"

function getInitials(name: string): string {
  return name.trim().split(/\s+/).map((n) => n[0]?.toUpperCase() || "").join("")
}

function formatCode(initials: string, num: string): string {
  const padded = String(parseInt(num) || 1).padStart(4, "0")
  return `PR-V${initials}-${padded}`
}

function Input({ label, required, value, onChange, placeholder, type = "text", step }: {
  label: string; required?: boolean; value: string
  onChange: (v: string) => void; placeholder: string; type?: string; step?: string
}) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type} step={step} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm"
      />
    </div>
  )
}

export default function SealGeneratorPage() {
  // ── Athlete info ──
  const [athleteName, setAthleteName] = useState("")
  const [sealNumber, setSealNumber] = useState("")
  const [position, setPosition] = useState("")
  const [school, setSchool] = useState("")
  const [gradYear, setGradYear] = useState("")
  const [heightFt, setHeightFt] = useState("")
  const [heightIn, setHeightIn] = useState("")
  const [weight, setWeight] = useState("")
  const [gpa, setGpa] = useState("")
  const [coachNotes, setCoachNotes] = useState("")

  // ── Combine metrics ──
  const [fortyYard, setFortyYard] = useState("")
  const [shuttle, setShuttle] = useState("")
  const [threeCone, setThreeCone] = useState("")
  const [verticalJump, setVerticalJump] = useState("")
  const [broadJump, setBroadJump] = useState("")
  const [benchPress, setBenchPress] = useState("")

  // ── Canvas ──
  const [imageLoaded, setImageLoaded] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const initials = getInitials(athleteName)
  const sealCode = athleteName && sealNumber ? formatCode(initials, sealNumber) : ""

  // Build metrics object
  const metrics: AthleteMetrics = {
    ...(fortyYard ? { fortyYard: parseFloat(fortyYard) } : {}),
    ...(shuttle ? { shuttle: parseFloat(shuttle) } : {}),
    ...(threeCone ? { threeCone: parseFloat(threeCone) } : {}),
    ...(verticalJump ? { verticalJump: parseFloat(verticalJump) } : {}),
    ...(broadJump ? { broadJump: parseFloat(broadJump) } : {}),
    ...(benchPress ? { benchPress: parseInt(benchPress) } : {}),
  }

  const hasMetrics = Object.keys(metrics).length > 0
  const ratings = hasMetrics ? calculateRatings(metrics, position, gradYear) : null

  // Load seal base image
  useEffect(() => {
    const img = new Image()
    img.src = "/pr-verified-seal.png"
    img.onload = () => { imgRef.current = img; setImageLoaded(true) }
  }, [])

  const drawSeal = useCallback(async () => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img || !sealCode) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const W = img.naturalWidth
    const H = img.naturalHeight
    canvas.width = W
    canvas.height = H

    ctx.drawImage(img, 0, 0)

    // Seal code centered
    const cx = W * 0.5
    const cy = H * 0.5
    const fontSize = H * 0.030
    ctx.font = `bold ${fontSize}px Arial, sans-serif`
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.shadowColor = "rgba(0,0,0,0.9)"
    ctx.shadowBlur = 10
    ctx.fillText(sealCode, cx, cy)
    ctx.shadowBlur = 0

    // Texas star rating only on seal
    if (ratings) {
      const starY = cy + fontSize * 1.6
      const starFontSize = fontSize * 0.7
      ctx.font = `${starFontSize}px Arial, sans-serif`
      ctx.fillStyle = "#FF8C00"
      ctx.shadowColor = "rgba(0,0,0,0.9)"
      ctx.shadowBlur = 6
      ctx.fillText("★".repeat(ratings.texasStars) + "☆".repeat(5 - ratings.texasStars), cx, starY)
      ctx.shadowBlur = 0

      const labelFontSize = fontSize * 0.45
      ctx.font = `bold ${labelFontSize}px Arial, sans-serif`
      ctx.fillStyle = "rgba(255,255,255,0.85)"
      ctx.fillText("POLYRISE FOOTBALL RATINGS · TEXAS", cx, starY + starFontSize)
    }

    // QR code bottom-right
    const verifyUrl = `https://polyrisefootball.com/verify/${sealCode}`
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 300, margin: 1,
      color: { dark: "#ffffff", light: "#00000000" },
    })

    const qrImg = new Image()
    qrImg.onload = async () => {
      const qrSize = W * 0.13
      const qrX = W * 0.84
      const qrY = H * 0.84
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

      const labelSize = H * 0.016
      ctx.font = `${labelSize}px Arial, sans-serif`
      ctx.fillStyle = "rgba(255,255,255,0.7)"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("SCAN TO VERIFY", qrX + qrSize / 2, qrY - labelSize)

      // ── Player name to the left of QR in script font ──
      if (athleteName) {
        try {
          const scriptFont = new FontFace(
            "Great Vibes",
            "url(https://fonts.gstatic.com/s/greatvibes/v19/RWmMoKWR9v4ksMfaWd_JN9XFiaQ.woff2)"
          )
          await scriptFont.load()
          document.fonts.add(scriptFont)
        } catch {
          // fallback to cursive if font fails to load
        }

        const nameFontSize = H * 0.073  // ~65pt scaled to image height
        ctx.font = `${nameFontSize}px "Great Vibes", cursive`
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.shadowColor = "rgba(0,0,0,0.85)"
        ctx.shadowBlur = 8

        // Closer to QR — 75% of the way from left edge to QR
        const nameX = qrX * 0.75
        const nameY = qrY + qrSize / 2

        ctx.fillText(athleteName, nameX, nameY)

        ctx.shadowBlur = 0
      }

      setRendered(true)
    }
    qrImg.src = qrDataUrl
  }, [sealCode, ratings, athleteName])

  useEffect(() => {
    if (imageLoaded && sealCode) { setRendered(false); drawSeal() }
    else setRendered(false)
  }, [imageLoaded, sealCode, drawSeal])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas || !sealCode) return
    const link = document.createElement("a")
    link.download = `${sealCode}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const handleSave = async () => {
    if (!sealCode) return
    setSaving(true)
    try {
      await fetch("/api/athletes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: sealCode,
          athleteName,
          initials,
          position,
          school,
          gradYear,
          height: heightFt && heightIn ? `${heightFt}'${heightIn}"` : "",
          weight,
          gpa,
          metrics,
          coachNotes,
          issuedAt: new Date().toISOString(),
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 border-b border-gray-800 pb-6 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/poly-rise-logo.png" alt="PolyRISE" className="h-10 w-auto" />
          <div>
            <h1 className="text-2xl font-bold text-white">PR-VERIFIED Seal Generator</h1>
            <p className="text-gray-400 text-sm">Admin · PolyRISE Football Ratings System</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* ── COL 1: Athlete Info ── */}
          <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Athlete Info</h2>

            <Input label="Full Name" required value={athleteName} onChange={setAthleteName} placeholder="Jordan Marcus Wells" />
            {athleteName && (
              <p className="text-xs text-gray-500 -mt-2">
                Initials: <span className="text-red-400 font-mono font-semibold">{initials}</span>
              </p>
            )}
            <Input label="Seal Number" required value={sealNumber} onChange={setSealNumber} placeholder="e.g. 27" type="number" />
            <Input label="Position" value={position} onChange={setPosition} placeholder="e.g. Wide Receiver" />
            <Input label="School" value={school} onChange={setSchool} placeholder="e.g. Austin High School" />
            <Input label="Class Year" value={gradYear} onChange={setGradYear} placeholder="e.g. 2026" />

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Height</label>
              <div className="flex gap-2">
                <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="ft" min="4" max="7"
                  className="w-1/2 bg-gray-800 text-white rounded-lg px-3 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
                <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="in" min="0" max="11"
                  className="w-1/2 bg-gray-800 text-white rounded-lg px-3 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none text-sm" />
              </div>
            </div>

            <Input label="Weight (lbs)" value={weight} onChange={setWeight} placeholder="e.g. 185" type="number" />
            <Input label="GPA" value={gpa} onChange={setGpa} placeholder="e.g. 3.8" type="number" step="0.1" />

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">PolyRISE Coach Notes</label>
              <textarea
                value={coachNotes}
                onChange={e => setCoachNotes(e.target.value)}
                placeholder="e.g. Strong route runner with elite body control. Needs to improve press coverage release. High football IQ, great teammate and coachable attitude..."
                rows={4}
                maxLength={1000}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm resize-none"
              />
              <p className="text-xs text-gray-600 mt-1">{coachNotes.length}/1000 characters</p>
            </div>
          </div>

          {/* ── COL 2: Combine Metrics ── */}
          <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">NFL Combine Metrics</h2>
            <p className="text-xs text-gray-500">Enter what&apos;s available — ratings auto-calculate from national HS data.</p>

            <Input label="40-Yard Dash (sec)" value={fortyYard} onChange={setFortyYard} placeholder="e.g. 4.52" type="number" step="0.01" />
            <Input label="20-Yard Shuttle (sec)" value={shuttle} onChange={setShuttle} placeholder="e.g. 4.21" type="number" step="0.01" />
            <Input label="3-Cone Drill (sec)" value={threeCone} onChange={setThreeCone} placeholder="e.g. 6.89" type="number" step="0.01" />
            <Input label="Vertical Jump (inches)" value={verticalJump} onChange={setVerticalJump} placeholder="e.g. 34" type="number" step="0.5" />
            <Input label="Broad Jump (inches)" value={broadJump} onChange={setBroadJump} placeholder="e.g. 108" type="number" step="0.5" />
            <Input label="Bench Press 225 (reps)" value={benchPress} onChange={setBenchPress} placeholder="e.g. 12" type="number" />

            {/* Live Ratings Preview */}
            {ratings && (
              <div className="bg-gray-800 rounded-xl p-4 mt-2 space-y-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Compared against: <span className="text-gray-300">{ratings.comparedAgainst}</span></p>

                {/* National Percentile — no stars */}
                <div>
                  <p className="text-xs text-gray-400">🇺🇸 National</p>
                  <p className="text-white font-bold text-sm">{ratings.overallPercentile}th percentile</p>
                  <p className="text-xs text-gray-500">vs {ratings.positionGroup}</p>
                </div>

                {/* Texas Rating */}
                <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                  <div>
                    <p className="text-xs text-orange-400">⭐ Texas</p>
                    <p className="text-white font-bold text-sm">{ratings.texasLabel}</p>
                    <p className="text-xs text-gray-500">{ratings.texasPercentile}th percentile in TX</p>
                  </div>
                  <span className="text-orange-400 text-xl">{"★".repeat(ratings.texasStars)}{"☆".repeat(5 - ratings.texasStars)}</span>
                </div>

                {/* Per-metric bars */}
                <div className="space-y-2 pt-1 border-t border-gray-700">
                  {ratings.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{m.label}</span>
                        <span className="text-gray-400">
                          <span className={m.nationalPercentile >= 90 ? "text-green-400" : m.nationalPercentile >= 75 ? "text-blue-400" : m.nationalPercentile >= 50 ? "text-yellow-400" : "text-red-400"}>
                            {m.nationalPercentile}%
                          </span>
                          <span className="text-gray-600"> / </span>
                          <span className="text-orange-400">{m.texasPercentile}% TX</span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            m.nationalPercentile >= 90 ? "bg-green-400" :
                            m.nationalPercentile >= 75 ? "bg-blue-400" :
                            m.nationalPercentile >= 50 ? "bg-yellow-400" : "bg-red-400"
                          }`}
                          style={{ width: `${m.nationalPercentile}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── COL 3: Preview + Actions ── */}
          <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Seal Preview</h2>

            {sealCode && (
              <div className="bg-gray-800 border border-red-900 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Seal Code</p>
                <p className="text-xl font-mono font-bold text-red-400 tracking-wider">{sealCode}</p>
              </div>
            )}

            {!imageLoaded ? (
              <div className="flex items-center justify-center h-48 text-gray-600 text-sm">Loading...</div>
            ) : !sealCode ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-600 gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/pr-verified-seal.png" alt="seal" className="w-40 opacity-20" />
                <p className="text-xs">Enter name + number to preview</p>
              </div>
            ) : (
              <canvas ref={canvasRef} className="w-full rounded-xl border border-gray-800" />
            )}

            {/* Save to Database */}
            <button
              onClick={handleSave}
              disabled={!sealCode || saving}
              className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-2.5 transition-colors text-sm"
            >
              {saving ? "Saving..." : saved ? "✓ Saved to Database" : "Save Athlete to Database"}
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              disabled={!rendered}
              className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm tracking-wide"
            >
              {rendered ? `Download ${sealCode}.png` : "Enter name & number to generate"}
            </button>

            <p className="text-xs text-gray-600 text-center">
              Save first, then download. Saving stores metrics so the QR verify page shows the full athlete profile.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
