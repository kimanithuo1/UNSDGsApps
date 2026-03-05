import { useState } from 'react'
import api from '../../lib/api'


function FormShell({ title, sub, children, onSubmit, loading, status, cta = 'Save' }) {
  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {sub && <p className="text-sm text-gray-500 mt-0.5">{sub}</p>}
      </div>
      <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        {status?.msg && (
          <div className={`text-sm px-4 py-3 rounded-xl border ${status.type === 'success' ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {status.msg}
          </div>
        )}
        {children}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#0f766e] text-white font-semibold py-3 shadow-md hover:bg-[#14b8a6] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Saving…</>
          ) : cta}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition"


export function ViewPatientHistory() {
  const [patientId, setPatientId] = useState('')
  const [records, setRecords] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!patientId) return
    setLoading(true)
    try {
      const r = await api.get(`records/?patient=${patientId}`)
      setRecords(r.data)
      setLoaded(true)
    } catch { setRecords([]); setLoaded(true) }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📋 Patient Medical History</h1>
        <p className="text-sm text-gray-500 mt-0.5">View the full clinical record timeline for a patient</p>
      </div>
      <div className="flex gap-3">
        <input value={patientId} onChange={e => setPatientId(e.target.value)} className={`${inputCls} flex-1`} placeholder="Enter Patient ID" />
        <button onClick={load} disabled={loading} className="bg-[#0f766e] text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-[#14b8a6] transition-colors disabled:opacity-60">
          {loading ? '…' : 'Load'}
        </button>
      </div>
      {loaded && (
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 text-sm">No records found for this patient.</div>
          ) : records.map((rec, i) => (
            <div key={rec.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-[#0f766e] font-bold text-xs flex items-center justify-center">{i + 1}</div>
                  <div>
                    <div className="text-xs text-gray-400">{new Date(rec.created_at).toLocaleDateString('en-KE', { dateStyle: 'medium' })} · {rec.facility?.name}</div>
                    <div className="font-medium text-sm text-gray-900 mt-0.5">{rec.assessment?.slice(0, 120)}{rec.assessment?.length > 120 ? '…' : ''}</div>
                  </div>
                </div>
              </div>
              {rec.diagnoses?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {rec.diagnoses.map(d => (
                    <span key={d.id} className="text-xs bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-full">🩺 {d.name}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
