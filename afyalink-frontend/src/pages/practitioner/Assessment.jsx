export default function AddAssessment() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Add Medical Assessment</h2>
      <form className="mt-4 space-y-3">
        <input className="w-full rounded-xl border p-3" placeholder="Patient ID" />
        <textarea className="w-full rounded-xl border p-3" placeholder="Assessment notes" rows={4} />
        <button className="rounded-xl bg-primary px-4 py-2 text-white">Save</button>
      </form>
    </div>
  )
}
