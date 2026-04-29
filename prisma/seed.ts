import { PrismaClient } from '@prisma/client'

// Import hash function directly
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(12)
  return bcryptjs.hash(password, salt)
}

async function main() {
  try {
    console.log('🌱 Seeding database...\n')

    // Create default admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'rudraxdevelopment98@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!'

    console.log(`📝 Creating admin user: ${adminEmail}`)
    const hashedPassword = await hashPassword(adminPassword)

    const admin = await prisma.admin.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
      },
      create: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin',
      },
    })

    console.log(`✅ Admin user created: ${admin.email}\n`)

    // Add some initial page content
    console.log('📄 Creating initial page content...')
    const pages = [
      {
        title: 'Welcome',
        section: 'hero',
        content:
          'Welcome to RD IT Lab - Your trusted IT solutions partner in the UK.',
      },
      {
        title: 'About Us',
        section: 'about',
        content:
          'RD IT Lab is a leading provider of innovative IT services and solutions.',
      },
      {
        title: 'Our Services',
        section: 'services',
        content:
          'We offer a comprehensive range of IT services tailored to your needs.',
      },
      {
        title: 'Contact Us',
        section: 'contact',
        content: 'Get in touch with us for more information about our services.',
      },
    ]

    for (const page of pages) {
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
          ...page,
          createdBy: admin.id,
        },
      })
      console.log(`  ✓ ${page.title}`)
    }

    console.log(`\n✨ Seeding completed successfully!\n`)
    console.log('🔐 Initial Admin Credentials:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log(`\n⚠️  IMPORTANT: Update the password after first login!\n`)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
