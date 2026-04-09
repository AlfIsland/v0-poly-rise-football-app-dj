"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";

const SUGGESTIONS = [
  "What programs do you offer?",
  "How much does it cost?",
  "What ages do you train?",
  "How do I register?",
  "What is PR-VERIFIED?",
  "Tell me about coaches",
  "Summer camp info",
  "Girls program?",
];

const GREETING =
  "Hey! Welcome to PolyRISE Football! I'm here to help with any questions about our programs, coaches, camps, tournaments, or recruiting. What can I help you with today?";

// Helper to extract text from UIMessage parts
function getMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!msg.parts) return "";
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && !!p.text)
    .map((p) => p.text)
    .join("");
}

export default function PolyRiseAgent() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function handleSend(text: string) {
    if (!text.trim() || isLoading) return;
    sendMessage({ text: text.trim() });
    setInput("");
  }

  function resetChat() {
    setMessages([]);
  }

  return (
    <div className="bg-gray-50 h-full">
      <div className="w-full bg-white flex flex-col overflow-hidden h-full">

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            PR
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-900">PolyRISE Football Support</div>
            <div className="text-xs text-green-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>
              Agent 1 - Online
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
              onClick={() => handleSend(s)}
              disabled={isLoading}
              className="text-xs px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3 bg-gray-50">
          {/* Greeting if no messages */}
          {messages.length === 0 && (
            <div className="flex flex-col items-start">
              <div className="text-xs text-gray-400 mb-1">PolyRISE Support</div>
              <div className="px-3 py-2 rounded-xl text-sm leading-relaxed max-w-xs whitespace-pre-wrap break-words bg-white border border-gray-200 text-gray-900 rounded-bl-sm">
                {GREETING}
              </div>
            </div>
          )}
          {messages.map((msg) => {
            const text = getMessageText(msg);
            if (!text) return null;
            return (
              <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
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
                  {text}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isLoading && (
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
              {error.message || "Something went wrong. Please try again."}
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
                handleSend(input);
              }
            }}
            placeholder="Ask anything about PolyRISE..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-600 focus:bg-white disabled:opacity-50 placeholder-gray-400"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-green-800 text-white hover:bg-green-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
