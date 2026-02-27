import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">AFYALINK</h4>
            <p className="mt-2 text-sm text-gray-600">Secure records and timely reminders for modern healthcare.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Links</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link to="/about" className="text-sm text-primary hover:underline">About</Link>
              <Link to="/contact" className="text-sm text-primary hover:underline">Contact</Link>
              <Link to="/privacy" className="text-sm text-primary hover:underline">Privacy</Link>
              <Link to="/terms" className="text-sm text-primary hover:underline">Terms</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Contact</h4>
            <p className="mt-2 text-sm text-gray-600">support@afyalink.example</p>
            <div className="mt-2 flex gap-3">
              <a className="text-sm text-primary hover:underline" href="#">Twitter</a>
              <a className="text-sm text-primary hover:underline" href="#">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-xs text-gray-500">© {new Date().getFullYear()} AFYALINK. All rights reserved.</div>
      </div>
    </footer>
  )
}
