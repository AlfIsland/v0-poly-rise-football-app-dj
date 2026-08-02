import Image from "next/image"
import Link from "next/link"

export default function LockedProfilePage({ athleteId }: { athleteId: string }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Header */}
      <header className="border-b border-white/10 bg-black px-4 py-3 flex items-center gap-3">
        <Image src="/poly-rise-logo.png" alt="PolyRISE Athletix" width={32} height={32} className="object-contain" />
        <div>
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest">PolyRISE Athletix</p>
          <p className="text-xs text-gray-500">Athlete Recruiting Profile</p>
        </div>
      </header>

      {/* Lock page body */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">

          {/* Lock icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div>
            <h1 className="text-2xl font-black text-white mb-2">This Profile is Private</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              This athlete&apos;s recruiting profile is currently set to private. Only the athlete and their PolyRISE coaching staff can view this page.
            </p>
          </div>

          {/* Profile ID chip */}
          <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
            <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
            <span className="text-xs text-gray-500 font-mono">{athleteId}</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/athlete/login"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              Sign In to Your Profile
            </Link>
            <a href="mailto:polyrise@polyrisefootball.com"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
              Contact PolyRISE
            </a>
          </div>

          <p className="text-xs text-gray-600">
            Are you a recruiter or coach? Email{" "}
            <a href="mailto:polyrise@polyrisefootball.com" className="text-red-500 hover:text-red-400 transition-colors">
              polyrise@polyrisefootball.com
            </a>{" "}
            for access.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/poly-rise-logo.png" alt="PolyRISE" width={20} height={20} className="object-contain opacity-40" />
          <p className="text-xs text-gray-600">PolyRISE Athletix · polyrisefootball.com</p>
        </div>
        <Link href="/plans" className="text-xs text-gray-600 hover:text-gray-400 underline transition-colors">
          Join PolyRISE →
        </Link>
      </footer>
    </div>
  )
}
