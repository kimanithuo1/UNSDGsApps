import { Helmet } from 'react-helmet'
export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>About AFYALINK – Mission, Vision, and Impact</title>
        <meta name="description" content="AFYALINK aligns with UN SDG 3 to improve health outcomes through secure records, reminders, and monitoring across facilities." />
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-900">About AFYALINK</h1>
      <p className="mt-3 text-gray-700 max-w-3xl">
        AFYALINK is a secure, scalable healthcare platform optimized for low-bandwidth environments. We help patients and providers access records, reminders, and monitoring in a simple, reliable way.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-white p-5 ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mission</h2>
          <p className="mt-2 text-sm text-gray-700">Advance UN SDG 3 by enabling secure, accessible health data and timely care.</p>
        </div>
        <div className="rounded-lg bg-white p-5 ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Vision</h2>
          <p className="mt-2 text-sm text-gray-700">A connected health ecosystem across clinics and regions.</p>
        </div>
        <div className="rounded-lg bg-white p-5 ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Impact</h2>
          <p className="mt-2 text-sm text-gray-700">Better outcomes via reminders, shared records, and monitoring.</p>
        </div>
      </div>
    </div>
  )
}
