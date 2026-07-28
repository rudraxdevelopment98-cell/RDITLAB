'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`neu relative flex h-10 w-10 items-center justify-center rounded-full text-[var(--text)] transition active:scale-95 ${className}`}
    >
      {/* Sun / moon crossfade — render a stable icon until mounted to avoid hydration mismatch */}
      <span className="sr-only">Toggle theme</span>
      {mounted && dark ? (
        <svg className="h-5 w-5 text-amber-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4.5" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
        </svg>
      ) : (
        <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        </svg>
      )}
    </button>
  )
}
