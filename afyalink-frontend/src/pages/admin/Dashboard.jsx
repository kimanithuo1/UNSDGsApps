export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Tile title="Manage Facilities" />
        <Tile title="Manage Users" />
        <Tile title="System Logs" />
        <Tile title="Analytics" />
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
