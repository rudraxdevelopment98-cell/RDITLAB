'use client'

import { useState, useEffect, useCallback } from 'react'

interface AuditLog {
  id: string
  action: string
  entity: string
  entityId: string
  oldData: string | null
  newData: string | null
  createdAt: string
  admin: {
    email: string
    name: string | null
  }
}

interface AuditResponse {
  logs: AuditLog[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(0)
  const [filterAction, setFilterAction] = useState('')
  const [filterEntity, setFilterEntity] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN']
  const entities = ['Page', 'TeamMember', 'Admin']

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filterAction) params.append('action', filterAction)
      if (filterEntity) params.append('entity', filterEntity)
      params.append('limit', pageSize.toString())
      params.append('offset', ((currentPage - 1) * pageSize).toString())

      const response = await fetch(`/api/audit-logs?${params}`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch logs')

      const data: AuditResponse = await response.json()
      setLogs(data.logs)
      setTotalPages(data.totalPages)
      setError('')
    } catch (err) {
      setError('Failed to load audit logs')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, filterAction, filterEntity])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB')
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'DELETE':
        return 'bg-[var(--accent-weak)] text-[var(--accent-ink)] border border-[var(--accent)]/30'
      default:
        return 'bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]'
    }
  }

  const getActionDot = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-[var(--accent)]'
      case 'UPDATE':
        return 'bg-[var(--text)]'
      case 'DELETE':
        return 'bg-[var(--accent-ink)]'
      default:
        return 'bg-muted'
    }
  }

  const parseJson = (jsonStr: string | null) => {
    if (!jsonStr) return null
    try {
      return JSON.parse(jsonStr)
    } catch {
      return null
    }
  }

  if (isLoading && logs.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
        <p className="mt-3 text-sm text-muted">Loading activity…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-[var(--bg-elev)] p-4 rounded-lg border border-[var(--border)]">
        <h3 className="font-semibold text-[var(--text)] mb-4">Filters</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Action
            </label>
            <select
              value={filterAction}
              onChange={(e) => {
                setFilterAction(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {actions.map((action) => (
                <option key={action} value={action === 'ALL' ? '' : action}>
                  {action}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Entity
            </label>
            <select
              value={filterEntity}
              onChange={(e) => {
                setFilterEntity(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Entities</option>
              {entities.map((entity) => (
                <option key={entity} value={entity === 'ALL' ? '' : entity}>
                  {entity}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-weak)] px-4 py-3 text-sm text-[var(--accent-ink)]">
          {error}
        </div>
      )}

      {/* Logs Table */}
      {logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg overflow-hidden hover:shadow-md transition">
              {/* Header Row */}
              <button
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-[var(--bg)] transition"
              >
                <div className="flex items-center gap-4 text-left flex-1">
                  <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${getActionDot(log.action)}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-sm font-medium text-[var(--text)]">
                        {log.entity}
                      </span>
                      <span className="text-xs text-muted">
                        ID: {log.entityId.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted">
                      by <strong>{log.admin.name || log.admin.email}</strong> on{' '}
                      {formatDate(log.createdAt)}
                    </div>
                  </div>
                </div>
                <span className="text-muted text-lg">
                  {expandedId === log.id ? '▼' : '▶'}
                </span>
              </button>

              {/* Expanded Details */}
              {expandedId === log.id && (
                <div className="bg-[var(--bg)] border-t border-[var(--border)] px-4 py-3 space-y-3">
                  {log.oldData && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted mb-2">
                        Old Data:
                      </h4>
                      <pre className="text-xs bg-[var(--bg-elev)] p-2 rounded border border-[var(--border)] overflow-x-auto text-muted">
                        {JSON.stringify(parseJson(log.oldData), null, 2)}
                      </pre>
                    </div>
                  )}
                  {log.newData && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted mb-2">
                        New Data:
                      </h4>
                      <pre className="text-xs bg-[var(--bg-elev)] p-2 rounded border border-[var(--border)] overflow-x-auto text-muted">
                        {JSON.stringify(parseJson(log.newData), null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg p-8 text-center">
          <p className="text-muted">No audit logs found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-[var(--bg-elev)] p-4 rounded-lg border border-[var(--border)]">
          <div className="text-sm text-muted">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-[var(--border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg)]"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-[var(--border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg)]"
            >
              Next →
            </button>
          </div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value))
              setCurrentPage(1)
            }}
            className="px-3 py-2 border border-[var(--border)] rounded-lg"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      )}
    </div>
  )
}
