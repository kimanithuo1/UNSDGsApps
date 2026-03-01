import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

const values = [
  { icon: '🌍', title: 'Accessibility', desc: 'Healthcare data should work for everyone — urban or rural, high-bandwidth or USSD.' },
  { icon: '🔒', title: 'Privacy', desc: 'Patients own their data. We are stewards, not owners. Every record is encrypted and access-controlled.' },
  { icon: '⚡', title: 'Reliability', desc: 'Systems that fail when data is lost cost lives. AFYALINK is built to be robust, resilient, and always available.' },
  { icon: '🤝', title: 'Patient Empowerment', desc: "We believe informed patients lead to better outcomes. AFYALINK puts health information in people's hands."},
  { icon: '📡', title: 'Interoperability', desc: 'Built on HL7 FHIR standards so AFYALINK can connect with national registries, insurance databases, and future systems.' },
  { icon: '📈', title: 'Evidence-Driven Care', desc: 'From assumption-based decisions to data-backed insights. Every feature is designed to enable better, faster clinical decisions.' },
]

const milestones = [
  { year: '2024', event: "AFYALINK founded to address Africa's health data poverty problem"},
  { year: '2025', event: 'Platform launched with patient records, reminders, and cross-facility access' },
  { year: '2025', event: 'FHIR-compliant data model implemented for national registry compatibility' },
  { year: 'Soon', event: 'Telemedicine, AI health insights, and national health ID integration coming' },
]

export default function About() {
  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>About AFYALINK – Our Mission to Revolutionize Healthcare Data in Africa</title>
        <meta
          name="description"
          content="AFYALINK was founded to end Africa's health data poverty. Learn about our mission, values, and why data-driven healthcare is urgently needed across the continent."
        />
      </Helmet>

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#0f766e] to-[#115e58] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/3" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="inline-block bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Better Healthcare for All —<br className="hidden md:block" />
            <span className="text-emerald-300">When Data Drives Decisions</span>
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            AFYALINK was born from a clear and urgent truth: Africa's health systems are not failing because of a lack of care — they are failing because of a lack of <em>connected, actionable data.</em>
          </p>
        </div>
      </section>

      {/* ── WHY WE EXIST ── */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f766e]">Why We Exist</span>
            <h2 className="mt-3 text-3xl font-bold leading-snug">The continent bears the burden. The data lags behind.</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Africa carries <strong>27% of the world's disease burden</strong> while home to only 12% of its population. Yet the vast majority of health data across the continent remains on paper, siloed between facilities, or locked in legacy systems that don't talk to each other.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Researchers now call this "health data poverty" — insufficient, low-quality data that prevents evidence-based care. The consequences are not abstract: in Ghana in 2025, a national EMR collapse erased five years of patient records overnight. Doctors were forced back to notebooks. Nephrologists couldn't treat kidney patients because, in their words, <strong>"without the data, we are useless."</strong>
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              During the 2014–16 Ebola epidemic, poor data coordination allowed misinformation to spread, aid to be misdirected, and lives to be lost — not just to the virus, but to the data vacuum around it.
            </p>
            <p className="mt-5 text-gray-900 font-semibold">
              AFYALINK was founded to change this — permanently.
            </p>
          </div>
          <div className="space-y-5">
            <div className="rounded-2xl bg-teal-50 border border-teal-100 p-6">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 text-lg">Our Mission</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                To advance UN Sustainable Development Goal 3 — Good Health and Well-Being — by enabling secure, accessible, and connected health data for every patient, provider, and facility in Africa.
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
              <div className="text-2xl mb-3">🌐</div>
              <h3 className="font-bold text-gray-900 text-lg">Our Vision</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                A connected health ecosystem across Africa where no patient's history is ever lost, no diagnosis is made in the dark, and no outbreak goes undetected due to data failures.
              </p>
            </div>
            <div className="rounded-2xl bg-sky-50 border border-sky-100 p-6">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 text-lg">Our Approach</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                We build on HL7 FHIR standards, design for low-bandwidth environments, and follow HIPAA/GDPR-aligned security practices — so AFYALINK works today in the most challenging conditions, and scales with the continent tomorrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SDG ALIGNMENT ── */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0f766e]">Global Alignment</span>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold">Built on WHO's vision for digital health</h2>
          <p className="mt-3 text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed">
            AFYALINK directly supports the WHO's call for digital health as an accelerator for SDG 3, and aligns with recommendations from research identifying Africa's "data poverty" — specifically the need for novel data collection and robust IT services to overcome systemic health data gaps.
          </p>
          <div className="mt-8 inline-flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-8 py-5 shadow-sm">
            <span className="text-4xl">🇺🇳</span>
            <div className="text-left">
              <div className="font-bold text-gray-900">UN Sustainable Development Goal 3</div>
              <div className="text-sm text-gray-500">Good Health and Well-Being for All</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0f766e]">Our Values</span>
          <h2 className="mt-3 text-3xl font-bold">Principles we build everything on</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-3xl">{v.icon}</span>
              <h3 className="mt-3 font-bold text-gray-900">{v.title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="bg-gradient-to-b from-teal-50/40 to-white py-14">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f766e]">Our Journey</span>
            <h2 className="mt-3 text-3xl font-bold">AFYALINK milestones</h2>
          </div>
          <div className="mt-10 relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-teal-200" />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year + m.event} className="relative flex items-start gap-6">
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-[#0f766e] text-white flex items-center justify-center text-xs font-bold shadow-md">
                    {m.year}
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S COMING ── */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-[#0f766e] to-[#14b8a6] text-white p-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">Coming Soon</span>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold">The future of AFYALINK</h2>
          <p className="mt-3 text-white/80 max-w-lg mx-auto text-sm leading-relaxed">
            We're building toward telemedicine video consultations, AI-assisted health insights, integration with national health IDs, and deeper analytics dashboards for health ministries. AFYALINK is not just a records platform — it's the data infrastructure Africa's health system needs.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {['🎥 Telemedicine Calls', '🤖 AI Health Insights', '🪪 National Health ID Integration', '📊 Ministry Dashboards'].map((item) => (
              <span key={item} className="bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t bg-gray-50 py-14">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Ready to join Africa's health data revolution?</h2>
          <p className="mt-3 text-gray-500 text-sm">Whether you're a patient, a provider, or a facility — AFYALINK is ready for you.</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-[#0f766e] text-white font-semibold px-8 py-3.5 shadow-md hover:bg-[#14b8a6] transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-[#0f766e] text-[#0f766e] font-medium px-8 py-3.5 hover:bg-teal-50 transition-colors"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}