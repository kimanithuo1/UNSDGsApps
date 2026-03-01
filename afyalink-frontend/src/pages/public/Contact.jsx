import { useState } from 'react'
import { Helmet } from 'react-helmet'
import api from '../../lib/api'
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: '', msg: '' })
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', msg: '' })
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', msg: 'All fields are required' })
      return
    }
    try {
      const res = await api.post('contact/', form)
      if (res.status === 200) {
        setStatus({ type: 'success', msg: 'Message sent successfully' })
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus({ type: 'error', msg: 'Failed to send message' })
      }
    } catch {
      setStatus({ type: 'error', msg: 'Failed to send message' })
    }
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>Contact AFYALINK – Support and Facility Onboarding</title>
        <meta name="description" content="Contact AFYALINK support or request facility onboarding. We help patients and clinics securely manage records and reminders." />
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
      <p className="mt-3 text-gray-700 max-w-3xl">Reach out for support, onboarding, or partnership inquiries.</p>
      {status.msg && (
        <div className={`mt-3 text-sm ${status.type === 'success' ? 'text-teal-700' : 'text-red-600'}`}>{status.msg}</div>
      )}
      <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg border p-3 focus:ring focus:ring-[#14b8a6]/30" placeholder="Name" aria-label="Name" />
        <input name="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border p-3 focus:ring focus:ring-[#14b8a6]/30" placeholder="Email" aria-label="Email" type="email" />
        <textarea name="message" value={form.message} onChange={handleChange} className="md:col-span-2 w-full rounded-lg border p-3 focus:ring focus:ring-[#14b8a6]/30" placeholder="Message" rows={4} aria-label="Message" />
        <button className="md:col-span-2 rounded-lg bg-[#0f766e] px-6 py-3 text-white font-semibold shadow-md hover:bg-[#14b8a6]" type="submit">Send</button>
      </form>
      <div className="mt-6 text-sm text-gray-700">
        <p>Email: jtechbyteinsights@gmail.com</p>
      </div>
    </div>
  )
}
