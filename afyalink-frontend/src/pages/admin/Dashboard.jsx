import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={`rounded-2xl border p-5 bg-white shadow-sm hover:shadow-md transition-shadow`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${color}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm font-medium text-gray-700 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

function QuickAction({ to, icon, label, desc, color }) {
  return (
    <Link
      to={to}
      className={`flex items-start gap-4 p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <div className="font-semibold text-sm text-gray-900">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</div>
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const today = new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  useEffect(() => {
    api.get('auth/me/').then(r => setUser(r.data)).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{user?.first_name ? `, ${user.first_name}` : ''} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{today} · System Admin</p>
        </div>
        <Link
          to="/admin/reminders"
          className="inline-flex items-center gap-2 bg-[#0f766e] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md hover:bg-[#14b8a6] transition-colors"
        >
          📣 Broadcast Reminder
        </Link>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="🏥" label="Active Facilities" value="—" sub="Registered on AFYALINK" color="bg-teal-50" />
        <StatCard icon="👥" label="Total Users" value="—" sub="Patients + Practitioners" color="bg-sky-50" />
        <StatCard icon="📅" label="Today's Appointments" value="—" sub="Across all facilities" color="bg-violet-50" />
        <StatCard icon="🔔" label="Pending Reminders" value="—" sub="Unsent reminder alerts" color="bg-amber-50" />
      </div>

      {/* ── ALERTS PANEL ── */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚠️</span>
          <h2 className="font-bold text-gray-900 text-sm">System Alerts & Pending Actions</h2>
        </div>
        <div className="space-y-2">
          {[
            { icon: '🏥', msg: 'New facility registration requests awaiting approval', link: '/admin/facilities', cta: 'Review' },
            { icon: '👤', msg: 'New user accounts pending verification', link: '/admin/users', cta: 'Verify' },
            { icon: '📣', msg: 'No broadcast reminder sent this week', link: '/admin/reminders', cta: 'Send Now' },
          ].map((a) => (
            <div key={a.msg} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-amber-100">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>{a.icon}</span>
                {a.msg}
              </div>
              <Link to={a.link} className="text-xs font-bold text-[#0f766e] hover:underline ml-4 flex-shrink-0">
                {a.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <QuickAction to="/admin/facilities" icon="🏥" label="Manage Facilities" desc="Add, edit, or deactivate registered health facilities." color="bg-teal-50" />
          <QuickAction to="/admin/users" icon="👥" label="Manage Users" desc="Create users, assign roles, reset passwords." color="bg-sky-50" />
          <QuickAction to="/admin/reminders" icon="📣" label="Broadcast Reminders" desc="Send SMS/email blasts to patients or groups." color="bg-violet-50" />
          <QuickAction to="/admin/analytics" icon="📊" label="Analytics" desc="Charts: user growth, appointments, demographics." color="bg-emerald-50" />
          <QuickAction to="/admin/logs" icon="🗂️" label="System Logs" desc="Audit trail — who did what and when." color="bg-orange-50" />
        </div>
      </div>

      {/* ── TIPS ── */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0f766e] to-[#14b8a6] text-white p-6">
        <h2 className="font-bold text-base mb-2">💡 Admin Tips</h2>
        <ul className="text-sm text-white/90 space-y-1.5">
          <li>→ Send weekly appointment reminders to reduce no-shows by up to 40%</li>
          <li>→ Use broadcast messages for public health campaigns (vaccinations, wellness events)</li>
          <li>→ Review Analytics weekly to spot trends in missed appointments or rising conditions</li>
          <li>→ Verify new facility codes before distributing them to patients</li>
        </ul>
      </div>
    </div>
  )
}
