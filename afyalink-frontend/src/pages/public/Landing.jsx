import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
export default function Landing() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>AFYALINK – Secure Medical Records & Patient Monitoring</title>
        <meta name="description" content="AFYALINK provides secure records, reminders, and monitoring for patients and providers, optimized for low-bandwidth environments." />
      </Helmet>
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Calm, modern healthcare for everyone
        </h1>
        <p className="mt-3 text-gray-700 max-w-2xl mx-auto">
          Secure records, timely reminders, and insightful monitoring built for low-bandwidth environments.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Link to="/register" className="rounded-lg bg-primary-dark px-6 py-3 text-white shadow-md hover:bg-primary">
            Get started
          </Link>
          <Link to="/about" className="rounded-lg px-6 py-3 border border-primary-dark text-primary-dark bg-white hover:bg-primary/5">
            Learn more
          </Link>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Patients" text="View records, prescriptions, and reminders." />
        <Card title="Providers" text="Log assessments, diagnoses, and treatments." />
        <Card title="Facilities" text="Securely share treatment history across institutions." />
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
        <dl className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg bg-white p-4 ring-1 ring-gray-200">
            <dt className="font-medium text-gray-900">What is AFYALINK?</dt>
            <dd className="mt-1 text-sm text-gray-700">A secure platform for managing medical records, reminders, and patient monitoring.</dd>
          </div>
          <div className="rounded-lg bg-white p-4 ring-1 ring-gray-200">
            <dt className="font-medium text-gray-900">How does AFYALINK protect my data?</dt>
            <dd className="mt-1 text-sm text-gray-700">We use encryption, role-based access, and industry-standard security practices.</dd>
          </div>
          <div className="rounded-lg bg-white p-4 ring-1 ring-gray-200">
            <dt className="font-medium text-gray-900">Can multiple clinics share records?</dt>
            <dd className="mt-1 text-sm text-gray-700">Yes, facilities can securely share treatment history and transfer patients.</dd>
          </div>
          <div className="rounded-lg bg-white p-4 ring-1 ring-gray-200">
            <dt className="font-medium text-gray-900">Do I need internet to check reminders?</dt>
            <dd className="mt-1 text-sm text-gray-700">AFYALINK supports low-bandwidth environments; reminders can be delivered via lightweight channels.</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

function Card({ title, text }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-700 mt-1">{text}</p>
    </div>
  )
}
