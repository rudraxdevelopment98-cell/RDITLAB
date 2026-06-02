'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-amber-100 shadow-md'
            : 'bg-white/95 border-b border-transparent'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between max-w-7xl py-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-white shadow-brand transition-transform group-hover:scale-105">
              RD
            </span>
            <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-gray-900">
              IT Lab <span className="text-amber-600">UK</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-amber-700'
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-amber-600" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Link
              href="/contact"
              className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition hover:bg-amber-700 hover:shadow-brand-lg active:scale-95"
            >
              Get in touch
            </Link>
          </div>

          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden rounded-lg p-2 text-gray-700 transition hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed top-[68px] left-0 z-40 w-full glass border-b border-amber-100 shadow-lg md:hidden animate-slideDown">
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-xl px-4 py-3 font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-amber-100 pt-3">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-full bg-amber-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-amber-700"
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
