import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center max-w-7xl px-6 py-5">
        <Link href="/" className="text-3xl font-bold text-amber-600">RD IT Lab UK</Link>
        <ul className="hidden md:flex space-x-8">
          <li>
            <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">Home</Link>
          </li>
          <li>
            <Link href="/about" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">About</Link>
          </li>
          <li>
            <Link href="/services" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">Services</Link>
          </li>
          <li>
            <Link href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">Contact</Link>
          </li>
        </ul>
        <div className="hidden md:block">
          <Link href="/contact" className="rounded-full bg-amber-600 px-5 py-2 text-white font-semibold transition hover:bg-amber-700">Get in touch</Link>
        </div>
        <div className="md:hidden">
          <button className="text-gray-700 hover:text-amber-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}