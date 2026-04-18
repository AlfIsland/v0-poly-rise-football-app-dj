"use client"

import { useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts"

interface Session {
  date: string
  fortyYard?: number
  twentyYard?: number
  shuttle?: number
  threeCone?: number
  verticalJump?: number
  broadJump?: number
  benchPress?: number
  weight?: number
}

const METRICS = [
  { key: "fortyYard",    label: "40-Yard",  unit: "s",    lower: true,  color: "#ef4444" },
  { key: "twentyYard",   label: "20-Yard",  unit: "s",    lower: true,  color: "#f43f5e" },
  { key: "shuttle",      label: "5-10-5",   unit: "s",    lower: true,  color: "#f97316" },
  { key: "threeCone",    label: "3-Cone",   unit: "s",    lower: true,  color: "#eab308" },
  { key: "verticalJump", label: "Vertical", unit: "\"",   lower: false, color: "#22c55e" },
  { key: "broadJump",    label: "Broad",    unit: "\"",   lower: false, color: "#3b82f6" },
  { key: "benchPress",   label: "Bench 135", unit: " reps", lower: false, color: "#a855f7" },
] as const

type MetricKey = typeof METRICS[number]["key"]

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getImprovement(sessions: Session[], key: MetricKey, lower: boolean) {
  const vals = sessions.map(s => s[key]).filter((v): v is number => v != null)
  if (vals.length < 2) return null
  const first = vals[0], last = vals[vals.length - 1]
  const delta = lower ? first - last : last - first
  const pct = ((Math.abs(delta) / first) * 100).toFixed(1)
  return { delta, pct, improved: delta > 0 }
}

export default function ProgressChart({ sessions }: { sessions: Session[] }) {
  const [active, setActive] = useState<MetricKey>("fortyYard")

  if (sessions.length < 2) return null

  const metric = METRICS.find(m => m.key === active)!

  // Build chart data — only sessions that have this metric
  const chartData = sessions
    .filter(s => s[active] != null)
    .map(s => ({
      date: formatDate(s.date),
      value: s[active] as number,
    }))

  if (chartData.length < 2) return null

  const values = chartData.map(d => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const padding = (max - min) * 0.3 || 0.5
  const domainMin = parseFloat((min - padding).toFixed(2))
  const domainMax = parseFloat((max + padding).toFixed(2))

  const baseline = chartData[0].value
  const current = chartData[chartData.length - 1].value
  const imp = getImprovement(sessions, active, metric.lower)

  // Available metrics (have at least 2 data points)
  const available = METRICS.filter(m => {
    const pts = sessions.filter(s => s[m.key] != null)
    return pts.length >= 2
  })

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Progress Chart</p>
          <p className="text-xs text-gray-500 mt-0.5">{sessions.length} sessions tracked</p>
        </div>
        {imp && (
          <div className={`text-right ${imp.improved ? "text-green-400" : "text-red-400"}`}>
            <p className="text-lg font-black">
              {imp.improved ? "+" : "-"}{Math.abs(imp.delta).toFixed(2)}{metric.unit}
            </p>
            <p className="text-xs font-semibold">{imp.pct}% {imp.improved ? "improvement" : "regression"}</p>
          </div>
        )}
      </div>

      {/* Metric selector tabs */}
      <div className="px-4 pt-4 flex flex-wrap gap-2">
        {available.map(m => (
          <button key={m.key} onClick={() => setActive(m.key as MetricKey)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors border ${
              active === m.key
                ? "text-white border-transparent"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:text-white"
            }`}
            style={active === m.key ? { backgroundColor: m.color, borderColor: m.color } : {}}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="px-2 pt-4 pb-2" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[domainMin, domainMax]}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false} tickLine={false}
              tickFormatter={v => `${v}${metric.unit}`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }}
              labelStyle={{ color: "#9ca3af", fontSize: 11 }}
              formatter={(v: number) => [`${v}${metric.unit}`, metric.label]}
              itemStyle={{ color: metric.color, fontWeight: 700 }}
            />
            <ReferenceLine y={baseline} stroke="#4b5563" strokeDasharray="4 4" />
            <Line
              type="monotone" dataKey="value"
              stroke={metric.color} strokeWidth={2.5}
              dot={{ fill: metric.color, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: metric.color }}
              animationDuration={400}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Baseline vs current summary */}
      <div className="px-6 pb-5 grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Baseline</p>
          <p className="text-xl font-black text-white">{baseline}{metric.unit}</p>
          <p className="text-xs text-gray-600 mt-0.5">{formatDate(sessions.filter(s => s[active] != null)[0].date)}</p>
        </div>
        <div className="bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current</p>
          <p className="text-xl font-black text-white">{current}{metric.unit}</p>
          <p className="text-xs text-gray-600 mt-0.5">{formatDate(sessions.filter(s => s[active] != null).slice(-1)[0].date)}</p>
        </div>
      </div>
    </div>
  )
}
