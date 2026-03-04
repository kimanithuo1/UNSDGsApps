export default function SystemLogs() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🗂️ System Logs</h1>
        <p className="text-sm text-gray-500 mt-0.5">Audit trail of all platform actions — who did what and when</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-gray-700 font-medium">Audit log coming soon</p>
        <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
          Create a <code className="bg-gray-100 px-1 rounded text-xs">GET /api/logs/</code> endpoint that returns
          AuditLog records from your database. Each entry should include <code className="bg-gray-100 px-1 rounded text-xs">user</code>,
          <code className="bg-gray-100 px-1 rounded text-xs">action</code>, <code className="bg-gray-100 px-1 rounded text-xs">timestamp</code>,
          and <code className="bg-gray-100 px-1 rounded text-xs">ip_address</code>.
        </p>
      </div>
    </div>
  )
}
