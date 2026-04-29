'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <nav className="bg-white shadow-lg fixed top-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center max-w-7xl px-6 py-5">
          <Link href="/" className="text-2xl md:text-3xl font-bold text-amber-600">RD IT Lab UK</Link>
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
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-amber-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed top-20 left-0 w-full bg-white shadow-lg z-40 md:hidden animate-fade-in">
          <div className="px-6 py-4">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="block text-gray-700 hover:text-amber-600 transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="block text-gray-700 hover:text-amber-600 transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  className="block text-gray-700 hover:text-amber-600 transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="block text-gray-700 hover:text-amber-600 transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link 
                href="/contact" 
                className="block w-full text-center rounded-full bg-amber-600 px-5 py-2 text-white font-semibold transition hover:bg-amber-700"
                onClick={() => setIsOpen(false)}
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}