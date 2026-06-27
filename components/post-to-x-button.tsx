"use client"

import { useState } from "react"

function twitterLen(text: string) {
  return text.replace(/https?:\/\/\S+/g, (u) => "x".repeat(Math.min(u.length, 23))).length
}

export default function PostToXButton({ atpId }: { atpId: string; athleteName: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "preview" | "done" | "error">("idle")
  const [posting, setPosting] = useState(false)
  const [previewText, setPreviewText] = useState("")
  const [extraTags, setExtraTags] = useState("")
  const [error, setError] = useState("")

  // Build the full tweet text including any extra tags
  function fullText() {
    const tags = extraTags.trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(t => t.startsWith("@") ? t : `@${t}`)
      .join(" ")
    return tags ? `${previewText}\n${tags}` : previewText
  }

  async function handlePreview() {
    setStatus("loading")
    setError("")
    setExtraTags("")
    try {
      const res = await fetch("/api/admin/post-to-x", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ atpId, preview: true }),
      }).then(r => r.json())

      if (res.success) {
        setPreviewText(res.text)
        setStatus("preview")
      } else {
        setError(res.error || "Failed to load preview")
        setStatus("error")
      }
    } catch {
      setError("Network error — check your connection")
      setStatus("error")
    }
  }

  async function handlePost() {
    setPosting(true)
    try {
      const res = await fetch("/api/admin/post-to-x", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ atpId, extraTags: extraTags.trim() || undefined }),
      }).then(r => r.json())

      if (res.success) {
        setPosting(false)
        setStatus("done")
        setTimeout(() => setStatus("idle"), 8000)
      } else {
        setPosting(false)
        setError(res.error || "Failed to post")
        setStatus("error")
      }
    } catch {
      setPosting(false)
      setError("Network error — check your connection")
      setStatus("error")
    }
  }

  if (status === "done") return (
    <span className="text-xs bg-sky-900/60 border border-sky-700/50 text-sky-300 px-3 py-2 rounded-xl font-semibold">
      ✓ Posted to @PolyRISEFB
    </span>
  )

  if (status === "error") return (
    <span className="flex items-center gap-2 text-xs bg-red-900/60 border border-red-700/50 text-red-300 px-3 py-2 rounded-xl font-semibold">
      ✕ {error}
      <button onClick={() => setStatus("idle")} className="text-red-400 hover:text-white ml-1 font-bold">✕</button>
    </span>
  )

  const tweet = fullText()
  const charCount = twitterLen(tweet)
  const over = charCount > 280

  return (
    <>
      <button
        onClick={handlePreview}
        disabled={status === "loading"}
        className="bg-sky-700 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors"
      >
        {status === "loading" ? "Loading…" : "𝕏 Post to X"}
      </button>

      {/* Preview modal */}
      {status === "preview" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-white font-bold text-base">Preview — @PolyRISEFB</p>
              <button onClick={() => setStatus("idle")} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
            </div>

            {/* Tag others */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold">Tag additional accounts <span className="text-gray-600 font-normal">(optional — separate with spaces or commas)</span></label>
              <input
                value={extraTags}
                onChange={e => setExtraTags(e.target.value)}
                placeholder="@CoachSmith, @RecruitingU, @TXHSFB"
                className="w-full bg-gray-900 border border-gray-700 focus:border-sky-500 focus:outline-none rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600"
              />
            </div>

            {/* Tweet mockup */}
            <div className="bg-black border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-sky-700 flex items-center justify-center text-white text-xs font-bold">P</div>
                <div>
                  <p className="text-white text-sm font-bold leading-tight">PolyRISE Athletix</p>
                  <p className="text-gray-500 text-xs">@PolyRISEFB</p>
                </div>
              </div>
              <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">{tweet}</p>
              <p className={`text-xs mt-3 font-semibold ${over ? "text-red-400" : "text-gray-600"}`}>
                {charCount} / 280 characters{over ? " — TOO LONG" : ""}
              </p>
            </div>

            <p className="text-gray-500 text-xs">This is exactly what will be posted to X. Review it before confirming.</p>

            <div className="flex gap-3">
              <button
                onClick={() => setStatus("idle")}
                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 text-sm font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={over || posting}
                className="flex-1 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
              >
                {posting ? "Posting…" : "✓ Post to X"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
