import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth'
import { launches as defaultLaunches } from '@/lib/launches'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all')

    const admin = all ? await getCurrentAdmin(request) : null
    const rows = await prisma.launch.findMany({
      where: admin ? {} : { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching launches:', error)
    return NextResponse.json({ error: 'Failed to fetch launches' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()

    // One-click: seed the built-in default products (skips slugs that exist).
    if (body?.importDefaults) {
      const existing = await prisma.launch.findMany({ select: { slug: true } })
      const have = new Set(existing.map((r) => r.slug))
      let created = 0
      for (let i = 0; i < defaultLaunches.length; i++) {
        const l = defaultLaunches[i]
        if (have.has(l.slug)) continue
        await prisma.launch.create({
          data: {
            slug: l.slug,
            name: l.name,
            category: l.category,
            tagline: l.tagline,
            description: l.description,
            features: l.features.join('\n'),
            stack: l.stack.join(', '),
            liveUrl: l.liveUrl || '',
            liveLabel: l.liveLabel || '',
            duration: l.duration,
            accent: l.accent,
            order: i,
            createdBy: admin.id,
          },
        })
        created++
      }
      await prisma.auditLog.create({
        data: { adminId: admin.id, action: 'CREATE', entity: 'Launch', entityId: 'import-defaults', newData: JSON.stringify({ created }) },
      })
      return NextResponse.json({ success: true, created })
    }

    if (!body.name || !body.category || !body.tagline || !body.description) {
      return NextResponse.json({ error: 'Missing required fields: name, category, tagline, description' }, { status: 400 })
    }

    const slug = await uniqueSlug(body.slug || body.name)

    const launch = await prisma.launch.create({
      data: {
        slug,
        name: body.name,
        category: body.category,
        tagline: body.tagline,
        description: body.description,
        features: normalizeLines(body.features),
        stack: normalizeCsv(body.stack),
        liveUrl: body.liveUrl || '',
        liveLabel: body.liveLabel || '',
        duration: body.duration != null ? Number(body.duration) : 0,
        accent: body.accent || '#b45309',
        videoUrl: body.videoUrl || '',
        previewUrl: body.previewUrl || '',
        posterUrl: body.posterUrl || '',
        active: body.active === undefined ? true : Boolean(body.active),
        order: body.order != null ? Number(body.order) : await nextOrder(),
        createdBy: admin.id,
      },
    })

    await prisma.auditLog.create({
      data: { adminId: admin.id, action: 'CREATE', entity: 'Launch', entityId: launch.id, newData: JSON.stringify(launch) },
    })

    return NextResponse.json(launch, { status: 201 })
  } catch (error: any) {
    console.error('Error creating launch:', error)
    if (error.code === 'P2002') return NextResponse.json({ error: 'A product with that slug already exists' }, { status: 400 })
    return NextResponse.json({ error: 'Failed to create launch' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Missing launch id' }, { status: 400 })

    if (updates.features !== undefined) updates.features = normalizeLines(updates.features)
    if (updates.stack !== undefined) updates.stack = normalizeCsv(updates.stack)
    if (updates.duration !== undefined) updates.duration = Number(updates.duration)
    if (updates.order !== undefined) updates.order = Number(updates.order)
    if (updates.active !== undefined) updates.active = Boolean(updates.active)
    // slug is immutable once set (media paths depend on it); ignore attempts to change it
    delete updates.slug

    const oldRow = await prisma.launch.findUnique({ where: { id } })
    const launch = await prisma.launch.update({ where: { id }, data: updates })

    await prisma.auditLog.create({
      data: { adminId: admin.id, action: 'UPDATE', entity: 'Launch', entityId: launch.id, oldData: JSON.stringify(oldRow), newData: JSON.stringify(updates) },
    })

    return NextResponse.json(launch)
  } catch (error: any) {
    console.error('Error updating launch:', error)
    if (error.code === 'P2025') return NextResponse.json({ error: 'Launch not found' }, { status: 404 })
    return NextResponse.json({ error: 'Failed to update launch' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing launch id' }, { status: 400 })

    const row = await prisma.launch.findUnique({ where: { id } })
    await prisma.launch.delete({ where: { id } })

    await prisma.auditLog.create({
      data: { adminId: admin.id, action: 'DELETE', entity: 'Launch', entityId: id, oldData: JSON.stringify(row) },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting launch:', error)
    if (error.code === 'P2025') return NextResponse.json({ error: 'Launch not found' }, { status: 404 })
    return NextResponse.json({ error: 'Failed to delete launch' }, { status: 500 })
  }
}

function normalizeLines(v: unknown): string {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean).join('\n')
  return String(v ?? '').trim()
}
function normalizeCsv(v: unknown): string {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean).join(', ')
  return String(v ?? '').trim()
}
function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'product'
}
async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base)
  let slug = root
  let n = 2
  while (await prisma.launch.findUnique({ where: { slug } })) {
    slug = `${root}-${n++}`
  }
  return slug
}
async function nextOrder(): Promise<number> {
  const last = await prisma.launch.findFirst({ orderBy: { order: 'desc' }, select: { order: true } })
  return (last?.order ?? 0) + 1
}
