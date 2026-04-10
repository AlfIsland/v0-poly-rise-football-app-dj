"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface Registration {
  programName: string; playerName: string; parentName: string
  email: string; phone: string; amount: number; billing: string
}

function SuccessPage() {
  const [reg, setReg] = useState<Registration | null>(null)
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  useEffect(() => {
    if (!id) return
    fetch(`/api/register/confirmation?id=${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setReg(d.registration) })
  }, [id])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={60} height={60} className="object-contain" />
        </div>

        <div className="bg-green-950 border border-green-700 rounded-2xl p-8 space-y-4">
          <div className="text-5xl">✓</div>
          <h1 className="text-2xl font-bold text-green-300">Registration Complete!</h1>
          {reg ? (
            <div className="text-left bg-green-900/30 rounded-xl p-4 space-y-1.5 text-sm">
              <p><span className="text-green-500">Program:</span> <span className="text-white font-semibold">{reg.programName}</span></p>
              <p><span className="text-green-500">Player:</span> <span className="text-white">{reg.playerName}</span></p>
              <p><span className="text-green-500">Parent:</span> <span className="text-white">{reg.parentName}</span></p>
              <p><span className="text-green-500">Email:</span> <span className="text-white">{reg.email}</span></p>
              <p><span className="text-green-500">Amount:</span> <span className="text-white font-semibold">${reg.amount}{reg.billing === "monthly" ? "/month" : ""}</span></p>
            </div>
          ) : (
            <p className="text-green-400">Your registration has been received.</p>
          )}
          <p className="text-green-400 text-sm">A confirmation will be sent to your email. The PolyRISE staff will follow up with program details.</p>
        </div>

        <div className="space-y-2">
          <Link href="/register"
            className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-3 transition-colors text-sm">
            Register Another Program
          </Link>
          <p className="text-gray-600 text-xs">Questions? Call (817) 658-3300 or email polyrise7v7@gmail.com</p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPageWrapper() {
  return <Suspense><SuccessPage /></Suspense>
}
