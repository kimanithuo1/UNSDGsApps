import { useState } from 'react'
import { Helmet } from 'react-helmet'
import api from '../../lib/api'

const reasons = [
  { icon: '🏥', title: 'Facility Onboarding', desc: 'Set up your clinic, hospital, or health centre on AFYALINK.' },
  { icon: '🤝', title: 'Partnership Inquiry', desc: 'Explore integration, government, or NGO partnerships.' },
  { icon: '🛠️', title: 'Technical Support', desc: 'Get help with your account, records, or platform access.' },
  { icon: '📣', title: 'General Inquiry', desc: 'Questions about AFYALINK, our mission, or our roadmap.' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ type: '', msg: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', msg: '' })
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', msg: 'Please fill in all required fields.' })
      return
    }
    setLoading(true)
    try {
      const res = await api.post('contact/', form)
      if (res.status === 200) {
        setStatus({ type: 'success', msg: "Message sent! We'll be in touch within 24 hours." })
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus({ type: 'error', msg: 'Something went wrong. Please try again or email us directly.' })
      }
    } catch {
      setStatus({ type: 'error', msg: 'Something went wrong. Please try again or email us directly.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>Contact AFYALINK – Onboarding, Support & Partnerships</title>
        <meta
          name="description"
          content="Contact AFYALINK to onboard your facility, request support, or explore partnerships. We respond within 24 hours. Email: jtechbyteinsights@gmail.com"
        />
      </Helmet>

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#0f766e] to-[#115e58] text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-20 text-center">
          <span className="inline-block bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Let's bring better healthcare data<br className="hidden md:block" /> to your facility
          </h1>
          <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
            Whether you're a patient, a provider, or a hospital administrator — we're here to help you get started on AFYALINK.
          </p>
        </div>
      </section>

      {/* ── REASON CARDS ── */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center shadow-sm">
              <div className="text-3xl mb-2">{r.icon}</div>
              <h3 className="font-semibold text-sm text-gray-900">{r.title}</h3>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORM + SIDEBAR ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-5 gap-10">

          {/* Sidebar */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Reach us directly</h2>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                We're a small, mission-driven team. Every message is read by a real person, and we aim to respond within 24 hours on business days.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-sm flex-shrink-0">
                  📧
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email</div>
                  <a href="mailto:jtechbyteinsights@gmail.com" className="text-sm text-[#0f766e] hover:underline font-medium">
                    jtechbyteinsights@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-sm flex-shrink-0">
                  ⏱️
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Response Time</div>
                  <div className="text-sm text-gray-700">Within 24 hours, Mon–Fri</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-sm flex-shrink-0">
                  🌍
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Serving</div>
                  <div className="text-sm text-gray-700">All of Africa — and growing</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-teal-50 border border-teal-100 p-5">
              <h3 className="font-bold text-gray-900 text-sm">Onboarding Your Facility?</h3>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                We provide hands-on support to onboard clinics, hospitals, and multi-facility networks. Training is included. Tell us your facility size and location, and we'll design an onboarding plan for you.
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
              <h3 className="font-bold text-gray-900 text-sm">Government & NGO Partners</h3>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                AFYALINK's FHIR-compliant data model and analytics dashboards are designed to support national health coverage goals. Contact us to discuss integration opportunities.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <div className="rounded-3xl border border-gray-100 shadow-sm bg-white p-8">
              <h2 className="text-xl font-bold text-gray-900">Send us a message</h2>
              <p className="text-sm text-gray-500 mt-1">All fields marked * are required.</p>

              {status.msg && (
                <div
                  className={`mt-4 text-sm px-4 py-3 rounded-xl font-medium ${
                    status.type === 'success'
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {status.msg}
                </div>
              )}

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="name">
                      Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="email">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="subject">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition"
                    placeholder="e.g. Facility onboarding, Partnership, Support"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="message">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition resize-none"
                    placeholder="Tell us how we can help. Include your facility name and location if you're looking to onboard."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#0f766e] text-white font-semibold px-6 py-3.5 shadow-md hover:bg-[#14b8a6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}