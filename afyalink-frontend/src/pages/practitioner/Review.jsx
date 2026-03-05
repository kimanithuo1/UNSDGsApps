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

export function ScheduleReview() {
  const [form, setForm] = useState({ patient_id: '', date: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.patient_id || !form.date) { setStatus({ type: 'error', msg: 'Patient ID and review date are required.' }); return }
    setLoading(true)
    try {
      await api.post('appointments/', { patient: form.patient_id, date: form.date, notes: form.notes })
      setStatus({ type: 'success', msg: `Review scheduled for ${new Date(form.date).toLocaleDateString('en-KE', { dateStyle: 'full' })}.` })
      setForm({ patient_id: '', date: '', notes: '' })
    } catch (err) {
      setStatus({ type: 'error', msg: Object.values(err.response?.data || {}).flat().join(' ') || 'Failed to schedule review.' })
    } finally { setLoading(false) }
  }

  return (
    <FormShell title="📅 Schedule Review / Appointment" sub="Book a follow-up appointment for a patient." onSubmit={handleSubmit} loading={loading} status={status} cta="Schedule Review">
      <Field label="Patient ID *">
        <input className={inputCls} placeholder="Patient user ID" value={form.patient_id} onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))} />
      </Field>
      <Field label="Review Date & Time *">
        <input type="datetime-local" className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
      </Field>
      <Field label="Notes">
        <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Purpose of review, what to check…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      </Field>
      <div className="rounded-xl bg-teal-50 border border-teal-100 p-4 text-xs text-teal-800">
        💡 After scheduling, use <strong>Send Reminders</strong> to notify the patient via SMS or WhatsApp — no app required on their phone.
      </div>
    </FormShell>
  )
}
