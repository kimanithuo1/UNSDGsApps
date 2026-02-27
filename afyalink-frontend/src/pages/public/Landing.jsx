import { Link } from 'react-router-dom'
export default function Landing() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
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
