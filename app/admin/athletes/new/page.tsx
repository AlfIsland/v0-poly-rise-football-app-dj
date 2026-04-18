"use client"

import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import QRCode from "qrcode"
import Link from "next/link"
import LogoutButton from "@/components/logout-button"
import { calculateRatings, type AthleteMetrics } from "@/lib/athlete-ratings"

type Mode = "prv" | "atp" | "both"

function getInitials(name: string): string {
  return name.trim().replace(/\./g, "").split(/\s+/)
    .map(n => n[0]?.toUpperCase() || "").join("").replace(/[^A-Z]/g, "")
}
function formatCode(initials: string, num: string): string {
  return `PR-V${initials}-${String(parseInt(num) || 1).padStart(4, "0")}`
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full bg-gray-800 text-white rounded-lg px-3 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm"

function NewAthleteForm() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<Mode>((searchParams.get("mode") as Mode) || "both")

  // ── Shared fields ──
  const [name, setName] = useState(searchParams.get("name") || "")
  const [position, setPosition] = useState(searchParams.get("position") || "")
  const [school, setSchool] = useState(searchParams.get("school") || "")
  const [gradYear, setGradYear] = useState(searchParams.get("gradYear") || "")
  const [heightFt, setHeightFt] = useState("")
  const [heightIn, setHeightIn] = useState("")
  const [weight, setWeight] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [parentName, setParentName] = useState("")
  const [parentPhone, setParentPhone] = useState("")
  const [parentEmail, setParentEmail] = useState("")
  const [coachNotes, setCoachNotes] = useState("")

  // ── Shared metrics ──
  const [fortyYard, setFortyYard] = useState("")
  const [twentyYard, setTwentyYard] = useState("")
  const [shuttle, setShuttle] = useState("")
  const [threeCone, setThreeCone] = useState("")
  const [verticalJump, setVerticalJump] = useState("")
  const [broadJump, setBroadJump] = useState("")
  const [benchPress, setBenchPress] = useState("")

  // ── PR-V only ──
  const [gpa, setGpa] = useState("")
  const [videoLink, setVideoLink] = useState("")
  const [sealNumber, setSealNumber] = useState("")

  // ── ATP only ──
  const [age, setAge] = useState("")
  const [sport, setSport] = useState<"football" | "soccer">("football")

  // ── Save results ──
  const [saving, setSaving] = useState(false)
  const [savedPRV, setSavedPRV] = useState(false)
  const [savedATP, setSavedATP] = useState(false)
  const [atpId, setAtpId] = useState("")
  const [error, setError] = useState("")

  // ── PR-V Canvas ──
  const [imageLoaded, setImageLoaded] = useState(false)
  const [rendered, setRendered] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const initials = getInitials(name)
  const sealCode = name && sealNumber ? formatCode(initials, sealNumber) : ""

  const metrics: AthleteMetrics = {
    ...(fortyYard ? { fortyYard: parseFloat(fortyYard) } : {}),
    ...(twentyYard ? { twentyYard: parseFloat(twentyYard) } : {}),
    ...(shuttle ? { shuttle: parseFloat(shuttle) } : {}),
    ...(threeCone ? { threeCone: parseFloat(threeCone) } : {}),
    ...(verticalJump ? { verticalJump: parseFloat(verticalJump) } : {}),
    ...(broadJump ? { broadJump: parseFloat(broadJump) } : {}),
    ...(benchPress ? { benchPress: parseInt(benchPress) } : {}),
  }
  const hasMetrics = Object.keys(metrics).length > 0
  const ratings = hasMetrics && (mode === "prv" || mode === "both") ? calculateRatings(metrics, position, gradYear) : null

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
    const W = img.naturalWidth, H = img.naturalHeight
    canvas.width = W; canvas.height = H
    ctx.drawImage(img, 0, 0)

    const cx = W * 0.5, cy = H * 0.5
    ctx.font = `bold ${H * 0.030}px Arial, sans-serif`
    ctx.fillStyle = "#ffffff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"
    ctx.shadowColor = "rgba(0,0,0,0.9)"; ctx.shadowBlur = 10
    ctx.fillText(sealCode, cx, cy); ctx.shadowBlur = 0

    const verifyUrl = `https://polyrisefootball.com/verify/${sealCode}`
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 300, margin: 1, color: { dark: "#ffffff", light: "#00000000" } })
    const qrImg = new Image()
    qrImg.onload = async () => {
      const qrSize = W * 0.13, qrX = W * 0.84, qrY = H * 0.84
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
      ctx.font = `${H * 0.016}px Arial, sans-serif`
      ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.textAlign = "center"
      ctx.fillText("SCAN TO VERIFY", qrX + qrSize / 2, qrY - H * 0.016)
      if (name) {
        try {
          const f = new FontFace("Great Vibes", "url(https://fonts.gstatic.com/s/greatvibes/v19/RWmMoKWR9v4ksMfaWd_JN9XFiaQ.woff2)")
          await f.load(); document.fonts.add(f)
        } catch { /* fallback */ }
        ctx.font = `${H * 0.073}px "Great Vibes", cursive`
        ctx.fillStyle = "#ffffff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"
        ctx.shadowColor = "rgba(0,0,0,0.85)"; ctx.shadowBlur = 8
        ctx.fillText(name, qrX * 0.55, qrY + qrSize / 2, qrX * 0.85)
        ctx.shadowBlur = 0
      }
      setRendered(true)
    }
    qrImg.src = qrDataUrl
  }, [sealCode, name])

  useEffect(() => {
    if (imageLoaded && sealCode && (mode === "prv" || mode === "both")) { setRendered(false); drawSeal() }
    else setRendered(false)
  }, [imageLoaded, sealCode, mode, drawSeal])

  const handleSave = async () => {
    if (!name) return
    setSaving(true); setError("")

    try {
      // ── Save PR-V ──
      if (mode === "prv" || mode === "both") {
        const res = await fetch("/api/athletes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            athleteName: name, initials,
            position, school, gradYear,
            height: heightFt && heightIn ? `${heightFt}'${heightIn}"` : "",
            weight, gpa, metrics, coachNotes, videoLink,
            phone, email, parentName, parentPhone, parentEmail,
            issuedAt: new Date().toISOString(),
          }),
        }).then(r => r.json())
        if (res.success) { setSealNumber(String(res.sealNumber)); setSavedPRV(true) }
        else setError(res.error || "Failed to save PR-V record")
      }

      // ── Save ATP ──
      if (mode === "atp" || mode === "both") {
        const res = await fetch("/api/training", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name, age: age || "0", grade: gradYear,
            school, position, coachNotes,
            phone, email, sport,
          }),
        }).then(r => r.json())
        if (res.success) { setAtpId(res.id); setSavedATP(true) }
        else setError(prev => prev ? prev + " | " + (res.error || "Failed to save ATP record") : res.error || "Failed to save ATP record")
      }
    } catch {
      setError("Something went wrong.")
    }
    setSaving(false)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas || !sealCode) return
    const link = document.createElement("a")
    link.download = `${sealCode}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const handleReset = () => {
    setName(""); setPosition(""); setSchool(""); setGradYear("")
    setHeightFt(""); setHeightIn(""); setWeight(""); setPhone(""); setEmail("")
    setParentName(""); setParentPhone(""); setParentEmail(""); setCoachNotes("")
    setFortyYard(""); setShuttle(""); setThreeCone(""); setVerticalJump("")
    setBroadJump(""); setBenchPress(""); setGpa(""); setVideoLink(""); setAge("")
    setSport("football"); setSealNumber(""); setAtpId("")
    setSavedPRV(false); setSavedATP(false); setError("")
  }

  const showPRV = mode === "prv" || mode === "both"
  const showATP = mode === "atp" || mode === "both"
  const isSaved = (showPRV && savedPRV) || (showATP && savedATP)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 border-b border-gray-800 pb-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/poly-rise-logo.png" alt="PolyRISE" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-white">Add New Athlete</h1>
              <Link href="/admin/athletes" className="text-xs text-gray-500 hover:text-gray-300">← Back to Roster</Link>
            </div>
          </div>
          <LogoutButton />
        </div>

        {/* ── Mode Toggle ── */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-bold">Select Type</p>
          <div className="flex gap-2 flex-wrap">
            {([
              { key: "prv", label: "🔴 PR-VERIFIED", desc: "Recruiting seal + ratings" },
              { key: "atp", label: "🔵 ATP — Training Passport", desc: "Session tracking + parent portal" },
              { key: "both", label: "⚡ Both", desc: "Creates records in both systems" },
            ] as { key: Mode; label: string; desc: string }[]).map(m => (
              <button key={m.key} onClick={() => setMode(m.key)}
                className={`px-5 py-3 rounded-xl border-2 text-left transition-all ${
                  mode === m.key
                    ? m.key === "prv" ? "border-red-500 bg-red-950/30 text-white"
                      : m.key === "atp" ? "border-blue-500 bg-blue-950/30 text-white"
                      : "border-yellow-500 bg-yellow-950/20 text-white"
                    : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500"
                }`}>
                <p className="font-bold text-sm">{m.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Saved Result Banner ── */}
        {isSaved && (
          <div className="mb-6 bg-green-950/40 border border-green-700/50 rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-green-400 font-bold">✓ Athlete Saved</p>
              <div className="flex gap-4 mt-1 flex-wrap">
                {savedPRV && sealCode && <p className="text-xs text-gray-300">PR-V Seal: <span className="font-mono text-red-400 font-bold">{sealCode}</span></p>}
                {savedATP && atpId && <p className="text-xs text-gray-300">ATP ID: <span className="font-mono text-blue-400 font-bold">{atpId}</span></p>}
              </div>
            </div>
            <div className="flex gap-2">
              {savedPRV && rendered && (
                <button onClick={handleDownload} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg">
                  Download Seal
                </button>
              )}
              {savedATP && atpId && (
                <Link href={`/training/${atpId}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg">
                  View ATP Profile →
                </Link>
              )}
              <button onClick={handleReset} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-lg">
                + Add Another
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-950/40 border border-red-700/50 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── COL 1: Athlete Info ── */}
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl p-5 space-y-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Athlete Info</h2>

              <Field label="Full Name" required>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Jordan Marcus Wells" className={inputCls} />
                {name && <p className="text-xs text-gray-600 mt-1">Initials: <span className="text-red-400 font-mono font-semibold">{initials}</span></p>}
              </Field>

              <Field label="Position">
                <input value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g. Wide Receiver" className={inputCls} />
              </Field>

              <Field label="School">
                <input value={school} onChange={e => setSchool(e.target.value)} placeholder="e.g. Austin High School" className={inputCls} />
              </Field>

              <Field label="Class Year">
                <input value={gradYear} onChange={e => setGradYear(e.target.value)} placeholder="e.g. 2026" className={inputCls} />
              </Field>

              <Field label="Height">
                <div className="flex gap-2">
                  <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="ft" min="4" max="7" className={inputCls} />
                  <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="in" min="0" max="11" className={inputCls} />
                </div>
              </Field>

              <Field label="Weight (lbs)">
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 185" className={inputCls} />
              </Field>

              {/* ATP-specific */}
              {showATP && (
                <Field label="Age" required={mode === "atp"}>
                  <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 16" className={inputCls} />
                </Field>
              )}

              {/* PR-V only */}
              {showPRV && (
                <Field label="GPA">
                  <input type="number" value={gpa} onChange={e => setGpa(e.target.value)} placeholder="e.g. 3.8" step="0.1" className={inputCls} />
                </Field>
              )}

              {showPRV && (
                <Field label="Hudl / Film Link">
                  <input value={videoLink} onChange={e => setVideoLink(e.target.value)} placeholder="https://hudl.com/v/..." className={inputCls} />
                </Field>
              )}

              {/* ATP sport toggle */}
              {showATP && (
                <Field label="Sport">
                  <div className="flex gap-2">
                    {(["football", "soccer"] as const).map(s => (
                      <button key={s} onClick={() => setSport(s)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors border ${
                          sport === s
                            ? s === "football" ? "bg-red-700 border-red-600 text-white" : "bg-green-700 border-green-600 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-400"
                        }`}>
                        {s === "football" ? "🏈 Football" : "⚽ Soccer"}
                      </button>
                    ))}
                  </div>
                </Field>
              )}
            </div>

            {/* Contact */}
            <div className="bg-gray-900 rounded-2xl p-5 space-y-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact</h2>
              <Field label="Athlete Phone">
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(817) 555-1234" className={inputCls} />
              </Field>
              <Field label="Athlete Email">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="athlete@email.com" className={inputCls} />
              </Field>
              <div className="border-t border-gray-800 pt-4 space-y-3">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Parent / Guardian</p>
                <Field label="Parent Name">
                  <input value={parentName} onChange={e => setParentName(e.target.value)} placeholder="Maria Johnson" className={inputCls} />
                </Field>
                <Field label="Parent Phone">
                  <input type="tel" value={parentPhone} onChange={e => setParentPhone(e.target.value)} placeholder="(817) 555-5678" className={inputCls} />
                </Field>
                <Field label="Parent Email">
                  <input type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} placeholder="parent@email.com" className={inputCls} />
                </Field>
              </div>
            </div>

            {/* Coach Notes */}
            <div className="bg-gray-900 rounded-2xl p-5 space-y-3">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Coach Notes</h2>
              <textarea value={coachNotes} onChange={e => setCoachNotes(e.target.value)}
                placeholder="Route runner with elite body control. Needs to improve press coverage release..."
                rows={4} maxLength={1000}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2.5 border border-gray-700 focus:border-red-500 focus:outline-none placeholder-gray-600 text-sm resize-none" />
              <p className="text-xs text-gray-600">{coachNotes.length}/1000</p>
            </div>
          </div>

          {/* ── COL 2: Metrics ── */}
          <div className="bg-gray-900 rounded-2xl p-5 space-y-4 h-fit">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Combine Metrics</h2>
            <p className="text-xs text-gray-500">Enter what&apos;s available — ratings auto-calculate from national HS data.</p>

            {[
              { label: "40-Yard Dash (sec)", val: fortyYard, set: setFortyYard, ph: "e.g. 4.52" },
              { label: "20-Yard Dash (sec)", val: twentyYard, set: setTwentyYard, ph: "e.g. 2.75" },
              { label: "5-10-5 Shuttle (sec)", val: shuttle, set: setShuttle, ph: "e.g. 4.21" },
              { label: "3-Cone Drill (sec)", val: threeCone, set: setThreeCone, ph: "e.g. 6.89" },
              { label: "Vertical Jump (in)", val: verticalJump, set: setVerticalJump, ph: "e.g. 34" },
              { label: "Broad Jump (in)", val: broadJump, set: setBroadJump, ph: "e.g. 108" },
              { label: "Max Bench — 135 Bar (lbs)", val: benchPress, set: setBenchPress, ph: "e.g. 185" },
            ].map(m => (
              <Field key={m.label} label={m.label}>
                <input type="number" step="0.01" value={m.val} onChange={e => m.set(e.target.value)} placeholder={m.ph} className={inputCls} />
              </Field>
            ))}

            {/* Ratings preview — PR-V only */}
            {ratings && (
              <div className="bg-gray-800 rounded-xl p-4 space-y-3 mt-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider">vs. <span className="text-gray-300">{ratings.comparedAgainst}</span></p>
                <div>
                  <p className="text-xs text-gray-400">🇺🇸 National</p>
                  <p className="text-white font-bold text-sm">{ratings.overallPercentile}th percentile</p>
                  <p className="text-xs text-gray-500">{ratings.positionGroup}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                  <div>
                    <p className="text-xs text-orange-400">⭐ Texas</p>
                    <p className="text-white font-bold text-sm">{ratings.texasLabel}</p>
                    <p className="text-xs text-gray-500">{ratings.texasPercentile}th percentile in TX</p>
                  </div>
                  <span className="text-orange-400 text-xl">{"★".repeat(ratings.texasStars)}{"☆".repeat(5 - ratings.texasStars)}</span>
                </div>
                <div className="space-y-2 pt-1 border-t border-gray-700">
                  {ratings.metrics.map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{m.label}</span>
                        <span>
                          <span className={m.nationalPercentile >= 90 ? "text-green-400" : m.nationalPercentile >= 75 ? "text-blue-400" : m.nationalPercentile >= 50 ? "text-yellow-400" : "text-red-400"}>{m.nationalPercentile}%</span>
                          <span className="text-gray-600"> / </span>
                          <span className="text-orange-400">{m.texasPercentile}% TX</span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${m.nationalPercentile >= 90 ? "bg-green-400" : m.nationalPercentile >= 75 ? "bg-blue-400" : m.nationalPercentile >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                          style={{ width: `${m.nationalPercentile}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── COL 3: Preview + Save ── */}
          <div className="space-y-4">

            {/* PR-V Seal Preview */}
            {showPRV && (
              <div className="bg-gray-900 rounded-2xl p-5 space-y-3">
                <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">PR-VERIFIED Seal Preview</h2>
                {sealCode && (
                  <div className="bg-gray-800 border border-red-900 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-500 mb-0.5">Seal Code</p>
                    <p className="text-lg font-mono font-bold text-red-400">{sealCode}</p>
                  </div>
                )}
                {!imageLoaded ? (
                  <div className="flex items-center justify-center h-40 text-gray-600 text-sm">Loading...</div>
                ) : !sealCode ? (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-600 gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/pr-verified-seal.png" alt="seal" className="w-32 opacity-20" />
                    <p className="text-xs">Save to generate seal</p>
                  </div>
                ) : (
                  <canvas ref={canvasRef} className="w-full rounded-xl border border-gray-800" />
                )}
              </div>
            )}

            {/* ATP ID display */}
            {showATP && atpId && (
              <div className="bg-gray-900 rounded-2xl p-5">
                <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">ATP Training Passport</h2>
                <div className="bg-gray-800 border border-blue-900 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500 mb-0.5">ATP ID</p>
                  <p className="text-lg font-mono font-bold text-blue-400">{atpId}</p>
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="bg-gray-900 rounded-2xl p-5 space-y-3">
              <button onClick={handleSave} disabled={!name || saving || isSaved}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors text-sm">
                {saving ? "Saving..." : isSaved ? "✓ Saved" : mode === "prv" ? "Save PR-VERIFIED Athlete" : mode === "atp" ? "Save ATP Athlete" : "Save to Both Systems"}
              </button>

              {savedPRV && rendered && (
                <button onClick={handleDownload} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl py-2.5 text-sm">
                  Download {sealCode}.png
                </button>
              )}

              <p className="text-xs text-gray-600 text-center">
                {mode === "both" ? "Creates a PR-V seal record and an ATP training profile in one step." :
                  mode === "prv" ? "Generates a downloadable seal. No parent portal access." :
                  "Creates a training profile. Parent can be linked via /admin/parents."}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function NewAthletePage() {
  return <Suspense><NewAthleteForm /></Suspense>
}
