"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

const GREETING = "Hey! Welcome to PolyRISE Football! I'm here to help with any questions about our programs, coaches, camps, tournaments, or recruiting. What can I help you with today?"

const SUGGESTIONS = [
  "What programs do you offer?",
  "How much does it cost?",
  "What ages do you train?",
  "What is the PR-VERIFIED seal?",
  "Tell me about the coaches",
  "How do I register?",
  "Do you have a girls program?",
  "How does recruiting work?",
]

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: GREETING }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    setShowSuggestions(false)
    const userMsg: Message = { role: "user", content: text.trim() }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setInput("")
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || "Failed")
      setMessages([...newHistory, { role: "assistant", content: data.reply }])
    } catch {
      setError("Something went wrong. Please try again or call (817) 658-3300.")
    }
    setLoading(false)
  }

  function resetChat() {
    setMessages([{ role: "assistant", content: GREETING }])
    setShowSuggestions(true)
    setError("")
    setInput("")
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg flex items-center justify-center transition-all"
        aria-label="Chat with PolyRISE"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: "520px" }}>

          {/* Header */}
          <div className="bg-gray-950 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <Image src="/poly-rise-logo.png" alt="PolyRISE" width={32} height={32} className="object-contain rounded-full" />
            <div className="flex-1">
              <p className="text-white text-sm font-bold">PolyRISE Football</p>
              <p className="text-green-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online · Replies instantly
              </p>
            </div>
            <button onClick={resetChat} className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded border border-gray-700">
              Reset
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  msg.role === "user"
                    ? "bg-red-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm shadow-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Suggestion chips — only show initially */}
            {showSuggestions && messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)} disabled={loading}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors disabled:opacity-40">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 shadow-sm">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 rounded-full bg-gray-400 inline-block"
                      style={{ animation: `chatBounce 0.8s infinite ${i * 0.13}s` }} />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
              placeholder="Ask anything about PolyRISE..."
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-red-500 focus:bg-white disabled:opacity-50 placeholder-gray-400"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatBounce {
          0%, 80%, 100% { transform: scale(1); opacity: 0.4; }
          40% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </>
  )
}
