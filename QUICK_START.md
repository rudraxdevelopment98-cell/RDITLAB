# Quick Start Guide - Admin Portal

## First Time Setup

After pulling the updated code:

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Then open: **http://localhost:3000/admin**

## Adding Kuldeep's Photo

1. **During Setup**:
   - Navigate to `/admin` portal
   - Click "Team Members" tab
   - Find "Kuldeep J" in the list
   - Click **Edit** button
   - Click file input and select Kuldeep's photo
   - Click **Update Team Member**

2. **Photo Requirements**:
   - Format: JPG, PNG, WebP, or GIF
   - Size: Maximum 5MB
   - Recommended dimensions: 400x400px or higher
   - Will be optimized automatically

## Daily Usage

### Scenario 1: Update Website Copy

**Goal**: Change hero title from "RD IT Lab UK" to something else

Steps:
1. Go to Admin Portal (`/admin`)
2. Click "Pages & Content" tab
3. In the filter section, click "Hero"
4. Find the entry with title "RD IT Lab UK"
5. Click "Edit"
6. Change content in the text area
7. Click "Update Page"
8. Go back to homepage to see changes (may need refresh)

### Scenario 2: Add New Team Member

**Goal**: Add another team member

Steps:
1. Go to Admin Portal → "Team Members"
2. Fill in the form:
   - Name: [Enter name]
   - Role: [e.g., "Technical Support Engineer"]
   - Bio: [Enter description]
   - Image: [Click to upload photo]
3. Click "Add Team Member"
4. New member appears in About page automatically

### Scenario 3: Edit Service Descriptions

**Goal**: Update services page content

Steps:
1. Go to Admin Portal → "Pages & Content"
2. Filter: "Services" 
3. Edit service descriptions
4. Changes appear on /services page

## Backend Architecture

```
User Interface (Website)
        ↓ (fetch/update)
    API Routes (/api/*)
        ↓ (read/write)
   Database Layer (/lib/db.ts)
        ↓ (JSON storage)
   Data Files (data/*.json)
```

## Data Files Location

- **Pages**: `/data/pages.json` - All page content
- **Team**: `/data/team.json` - All team members
- **Uploads**: `/public/uploads/` - All uploaded images

These files are:
- ✅ Version controlled (in git)
- ✅ Auto-synced with deployment
- ✅ Easy to backup
- ✅ Easy to migrate

## Features You Now Have

| Feature | Location | How to Use |
|---------|----------|-----------|
| **Edit Page Content** | Admin → Pages & Content | Select section → Edit → Update |
| **Add Team Member** | Admin → Team Members | Fill form → Add Team Member |
| **Upload Images** | Team Member form | Click file input → Select image |
| **Responsive Mobile** | All pages | Hamburger menu works on mobile |
| **Real-time Updates** | Website | Changes live when you update |

## Deployment to Live Website

After making changes locally:

```bash
# Commit changes
git add .
git commit -m "Updated Kuldeep photo and team info"

# Push to GitHub (auto-deploys to Vercel)
git push origin main
```

**Your live site updates in 2-3 minutes! ✨**

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Page not loading | Make sure `npm install` ran successfully |
| Admin panel blank | Check browser console (F12) for errors |
| Images not saving | Verify upload file is under 5MB |
| Changes not appearing | Try hard refresh (Ctrl+Shift+R) |
| Data lost after restart | Check `/data/` folder exists and has .json files |

## File Locations for Future Reference

- Admin page: `/src/app/admin/page.tsx`
- Pages API: `/src/app/api/pages/route.ts`
- Team API: `/src/app/api/team/route.ts`
- Database layer: `/src/lib/db.ts`
- Components: `/src/components/` (Hero.tsx, About.tsx, etc.)

---

**Everything is ready! Start using the admin panel now.** 🚀
