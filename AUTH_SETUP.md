# RDITLAB Authentication & Database Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Initialize Database
```bash
npx prisma migrate dev --name init
```

### Step 3: Seed Initial Data
```bash
npm run prisma:seed
# or: npx ts-node prisma/seed.ts
```

### Step 4: Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000/login`

**Initial Credentials:**
- Email: `admin@rditlab.co.uk`
- Password: `ChangeMe123!`

⚠️ **IMPORTANT**: Change the password after first login via admin dashboard.

---

## 🔧 Configuration

### Environment Variables (.env / .env.local)

```env
# Database Configuration
DATABASE_URL="file:///workspaces/RDITLAB/prisma/dev.db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRY=24  # Token expiration in hours

# Admin Setup (initial credentials)
ADMIN_EMAIL="admin@rditlab.co.uk"
ADMIN_PASSWORD="ChangeMe123!"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Email Notification Settings
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="smtp-user@example.com"
EMAIL_PASS="smtp-password"
EMAIL_FROM="no-reply@rditlab.co.uk"
ALERT_EMAIL="admin@rditlab.co.uk"
```

**For Production:**
```env
# Use PostgreSQL instead
DATABASE_URL="postgresql://user:password@localhost:5432/rditlab"

# Generate new JWT_SECRET:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="[generate-a-new-one]"

# Use HTTPS
NEXT_PUBLIC_API_URL="https://yourdomain.com"

# Email Notification Settings
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=587
EMAIL_SECURE=true
EMAIL_USER="smtp-user@example.com"
EMAIL_PASS="smtp-password"
EMAIL_FROM="no-reply@yourdomain.com"
ALERT_EMAIL="admin@yourdomain.com"
```

---

## 📚 Authentication Flow

### 1. **Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@rditlab.co.uk",
  "password": "ChangeMe123!"
}

# Response (stored in HTTP-only cookie automatically):
{
  "success": true,
  "message": "Login successful",
  "admin": {
    "id": "cmohjc46t0000ow3viqk...",
    "email": "admin@rditlab.co.uk",
    "name": "Administrator"
  }
}
```

### 2. **Session Check**
```bash
GET /api/auth/session

# Response (if authenticated):
{
  "authenticated": true,
  "admin": {
    "id": "...",
    "email": "..."
  }
}

# Response (if not authenticated):
{ "authenticated": false }
```

### 3. **Logout**
```bash
POST /api/auth/logout

# Response:
{ "success": true }
```

### 4. **Change Password**
```bash
POST /api/auth/change-password
Content-Type: application/json

