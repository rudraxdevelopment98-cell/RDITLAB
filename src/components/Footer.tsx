import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 px-6 md:px-12 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-amber-400 mb-4">RD IT Lab UK</h3>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner for IT services in commercial and industrial sectors.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-amber-400 transition-colors">About</Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-amber-400 transition-colors">Services</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-amber-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <p className="text-gray-400 mb-2">Email: rudraxdevelopment98@gmail.com</p>
            <p className="text-gray-400 mb-2">Phone: +44 7823912875</p>
            <p className="text-gray-400">Harrow, London, UK</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500">&copy; 2026 RD IT Lab UK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}