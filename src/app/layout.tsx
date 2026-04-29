import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RD IT Lab UK',
  description: 'IT services for commercial and big industries: laptop repair, PC repair, PC build, networking, lab setup, audit, software support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans pt-20">{children}</body>
    </html>
  )
}