"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { PendingVideoTest, TrainingAthlete } from "@/app/api/training/route"
import { METRIC_LABELS, METRIC_UNITS } from "@/lib/test-metrics"

const TIMED = new Set(["fortyYard", "twentyYard", "shuttle", "threeCone"])

export default function ReviewTestPage({ params }: { params: { athleteId: string; testId: string } }) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)

  const [athlete, setAthlete] = useState<TrainingAthlete | null>(null)
  const [test, setTest] = useState<PendingVideoTest | null>(null)
  const [loading, setLoading] = useState(true)

  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [value, setValue] = useState("")
  const [distanceConfirmed, setDistanceConfirmed] = useState(false)
  const [notes, setNotes] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    fetch(`/api/training?id=${params.athleteId}`).then(r => r.json()).then(data => {
      if (data.success) {
        setAthlete(data.athlete)
        const t = (data.athlete.pendingVideoTests ?? []).find((x: PendingVideoTest) => x.id === params.testId)
        setTest(t ?? null)
      }
      setLoading(false)
    })
  }, [params.athleteId, params.testId])

  if (loading) return <div className="p-6 text-gray-500">Loading…</div>
  if (!athlete || !test) {
    return (
      <div className="p-6">
        <p className="text-gray-400">Test not found.</p>
        <Link href="/admin/tests" className="text-red-400 text-sm">← Back to queue</Link>
      </div>
    )
  }

  const isTimed = TIMED.has(test.metric)
  const computedTime = startTime != null && endTime != null && endTime > startTime
    ? Math.round((endTime - startTime) * 100) / 100
    : null

  function step(delta: number) {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Math.max(0, Math.min(v.duration || Infinity, v.currentTime + delta))
  }

  async function handleSave() {
    setError("")
    if (!distanceConfirmed) { setError("Confirm the distance/attempt is valid before saving."); return }
    if (isTimed && computedTime == null) { setError("Mark both the start and finish points first."); return }
    if (!isTimed && !value) { setError("Enter the measured value."); return }

    setSaving(true)
    try {
      const res = await fetch("/api/training", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: params.athleteId,
          action: "verify-video-test",
          testId: params.testId,
          distanceConfirmed: true,
          notes: notes || undefined,
          ...(isTimed ? { startTime, endTime } : { value }),
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || "Failed to save")
      router.push("/admin/tests")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    }
    setSaving(false)
  }

  async function handleReject() {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/training", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.athleteId, action: "reject-video-test", testId: params.testId, reason: rejectReason || undefined }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || "Failed to reject")
      router.push("/admin/tests")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject")
    }
    setSaving(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div>
        <Link href="/admin/tests" className="text-gray-500 hover:text-gray-300 text-sm">← Back to queue</Link>
        <h1 className="text-xl font-black text-white mt-1">{athlete.name} · {METRIC_LABELS[test.metric]}</h1>
        <p className="text-sm text-gray-500">{athlete.id} · uploaded {new Date(test.uploadedAt).toLocaleString()}</p>
      </div>

      <div className="bg-black rounded-2xl overflow-hidden">
        <video
          ref={videoRef}
          src={test.videoUrl}
          controls
          className="w-full max-h-[480px]"
          onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
        />
      </div>

      {isTimed ? (
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 space-y-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Frame Scrubber</p>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => step(-1)} className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg">-1s</button>
            <button onClick={() => step(-0.1)} className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg">-0.1s</button>
            <button onClick={() => step(-1 / 30)} className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg">-1 frame</button>
            <span className="text-gray-400 text-sm font-mono px-2">{currentTime.toFixed(2)}s</span>
            <button onClick={() => step(1 / 30)} className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg">+1 frame</button>
            <button onClick={() => step(0.1)} className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg">+0.1s</button>
            <button onClick={() => step(1)} className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg">+1s</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setStartTime(currentTime)}
              className="bg-blue-950 border border-blue-700/50 hover:bg-blue-900 rounded-xl px-4 py-3 text-left">
              <p className="text-xs text-blue-400 font-bold uppercase">Mark Start</p>
              <p className="text-white font-mono text-lg">{startTime != null ? `${startTime.toFixed(2)}s` : "—"}</p>
            </button>
            <button onClick={() => setEndTime(currentTime)}
              className="bg-green-950 border border-green-700/50 hover:bg-green-900 rounded-xl px-4 py-3 text-left">
              <p className="text-xs text-green-400 font-bold uppercase">Mark Finish</p>
              <p className="text-white font-mono text-lg">{endTime != null ? `${endTime.toFixed(2)}s` : "—"}</p>
            </button>
          </div>

          <div className="bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3 text-center">
            <p className="text-xs text-red-400 uppercase tracking-wider">Computed Time</p>
            <p className="text-white font-black text-3xl">{computedTime != null ? `${computedTime.toFixed(2)}s` : "—"}</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Measured Result</p>
          <p className="text-xs text-gray-600">Watch the video and enter the value shown on the tape/board/count.</p>
          <div className="flex items-center gap-2">
            <input type="number" step="0.1" value={value} onChange={e => setValue(e.target.value)}
              className="w-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
            <span className="text-gray-400 text-sm">{METRIC_UNITS[test.metric]}</span>
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 space-y-3">
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" checked={distanceConfirmed} onChange={e => setDistanceConfirmed(e.target.checked)}
            className="w-4 h-4" />
          I confirm this video shows a legitimate {METRIC_LABELS[test.metric].toLowerCase()} attempt with the distance/setup visible and correct.
        </label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" rows={2} />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving}
          className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl">
          ✓ Save Verified Result
        </button>
        <input value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Rejection reason (optional)"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
        <button onClick={handleReject} disabled={saving}
          className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-300 font-bold px-4 py-2.5 rounded-xl">
          Reject
        </button>
      </div>
    </div>
  )
}
