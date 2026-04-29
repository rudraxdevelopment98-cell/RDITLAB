# RD IT Lab UK - Admin Portal Setup Guide

## ✨ What's New

Your website now has a **complete backend system** with:
- ✅ **Responsive navbar** with working mobile hamburger menu
- ✅ **Admin portal** for managing content
- ✅ **Pages management** - edit content on home, about, services, contact pages
- ✅ **Team management** - add/edit/delete team members with photos
- ✅ **Image upload** - upload profile pictures for team members
- ✅ **API-driven content** - changes reflect immediately on the website

## 🚀 How to Use

### Accessing the Admin Portal

1. **Local Development**: 
   ```bash
   npm install
   npm run dev
   ```
   Then visit: `http://localhost:3000/admin`

2. **Live Site**: Visit: `https://rditlabuk.vercel.app/admin`

### Managing Pages Content

1. Go to **Admin Portal** → **Pages & Content** tab
2. Filter by section (Hero, About, Services, Contact)
3. Click **Edit** to modify existing content
4. Click **+ Create** to add new content
5. Changes appear immediately on the website

### Managing Team Members

1. Go to **Admin Portal** → **Team Members** tab
2. **Add Team Member**:
   - Fill in Name, Role, Bio
   - Upload profile image (JPEG, PNG, WebP, GIF - max 5MB)
   - Click "Add Team Member"
3. **Edit Member**: Click Edit on existing card
4. **Delete Member**: Click Delete (confirms before deleting)

### Adding Kuldeep's Photo

1. Go to **Team Members** section
2. Find "Kuldeep J" member
3. Click **Edit**
4. Upload his photo using the image uploader
5. Click **Update Team Member**

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── pages/route.ts          # API for page content CRUD
│   │   ├── team/route.ts           # API for team members CRUD
│   │   └── upload/route.ts         # API for image uploads
│   ├── admin/
│   │   └── page.tsx                # Admin dashboard
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   │   ├── PagesManager.tsx        # Pages management component
│   │   └── TeamManager.tsx         # Team management component
│   ├── About.tsx                   # Fetches data from API
│   ├── Hero.tsx                    # Fetches data from API
│   ├── Navbar.tsx                  # Fixed responsive menu
│   └── ...
├── lib/
│   └── db.ts                       # Database operations layer
└── public/
    └── uploads/                    # Uploaded images stored here
data/                               # Data stored as JSON files
├── pages.json
└── team.json
```

## 🔧 API Endpoints

### Pages API (`/api/pages`)

- **GET** `/api/pages` - Get all pages
- **GET** `/api/pages?section=hero` - Get pages by section
- **POST** `/api/pages` - Create new page
- **PUT** `/api/pages` - Update page
- **DELETE** `/api/pages?id={id}` - Delete page

### Team API (`/api/team`)

- **GET** `/api/team` - Get all team members
- **GET** `/api/team?id={id}` - Get specific member
- **POST** `/api/team` - Create new member
- **PUT** `/api/team` - Update member
- **DELETE** `/api/team?id={id}` - Delete member

### Upload API (`/api/upload`)

- **POST** `/api/upload` - Upload image file

## 📝 Making Changes Daily

### Example: Update Hero Title
1. Go to Admin → Pages & Content
2. Search for "home-hero-title"
3. Edit the content
4. Click Update
5. Website updates instantly (or refresh page)

### Example: Add New Team Member
1. Go to Admin → Team Members
2. Fill form: Name, Role, Bio, Photo
3. Click "Add Team Member"
4. Member appears in About page team section

### Example: Edit About Section
1. Go to Admin → Pages & Content → Filter "about"
2. Click Edit on any section (Mission, Expertise, etc.)
3. Update content
4. Click Update
5. Live changes appear on About page

## 🌐 Deploying Changes

Your site is on **Vercel** with auto-deploy:

```bash
git add .
git commit -m "Updated content via admin portal"
git push origin main
```

**Changes go live in 2-3 minutes!**

## ⚠️ Important Notes

- All data stored in `data/` folder as JSON files
- Images uploaded to `public/uploads/` folder
- Both get committed to git and deployed with the site
- Make regular git commits to track changes
- Admin panel has no password (add authentication later if needed)

## 🎨 Customization Tips

### Change Admin Panel Colors
Edit `/src/app/admin/page.tsx` - Replace `amber-600` with your colors

### Add More Sections
1. Add section name to `sections` array in PagesManager
2. Create content via admin panel
3. Use in components with:
```javascript
const response = await fetch('/api/pages?section=your-section')
```

### Add Fields
Edit `/src/lib/db.ts` and `/src/app/api/*/route.ts` to add more fields

## 🐛 Troubleshooting

**Images not showing?**
- Check `public/uploads/` folder exists
- Verify file permissions
- Ensure image path in admin matches

**Changes not appearing?**
- Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for API errors
- Verify `data/pages.json` and `data/team.json` exist

**API errors?**
- Check terminal for error messages
- Ensure `data/` folder exists
- Try clearing browser cache

## 📞 Support

For issues or questions with the admin system, check:
1. Browser console (F12) for errors
2. Terminal output while running `npm run dev`
3. Make sure all dependencies installed: `npm install`

---

**Happy Managing! 🚀**
