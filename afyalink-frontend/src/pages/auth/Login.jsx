import { useState } from 'react'
import api from '../../lib/api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('auth/login/', { username: email, password })
      localStorage.setItem('token', res.data.access)
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
      setError('Invalid credentials')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-900">Login</h2>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-lg border p-3 focus:ring focus:ring-[#14b8a6]/30"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />
        <input
          className="w-full rounded-lg border p-3 focus:ring focus:ring-[#14b8a6]/30"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />
        <button className="w-full rounded-lg bg-[#0f766e] text-white font-semibold px-6 py-3 shadow-md hover:bg-[#14b8a6]" type="submit">
          Login
        </button>
      </form>
    </div>
  )
}
