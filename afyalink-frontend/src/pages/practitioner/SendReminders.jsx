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

const REMINDER_TEMPLATES = [
  { label: '📅 Appointment', text: 'Hi {name}, you have an appointment tomorrow. Reply YES to confirm or NO to reschedule. — AFYALINK' },
  { label: '💊 Medication', text: 'Hi {name}, this is a reminder to take your prescribed medication today. Stay healthy! — AFYALINK' },
  { label: '🔬 Lab Results', text: 'Hi {name}, your recent test results are available on your AFYALINK dashboard. Please review them.' },
  { label: '📋 Follow-up', text: 'Hi {name}, please schedule your follow-up visit at your clinic. Your care team is ready for you.' },
]

export function SendReminders() {
  const [form, setForm] = useState({ patient_id: '', channel: 'sms', message: '', type: 'FOLLOW_UP', due_date: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.patient_id || !form.message || !form.due_date) { setStatus({ type: 'error', msg: 'Patient, message, and date are required.' }); return }
    setLoading(true)
    try {
      await api.post('reminders/', { patient: form.patient_id, type: form.type, message: form.message, due_date: form.due_date })
      setStatus({ type: 'success', msg: `Reminder saved. It will be sent via ${form.channel.toUpperCase()} on ${form.due_date}.` })
      setForm(f => ({ ...f, patient_id: '', message: '', due_date: '' }))
    } catch (err) {
      setStatus({ type: 'error', msg: Object.values(err.response?.data || {}).flat().join(' ') || 'Failed to set reminder.' })
    } finally { setLoading(false) }
  }

  return (
    <FormShell title="🔔 Send Patient Reminder" sub="Schedule an SMS, WhatsApp, or email reminder for a patient." onSubmit={handleSubmit} loading={loading} status={status} cta="Send Reminder">
      <Field label="Patient ID *">
        <input className={inputCls} placeholder="Patient user ID" value={form.patient_id} onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))} />
      </Field>
      <Field label="Channel">
        <div className="flex gap-3">
          {[{ v: 'sms', l: '📱 SMS' }, { v: 'whatsapp', l: '💬 WhatsApp' }, { v: 'email', l: '📧 Email' }].map(c => (
            <button key={c.v} type="button" onClick={() => setForm(f => ({ ...f, channel: c.v }))}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${form.channel === c.v ? 'bg-[#0f766e] text-white border-[#0f766e]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#0f766e]'}`}>
              {c.l}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Type">
        <select className={`${inputCls} bg-white`} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
          <option value="FOLLOW_UP">Follow-up</option>
          <option value="REFILL">Medication Refill</option>
          <option value="MONITOR">Monitoring Check</option>
        </select>
      </Field>
      <Field label="Message Templates">
        <div className="flex flex-wrap gap-2">
          {REMINDER_TEMPLATES.map(t => (
            <button key={t.label} type="button" onClick={() => setForm(f => ({ ...f, message: t.text }))}
              className="text-xs px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-100 text-[#0f766e] font-medium hover:bg-teal-100 transition-colors">
              {t.label}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Message *">
        <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Use {name} for personalisation…" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
      </Field>
      <Field label="Send Date *">
        <input type="date" className={inputCls} value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
      </Field>
    </FormShell>
  )
}