import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../lib/api'

const ROLES = [
  { value: 'Patient',       icon: '🧑‍⚕️', label: 'Patient',              desc: 'Access records, prescriptions & appointment reminders' },
  { value: 'Practitioner',  icon: '👨‍⚕️', label: 'Practitioner / Doctor', desc: 'Manage patient care, log diagnoses & send reminders' },
  { value: 'Facility Admin',icon: '🏥',  label: 'Facility Admin',         desc: 'Manage a clinic, approve users & view analytics' },
]

const ic = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-[#0f766e] transition disabled:opacity-60'
const lc = 'block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5'

export default function Register() {
  const [step,   setStep]   = useState(1)
  const [role,   setRole]   = useState('')
  const [form,   setForm]   = useState({ name:'',email:'',password:'',confirmPassword:'',phone:'',location:'',facility_code:'',id_number:'' })
  const [showPw, setShowPw] = useState(false)
  const [error,  setError]  = useState('')
  const [loading,setLoading]= useState(false)
  const navigate = useNavigate()

  const isPatient = role === 'Patient', isPrac = role === 'Practitioner', isAdmin = role === 'Facility Admin'
  const set = f => e => { setError(''); setForm(p => ({ ...p, [f]: e.target.value })) }

  const validate = () => {
    if (!form.name.trim())   return 'Please enter your full name.'
    if (!form.email.trim())  return 'Please enter your email address.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.'
    if (!form.password)      return 'Please create a password.'
    if (form.password.length < 8) return 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    if (isPrac && !form.location.trim() && !form.facility_code.trim()) return 'Please enter your clinic or hospital name.'
    return null
  }

  const submit = async e => {
    e.preventDefault()
    setError('')
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)
    try {
      await api.post('auth/register/', {
        name: form.name.trim(), email: form.email.trim().toLowerCase(),
        password: form.password, role,
        phone: form.phone.trim(), location: form.location.trim(),
        facility_code: form.facility_code.trim().toUpperCase(), id_number: form.id_number.trim(),
      })
      if (isPrac || isAdmin) {
        navigate('/login', { state: { notice: `Your ${role} account has been created and is pending admin activation.${form.phone ? ' You will receive an SMS once approved.' : ''}` } })
        return
      }
      const lr = await api.post('auth/login/', { username: form.email.trim().toLowerCase(), password: form.password })
      localStorage.setItem('token', lr.data.access)
      localStorage.setItem('refresh_token', lr.data.refresh)
      navigate('/patient')
    } catch (err) {
      const d = err.response?.data
      if (d?.detail) setError(d.detail)
      else if (d && typeof d === 'object') setError(Object.values(d).flat().join(' ') || 'Registration failed.')
      else if (err.code === 'ECONNABORTED') setError('Server is waking up — wait 30 seconds and try again.')
      else if (!err.response) setError('No internet connection. Please check your network.')
      else setError('Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50/30 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#0f766e] flex items-center justify-center shadow-md group-hover:bg-[#14b8a6] transition-colors">
              <span className="text-white text-xs font-black">AL</span>
            </div>
            <span className="text-xl font-bold text-[#0f766e]">AFYALINK</span>
          </Link>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-7">
            <h1 className="text-2xl font-bold text-gray-900 text-center">Join AFYALINK</h1>
            <p className="text-sm text-gray-500 text-center mt-1 mb-6">Free · Secure · Works on low bandwidth</p>
            <div className="space-y-3">
              {ROLES.map(r => (
                <button key={r.value} onClick={() => { setRole(r.value); setStep(2) }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-teal-50 hover:border-teal-200 transition-all text-left group">
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-2xl group-hover:shadow-md transition flex-shrink-0">{r.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{r.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-snug">{r.desc}</div>
                  </div>
                  <span className="text-gray-300 group-hover:text-[#0f766e] text-lg flex-shrink-0">›</span>
                </button>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-[#0f766e] font-semibold hover:underline">Sign in</Link></p>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-7">
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => { setStep(1); setError('') }} className="text-gray-400 hover:text-gray-700 text-xl leading-none transition-colors" aria-label="Back">←</button>
              <div><span className="text-lg mr-1.5">{ROLES.find(r => r.value === role)?.icon}</span><span className="font-bold text-gray-900">Register as {role}</span></div>
            </div>

            {error && (
              <div className="mb-5 flex gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <span className="flex-shrink-0">⚠️</span><span>{error}</span>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4" noValidate>
              <div>
                <label className={lc} htmlFor="rn">Full Name *</label>
                <input id="rn" className={ic} placeholder="Your full name" value={form.name} onChange={set('name')} disabled={loading} autoComplete="name" />
              </div>
              <div>
                <label className={lc} htmlFor="re">Email Address *</label>
                <input id="re" type="email" className={ic} placeholder="you@example.com" value={form.email} onChange={set('email')} disabled={loading} autoComplete="email" />
              </div>
              <div>
                <label className={lc} htmlFor="rp">Password * <span className="text-gray-400 font-normal normal-case">(min 8 chars)</span></label>
                <div className="relative">
                  <input id="rp" type={showPw ? 'text' : 'password'} className={`${ic} pr-14`} placeholder="Create a strong password"
                    value={form.password} onChange={set('password')} disabled={loading} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-medium">{showPw ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <div>
                <label className={lc} htmlFor="rp2">Confirm Password *</label>
                <input id="rp2" type={showPw ? 'text' : 'password'}
                  className={`${ic} ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-300' : ''}`}
                  placeholder="Repeat your password" value={form.confirmPassword} onChange={set('confirmPassword')} disabled={loading} />
                {form.confirmPassword && form.password !== form.confirmPassword && <p className="text-xs text-red-500 mt-1">Passwords don't match</p>}
              </div>

              {!isAdmin && (
                <div>
                  <label className={lc} htmlFor="rph">Phone {isPatient ? <span className="text-gray-400 font-normal normal-case">(recommended)</span> : <span className="text-red-400">*</span>}</label>
                  <input id="rph" type="tel" className={ic} placeholder="0712 345 678 or +254 712 345 678" value={form.phone} onChange={set('phone')} disabled={loading} />
                  <p className="text-xs text-gray-400 mt-1">📱 For appointment & medication reminders via SMS — no internet needed.</p>
                </div>
              )}

              {isPrac && (
                <>
                  <div>
                    <label className={lc} htmlFor="rl">Clinic / Hospital Name *</label>
                    <input id="rl" className={ic} placeholder="e.g. Nairobi Community Clinic" value={form.location} onChange={set('location')} disabled={loading} />
                    <p className="text-xs text-gray-400 mt-1">Enter your clinic name. Use the code below if it's already registered on AFYALINK.</p>
                  </div>
                  <div>
                    <label className={lc} htmlFor="rc">Facility Code <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                    <input id="rc" className={`${ic} font-mono tracking-widest uppercase`} placeholder="e.g. NCC-001"
                      value={form.facility_code} onChange={e => { setError(''); setForm(p => ({ ...p, facility_code: e.target.value.toUpperCase() })) }} disabled={loading} />
                  </div>
                </>
              )}

              {isPatient && (
                <div>
                  <label className={lc} htmlFor="rid">National ID <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                  <input id="rid" className={ic} placeholder="e.g. 12345678" value={form.id_number} onChange={set('id_number')} disabled={loading} />
                  <p className="text-xs text-gray-400 mt-1">Helps link records across facilities. Not required to register.</p>
                </div>
              )}

              {isAdmin && (
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-xs text-amber-800">
                  🔔 Facility Admin accounts are reviewed before activation. You'll receive an SMS or email once approved.
                </div>
              )}

              <button type="submit"
                disabled={loading || Boolean(form.confirmPassword && form.password !== form.confirmPassword)}
                className="w-full rounded-xl bg-[#0f766e] text-white font-semibold py-3.5 shadow-md hover:bg-[#14b8a6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1">
                {loading
                  ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Creating account…</>
                  : `Create ${role} Account`}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-[#0f766e] font-semibold hover:underline">Sign in</Link></p>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-gray-400">⏳ Server may take up to 30s on first load (free hosting cold start)</p>
      </div>
    </div>
  )
}