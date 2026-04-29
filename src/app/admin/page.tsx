'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProtectedAdmin from '@/components/admin/ProtectedAdmin'
import PagesManager from '@/components/admin/PagesManager'
import TeamManager from '@/components/admin/TeamManager'
import AuditLogViewer from '@/components/admin/AuditLogViewer'
import AdminSettings from '@/components/admin/AdminSettings'
import DashboardStats from '@/components/admin/DashboardStats'

function AdminContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pages' | 'team' | 'audit' | 'settings'>('dashboard')

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex gap-4 overflow-x-auto pb-px">
            <button
              data-tab="dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'text-amber-600 border-amber-600'
                  : 'text-gray-600 border-transparent hover:text-amber-600'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              data-tab="pages"
              onClick={() => setActiveTab('pages')}
              className={`py-4 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === 'pages'
                  ? 'text-amber-600 border-amber-600'
                  : 'text-gray-600 border-transparent hover:text-amber-600'
              }`}
            >
              📄 Pages & Content
            </button>
            <button
              data-tab="team"
              onClick={() => setActiveTab('team')}
              className={`py-4 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === 'team'
                  ? 'text-amber-600 border-amber-600'
                  : 'text-gray-600 border-transparent hover:text-amber-600'
              }`}
            >
              👥 Team Members
            </button>
            <button
              data-tab="audit"
              onClick={() => setActiveTab('audit')}
              className={`py-4 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === 'audit'
                  ? 'text-amber-600 border-amber-600'
                  : 'text-gray-600 border-transparent hover:text-amber-600'
              }`}
            >
              📋 Audit Logs
            </button>
            <button
              data-tab="settings"
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'text-amber-600 border-amber-600'
                  : 'text-gray-600 border-transparent hover:text-amber-600'
              }`}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto max-w-7xl px-6 py-8">
        {activeTab === 'dashboard' && <DashboardStats />}
        {activeTab === 'pages' && <PagesManager />}
        {activeTab === 'team' && <TeamManager />}
        {activeTab === 'audit' && <AuditLogViewer />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto max-w-7xl px-6 py-6 text-center text-gray-600 text-sm">
          <p>© 2024 RD IT Lab UK Admin Portal. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Secured with JWT Authentication | Database-backed | Audit Logging Enabled
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedAdmin>
      <AdminContent />
    </ProtectedAdmin>
  )
}
