import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

export function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('prescriptions/').then(r => setPrescriptions(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">💊 Prescriptions</h1>
        <p className="text-sm text-gray-500 mt-0.5">Active medications prescribed by your care team</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">Loading prescriptions…</div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="text-4xl mb-3">💊</div>
          <p className="text-gray-500 text-sm">No prescriptions yet. Your doctor will add medications here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prescriptions.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-xl flex-shrink-0">💊</div>
                  <div>
                    <div className="font-bold text-gray-900">{p.medication?.name || 'Medication'}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{p.dosage}</div>
                  </div>
                </div>
                <span className="text-xs bg-teal-100 text-teal-700 font-semibold px-2.5 py-1 rounded-full">Active</span>
              </div>
              {p.instructions && (
                <div className="mt-3 bg-gray-50 rounded-xl p-3 text-xs text-gray-600 leading-relaxed">
                  📌 {p.instructions}
                </div>
              )}
              <div className="mt-3 text-xs text-gray-400">
                Prescribed: {new Date(p.created_at).toLocaleDateString('en-KE', { dateStyle: 'medium' })} · {p.facility?.name}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
        <p className="text-xs text-amber-800">
          💊 <strong>Medication reminder:</strong> Never stop or change medication without consulting your doctor. Contact your clinic if you have side effects.
        </p>
      </div>
    </div>
  )
}
