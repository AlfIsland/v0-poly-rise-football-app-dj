"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BOARDS, TOTAL_EVENTS, TOTAL_BOARDS,
  filterBoards, uniqueSchoolCount,
  type Board,
} from "@/lib/the-board-data"

// ── Brand tokens ─────────────────────────────────────────────────────────────
const BG      = "#000000"
const PANEL   = "#0d1014"
const GOLD    = "#966b27"
const GOLD_T  = "#c9973c"
const SCARLET = "#e0342b"
const GRAY    = "#8a919c"
const BORDER  = "rgba(255,255,255,0.10)"
const DISP    = 'var(--font-archivo-black,"Arial Black",Impact,sans-serif)'

const TOTAL_SCHOOLS = uniqueSchoolCount(BOARDS)

const STAT_CELLS = [
  { value: TOTAL_BOARDS,  label: "LEADERBOARDS" },
  { value: TOTAL_EVENTS,  label: "EVENTS"        },
  { value: TOTAL_SCHOOLS, label: "SCHOOLS"        },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function TheBoardLeaderboard() {
  const [search,   setSearch]  = useState("")
  const [notice,   setNotice]  = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const visible = filterBoards(BOARDS, search)

  function handleLockedClick() {
    setNotice(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setNotice(false), 4000)
  }

  return (
    <main style={{ background: BG, minHeight: "100vh", color: "#fff" }}>
      <div style={{ maxWidth: 1024, margin: "0 auto", padding: "0 16px 80px" }}>

        {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
        <header style={{ borderBottom: `1px solid ${BORDER}`, padding: "24px 0 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* THE BOARD logo — place /the-board-logo.png in public/ */}
              <Image
                src="/the-board-logo.png"
                alt="THE BOARD"
                width={96}
                height={48}
                style={{ objectFit: "contain", height: 48, width: "auto" }}
                priority
              />
              <div>
                <div style={{ marginBottom: 4 }}>
                  <span style={{
                    background: SCARLET, color: "#fff",
                    fontSize: 9, fontWeight: 900, letterSpacing: "0.12em",
                    padding: "2px 9px", borderRadius: 100, textTransform: "uppercase",
                  }}>
                    PR-VERIFIED
                  </span>
                </div>
                <p style={{ color: GRAY, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 }}>
                  PolyRISE Athletix · Summer 2026
                </p>
              </div>
            </div>

            <Link
              href="/"
              style={{
                color: GRAY, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Home
            </Link>
          </div>
        </header>

        {/* ── STAT STRIP ───────────────────────────────────────────────────── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3,1fr)",
          border: `1px solid ${BORDER}`, borderRadius: 12,
          overflow: "hidden", margin: "24px 0",
        }}>
          {STAT_CELLS.map(({ value, label }, i) => (
            <div key={label} style={{
              background: PANEL, padding: "20px 12px",
              borderRight: i < 2 ? `1px solid ${BORDER}` : undefined,
              textAlign: "center",
            }}>
              <div style={{
                fontSize: 38, fontWeight: 900, color: "#fff",
                lineHeight: 1, letterSpacing: "-0.02em", fontFamily: DISP,
              }}>
                {value}
              </div>
              <div style={{
                fontSize: 9, color: GRAY, letterSpacing: "0.2em",
                textTransform: "uppercase", marginTop: 8, fontWeight: 700,
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ── CONTROLS ─────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: GRAY, pointerEvents: "none" }}>
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search athlete or school…"
              style={{
                width: "100%", background: PANEL, border: `1px solid ${BORDER}`,
                borderRadius: 10, padding: "12px 16px 12px 40px",
                color: "#fff", fontSize: 13, fontWeight: 500, outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Locked notice */}
          {notice && (
            <div style={{
              borderLeft: `3px solid ${SCARLET}`, background: PANEL,
              borderRadius: 8, padding: "10px 16px", marginBottom: 14,
            }}>
              <span style={{
                color: SCARLET, fontWeight: 900, textTransform: "uppercase",
                letterSpacing: "0.07em", fontSize: 10,
              }}>
                MEMBERS ONLY
              </span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginLeft: 4 }}>
                — Athlete profiles and division filters are part of the PolyRISE Athlete Profile — coming soon.
              </span>
            </div>
          )}

          {/* Segmented controls row */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>

            {/* Division toggle */}
            <div style={{
              display: "flex", gap: 3, background: PANEL,
              border: `1px solid ${BORDER}`, borderRadius: 9, padding: 3, flex: "1 1 auto",
            }}>
              {/* All — active */}
              <button style={{
                padding: "7px 16px", borderRadius: 6,
                background: GOLD, color: "#fff", fontSize: 11,
                fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase",
                border: "none", cursor: "pointer", fontFamily: DISP,
              }}>
                All
              </button>
              {(["High School", "Middle School"] as const).map(lbl => (
                <button
                  key={lbl}
                  onClick={handleLockedClick}
                  style={{
                    padding: "7px 12px", borderRadius: 6, background: "transparent",
                    color: `${GRAY}88`, fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5,
                  }}
                >
                  <LockIcon />
                  {lbl}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div style={{
              display: "flex", gap: 3, background: PANEL,
              border: `1px solid ${BORDER}`, borderRadius: 9, padding: 3, flexShrink: 0,
            }}>
              <button
                onClick={handleLockedClick}
                style={{
                  padding: "7px 12px", borderRadius: 6, background: "transparent",
                  color: `${GRAY}88`, fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                }}
              >
                <LockIcon />
                Athletes
              </button>
              {/* Boards — active */}
              <button style={{
                padding: "7px 16px", borderRadius: 6,
                background: SCARLET, color: "#fff", fontSize: 11,
                fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase",
                border: "none", cursor: "pointer", fontFamily: DISP,
              }}>
                Boards
              </button>
            </div>

          </div>
        </div>

        {/* ── BOARDS GRID ──────────────────────────────────────────────────── */}
        {visible.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: GRAY }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              No matching athletes found
            </p>
            <p style={{ fontSize: 11, marginTop: 6, color: `${GRAY}66` }}>Try a different name or school</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 440px), 1fr))",
            gap: 14,
          }}>
            {visible.map((board, i) => (
              <BoardPanel key={`${board.event}-${board.div}-${i}`} board={board} />
            ))}
          </div>
        )}

      </div>
    </main>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg width="9" height="11" viewBox="0 0 9 11" fill="none" aria-hidden>
      <rect x="0.6" y="4.6" width="7.8" height="5.8" rx="1.4" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M2.5 4.5V3a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function BoardPanel({ board }: { board: Board }) {
  const divLabel = board.div === "HS" ? "HIGH SCHOOL" : "MIDDLE SCHOOL"

  return (
    <div style={{
      background: PANEL, border: `1px solid ${BORDER}`,
      borderRadius: 12, overflow: "hidden",
    }}>
      {/* Panel header */}
      <div style={{
        borderLeft: `3px solid ${GOLD}`,
        padding: "13px 16px 13px 14px",
        borderBottom: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
      }}>
        <span style={{
          color: GOLD_T, fontWeight: 900, fontSize: 13,
          letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: DISP,
        }}>
          {board.event}
        </span>
        <span style={{
          color: GRAY, fontSize: 9, fontWeight: 700,
          letterSpacing: "0.12em", textTransform: "uppercase",
          border: `1px solid ${BORDER}`, borderRadius: 100,
          padding: "3px 9px", flexShrink: 0,
        }}>
          {divLabel}
        </span>
      </div>

      {/* Rows */}
      {board.rows.length === 0 ? (
        <div style={{ padding: "28px 16px", textAlign: "center" }}>
          <p style={{
            color: `${GRAY}44`, fontSize: 11, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase", margin: 0,
          }}>
            — NO RESULTS YET —
          </p>
        </div>
      ) : (
        <div>
          {board.rows.map(([name, school, value, rank], j) => {
            const isTop = rank === 1
            return (
              <div key={j} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "13px 16px",
                background: isTop ? SCARLET : "transparent",
                borderTop: j > 0
                  ? `1px solid ${isTop ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`
                  : undefined,
              }}>
                {/* Rank */}
                <span style={{
                  fontSize: 16, fontWeight: 900, lineHeight: 1,
                  width: 30, flexShrink: 0, fontFamily: DISP,
                  color: isTop ? "rgba(255,255,255,0.6)" : GOLD_T,
                }}>
                  #{rank}
                </span>

                {/* Name + school */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontWeight: 800, fontSize: 13, margin: 0, lineHeight: 1.25,
                    color: "#fff",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {name}
                  </p>
                  {school && (
                    <p style={{
                      margin: "3px 0 0", fontSize: 9, fontWeight: 700,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: isTop ? "rgba(255,255,255,0.55)" : GRAY,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {school}
                    </p>
                  )}
                </div>

                {/* Mark */}
                <span style={{
                  fontSize: 22, fontWeight: 900, lineHeight: 1,
                  flexShrink: 0, fontFamily: DISP,
                  fontVariantNumeric: "tabular-nums",
                  color: isTop ? "#fff" : SCARLET,
                }}>
                  {value}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
