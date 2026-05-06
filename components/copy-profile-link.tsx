"use client"

import { useState } from "react"

export default function CopyProfileLink({ athleteId }: { athleteId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `https://polyrisefootball.com/athlete/${athleteId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for browsers that block clipboard without user gesture
      prompt("Copy this link and send to your athlete:", url)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors whitespace-nowrap"
    >
      {copied ? (
        <>
          <span className="text-green-400">✓</span>
          Link Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Link
        </>
      )}
    </button>
  )
}
