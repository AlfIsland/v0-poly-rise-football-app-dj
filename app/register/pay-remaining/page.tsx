"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"

function PayRemainingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get("id")

  useEffect(() => {
    if (!id) { router.push("/register"); return }
    fetch("/api/register/checkout-remaining", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.url) {
          window.location.href = data.url
        } else {
          // No one-time items remaining — go to success
          router.push(`/register/success?id=${id}`)
        }
      })
      .catch(() => router.push(`/register/success?id=${id}`))
  }, [id, router])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 gap-4 text-center">
      <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={60} height={60} className="object-contain" />
      <p className="text-white font-semibold">Monthly subscription confirmed!</p>
      <p className="text-gray-400 text-sm">Setting up your one-time payment now...</p>
      <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mt-2" />
    </div>
  )
}

export default function PayRemainingWrapper() {
  return <Suspense><PayRemainingPage /></Suspense>
}
