import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

export function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('appointments/').then(r => setAppointments(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const upcoming = appointments.filter(a => new Date(a.date) >= new Date())
  const past = appointments.filter(a => new Date(a.date) < new Date())

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📅 Appointments</h1>
        <p className="text-sm text-gray-500 mt-0.5">Upcoming and past visits scheduled for you</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">Loading appointments…</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-gray-500 text-sm">No appointments scheduled. Your doctor will add upcoming visits here.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-700 mb-3">Upcoming</h2>
              <div className="space-y-3">
                {upcoming.map(a => (
                  <div key={a.id} className="bg-white rounded-2xl border-l-4 border-l-[#0f766e] border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-gray-900">{new Date(a.date).toLocaleDateString('en-KE', { dateStyle: 'full' })}</div>
                        <div className="text-sm text-[#0f766e] font-medium mt-0.5">{new Date(a.date).toLocaleTimeString('en-KE', { timeStyle: 'short' })}</div>
                        <div className="text-xs text-gray-500 mt-1">{a.facility?.name || 'Your clinic'}</div>
                        {a.notes && <div className="text-xs text-gray-600 mt-1">📌 {a.notes}</div>}
                      </div>
                      <span className="text-xs bg-teal-100 text-teal-700 font-semibold px-2.5 py-1 rounded-full flex-shrink-0">Upcoming</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-500 mb-3">Past</h2>
              <div className="space-y-2">
                {past.map(a => (
                  <div key={a.id} className="bg-gray-50 rounded-xl border border-gray-100 px-5 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-600">{new Date(a.date).toLocaleDateString('en-KE', { dateStyle: 'medium' })}</div>
                      <div className="text-xs text-gray-400">{a.facility?.name}</div>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-500 font-medium px-2.5 py-1 rounded-full">Past</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
