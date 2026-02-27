import { NavLink, Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/40 to-white text-gray-900">
      <div className="flex">
        <aside className="w-72 bg-white/80 backdrop-blur border-r border-gray-200 hidden md:block">
          <div className="p-5 border-b">
            <h1 className="text-xl font-semibold text-primary">AFYALINK</h1>
            <p className="text-xs text-gray-500">Healthcare Platform</p>
          </div>
          <nav className="p-3 space-y-2">
            <Section title="Patient">
              <NavItem to="/patient" label="Dashboard" />
              <NavItem to="/patient/history" label="Medical History" />
              <NavItem to="/patient/prescriptions" label="Prescriptions" />
              <NavItem to="/patient/appointments" label="Appointments" />
              <NavItem to="/patient/reminders" label="Reminder Alerts" />
            </Section>
            <Section title="Practitioner">
              <NavItem to="/practitioner" label="Dashboard" />
              <NavItem to="/practitioner/search" label="Search Patient" />
              <NavItem to="/practitioner/assessment" label="Add Assessment" />
              <NavItem to="/practitioner/diagnosis" label="Log Diagnosis" />
              <NavItem to="/practitioner/medication" label="Add Medication" />
              <NavItem to="/practitioner/review" label="Schedule Review" />
              <NavItem to="/practitioner/history" label="View Patient History" />
              <NavItem to="/practitioner/monitoring" label="Chronic Monitoring" />
            </Section>
            <Section title="Admin">
              <NavItem to="/admin" label="Dashboard" />
              <NavItem to="/admin/facilities" label="Manage Facilities" />
              <NavItem to="/admin/users" label="Manage Users" />
              <NavItem to="/admin/logs" label="System Logs" />
              <NavItem to="/admin/analytics" label="Analytics" />
            </Section>
          </nav>
        </aside>
        <main className="flex-1">
          <header className="md:hidden bg-white/80 backdrop-blur border-b p-4">
            <h1 className="text-lg font-semibold text-primary">AFYALINK</h1>
          </header>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-lg text-sm ${
          isActive ? 'bg-teal-50 text-primary font-medium ring-1 ring-teal-100' : 'hover:bg-gray-50'
        }`
      }
    >
      {label}
    </NavLink>
  )
}
