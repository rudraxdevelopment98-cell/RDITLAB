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
      const plan = await prisma.plan.findUnique({ where: { id } })
      if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      return NextResponse.json(plan)
    }

    const admin = all ? await getCurrentAdmin(request) : null
    const plans = await prisma.plan.findMany({
      where: admin ? {} : { active: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { name, tagline, price } = body
    if (!name || !tagline || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: name, tagline, price' },
        { status: 400 },
      )
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        tagline,
        price,
        period: body.period || '',
        features: normalizeFeatures(body.features),
        cta: body.cta || 'Get started',
        popular: Boolean(body.popular),
        active: body.active === undefined ? true : Boolean(body.active),
        order: body.order != null ? Number(body.order) : await nextOrder(),
        createdBy: admin.id,
      },
    })

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'CREATE',
        entity: 'Plan',
        entityId: plan.id,
        newData: JSON.stringify(plan),
      },
    })

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Missing plan id' }, { status: 400 })

    if (updates.features !== undefined) updates.features = normalizeFeatures(updates.features)
    if (updates.order !== undefined) updates.order = Number(updates.order)
    if (updates.popular !== undefined) updates.popular = Boolean(updates.popular)
    if (updates.active !== undefined) updates.active = Boolean(updates.active)

    const oldPlan = await prisma.plan.findUnique({ where: { id } })
    const plan = await prisma.plan.update({ where: { id }, data: updates })

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE',
        entity: 'Plan',
        entityId: plan.id,
        oldData: JSON.stringify(oldPlan),
        newData: JSON.stringify(updates),
      },
    })

    return NextResponse.json(plan)
  } catch (error: any) {
    console.error('Error updating plan:', error)
    if (error.code === 'P2025') return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing plan id' }, { status: 400 })

    const plan = await prisma.plan.findUnique({ where: { id } })
    await prisma.plan.delete({ where: { id } })

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'DELETE',
        entity: 'Plan',
        entityId: id,
        oldData: JSON.stringify(plan),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting plan:', error)
    if (error.code === 'P2025') return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 })
  }
}

function normalizeFeatures(features: unknown): string {
  if (Array.isArray(features)) return features.map((f) => String(f).trim()).filter(Boolean).join('\n')
  return String(features ?? '').trim()
}

async function nextOrder(): Promise<number> {
  const last = await prisma.plan.findFirst({ orderBy: { order: 'desc' }, select: { order: true } })
  return (last?.order ?? 0) + 1
}
