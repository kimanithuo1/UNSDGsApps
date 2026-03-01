import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../lib/api'

const roles = ['Patient', 'Practitioner', 'Facility Admin']

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Patient',
    facility_code: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const needsFacility = form.role === 'Patient' || form.role === 'Practitioner'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Name, email, and password are required.')
      return
    }
    if (needsFacility && !form.facility_code.trim()) {
      setError('Facility code is required for Patient and Practitioner roles.')
      return
    }

    setLoading(true)
    try {
      await api.post('auth/register/', form)

      // Auto login after registration
      const loginRes = await api.post('auth/login/', {
        username: form.email,
        password: form.password,
      })
      localStorage.setItem('token', loginRes.data.access)
      localStorage.setItem('refresh_token', loginRes.data.refresh)

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
      const data = err.response?.data
      // DRF validation errors can be nested objects or arrays
      if (data && typeof data === 'object') {
        const messages = Object.values(data).flat().join(' ')
        setError(messages || 'Registration failed. Please check your details.')
      } else if (err.code === 'ECONNABORTED') {
        setError('The server took too long to respond. It may be waking up — please try again in 30 seconds.')
      } else if (!err.response) {
        setError('Could not reach the server. Check your internet connection.')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#0f766e] flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-black">AL</span>
            </div>
            <span className="text-xl font-bold text-[#0f766e]">AFYALINK</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Free to join. Your health data, under your control.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="name">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition"
                placeholder="Your full name"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="reg-email">
                Email address *
              </label>
              <input
                id="reg-email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="reg-password">
                Password *
              </label>
              <input
                id="reg-password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition"
                placeholder="Choose a strong password"
                type="password"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="role">
                I am a *
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition bg-white"
                disabled={loading}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Conditionally show facility code — hidden for Facility Admin */}
            {needsFacility && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5" htmlFor="facility_code">
                  Facility Code *
                </label>
                <input
                  id="facility_code"
                  name="facility_code"
                  value={form.facility_code}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition"
                  placeholder="Ask your clinic for their facility code"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Your clinic or hospital will provide this code. If you don't have one, contact your facility.
                </p>
              </div>
            )}

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
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0f766e] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Note: The server may take up to 30 seconds on first load (free hosting cold start).
        </p>
      </div>
    </div>
  )
}