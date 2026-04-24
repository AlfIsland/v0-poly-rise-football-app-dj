"use client"

import { useState, useRef } from "react"
import Image from "next/image"

interface Props {
  athleteId: string
  athleteName: string
  currentPhotoUrl?: string | null
  onUploaded?: (url: string) => void
}

export default function AthletePhotoUpload({ athleteId, athleteName, currentPhotoUrl, onUploaded }: Props) {
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB."); return }

    setError("")
    setSuccess(false)
    setUploading(true)

    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("athleteId", athleteId)

    try {
      const res = await fetch("/api/athlete/photo", { method: "POST", body: formData })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        setPreview(data.url)
        onUploaded?.(data.url)
        setTimeout(() => setSuccess(false), 4000)
      } else {
        setError(data.error || "Upload failed.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    }
    setUploading(false)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Photo display */}
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-24 h-24 rounded-2xl bg-gray-800 border-2 border-dashed border-gray-600 hover:border-red-500 cursor-pointer overflow-hidden transition-colors group"
      >
        {preview ? (
          <>
            <Image src={preview} alt={athleteName} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-xs font-bold">Change</p>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="text-2xl">📷</span>
            <p className="text-gray-500 text-xs">Add Photo</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

      <div className="text-center">
        {success && <p className="text-green-400 text-xs font-bold">✓ Photo saved</p>}
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {!success && !error && (
          <p className="text-gray-600 text-xs">Click photo to upload · Max 5MB</p>
        )}
      </div>
    </div>
  )
}
