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

export function SearchPatient() {
  const [query,    setQuery]   = useState('')
  const [results,  setResults] = useState([])
  const [loading,  setLoading] = useState(false)
  const [searched, setSearched]= useState(false)
  const [errMsg,   setErrMsg]  = useState('')

  const doSearch = async (e) => {
    e?.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    setErrMsg('')
    try {
      const r = await api.get(`patients/?search=${encodeURIComponent(query)}`)
      setResults(r.data)
      if (r.data.length === 0) setErrMsg(`No patients found for "${query}".`)
    } catch (err) {
      setResults([])
      setErrMsg(err.response?.status === 403
        ? 'Your account must be approved by an admin before you can search patients.'
        : 'Search failed — check your internet connection.')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🔍 Search Patient</h1>
        <p className="text-sm text-gray-500 mt-0.5">Find a patient, then take action directly from the results</p>
      </div>

      {/* Search bar */}
      <form onSubmit={doSearch} className="flex gap-3">
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setErrMsg('') }}
          className={`${ic} flex-1`}
          placeholder="Name, email, or patient ID…"
          autoFocus
          disabled={loading}
        />
        <button type="submit" disabled={loading || !query.trim()}
          className="flex-shrink-0 flex items-center gap-2 bg-[#0f766e] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#14b8a6] transition-colors disabled:opacity-60">
          {loading ? <><Spinner/>Searching…</> : 'Search'}
        </button>
      </form>

      {errMsg && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex gap-2">
          <span>⚠️</span><span>{errMsg}</span>
        </div>
      )}

      {/* Results */}
      {searched && !errMsg && results.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide">
            {results.length} patient{results.length !== 1 ? 's' : ''} found
          </div>
          <div className="divide-y divide-gray-50">
            {results.map(p => {
              const name = [p.user?.first_name, p.user?.last_name].filter(Boolean).join(' ') || p.user?.username || `Patient #${p.id}`
              return (
                <div key={p.id} className="px-5 py-4 hover:bg-gray-50/60 transition-colors">
                  {/* Identity row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-[#0f766e] flex-shrink-0">
                      {name[0]?.toUpperCase() || 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900">{name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {p.user?.email} · {p.facility?.name || 'No facility'} · ID: {p.id}
                      </p>
                      {p.phone
                        ? <p className="text-xs text-teal-600 mt-0.5">📱 {p.phone}</p>
                        : <p className="text-xs text-amber-600 mt-0.5">⚠️ No phone — SMS reminders won't reach this patient</p>}
                    </div>
                  </div>
                  {/* Action links — React Router <Link>, NOT <a href> */}
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/practitioner/history?patient=${p.id}`}
                      className="text-xs bg-teal-50 text-[#0f766e] font-semibold px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors">
                      📋 History
                    </Link>
                    <Link to={`/practitioner/review?patient=${p.id}`}
                      className="text-xs bg-sky-50 text-sky-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-sky-100 transition-colors">
                      📅 Schedule
                    </Link>
                    <Link to={`/practitioner/assessment?patient=${p.id}`}
                      className="text-xs bg-violet-50 text-violet-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">
                      📝 Assessment
                    </Link>
                    <Link to={`/practitioner/medication?patient=${p.id}`}
                      className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
                      💊 Medication
                    </Link>
                    <Link to={`/practitioner/reminders?patient=${p.id}`}
                      className="text-xs bg-amber-50 text-amber-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors">
                      🔔 Remind
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-xs text-blue-800">
        💡 Tip: Search by email for the most accurate match. Click any action button to go directly to that page with the patient pre-filled.
      </div>
    </div>
  )
}
