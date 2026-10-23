import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
// Fraunces: a warm, editorial serif for display headings.
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz'],
})

export const metadata: Metadata = {
  title: {
    default: 'RD IT Lab UK — Expert IT & Software',
    template: '%s · RD IT Lab UK',
  },
  description:
    'Expert IT services and custom software for businesses across the UK: laptop & PC repair, networking, lab setup, audits, websites and web apps.',
  keywords: ['IT services UK', 'laptop repair', 'PC repair', 'web development', 'custom software', 'networking', 'London', 'Harrow'],
  openGraph: {
    title: 'RD IT Lab UK — Expert IT & Software',
    description: 'IT services and custom software for UK businesses — repairs, networking, websites and web apps.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'RD IT Lab UK',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f3ec' },
    { media: '(prefers-color-scheme: dark)', color: '#171310' },
  ],
}

// Set the theme class before paint to avoid a light/dark flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans pt-20 antialiased">{children}</body>
    </html>
  )
}
