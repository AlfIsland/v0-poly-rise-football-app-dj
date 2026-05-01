"use client"

import { useState } from "react"

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <button onClick={copyLink}
      className="text-xs bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 px-4 py-2 rounded-xl transition-colors font-semibold whitespace-nowrap">
      {copied ? "✓ Copied!" : "Copy Link"}
    </button>
  )
}