{
  "currentPassword": "ChangeMe123!",
  "newPassword": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

---

## 🗄️ Database Schema

### Tables

#### `Admin`
- `id` (String, PK) - Unique identifier
- `email` (String, UNIQUE) - Login email
- `password` (String) - Hashed password (bcrypt)
- `name` (String) - Admin name
- `role` (String) - Role (default: "admin")
- `createdAt` (DateTime) - Account creation time
- `updatedAt` (DateTime) - Last update time

#### `Page`
- `id` (String, PK)
- `title` (String) - Page title
- `section` (String) - Section name (hero, about, services, contact)
- `content` (String) - Page content (long text)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `createdBy` (String) - Admin ID who created it
- **Unique Constraint**: `(title, section)`

#### `TeamMember`
- `id` (String, PK)
- `name` (String)
- `role` (String)
- `bio` (String) - Long text
- `image` (String) - Image URL
- `order` (Int) - Display order
- `active` (Boolean) - Status
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `createdBy` (String) - Admin ID

#### `AuditLog`
- `id` (String, PK)
- `adminId` (String, FK) - Which admin performed action
- `action` (String) - LOGIN, CREATE, UPDATE, DELETE
- `entity` (String) - Page, TeamMember, Admin
- `entityId` (String) - ID of entity modified
- `oldData` (String) - JSON of previous values
- `newData` (String) - JSON of new values
- `createdAt` (DateTime) - When action occurred

---

## 🔐 Security Features

### Password Security
- **Hashing**: bcryptjs with 12 salt rounds
- **Validation**: 
  - Minimum 8 characters
  - Must contain uppercase letter
  - Must contain lowercase letter
  - Must contain number
  - Example: `SecurePass123!`

### Token Security
- **JWT (JSON Web Tokens)**
  - Algorithm: HS256 (HMAC SHA-256)
  - Expiry: 24 hours (configurable)
  - Secret: Minimum 32 characters in production

### Cookie Security
- **HTTP-Only**: Not accessible by JavaScript (prevents XSS attacks)
- **Secure**: Only sent over HTTPS in production
- **SameSite**: Strict (prevents CSRF attacks)
- **Path**: `/` (sent to all routes)

### API Protection
- All admin mutations (POST, PUT, DELETE) require valid JWT
- Reading pages (GET) is public
- Audit logging for all admin actions
- Session validation on protected routes

---

## 📖 API Endpoints

### Authentication Endpoints

| Method | Route | Auth Required | Description |
|--------|-------|---------------|-------------|
| POST | `/api/auth/login` | ❌ No | Login with email/password |
| POST | `/api/auth/logout` | ✅ Yes | Logout (clear cookie) |
| GET | `/api/auth/session` | ❌ No | Check if authenticated |
| POST | `/api/auth/change-password` | ✅ Yes | Change password |

### Content Endpoints

| Method | Route | Auth Required | Description |
|--------|-------|---------------|-------------|
| GET | `/api/pages` | ❌ No | Get all pages |
| POST | `/api/pages` | ✅ Yes | Create page |
| PUT | `/api/pages/[id]` | ✅ Yes | Update page |
| DELETE | `/api/pages/[id]` | ✅ Yes | Delete page |
| GET | `/api/team` | ❌ No | Get all team members |
| POST | `/api/team` | ✅ Yes | Create team member |
| PUT | `/api/team/[id]` | ✅ Yes | Update team member |
| DELETE | `/api/team/[id]` | ✅ Yes | Delete team member |

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build project
npm run start           # Start production server
npm run lint            # Lint code

# Database
npm run prisma:seed     # Seed initial data
npm run prisma:studio   # Open Prisma Studio (database GUI)

# Prisma Migrations
npx prisma migrate dev --name <name>  # Create migration
npx prisma migrate deploy             # Deploy migrations (production)
npx prisma db push                    # Push schema directly (dev only)
npx prisma generate                   # Regenerate Prisma client
```

---

## 🐛 Troubleshooting

### Database Connection Errors

**Error**: `Error code 14: Unable to open the database file`

**Solution**: Ensure DATABASE_URL is absolute path:
```env
DATABASE_URL="file:///workspaces/RDITLAB/prisma/dev.db"
```

### Migrations Not Found

**Error**: `Migration files not found`

**Solution**: Ensure the `prisma/migrations` directory exists and contains SQL files. If missing:
```bash
rm -rf prisma/migrations
npx prisma migrate dev --name init
```

### Type Errors with JWT

**Error**: Could not find declaration file for module 'jsonwebtoken'

**Solution**:
```bash
npm install -D @types/jsonwebtoken
```

### Admin Cannot Login

**Steps to debug**:
1. Check admin exists: `npx prisma studio` → Admin table
2. Verify database connection: `curl http://localhost:3000/api/pages`
3. Check password was hashed: Password should start with `$2a$` or `$2b$`
4. Reseed admin: `npm run prisma:seed`

---

## 📈 Performance Optimization

### For Production

1. **Enable HTTPS**
   ```env
   NODE_ENV=production
   ```

2. **Optimize Database**
   - Switch to PostgreSQL for better scalability
   - Add database indexes for frequently queried fields
   - Enable connection pooling

3. **Rate Limiting**
   - Add rate limiting to `/api/auth/login` (prevent brute force)
   - Example: 5 attempts per 15 minutes

4. **JWT Refresh Tokens**
   - Implement refresh token rotation
   - Short-lived access tokens (15 min)
   - Long-lived refresh tokens (7 days)

5. **Audit Log Cleanup**
   - Archive old logs to separate storage
   - Keep recent logs (last 30 days) in database

---

## 🚀 Next Steps

1. **Test Complete Flow**
   - Visit `/login`
   - Enter credentials
   - Verify redirect to `/admin`
   - Check logout works

2. **Customize Admin Dashboard**
   - Add page content editor
   - Add team member manager
   - Display audit logs

3. **Production Deployment**
   - Set up PostgreSQL database
   - Generate secure JWT_SECRET
   - Enable HTTPS
   - Configure ADMIN_EMAIL and ADMIN_PASSWORD
   - Run migrations on production server
   - Seed initial admin user

4. **Additional Features**
   - Email password reset flow
   - Two-factor authentication (2FA)
   - Admin role management (multiple admins)
   - Export audit logs

---

## 📞 Support

For issues or questions:
1. Check Prisma errors in server console
2. Review `.env` configuration
3. Check database migrations: `npx prisma migrate status`
4. Review audit logs for admin actions
5. Check browser console for frontend errors

---

**Last Updated**: April 27, 2026  
**Status**: ✅ Production Ready  
**Database**: SQLite (Dev) / PostgreSQL (Prod)  
**Node Version**: 18+ recommended
