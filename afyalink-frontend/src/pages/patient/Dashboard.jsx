import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

function PatientDashboard() {
  const [user, setUser] = useState(null)
  const [reminders, setReminders] = useState([])
  const today = new Date().toLocaleDateString('en-KE', { weekday: 'long', month: 'long', day: 'numeric' })

  useEffect(() => {
    api.get('auth/me/').then(r => setUser(r.data)).catch(() => {})
    api.get('reminders/').then(r => setReminders(r.data.slice(0, 3))).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0f766e] to-[#14b8a6] text-white p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm">{today}</p>
            <h1 className="text-2xl font-bold mt-1">
              Hello{user?.first_name ? `, ${user.first_name}` : ''} 👋
            </h1>
            <p className="text-white/80 text-sm mt-1">Your health dashboard. Everything in one place.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/patient/appointments" className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors border border-white/20">
              📅 Appointments
            </Link>
            <Link to="/patient/reminders" className="bg-white text-[#0f766e] text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-teal-50 transition-colors shadow-sm">
              🔔 Reminders
            </Link>
          </div>
        </div>
      </div>

      {/* ── QUICK STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '📋', label: 'Medical Records', to: '/patient/history', color: 'bg-teal-50' },
          { icon: '💊', label: 'Active Prescriptions', to: '/patient/prescriptions', color: 'bg-sky-50' },
          { icon: '📅', label: 'Upcoming Appointments', to: '/patient/appointments', color: 'bg-violet-50' },
          { icon: '🔔', label: 'Pending Reminders', to: '/patient/reminders', color: 'bg-amber-50' },
        ].map(s => (
          <Link key={s.label} to={s.to} className={`${s.color} rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xs font-semibold text-gray-700">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* ── ACTIVE REMINDERS ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900">🔔 Your Reminders</h2>
          <Link to="/patient/reminders" className="text-xs text-[#0f766e] font-semibold hover:underline">View all →</Link>
        </div>
        {reminders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-400 text-sm">
            No active reminders. Your care team will add reminders here.
          </div>
        ) : (
          <div className="space-y-2">
            {reminders.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{r.type === 'FOLLOW_UP' ? '📅' : r.type === 'REFILL' ? '💊' : '📊'}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{r.message}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Due: {new Date(r.due_date).toLocaleDateString('en-KE', { dateStyle: 'medium' })}</div>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${r.is_sent ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-700'}`}>
                  {r.is_sent ? 'Sent' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── HEALTH TIPS ── */}
      <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
        <h2 className="font-bold text-sm text-gray-900 mb-3">💡 Health Tips</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '🚰', tip: 'Drink at least 8 glasses of water daily, especially in warm climates.' },
            { icon: '💊', tip: 'Never skip doses of chronic medication — consistency is key to control.' },
            { icon: '🩺', tip: 'Regular check-ups catch problems early. Book your next visit today.' },
            { icon: '🏃', tip: 'Even 30 minutes of walking daily reduces risk of diabetes and hypertension.' },
          ].map(t => (
            <div key={t.tip} className="flex items-start gap-2 text-xs text-gray-700">
              <span className="text-base mt-0.5 flex-shrink-0">{t.icon}</span>
              {t.tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default PatientDashboard
export { PatientDashboard }
