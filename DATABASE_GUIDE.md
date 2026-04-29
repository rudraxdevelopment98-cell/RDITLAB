# Prisma Database Operations Guide

## 📋 Table of Contents
1. [Basic Queries](#basic-queries)
2. [Common Operations](#common-operations)
3. [Advanced Features](#advanced-features)
4. [Debugging](#debugging)

---

## Basic Queries

### Create Records

#### Create Admin
```typescript
const admin = await prisma.admin.create({
  data: {
    email: 'user@example.com',
    password: await hashPassword('SecurePass123!'),
    name: 'John Doe',
    role: 'admin',
  },
})
```

#### Create Page
```typescript
const page = await prisma.page.create({
  data: {
    title: 'Welcome',
    section: 'hero',
    content: 'Welcome to RD IT Lab',
    createdBy: adminId,
  },
})
```

#### Create Team Member
```typescript
const member = await prisma.teamMember.create({
  data: {
    name: 'John Smith',
    role: 'Senior Developer',
    bio: 'Experienced developer with 10 years in IT',
    image: '/images/john.jpg',
    order: 1,
    createdBy: adminId,
  },
})
```

### Read Records

#### Get All Pages
```typescript
const pages = await prisma.page.findMany({
  orderBy: { createdAt: 'desc' },
})
```

#### Get Pages by Section
```typescript
const aboutPages = await prisma.page.findMany({
  where: { section: 'about' },
})
```

#### Get Single Page
```typescript
const page = await prisma.page.findUnique({
  where: { id: pageId },
})
```

#### Get Team Members (Ordered)
```typescript
const team = await prisma.teamMember.findMany({
  where: { active: true },
  orderBy: { order: 'asc' },
})
```

#### Get Admin by Email
```typescript
const admin = await prisma.admin.findUnique({
  where: { email: 'admin@rditlab.co.uk' },
})
```

### Update Records

#### Update Page
```typescript
const updated = await prisma.page.update({
  where: { id: pageId },
  data: {
    content: 'New content here',
    updatedAt: new Date(),
  },
})
```

#### Update Team Member
```typescript
const updated = await prisma.teamMember.update({
  where: { id: memberId },
  data: {
    role: 'Lead Developer',
    order: 2,
  },
})
```

#### Update Admin Password
```typescript
const updated = await prisma.admin.update({
  where: { id: adminId },
  data: {
    password: await hashPassword('NewPassword123!'),
  },
})
```

### Delete Records

#### Delete Page
```typescript
const deleted = await prisma.page.delete({
  where: { id: pageId },
})
```

#### Delete Team Member
```typescript
const deleted = await prisma.teamMember.delete({
  where: { id: memberId },
})
```

#### Delete with Relations (Cascade)
```typescript
// When deleting admin, audit logs are automatically deleted (onDelete: Cascade)
const deleted = await prisma.admin.delete({
  where: { id: adminId },
})
```

---

## Common Operations

### Check if Record Exists

```typescript
const exists = await prisma.page.findUnique({
  where: {
    title_section: {
      title: 'Welcome',
      section: 'hero',
    },
  },
})

if (exists) {
  // Record found
}
```

### Get with Relations

```typescript
// Get audit logs with admin info
const logs = await prisma.auditLog.findMany({
  include: {
    admin: true,  // Include admin details
  },
  orderBy: { createdAt: 'desc' },
  take: 100,  // Limit to last 100
})
```

### Count Records

```typescript
const pageCount = await prisma.page.count()
const teamCount = await prisma.teamMember.count({
  where: { active: true },
})
```

### Pagination

```typescript
const page1 = await prisma.page.findMany({
  skip: 0,      // Pages to skip
  take: 10,     // Items per page
  orderBy: { createdAt: 'desc' },
})

// Page 2
const page2 = await prisma.page.findMany({
  skip: 10,
  take: 10,
  orderBy: { createdAt: 'desc' },
})
```

### Search

```typescript
// Find pages containing text (SQLite)
const results = await prisma.page.findMany({
  where: {
    OR: [
      { title: { contains: 'search term', mode: 'insensitive' } },
      { content: { contains: 'search term', mode: 'insensitive' } },
    ],
  },
})
```

### Upsert (Create or Update)

```typescript
const page = await prisma.page.upsert({
  where: {
    title_section: {
      title: 'Welcome',
      section: 'hero',
    },
  },
  update: {
    content: 'Updated content',
  },
  create: {
    title: 'Welcome',
    section: 'hero',
    content: 'New content',
    createdBy: adminId,
  },
})
```

---

## Advanced Features

### Transactions (Multiple Operations)

```typescript
// Ensure all operations succeed or none do
const [page, log] = await prisma.$transaction([
  prisma.page.create({
    data: {
      // ...
    },
  }),
  prisma.auditLog.create({
    data: {
      // ...
    },
  }),
])
```

### Audit Logging

```typescript
// Log every admin action
await prisma.auditLog.create({
  data: {
    adminId: admin.id,
    action: 'UPDATE',  // CREATE, UPDATE, DELETE, LOGIN
    entity: 'Page',    // Page, TeamMember, Admin
    entityId: page.id,
    oldData: JSON.stringify({
      title: 'Old Title',
      content: 'Old Content',
    }),
    newData: JSON.stringify({
      title: 'New Title',
      content: 'New Content',
    }),
  },
})
```

### Get Recent Activity

```typescript
const recentActivity = await prisma.auditLog.findMany({
  where: {
    createdAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    },
  },
  include: {
    admin: {
      select: { email: true, name: true },
    },
  },
  orderBy: { createdAt: 'desc' },
  take: 50,
})
```

### Bulk Operations

```typescript
// Update multiple records
const updated = await prisma.teamMember.updateMany({
  where: { active: false },
  data: { active: true },
})

// Delete multiple records
const deleted = await prisma.page.deleteMany({
  where: {
    createdAt: {
      lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days old
    },
  },
})
```

---

## Debugging

### Open Prisma Studio

Interactive database GUI:
```bash
npm run prisma:studio
# Opens at http://localhost:5555
```

Features:
- View, edit, and delete records graphically
- Query builder
- Real-time data inspection
- No need to write SQL

### Check Schema

View current database schema:
```bash
cat prisma/schema.prisma
```

### View Migrations

See all applied migrations:
```bash
ls -la prisma/migrations/
```

### Generate Prisma Client

Regenerate after schema changes:
```bash
npx prisma generate
```

### Validate Schema

Check for syntax errors:
```bash
npx prisma validate
```

### Debug Queries

Enable debug logging:
```typescript
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})
```

Or via environment:
```bash
DEBUG=* npm run dev
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Unique constraint failed` | Duplicate record | Check for existing record before create |
| `Record not found` | Delete non-existent record | Use `findUnique` first to verify |
| `Database locked` | Concurrent access | Increase transaction timeout |
| `Foreign key constraint failed` | Invalid relation ID | Verify referenced record exists |
| `Invalid input` | Wrong type | Check column types in schema |

### Database Reset

⚠️ **WARNING**: Deletes all data!

```bash
# Full reset (drop and recreate)
npx prisma migrate reset

# Create new migration without reset
npx prisma migrate dev --name new_migration

# Apply existing migrations only
npx prisma migrate deploy
```

### Query Performance

For large datasets:

```typescript
// Use select to fetch only needed fields
const pages = await prisma.page.findMany({
  select: {
    id: true,
    title: true,
    section: true,
  },
  take: 100,
})

// Use skip/take for pagination
const page = await prisma.page.findMany({
  skip: (pageNum - 1) * 50,
  take: 50,
})
```

### Production Considerations

1. **Connection Pooling**
   - Use PgBouncer with PostgreSQL
   - Improves connection efficiency

2. **Query Optimization**
   - Add indexes to frequently queried columns
   - Use `select` to limit returned fields
   - Avoid fetching large arrays

3. **Monitoring**
   - Log slow queries
   - Monitor connection count
   - Track error rates

4. **Maintenance**
   - Regular backups
   - Archive old audit logs
   - Monitor disk usage

---

## API Example: Complete CRUD

```typescript
// routes/api/pages/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth'

// GET all pages (public)
export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { section: 'asc' },
    })
    return NextResponse.json(pages)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

// POST create page (requires auth)
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { title, section, content } = await request.json()

    const page = await prisma.page.create({
      data: { title, section, content, createdBy: admin.id },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    )
  }
}
```

---

**Last Updated**: April 27, 2026  
**Prisma Version**: ^5.8.0  
**Database Support**: SQLite (dev), PostgreSQL (production)
