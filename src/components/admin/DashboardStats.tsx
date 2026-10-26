'use client'

import { useState, useEffect } from 'react'

interface Stats {
  totalPages: number
  totalTeamMembers: number
  totalAuditLogs: number
  recentLogins: number
  recentChanges: number
  lastLogin: string | null
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const [pagesRes, teamRes, auditRes] = await Promise.all([
        fetch('/api/pages', { credentials: 'include' }),
        fetch('/api/team', { credentials: 'include' }),
        fetch('/api/audit-logs?limit=1000', { credentials: 'include' }),
      ])

      if (!pagesRes.ok || !teamRes.ok || !auditRes.ok) {
        throw new Error('Failed to fetch stats')
      }

      const pages = await pagesRes.json()
      const team = await teamRes.json()
      const auditData = await auditRes.json()

      // Calculate statistics
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      const recentLogins = (auditData.logs || []).filter((log: any) => {
        const logDate = new Date(log.createdAt)
        return logDate > oneHourAgo && log.action === 'LOGIN'
      }).length

      const recentChanges = (auditData.logs || []).filter((log: any) => {
        const logDate = new Date(log.createdAt)
        return logDate > oneDayAgo
      }).length

      const lastLoginLog = (auditData.logs || [])
        .filter((log: any) => log.action === 'LOGIN')
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .find(() => true)

      setStats({
        totalPages: Array.isArray(pages) ? pages.length : 0,
        totalTeamMembers: Array.isArray(team) ? team.length : 0,
        totalAuditLogs: auditData.total || 0,
        recentLogins,
        recentChanges,
        lastLogin: lastLoginLog ? new Date(lastLoginLog.createdAt).toLocaleString('en-GB') : null,
      })
      setError('')
    } catch (err) {
      setError('Failed to load statistics')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
        <p className="mt-3 text-sm text-muted">Loading overview…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-weak)] px-4 py-3 text-sm text-[var(--accent-ink)]">
        {error}
      </div>
    )
  }

  const stats_cards = [
    { label: 'Published pages', value: stats?.totalPages ?? 0 },
    { label: 'Team members', value: stats?.totalTeamMembers ?? 0 },
    { label: 'Changes (24h)', value: stats?.recentChanges ?? 0 },
    { label: 'Logged events', value: stats?.totalAuditLogs ?? 0 },
  ]

  const actions = [
    { tab: 'portfolio', label: 'Add a project', hint: 'Showcase a new build' },
    { tab: 'testimonials', label: 'Review testimonials', hint: 'Approve client reviews' },
    { tab: 'plans', label: 'Edit plans', hint: 'Update packages & pricing' },
  ]

  const go = (tab: string) => {
    const btn = document.querySelector(`[data-tab="${tab}"]`) as HTMLButtonElement | null
    btn?.click()
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 shadow-card">
        <p className="eyebrow">Today</p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
          Here&apos;s where the studio stands.
        </h2>
        {stats?.lastLogin && (
          <p className="mt-2 text-sm text-muted">
            Last sign-in: <span className="font-medium text-[var(--text)]">{stats.lastLogin}</span>
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats_cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-5">
            <p className="font-display text-4xl font-semibold text-[var(--text)]">{card.value}</p>
            <p className="mt-2 text-sm text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p className="eyebrow mb-4">Quick actions</p>
        <div className="grid gap-3 md:grid-cols-3">
          {actions.map((a) => (
            <button
              key={a.tab}
              onClick={() => go(a.tab)}
              className="group rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-5 text-left transition hover:border-[var(--accent)]"
            >
              <p className="font-medium text-[var(--text)]">{a.label}</p>
              <p className="mt-1 text-sm text-muted">{a.hint}</p>
              <span className="mt-3 inline-flex text-sm font-medium text-[var(--accent-ink)] opacity-0 transition group-hover:opacity-100">
                Open →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* System */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-6">
          <p className="eyebrow mb-3">Security</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>Google sign-in, allow-listed admins only</li>
            <li>Signed, HTTP-only session cookies</li>
            <li>Every change written to the audit log</li>
            <li>Server-side route protection on all admin APIs</li>
          </ul>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-6">
          <p className="eyebrow mb-3">Platform</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>PostgreSQL (Neon), isolated schema</li>
            <li>Prisma ORM</li>
            <li>Hosted on Vercel</li>
            <li>Media stored on Vercel Blob</li>
          </ul>
        </div>
      </div>

      <p className="pt-2 text-center text-xs text-muted">Refreshes automatically every 30 seconds.</p>
    </div>
  )
}
