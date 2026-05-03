"use client"

import { useState } from "react"

export default function AdvisorBubble() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Chat iframe panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "88px",
            left: "24px",
            width: "360px",
            height: "540px",
            zIndex: 9998,
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <iframe
            src="/advisor"
            style={{ width: "100%", height: "100%", border: "none" }}
            title="PolyRISE AI Advisor"
          />
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close AI Advisor" : "Open AI Advisor"}
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: open ? "#124d2a" : "#1A6B3A",
          color: "#fff",
          border: "none",
          padding: "12px 18px",
          borderRadius: "30px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          transition: "background 0.2s, transform 0.15s",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Close
          </>
        ) : (
          <>
            🏈 Ask AI Advisor
          </>
        )}
      </button>
    </>
  )
}
