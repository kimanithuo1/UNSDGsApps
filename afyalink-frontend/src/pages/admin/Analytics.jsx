import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

// Placeholder data — replace with real API data
const userGrowth = [
  { month: 'Sep', patients: 12, practitioners: 3 },
  { month: 'Oct', patients: 28, practitioners: 5 },
  { month: 'Nov', patients: 45, practitioners: 7 },
  { month: 'Dec', patients: 63, practitioners: 9 },
  { month: 'Jan', patients: 89, practitioners: 12 },
  { month: 'Feb', patients: 120, practitioners: 15 },
]

const appointmentData = [
  { week: 'Wk 1', attended: 34, missed: 8 },
  { week: 'Wk 2', attended: 41, missed: 5 },
  { week: 'Wk 3', attended: 38, missed: 10 },
  { week: 'Wk 4', attended: 52, missed: 6 },
]

const conditionBreakdown = [
  { name: 'Diabetes', value: 28 },
  { name: 'Hypertension', value: 34 },
  { name: 'Malaria', value: 19 },
  { name: 'HIV/AIDS', value: 11 },
  { name: 'Other', value: 8 },
]

const COLORS = ['#0f766e', '#14b8a6', '#f59e0b', '#3b82f6', '#94a3b8']

const reminderStats = [
  { name: 'Sent', value: 312 },
  { name: 'Opened / Replied', value: 198 },
  { name: 'Appointments Kept', value: 171 },
]

function SectionHeader({ title, sub }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState('6m')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📊 Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform-wide health metrics and trends</p>
        </div>
        <div className="flex gap-2">
          {['1m', '3m', '6m', '1y'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                period === p ? 'bg-[#0f766e] text-white border-[#0f766e]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0f766e]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: '120', trend: '+35 this month', color: 'text-teal-600' },
          { label: 'Active Facilities', value: '8', trend: '+2 this month', color: 'text-sky-600' },
          { label: 'Appointments (Month)', value: '165', trend: '13% no-show rate', color: 'text-violet-600' },
          { label: 'Reminders Sent', value: '312', trend: '63% response rate', color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm font-medium text-gray-700 mt-0.5">{s.label}</div>
            <div className="text-xs text-gray-400 mt-1">{s.trend}</div>
          </div>
        ))}
      </div>

      {/* User Growth */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionHeader title="User Growth" sub="Patients and practitioners registered over time" />
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="patients" stroke="#0f766e" strokeWidth={2.5} dot={{ r: 4 }} name="Patients" />
            <Line type="monotone" dataKey="practitioners" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 4 }} strokeDasharray="5 5" name="Practitioners" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Appointment Attendance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader title="Appointment Attendance" sub="Attended vs missed per week" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="attended" fill="#0f766e" radius={[4, 4, 0, 0]} name="Attended" />
              <Bar dataKey="missed" fill="#fca5a5" radius={[4, 4, 0, 0]} name="Missed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Condition Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader title="Top Conditions" sub="Distribution across all facilities" />
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={conditionBreakdown} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {conditionBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reminder Effectiveness */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionHeader title="Reminder Effectiveness" sub="How well reminders drive appointments" />
        <div className="grid grid-cols-3 gap-4">
          {reminderStats.map((s, i) => (
            <div key={s.name} className="text-center">
              <div className="relative w-20 h-20 mx-auto">
                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={COLORS[i]}
                    strokeWidth="3"
                    strokeDasharray={`${(s.value / 312) * 100} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{s.value}</span>
                </div>
              </div>
              <div className="text-xs font-medium text-gray-600 mt-2">{s.name}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">
          ✅ Facilities using reminder broadcasts see 40% fewer no-shows. <a href="/admin/reminders" className="text-[#0f766e] font-semibold hover:underline">Send a reminder now →</a>
        </p>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs text-blue-700">
          📌 <strong>Note:</strong> Charts above use placeholder data. Connect your analytics API endpoint (<code className="bg-blue-100 px-1 rounded">GET /api/analytics/summary/</code>) to display real-time data from your database.
        </p>
      </div>
    </div>
  )
}