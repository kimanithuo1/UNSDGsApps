import { Helmet } from 'react-helmet'
export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>Contact AFYALINK – Support and Facility Onboarding</title>
        <meta name="description" content="Contact AFYALINK support or request facility onboarding. We help patients and clinics securely manage records and reminders." />
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
      <p className="mt-3 text-gray-700 max-w-3xl">Reach out for support, onboarding, or partnership inquiries.</p>
      <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="w-full rounded-lg border p-3 focus:ring focus:ring-primary/30" placeholder="Name" aria-label="Name" />
        <input className="w-full rounded-lg border p-3 focus:ring focus:ring-primary/30" placeholder="Email" aria-label="Email" />
        <textarea className="md:col-span-2 w-full rounded-lg border p-3 focus:ring focus:ring-primary/30" placeholder="Message" rows={4} aria-label="Message" />
        <button className="md:col-span-2 rounded-lg bg-primary-dark px-6 py-3 text-white shadow-md hover:bg-primary">Send</button>
      </form>
      <div className="mt-6 text-sm text-gray-700">
        <p>Email: support@afyalink.example</p>
      </div>
    </div>
  )
}
