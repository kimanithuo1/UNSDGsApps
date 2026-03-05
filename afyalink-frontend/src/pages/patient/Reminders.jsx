import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

export function Reminders() {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('reminders/').then(r => setReminders(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const typeMap = {
    FOLLOW_UP: { icon: '📅', label: 'Follow-up', color: 'bg-sky-100 text-sky-700' },
    REFILL: { icon: '💊', label: 'Medication Refill', color: 'bg-violet-100 text-violet-700' },
    MONITOR: { icon: '📊', label: 'Monitoring', color: 'bg-teal-100 text-teal-700' },
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🔔 Reminder Alerts</h1>
        <p className="text-sm text-gray-500 mt-0.5">Messages and alerts from your care team</p>
      </div>

      <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
        <p className="text-xs text-teal-800">
          💬 Reminders are also sent to you via SMS or WhatsApp — no internet required on your phone. Contact your clinic if you're not receiving messages.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">Loading reminders…</div>
      ) : reminders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-gray-500 text-sm">No reminders yet. Your care team will add reminders here and send them to your phone.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map(r => {
            const meta = typeMap[r.type] || { icon: '🔔', label: r.type, color: 'bg-gray-100 text-gray-600' }
            const isOverdue = !r.is_sent && new Date(r.due_date) < new Date()
            return (
              <div key={r.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${isOverdue ? 'border-red-200' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{meta.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900 leading-relaxed">{r.message}</div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>{meta.label}</span>
                        <span className="text-xs text-gray-400">Due: {new Date(r.due_date).toLocaleDateString('en-KE', { dateStyle: 'medium' })}</span>
                        {isOverdue && <span className="text-xs text-red-600 font-semibold">⚠️ Overdue</span>}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${r.is_sent ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-700'}`}>
                    {r.is_sent ? '✓ Sent' : 'Pending'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}