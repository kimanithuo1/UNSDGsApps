import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

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
  const s = { success:'bg-teal-50 text-teal-800 border-teal-200', error:'bg-red-50 text-red-700 border-red-200' }
  return <div className={`text-sm px-4 py-3 rounded-xl border ${s[status.type]||s.error}`}>{status.msg}</div>
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

function PatientPill({ patient, onClear }) {
  const name = [patient.user?.first_name, patient.user?.last_name].filter(Boolean).join(' ') || patient.user?.username || `Patient #${patient.id}`
  return (
    <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-[#0f766e] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
          {name[0]?.toUpperCase() || 'P'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-500">ID: {patient.id}{patient.facility?.name ? ` · ${patient.facility.name}` : ''}{patient.phone ? ` · 📱 ${patient.phone}` : ' · ⚠️ No phone'}</p>
        </div>
      </div>
      {onClear && <button type="button" onClick={onClear} className="ml-3 text-xs text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 font-medium">✕ Change</button>}
    </div>
  )
}

function PatientFinder({ onFound, disabled }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const search = async (e) => {
    e?.preventDefault()
    const query = q.trim()
    if (!query) return
    setLoading(true); setMsg(''); setResults([])
    try {
      const r = await api.get(`patients/?search=${encodeURIComponent(query)}`)
      if (r.data.length === 0) setMsg(`No patients found for "${query}".`)
      else if (r.data.length === 1) onFound(r.data[0])
      else setResults(r.data)
    } catch (err) {
      setMsg(err.response?.status === 403
        ? 'Your account needs admin approval to look up patients.'
        : 'Search failed — check your connection.')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input className={`${ic} flex-1`} placeholder="Patient ID, name, or email…"
          value={q} onChange={e => { setQ(e.target.value); setMsg(''); setResults([]) }}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), search())}
          disabled={loading || disabled} />
        <button type="button" onClick={search} disabled={loading || !q.trim() || disabled}
          className="flex-shrink-0 flex items-center gap-2 bg-[#0f766e] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#14b8a6] transition-colors disabled:opacity-60">
          {loading ? <Spinner/> : '🔍'}{!loading && ' Find'}
        </button>
      </div>
      {msg && <p className="text-xs text-red-600 flex gap-1"><span>⚠️</span>{msg}</p>}
      {results.length > 1 && (
        <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
          <p className="text-xs text-gray-500 px-4 py-2 bg-gray-50 border-b">{results.length} found — select one</p>
          {results.map(p => {
            const name = [p.user?.first_name, p.user?.last_name].filter(Boolean).join(' ') || p.user?.username
            return (
              <button key={p.id} type="button" onClick={() => { onFound(p); setResults([]); setQ('') }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-teal-50 transition-colors text-left border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-[#0f766e] flex-shrink-0">
                  {name?.[0]?.toUpperCase() || 'P'}
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

const FREQUENCIES = [
  { value: 'once_daily',   label: 'Once daily',        short: 'once a day' },
  { value: 'twice_daily',  label: 'Twice daily',       short: 'twice a day (morning & evening)' },
  { value: 'three_daily',  label: 'Three times daily',  short: '3 times a day (morning, noon & evening)' },
  { value: 'four_daily',   label: 'Four times daily',   short: '4 times a day' },
  { value: 'every_8h',     label: 'Every 8 hours',      short: 'every 8 hours' },
  { value: 'every_12h',    label: 'Every 12 hours',     short: 'every 12 hours' },
  { value: 'weekly',       label: 'Once a week',        short: 'once a week' },
  { value: 'as_needed',    label: 'As needed (PRN)',    short: 'as needed' },
]

const DURATION_OPTIONS = [
  { value: '3',  label: '3 days' },
  { value: '5',  label: '5 days' },
  { value: '7',  label: '1 week' },
  { value: '10', label: '10 days' },
  { value: '14', label: '2 weeks' },
  { value: '21', label: '3 weeks' },
  { value: '30', label: '1 month' },
  { value: '60', label: '2 months' },
  { value: '90', label: '3 months' },
  { value: '180',label: '6 months' },
  { value: '0',  label: 'Ongoing (no end date)' },
]

function buildInstructions(form) {
  if (!form.medication_name || !form.dosage) return ''
  const freq = FREQUENCIES.find(f => f.value === form.frequency)?.short || form.frequency
  const dur  = form.duration_days === '0' ? 'ongoing' : form.duration_days ? `for ${DURATION_OPTIONS.find(d => d.value === form.duration_days)?.label || form.duration_days + ' days'}` : ''
  const timing = form.timing ? ` — ${form.timing}` : ''
  const food = form.with_food === 'with' ? ' Take with food.' : form.with_food === 'without' ? ' Take on an empty stomach.' : ''
  return `Take ${form.dosage} ${freq}${dur ? ' ' + dur : ''}${timing}.${food}${form.extra_instructions ? ' ' + form.extra_instructions : ''}`
}

export default function AddMedication() {
  const [patient, setPatient] = useState(null)
  const [form, setForm] = useState({
    medication_name: '',
    dosage: '',
    frequency: 'twice_daily',
    duration_days: '7',
    timing: '',
    with_food: 'with',
    extra_instructions: '',
    next_review_date: '',
    next_review_notes: '',
  })
  const [loading, setLoading]   = useState(false)
  const [status,  setStatus]    = useState(null)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const autoInstructions = buildInstructions(form)

  const submit = async (e) => {
    e.preventDefault()
    if (!patient) { setStatus({ type:'error', msg:'Please find and confirm a patient first.' }); return }
    if (!form.medication_name.trim()) { setStatus({ type:'error', msg:'Medication name is required.' }); return }
    if (!form.dosage.trim()) { setStatus({ type:'error', msg:'Dosage is required.' }); return }

    setLoading(true); setStatus(null)
    const results = []

    // 1. Save prescription
    try {
      await api.post('prescriptions/', {
        patient: patient.id,
        medication_name: form.medication_name.trim(),
        dosage: form.dosage.trim(),
        instructions: autoInstructions || form.extra_instructions,
      })
      results.push('✅ Prescription saved.')
    } catch (err) {
      const data = err.response?.data
      setStatus({ type:'error', msg: data?.detail || 'Failed to save prescription.' })
      setLoading(false)
      return
    }

    // 2. Schedule review appointment if date provided
    if (form.next_review_date) {
      try {
        const res = await api.post('appointments/', {
          patient: patient.id,
          date: form.next_review_date + 'T09:00',   // default to 9am
          notes: form.next_review_notes || `Review for ${form.medication_name} prescription`,
        })
        results.push(res.data.sms_sent
          ? '📅 Review appointment scheduled and SMS sent to patient.'
          : '📅 Review appointment scheduled.')
      } catch {
        results.push('⚠️ Prescription saved but review appointment failed — schedule it manually.')
      }
    }

    setStatus({ type:'success', msg: results.join(' ') })
    setPatient(null)
    setForm({
      medication_name:'', dosage:'', frequency:'twice_daily', duration_days:'7',
      timing:'', with_food:'with', extra_instructions:'', next_review_date:'', next_review_notes:'',
    })
    setLoading(false)
  }

  return (
    <div className="space-y-5 max-w-xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/practitioner/search" className="text-gray-400 hover:text-gray-600 text-xl leading-none transition-colors" title="Back">←</Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💊 Add Medication</h1>
          <p className="text-sm text-gray-500 mt-0.5">Prescribe medication with a full dosage schedule</p>
        </div>
      </div>

      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <StatusBanner status={status} />

        {/* Patient */}
        <FieldRow label="Patient *">
          {patient
            ? <PatientPill patient={patient} onClear={() => setPatient(null)} />
            : <PatientFinder onFound={setPatient} disabled={loading} />}
        </FieldRow>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Prescription Details</p>
        </div>

        {/* Medication name */}
        <FieldRow label="Medication Name *">
          <input className={ic} placeholder="e.g. Metformin, Amoxicillin, Lisinopril"
            value={form.medication_name} onChange={set('medication_name')} disabled={loading} />
        </FieldRow>

        {/* Dosage */}
        <FieldRow label="Dosage *" hint="Include unit: e.g. 500mg, 1 tablet, 5ml">
          <input className={ic} placeholder="e.g. 500mg, 1 tablet, 2 capsules"
            value={form.dosage} onChange={set('dosage')} disabled={loading} />
        </FieldRow>

        {/* Frequency */}
        <FieldRow label="Frequency *">
          <select className={ic} value={form.frequency} onChange={set('frequency')} disabled={loading}>
            {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </FieldRow>

        {/* Duration */}
        <FieldRow label="Duration">
          <select className={ic} value={form.duration_days} onChange={set('duration_days')} disabled={loading}>
            {DURATION_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </FieldRow>

        {/* Timing */}
        <FieldRow label="Best Time to Take" hint="Optional — helps the patient build a routine">
          <input className={ic} placeholder="e.g. morning with breakfast, before bedtime"
            value={form.timing} onChange={set('timing')} disabled={loading} />
        </FieldRow>

        {/* Food */}
        <FieldRow label="Take With Food?">
          <div className="flex gap-3">
            {[{ v:'with', l:'With food' }, { v:'without', l:'Empty stomach' }, { v:'either', l:'Either way' }].map(opt => (
              <button key={opt.v} type="button"
                onClick={() => setForm(f => ({ ...f, with_food: opt.v }))}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${form.with_food === opt.v ? 'bg-[#0f766e] text-white border-[#0f766e]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#0f766e]'}`}>
                {opt.l}
              </button>
            ))}
          </div>
        </FieldRow>

        {/* Extra instructions */}
        <FieldRow label="Additional Instructions">
          <textarea className={`${ic} resize-none`} rows={2}
            placeholder="e.g. Avoid alcohol. Store in a cool dry place. Do not crush tablets."
            value={form.extra_instructions} onChange={set('extra_instructions')} disabled={loading} />
        </FieldRow>

        {/* Auto-generated instruction preview */}
        {autoInstructions && (
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">SMS / Label Preview</p>
            <p className="text-sm text-blue-900">{autoInstructions}</p>
            {patient?.phone && <p className="text-xs text-blue-600 mt-2">📱 This will be sent to {patient.phone} via SMSLeopard</p>}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 pt-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Next Review <span className="font-normal text-gray-400 normal-case">(optional)</span></p>
        </div>

        {/* Next review date */}
        <FieldRow label="Review Date" hint="Schedules an appointment automatically and sends an SMS reminder">
          <input type="date" className={ic}
            value={form.next_review_date} onChange={set('next_review_date')} disabled={loading}
            min={new Date().toISOString().split('T')[0]} />
        </FieldRow>

        {/* Review notes */}
        {form.next_review_date && (
          <FieldRow label="Review Notes">
            <input className={ic} placeholder={`Review for ${form.medication_name || 'medication'} — response and side effects`}
              value={form.next_review_notes} onChange={set('next_review_notes')} disabled={loading} />
          </FieldRow>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading || !patient || !form.medication_name.trim() || !form.dosage.trim()}
          className="w-full rounded-xl bg-[#0f766e] text-white font-semibold py-3.5 shadow-md hover:bg-[#14b8a6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading
            ? <><Spinner/>Saving…</>
            : <>💾 Save Prescription{form.next_review_date ? ' + Schedule Review' : ''}</>}
        </button>
      </form>

      {/* Info footer */}
      <div className="rounded-2xl bg-teal-50 border border-teal-100 p-4 text-xs text-teal-800 space-y-1">
        <p>📱 <strong>SMS sent automatically</strong> to the patient with the full dosage schedule — no smartphone needed.</p>
        {form.next_review_date && <p>📅 <strong>Review appointment</strong> will be booked and an SMS confirmation sent.</p>}
      </div>
    </div>
  )
}