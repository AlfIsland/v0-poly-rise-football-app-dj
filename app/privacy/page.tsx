import Link from "next/link"
import Image from "next/image"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-red-600">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Athletix" width={48} height={48} className="object-contain" />
          <div>
            <p className="text-xs font-bold text-red-600 uppercase tracking-widest">PolyRISE Athletix</p>
            <h1 className="text-2xl font-black text-gray-900">Privacy Policy</h1>
            <p className="text-gray-400 text-xs mt-0.5">Effective Date: April 26, 2026 · Last Updated: April 26, 2026</p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <p>
              PolyRISE Athletix (&quot;PolyRISE,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy.
              This Privacy Policy explains what information we collect, how we use it, and your rights regarding
              your data when you use <strong>polyrisefootball.com</strong> and all related services (the &quot;Platform&quot;).
            </p>
            <p className="mt-3">
              By using the Platform, you agree to the collection and use of information as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">1. Information We Collect</h2>

            <h3 className="font-bold text-gray-900 mb-1">Information You Provide Directly</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong>Parent/Guardian:</strong> Full name, email address, phone number, password</li>
              <li><strong>Athlete:</strong> Full name, age, grade, school, position, sport</li>
              <li><strong>Performance Data:</strong> 40-yard dash, vertical jump, broad jump, shuttle times, bench press, weight, and other combine metrics recorded at PolyRISE camps</li>
              <li><strong>Photos:</strong> Athlete profile photos you choose to upload</li>
              <li><strong>Athlete ID:</strong> TRN-XXXX identifier assigned by PolyRISE staff</li>
              <li><strong>Payment Information:</strong> Processed securely by Stripe — we do not store credit card numbers</li>
            </ul>

            <h3 className="font-bold text-gray-900 mb-1">Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Session cookies used for authentication (your login state)</li>
              <li>General usage data such as pages visited and features used</li>
              <li>Device and browser type for platform compatibility</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To create and manage your parent account and athlete profile</li>
              <li>To display performance metrics, progress charts, and session history in your portal</li>
              <li>To generate PR-VERIFIED seals and public recruiting profiles</li>
              <li>To power recruiting tools including the School Fit Finder, Coach Outreach Templates, and Recruiting Roadmap</li>
              <li>To process subscription payments through Stripe</li>
              <li>To send transactional emails such as password resets and subscription confirmations</li>
              <li>To notify PolyRISE staff of new registrations so athlete profiles can be linked</li>
              <li>To improve the Platform and develop new features</li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> sell your personal information to third parties. We do not use your
              data for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">3. Public Recruiting Profiles</h2>
            <p>
              For Recruit and Elite Recruit subscribers, athlete recruiting profiles are accessible at a public URL
              (<strong>polyrisefootball.com/athlete/[ID]</strong>). These profiles display:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Athlete name, position, grade, and school</li>
              <li>Performance metrics and progress data</li>
              <li>Hudl film link (if provided)</li>
              <li>PR-VERIFIED seal (if issued)</li>
              <li>PolyRISE contact information for coach inquiries</li>
            </ul>
            <p className="mt-3">
              Public profiles are intentional — they are designed to be shared with college coaches for
              recruiting purposes. If you wish to make a profile private or remove it, contact us at
              polyrise@polyrisefootball.com.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">4. Children&apos;s Privacy (COPPA)</h2>
            <p>
              The Platform is designed for use by parents and guardians on behalf of student athletes.
              We do not knowingly collect personal information directly from children under 13 years of age.
              All accounts must be created by a parent or guardian who is at least 18 years old.
            </p>
            <p className="mt-3">
              Parents may submit athlete data — including performance metrics and photos — for minor athletes
              in their care. By doing so, you represent that you have the legal authority to provide this
              information on behalf of the minor.
            </p>
            <p className="mt-3">
              If you believe a child under 13 has had information submitted without proper parental consent,
              contact us immediately at polyrise@polyrisefootball.com.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">5. Data Storage & Security</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data is stored securely using Redis (encrypted at rest) hosted on Upstash infrastructure</li>
              <li>Athlete photos are stored on Vercel Blob storage with public URLs</li>
              <li>Passwords are hashed using bcrypt — we never store plain-text passwords</li>
              <li>All connections to the Platform use HTTPS/TLS encryption</li>
              <li>Payment data is handled exclusively by Stripe and never stored on our servers</li>
              <li>Admin access is protected by session-based authentication with secure, HTTP-only cookies</li>
            </ul>
            <p className="mt-3">
              While we implement industry-standard security measures, no system is completely secure.
              We cannot guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">6. Third-Party Services</h2>
            <p>We use the following third-party services to operate the Platform:</p>
            <div className="mt-3 space-y-3">
              {[
                { name: "Stripe", purpose: "Payment processing and subscription management", link: "stripe.com/privacy" },
                { name: "Vercel", purpose: "Platform hosting and file storage", link: "vercel.com/legal/privacy-policy" },
                { name: "Upstash / Redis", purpose: "Secure database storage", link: "upstash.com/privacy" },
                { name: "Resend", purpose: "Transactional email delivery", link: "resend.com/privacy" },
                { name: "Hudl", purpose: "Athlete film links (external — not hosted by PolyRISE)", link: "hudl.com/privacy" },
              ].map(s => (
                <div key={s.name} className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <div>
                    <p className="font-bold text-gray-900 text-xs">{s.name}</p>
                    <p className="text-gray-600 text-xs">{s.purpose}</p>
                    <p className="text-gray-400 text-xs">{s.link}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3">
              These providers have their own privacy policies. We are not responsible for their data practices.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">7. Cookies</h2>
            <p>
              We use session cookies solely for authentication purposes — to keep you logged in to your
              parent portal or admin account. We do not use tracking cookies, advertising cookies, or
              third-party analytics cookies.
            </p>
            <p className="mt-3">
              Session cookies expire after 14 days or when you sign out, whichever comes first.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">8. Your Rights & Choices</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Portability:</strong> Request your athlete&apos;s performance data in a readable format</li>
              <li><strong>Profile removal:</strong> Request removal of your athlete&apos;s public recruiting profile</li>
              <li><strong>Cancellation:</strong> Cancel your subscription at any time through your portal</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at <strong>polyrise@polyrisefootball.com</strong> or call
              (817) 658-3300. We will respond within 10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">9. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. If you cancel your
              subscription or request account deletion, we will delete your personal data within 30 days,
              except where we are required to retain it by law (e.g., financial records for tax purposes).
            </p>
            <p className="mt-3">
              Athlete performance records may be retained in anonymized form for internal benchmarking purposes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the
              &quot;Last Updated&quot; date at the top of this page. Continued use of the Platform after
              changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">11. Contact Us</h2>
            <p>For any privacy questions, data requests, or concerns:</p>
            <div className="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="font-bold text-gray-900">PolyRISE Athletix</p>
              <p>Dripping Springs, Texas</p>
              <p>(817) 658-3300</p>
              <p>polyrise@polyrisefootball.com</p>
              <p>polyrisefootball.com</p>
            </div>
          </section>

        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} PolyRISE Athletix. All rights reserved.</p>
          <Link href="/terms" className="text-red-600 hover:text-red-700 font-semibold">Terms of Service →</Link>
        </div>

      </div>
    </div>
  )
}
