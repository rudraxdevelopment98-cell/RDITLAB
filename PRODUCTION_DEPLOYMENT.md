# 🚀 Production Deployment Guide

## Overview

This guide walks you through deploying RDITLAB to production with PostgreSQL, email notifications, and security best practices.

---

## 📋 Pre-Deployment Checklist

- [ ] Change default admin password
- [ ] Generate new JWT_SECRET
- [ ] Setup PostgreSQL database
- [ ] Configure email service (SMTP)
- [ ] Setup SSL/HTTPS certificate
- [ ] Configure domain name
- [ ] Review security settings
- [ ] Backup development database
- [ ] Test in staging environment

---

## 1️⃣ Generate Production Secrets

### Generate New JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example output:
```
a3f9c2e1d8b5f7c6e4d2a1b3c5e7f9d1a3b5c7e9d1f3a5b7c9e1d3f5a7b9
```

Save this value; you'll need it for production environment variables.

---

## 2️⃣ Setup PostgreSQL Database

### Option A: Local PostgreSQL (Recommended for Small Deployments)

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE rditlab;
CREATE USER rditlab_user WITH PASSWORD 'strong_password_here';
ALTER ROLE rditlab_user SET client_encoding TO 'utf8';
ALTER ROLE rditlab_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE rditlab_user SET default_transaction_deferrable TO on;
ALTER ROLE rditlab_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE rditlab TO rditlab_user;
\q
```

### Option B: Cloud PostgreSQL (AWS RDS, DigitalOcean, Heroku, etc.)

1. Create managed PostgreSQL instance
2. Set username and strong password
3. Note the connection string
4. Add your server IP to whitelist

---

## 3️⃣ Setup Email Notifications

### Using Gmail SMTP

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"  # Use App-specific password from Gmail security
EMAIL_FROM="noreply@yourdomain.com"
ALERT_EMAIL="admin@yourdomain.com"
```

### Using SendGrid

```env
EMAIL_HOST="smtp.sendgrid.net"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="apikey"
EMAIL_PASS="SG.your-sendgrid-api-key"
EMAIL_FROM="noreply@yourdomain.com"
ALERT_EMAIL="admin@yourdomain.com"
```

### Using AWS SES

```env
EMAIL_HOST="email-smtp.region.amazonaws.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-ses-user"
EMAIL_PASS="your-ses-password"
EMAIL_FROM="noreply@yourdomain.com"
ALERT_EMAIL="admin@yourdomain.com"
```

---

## 4️⃣ Production Environment Setup

### Create `.env.production`

```env
# Environment
NODE_ENV="production"

# Database
DATABASE_URL="postgresql://rditlab_user:password@localhost:5432/rditlab"

# JWT Configuration
JWT_SECRET="paste-your-generated-secret-here"
JWT_EXPIRY=24

# API Configuration
NEXT_PUBLIC_API_URL="https://yourdomain.com"

# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="app-password"
EMAIL_FROM="noreply@yourdomain.com"
ALERT_EMAIL="admin@yourdomain.com"

# Admin (change immediately after login)
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="temporary-strong-password-change-immediately"
```

### Set Environment Variables

```bash
# For systemd service
export NODE_ENV=production
export DATABASE_URL="postgresql://..."
export JWT_SECRET="..."
# ... other variables
```

---

## 5️⃣ Build for Production

```bash
cd /workspaces/RDITLAB

# Install dependencies
npm install --production

# Build application
npm run build

# Verify build
npm run lint
```

---

## 6️⃣ Database Migration

```bash
# Run Prisma migrations
npx prisma migrate deploy

# Verify schema
npx prisma studio  # (optional, for verification)

# Seed production data (optional)
npm run prisma:seed
```

---

## 7️⃣ Setup Systemd Service (Linux)

Create `/etc/systemd/system/rditlab.service`:

```ini
[Unit]
Description=RD IT Lab Admin Portal
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/rditlab
Environment="NODE_ENV=production"
Environment="DATABASE_URL=postgresql://..."
Environment="JWT_SECRET=..."
Environment="EMAIL_HOST=..."
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable rditlab
sudo systemctl start rditlab
sudo systemctl status rditlab
```

---

## 8️⃣ Setup Nginx Reverse Proxy

Create `/etc/nginx/sites-available/rditlab`:

```nginx
upstream rditlab_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://rditlab_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/rditlab /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 9️⃣ Setup SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx

sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## 🔟 Post-Deployment Verification

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","password":"YourPassword123!"}'
```

### Check Logs

```bash
sudo journalctl -u rditlab -f
tail -f /var/log/nginx/error.log
```

### Database Health

```bash
psql -U rditlab_user -d rditlab -c "SELECT COUNT(*) FROM admin;"
psql -U rditlab_user -d rditlab -c "SELECT COUNT(*) FROM \"AuditLog\";"
```

---

## 🔒 Security Hardening

### 1. Change Default Password

```bash
# Login to admin dashboard at https://yourdomain.com/login
# Go to Settings → Change Password
# Use strong password (12+ chars, mixed case, numbers, symbols)
```

### 2. Regular Backups

```bash
# Daily PostgreSQL backup
0 2 * * * pg_dump -U rditlab_user rditlab | gzip > /backups/rditlab-$(date +\%Y\%m\%d).sql.gz
```

### 3. Monitor Audit Logs

```bash
# Check audit logs regularly via admin dashboard
# Look for suspicious login attempts
# Monitor password changes
```

### 4. Enable WAF (Optional)

- Use Cloudflare, AWS WAF, or ModSecurity
- Protect against common attacks
- Rate limit login attempts

### 5. Keep Dependencies Updated

```bash
npm audit
npm audit fix
npm update
```

---

## 🆘 Troubleshooting

### Database Connection Error

```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U rditlab_user -h localhost -d rditlab

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Email Notifications Not Working

```bash
# Verify SMTP credentials
# Check log files for errors
# Test with sample email

node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
transporter.verify((err) => {
  console.log(err ? 'Failed: ' + err : 'SMTP OK');
});
"
```

### High Memory Usage

```bash
# Restart service
sudo systemctl restart rditlab

# Check for memory leaks
node --max-old-space-size=512 /path/to/app
```

---

## 📊 Monitoring Recommendations

### Tools to Monitor

- **PM2** - Process management
- **Prometheus** - Metrics collection
- **Grafana** - Visualization
- **ELK Stack** - Log aggregation
- **Sentry** - Error tracking

### Key Metrics

- Response time
- Error rate
- Database query time
- Server memory/CPU
- Failed login attempts
- Email notification failures

---

## 🔄 Maintenance Tasks

### Weekly

- [ ] Check audit logs
- [ ] Verify backups
- [ ] Monitor error logs

### Monthly

- [ ] Update dependencies
- [ ] Review security settings
- [ ] Check SSL certificate expiry

### Quarterly

- [ ] Full security audit
- [ ] Database optimization
- [ ] Performance review

---

## 📚 Additional Resources

- [Next.js Production Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Checklist](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-production)
- [PostgreSQL Security Best Practices](https://www.postgresql.org/docs/current/sql -security-labels.html)
- [SSL/TLS Security](https://www.ssl.com/article/securing-your-website-with-https/)

---

**Status**: Production Deployment Ready  
**Last Updated**: April 2026

For support, check the main README or deployment logs.
