"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface Session {
  date?: string
  fortyYard?: number
  twentyYard?: number
  shuttle?: number
  threeCone?: number
  verticalJump?: number
  broadJump?: number
  benchPress?: number
  weight?: number
  height?: string
}

interface AthleteProfile {
  id: string
  name: string
  position?: string
  grade?: string
  school?: string
  sport?: string
  videoLink?: string
  twitterHandle?: string
  joinedAt?: string
  sessionCount: number
  baseline: Session | null
  current: Session | null
  prvCode?: string | null
}

function pct(baseline?: number, current?: number) {
  if (!baseline || !current || baseline === 0) return null
  const diff = ((current - baseline) / baseline) * 100
  return diff
}

function MetricRow({
  label, unit, baseline, current, lowerIsBetter = false,
}: {
  label: string
  unit: string
  baseline?: number
  current?: number
  lowerIsBetter?: boolean
}) {
  if (!baseline && !current) return null
  const change = pct(baseline, current)
  const improved = change !== null ? (lowerIsBetter ? change < 0 : change > 0) : null

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <p className="text-gray-400 text-sm">{label}</p>
      <div className="flex items-center gap-4 text-right">
        {baseline && (
          <div>
            <p className="text-xs text-gray-600">Baseline</p>
            <p className="text-white font-semibold text-sm">{baseline}{unit}</p>
          </div>
        )}
        {current && (
          <div>
            <p className="text-xs text-gray-600">Current</p>
            <p className="text-white font-bold text-sm">{current}{unit}</p>
          </div>
        )}
        {change !== null && Math.abs(change) > 0.5 && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${improved ? "bg-green-900/60 text-green-400" : "bg-red-900/60 text-red-400"}`}>
            {improved ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  )
}

export default function AthleteProfilePage() {
  const params = useParams()
  const id = (params?.id as string)?.toUpperCase()
  const [athlete, setAthlete] = useState<AthleteProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([
      fetch(`/api/training?id=${id}`).then(r => r.json()),
      fetch(`/api/athlete/${id}`).then(r => r.json()).catch(() => ({ success: false })),
    ]).then(([trainingData, extra]) => {
      if (!trainingData.success || !trainingData.athlete) { setNotFound(true); return }
      const a = trainingData.athlete
      const sessions = a.sessions ?? []
      setAthlete({
        id: a.id,
        name: a.name,
        position: a.position ?? null,
        grade: a.grade ?? null,
        school: a.school ?? null,
        sport: a.sport ?? null,
        videoLink: a.videoLink ?? null,
        twitterHandle: a.twitterHandle ?? null,
        joinedAt: a.joinedAt ?? null,
        sessionCount: sessions.length,
        baseline: sessions[0] ?? null,
        current: sessions[sessions.length - 1] ?? null,
        prvCode: extra?.athlete?.prvCode ?? null,
      })
    }).catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const sportLabel = athlete?.sport === "football" ? "Football" : athlete?.sport === "soccer" ? "Soccer" : athlete?.sport ?? "Athlete"

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading profile...</p>
      </div>
    )
  }

  if (notFound || !athlete) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 px-4">
        <Image src="/poly-rise-logo.png" alt="PolyRISE" width={64} height={64} className="object-contain opacity-40" />
        <p className="text-white font-bold text-lg">Profile not found</p>
        <p className="text-gray-500 text-sm text-center">This recruiting profile may have been removed or the link is incorrect.</p>
        <Link href="/" className="text-xs text-red-400 hover:text-red-300 underline mt-2">← PolyRISE Football</Link>
      </div>
    )
  }

  const hasMetrics = athlete.baseline || athlete.current
  const c = athlete.current
  const b = athlete.baseline

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-black px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={40} height={40} className="object-contain" />
          <div>
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest">PolyRISE Football</p>
            <p className="text-xs text-gray-500">Athlete Recruiting Profile</p>
          </div>
        </div>
        <button onClick={copyLink}
          className="text-xs bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 px-4 py-2 rounded-xl transition-colors font-semibold">
          {copied ? "✓ Copied!" : "Copy Link"}
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Hero card */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-black text-white leading-tight">{athlete.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {athlete.position && (
                  <span className="text-xs bg-red-900/50 text-red-300 border border-red-700/50 px-2.5 py-0.5 rounded-full font-semibold">
                    {athlete.position}
                  </span>
                )}
                {athlete.grade && (
                  <span className="text-xs bg-white/10 text-gray-300 border border-white/10 px-2.5 py-0.5 rounded-full font-semibold">
                    Grade {athlete.grade}
                  </span>
                )}
                <span className="text-xs bg-white/10 text-gray-300 border border-white/10 px-2.5 py-0.5 rounded-full font-semibold">
                  {sportLabel}
                </span>
              </div>
              {athlete.school && (
                <p className="text-gray-400 text-sm mt-2 font-medium">{athlete.school}</p>
              )}
              {athlete.twitterHandle && (
                <p className="text-blue-400 text-xs mt-1">@{athlete.twitterHandle.replace(/^@/, "")}</p>
              )}
            </div>

            {/* PR-VERIFIED badge */}
            {athlete.prvCode && (
              <Link href={`/verify/${athlete.prvCode}`} target="_blank"
                className="shrink-0 flex flex-col items-center gap-1 bg-red-950/60 border border-red-700/50 rounded-xl px-4 py-3 hover:bg-red-950 transition-colors">
                <Image src="/pr-verified-seal.png" alt="PR-VERIFIED" width={52} height={52} className="object-contain" />
                <p className="text-xs text-red-400 font-black uppercase tracking-wide">PR-VERIFIED</p>
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
            <div className="text-center">
              <p className="text-2xl font-black text-white">{athlete.sessionCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Training Sessions</p>
            </div>
            <div className="text-center border-x border-white/5">
              <p className="text-2xl font-black text-red-400">{athlete.prvCode ? "Yes" : "—"}</p>
              <p className="text-xs text-gray-500 mt-0.5">PR-Verified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">
                {athlete.joinedAt ? new Date(athlete.joinedAt).getFullYear() : "—"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Member Since</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        {hasMetrics && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-5 bg-red-600 rounded-full" />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Performance Metrics</h2>
              {athlete.prvCode && (
                <span className="ml-auto text-xs bg-red-900/50 text-red-400 border border-red-700/40 px-2 py-0.5 rounded-full font-bold">
                  Coach-Verified
                </span>
              )}
            </div>

            <div>
              <MetricRow label="40-Yard Dash" unit="s" baseline={b?.fortyYard} current={c?.fortyYard} lowerIsBetter />
              <MetricRow label="20-Yard Dash" unit="s" baseline={b?.twentyYard} current={c?.twentyYard} lowerIsBetter />
              <MetricRow label="Shuttle" unit="s" baseline={b?.shuttle} current={c?.shuttle} lowerIsBetter />
              <MetricRow label="3-Cone Drill" unit="s" baseline={b?.threeCone} current={c?.threeCone} lowerIsBetter />
              <MetricRow label="Vertical Jump" unit='"' baseline={b?.verticalJump} current={c?.verticalJump} />
              <MetricRow label="Broad Jump" unit='"' baseline={b?.broadJump} current={c?.broadJump} />
              <MetricRow label="Bench Press" unit=" reps" baseline={b?.benchPress} current={c?.benchPress} />
              {(b?.weight || c?.weight) && (
                <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <p className="text-gray-400 text-sm">Weight</p>
                  <p className="text-white font-bold text-sm">{c?.weight ?? b?.weight} lbs</p>
                </div>
              )}
              {(b?.height || c?.height) && (
                <div className="flex items-center justify-between py-3">
                  <p className="text-gray-400 text-sm">Height</p>
                  <p className="text-white font-bold text-sm">{c?.height ?? b?.height}</p>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-600 mt-4">
              Metrics recorded at PolyRISE Football combine camps · Dripping Springs, TX
            </p>
          </div>
        )}

        {/* Film */}
        {athlete.videoLink && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-5 bg-red-600 rounded-full" />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Film</h2>
            </div>
            <a href={athlete.videoLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-4 py-3 transition-colors group">
              <span className="text-2xl">🎬</span>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm group-hover:text-red-400 transition-colors">Watch Hudl Film</p>
                <p className="text-xs text-gray-500 truncate">{athlete.videoLink}</p>
              </div>
              <span className="text-gray-500 group-hover:text-white transition-colors">↗</span>
            </a>
          </div>
        )}

        {/* Recruiting contact */}
        <div className="bg-gradient-to-br from-red-950/60 to-gray-900 border border-red-800/40 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-5 bg-red-600 rounded-full" />
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Recruiting Inquiries</h2>
          </div>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-700 flex items-center justify-center text-white font-black text-sm shrink-0">KG</div>
            <div>
              <p className="text-yellow-300 font-bold text-sm">Kevin Garrett · Former NFL</p>
              <p className="text-gray-400 text-xs">Director of Player Development · PolyRISE Football</p>
              <a href="mailto:kg@polyrisefootball.com"
                className="text-red-400 hover:text-red-300 text-xs font-bold mt-1 inline-block transition-colors">
                kg@polyrisefootball.com
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="mailto:kg@polyrisefootball.com"
              className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl transition-colors">
              Email Kevin Garrett
            </a>
            <a href="tel:+18176583300"
              className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 font-semibold px-4 py-2 rounded-xl border border-white/10 transition-colors">
              (817) 658-3300
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 pb-6">
          <div className="flex items-center gap-2">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={28} height={28} className="object-contain opacity-60" />
            <p className="text-xs text-gray-600">PolyRISE Football · polyrisefootball.com</p>
          </div>
          {athlete.prvCode && (
            <Link href={`/verify/${athlete.prvCode}`} target="_blank"
              className="text-xs text-gray-600 hover:text-gray-400 underline transition-colors">
              Verify credentials ↗
            </Link>
          )}
        </div>

      </main>
    </div>
  )
}
