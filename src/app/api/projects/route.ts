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
      const project = await prisma.project.findUnique({ where: { id } })
      if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      return NextResponse.json(project)
    }

    // `all=1` (admin only) returns inactive items too, for management.
    const admin = all ? await getCurrentAdmin(request) : null
    const projects = await prisma.project.findMany({
      where: admin ? {} : { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
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

    const project = await prisma.project.create({
      data: {
        name,
        category,
        description,
        tags: normalizeTags(body.tags),
        demoUrl: body.demoUrl || '#',
        image: body.image || null,
        gradient: body.gradient || 'from-violet-500 to-indigo-600',
        featured: Boolean(body.featured),
        active: body.active === undefined ? true : Boolean(body.active),
        order: body.order != null ? Number(body.order) : await nextOrder(),
        createdBy: admin.id,
      },
    })

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'CREATE',
        entity: 'Project',
        entityId: project.id,
        newData: JSON.stringify(project),
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Missing project id' }, { status: 400 })

    if (updates.tags !== undefined) updates.tags = normalizeTags(updates.tags)
    if (updates.order !== undefined) updates.order = Number(updates.order)
    if (updates.featured !== undefined) updates.featured = Boolean(updates.featured)
    if (updates.active !== undefined) updates.active = Boolean(updates.active)

    const oldProject = await prisma.project.findUnique({ where: { id } })
    const project = await prisma.project.update({ where: { id }, data: updates })

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE',
        entity: 'Project',
        entityId: project.id,
        oldData: JSON.stringify(oldProject),
        newData: JSON.stringify(updates),
      },
    })

    return NextResponse.json(project)
  } catch (error: any) {
    console.error('Error updating project:', error)
    if (error.code === 'P2025') return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing project id' }, { status: 400 })

    const project = await prisma.project.findUnique({ where: { id } })
    await prisma.project.delete({ where: { id } })

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'DELETE',
        entity: 'Project',
        entityId: id,
        oldData: JSON.stringify(project),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting project:', error)
    if (error.code === 'P2025') return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}

function normalizeTags(tags: unknown): string {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean).join(', ')
  return String(tags ?? '').trim()
}

async function nextOrder(): Promise<number> {
  const last = await prisma.project.findFirst({ orderBy: { order: 'desc' }, select: { order: true } })
  return (last?.order ?? 0) + 1
}
