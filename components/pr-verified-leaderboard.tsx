"use client"

import { useState, useRef } from "react"
import { BOARDS, TOTAL_BOARDS, TOTAL_EVENTS, uniqueSchoolCount } from "@/lib/the-board-data"

const SCARLET  = "#e0342b"
const GOLD     = "#966b27"
const GOLD_LT  = "#c9973c"
const BG       = "#000"
const PANEL    = "#0d1014"
const LINE     = "rgba(255,255,255,0.10)"
const LINE2    = "rgba(255,255,255,0.18)"
const DIM      = "#8a919c"
const DIM2     = "#565e69"
const FONT     = `var(--font-archivo-black, 'Archivo', 'Helvetica Neue', Arial, sans-serif)`

const SCHOOL_COUNT = uniqueSchoolCount(BOARDS)

export default function PRVerifiedLeaderboard() {
  const [query, setQuery]           = useState("")
  const [showNotice, setShowNotice] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleLockedClick() {
    setShowNotice(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setShowNotice(false), 4000)
  }

  const q = query.toLowerCase()
  const filteredBoards = query
    ? BOARDS
        .map(b => ({
          ...b,
          rows: b.rows.filter(([n, s]) =>
            n.toLowerCase().includes(q) || s.toLowerCase().includes(q)
          ),
        }))
        .filter(b => b.rows.length > 0)
    : BOARDS

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#fff", fontFamily: FONT, WebkitFontSmoothing: "antialiased" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* ── Header ── */}
        <header style={{ borderBottom: `1px solid ${LINE}`, padding: "26px 0 20px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/the-board-logo.png"
              alt="THE BOARD — where coaches look."
              style={{ height: 66, width: "auto", display: "block" }}
            />
            <div style={{ borderLeft: `1px solid ${LINE2}`, paddingLeft: 18 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: SCARLET, color: "#fff", fontSize: 11, fontWeight: 900,
                letterSpacing: "0.16em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 5,
              }}>
                PR-Verified
              </span>
              <p style={{ color: DIM, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 9, fontWeight: 700, margin: "9px 0 0" }}>
                PolyRISE Athletix · Summer 2026
              </p>
            </div>
          </div>
        </header>

        {/* ── Stat strip ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1,
          background: LINE, border: `1px solid ${LINE}`, borderRadius: 12,
          overflow: "hidden", marginBottom: 28,
        }}>
          {([
            [TOTAL_BOARDS, "Leaderboards"],
            [TOTAL_EVENTS, "Events"],
            [SCHOOL_COUNT, "Schools"],
          ] as [number, string][]).map(([n, l]) => (
            <div key={l} style={{ background: PANEL, padding: "18px 16px", textAlign: "center" }}>
              <b style={{ display: "block", fontSize: 30, fontWeight: 900, lineHeight: 1 }}>{n}</b>
              <span style={{ display: "block", color: DIM, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 7, fontWeight: 700 }}>
                {l}
              </span>
            </div>
          ))}
        </div>

        {/* ── Controls ── */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 24 }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <input
              type="text"
              placeholder="Search athlete or school..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: "100%", background: PANEL, border: `1px solid ${LINE}`, borderRadius: 10,
                color: "#fff", padding: "13px 15px", fontSize: 15, fontFamily: "inherit",
                fontWeight: 600, outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Division toggle — all locked */}
          <div style={{ display: "flex", background: PANEL, border: `1px solid ${LINE}`, borderRadius: 10, overflow: "hidden" }}>
            {["All", "High School", "Middle School"].map(label => (
              <button
                key={label}
                onClick={handleLockedClick}
                style={{
                  background: "none", border: "none", color: DIM2,
                  padding: "13px 18px", fontSize: 12, fontWeight: 800,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", opacity: 0.75,
                }}
              >
                🔒 {label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div style={{ display: "flex", background: PANEL, border: `1px solid ${LINE}`, borderRadius: 10, overflow: "hidden" }}>
            <button
              onClick={handleLockedClick}
              style={{
                background: "none", border: "none", color: DIM2,
                padding: "13px 18px", fontSize: 12, fontWeight: 800,
                letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "inherit", opacity: 0.75,
              }}
            >
              🔒 Athletes
            </button>
            <button
              style={{
                background: SCARLET, border: "none", color: "#fff",
                padding: "13px 18px", fontSize: 12, fontWeight: 800,
                letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Boards
            </button>
          </div>
        </div>

        {/* ── Lock notice ── */}
        {showNotice && (
          <div style={{
            marginBottom: 18, background: PANEL,
            border: `1px solid rgba(224,52,43,0.4)`, borderLeft: `4px solid ${SCARLET}`,
            borderRadius: 9, padding: "13px 16px", color: "#c7ccd2", fontSize: 13, fontWeight: 600, lineHeight: 1.5,
          }}>
            <b style={{ color: SCARLET, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 11, display: "block", marginBottom: 4 }}>
              Members Only
            </b>
            Athlete profiles and division filters are part of the PolyRISE Athlete Profile — coming soon.
          </div>
        )}

        {/* ── Boards ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredBoards.length === 0 ? (
            <div style={{ textAlign: "center", color: DIM, padding: "60px 20px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 13 }}>
              No results on any board
            </div>
          ) : filteredBoards.map((board, i) => (
            <div key={i} style={{ background: PANEL, border: `1px solid ${LINE}`, borderRadius: 12, overflow: "hidden" }}>
              {/* Board header */}
              <div style={{
                padding: "16px 18px", borderBottom: `1px solid ${LINE}`,
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                borderLeft: `3px solid ${GOLD}`,
              }}>
                <h3 style={{ fontSize: 17, fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", color: GOLD_LT, margin: 0 }}>
                  {board.event}
                </h3>
                <span style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: DIM, border: `1px solid ${LINE}`, padding: "4px 9px", borderRadius: 5, whiteSpace: "nowrap",
                }}>
                  {board.div === "HS" ? "High School" : "Middle School"}
                </span>
              </div>

              {/* Board rows */}
              {board.rows.map(([name, school, val, rank], j) => (
                <div
                  key={j}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
                    borderBottom: j < board.rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    background: rank === 1 ? SCARLET : "transparent",
                  }}
                >
                  <div style={{ width: 38, flexShrink: 0, fontSize: 15, fontWeight: 900, color: rank === 1 ? "#fff" : DIM2 }}>
                    #{rank}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.02em", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {name}
                    </div>
                    {school && (
                      <div style={{ fontSize: 11, color: rank === 1 ? "rgba(255,255,255,0.75)" : DIM, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3, fontWeight: 700 }}>
                        {school}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: rank === 1 ? "#fff" : SCARLET, whiteSpace: "nowrap" }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <footer style={{
          borderTop: `1px solid ${LINE}`, marginTop: 40, paddingTop: 20,
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap",
        }}>
          <span style={{ color: DIM2, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: SCARLET, marginRight: 8 }} />
            PR Verified
          </span>
          <span style={{ color: GOLD_LT, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            The Board · Where Coaches Look
          </span>
          <span style={{ color: DIM2, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            polyriseathletix.com
          </span>
        </footer>

      </div>
    </div>
  )
}
