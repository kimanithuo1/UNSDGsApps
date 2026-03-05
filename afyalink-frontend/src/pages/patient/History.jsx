import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

export function MedicalHistory() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('records/').then(r => setRecords(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📋 Medical History</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your complete clinical record timeline</p>
      </div>
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">Loading records…</div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500 text-sm">No medical records yet. Records will appear here after your first clinic visit on AFYALINK.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-teal-100" />
          <div className="space-y-4">
            {records.map((rec, i) => (
              <div key={rec.id} className="relative flex gap-5">
                <div className="relative z-10 w-10 h-10 rounded-full bg-[#0f766e] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                  {i + 1}
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-w-0">
                  <div className="text-xs text-gray-400 mb-1">{new Date(rec.created_at).toLocaleDateString('en-KE', { dateStyle: 'long' })} · {rec.facility?.name || 'Clinic'}</div>
                  <p className="text-sm text-gray-800 leading-relaxed">{rec.assessment}</p>
                  {rec.diagnoses?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {rec.diagnoses.map(d => (
                        <span key={d.id} className="text-xs bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-full">🩺 {d.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}