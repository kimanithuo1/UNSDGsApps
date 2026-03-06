import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../../lib/api'

// ─── shared primitives ────────────────────────────────────────────────────────

const ic = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition bg-white disabled:opacity-60 disabled:bg-gray-50'

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  )
}

function StatusBanner({ status }) {
  if (!status?.msg) return null
  const s = { success:'bg-teal-50 text-teal-800 border-teal-200', error:'bg-red-50 text-red-700 border-red-200', info:'bg-sky-50 text-sky-800 border-sky-200' }
  return <div className={`text-sm px-4 py-3 rounded-xl border ${s[status.type]||s.info}`}>{status.msg}</div>
}

function FieldRow({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

/** Pill showing confirmed patient — always visible once selected */
function PatientPill({ patient, onClear }) {
  if (!patient) return null
  const name = [patient.user?.first_name, patient.user?.last_name].filter(Boolean).join(' ') || patient.user?.username || `Patient #${patient.id}`
  return (
    <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-[#0f766e] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
          {name[0]?.toUpperCase() || 'P'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-500 truncate">
            ID: {patient.id}
            {patient.facility?.name ? ` · ${patient.facility.name}` : ''}
            {patient.phone ? ` · 📱 ${patient.phone}` : ' · ⚠️ No phone'}
          </p>
        </div>
      </div>
      {onClear && (
        <button type="button" onClick={onClear}
          className="ml-3 text-xs text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 font-medium">
          ✕ Change
        </button>
      )}
    </div>
  )
}

/**
 * Reusable patient finder widget.
 * Accepts a string query (name / email / ID), hits GET /api/patients/?search=
 * If exactly one result → calls onFound(patient).
 * If multiple → shows a short pick list.
 * Auto-fires when initialId is a numeric string (coming from URL param).
 */
function PatientFinder({ onFound, initialId = '', disabled = false }) {
  const [q,       setQ]       = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg,     setMsg]     = useState('')

  // When navigated here from SearchPatient with ?patient=ID, auto-resolve
  useEffect(() => {
    if (initialId && !isNaN(Number(initialId))) {
      resolveById(initialId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId])

  const resolveById = async (id) => {
    setLoading(true)
    setMsg('')
    try {
      const r = await api.get(`patients/?search=${id}`)
      const match = r.data.find(p => String(p.id) === String(id))
      if (match) { onFound(match); return }
      if (r.data.length === 1) { onFound(r.data[0]); return }
      setMsg(`Patient ID ${id} not found.`)
    } catch (err) {
      setMsg(err.response?.status === 403
        ? 'Your account needs admin approval before you can look up patients.'
        : 'Search failed. Check your connection.')
    } finally { setLoading(false) }
  }

  const search = async (e) => {
    e?.preventDefault()
    const query = q.trim()
    if (!query) return
    setLoading(true)
    setMsg('')
    setResults([])
    try {
      const r = await api.get(`patients/?search=${encodeURIComponent(query)}`)
      if (r.data.length === 0) {
        setMsg(`No patients found for "${query}". Try their email or full name.`)
      } else if (r.data.length === 1) {
        onFound(r.data[0])
      } else {
        setResults(r.data)   // multiple → show mini list
      }
    } catch (err) {
      setMsg(err.response?.status === 403
        ? 'Your account needs admin approval before you can look up patients.'
        : 'Search failed. Check your connection.')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-2">
      {/* Search row */}
      <div className="flex gap-2">
        <input
          className={`${ic} flex-1`}
          placeholder="Patient ID, name, or email…"
          value={q}
          onChange={e => { setQ(e.target.value); setMsg(''); setResults([]) }}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), search())}
          disabled={loading || disabled}
        />
        <button
          type="button"
          onClick={search}
          disabled={loading || !q.trim() || disabled}
          className="flex-shrink-0 flex items-center gap-2 bg-[#0f766e] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#14b8a6] transition-colors disabled:opacity-60"
        >
          {loading ? <Spinner /> : '🔍'}
          {!loading && 'Find'}
        </button>
      </div>
      {/* Messages */}
      {msg && <p className="text-xs text-red-600 flex gap-1"><span>⚠️</span>{msg}</p>}
      {/* Multiple results mini-list */}
      {results.length > 1 && (
        <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
          <p className="text-xs text-gray-500 px-4 py-2 bg-gray-50 border-b border-gray-100">{results.length} patients found — select one</p>
          {results.map(p => {
            const name = [p.user?.first_name, p.user?.last_name].filter(Boolean).join(' ') || p.user?.username
            return (
              <button key={p.id} type="button"
                onClick={() => { onFound(p); setResults([]); setQ('') }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-teal-50 transition-colors text-left border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-[#0f766e] flex-shrink-0">
                  {name[0]?.toUpperCase() || 'P'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  <p className="text-xs text-gray-400">ID: {p.id} · {p.facility?.name || 'No facility'}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const TEMPLATES = [
  { label:'📅 Appointment', text:'Hi {name}, you have an appointment tomorrow. Reply YES to confirm or NO to reschedule. — AFYALINK' },
  { label:'💊 Medication',  text:'Hi {name}, please take your prescribed medication today as instructed. — AFYALINK' },
  { label:'📋 Follow-up',   text:'Hi {name}, please schedule your follow-up visit. Your care team is ready. — AFYALINK' },
  { label:'🔬 Lab Results', text:'Hi {name}, your recent test results are ready. Please visit the clinic to discuss. — AFYALINK' },
]

export function SendReminders() {
  const [searchParams] = useSearchParams()
  const initialId = searchParams.get('patient') || ''

  const [patient, setPatient] = useState(null)
  const [form, setForm] = useState({ type:'FOLLOW_UP', message:'', due_date:'' })
  const [loading, setLoading] = useState(false)
  const [status,  setStatus]  = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (!patient)           { setStatus({ type:'error', msg:'Please find and confirm a patient first.' }); return }
    if (!form.message.trim()){ setStatus({ type:'error', msg:'Please enter a message.' }); return }
    if (!form.due_date)     { setStatus({ type:'error', msg:'Please select a send date.' }); return }

    setLoading(true); setStatus(null)
    try {
      const res = await api.post('reminders/', {
        patient:  patient.id,
        type:     form.type,
        message:  form.message,
        due_date: form.due_date,
      })
      const name = [patient.user?.first_name, patient.user?.last_name].filter(Boolean).join(' ') || 'Patient'
      setStatus({
        type:'success',
        msg: res.data.sms_sent
          ? `✅ SMS sent to ${name} (${patient.phone}).`
          : `✅ Reminder saved for ${name}.${patient.phone ? '' : ' No SMS — patient has no phone number.'}`,
      })
      setForm(f => ({ ...f, message:'', due_date:'' }))
      setPatient(null)
    } catch (err) {
      const data = err.response?.data
      setStatus({ type:'error', msg: data?.detail || Object.values(data||{}).flat().join(' ') || 'Failed to send reminder.' })
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-5 max-w-xl">
      <div className="flex items-center gap-3">
        <Link to="/practitioner/search" className="text-gray-400 hover:text-gray-600 text-xl leading-none transition-colors" title="Back">←</Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🔔 Send Reminder</h1>
          <p className="text-sm text-gray-500 mt-0.5">Send an SMS reminder directly to a patient's phone</p>
        </div>
      </div>

      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <StatusBanner status={status} />

        <FieldRow label="Patient *">
          {patient
            ? <PatientPill patient={patient} onClear={() => setPatient(null)} />
            : <PatientFinder onFound={setPatient} initialId={initialId} disabled={loading} />}
        </FieldRow>

        <FieldRow label="Quick Templates">
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map(t => (
              <button key={t.label} type="button"
                onClick={() => setForm(f => ({ ...f, message:t.text }))}
                className="text-xs px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-100 text-[#0f766e] font-medium hover:bg-teal-100 transition-colors">
                {t.label}
              </button>
            ))}
          </div>
        </FieldRow>

        <FieldRow label="Reminder Type">
          <select className={ic} value={form.type} onChange={e => setForm(f => ({ ...f, type:e.target.value }))}>
            <option value="FOLLOW_UP">Follow-up Visit</option>
            <option value="REFILL">Medication Refill</option>
            <option value="MONITOR">Monitoring Check</option>
          </select>
        </FieldRow>

        <FieldRow label="Message *" hint="Use {name} — it's replaced with the patient's first name automatically.">
          <textarea className={`${ic} resize-none`} rows={3}
            placeholder="Type your message or pick a template above…"
            value={form.message} onChange={e => setForm(f => ({ ...f, message:e.target.value }))} disabled={loading} />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">{form.message.length} chars · {Math.ceil(form.message.length/160)||1} SMS</span>
            {patient && (patient.phone
              ? <span className="text-xs text-teal-600">📱 Sends to {patient.phone}</span>
              : <span className="text-xs text-red-500">⚠️ No phone on file</span>)}
          </div>
        </FieldRow>

        <FieldRow label="Send Date *">
          <input type="date" className={ic} value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date:e.target.value }))} disabled={loading} />
        </FieldRow>

        <button type="submit" disabled={loading || !patient || !form.message.trim() || !form.due_date}
          className="w-full rounded-xl bg-[#0f766e] text-white font-semibold py-3.5 shadow-md hover:bg-[#14b8a6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? <><Spinner/>Sending…</> : '📤 Send Reminder via SMS'}
        </button>
      </form>
    </div>
  )
}
