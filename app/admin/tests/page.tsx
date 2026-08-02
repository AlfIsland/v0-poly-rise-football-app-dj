"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { PendingVideoTest, TrainingAthlete } from "@/app/api/training/route"
import { METRIC_LABELS } from "@/lib/test-metrics"

interface Row extends PendingVideoTest {
  athleteId: string
  athleteName: string
}

export default function TestVideoQueuePage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"pending" | "all">("pending")

  useEffect(() => {
    fetch("/api/training").then(r => r.json()).then(data => {
      if (!data.success) { setLoading(false); return }
      const athletes: TrainingAthlete[] = data.athletes ?? []
      const flat: Row[] = []
      for (const a of athletes) {
        for (const t of a.pendingVideoTests ?? []) {
          flat.push({ ...t, athleteId: a.id, athleteName: a.name })
        }
      }
      flat.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      setRows(flat)
      setLoading(false)
    })
  }, [])

  const visible = rows.filter(r => filter === "all" || r.status === "pending")
  const pendingCount = rows.filter(r => r.status === "pending").length

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Test Video Review Queue</h1>
          <p className="text-sm text-gray-500 mt-1">Confirm distance/attempt and save verified results from athlete-uploaded videos.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${filter === "pending" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400"}`}>
            Pending ({pendingCount})
          </button>
          <button onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${filter === "all" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400"}`}>
            All ({rows.length})
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : visible.length === 0 ? (
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 text-center text-gray-500">
          No {filter === "pending" ? "pending" : ""} test videos.
        </div>
      ) : (
        <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
          {visible.map(r => (
            <div key={r.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="text-white font-bold text-sm">{r.athleteName} <span className="text-gray-500 font-normal">· {r.athleteId}</span></p>
                <p className="text-gray-400 text-sm">{METRIC_LABELS[r.metric]}</p>
                <p className="text-gray-600 text-xs mt-0.5">
                  Uploaded {new Date(r.uploadedAt).toLocaleString()} by {r.uploadedBy === "athlete" ? "athlete" : "staff"}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  r.status === "pending" ? "bg-yellow-900/50 text-yellow-400 border-yellow-700/40"
                  : r.status === "verified" ? "bg-green-900/50 text-green-400 border-green-700/40"
                  : "bg-red-900/50 text-red-400 border-red-700/40"
                }`}>
                  {r.status}
                </span>
                {r.status === "pending" && (
                  <Link href={`/admin/tests/${r.athleteId}/${r.id}`}
                    className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg transition-colors">
                    Review →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
