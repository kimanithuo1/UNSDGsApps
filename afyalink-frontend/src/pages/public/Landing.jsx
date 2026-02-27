import { Link } from 'react-router-dom'
export default function Landing() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
          Calm, modern healthcare for everyone
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Secure records, timely reminders, and insightful monitoring built for low-bandwidth environments.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/register" className="rounded-xl bg-primary px-5 py-3 text-white shadow-sm hover:bg-primary/90">
            Get started
          </Link>
          <Link to="/about" className="rounded-xl px-5 py-3 border bg-white hover:bg-gray-50">
            Learn more
          </Link>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Patients" text="View records, prescriptions, and reminders." />
        <Card title="Providers" text="Log assessments, diagnoses, and treatments." />
        <Card title="Facilities" text="Securely share treatment history across institutions." />
      </div>
    </div>
  )
}

function Card({ title, text }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{text}</p>
    </div>
  )
}
