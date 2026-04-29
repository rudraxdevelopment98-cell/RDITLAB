import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    let pages
    if (section) {
      pages = await prisma.page.findMany({
        where: { section },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      pages = await prisma.page.findMany({
        orderBy: { createdAt: 'desc' },
      })
    }

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, section, content } = await request.json()

    if (!title || !section || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, section, content' },
        { status: 400 }
      )
    }

    const page = await prisma.page.create({
      data: {
        title,
        section,
        content,
        createdBy: admin.id,
      },
    })

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'CREATE',
        entity: 'Page',
        entityId: page.id,
        newData: JSON.stringify({ title, section, content }),
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error: any) {
    console.error('Error creating page:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Page with this title already exists in this section' },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing page id' }, { status: 400 })
    }

    const oldPage = await prisma.page.findUnique({ where: { id } })

    const page = await prisma.page.update({
      where: { id },
      data: updates,
    })

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE',
        entity: 'Page',
        entityId: page.id,
        oldData: JSON.stringify(oldPage),
        newData: JSON.stringify(updates),
      },
    })

    return NextResponse.json(page)
  } catch (error: any) {
    console.error('Error updating page:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing page id' }, { status: 400 })
    }

    const page = await prisma.page.findUnique({ where: { id } })

    await prisma.page.delete({ where: { id } })

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'DELETE',
        entity: 'Page',
        entityId: id,
        oldData: JSON.stringify(page),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting page:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
  }
}
