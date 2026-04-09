"use client";

import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are the official customer support agent for PolyRISE Football — elite youth football training in Dripping Springs, Texas (Austin area), founded by NFL veteran Coach Kevin Garrett.

PERSONALITY: Warm, enthusiastic, and conversational. Speak like a knowledgeable coach who genuinely cares about young athletes. Never robotic or scripted.

RESPONSE RULES:
- Keep each reply to 2-4 sentences. Answer only what was asked.
- Ask ONE natural follow-up question to keep the conversation going.
- Never dump all information at once — respond to what the person actually asked.
- Guide interested families toward registering or calling.

PROGRAMS & PRICING:
- Player Development: $350/mo — Tue & Thu 6:30–7:45pm, 16 sessions/month, SAQ, S&C, football drills, film study, quarterly military character events, tournament entries
- 360 Elite: $500/mo — Everything in Player Dev PLUS 1-on-1 NFL coaching, recruiting profile, 7 college email blasts/month, weekly film study, unlimited free camps, college visits, NIL & financial literacy classes
- Girls Player Development: $250/mo — Mon & Fri 5–6:30pm (May); Mon & Fri 1–2:30pm (June & July)
- Summer Camp: $265/mo — K-5 / Middle / High School tracks, Mon–Thu, June & July, LIMITED to 20 spots per group
- PR-VERIFIED Combine Camp: $50/athlete
- Leadership Hike: $25 at Barton Springs Rd, Austin
- Rise of Warriors Tournament: MS May 29 $400/team | HS May 30 $425/team (min 3 games, single elim)

RECRUITING (Coach Kevin Garrett — KG@polyrisefootball.com):
- Basic: profile + 5 college emails/mo → 3mo $165 | 6mo $330 | 12mo $660
- Enhanced: profile + 10 college emails/mo → 3mo $225 | 6mo $450 | 12mo $900

COACHES:
- Head Coach Garrett (DB): 7 yrs NFL (Rams, Texans), drafted 2003 from SMU
- Coach Jordan (WR/TE): XFL Draft 2022, 2x Omaha Beef Champion, HCU Asst WR Coach
- Coach Traves (RB/S): Former Navy Safety & LB, Citadel Football
- Coach John (QB): Former Navy QB, Naval Academy Graduate & Officer
- Coach Brayden (LB/DL): Baylor 2018–21, NFL Draft 2023, IFL All-Pro & Champion 2025

PR-VERIFIED SEAL: Pro-style combine testing (40yd dash, vertical, broad jump, 3-cone, 5-10-5 shuttle, position drills). All metrics verified on-site by NFL/college-experienced staff. Athletes get official documentation + digital badge for recruiting profiles. No self-reported numbers.

WHO WE SERVE: K-12 athletes, Austin & Central Texas. Expanding nationwide.

CONTACT:
- Phone/WhatsApp: (817) 658-3300
- Email: polyrise7v7@gmail.com
- Website: polyrisefootball.com
- Register: polyrisefootball.com/#register
- Recruiting: KG@polyrisefootball.com

ESCALATION: Recruiting questions → KG@polyrisefootball.com. Anything complex → (817) 658-3300.`;

const SUGGESTIONS = [
  "What programs do you offer?",
  "How much does it cost?",
  "What ages do you train?",
  "How do I register?",
  "What is the PR-VERIFIED seal?",
  "Tell me about your coaches",
  "When is the Rise of Warriors tournament?",
  "Do you have a girls program?",
  "How does recruiting work?",
];

const GREETING =
  "Hey! Welcome to PolyRISE Football! I'm here to help with any questions about our programs, coaches, camps, tournaments, or recruiting. What can I help you with today?";

export default function PolyRiseAgent() {
  const [savedKey, setSavedKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function saveKey() {
    if (!keyInput.trim()) return;
    setSavedKey(keyInput.trim());
    setError("");
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    if (!savedKey) {
      setError("Please enter your Anthropic API key above first.");
      return;
    }

    const userMsg = { role: "user", content: text.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": savedKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages: newHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || `Error ${response.status}`);
      }

      const reply = data.content
        .filter((b: { type: string }) => b.type === "text")
        .map((b: { text: string }) => b.text)
        .join("")
        .trim();

      setMessages([...newHistory, { role: "assistant", content: reply }]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function resetChat() {
    setMessages([{ role: "assistant", content: GREETING }]);
    setError("");
  }

  return (
    <div className="bg-gray-50 h-full">
      <div className="w-full bg-white flex flex-col overflow-hidden h-full">

        {/* API Key Banner */}
        {!savedKey && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center gap-2">
            <span className="text-xs text-yellow-800 font-medium whitespace-nowrap">API Key:</span>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveKey()}
              placeholder="sk-ant-..."
              className="flex-1 text-xs px-2 py-1 rounded border border-yellow-300 bg-white font-mono focus:outline-none focus:border-yellow-500"
            />
            <button
              onClick={saveKey}
              className="text-xs px-3 py-1 rounded bg-green-700 text-white font-medium hover:bg-green-800"
            >
              Save
            </button>
          </div>
        )}

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            PR
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-900">PolyRISE Football Support</div>
            <div className="text-xs text-green-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>
              Agent 1 · Online
            </div>
          </div>
          <button
            onClick={resetChat}
            className="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            New chat
          </button>
        </div>

        {/* Suggestions */}
        <div className="px-3 py-2 border-b border-gray-100 flex flex-wrap gap-1.5 bg-gray-50">
          {SUGGESTIONS.slice(0, 5).map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              disabled={loading || !savedKey}
              className="text-xs px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40"
            >
              {s.replace("?", "").replace("Tell me about your ", "").replace("When is the ", "").replace("Do you have a ", "").replace("How does ", "").replace(" work", "")}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className="text-xs text-gray-400 mb-1">
                {msg.role === "user" ? "You" : "PolyRISE Support"}
              </div>
              <div
                className={`px-3 py-2 rounded-xl text-sm leading-relaxed max-w-xs whitespace-pre-wrap break-words ${
                  msg.role === "user"
                    ? "bg-green-800 text-green-50 rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex flex-col items-start">
              <div className="text-xs text-gray-400 mb-1">PolyRISE Support</div>
              <div className="bg-white border border-gray-200 rounded-xl rounded-bl-sm px-3 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block animate-bounce"
                    style={{ animationDelay: `${i * 0.13}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask anything about PolyRISE..."
            disabled={loading}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-600 focus:bg-white disabled:opacity-50 placeholder-gray-400"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim() || !savedKey}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-green-800 text-white hover:bg-green-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
