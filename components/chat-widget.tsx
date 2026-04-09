"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import PolyRiseAgent from "./poly-rise-agent"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-full max-w-md animate-in slide-in-from-bottom-5 duration-300">
          <div className="relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <PolyRiseAgent />
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? "bg-gray-800 hover:bg-gray-700" 
            : "bg-[#006400] hover:bg-[#005000]"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </>
  )
}
