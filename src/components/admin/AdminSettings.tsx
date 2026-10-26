'use client'

import { useState, useEffect } from 'react'

export default function AdminSettings() {
  const [adminEmail, setAdminEmail] = useState('')
  const [adminName, setAdminName] = useState('')

  useEffect(() => {
    async function loadAdminSession() {
      try {
        const response = await fetch('/api/auth/session', { credentials: 'include' })
        if (response.ok) {
          const data = await response.json()
          setAdminEmail(data.admin?.email || '')
          setAdminName(data.admin?.name || '')
        }
      } catch (error) {
        console.error('Failed to load admin session', error)
      }
    }
    loadAdminSession()
  }, [])

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 shadow-card">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)]">Your account</h2>
        <p className="mt-1 text-sm text-muted">Admin access is managed through Google sign-in.</p>

        <div className="mt-6 flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-lg font-semibold text-white">
            {(adminName || adminEmail || '?').charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--text)]">{adminName || 'Signed-in admin'}</p>
            <p className="truncate text-sm text-muted">{adminEmail || '—'}</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-weak)] px-3 py-1 text-xs font-medium text-[var(--accent-ink)]">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 11v2h5.3c-.2 1.2-1.5 3.6-5.3 3.6-3.2 0-5.8-2.6-5.8-5.9S8.8 5 12 5c1.8 0 3 .8 3.7 1.4l1.8-1.7C16.3 3.5 14.4 2.7 12 2.7 7 2.7 3 6.7 3 11.7s4 9 9 9c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.1-1.4H12z"/></svg>
            Google
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-6">
        <p className="eyebrow mb-3">How access works</p>
        <ul className="space-y-2 text-sm text-muted">
          <li>Only approved Google accounts on the allow-list can sign in.</li>
          <li>There is no password to manage — Google handles authentication.</li>
          <li>Sessions use signed, HTTP-only cookies.</li>
          <li>Every sign-in and change is recorded in the Activity log.</li>
        </ul>
        <p className="mt-4 text-xs text-muted">
          Need to add or remove an admin? Update the allow-list in the project configuration.
        </p>
      </div>
    </div>
  )
}
