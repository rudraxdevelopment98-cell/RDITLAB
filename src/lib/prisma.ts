import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

/**
 * Resolve a Postgres connection string from any of the common env var names
 * (Vercel Neon integration uses several), prefer a DIRECT/non-pooled URL, and
 * pin the app to its OWN schema ("rditlab") so it never collides with tables
 * another app keeps in the shared database's "public" schema.
 */
function normalizeDatabaseUrl() {
  const candidates = [
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.NEON_DATABASE_URL,
  ]

  let databaseUrl = candidates.find((u) => u && u.trim().length > 0)

  if (!databaseUrl) {
    databaseUrl = 'file:./prisma/dev.db'
  }

  const isPostgres = /^postgres(ql)?:/.test(databaseUrl)
  if (isPostgres) {
    // pgbouncer flag breaks on a direct connection — strip it.
    databaseUrl = databaseUrl.replace(/([?&])pgbouncer=true&?/i, '$1').replace(/[?&]$/, '')
    if (!/[?&]schema=/.test(databaseUrl)) {
      databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'schema=rditlab'
    }
  }

  process.env.DATABASE_URL = databaseUrl
}

normalizeDatabaseUrl()

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
