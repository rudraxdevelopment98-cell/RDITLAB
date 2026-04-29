import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const member = await prisma.teamMember.findUnique({
        where: { id },
      })
      if (!member) {
        return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
      }
      return NextResponse.json(member)
    }

    const team = await prisma.teamMember.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(team)
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, role, bio, image } = await request.json()

    if (!name || !role || !bio || !image) {
      return NextResponse.json(
        { error: 'Missing required fields: name, role, bio, image' },
        { status: 400 }
      )
    }

    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        bio,
        image,
        createdBy: admin.id,
        order: await getNextOrder(),
      },
    })

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'CREATE',
        entity: 'TeamMember',
        entityId: member.id,
        newData: JSON.stringify({ name, role, bio, image }),
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing member id' }, { status: 400 })
    }

    const oldMember = await prisma.teamMember.findUnique({ where: { id } })

    const member = await prisma.teamMember.update({
      where: { id },
      data: updates,
    })

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE',
        entity: 'TeamMember',
        entityId: member.id,
        oldData: JSON.stringify(oldMember),
        newData: JSON.stringify(updates),
      },
    })

    return NextResponse.json(member)
  } catch (error: any) {
    console.error('Error updating team member:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing member id' }, { status: 400 })
    }

    const member = await prisma.teamMember.findUnique({ where: { id } })

    await prisma.teamMember.delete({ where: { id } })

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'DELETE',
        entity: 'TeamMember',
        entityId: id,
        oldData: JSON.stringify(member),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting team member:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
  }
}

async function getNextOrder(): Promise<number> {
  const lastMember = await prisma.teamMember.findFirst({
    orderBy: { order: 'desc' },
    select: { order: true },
  })
  return (lastMember?.order ?? 0) + 1
}
