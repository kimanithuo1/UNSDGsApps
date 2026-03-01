import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useState } from 'react'

const stats = [
  { value: '27%', label: "of the world's disease burden", sub: 'carried by Africa' },
  { value: '5 yrs', label: 'of patient records lost', sub: 'Ghana LHIMS collapse, 2025' },
  { value: '60%', label: 'faster check-in times', sub: 'with digital health platforms' },
  { value: '3×', label: 'more consultation time', sub: 'per patient for doctors' },
]

const features = [
  {
    icon: '🗂️',
    title: 'Unified Patient Records',
    desc: 'Every diagnosis, prescription, and lab result in one secure place. No more paper folders. No more lost files. Patients own their data.',
  },
  {
    icon: '🔔',
    title: 'Automated Reminders',
    desc: 'SMS and email nudges for immunizations, follow-ups, and chronic care. The right reminder to the right person at the right time.',
  },
  {
    icon: '🏥',
    title: 'Cross-Facility Access',
    desc: "A patient's record travels with them. Emergency at a new hospital? Prior clinic notes are accessible in seconds — not days.",
  },
  {
    icon: '📊',
    title: 'Real-Time Analytics',
    desc: 'Aggregated, anonymized data helps facilities and ministries spot disease trends, allocate resources, and plan ahead — not react late.',
  },
  {
    icon: '📶',
    title: 'Low-Bandwidth Ready',
    desc: "Designed for Africa's connectivity realities. Offline caching and USSD support ensure care continues even without stable internet.",
  },
  {
    icon: '🔒',
    title: 'Enterprise-Grade Security',
    desc: 'Encrypted cloud storage, role-based access, SSL, and hashed passwords. HIPAA/GDPR-aligned practices protect every record.',
  },
]

const caseStudies = [
  {
    tag: 'Crisis',
    color: 'bg-red-50 border-red-200 text-red-700',
    tagColor: 'bg-red-100 text-red-700',
    title: "Ghana's LHIMS Collapse — 2025",
    body: "Ghana's national Electronic Medical Record system went offline, wiping out five years of patient data across public hospitals. Doctors were forced back to notebooks. Nephrologists reported being 'tied' in their ability to treat kidney patients — 'without the data, we are useless.' Long queues formed. Patient safety was at risk. This is what happens when health data has no resilient home.",
    source: 'JoyNews / MyJoyOnline',
  },
  {
    tag: 'Epidemic',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    tagColor: 'bg-amber-100 text-amber-700',
    title: 'West African Ebola Epidemic — 2014–16',
    body: 'Poor data coordination and misinformation severely hampered outbreak response across Sierra Leone, Guinea, and Liberia. Aid was misdirected. Fear was amplified by inaccurate reporting. Analysts later concluded: "valid, credible and timely data is essential during a global crisis. Without it, efforts to assist affected people can be misdirected and inefficient." Lives were lost not just to the virus — but to the data vacuum around it.',
    source: 'LSE Africa at LSE / WHO',
  },
  {
    tag: 'Success',
    color: 'bg-teal-50 border-teal-200 text-teal-700',
    tagColor: 'bg-teal-100 text-teal-700',
    title: 'Medbook Kenya — Proof It Works',
    body: 'Kenyan clinics adopting digital health platforms reported 60% faster check-in times, three times more consultation time per patient, and pharmacies eliminating stockouts entirely. Digital tools in Africa "increase safety, enhance care delivery, and restore confidence in the healthcare experience." The technology is not theoretical. The results are real. AFYALINK is built to deliver this — at continental scale.',
    source: 'Medbook Africa',
  },
]

