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

export function LogDiagnosis() {
  const [form, setForm] = useState({ patient_id: '', record_id: '', name: '', details: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.patient_id || !form.name) { setStatus({ type: 'error', msg: 'Patient ID and diagnosis name are required.' }); return }
    setLoading(true)
    try {
      await api.post('diagnoses/', { record: form.record_id, name: form.name, details: form.details })
      setStatus({ type: 'success', msg: `Diagnosis "${form.name}" logged.` })
      setForm({ patient_id: '', record_id: '', name: '', details: '' })
    } catch (err) {
      setStatus({ type: 'error', msg: Object.values(err.response?.data || {}).flat().join(' ') || 'Failed to log diagnosis.' })
    } finally { setLoading(false) }
  }

  return (
    <FormShell title="🩺 Log Diagnosis" sub="Attach a diagnosis to a patient's medical record." onSubmit={handleSubmit} loading={loading} status={status} cta="Log Diagnosis">
      <Field label="Patient ID *">
        <input className={inputCls} placeholder="Patient user ID" value={form.patient_id} onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))} />
      </Field>
      <Field label="Record ID">
        <input className={inputCls} placeholder="Medical Record ID (optional — links to most recent if blank)" value={form.record_id} onChange={e => setForm(f => ({ ...f, record_id: e.target.value }))} />
      </Field>
      <Field label="Diagnosis *">
        <input className={inputCls} placeholder="e.g. Type 2 Diabetes, Hypertension…" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </Field>
      <Field label="Clinical Details">
        <textarea className={`${inputCls} resize-none`} rows={3} placeholder="ICD code, severity, supporting notes…" value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} />
      </Field>
    </FormShell>
  )
}
