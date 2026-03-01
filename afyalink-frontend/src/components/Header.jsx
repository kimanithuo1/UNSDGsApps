import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#0f766e] flex items-center justify-center shadow-sm group-hover:bg-[#14b8a6] transition-colors">
            <span className="text-white text-xs font-black">AL</span>
          </div>
          <span className="text-xl font-bold text-[#0f766e] tracking-tight">AFYALINK</span>
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden rounded-lg p-2 border border-gray-200 hover:bg-gray-50 transition"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                pathname === link.to
                  ? 'bg-teal-50 text-[#0f766e]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-3 flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 font-medium hover:border-[#0f766e] hover:text-[#0f766e] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm rounded-lg bg-[#0f766e] text-white font-semibold shadow-sm hover:bg-[#14b8a6] transition-colors"
            >
              Register Free
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.to
                  ? 'bg-teal-50 text-[#0f766e]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium text-center hover:border-[#0f766e] hover:text-[#0f766e] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-lg bg-[#0f766e] text-white text-sm font-semibold text-center shadow-sm hover:bg-[#14b8a6] transition-colors"
            >
              Register Free
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}