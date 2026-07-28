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
      const template = await prisma.template.findUnique({ where: { id } })
      if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })
      return NextResponse.json(template)
    }

    const admin = all ? await getCurrentAdmin(request) : null
    const templates = await prisma.template.findMany({
      where: admin ? {} : { active: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { name, category, description } = body
    if (!name || !category || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, description' },
        { status: 400 },
      )
    }

    const template = await prisma.template.create({
      data: {
        name,
        category,
        description,
        price: body.price || 'Free',
        image: body.image || null,
        gradient: body.gradient || 'from-violet-500 to-indigo-600',
        previewUrl: body.previewUrl || '#',
        active: body.active === undefined ? true : Boolean(body.active),
        order: body.order != null ? Number(body.order) : await nextOrder(),
        createdBy: admin.id,
      },
    })

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'CREATE',
        entity: 'Template',
        entityId: template.id,
        newData: JSON.stringify(template),
      },
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Missing template id' }, { status: 400 })

    if (updates.order !== undefined) updates.order = Number(updates.order)
    if (updates.active !== undefined) updates.active = Boolean(updates.active)

    const oldTemplate = await prisma.template.findUnique({ where: { id } })
    const template = await prisma.template.update({ where: { id }, data: updates })

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE',
        entity: 'Template',
        entityId: template.id,
        oldData: JSON.stringify(oldTemplate),
        newData: JSON.stringify(updates),
      },
    })

    return NextResponse.json(template)
  } catch (error: any) {
    console.error('Error updating template:', error)
    if (error.code === 'P2025') return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing template id' }, { status: 400 })

    const template = await prisma.template.findUnique({ where: { id } })
    await prisma.template.delete({ where: { id } })

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'DELETE',
        entity: 'Template',
        entityId: id,
        oldData: JSON.stringify(template),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting template:', error)
    if (error.code === 'P2025') return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}

async function nextOrder(): Promise<number> {
  const last = await prisma.template.findFirst({ orderBy: { order: 'desc' }, select: { order: true } })
  return (last?.order ?? 0) + 1
}
