"use client"

import { useState, useRef, useEffect } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

const QUICK_PROMPTS = [
  "What is PR-VERIFIED?",
  "Programs & pricing",
  "Which plan fits us?",
  "How to register",
]

function formatText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>")
}

export default function AdvisorBubble() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [quickDismissed, setQuickDismissed] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [open, messages])

  async function send(text: string) {
    if (!text.trim() || loading) return
    setQuickDismissed(true)
    const next: Message[] = [...messages, { role: "user", content: text }]
    setMessages(next)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      const reply = data.reply || "I'm having trouble connecting right now. Please call (817) 658-3300 or email polyrise@polyrisefootball.com!"
      setMessages(m => [...m, { role: "assistant", content: reply }])
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Connection issue — please reach us at (817) 658-3300 or polyrise@polyrisefootball.com." }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: "88px", left: "24px",
          width: "340px", height: "520px",
          zIndex: 9998, borderRadius: "16px", overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          display: "flex", flexDirection: "column",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}>

          {/* Header */}
          <div style={{ background: "#1A6B3A", padding: "14px 16px", flexShrink: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏈</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>PolyRISE AI Advisor</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                Online — Ask me anything
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", background: "#f7f8fa", display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Welcome message */}
            {messages.length === 0 && (
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1A6B3A", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>PR</div>
                <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "4px 14px 14px 14px", padding: "10px 13px", fontSize: 13, lineHeight: 1.6, color: "#0d1b2a", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", maxWidth: "88%" }}>
                  Hey! I'm the <strong>PolyRISE AI Recruiting Advisor</strong>.<br /><br />
                  Whether you're a parent getting started or an athlete building a college profile, I've got answers. What can I help you with?
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1A6B3A", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>PR</div>
                )}
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "10px 13px",
                    borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                    background: m.role === "user" ? "#1A6B3A" : "#fff",
                    color: m.role === "user" ? "#fff" : "#0d1b2a",
                    fontSize: 13, lineHeight: 1.6,
                    border: m.role === "assistant" ? "1px solid rgba(0,0,0,0.08)" : "none",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                  dangerouslySetInnerHTML={{ __html: formatText(m.content) }}
                />
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1A6B3A", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>PR</div>
                <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "4px 14px 14px 14px", padding: "12px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 180, 360].map(d => (
                    <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#9ca3af", display: "inline-block", animation: "pr-blink 1.3s infinite ease-in-out", animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {!quickDismissed && (
            <div style={{ padding: "8px 10px", borderTop: "1px solid rgba(0,0,0,0.08)", background: "#fff", display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
              {QUICK_PROMPTS.map(q => (
                <button key={q} onClick={() => send(q)}
                  style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.14)", background: "#f7f8fa", cursor: "pointer", color: "#4a5568", fontFamily: "inherit" }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.08)", background: "#fff", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input) } }}
              placeholder="Ask about programs, pricing, recruiting…"
              maxLength={400}
              style={{ flex: 1, padding: "9px 13px", fontSize: 13, borderRadius: 24, border: "1px solid rgba(0,0,0,0.14)", background: "#f7f8fa", color: "#0d1b2a", outline: "none", fontFamily: "inherit" }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              style={{ width: 36, height: 36, borderRadius: "50%", background: !input.trim() || loading ? "#d1d5db" : "#1A6B3A", border: "none", cursor: !input.trim() || loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>

          {/* Footer */}
          <div style={{ padding: "5px 12px", textAlign: "center", background: "#fff", borderTop: "1px solid rgba(0,0,0,0.06)", flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: "#9ca3af" }}>Powered by AI · <a href="https://polyrisefootball.com" style={{ color: "#1A6B3A", textDecoration: "none", fontWeight: 500 }}>polyrisefootball.com</a></span>
          </div>
        </div>
      )}

      {/* Typing animation */}
      <style>{`@keyframes pr-blink { 0%,60%,100%{transform:translateY(0);opacity:.5} 30%{transform:translateY(-4px);opacity:1} }`}</style>

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close AI Advisor" : "Open AI Advisor"}
        style={{
          position: "fixed", bottom: "24px", left: "24px", zIndex: 9999,
          display: "flex", alignItems: "center", gap: "8px",
          background: open ? "#124d2a" : "#1A6B3A",
          color: "#fff", border: "none", padding: "12px 18px",
          borderRadius: "30px", fontSize: "13px", fontWeight: 600,
          cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          transition: "background 0.2s, transform 0.15s",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open
          ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg> Close</>
          : <>🏈 Ask AI Advisor</>
        }
      </button>
    </>
  )
}
