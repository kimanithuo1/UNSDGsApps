import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

function QuickAction({ to, icon, label, desc, color }) {
  return (
    <Link
      to={to}
      className="flex items-start gap-3 p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <div className="font-semibold text-sm text-gray-900">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</div>
      </div>
    </Link>
  )
}

export default function PractitionerDashboard() {
  const [user, setUser] = useState(null)
  const today = new Date().toLocaleDateString('en-KE', { weekday: 'long', month: 'long', day: 'numeric' })

  useEffect(() => {
    api.get('auth/me/').then(r => setUser(r.data)).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning{user?.first_name ? `, Dr. ${user.first_name}` : ''} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{today}</p>
        </div>
        <Link
          to="/practitioner/assessment"
          className="inline-flex items-center gap-2 bg-[#0f766e] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md hover:bg-[#14b8a6] transition-colors"
        >
          📝 New Assessment
        </Link>
      </div>

      {/* ── TODAY STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '👤', label: "Today's Patients", value: '—', color: 'bg-teal-50' },
          { icon: '📅', label: 'Upcoming Reviews', value: '—', color: 'bg-sky-50' },
          { icon: '🔔', label: 'Pending Reminders', value: '—', color: 'bg-amber-50' },
          { icon: '📊', label: 'Active Chronic Patients', value: '—', color: 'bg-violet-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3 ${s.color}`}>{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── ALERTS ── */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span>⚠️</span>
          <h2 className="font-bold text-sm text-gray-900">Patient Alerts &amp; Follow-ups</h2>
        </div>
        <div className="space-y-2">
          {[
            { msg: 'Patient follow-ups due today — check your schedule', link: '/practitioner/review', cta: 'View Schedule' },
            { msg: 'Chronic care patients with overdue vitals logs', link: '/practitioner/monitoring', cta: 'View' },
            { msg: 'Patients with missed appointments this week', link: '/practitioner/reminders', cta: 'Send Reminder' },
          ].map(a => (
            <div key={a.msg} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-amber-100">
              <span className="text-sm text-gray-700">{a.msg}</span>
              <Link to={a.link} className="text-xs font-bold text-[#0f766e] hover:underline ml-4 flex-shrink-0">{a.cta} →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">Clinical Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <QuickAction to="/practitioner/search" icon="🔍" label="Search Patient" desc="Find a patient by name or ID." color="bg-teal-50" />
          <QuickAction to="/practitioner/assessment" icon="📝" label="Add Assessment" desc="Log visit notes and clinical findings." color="bg-sky-50" />
          <QuickAction to="/practitioner/diagnosis" icon="🩺" label="Log Diagnosis" desc="Record diagnosis with ICD codes." color="bg-violet-50" />
          <QuickAction to="/practitioner/medication" icon="💊" label="Add Medication" desc="Prescribe medications and dosage." color="bg-emerald-50" />
          <QuickAction to="/practitioner/review" icon="📅" label="Schedule Review" desc="Book follow-up or monitoring dates." color="bg-amber-50" />
          <QuickAction to="/practitioner/monitoring" icon="📊" label="Chronic Monitoring" desc="Track vitals and long-term trends." color="bg-orange-50" />
          <QuickAction to="/practitioner/reminders" icon="🔔" label="Send Reminders" desc="SMS/WhatsApp patients for follow-up." color="bg-pink-50" />
          <QuickAction to="/practitioner/history" icon="📋" label="Patient History" desc="View full medical record timeline." color="bg-gray-50" />
        </div>
      </div>
    </div>
  )
}