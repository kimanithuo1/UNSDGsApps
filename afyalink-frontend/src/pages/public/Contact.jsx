export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <h2 className="text-2xl font-semibold">Contact</h2>
      <form className="mt-6 space-y-4">
        <input className="w-full rounded-xl border p-3 focus:ring focus:ring-primary/30" placeholder="Name" />
        <input className="w-full rounded-xl border p-3 focus:ring focus:ring-primary/30" placeholder="Email" />
        <textarea className="w-full rounded-xl border p-3 focus:ring focus:ring-primary/30" placeholder="Message" rows={4} />
        <button className="rounded-xl bg-primary px-4 py-2 text-white shadow-sm">Send</button>
      </form>
    </div>
  )
}
