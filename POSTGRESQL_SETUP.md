# PostgreSQL Migration Guide

Successfully switched from SQLite to PostgreSQL! Here's how to set it up:

## Step 1: Set Up Vercel Postgres

1. **Log in to your Vercel Dashboard**: https://vercel.com/dashboard
2. **Go to Storage** (in the sidebar)
3. **Create Database** → Select **Postgres**
4. **Choose your region** closest to your users
5. **Name it** (e.g., "rditlab-db")

## Step 2: Get Your Connection String

After creating the database:

1. Click on your new Postgres database
2. Go to the **.env.local** tab
3. Copy the `POSTGRES_URL` (this is your `DATABASE_URL`)
4. You'll see several connection strings:
   - `POSTGRES_URL` - Use this one
   - `POSTGRES_URL_NON_POOLING` - Use this if you get connection pool errors
   - `POSTGRES_PRISMA_URL` - Use this for Prisma specifically

## Step 3: Update Environment Variables

### For Local Development:

Add to your `.env.local` (create if it doesn't exist):

```env
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
ADMIN_EMAIL="rudraxdevelopment98@gmail.com"
ADMIN_PASSWORD="ChangeMe123!"
NEXT_PUBLIC_API_URL="http://localhost:3000"
JWT_EXPIRY=24
```

Replace the placeholder values with your actual credentials from Vercel PostgreSQL panel.

### For Vercel Production:

1. Go to your **Vercel Project Settings**
2. Navigate to **Environment Variables**
3. Add the following:
   - `DATABASE_URL` → Your Vercel Postgres connection string
   - `JWT_SECRET` → Strong, random value (min 32 chars)
   - `ADMIN_EMAIL` → Your admin email
   - `ADMIN_PASSWORD` → Strong password
   - `NEXT_PUBLIC_API_URL` → Your production URL (will be vercel domain)
   - `JWT_EXPIRY` → 24

## Step 4: Run Migrations

```bash
# Clear old SQLite migrations (keep for reference, don't need them now)
# The migrations folder already exists but we'll use Prisma to handle PostgreSQL

# Generate Prisma client
npx prisma generate

# Create initial schema on PostgreSQL (this will create all tables)
npx prisma db push

# Verify connection and seed initial admin (optional)
npx prisma studio
```

## Step 5: Test Locally

1. Make sure PostgreSQL is running locally OR your Vercel connection is accessible
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Test the following:
   - Login page works
   - Create new admin/user
   - Password reset flow
   - Email sending (check logs)
   - File uploads

## Step 6: Deploy to Vercel

```bash
git add .
git commit -m "Switch database from SQLite to PostgreSQL"
git push origin main
```

Vercel will automatically:
- Use the environment variables you set
- Run migrations as part of the build process (if configured)
- Deploy your updated application

## Troubleshooting

### Connection Pool Errors
If you get "too many connections" errors:
1. Use `POSTGRES_URL_NON_POOLING` instead in `.env`
2. Or switch to `POSTGRES_PRISMA_URL` which is optimized for Prisma

### Migrations Not Running in Vercel
Add this to your `next.config.js` or create a build script that runs:
```bash
npx prisma db push
```

### Still Getting Database Errors
Check:
1. Connection string is correctly copied (no extra spaces)
2. Firewall isn't blocking connections
3. Database is actually running
4. User/password are correct

## What Changed

- **Prisma Schema**: Updated provider from `sqlite` to `postgresql`
- **Connection String Format**: From `file:./prisma/dev.db` to `postgresql://...`
- **No code changes**: Your TypeScript/API code remains the same!

## Benefits of PostgreSQL on Vercel

✅ Serverless compatible (no file system issues)
✅ Better performance (connection pooling)
✅ Scalable (no storage limits like SQLite)
✅ Better for concurrent requests
✅ Proper support for all SQL features
✅ No more "database is locked" errors
✅ Built-in backup and recovery

## Next Steps

1. Set up Vercel Postgres (if not already done)
2. Copy connection string to `.env.local`
3. Run `npx prisma db push`
4. Test locally with `npm run dev`
5. Deploy to Vercel
6. Verify everything works in production

Your app should now work smoothly on Vercel! 🚀
