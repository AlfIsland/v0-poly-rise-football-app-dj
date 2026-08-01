"use client"

import { useState } from "react"
import Link from "next/link"
import {
  type Metric, type WeightClass,
  COMBINE_INFO, METRICS, WEIGHT_CLASSES,
  METRIC_LABELS, WEIGHT_CLASS_LABELS,
  getLeaderboard, formatScore,
} from "@/lib/pr-verified-data"

const SCARLET = "#DC143C"
const BG      = "#060706"

export default function PRVerifiedLeaderboard() {
  const [activeMetric, setActiveMetric]           = useState<Metric>("40yd")
  const [activeWeightClass, setActiveWeightClass] = useState<WeightClass>("over200")

  const results = getLeaderboard(activeMetric, activeWeightClass)

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden" style={{ background: BG }}>

      {/* Scarlet radial glow — top center */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80"
        style={{
          background: `radial-gradient(ellipse 75% 55% at 50% 0%, rgba(220,20,60,0.14) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-5 pb-12">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between py-5">
          <Link
            href="/"
            aria-label="Back"
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 12L6 8L10 4" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* Wordmark */}
          <div className="text-center select-none">
            <div className="flex items-center gap-1.5 justify-center">
              <span
                className="text-xs font-black tracking-[0.2em] uppercase"
                style={{ color: SCARLET, fontFamily: 'var(--font-archivo-black, "Arial Black", Impact, sans-serif)' }}
              >
                PR-VERIFIED
              </span>
              {/* Check-badge icon */}
              <span
                className="w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0"
                style={{ background: SCARLET }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                  <path d="M2 5.2L4 7.2L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            <p className="text-[9px] tracking-[0.22em] uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              POLYRISE ATHLETIX
            </p>
          </div>

          {/* Search (placeholder) */}
          <button
            aria-label="Search"
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="4.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
              <path d="M11 11L14 14" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </header>

        {/* ── Combine title block ─────────────────────────────────────────── */}
        <div className="mt-1 mb-5">
          <div className="flex items-start justify-between gap-4">
            {/* Left accent bar + name */}
            <div className="flex gap-3 items-stretch flex-1 min-w-0">
              <div className="w-[3px] rounded-full flex-shrink-0" style={{ background: SCARLET }} />
              <div className="min-w-0">
                <h1
                  className="font-black text-[15px] leading-snug tracking-wide text-white truncate"
                  style={{ fontFamily: 'var(--font-archivo-black, "Arial Black", Impact, sans-serif)' }}
                >
                  {COMBINE_INFO.name}
                </h1>
                <p className="text-[10px] tracking-[0.22em] uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {COMBINE_INFO.season}
                </p>
              </div>
            </div>

            {/* TOP PERFORMERS badge */}
            <span
              className="flex-shrink-0 text-[9px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border"
              style={{ color: SCARLET, borderColor: `${SCARLET}55` }}
            >
              TOP PERFORMERS
            </span>
          </div>

          {/* Scarlet → transparent divider */}
          <div
            className="mt-4 h-px"
            style={{ background: `linear-gradient(to right, ${SCARLET}99, transparent)` }}
          />
        </div>

        {/* ── Weight class toggle ─────────────────────────────────────────── */}
        <div className="flex gap-2 mb-4" role="group" aria-label="Weight class">
          {WEIGHT_CLASSES.map(wc => {
            const active = activeWeightClass === wc
            return (
              <button
                key={wc}
                onClick={() => setActiveWeightClass(wc)}
                aria-pressed={active}
                className="flex-1 py-2 px-3 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase transition-all duration-150"
                style={
                  active
                    ? { background: SCARLET, color: "white" }
                    : { border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.45)" }
                }
              >
                {WEIGHT_CLASS_LABELS[wc]}
              </button>
            )
          })}
        </div>

        {/* ── Metric pills (horizontal scroll, no scrollbar) ──────────────── */}
        <div
          className="flex gap-2 mb-7 overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: "none" } as React.CSSProperties}
          role="group"
          aria-label="Metric"
        >
          {METRICS.map(m => {
            const active = activeMetric === m
            return (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                aria-pressed={active}
                className="flex-shrink-0 py-1.5 px-4 rounded-full text-[11px] font-bold tracking-wide whitespace-nowrap transition-all duration-150"
                style={
                  active
                    ? { background: SCARLET, color: "white" }
                    : { border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.45)" }
                }
              >
                {METRIC_LABELS[m]}
              </button>
            )
          })}
        </div>

        {/* ── Leaderboard ─────────────────────────────────────────────────── */}
        <section>
          <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            TOP 3 ATHLETES
          </p>
          <h2
            className="text-[32px] font-black leading-none mb-1 text-white"
            style={{ fontFamily: 'var(--font-archivo-black, "Arial Black", Impact, sans-serif)' }}
          >
            {METRIC_LABELS[activeMetric].toUpperCase()}
          </h2>
          <p className="text-[10px] tracking-[0.2em] uppercase mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
            {WEIGHT_CLASS_LABELS[activeWeightClass]}
          </p>

          {results.length === 0 ? (
            /* Empty state */
            <div
              className="rounded-xl px-6 py-8 text-center"
              style={{ border: "1.5px dashed rgba(255,255,255,0.15)" }}
            >
              <p className="text-xs font-bold tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                No Verified Results Yet
              </p>
              <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.2)" }}>
                Add athletes to populate this leaderboard.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {results.map((athlete, i) => {
                const isTop = i === 0
                return (
                  <div
                    key={`${athlete.name}-${i}`}
                    className="flex items-center gap-4 rounded-xl px-4 py-3.5"
                    style={
                      isTop
                        ? { background: SCARLET }
                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }
                    }
                  >
                    {/* Rank */}
                    <span
                      className="text-xl font-black leading-none w-7 flex-shrink-0"
                      style={{
                        fontFamily: 'var(--font-archivo-black, "Arial Black", Impact, sans-serif)',
                        color: isTop ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.22)",
                      }}
                    >
                      #{i + 1}
                    </span>

                    {/* Name + school */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-bold text-[13px] leading-tight truncate"
                        style={{ color: "rgba(255,255,255,0.95)" }}
                      >
                        {athlete.name}
                      </p>
                      {athlete.school && (
                        <p
                          className="text-[11px] mt-0.5 truncate"
                          style={{ color: isTop ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.38)" }}
                        >
                          {athlete.school}
                        </p>
                      )}
                    </div>

                    {/* Score */}
                    <span
                      className="text-[22px] font-black leading-none flex-shrink-0 tabular-nums text-white"
                      style={{ fontFamily: 'var(--font-archivo-black, "Arial Black", Impact, sans-serif)' }}
                    >
                      {formatScore(athlete.score, activeMetric)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer className="mt-10 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <p
            className="text-center text-[9px] tracking-[0.28em] uppercase mb-5"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            PRVERIFIED.COM
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: SCARLET }} />
              <span
                className="text-[11px] font-bold tracking-wider"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                PR-VERIFIED
              </span>
            </div>
            <span
              className="text-[11px] font-bold tracking-wider"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              #POLYRISEATHLETIX
            </span>
          </div>
        </footer>

      </div>
    </div>
  )
}
