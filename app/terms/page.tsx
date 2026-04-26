import Link from "next/link"
import Image from "next/image"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-red-600">
          <Image src="/poly-rise-logo.png" alt="PolyRISE Football" width={48} height={48} className="object-contain" />
          <div>
            <p className="text-xs font-bold text-red-600 uppercase tracking-widest">PolyRISE Football</p>
            <h1 className="text-2xl font-black text-gray-900">Terms of Service</h1>
            <p className="text-gray-400 text-xs mt-0.5">Effective Date: April 26, 2026 · Last Updated: April 26, 2026</p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the PolyRISE Football platform,
              including the website at <strong>polyrisefootball.com</strong>, the Athlete Training Passport (ATP),
              the Parent Portal, the PR-VERIFIED seal system, the School Fit Finder, Coach Outreach Templates,
              and all related services (collectively, the &quot;Platform&quot;).
            </p>
            <p className="mt-3">
              By creating an account, subscribing, or using any part of the Platform, you agree to be bound by
              these Terms. If you do not agree, do not use the Platform.
            </p>
            <p className="mt-3">
              The Platform is operated by <strong>PolyRISE Football</strong>, based in Dripping Springs, Texas
              (&quot;PolyRISE,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">1. Intellectual Property & Ownership</h2>
            <p>
              All content, features, tools, designs, source code, data structures, algorithms, branding, and
              technology comprising the Platform are the exclusive intellectual property of PolyRISE Football.
              This includes but is not limited to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>The <strong>PolyRISE Football</strong> name, logo, and brand identity</li>
              <li>The <strong>PR-VERIFIED</strong> seal system, verification codes, and associated technology</li>
              <li>The <strong>Athlete Training Passport (ATP)</strong> system and data presentation</li>
              <li>The <strong>School Fit Finder</strong> matching algorithm and benchmarks</li>
              <li>The <strong>Coach Outreach Templates</strong> and recruiting tools</li>
              <li>All software, databases, APIs, and platform architecture</li>
              <li>All written content, reports, and recruiting guides published on the Platform</li>
            </ul>
            <p className="mt-3">
              You may not copy, reproduce, reverse-engineer, redistribute, resell, or create derivative works
              based on any part of the Platform without express written permission from PolyRISE Football.
            </p>
            <p className="mt-3">
              &copy; {new Date().getFullYear()} PolyRISE Football. All rights reserved.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">2. Accounts & Eligibility</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years old to create a parent account and subscribe.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You agree to provide accurate, truthful information when registering.</li>
              <li>One account per parent or guardian. You may not share accounts.</li>
              <li>PolyRISE reserves the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">3. Subscriptions & Payments</h2>
            <p>
              Paid subscriptions are billed monthly through Stripe, a third-party payment processor. By subscribing, you authorize
              PolyRISE Football to charge your payment method on a recurring monthly basis.
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Passport — $9.99/month:</strong> Access to athlete metrics tracking, progress charts, and session history.</li>
              <li><strong>Recruit — $29.99/month:</strong> Full recruiting suite including PR-VERIFIED seal, recruiting profile, School Fit Finder, Coach Outreach Templates, and Camp Suggestions.</li>
              <li><strong>Elite Recruit — $49.99/month:</strong> Everything in Recruit plus quarterly Kevin Garrett development reports, prospect rankings, and early camp access.</li>
            </ul>
            <p className="mt-3">
              <strong>Cancellations:</strong> You may cancel your subscription at any time through your portal under &quot;Manage Billing.&quot;
              Access continues through the end of the current billing period. No partial refunds are issued.
            </p>
            <p className="mt-3">
              <strong>Refunds:</strong> All subscription fees are non-refundable except where required by applicable law.
              If you believe you were charged in error, contact us within 7 days at polyrise@polyrisefootball.com.
            </p>
            <p className="mt-3">
              PolyRISE Football reserves the right to change subscription pricing with 30 days&apos; notice.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">4. Athlete Data & Content</h2>
            <p>
              By submitting athlete performance data, photos, and information to the Platform, you grant PolyRISE Football
              a non-exclusive license to store, display, and use that data to provide the services described on the Platform.
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>You represent that you have the right to submit athlete data for any minor athlete in your care.</li>
              <li>Athlete data is used solely to provide recruiting and performance tracking services.</li>
              <li>Public recruiting profiles (visible at <strong>/athlete/[id]</strong>) are intentionally shareable by design for recruiting purposes.</li>
              <li>You may request removal of your athlete&apos;s data at any time by contacting polyrise@polyrisefootball.com.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">5. PR-VERIFIED Seal</h2>
            <p>
              The PR-VERIFIED seal certifies that an athlete&apos;s performance metrics were recorded at an official
              PolyRISE Football combine camp under supervised conditions. The seal is issued solely at the discretion of
              PolyRISE Football staff and may not be falsified, altered, or misrepresented.
            </p>
            <p className="mt-3">
              Misuse of the PR-VERIFIED seal, including but not limited to falsifying or reproducing it without
              authorization, may result in immediate account termination and legal action.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">6. Recruiting Tools Disclaimer</h2>
            <p>
              The School Fit Finder, Coach Outreach Templates, Recruiting Roadmap, and all recruiting-related tools on
              the Platform are provided for <strong>informational and educational purposes only</strong>. PolyRISE Football
              does not guarantee college placement, scholarship offers, or recruiting outcomes.
            </p>
            <p className="mt-3">
              Match scores, division benchmarks, and school recommendations are estimates based on publicly available
              recruiting standards and internal data. Results may vary. Parents and athletes should conduct independent
              research and consult with school counselors and coaches when making recruiting decisions.
            </p>
            <p className="mt-3">
              Coach Outreach Templates are provided as templates only. You are responsible for ensuring all communications
              comply with NCAA, NAIA, and NJCAA contact rules applicable to your athlete&apos;s grade level.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">7. Prohibited Uses</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use the Platform for any unlawful purpose</li>
              <li>Scrape, harvest, or copy data from the Platform</li>
              <li>Reverse-engineer any part of the Platform&apos;s technology</li>
              <li>Attempt to gain unauthorized access to any account or system</li>
              <li>Submit false or misleading athlete information</li>
              <li>Resell or commercially exploit access to the Platform without authorization</li>
              <li>Use automated tools to interact with the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, PolyRISE Football shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of the Platform,
              including loss of data, recruiting opportunities, or scholarship offers.
            </p>
            <p className="mt-3">
              Our total liability for any claim arising out of these Terms shall not exceed the amount you paid
              to PolyRISE Football in the 3 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">9. Termination</h2>
            <p>
              PolyRISE Football reserves the right to suspend or terminate your account at any time for violation
              of these Terms, fraudulent activity, or any conduct that we determine, in our sole discretion, to be
              harmful to the Platform or other users.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Texas, without regard to conflict of law principles.
              Any disputes arising under these Terms shall be resolved in the courts of Hays County, Texas.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">11. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. When we do, we will update the &quot;Last Updated&quot; date at
              the top of this page. Continued use of the Platform after changes constitutes acceptance of the
              revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wide mb-3">12. Contact</h2>
            <p>Questions about these Terms? Contact us:</p>
            <div className="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="font-bold text-gray-900">PolyRISE Football</p>
              <p>Dripping Springs, Texas</p>
              <p>(817) 658-3300</p>
              <p>polyrise@polyrisefootball.com</p>
              <p>polyrisefootball.com</p>
            </div>
          </section>

        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} PolyRISE Football. All rights reserved.</p>
          <Link href="/privacy" className="text-red-600 hover:text-red-700 font-semibold">Privacy Policy →</Link>
        </div>

      </div>
    </div>
  )
}
