export default function LogDiagnosis() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Log Diagnosis</h2>
      <form className="mt-4 space-y-3">
        <input className="w-full rounded-xl border p-3" placeholder="Patient ID" />
        <input className="w-full rounded-xl border p-3" placeholder="Diagnosis" />
        <textarea className="w-full rounded-xl border p-3" placeholder="Details" rows={3} />
        <button className="rounded-xl bg-primary px-4 py-2 text-white">Save</button>
      </form>
    </div>
  )
}
