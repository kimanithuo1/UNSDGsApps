import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-semibold text-[#0f766e]">AFYALINK</Link>
        <button
          className="md:hidden rounded-md p-2 border hover:bg-primary/10"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <span className="block w-5 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-5 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-5 h-0.5 bg-gray-700"></span>
        </button>
        <nav className="hidden md:flex items-center gap-2">
          <Link to="/" className="px-3 py-2 text-sm rounded-md hover:bg-primary/10">Home</Link>
          <Link to="/about" className="px-3 py-2 text-sm rounded-md hover:bg-primary/10">About</Link>
          <Link to="/contact" className="px-3 py-2 text-sm rounded-md hover:bg-primary/10">Contact</Link>
          <Link to="/login" className="px-3 py-2 text-sm rounded-md border border-[#0f766e] text-[#0f766e] hover:bg-[#14b8a6]/10">Login</Link>
          <Link to="/register" className="px-3 py-2 text-sm rounded-md bg-[#0f766e] text-white hover:bg-[#14b8a6] shadow-md">Register</Link>
        </nav>
      </div>
      {open && (
        <div className="md:hidden border-t px-4 py-2 space-y-2">
          <Link to="/" className="block px-3 py-2 rounded-md hover:bg-primary/10">Home</Link>
          <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-primary/10">About</Link>
          <Link to="/contact" className="block px-3 py-2 rounded-md hover:bg-primary/10">Contact</Link>
          <Link to="/login" className="block px-3 py-2 rounded-md border border-[#0f766e] text-[#0f766e] hover:bg-[#14b8a6]/10">Login</Link>
          <Link to="/register" className="block px-3 py-2 rounded-md bg-[#0f766e] text-white hover:bg-[#14b8a6] shadow-md">Register</Link>
        </div>
      )}
    </header>
  )
}
