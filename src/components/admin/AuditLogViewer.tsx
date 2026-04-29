'use client'

import { useState, useEffect } from 'react'

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

  useEffect(() => {
    fetchLogs()
  }, [currentPage, pageSize, filterAction, filterEntity])

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filterAction) params.append('action', filterAction)
      if (filterEntity) params.append('entity', filterEntity)
      params.append('limit', pageSize.toString())
      params.append('offset', ((currentPage - 1) * pageSize).toString())

      const response = await fetch(`/api/audit-logs?${params}`)
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
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB')
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800'
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800'
      case 'DELETE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return '✨'
      case 'UPDATE':
        return '✏️'
      case 'DELETE':
        return '🗑️'
      default:
        return '📝'
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
      <div className="py-8 text-center">
        <div className="inline-block animate-spin">⏳</div>
        <p className="text-gray-600 mt-2">Loading audit logs...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action
            </label>
            <select
              value={filterAction}
              onChange={(e) => {
                setFilterAction(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {actions.map((action) => (
                <option key={action} value={action === 'ALL' ? '' : action}>
                  {action}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entity
            </label>
            <select
              value={filterEntity}
              onChange={(e) => {
                setFilterEntity(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Logs Table */}
      {logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
              {/* Header Row */}
              <button
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4 text-left flex-1">
                  <span className="text-2xl">{getActionIcon(log.action)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {log.entity}
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: {log.entityId.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      by <strong>{log.admin.name || log.admin.email}</strong> on{' '}
                      {formatDate(log.createdAt)}
                    </div>
                  </div>
                </div>
                <span className="text-gray-400 text-lg">
                  {expandedId === log.id ? '▼' : '▶'}
                </span>
              </button>

              {/* Expanded Details */}
              {expandedId === log.id && (
                <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 space-y-3">
                  {log.oldData && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Old Data:
                      </h4>
                      <pre className="text-xs bg-white p-2 rounded border border-gray-300 overflow-x-auto text-gray-600">
                        {JSON.stringify(parseJson(log.oldData), null, 2)}
                      </pre>
                    </div>
                  )}
                  {log.newData && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        New Data:
                      </h4>
                      <pre className="text-xs bg-white p-2 rounded border border-gray-300 overflow-x-auto text-gray-600">
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
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No audit logs found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
            className="px-3 py-2 border border-gray-300 rounded-lg"
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
