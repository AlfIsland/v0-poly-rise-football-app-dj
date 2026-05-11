"use client"

import { useState } from "react"

interface Props {
  profileUrl: string
  emailTemplate: string
  emailSubject: string
}

export default function ShareProfileCard({ profileUrl, emailTemplate, emailSubject }: Props) {
  const [linkCopied, setLinkCopied] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const [showTemplate, setShowTemplate] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(profileUrl)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2500)
  }

  function copyEmail() {
    navigator.clipboard.writeText(emailTemplate)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2500)
  }

  function nativeShare() {
    if (navigator.share) {
      navigator.share({ title: emailSubject, url: profileUrl })
    } else {
      copyLink()
    }
  }

  const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailTemplate)}`

  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-blue-500 rounded-full" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Share This Profile</h2>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 ml-3.5">
          Send your recruiting profile directly to college coaches
        </p>
      </div>

      <div className="p-5 space-y-4">

        {/* Profile link */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Profile Link</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 min-w-0">
              <p className="text-xs text-gray-300 font-mono truncate">{profileUrl}</p>
            </div>
            <button
              onClick={copyLink}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                linkCopied
                  ? "bg-green-700 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              {linkCopied ? "✓ Copied!" : "Copy"}
            </button>
            <button
              onClick={nativeShare}
              className="shrink-0 px-3 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              title="Share"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Coach email template */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Coach Email Template</p>
          <p className="text-xs text-gray-600 mb-3">
            Ready to send — just add the coach&apos;s name and email address.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyEmail}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                emailCopied
                  ? "bg-green-700 text-white"
                  : "bg-blue-700 hover:bg-blue-600 text-white"
              }`}
            >
              {emailCopied ? (
                <>✓ Copied to Clipboard</>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 000 2h2a1 1 0 100-2H8z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy Email Template
                </>
              )}
            </button>
            <a
              href={mailtoLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Open in Email App
            </a>
            <button
              onClick={() => setShowTemplate(v => !v)}
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm font-semibold transition-colors border border-gray-700"
            >
              {showTemplate ? "Hide" : "Preview"}
            </button>
          </div>

          {/* Template preview */}
          {showTemplate && (
            <div className="mt-3 bg-gray-800 border border-gray-700 rounded-xl p-4">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                {emailTemplate}
              </pre>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
