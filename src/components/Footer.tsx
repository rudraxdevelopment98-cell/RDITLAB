'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { defaultContent, type SiteCopy } from '@/lib/content'

export default function Footer({ content }: { content?: SiteCopy['footer'] }) {
  const [c, setC] = useState<SiteCopy['footer']>(content ?? defaultContent.footer)

  // On pages that don't pass content (client pages, sub-pages), fetch the live
  // footer copy so edits made in the admin show everywhere.
  useEffect(() => {
    if (content) return
    let active = true
    fetch('/api/site-content')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.footer) setC(data.footer)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [content])

  return (
    <footer className="relative mt-10 border-t border-[var(--border)] px-6 py-14 md:px-12">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--accent)] font-display text-sm font-semibold text-white">
                RD
              </span>
              <span className="font-display text-xl font-semibold text-[var(--text)]">
                IT Lab <span className="text-[var(--accent)]">UK</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm leading-relaxed text-muted">{c.tagline}</p>
            <div className="mt-5 flex gap-3">
              <a href={c.googleUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--border-strong)]">
                Google Reviews
              </a>
              <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--border-strong)]">
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/services', label: 'Services' },
                { href: '/web-development', label: 'Web & Software' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted transition-colors hover:text-[var(--text)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">Contact</h4>
            <ul className="space-y-2.5 text-muted">
              <li>
                <a href={`mailto:${c.email}`} className="transition-colors hover:text-[var(--text)]">{c.email}</a>
              </li>
              <li>
                <a href={`tel:${c.phone.replace(/\s+/g, '')}`} className="transition-colors hover:text-[var(--text)]">{c.phone}</a>
              </li>
              <li>{c.location}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-8 text-sm text-muted md:flex-row">
          <p>&copy; {new Date().getFullYear()} RD IT Lab UK. All rights reserved.</p>
          <p>{c.note}</p>
        </div>
      </div>
    </footer>
  )
}
