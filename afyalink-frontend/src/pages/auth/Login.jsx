import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../../lib/api'

export default function Login() {
  const [email,    setEmail]   = useState('')
  const [password, setPassword]= useState('')
  const [error,    setError]   = useState('')
  const [loading,  setLoading] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  // Message passed from registration redirect when account is pending activation
  const notice = location.state?.notice || null

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    try {
      const res = await api.post('auth/login/', { username: email.trim().toLowerCase(), password })
      localStorage.setItem('token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
      const me = await api.get('auth/me/')
      const groups = Array.isArray(me.data.groups) ? me.data.groups : []
      if (groups.includes('Facility Admin'))  navigate('/admin')
      else if (groups.includes('Practitioner')) navigate('/practitioner')
      else navigate('/patient')
    } catch (err) {
      const detail = err.response?.data?.detail
      if (detail === 'No active account found with the given credentials')
        setError('Account not found or not yet activated. Check your email or contact the admin.')
      else if (detail) setError(detail)
      else if (err.code === 'ECONNABORTED') setError('Server is waking up — wait 30 seconds and try again.')
      else if (!err.response) setError('No internet connection. Please check your network.')
      else setError('Invalid email or password.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#0f766e] flex items-center justify-center shadow-md group-hover:bg-[#14b8a6] transition-colors">
              <span className="text-white text-xs font-black">AL</span>
            </div>
            <span className="text-xl font-bold text-[#0f766e]">AFYALINK</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-5">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to access your health records</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8">

          {/* Pending activation notice from registration */}
          {notice && (
            <div className="mb-5 flex gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-4">
              <span className="text-lg flex-shrink-0">⏳</span>
              <span>{notice}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 flex gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <span className="flex-shrink-0">⚠️</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5" htmlFor="li-email">Email Address</label>
              <input id="li-email" type="email"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-[#0f766e] transition"
                placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="email" disabled={loading} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5" htmlFor="li-pw">Password</label>
              <input id="li-pw" type="password"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-[#0f766e] transition"
                placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                autoComplete="current-password" disabled={loading} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-[#0f766e] text-white font-semibold py-3.5 shadow-md hover:bg-[#14b8a6] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading
                ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Signing in…</>
                : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-[#0f766e] font-semibold hover:underline">Create one free</Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">⏳ Server may take up to 30s on first load (free hosting cold start)</p>
      </div>
    </div>
  )
}