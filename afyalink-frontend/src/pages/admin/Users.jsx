export function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('users/').then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    `${u.first_name} ${u.last_name} ${u.email} ${u.username}`.toLowerCase().includes(search.toLowerCase())
  )

  const roleBadge = (groups) => {
    const g = groups?.[0]
    const map = {
      'Patient': 'bg-sky-100 text-sky-700',
      'Practitioner': 'bg-violet-100 text-violet-700',
      'Facility Admin': 'bg-amber-100 text-amber-700',
      'Super Admin': 'bg-red-100 text-red-700',
    }
    return { label: g || 'Unknown', cls: map[g] || 'bg-gray-100 text-gray-600' }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">👥 Manage Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">View and manage all registered platform users</p>
        </div>
      </div>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/40 focus:border-[#0f766e] transition"
          placeholder="Search by name or email…"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">👤</div>
            <p className="text-gray-500 text-sm">{search ? 'No users match your search.' : 'No users registered yet.'}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => {
                const { label, cls } = roleBadge(u.groups)
                const name = `${u.first_name} ${u.last_name}`.trim() || u.username
                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-[#0f766e] flex-shrink-0">
                          {name[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-gray-900">{name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{u.email}</td>
                    <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>{label}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
