import { useState } from 'react'
import api from '../../lib/api'
import { useNavigate } from 'react-router-dom'

const roles = ['Patient', 'Practitioner', 'Facility Admin']

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: roles[0], facility_code: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if ((form.role === 'Patient' || form.role === 'Practitioner') && !form.facility_code.trim()) {
      setError('Facility code is required for Patient and Practitioner')
      return
    }
    try {
      await api.post('auth/register/', form)
      const loginRes = await api.post('auth/login/', { username: form.email, password: form.password })
      localStorage.setItem('token', loginRes.data.access)
      const me = await api.get('auth/me/')
      const groups = Array.isArray(me.data.groups) ? me.data.groups : []
      if (groups.includes('Facility Admin')) {
        navigate('/admin')
      } else if (groups.includes('Practitioner')) {
        navigate('/practitioner')
      } else {
        navigate('/patient')
      }
    } catch {
      setError('Registration failed')
    }
  }
  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-900">Register</h2>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg border p-3 focus:ring focus:ring-[#14b8a6]/30" placeholder="Full Name" aria-label="Full Name" />
        <input name="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border p-3 focus:ring focus:ring-[#14b8a6]/30" placeholder="Email" type="email" aria-label="Email" />
        <input name="password" value={form.password} onChange={handleChange} className="w-full rounded-lg border p-3 focus:ring focus:ring-[#14b8a6]/30" placeholder="Password" type="password" aria-label="Password" />
        <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-lg border p-3 focus:ring focus:ring-[#14b8a6]/30" aria-label="Role">
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <input name="facility_code" value={form.facility_code} onChange={handleChange} className="w-full rounded-lg border p-3 focus:ring focus:ring-[#14b8a6]/30" placeholder="Facility Code (required for Patient/Practitioner)" aria-label="Facility Code" />
        <button className="w-full rounded-lg bg-[#0f766e] text-white font-semibold px-6 py-3 shadow-md hover:bg-[#14b8a6]" type="submit">Create account</button>
      </form>
    </div>
  )
}
