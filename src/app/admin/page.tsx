'use client'

import { useState } from 'react'
import ProtectedAdmin from '@/components/admin/ProtectedAdmin'
import SiteContentManager from '@/components/admin/SiteContentManager'
import TeamManager from '@/components/admin/TeamManager'
import ProjectsManager from '@/components/admin/ProjectsManager'
import LaunchesManager from '@/components/admin/LaunchesManager'
import PlansManager from '@/components/admin/PlansManager'
import TemplatesManager from '@/components/admin/TemplatesManager'
import TestimonialsManager from '@/components/admin/TestimonialsManager'
import AuditLogViewer from '@/components/admin/AuditLogViewer'
import AdminSettings from '@/components/admin/AdminSettings'
import DashboardStats from '@/components/admin/DashboardStats'

type Tab = 'dashboard' | 'pages' | 'team' | 'portfolio' | 'launches' | 'plans' | 'templates' | 'testimonials' | 'audit' | 'settings'

const tabs: { id: Tab; label: string; hint: string }[] = [
  { id: 'dashboard', label: 'Overview', hint: 'At a glance' },
  { id: 'launches', label: 'Products', hint: 'Launched products & films' },
  { id: 'portfolio', label: 'Work', hint: 'Projects & case studies' },
  { id: 'plans', label: 'Plans', hint: 'Packages & pricing' },
  { id: 'templates', label: 'Templates', hint: 'Starter designs' },
  { id: 'testimonials', label: 'Testimonials', hint: 'Client reviews' },
  { id: 'pages', label: 'Content', hint: 'Home page copy' },
  { id: 'team', label: 'Team', hint: 'People' },
  { id: 'audit', label: 'Activity', hint: 'Audit log' },
  { id: 'settings', label: 'Settings', hint: 'Account' },
]

function AdminContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const current = tabs.find((t) => t.id === activeTab)

  return (
    <div>
      {/* Page intro */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-elev)]">
        <div className="container mx-auto max-w-7xl px-6 pb-5 pt-8">
          <p className="eyebrow">Studio control</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--text)] md:text-4xl">
            {current?.label}
          </h1>
          <p className="mt-1.5 text-sm text-muted">{current?.hint}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  data-tab={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                    active
                      ? 'border-[var(--accent)] text-[var(--text)]'
                      : 'border-transparent text-muted hover:text-[var(--text)]'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto max-w-7xl px-6 py-10">
        {activeTab === 'dashboard' && <DashboardStats />}
        {activeTab === 'pages' && <SiteContentManager />}
        {activeTab === 'team' && <TeamManager />}
        {activeTab === 'launches' && <LaunchesManager />}
        {activeTab === 'portfolio' && <ProjectsManager />}
        {activeTab === 'plans' && <PlansManager />}
        {activeTab === 'templates' && <TemplatesManager />}
        {activeTab === 'testimonials' && <TestimonialsManager />}
        {activeTab === 'audit' && <AuditLogViewer />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-[var(--border)] bg-[var(--bg-elev)]">
        <div className="container mx-auto max-w-7xl px-6 py-6 text-center text-sm text-muted">
          <p>RD IT Lab UK — Studio workspace</p>
          <p className="mt-1 text-xs">Secure sign-in · Database-backed · Every change logged</p>
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
