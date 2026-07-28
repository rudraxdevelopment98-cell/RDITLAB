import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative mt-10 border-t border-[var(--border)] px-6 py-14 md:px-12">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="glass-edge flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 via-brand-500 to-cyan-400 text-sm font-bold text-white">
                RD
              </span>
              <span className="font-display text-xl font-bold text-[var(--text)]">
                IT Lab <span className="text-gradient-brand">UK</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm leading-relaxed text-muted">
              Your trusted partner for IT services and custom software across the UK — secure, fast,
              and reliable, with cybersecurity built in.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="https://share.google/nMMOrlyJNoFbICUL5" target="_blank" rel="noopener noreferrer" className="glass glass-edge rounded-full px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:scale-[1.03]">
                Google Reviews
              </a>
              <a href="https://www.instagram.com/rditlab.uk" target="_blank" rel="noopener noreferrer" className="glass glass-edge rounded-full px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:scale-[1.03]">
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted">Quick Links</h4>
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
            <h4 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted">Contact</h4>
            <ul className="space-y-2.5 text-muted">
              <li>
                <a href="mailto:rudraxdevelopment98@gmail.com" className="transition-colors hover:text-[var(--text)]">rudraxdevelopment98@gmail.com</a>
              </li>
              <li>
                <a href="tel:+447823912875" className="transition-colors hover:text-[var(--text)]">+44 7823 912875</a>
              </li>
              <li>Harrow, London, UK</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-8 text-sm text-muted md:flex-row">
          <p>&copy; {new Date().getFullYear()} RD IT Lab UK. All rights reserved.</p>
          <p>Built with care in the UK.</p>
        </div>
      </div>
    </footer>
  )
}
