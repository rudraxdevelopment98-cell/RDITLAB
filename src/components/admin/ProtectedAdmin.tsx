'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

interface AdminSession {
  id: string
  email: string
  name: string | null
  role: string
}

interface ProtectedAdminProps {
  children: React.ReactNode
}

export default function ProtectedAdmin({ children }: ProtectedAdminProps) {
  const router = useRouter()
  const [session, setSession] = useState<AdminSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogout, setShowLogout] = useState(false)

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', { credentials: 'include' })
      const data = await response.json()

      if (data.authenticated && data.admin) {
        setSession(data.admin)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Session check failed:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-elev)]/90 backdrop-blur">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--accent)] font-display text-sm font-semibold text-white">
              RD
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold tracking-tight text-[var(--text)]">
                IT Lab <span className="text-[var(--accent)]">UK</span>
                <span className="ml-2 align-middle text-xs font-normal uppercase tracking-[0.18em] text-muted">Studio</span>
              </p>
              <p className="text-xs text-muted">
                Signed in as <span className="font-medium text-[var(--text)]">{session.name || session.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--border-strong)] sm:inline-flex"
            >
              View site
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
              </svg>
            </Link>
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setShowLogout(!showLogout)}
                aria-label="Account menu"
                className="flex items-center gap-2 rounded-full border border-[var(--border)] py-1 pl-1 pr-2 transition hover:border-[var(--border-strong)]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white">
                  {session.name?.charAt(0).toUpperCase() || session.email.charAt(0).toUpperCase()}
                </span>
                <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Logout Dropdown */}
              {showLogout && (
                <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] shadow-card">
                  <Link
                    href="/"
                    className="block border-b border-[var(--border)] px-4 py-3 text-sm text-[var(--text)] transition hover:bg-[var(--bg)]"
                  >
                    Back to website
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--accent-weak)]"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)] bg-[var(--bg)]">{children}</main>
    </div>
  )
}
