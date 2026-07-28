'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProtectedAdmin from '@/components/admin/ProtectedAdmin'
import PagesManager from '@/components/admin/PagesManager'
import TeamManager from '@/components/admin/TeamManager'
import ProjectsManager from '@/components/admin/ProjectsManager'
import PlansManager from '@/components/admin/PlansManager'
import TemplatesManager from '@/components/admin/TemplatesManager'
import AuditLogViewer from '@/components/admin/AuditLogViewer'
import AdminSettings from '@/components/admin/AdminSettings'
import DashboardStats from '@/components/admin/DashboardStats'

type Tab = 'dashboard' | 'pages' | 'team' | 'portfolio' | 'plans' | 'templates' | 'audit' | 'settings'

function AdminContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

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
                  ? 'text-violet-600 border-violet-600'
                  : 'text-gray-600 border-transparent hover:text-violet-600'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              data-tab="pages"
              onClick={() => setActiveTab('pages')}
              className={`py-4 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === 'pages'
                  ? 'text-violet-600 border-violet-600'
                  : 'text-gray-600 border-transparent hover:text-violet-600'
              }`}
            >
              📄 Pages & Content
            </button>
            <button
              data-tab="team"
              onClick={() => setActiveTab('team')}
              className={`py-4 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === 'team'
                  ? 'text-violet-600 border-violet-600'
                  : 'text-gray-600 border-transparent hover:text-violet-600'
              }`}
            >
              👥 Team Members
            </button>
            <button
              data-tab="portfolio"
              onClick={() => setActiveTab('portfolio')}
              className={`py-4 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === 'portfolio'
                  ? 'text-violet-600 border-violet-600'
                  : 'text-gray-600 border-transparent hover:text-violet-600'
              }`}
            >
              🚀 Portfolio
            </button>
            <button
              data-tab="plans"
              onClick={() => setActiveTab('plans')}
              className={`py-4 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === 'plans'
                  ? 'text-violet-600 border-violet-600'
                  : 'text-gray-600 border-transparent hover:text-violet-600'
              }`}
            >
              💷 Plans
            </button>
            <button
              data-tab="templates"
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === 'templates'
                  ? 'text-violet-600 border-violet-600'
                  : 'text-gray-600 border-transparent hover:text-violet-600'
              }`}
            >
              🧩 Templates
            </button>
            <button
              data-tab="audit"
              onClick={() => setActiveTab('audit')}
              className={`py-4 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === 'audit'
                  ? 'text-violet-600 border-violet-600'
                  : 'text-gray-600 border-transparent hover:text-violet-600'
              }`}
            >
              📋 Audit Logs
            </button>
            <button
              data-tab="settings"
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'text-violet-600 border-violet-600'
                  : 'text-gray-600 border-transparent hover:text-violet-600'
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
        {activeTab === 'portfolio' && <ProjectsManager />}
        {activeTab === 'plans' && <PlansManager />}
        {activeTab === 'templates' && <TemplatesManager />}
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
