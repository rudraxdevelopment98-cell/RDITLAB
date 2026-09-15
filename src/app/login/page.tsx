'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const ERRORS: Record<string, string> = {
  not_authorized: 'That Google account is not authorised for admin access.',
  google_not_configured: 'Google sign-in is not configured yet. Ask the site owner to add Google credentials.',
  bad_state: 'Your sign-in session expired. Please try again.',
  email_unverified: 'Your Google email is not verified.',
  token_exchange_failed: 'Google sign-in failed. Please try again.',
  oauth_error: 'Something went wrong signing in with Google.',
}

export default function LoginPage() {
  const router = useRouter()

  const [showFallback, setShowFallback] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const code = new URLSearchParams(window.location.search).get('error')
      if (code) setError(ERRORS[code] ?? 'Sign-in failed.')
    } catch {}
  }, [])

  const handleFallback = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="aurora left-[10%] top-[10%] h-72 w-72 animate-aurora" style={{ background: 'var(--aurora-1)' }} />
      <div className="aurora right-[10%] bottom-[10%] h-72 w-72 animate-aurora [animation-delay:5s]" style={{ background: 'var(--aurora-2)' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2.5">
            <span className="glass-edge flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 via-brand-500 to-cyan-400 text-sm font-bold text-white">RD</span>
            <span className="font-display text-2xl font-bold text-[var(--text)]">IT Lab <span className="text-gradient-brand">UK</span></span>
          </Link>
          <p className="text-muted">Admin Portal</p>
        </div>

        <div className="glass glass-edge rounded-[2rem] p-8 md:p-10">
          <h2 className="mb-2 text-center font-display text-2xl font-bold text-[var(--text)]">Sign in</h2>
          <p className="mb-6 text-center text-sm text-muted">Use your authorised Google account.</p>

          {error && (
            <div className="mb-6 rounded-xl border border-red-400/40 bg-red-500/10 p-4">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <a
            href="/api/auth/google"
            className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-6 py-3.5 font-semibold text-[var(--text)] transition hover:shadow-glow"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            Continue with Google
          </a>

          <div className="mt-6 border-t border-[var(--border)] pt-4 text-center">
            <button onClick={() => setShowFallback((v) => !v)} className="text-xs text-muted underline hover:text-[var(--text)]">
              {showFallback ? 'Hide' : 'Trouble signing in?'}
            </button>
          </div>

          {showFallback && (
            <form onSubmit={handleFallback} className="mt-4 space-y-3">
              <p className="text-xs text-muted">Temporary password fallback (removed once Google login is confirmed):</p>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin email" className={field} required />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" className={field} required />
              <button type="submit" disabled={loading} className="w-full rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 py-3 font-semibold text-white transition hover:shadow-glow disabled:opacity-50">
                {loading ? 'Signing in…' : 'Sign in with password'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/" className="text-gradient-brand font-medium">← Back to website</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const field =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500/50'
