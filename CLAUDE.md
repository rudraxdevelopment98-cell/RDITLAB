# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RD IT Lab UK is a Next.js 14 (App Router) company website for an IT services firm. It includes a public-facing marketing site and a password-protected admin portal for managing content and team members.

## Commands

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Build (runs prisma generate first)
npm run build

# Lint
npm run lint

# Database migrations
npx prisma migrate dev --name <migration-name>   # Create and apply a new migration
npx prisma migrate deploy                         # Apply pending migrations in production
npx prisma db push                                # Push schema changes without a migration (dev only)
npx prisma studio                                 # Open DB browser GUI

# Seed the database (creates initial admin user and page content)
npx ts-node prisma/seed.ts

# Migrate data from legacy JSON files to Prisma
npx ts-node scripts/migrate-data.ts

# Generate a JWT secret for production
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Architecture

### Data Layer — two coexisting implementations

**Current**: `src/lib/prisma.ts` exports a singleton `prisma` client. All active API routes import and use this directly. `normalizeDatabaseUrl()` defaults `DATABASE_URL` to `file:./prisma/dev.db` when the env var is not set, so local dev works with no `.env` file.

**Legacy (do not use for new code)**: `src/lib/db.ts` is a JSON flat-file storage layer that reads/writes `data/pages.json` and `data/team.json`. It is no longer called by any API route but still initialises on import, creating those files if absent. The `scripts/migrate-data.ts` script was used to move this data into Prisma.

### Database

- **Development**: SQLite (`prisma/dev.db`). `schema.prisma` uses `provider = "sqlite"` and migrations in `prisma/migrations/` are SQLite syntax. Seed with `npx ts-node prisma/seed.ts`.
- **Production (Vercel)**: Before deploying to PostgreSQL, change `schema.prisma` provider to `"postgresql"`, run `npx prisma migrate dev --name pg-init` to generate PostgreSQL-compatible migrations, set `DATABASE_URL` in Vercel env vars, then run `npx prisma migrate deploy` and `npx ts-node prisma/seed.ts` in the production environment.
- Schema models: `Admin`, `Page`, `TeamMember`, `AuditLog`
- `Page` has a unique constraint on `(title, section)` — Prisma error code `P2002` on conflict
- `TeamMember.order` controls display order; `getNextOrder()` in the team route auto-increments it

### Authentication

JWT tokens are issued at login and stored in an HTTP-only `auth_token` cookie (24h by default, configurable via `JWT_EXPIRY`).

- `src/lib/auth.ts` — token generation, verification, cookie get/set/clear
- `src/lib/middleware.ts` — `withAuth()` and `withAdminRole()` HOFs that wrap route handlers; they attach the decoded payload as `(request as any).admin`
- `src/lib/password.ts` — bcrypt hashing (12 rounds), comparison, strength validation (8+ chars, upper, lower, digit)

API routes perform auth by calling `getCurrentAdmin(request)` from `src/lib/auth.ts`; they do **not** use Next.js middleware (`middleware.ts` at root doesn't exist). Admin route protection on the client side is handled by `src/components/admin/ProtectedAdmin.tsx`, which checks `/api/auth/session` on mount and redirects to `/login` if unauthenticated.

### Audit Logging

Every mutating admin action (CREATE/UPDATE/DELETE, plus LOGIN) writes an `AuditLog` row with `oldData`/`newData` stored as JSON strings. The audit log API (`/api/audit-logs`) supports filtering by `action`/`entity` and pagination via `limit`/`offset` query params.

### Email

`src/lib/email.ts` uses **Resend** (not nodemailer, despite nodemailer appearing in `package.json` and `.env.example`). Email is optional — if `RESEND_API_KEY` is unset, all email calls are silently skipped. `sendAdminNotification()` sends to `ALERT_EMAIL` and is called on login, password changes, and password resets.

### File Uploads

`/api/upload` accepts `multipart/form-data`, validates MIME type (JPEG/PNG/WebP/GIF) and size (≤5 MB), and writes files to `public/uploads/` with a `{timestamp}-{original-name}` filename. Uploaded image URLs are `/uploads/<filename>`.

### Admin Panel

`/admin` is a single client-side page (`src/app/admin/page.tsx`) with five tab-switched sections: Dashboard, Pages & Content, Team Members, Audit Logs, Settings. All tab components live in `src/components/admin/`. The `ProtectedAdmin` wrapper renders the header and handles session/logout; tab content is rendered as children.

### Public Site

`src/app/page.tsx` assembles the landing page from section components (Navbar, Hero, About, Services, Contact, Footer). The `Hero` component renders a Three.js/`@react-three/fiber` interactive network visualization. Each section corresponds to a `section` value in the `Page` model (`hero`, `about`, `services`, `contact`).

## Environment Variables

Copy `.env.example` to `.env.local` for local development. Required:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Prisma connection string |
| `JWT_SECRET` | Must be ≥32 chars; change from default before any real use |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed script credentials |
| `NEXT_PUBLIC_API_URL` | Base URL for password-reset links |
| `RESEND_API_KEY` | Resend API key (optional; email silently disabled if absent) |
| `EMAIL_FROM` | Sender address for Resend emails |
| `ALERT_EMAIL` | Recipient for admin notifications |

## TypeScript / Path Aliases

`@/` maps to `src/` (configured in `tsconfig.json`). All internal imports use this alias.

## Styling

Tailwind CSS with no custom plugins. Brand colour is amber (`amber-600` / `amber-700`). The theme extends only gradient utilities. No component library is used.
