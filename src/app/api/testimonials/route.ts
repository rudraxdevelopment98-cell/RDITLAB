import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const all = searchParams.get('all')

    if (id) {
      const t = await prisma.testimonial.findUnique({ where: { id } })
      if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(t)
    }

    const admin = all ? await getCurrentAdmin(request) : null
    const testimonials = await prisma.testimonial.findMany({
      where: admin ? {} : { active: true, approved: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    const body = await request.json()
    const { name, quote } = body
    if (!name || !quote) {
      return NextResponse.json({ error: 'Name and quote are required' }, { status: 400 })
    }

    // Admins create approved testimonials; visitors submit for approval.
    const isAdmin = Boolean(admin)
    const t = await prisma.testimonial.create({
      data: {
        name: String(name).slice(0, 120),
        role: String(body.role ?? '').slice(0, 120),
        company: String(body.company ?? '').slice(0, 120),
        photo: body.photo || null,
        rating: clampRating(body.rating),
        quote: String(quote).slice(0, 1500),
        source: isAdmin ? 'admin' : 'visitor',
        approved: isAdmin ? (body.approved ?? true) : false,
        featured: isAdmin ? Boolean(body.featured) : false,
        active: true,
        order: isAdmin && body.order != null ? Number(body.order) : await nextOrder(),
        createdBy: admin?.id ?? null,
      },
    })

    if (isAdmin && admin) {
      await prisma.auditLog.create({
        data: { adminId: admin.id, action: 'CREATE', entity: 'Testimonial', entityId: t.id, newData: JSON.stringify(t) },
      })
    }

    return NextResponse.json(
      isAdmin ? t : { success: true, message: 'Thank you! Your testimonial was submitted for review.' },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Failed to submit testimonial' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    if (updates.rating !== undefined) updates.rating = clampRating(updates.rating)
    if (updates.order !== undefined) updates.order = Number(updates.order)
    for (const k of ['approved', 'featured', 'active']) {
      if (updates[k] !== undefined) updates[k] = Boolean(updates[k])
    }

    const old = await prisma.testimonial.findUnique({ where: { id } })
    const t = await prisma.testimonial.update({ where: { id }, data: updates })

    await prisma.auditLog.create({
      data: { adminId: admin.id, action: 'UPDATE', entity: 'Testimonial', entityId: t.id, oldData: JSON.stringify(old), newData: JSON.stringify(updates) },
    })

    return NextResponse.json(t)
  } catch (error: any) {
    console.error('Error updating testimonial:', error)
    if (error.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const t = await prisma.testimonial.findUnique({ where: { id } })
    await prisma.testimonial.delete({ where: { id } })
    await prisma.auditLog.create({
      data: { adminId: admin.id, action: 'DELETE', entity: 'Testimonial', entityId: id, oldData: JSON.stringify(t) },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting testimonial:', error)
    if (error.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}

function clampRating(r: unknown): number {
  const n = Math.round(Number(r) || 5)
  return Math.max(1, Math.min(5, n))
}

async function nextOrder(): Promise<number> {
  const last = await prisma.testimonial.findFirst({ orderBy: { order: 'desc' }, select: { order: true } })
  return (last?.order ?? 0) + 1
}
