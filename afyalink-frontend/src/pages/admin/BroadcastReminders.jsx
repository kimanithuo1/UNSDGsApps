import { useState } from 'react'
import api from '../../lib/api'

const CHANNELS = [
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'sms', label: 'SMS', icon: '📱' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
]

const AUDIENCES = [
  { value: 'all', label: 'All Patients' },
  { value: 'chronic', label: 'Chronic Care Patients' },
  { value: 'missed', label: 'Patients with Missed Appointments' },
  { value: 'unvaccinated', label: 'Vaccination Reminders' },
]

const TEMPLATES = [
  {
    label: '💉 Vaccination Campaign',
    text: 'Hello {name}, this is a reminder from AFYALINK. Please visit your nearest clinic for your scheduled vaccination. Reply STOP to opt out.',
  },
  {
    label: '📅 Appointment Reminder',
    text: 'Hello {name}, you have an upcoming appointment tomorrow. Reply YES to confirm or NO to reschedule. — AFYALINK',
  },
  {
    label: '💊 Medication Reminder',
    text: 'Hi {name}, this is your medication reminder from AFYALINK. Please take your medication as prescribed. Stay healthy!',
  },
  {
    label: '🏥 Missed Appointment Follow-up',
    text: 'Hello {name}, we noticed you missed your last appointment. Please visit or contact your clinic to reschedule. We care about your health.',
  },
  {
    label: '🌍 Health Campaign',
    text: 'Important health notice from AFYALINK: [Your message here]. For more info, visit your nearest health facility.',
  },
]

export default function BroadcastReminders() {
  const [form, setForm] = useState({
    channel: 'sms',
    audience: 'all',
    message: '',
    schedule: 'now',
    scheduled_at: '',
  })
  const [status, setStatus] = useState({ type: '', msg: '' })
  const [loading, setLoading] = useState(false)
  const [charCount, setCharCount] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (name === 'message') setCharCount(value.length)
  }

  const applyTemplate = (text) => {
    setForm(f => ({ ...f, message: text }))
    setCharCount(text.length)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.message.trim()) {
      setStatus({ type: 'error', msg: 'Please enter a message.' })
      return
    }
    setLoading(true)
    setStatus({ type: '', msg: '' })
    try {
      // POST to broadcast endpoint — wire up when backend is ready
      await api.post('reminders/broadcast/', form)
      setStatus({ type: 'success', msg: `Broadcast queued successfully via ${form.channel.toUpperCase()} to ${form.audience}.` })
      setForm(f => ({ ...f, message: '' }))
      setCharCount(0)
    } catch {
      // Graceful fallback — backend endpoint may not exist yet
      setStatus({
        type: 'info',
        msg: 'Message composed. Connect a Twilio/SMS backend to send. See deployment checklist for setup instructions.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📣 Broadcast Reminders</h1>
        <p className="text-sm text-gray-500 mt-1">Send SMS, WhatsApp, or email messages to patient groups. SMS and WhatsApp require no app or internet on the recipient's end.</p>
      </div>

      {/* Channel selector */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Channel</label>
        <div className="flex gap-3">
          {CHANNELS.map((ch) => (
            <button
              key={ch.value}
              type="button"
              onClick={() => setForm(f => ({ ...f, channel: ch.value }))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                form.channel === ch.value
                  ? 'bg-[#0f766e] text-white border-[#0f766e] shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#0f766e]'
              }`}
            >
              {ch.icon} {ch.label}
            </button>
          ))}
        </div>
        {form.channel === 'sms' && (
          <p className="text-xs text-gray-400 mt-2">✅ SMS works on any phone, no data required — best for rural/low-bandwidth patients.</p>
        )}
        {form.channel === 'whatsapp' && (
          <p className="text-xs text-gray-400 mt-2">✅ WhatsApp supports rich content; requires WhatsApp Business API (Twilio/360dialog).</p>
        )}
        {form.channel === 'email' && (
          <p className="text-xs text-gray-400 mt-2">✅ Email for facility admins and registered practitioners with email addresses.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {/* Audience */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Recipient Group</label>
          <select
            name="audience"
            value={form.audience}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition"
          >
            {AUDIENCES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
        </div>

        {/* Templates */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Message Templates</label>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map(t => (
              <button
                key={t.label}
                type="button"
                onClick={() => applyTemplate(t.text)}
                className="text-xs px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-100 text-[#0f766e] font-medium hover:bg-teal-100 transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Message *</label>
            <span className={`text-xs ${charCount > 160 ? 'text-amber-600' : 'text-gray-400'}`}>
              {charCount} chars {form.channel === 'sms' && charCount > 160 ? '(2 SMS)' : form.channel === 'sms' ? '(1 SMS)' : ''}
            </span>
          </div>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition resize-none"
            placeholder="Type your message here or choose a template above. Use {name} for personalisation."
          />
          <p className="text-xs text-gray-400 mt-1">Use <code className="bg-gray-100 px-1 rounded">{'{name}'}</code> to personalise with the patient's first name.</p>
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">When to Send</label>
          <div className="flex gap-3 mb-3">
            {['now', 'scheduled'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setForm(f => ({ ...f, schedule: opt }))}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                  form.schedule === opt
                    ? 'bg-[#0f766e] text-white border-[#0f766e]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#0f766e]'
                }`}
              >
                {opt === 'now' ? '⚡ Send Now' : '🕐 Schedule'}
              </button>
            ))}
          </div>
          {form.schedule === 'scheduled' && (
            <input
              type="datetime-local"
              name="scheduled_at"
              value={form.scheduled_at}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition"
            />
          )}
        </div>

        {status.msg && (
          <div className={`text-sm px-4 py-3 rounded-xl border ${
            status.type === 'success' ? 'bg-teal-50 text-teal-800 border-teal-200' :
            status.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-sky-50 text-sky-800 border-sky-200'
          }`}>
            {status.msg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#0f766e] text-white font-semibold py-3.5 shadow-md hover:bg-[#14b8a6] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Sending…</>
          ) : `📤 Send via ${CHANNELS.find(c => c.value === form.channel)?.label}`}
        </button>
      </form>

      
    </div>
  )
}
