/**
 * Database Migration Script
 * Migrates data from JSON files to Prisma database
 * Run with: npx ts-node scripts/migrate-data.ts
 */

import { PrismaClient } from '@prisma/client'
import { hashPassword } from '@/lib/password'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function migrateData() {
  try {
    console.log('🚀 Starting data migration...\n')

    // 1. Create default admin user
    console.log('📝 Creating admin user...')
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rditlab.co.uk'
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!'

    const hashedPassword = await hashPassword(adminPassword)

    const admin = await prisma.admin.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin',
      },
    })

    console.log(`✅ Admin user created: ${admin.email}\n`)

    // 2. Migrate Pages from JSON
    console.log('📄 Migrating pages...')
    const dataDir = path.join(process.cwd(), 'data')
    const pagesFile = path.join(dataDir, 'pages.json')

    if (fs.existsSync(pagesFile)) {
      const pagesData = JSON.parse(fs.readFileSync(pagesFile, 'utf-8'))

      for (const page of pagesData) {
        await prisma.page.upsert({
          where: {
            title_section: {
              title: page.title,
              section: page.section,
            },
          },
          update: {
            content: page.content,
          },
          create: {
            title: page.title,
            section: page.section,
            content: page.content,
            createdBy: admin.id,
          },
        })
      }

      console.log(`✅ Migrated ${pagesData.length} pages\n`)
    } else {
      console.log('⚠️  No pages.json found, skipping\n')
    }

    // 3. Migrate Team Members from JSON
    console.log('👥 Migrating team members...')
    const teamFile = path.join(dataDir, 'team.json')

    if (fs.existsSync(teamFile)) {
      const teamData = JSON.parse(fs.readFileSync(teamFile, 'utf-8'))

      for (const member of teamData) {
        await prisma.teamMember.upsert({
          where: { id: member.id },
          update: {
            name: member.name,
            role: member.role,
            bio: member.bio,
            image: member.image,
          },
          create: {
            id: member.id,
            name: member.name,
            role: member.role,
            bio: member.bio,
            image: member.image,
            createdBy: admin.id,
          },
        })
      }

      console.log(`✅ Migrated ${teamData.length} team members\n`)
    } else {
      console.log('⚠️  No team.json found, skipping\n')
    }

    console.log('✨ Migration completed successfully!\n')
    console.log('📋 Summary:')
    console.log(`   - Admin: ${admin.email}`)
    console.log(`   - Pages: Migrated`)
    console.log(`   - Team Members: Migrated`)
    console.log(`   - Database: Ready to use\n`)

    console.log('🔐 Important: Update the following in production:')
    console.log(`   - Admin password: Change from "${adminPassword}"`)
    console.log(`   - JWT_SECRET: Generate a new one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"\n`)

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Migration failed:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

migrateData()
