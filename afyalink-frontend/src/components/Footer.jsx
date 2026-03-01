import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0f766e] flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-black">AL</span>
              </div>
              <span className="text-lg font-bold text-[#0f766e]">AFYALINK</span>
            </div>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-xs">
              Africa's patient-provider data exchange platform. Turning fragmented paper records into connected, real-time health intelligence.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Aligned with UN SDG 3 · Good Health for All
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Platform</h4>
            <div className="space-y-2.5">
              <Link to="/" className="block text-sm text-gray-600 hover:text-[#0f766e] transition-colors">Home</Link>
              <Link to="/about" className="block text-sm text-gray-600 hover:text-[#0f766e] transition-colors">About Us</Link>
              <Link to="/contact" className="block text-sm text-gray-600 hover:text-[#0f766e] transition-colors">Contact</Link>
              <Link to="/register" className="block text-sm text-gray-600 hover:text-[#0f766e] transition-colors">Register Free</Link>
              <Link to="/login" className="block text-sm text-gray-600 hover:text-[#0f766e] transition-colors">Login</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Contact</h4>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Email</div>
                <a
                  href="mailto:jtechbyteinsights@gmail.com"
                  className="text-sm text-[#0f766e] hover:underline font-medium break-all"
                >
                  jtechbyteinsights@gmail.com
                </a>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Response time</div>
                <div className="text-sm text-gray-600">Within 24 hours</div>
              </div>
              <div className="flex gap-3 pt-1">
                <a href="#" className="text-sm text-gray-500 hover:text-[#0f766e] transition-colors font-medium">Twitter</a>
                <a href="#" className="text-sm text-gray-500 hover:text-[#0f766e] transition-colors font-medium">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} AFYALINK. All rights reserved. Built to advance SDG 3.
          </div>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}