const faqs = [
  {
    q: 'What is AFYALINK?',
    a: 'AFYALINK is a secure, cloud-based patient-provider data exchange platform built for Africa. It allows patients to store their complete medical history digitally, providers to log and access patient records across facilities, and facilities to share data securely — all in one place.',
  },
  {
    q: 'Who can use AFYALINK?',
    a: 'Anyone involved in healthcare: patients who want to own and control their health data, doctors and nurses who need instant access to accurate patient histories, and facility administrators who manage multi-provider clinics or hospitals. Each role has tailored access — patients see their own data, practitioners see their patients, admins manage their facility.',
  },
  {
    q: 'How do I register?',
    a: 'Click "Get Started" on the homepage, enter your email or phone number, choose a password, and verify via email or SMS. For clinics and hospitals, administrators can bulk-onboard practitioners and link the facility to the platform. The entire process takes under five minutes.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. AFYALINK uses SSL encryption, hashed passwords, and role-based access controls so only authorized people see each record. Our infrastructure follows HIPAA/GDPR-aligned security practices, and all data is stored on encrypted cloud servers. We maintain full audit logs of every data access event.',
  },
  {
    q: 'What if I lose internet access?',
    a: "AFYALINK is built for Africa's connectivity reality. Recent records and appointments are cached on your device for offline viewing. For very low-bandwidth areas, key functions are accessible via USSD. Everything syncs automatically when your connection resumes."
  },

  {
    q: 'Can I manage records for my family?',
    a: 'Yes. You can add dependents — children, elderly parents — under your account and manage their health records, reminders, and appointments from a single login.',
  },
  {
    q: "Can multiple clinics share a patient's records?",
    a: "Yes. Cross-facility record sharing is one of AFYALINK's core features. If a patient visits a new clinic or arrives at an emergency room, authorized providers can immediately access their prior records. No more starting from scratch.",
  },
  {
    q: 'Is there a cost to use AFYALINK?',
    a: 'Basic accounts for individual patients are free. Facility and practitioner plans are available with extended features. Contact us to discuss onboarding your clinic or hospital — we offer training and support for all new facilities.',
  },
  {
    q: 'What is the AFYALINK data model built on?',
    a: 'We use HL7 FHIR (Fast Healthcare Interoperability Resources) — the global standard for health data exchange. This ensures AFYALINK can interface with national health registries, insurance databases, and other systems, both now and as the ecosystem grows.',
  },
  {
    q: "What's coming next for AFYALINK?",
    a: "We're building toward telemedicine video consultations, AI-assisted health insights, integration with national health IDs, and deeper analytics dashboards for health ministries. AFYALINK is not just a records system — it's the data infrastructure Africa's health system needs.",
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-teal-50/40 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm md:text-base">{q}</span>
        <span className="ml-4 text-[#0f766e] font-bold text-lg flex-shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 bg-teal-50/30 text-sm text-gray-700 leading-relaxed border-t border-gray-100">
          {a}
        </div>
      )}
    </div>
  )
}

