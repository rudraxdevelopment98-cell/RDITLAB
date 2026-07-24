import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 px-6 py-14 text-white md:px-12">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-sm font-bold text-white">
                RD
              </span>
              <span className="font-display text-xl font-bold">
                IT Lab <span className="text-violet-400">UK</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm leading-relaxed text-gray-400">
              Your trusted partner for IT services across commercial and industrial sectors —
              secure, fast, and reliable, with cybersecurity built in.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://share.google/nMMOrlyJNoFbICUL5"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-violet-400 hover:text-violet-400"
              >
                Google Reviews
              </a>
              <a
                href="https://www.instagram.com/rditlab.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-violet-400 hover:text-violet-400"
              >
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/services', label: 'Services' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 transition-colors hover:text-violet-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Contact</h4>
            <ul className="space-y-2.5 text-gray-400">
              <li>
                <a href="mailto:rudraxdevelopment98@gmail.com" className="transition-colors hover:text-violet-400">
                  rudraxdevelopment98@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+447823912875" className="transition-colors hover:text-violet-400">
                  +44 7823 912875
                </a>
              </li>
              <li>Harrow, London, UK</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-800 pt-8 text-sm text-gray-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} RD IT Lab UK. All rights reserved.</p>
          <p>Built with care in the UK.</p>
        </div>
      </div>
    </footer>
  )
}
