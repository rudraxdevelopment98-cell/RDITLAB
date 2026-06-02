import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://rditlab.uk'),
  title: {
    default: 'RD IT Lab UK — Expert IT Services',
    template: '%s · RD IT Lab UK',
  },
  description:
    'Expert IT services for commercial and industrial clients across the UK: laptop & PC repair, custom PC builds, networking, lab setup, audits, and software support.',
  keywords: [
    'IT services UK',
    'laptop repair',
    'PC repair',
    'custom PC build',
    'networking',
    'cybersecurity',
    'London',
    'Harrow',
  ],
  openGraph: {
    title: 'RD IT Lab UK — Expert IT Services',
    description:
      'Laptop & PC repair, custom builds, networking, lab setup, audits and software support for businesses across the UK.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'RD IT Lab UK',
  },
  themeColor: '#d97706',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans pt-20 antialiased text-gray-900">{children}</body>
    </html>
  )
}
