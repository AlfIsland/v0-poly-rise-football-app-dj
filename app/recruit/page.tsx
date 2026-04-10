"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const GREETING = "Hey there! I'm the PolyRISE recruiting assistant. I'd love to help find the perfect program for your athlete. To start — what's your athlete's name and how old are they?"

const SUGGESTIONS = [
  "My son is 12 and wants to get faster",
  "Looking for high school recruiting help",
  "Interested in the girls program",
  "Want to try a camp first",
  "Tell me about 360 Elite",
  "My team needs off-season training",
]

interface Message { role: "user" | "assistant"; content: string }
interface LeadData { name?: string; age?: string; program?: string; email?: string }

export default function RecruitPage() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: GREETING }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [leadData, setLeadData] = useState<LeadData>({})
  const [leadCaptured, setLeadCaptured] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  // Extract lead info from conversation
  useEffect(() => {
    const allText = messages.map(m => m.content).join(" ")
    const lower = allText.toLowerCase()
    const newLead: LeadData = { ...leadData }

    const ageMatch = lower.match(/(\d+)\s*(year|yr|grade|yo|years old)/)
    if (ageMatch && !newLead.age) newLead.age = ageMatch[1]

    const nameMatch = allText.match(/(?:name is|i'm|my son|my daughter|athlete is)\s+([A-Za-z]+)/i)
    if (nameMatch && !newLead.name) newLead.name = nameMatch[1]

    if (lower.includes("360 elite") && !newLead.program) newLead.program = "360 Elite"
    else if (lower.includes("summer camp") && !newLead.program) newLead.program = "Summer Camp"
    else if (lower.includes("girls") && !newLead.program) newLead.program = "Girls Program"
    else if (lower.includes("player development") && !newLead.program) newLead.program = "Player Development"
    else if (lower.includes("recruiting") && !newLead.program) newLead.program = "Recruiting Package"

    const emailMatch = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    if (emailMatch && !newLead.email) { newLead.email = emailMatch[0]; setLeadCaptured(true) }

    setLeadData(newLead)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

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
      const res = await fetch("/api/lead-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error)
      setMessages([...newHistory, { role: "assistant", content: data.reply }])
    } catch {
      setError("Something went wrong. Please call us at (817) 658-3300.")
    }
    setLoading(false)
  }

  function resetChat() {
    setMessages([{ role: "assistant", content: GREETING }])
    setLeadData({})
    setLeadCaptured(false)
    setShowSuggestions(true)
    setError("")
    setInput("")
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Top bar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/poly-rise-logo.png" alt="PolyRISE" width={36} height={36} className="object-contain" />
          <div>
            <p className="font-bold text-white text-sm">PolyRISE Football</p>
            <p className="text-xs text-gray-500">Dripping Springs & Austin, TX</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="tel:+18176583300" className="text-xs text-gray-400 hover:text-white">(817) 658-3300</a>
          <Link href="/" className="text-xs text-gray-600 hover:text-gray-400 underline">← Home</Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden max-w-6xl mx-auto w-full p-4 md:p-6 gap-6">

        {/* Chat */}
        <div className="flex-1 flex flex-col bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden min-h-0">

          {/* Chat header */}
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">PR</div>
              <div>
                <p className="text-sm font-semibold text-white">PolyRISE Recruiting Assistant</p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Online · Replies instantly
                </p>
              </div>
            </div>
            <button onClick={resetChat} className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1 rounded-lg border border-gray-700">
              New chat
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  msg.role === "user"
                    ? "bg-red-600 text-white rounded-br-sm"
                    : "bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Suggestion chips */}
            {showSuggestions && messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)} disabled={loading}
                    className="text-xs px-3 py-2 rounded-full border border-gray-700 bg-gray-800 text-gray-400 hover:bg-red-900/40 hover:border-red-700 hover:text-red-300 transition-colors disabled:opacity-40">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 rounded-full bg-gray-500 inline-block"
                      style={{ animation: `leadBounce 0.8s infinite ${i * 0.13}s` }} />
                  ))}
                </div>
              </div>
            )}

            {error && <div className="text-xs text-red-400 bg-red-950 border border-red-800 rounded-xl px-3 py-2">{error}</div>}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-4 border-t border-gray-800 flex gap-2 flex-shrink-0">
            <input ref={inputRef} type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
              placeholder="Tell us about your athlete..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-red-500 disabled:opacity-50 placeholder-gray-500" />
            <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Send
            </button>
          </div>
        </div>

        {/* Sidebar — desktop only */}
        <div className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0">

          {/* Lead Profile */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Lead Profile</p>
            {leadCaptured && (
              <div className="mb-3 px-3 py-1.5 rounded-lg bg-green-900/40 border border-green-800 text-xs text-green-400 font-semibold">
                ✓ Lead captured
              </div>
            )}
            <div className="space-y-3">
              {([
                { label: "Name", value: leadData.name },
                { label: "Age", value: leadData.age ? `${leadData.age} yrs` : undefined },
                { label: "Program Interest", value: leadData.program },
                { label: "Email", value: leadData.email },
              ] as { label: string; value?: string }[]).map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-600 mb-0.5">{label}</p>
                  <p className={`text-sm font-semibold ${value ? "text-white" : "text-gray-700"}`}>{value || "—"}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-600 mb-1">Messages exchanged</p>
              <p className="text-2xl font-black text-white">{messages.length - 1}</p>
            </div>
          </div>

          {/* Urgency */}
          <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-5">
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Filling Fast</p>
            <div className="space-y-2.5 text-xs text-red-300">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                Summer Camp — max 20 spots
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                Rise of Warriors — MS May 29
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                Girls program — active now
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Ready to Join?</p>
            <div className="space-y-2">
              <Link href="/register"
                className="block text-center text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2.5 rounded-xl transition-colors">
                Register Now
              </Link>
              <a href="tel:+18176583300"
                className="block text-center text-xs border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white px-3 py-2.5 rounded-xl transition-colors">
                Call (817) 658-3300
              </a>
              <a href="mailto:polyrise7v7@gmail.com"
                className="block text-center text-xs border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white px-3 py-2.5 rounded-xl transition-colors">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes leadBounce {
          0%, 80%, 100% { transform: scale(1); opacity: 0.4; }
          40% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
