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

export function SearchPatient() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const r = await api.get(`patients/?search=${encodeURIComponent(query)}`)
      setResults(r.data)
    } catch {
      setResults([])
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🔍 Search Patient</h1>
        <p className="text-sm text-gray-500 mt-0.5">Find a patient by name, email, or patient ID</p>
      </div>
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={`${inputCls} flex-1`}
          placeholder="Enter patient name, email, or ID…"
        />
        <button type="submit" disabled={loading} className="bg-[#0f766e] text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-[#14b8a6] transition-colors disabled:opacity-60 flex-shrink-0">
          {loading ? '…' : 'Search'}
        </button>
      </form>

      {searched && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {results.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-gray-500 text-sm">No patients found for "{query}"</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {results.map(p => {
                const name = `${p.user?.first_name || ''} ${p.user?.last_name || ''}`.trim() || p.user?.username
                return (
                  <div key={p.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-[#0f766e]">
                        {name[0]?.toUpperCase() || 'P'}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{name}</div>
                        <div className="text-xs text-gray-400">{p.facility?.name || ''} · ID: {p.id}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={`/practitioner/history?patient=${p.id}`} className="text-xs bg-teal-50 text-[#0f766e] font-semibold px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors">View History</a>
                      <a href={`/practitioner/reminders?patient=${p.id}`} className="text-xs bg-amber-50 text-amber-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors">Remind</a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