export default function Landing() {
  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>AFYALINK – Secure Digital Health Records & Patient Monitoring for Africa</title>
        <meta
          name="description"
          content="AFYALINK is revolutionizing African healthcare by turning fragmented paper records into a unified digital platform. Secure records, automated reminders, and real-time analytics for patients, providers, and facilities."
        />
      </Helmet>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f766e] via-[#0d6b63] to-[#115e58] text-white">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            Aligned with UN SDG 3 · Good Health and Well-Being
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Healthcare can be better<br className="hidden md:block" />
            <span className="text-emerald-300"> when data replaces assumptions</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            AFYALINK is Africa's patient-provider data exchange platform — turning fragmented, paper-based health records into a unified digital system that saves lives.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-white text-[#0f766e] font-semibold px-8 py-3.5 shadow-lg hover:bg-emerald-50 transition-colors text-sm md:text-base"
            >
              Get Started — It's Free
            </Link>
            <Link
              to="/about"
              className="rounded-xl border border-white/40 text-white font-medium px-8 py-3.5 hover:bg-white/10 transition-colors text-sm md:text-base"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#0f766e]">{s.value}</div>
              <div className="mt-1 text-sm font-medium text-gray-800">{s.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f766e]">The Problem</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold leading-snug">
              Africa is experiencing a <span className="text-[#0f766e]">health data crisis</span>
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Across the continent, health records are siloed, paper-based, and incomplete — researchers call it <strong>"health data poverty."</strong> Clinics and ministries collect data separately, making the system "like solving a puzzle with pieces from different boxes."
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              The consequences are real: slower epidemic responses, misdiagnosis due to lost records, and wasted resources allocated to yesterday's numbers. Africa shoulders <strong>27% of the world's disease burden</strong> yet most of its health data still lives on paper.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed font-medium">
              AFYALINK was built to end this. Not tomorrow — now.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
              <div className="text-2xl mb-2">📉</div>
              <h3 className="font-semibold text-gray-900">Fragmented data → slower responses</h3>
              <p className="mt-1 text-sm text-gray-600">During the 2014–16 Ebola epidemic, poor data coordination misdirected aid and prolonged the outbreak. Delayed or inaccurate data cost lives.</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-semibold text-gray-900">Outdated records → dangerous guesswork</h3>
              <p className="mt-1 text-sm text-gray-600">In Ghana (2025), a national EMR collapse erased 5 years of patient data. Doctors reverted to notebooks. Specialists couldn't treat patients. Queues grew. Safety deteriorated.</p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
              <div className="text-2xl mb-2">💸</div>
              <h3 className="font-semibold text-gray-900">Poor quality data → wasted resources</h3>
              <p className="mt-1 text-sm text-gray-600">A 2023 review found Africa's health data is "limited and frequently of poor quality," causing misallocation of funds, staff, and supplies — and leaving public health blind spots unaddressed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-gradient-to-b from-teal-50/50 to-white py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f766e]">How It Works</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Simple steps. Transformative impact.</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Sign Up', desc: 'Register as a patient, provider, or facility in under 5 minutes. Free to start.' },
              { step: '02', title: 'Enter Your Data', desc: 'Add your medical history, or let your provider log it directly into your secure profile.' },
              { step: '03', title: 'Share Securely', desc: 'Authorize providers and facilities to access your records — on your terms.' },
              { step: '04', title: 'Get Reminders', desc: 'Receive smart reminders for appointments, medications, and follow-ups via SMS or email.' },
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-5xl font-black text-teal-100 absolute top-4 right-4 leading-none">{item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 relative">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 relative leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO BENEFITS ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0f766e]">Who Benefits</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Built for everyone in the health ecosystem</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🧑‍⚕️',
              role: 'Patients',
              headline: 'Your health, in your hands',
              points: [
                'Never carry paper records again',
                'Access your full medical history anytime',
                'Get automated medication & appointment reminders',
                'Manage records for dependents and family',
              ],
            },
            {
              icon: '👨‍⚕️',
              role: 'Providers',
              headline: 'Spend less time on paperwork, more on care',
              points: [
                'Instant access to patient history across visits',
                'Log diagnoses, prescriptions, and labs in seconds',
                'Flag patients for follow-up with automated reminders',
                'Share records safely with specialists or referrals',
              ],
            },
            {
              icon: '🏛️',
              role: 'Facilities & Governments',
              headline: 'Data-driven decisions at scale',
              points: [
                'Real-time dashboards for patient trends',
                'Spot disease outbreaks and allocate resources fast',
                'Support universal health coverage planning',
                'FHIR-compatible for national registry integration',
              ],
            },
          ].map((b) => (
            <div key={b.role} className="rounded-2xl border border-gray-100 shadow-sm bg-white p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl">{b.icon}</div>
              <div className="mt-3 text-xs font-bold uppercase tracking-widest text-[#0f766e]">{b.role}</div>
              <h3 className="mt-1 text-lg font-bold text-gray-900">{b.headline}</h3>
              <ul className="mt-4 space-y-2">
                {b.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#0f766e] font-bold mt-0.5">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── KEY FEATURES ── */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f766e]">Key Features</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Everything your health system needs</h2>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-3 text-base font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0f766e]">Case Studies</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">What broken data systems cost Africa</h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">These aren't hypothetical risks. They are documented realities — and the reason AFYALINK exists.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {caseStudies.map((c) => (
            <div key={c.title} className={`rounded-2xl border p-6 ${c.color}`}>
              <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${c.tagColor} mb-3`}>
                {c.tag}
              </span>
              <h3 className="font-bold text-gray-900 text-base leading-snug">{c.title}</h3>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">{c.body}</p>
              <p className="mt-4 text-xs text-gray-500 font-medium">Source: {c.source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="bg-[#0f766e] text-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Africa's health data doesn't have to be a blind spot
          </h2>
          <p className="mt-4 text-white/80 text-lg leading-relaxed">
            Join AFYALINK and help turn disconnected data points into integrated, real-time intelligence that saves lives.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-white text-[#0f766e] font-semibold px-8 py-3.5 shadow-lg hover:bg-emerald-50 transition-colors"
            >
              Register Now — Free
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-white/40 text-white font-medium px-8 py-3.5 hover:bg-white/10 transition-colors"
            >
              Onboard Your Facility
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0f766e]">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="mt-2 text-gray-500 text-sm">Everything you need to know about AFYALINK.</p>
        </div>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          Still have questions?{' '}
          <Link to="/contact" className="text-[#0f766e] font-semibold hover:underline">
            Contact our team →
          </Link>
        </div>
      </section>
    </div>
  )
}