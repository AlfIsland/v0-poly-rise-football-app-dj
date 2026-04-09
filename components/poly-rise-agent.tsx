"use client";

import { useState, useRef, useEffect } from "react";

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

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg = { role: "user", content: text.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          messages: newHistory.filter(m => m.role !== "assistant" || m.content !== GREETING),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Error ${response.status}`);
      }

      setMessages([...newHistory, { role: "assistant", content: data.message }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function resetChat() {
    setMessages([{ role: "assistant", content: GREETING }]);
    setError("");
  }

  return (
    <div className="bg-gray-50">
      <div className="w-full bg-white flex flex-col overflow-hidden" style={{ height: "500px" }}>

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
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              disabled={loading}
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
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"
                    style={{ animation: `bounce 0.8s infinite ${i * 0.13}s` }}
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
            disabled={loading || !input.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-green-800 text-white hover:bg-green-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>

      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(1); opacity: 0.4; }
          40% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
