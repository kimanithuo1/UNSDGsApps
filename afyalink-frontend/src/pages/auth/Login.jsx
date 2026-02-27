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
      navigate('/patient')
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-semibold">Login</h2>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-xl border p-3 focus:ring focus:ring-primary/30"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-xl border p-3 focus:ring focus:ring-primary/30"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full rounded-xl bg-primary px-4 py-2 text-white shadow-sm">Login</button>
      </form>
    </div>
  )
}
