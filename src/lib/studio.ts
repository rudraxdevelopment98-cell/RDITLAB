import { prisma } from '@/lib/prisma'
import {
  plans as defaultPlans,
  projects as defaultProjects,
  templates as defaultTemplates,
} from '@/components/studio/data'

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
  overview?: string
  presentationUrl?: string
  presentationType?: string
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

export type ResolvedTestimonial = {
  id: string
  name: string
  role: string
  company: string
  photo?: string | null
  rating: number
  quote: string
  featured?: boolean
}

const splitList = (value: string, sep: string) =>
  value.split(sep).map((s) => s.trim()).filter(Boolean)

export async function getPlans(): Promise<ResolvedPlan[]> {
  try {
    const rows = await prisma.plan.findMany({ where: { active: true }, orderBy: { order: 'asc' } })
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
    return rows.map(mapProject)
  } catch {
    return fallbackProjects()
  }
}

export async function getProject(id: string): Promise<ResolvedProject | null> {
  try {
    const r = await prisma.project.findUnique({ where: { id } })
    if (!r) {
      const fb = fallbackProjects().find((p) => p.id === id)
      return fb ?? null
    }
    return mapProject(r)
  } catch {
    return fallbackProjects().find((p) => p.id === id) ?? null
  }
}

function mapProject(r: any): ResolvedProject {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description,
    tags: splitList(r.tags, ','),
    demo: r.demoUrl,
    gradient: r.gradient,
    image: r.image,
    featured: r.featured,
    overview: r.overview || '',
    presentationUrl: r.presentationUrl || '',
    presentationType: r.presentationType || '',
  }
}

export async function getTemplates(): Promise<ResolvedTemplate[]> {
  try {
    const rows = await prisma.template.findMany({ where: { active: true }, orderBy: { order: 'asc' } })
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

export async function getTestimonials(): Promise<ResolvedTestimonial[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { active: true, approved: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    if (rows.length === 0) return fallbackTestimonials()
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      company: r.company,
      photo: r.photo,
      rating: r.rating,
      quote: r.quote,
      featured: r.featured,
    }))
  } catch {
    return fallbackTestimonials()
  }
}

// --- Fallbacks ------------------------------------------------------------

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
    overview: '',
    presentationUrl: '',
    presentationType: '',
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

function fallbackTestimonials(): ResolvedTestimonial[] {
  return [
    { id: 'd-0', name: 'Rajesh Patel', role: 'Owner', company: 'Harrow Auto Garage', rating: 5, quote: 'RD IT Lab rebuilt our office network and set up a new booking website — fast, professional, and no downtime. Highly recommended.', featured: true },
    { id: 'd-1', name: 'Sarah Thompson', role: 'Practice Manager', company: 'Aarogya Clinic', rating: 5, quote: 'They delivered our appointment-booking site ahead of schedule and handled everything securely. Brilliant to work with.' },
    { id: 'd-2', name: 'Daniel Okafor', role: 'Founder', company: 'PeakFit Studio', rating: 5, quote: 'The custom membership app they built just works. Clear communication and genuine care for the details.' },
  ]
}
