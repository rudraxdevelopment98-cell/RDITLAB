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
  { href: '/products', label: 'Products' },
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
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav' : 'border-b border-transparent'}`}>
        <div className="container mx-auto flex items-center justify-between max-w-6xl py-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--accent)] font-display text-sm font-semibold text-white">
              RD
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-[var(--text)]">
              IT Lab <span className="text-[var(--accent)]">UK</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm transition ${
                    isActive(link.href) ? 'font-medium text-[var(--text)]' : 'text-muted hover:text-[var(--text)]'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute -bottom-1.5 left-0 h-px w-full bg-[var(--accent)]" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/contact"
              className="hidden rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-ink)] md:inline-flex"
            >
              Get in touch
            </Link>
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text)] md:hidden"
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
        <div className="fixed inset-x-3 top-[72px] z-40 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-3 shadow-card md:hidden animate-slideDown">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-lg px-4 py-3 text-sm transition ${
                    isActive(link.href) ? 'bg-[var(--accent-weak)] font-medium text-[var(--accent)]' : 'text-muted hover:text-[var(--text)]'
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
                className="block rounded-full bg-[var(--accent)] px-5 py-3 text-center font-semibold text-white"
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
