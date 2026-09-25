import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

/**
 * Resolve a Postgres connection string from any of the common env var names.
 * Vercel Postgres / Neon integrations set POSTGRES_PRISMA_URL etc. rather than
 * DATABASE_URL, so we fall back through them and copy the winner into
 * DATABASE_URL (which prisma/schema.prisma reads).
 */
function normalizeDatabaseUrl() {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.NEON_DATABASE_URL,
  ]

  let databaseUrl = candidates.find((u) => u && u.trim().length > 0)

  // Last-resort local dev fallback (SQLite is not compatible with the
  // postgresql provider, but this keeps local tooling from crashing).
  if (!databaseUrl) {
    databaseUrl = 'file:./prisma/dev.db'
  }

  const isSqliteUrl =
    databaseUrl.startsWith('file:') || databaseUrl.startsWith('./') || databaseUrl.startsWith('/')
  const isKnownProtocol = /^(file:|postgres(ql)?:|mysql:|mongodb:|sqlserver:)/.test(databaseUrl)

  if (!isKnownProtocol && isSqliteUrl) {
    databaseUrl = `file:${databaseUrl}`
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
