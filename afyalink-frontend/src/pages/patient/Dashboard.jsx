export default function PatientDashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Patient Dashboard</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Tile title="Medical History" />
        <Tile title="Prescriptions" />
        <Tile title="Upcoming Appointments" />
        <Tile title="Reminders" />
      </div>
    </div>
  )
}

function Tile({ title }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="font-medium">{title}</div>
    </div>
  )
}
