import { prisma } from '@/lib/prisma'
import {
  plans as defaultPlans,
  projects as defaultProjects,
  templates as defaultTemplates,
} from '@/components/studio/data'

// Resolved shapes consumed by the public UI components.
export type ResolvedPlan = {
  id: string
  name: string
  tagline: string
  price: string
  period?: string
  popular?: boolean
  features: string[]
  cta: string
}

export type ResolvedProject = {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  demo: string
  gradient: string
  image?: string | null
  featured?: boolean
}

export type ResolvedTemplate = {
  id: string
  name: string
  category: string
  price: string
  description: string
  gradient: string
  image?: string | null
  preview: string
}

const splitList = (value: string, sep: string) =>
  value
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean)

/**
 * The public pages call these. Each query is wrapped so that if the DB is
 * unreachable or the tables don't exist yet, the site still renders the
 * built-in default content instead of erroring.
 */
export async function getPlans(): Promise<ResolvedPlan[]> {
  try {
    const rows = await prisma.plan.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })
    if (rows.length === 0) return fallbackPlans()
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      tagline: r.tagline,
      price: r.price,
      period: r.period || undefined,
      popular: r.popular,
      features: splitList(r.features, '\n'),
      cta: r.cta,
    }))
  } catch {
    return fallbackPlans()
  }
}

export async function getProjects(): Promise<ResolvedProject[]> {
  try {
    const rows = await prisma.project.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    if (rows.length === 0) return fallbackProjects()
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      description: r.description,
      tags: splitList(r.tags, ','),
      demo: r.demoUrl,
      gradient: r.gradient,
      image: r.image,
      featured: r.featured,
    }))
  } catch {
    return fallbackProjects()
  }
}

export async function getTemplates(): Promise<ResolvedTemplate[]> {
  try {
    const rows = await prisma.template.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })
    if (rows.length === 0) return fallbackTemplates()
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      price: r.price,
      description: r.description,
      gradient: r.gradient,
      image: r.image,
      preview: r.previewUrl,
    }))
  } catch {
    return fallbackTemplates()
  }
}

// --- Fallbacks derived from the built-in defaults -------------------------

function fallbackPlans(): ResolvedPlan[] {
  return defaultPlans.map((p, i) => ({ id: `default-${i}`, ...p }))
}

function fallbackProjects(): ResolvedProject[] {
  return defaultProjects.map((p, i) => ({
    id: `default-${i}`,
    name: p.name,
    category: p.category,
    description: p.description,
    tags: p.tags,
    demo: p.demo,
    gradient: p.gradient,
    featured: i === 0,
  }))
}

function fallbackTemplates(): ResolvedTemplate[] {
  return defaultTemplates.map((t, i) => ({
    id: `default-${i}`,
    name: t.name,
    category: t.category,
    price: t.price,
    description: t.description,
    gradient: t.gradient,
    preview: '/contact',
  }))
}
