#!/bin/bash

echo "🚀 RDITLAB Deployment Script"
echo "============================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Link to Vercel project
echo "Linking to Vercel project..."
vercel link

# Set environment variables
echo "Setting environment variables..."
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
vercel env add NEXT_PUBLIC_API_URL
vercel env add EMAIL_HOST
vercel env add EMAIL_PORT
vercel env add EMAIL_SECURE
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
vercel env add EMAIL_FROM
vercel env add ALERT_EMAIL

# Deploy
echo "Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "Don't forget to:"
echo "1. Set up Vercel Postgres database"
echo "2. Run 'npx prisma migrate deploy' in Vercel Functions"
echo "3. Run 'npx ts-node prisma/seed.ts' in Vercel Functions"