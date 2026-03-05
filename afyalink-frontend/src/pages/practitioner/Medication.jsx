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

export function AddMedication() {
  const [form, setForm] = useState({ patient_id: '', medication_name: '', dosage: '', instructions: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.patient_id || !form.medication_name || !form.dosage) { setStatus({ type: 'error', msg: 'Patient, medication, and dosage are required.' }); return }
    setLoading(true)
    try {
      await api.post('prescriptions/', { patient: form.patient_id, medication_name: form.medication_name, dosage: form.dosage, instructions: form.instructions })
      setStatus({ type: 'success', msg: `${form.medication_name} prescribed successfully.` })
      setForm({ patient_id: '', medication_name: '', dosage: '', instructions: '' })
    } catch (err) {
      setStatus({ type: 'error', msg: Object.values(err.response?.data || {}).flat().join(' ') || 'Failed to add medication.' })
    } finally { setLoading(false) }
  }

  return (
    <FormShell title="💊 Add Medication / Prescription" sub="Prescribe a medication and dosage for a patient." onSubmit={handleSubmit} loading={loading} status={status} cta="Prescribe Medication">
      <Field label="Patient ID *">
        <input className={inputCls} placeholder="Patient user ID" value={form.patient_id} onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))} />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Medication Name *">
          <input className={inputCls} placeholder="e.g. Metformin 500mg" value={form.medication_name} onChange={e => setForm(f => ({ ...f, medication_name: e.target.value }))} />
        </Field>
        <Field label="Dosage *">
          <input className={inputCls} placeholder="e.g. 1 tablet twice daily" value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))} />
        </Field>
      </div>
      <Field label="Patient Instructions">
        <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Take with food. Do not skip doses. Follow up in 4 weeks." value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} />
      </Field>
    </FormShell>
  )
}
