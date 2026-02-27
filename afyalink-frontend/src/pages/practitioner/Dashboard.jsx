export default function PractitionerDashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Practitioner Dashboard</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Tile title="Search Patient" />
        <Tile title="Add Assessment" />
        <Tile title="Log Diagnosis" />
        <Tile title="Add Medication" />
        <Tile title="Schedule Review" />
        <Tile title="View Patient History" />
        <Tile title="Chronic Monitoring" />
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
