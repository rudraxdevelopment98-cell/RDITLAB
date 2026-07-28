'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/web-development', label: 'Web & Software' },
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

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav' : ''}`}>
        <div className="container mx-auto flex items-center justify-between max-w-7xl py-3.5">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="glass-edge flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 via-brand-500 to-cyan-400 text-sm font-bold text-white shadow-brand transition-transform group-hover:scale-105">
              RD
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-[var(--text)]">
              IT Lab <span className="text-gradient-brand">UK</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive(link.href)
                      ? 'text-[var(--text)]'
                      : 'text-muted hover:text-[var(--text)]'
                  }`}
                >
                  {isActive(link.href) && (
                    <span className="glass absolute inset-0 -z-10 rounded-full" aria-hidden />
                  )}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/contact"
              className="hidden rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition hover:shadow-glow active:scale-95 md:inline-flex"
            >
              Get in touch
            </Link>
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="neu flex h-10 w-10 items-center justify-center rounded-full text-[var(--text)] md:hidden"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="glass fixed inset-x-3 top-[70px] z-40 rounded-2xl p-3 md:hidden animate-slideDown">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-xl px-4 py-3 font-medium transition ${
                    isActive(link.href) ? 'neu-inset text-[var(--text)]' : 'text-muted hover:text-[var(--text)]'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-3 text-center font-semibold text-white"
              >
                Get in touch
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
