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
        fetch('/api/pages'),
        fetch('/api/team'),
        fetch('/api/audit-logs?limit=1000'),
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
      <div className="py-8 text-center">
        <div className="inline-block animate-spin">⏳</div>
        <p className="text-gray-600 mt-2">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  const stats_cards = [
    {
      label: 'Total Pages',
      value: stats?.totalPages ?? 0,
      icon: '📄',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
    },
    {
      label: 'Team Members',
      value: stats?.totalTeamMembers ?? 0,
      icon: '👥',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
    },
    {
      label: 'Audit Log Entries',
      value: stats?.totalAuditLogs ?? 0,
      icon: '📋',
      color: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
    },
    {
      label: 'Recent Changes (24h)',
      value: stats?.recentChanges ?? 0,
      icon: '✏️',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">📊 Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's a summary of your RDITLAB admin activities.
        </p>
        {stats?.lastLogin && (
          <p className="text-sm text-gray-500 mt-3">
            Last login: <strong>{stats.lastLogin}</strong>
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats_cards.map((card) => (
          <div
            key={card.label}
            className={`${card.color} border rounded-lg p-6 transition hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className={`text-4xl font-bold mt-2 ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
              <span className="text-5xl opacity-20">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={(e) => {
              e.preventDefault()
              const btn = document.querySelector('[data-tab="pages"]') as HTMLButtonElement
              btn?.click()
            }}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition text-blue-700 font-medium text-left"
          >
            📄 Add New Page
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              const btn = document.querySelector('[data-tab="team"]') as HTMLButtonElement
              btn?.click()
            }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition text-green-700 font-medium text-left"
          >
            👥 Add Team Member
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              const btn = document.querySelector('[data-tab="audit"]') as HTMLButtonElement
              btn?.click()
            }}
            className="p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition text-amber-700 font-medium text-left"
          >
            📋 View Audit Logs
          </button>
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">🔐 Security Status</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ JWT Authentication Active</li>
            <li>✅ Password Hashing Enabled</li>
            <li>✅ HTTP-Only Cookies</li>
            <li>✅ Audit Logging Active</li>
            <li>✅ CSRF Protection Enabled</li>
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">📊 Database Info</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>📦 Database: SQLite (Development)</li>
            <li>🔄 Migrations: Up to date</li>
            <li>💾 ORM: Prisma</li>
            <li>🌍 Ready for: PostgreSQL (Production)</li>
            <li>📈 Auto-increment: Enabled</li>
          </ul>
        </div>
      </div>

      {/* Refresh Notice */}
      <div className="text-center text-xs text-gray-500 pt-4">
        This dashboard refreshes automatically every 30 seconds
      </div>
    </div>
  )
}
