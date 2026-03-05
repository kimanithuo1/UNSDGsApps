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

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const sampleVitals = [
  { date: 'Jan 1', bp_s: 130, bp_d: 85, sugar: 7.2, weight: 72 },
  { date: 'Jan 8', bp_s: 128, bp_d: 82, sugar: 6.8, weight: 71.5 },
  { date: 'Jan 15', bp_s: 135, bp_d: 88, sugar: 7.5, weight: 72 },
  { date: 'Jan 22', bp_s: 126, bp_d: 80, sugar: 6.5, weight: 71 },
  { date: 'Jan 29', bp_s: 122, bp_d: 78, sugar: 6.2, weight: 70.5 },
]

export function Monitoring() {
  const [patientId, setPatientId] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [vitals, setVitals] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!patientId) return
    setLoading(true)
    try {
      const r = await api.get(`vitals/?patient=${patientId}`)
      setVitals(r.data.length ? r.data : sampleVitals)
    } catch {
      setVitals(sampleVitals)
    } finally { setLoaded(true); setLoading(false) }
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📊 Chronic Disease Monitoring</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track vitals trends for patients with chronic conditions</p>
      </div>
      <div className="flex gap-3">
        <input value={patientId} onChange={e => setPatientId(e.target.value)} className={`${inputCls} flex-1`} placeholder="Enter Patient ID" />
        <button onClick={load} disabled={loading} className="bg-[#0f766e] text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-[#14b8a6] transition-colors disabled:opacity-60">
          {loading ? '…' : 'Load Vitals'}
        </button>
      </div>

      {loaded && (
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: 'Blood Pressure (mmHg)', keys: [{key:'bp_s', color:'#0f766e', name:'Systolic'},{key:'bp_d', color:'#14b8a6', name:'Diastolic'}] },
              { title: 'Blood Sugar (mmol/L)', keys: [{key:'sugar', color:'#f59e0b', name:'Glucose'}] },
            ].map(chart => (
              <div key={chart.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">{chart.title}</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={vitals}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    {chart.keys.map(k => (
                      <Line key={k.key} type="monotone" dataKey={k.key} stroke={k.color} strokeWidth={2} dot={{ r: 3 }} name={k.name} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs text-amber-800">
            ⚠️ Showing {vitals === sampleVitals ? 'sample' : 'live'} data. Connect <code className="bg-amber-100 px-1 rounded">GET /api/vitals/?patient=ID</code> to display real patient vitals.
          </div>
        </div>
      )}
    </div>
  )
}