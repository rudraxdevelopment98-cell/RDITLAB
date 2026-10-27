import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth'
import { SITE_SECTIONS } from '@/lib/content'
import { getSiteContent } from '@/lib/content.server'

export const dynamic = 'force-dynamic'

// Public: merged site copy (defaults + stored overrides)
export async function GET() {
  try {
    const content = await getSiteContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching site content:', error)
    return NextResponse.json({ error: 'Failed to fetch site content' }, { status: 500 })
  }
}

// Admin: save one or more sections. Body: { content: Partial<SiteCopy> }
export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const content = body?.content
    if (!content || typeof content !== 'object') {
      return NextResponse.json({ error: 'Missing content object' }, { status: 400 })
    }

    const saved: string[] = []
    for (const key of SITE_SECTIONS) {
      if (!(key in content)) continue
      const value = JSON.stringify(content[key])
      await prisma.siteContent.upsert({
        where: { key },
        create: { key, value, createdBy: admin.id },
        update: { value },
      })
      saved.push(key)
    }

    if (saved.length) {
      await prisma.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'UPDATE',
          entity: 'SiteContent',
          entityId: saved.join(','),
          newData: JSON.stringify({ sections: saved }),
        },
      })
    }

    const merged = await getSiteContent()
    return NextResponse.json({ success: true, saved, content: merged })
  } catch (error) {
    console.error('Error saving site content:', error)
    return NextResponse.json({ error: 'Failed to save site content' }, { status: 500 })
  }
}
