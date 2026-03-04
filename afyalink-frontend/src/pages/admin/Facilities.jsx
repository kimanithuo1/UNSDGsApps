import { useState, useEffect } from 'react'
import api from '../../lib/api'

export default function ManageFacilities() {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', address: '' })
  const [status, setStatus] = useState({ type: '', msg: '' })

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const r = await api.get('facilities/')
        if (!cancelled) setFacilities(r.data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.code) { setStatus({ type: 'error', msg: 'Name and code are required.' }); return }
    try {
      await api.post('facilities/', form)
      setStatus({ type: 'success', msg: `Facility "${form.name}" created with code ${form.code}.` })
      setForm({ name: '', code: '', address: '' })
      setShowForm(false)
      const r = await api.get('facilities/')
      setFacilities(r.data)
    } catch (err) {
      const msg = Object.values(err.response?.data || {}).flat().join(' ') || 'Failed to create facility.'
      setStatus({ type: 'error', msg })
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🏥 Manage Facilities</h1>
          <p className="text-sm text-gray-500 mt-0.5">Add and manage health facilities registered on AFYALINK</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#0f766e] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md hover:bg-[#14b8a6] transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ Add Facility'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-900">New Facility</h2>
          {status.msg && (
            <div className={`text-sm px-4 py-3 rounded-xl border ${status.type === 'success' ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {status.msg}
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Facility Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e]" placeholder="e.g. Nairobi Community Clinic" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Facility Code *</label>
              <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] font-mono" placeholder="e.g. NCC001" />
              <p className="text-xs text-gray-400 mt-1">Share this code with patients and practitioners to link them to this facility.</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Address</label>
            <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] resize-none" rows={2} placeholder="Physical address or location" />
          </div>
          <button type="submit" className="bg-[#0f766e] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-[#14b8a6] transition-colors">
            Create Facility
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading facilities…</div>
        ) : facilities.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">🏥</div>
            <p className="text-gray-500 text-sm">No facilities yet. Add your first facility above.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Code</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {facilities.map(f => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{f.name}</td>
                  <td className="px-5 py-3.5"><span className="font-mono text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-lg">{f.code}</span></td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{f.address || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
