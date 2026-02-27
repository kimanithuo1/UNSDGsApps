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
    try {
      await api.post('auth/register/', form)
      // auto-login
      const loginRes = await api.post('auth/login/', { username: form.email, password: form.password })
      localStorage.setItem('token', loginRes.data.access)
      navigate('/patient')
    } catch {
      setError('Registration failed')
    }
  }
  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-semibold">Register</h2>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border p-3 focus:ring focus:ring-primary/30" placeholder="Full Name" />
        <input name="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border p-3 focus:ring focus:ring-primary/30" placeholder="Email" type="email" />
        <input name="password" value={form.password} onChange={handleChange} className="w-full rounded-xl border p-3 focus:ring focus:ring-primary/30" placeholder="Password" type="password" />
        <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-xl border p-3 focus:ring focus:ring-primary/30">
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <input name="facility_code" value={form.facility_code} onChange={handleChange} className="w-full rounded-xl border p-3 focus:ring focus:ring-primary/30" placeholder="Facility Code (required for Patient/Practitioner)" />
        <button className="w-full rounded-xl bg-primary px-4 py-2 text-white shadow-sm">Create account</button>
      </form>
    </div>
  )
}
