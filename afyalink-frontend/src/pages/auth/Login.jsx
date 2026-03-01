import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../lib/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      // Backend uses email as username (set during registration)
      const res = await api.post('auth/login/', { username: email, password })
      localStorage.setItem('token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)

      const me = await api.get('auth/me/')
      const groups = Array.isArray(me.data.groups) ? me.data.groups : []

      if (groups.includes('Facility Admin')) {
        navigate('/admin')
      } else if (groups.includes('Practitioner')) {
        navigate('/practitioner')
      } else {
        navigate('/patient')
      }
    } catch (err) {
      // Surface the actual server error if available
      const detail = err.response?.data?.detail
      if (detail) {
        setError(detail)
      } else if (err.code === 'ECONNABORTED') {
        setError('The server took too long to respond. The backend may be waking up — please try again in 30 seconds.')
      } else if (!err.response) {
        setError('Could not reach the server. Check your internet connection.')
      } else {
        setError('Invalid email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#0f766e] flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-black">AL</span>
            </div>
            <span className="text-xl font-bold text-[#0f766e]">AFYALINK</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to access your health records</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <button
              className="w-full rounded-xl bg-[#0f766e] text-white font-semibold px-6 py-3.5 shadow-md hover:bg-[#14b8a6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0f766e] font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Note: The server may take up to 30 seconds to respond on first load (free hosting cold start).
        </p>
      </div>
    </div>
  )
}