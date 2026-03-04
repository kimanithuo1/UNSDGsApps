import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import api from '../../lib/api'

const roleNav = {
  patient: [
    { to: '/patient', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/patient/history', label: 'Medical History', icon: '📋' },
    { to: '/patient/prescriptions', label: 'Prescriptions', icon: '💊' },
    { to: '/patient/appointments', label: 'Appointments', icon: '📅' },
    { to: '/patient/reminders', label: 'Reminders', icon: '🔔' },
  ],
  practitioner: [
    { to: '/practitioner', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/practitioner/search', label: 'Search Patient', icon: '🔍' },
    { to: '/practitioner/assessment', label: 'Add Assessment', icon: '📝' },
    { to: '/practitioner/diagnosis', label: 'Log Diagnosis', icon: '🩺' },
    { to: '/practitioner/medication', label: 'Add Medication', icon: '💊' },
    { to: '/practitioner/review', label: 'Schedule Review', icon: '📅' },
    { to: '/practitioner/history', label: 'Patient History', icon: '📋' },
    { to: '/practitioner/monitoring', label: 'Chronic Monitoring', icon: '📊' },
    { to: '/practitioner/reminders', label: 'Send Reminders', icon: '🔔' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/admin/facilities', label: 'Manage Facilities', icon: '🏥' },
    { to: '/admin/users', label: 'Manage Users', icon: '👥' },
    { to: '/admin/reminders', label: 'Broadcast Reminders', icon: '📣' },
    { to: '/admin/analytics', label: 'Analytics', icon: '📊' },
    { to: '/admin/logs', label: 'System Logs', icon: '🗂️' },
  ],
}

function detectRole(pathname) {
  if (pathname.startsWith('/admin')) return 'admin'
  if (pathname.startsWith('/practitioner')) return 'practitioner'
  return 'patient'
}

export default function DashboardLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const role = detectRole(pathname)
  const [user, setUser] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    api.get('auth/me/').then(r => setUser(r.data)).catch(() => {})
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
  }

  const roleLabel = { patient: 'Patient', practitioner: 'Practitioner', admin: 'Admin' }[role]
  const roleColor = { patient: 'bg-sky-100 text-sky-700', practitioner: 'bg-violet-100 text-violet-700', admin: 'bg-amber-100 text-amber-700' }[role]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── TOP BAR ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className="block w-5 h-0.5 bg-gray-600 mb-1 transition-all" style={mobileOpen ? {transform:'rotate(45deg) translate(2px,5px)'} : {}} />
              <span className="block w-5 h-0.5 bg-gray-600 mb-1 transition-all" style={mobileOpen ? {opacity:0} : {}} />
              <span className="block w-5 h-0.5 bg-gray-600 transition-all" style={mobileOpen ? {transform:'rotate(-45deg) translate(2px,-5px)'} : {}} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0f766e] flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-black">AL</span>
              </div>
              <span className="font-bold text-[#0f766e] text-lg tracking-tight hidden sm:block">AFYALINK</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColor}`}>{roleLabel}</span>
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-[#0f766e]">
                  {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                </div>
                <span className="text-sm text-gray-700 hidden sm:block font-medium">
                  {user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">
        {/* ── SIDEBAR ── */}
        <aside className={`
          fixed md:sticky top-[57px] h-[calc(100vh-57px)] z-30 w-64 bg-white border-r border-gray-100
          flex-shrink-0 overflow-y-auto transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <nav className="p-3 space-y-1 pt-4">
            {roleNav[role].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-[#0f766e] ring-1 ring-teal-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Bottom user card */}
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 bg-white">
            <div className="rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 p-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                💡 Need help? Contact support at{' '}
                <a href="mailto:jtechbyteinsights@gmail.com" className="text-[#0f766e] font-medium hover:underline">
                  jtechbyteinsights@gmail.com
                </a>
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setMobileOpen(false)} />
        )}

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 min-w-0 p-4 md:p-6 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  )
}