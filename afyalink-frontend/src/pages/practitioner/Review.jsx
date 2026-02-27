export default function ScheduleReview() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Schedule Review</h2>
      <form className="mt-4 space-y-3">
        <input className="w-full rounded-xl border p-3" placeholder="Patient ID" />
        <input className="w-full rounded-xl border p-3" placeholder="Review date" type="date" />
        <button className="rounded-xl bg-primary px-4 py-2 text-white">Schedule</button>
      </form>
    </div>
  )
}
