"use client"

import { useState, useRef } from "react"
import { upload } from "@vercel/blob/client"

interface Props {
  athleteId: string
  onUploaded?: () => void
}

const METRIC_OPTIONS: { key: string; label: string; hint: string }[] = [
  { key: "fortyYard", label: "40-Yard Dash", hint: "Times the sprint from a marked start line to a marked 40-yard finish line." },
  { key: "twentyYard", label: "20-Yard Dash", hint: "Times the sprint from a marked start line to a marked 20-yard finish line." },
  { key: "shuttle", label: "5-10-5 Shuttle", hint: "Times the full shuttle from first line-cross to final line-cross." },
  { key: "threeCone", label: "3-Cone Drill", hint: "Times the drill from start to finish through all three cones." },
  { key: "verticalJump", label: "Vertical Jump", hint: "Staff reads the measured height off the board/Vertec visible in the video." },
  { key: "broadJump", label: "Broad Jump", hint: "Staff reads the measured distance off the tape/markers visible in the video." },
  { key: "benchPress", label: "Bench Press (135 lb reps)", hint: "Staff counts completed reps visible in the video." },
]

const MAX_SIZE = 300 * 1024 * 1024 // 300MB

export default function VideoTestUploadForm({ athleteId, onUploaded }: Props) {
  const [metric, setMetric] = useState(METRIC_OPTIONS[0].key)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith("video/")) { setError("Please select a video file."); return }
    if (file.size > MAX_SIZE) { setError("Video must be under 300MB."); return }

    setError("")
    setSuccess(false)
    setProgress(0)

    try {
      const ext = file.name.split(".").pop() || "mp4"
      const pathname = `athletes/${athleteId.toUpperCase()}/tests/${Date.now()}.${ext}`

      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/training/video/upload",
        clientPayload: JSON.stringify({ athleteId }),
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      })

      const res = await fetch("/api/training/video/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ athleteId, metric, videoUrl: blob.url }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || "Failed to register test")

      setSuccess(true)
      setProgress(null)
      if (inputRef.current) inputRef.current.value = ""
      onUploaded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.")
      setProgress(null)
    }
  }

  const selected = METRIC_OPTIONS.find(m => m.key === metric)!

  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 space-y-4">
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Which test is this?</label>
        <select
          value={metric}
          onChange={e => setMetric(e.target.value)}
          className="mt-1.5 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm"
        >
          {METRIC_OPTIONS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
        </select>
        <p className="text-xs text-gray-600 mt-1.5">{selected.hint}</p>
      </div>

      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Video</label>
        <div
          onClick={() => inputRef.current?.click()}
          className="mt-1.5 border-2 border-dashed border-gray-700 hover:border-red-500 rounded-xl p-6 text-center cursor-pointer transition-colors"
        >
          <span className="text-2xl">🎥</span>
          <p className="text-gray-400 text-sm mt-1">Click to choose a video · Max 300MB</p>
          <p className="text-gray-600 text-xs mt-0.5">Make sure the start line, finish line, and any distance markers are clearly visible.</p>
        </div>
        <input ref={inputRef} type="file" accept="video/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      </div>

      {progress !== null && (
        <div>
          <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
            <div className="h-full bg-red-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Uploading… {progress.toFixed(0)}%</p>
        </div>
      )}
      {success && (
        <p className="text-green-400 text-sm font-bold">✓ Uploaded. PolyRISE Staff will review and confirm your time/measurement shortly.</p>
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}
