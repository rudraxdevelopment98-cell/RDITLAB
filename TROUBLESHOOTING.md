# 🔧 Troubleshooting Guide - Common Issues & Solutions

## Issue 1: Admin Portal Not Loading

**Problem**: `/admin` page shows blank or errors in console

**Solutions**:
1. Clear browser cache:
   - Chrome: Ctrl+Shift+Delete
   - Mac: Cmd+Shift+Delete
2. Hard refresh page: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. Check terminal for errors: `npm run dev` output
4. Ensure data folder exists: `ls data/` should show `pages.json` and `team.json`

---

## Issue 2: Images Not Uploading

**Problem**: Upload fails silently or shows error

**Solutions**:
1. Check file size: Maximum 5MB
2. Verify file type: Must be JPG, PNG, WebP, or GIF
3. Check uploads folder exists: `public/uploads/` should exist
4. Check browser console (F12) for error details
5. Verify permissions on `public/uploads/` folder

**If folder missing**:
```bash
mkdir -p public/uploads
ls public/uploads/  # Verify it exists
```

---

## Issue 3: Changes Not Appearing on Website

**Problem**: Updated content in admin but not showing on website

**Solutions**:
1. **Hard refresh page**: Press Ctrl+Shift+R (not just F5)
2. **Check API response**:
   - Open browser console (F12)
   - Go to Network tab
   - Refresh page
   - Look for `/api/pages` and `/api/team` requests
   - Should return "200 OK"
3. **Verify data saved**:
   - Check `data/pages.json` file
   - Should contain your changes
4. **Restart dev server**:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

---

## Issue 4: API Errors in Console

**Problem**: See 404 or 500 errors for API calls

| Error | Cause | Fix |
|-------|-------|-----|
| 404 | Endpoint not found | Restart dev server |
| 500 | Server error | Check route file syntax |
| TypeError | Data format wrong | Match expected JSON structure |
| FileNotFound | Data folder missing | Run `mkdir -p data/` |

**Debug steps**:
1. Check terminal for error messages
2. Verify file paths in error
3. Ensure `src/app/api/` folder structure correct
4. Restart terminal and dev server

---

## Issue 5: Team Members Not Showing

**Problem**: Team section empty or showing placeholder

**Solutions**:
1. **Check API response**:
   ```bash
   # While dev server running, open this in browser:
   http://localhost:3000/api/team
   # Should return JSON array of team members
   ```
2. **Verify team data file**:
   ```bash
   cat data/team.json  # Should show team data
   ```
3. **Check component**:
   - About.tsx and home About component fetch from `/api/team`
   - Open browser console (F12) for fetch errors

---

## Issue 6: Build Fails

**Problem**: `npm run build` shows errors

**Solutions**:
1. **Clear cache**:
   ```bash
   rm -rf .next
   npm run build
   ```
2. **Clean install**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```
3. **Check TypeScript errors**:
   ```bash
   npm run lint
   # Fix any errors shown
   ```

---

## Issue 7: Mobile Menu Not Working

**Problem**: Hamburger menu doesn't toggle

**Solutions**:
1. Verify Navbar.tsx has `'use client'` directive
2. Check state management in Navbar component
3. Ensure useState imported from React
4. Test in different mobile browser
5. Check for JavaScript console errors (F12)

---

## Issue 8: Images Show 404

**Problem**: Uploaded images return 404

**Solutions**:
1. Verify image was uploaded:
   ```bash
   ls public/uploads/
   # Should list your image files
   ```
2. Check image path in admin:
   - Should start with `/uploads/`
   - Example: `/uploads/1234567890-photo.jpg`
3. Verify browser can access:
   - Go to `http://localhost:3000/uploads/filename.jpg`
   - Should show image
4. Check for typos in filename

---

## Issue 9: Data Lost After Restart

**Problem**: All data disappeared after restarting server

**Solutions**:
1. Check data folder wasn't deleted:
   ```bash
   ls data/
   # Should show pages.json and team.json
   ```
2. Verify Git hasn't been reset:
   ```bash
   git log --oneline | head -5
   # Should show recent commits
   ```
3. Check backup location:
   - Uploaded images in `public/uploads/`
   - Pages data in `data/pages.json`
   - Team data in `data/team.json`

**Prevention**:
```bash
# Always commit data to git
git add data/ public/uploads/
git commit -m "Updated content"
```

---

## Issue 10: Can't Connect Locally

**Problem**: Can't access `localhost:3000`

**Solutions**:
1. Verify dev server running:
   ```bash
   # Terminal should show:
   # ▲ Next.js 14.0.0
   # - ready started server on 0.0.0.0:3000, url: http://localhost:3000
   ```
2. Try different port:
   ```bash
   npm run dev -- -p 3001
   ```
3. Check if port in use:
   ```bash
   lsof -i :3000
   # Kill process if needed: kill -9 PID
   ```

---

## Issue 11: Admin Portal Too Slow

**Problem**: Admin panel sluggish or slow to load

**Solutions**:
1. **Reduce data size**:
   - Delete old test entries
   - Remove unused team members
2. **Clear uploads folder**:
   - Delete unnecessary images
   - Keep only current images
3. **User images smaller**:
   - Compress before upload (under 500KB recommended)
4. **Browser cache**:
   ```bash
   # Clear cache in DevTools (F12)
   # Storage → Clear Site Data
   ```

---

## Issue 12: Deployment to Vercel Failed

**Problem**: `git push` doesn't trigger deployment or build fails on Vercel

**Solutions**:
1. **Check GitHub connection**:
   ```bash
   git remote -v
   # Should show correct GitHub repo
   ```
2. **Verify Vercel project**:
   - Go to vercel.com
   - Check project connected to correct branch (main)
   - Check environment variables
3. **Force deploy**:
   - Push changes: `git push origin main`
   - Wait 3-5 minutes
   - Check Vercel dashboard for build status
4. **Manual deployment**:
   - Vercel CLI: `npm i -g vercel && vercel`

---

## Quick Diagnostics

Run this terminal command to check everything:

```bash
#!/bin/bash
echo "=== Project Status ==="
echo "Node version:"
node --version
echo ""
echo "NPM version:"
npm --version
echo ""
echo "Data folder:"
ls -la data/ || echo "❌ data/ missing"
echo ""
echo "Uploads folder:"
ls -la public/uploads/ || echo "⚠️  uploads/ empty or missing"
echo ""
echo "Git status:"
git status --short
echo ""
echo "Recent commits:"
git log --oneline -3
```

---

## Getting Help

1. **Check console**: F12 → Console tab for error messages
2. **Check terminal**: Look at npm run dev output
3. **Check files**: Verify `data/pages.json` and `data/team.json` exist
4. **Verify API**: Open `/api/pages` and `/api/team` in browser
5. **Restart server**: Sometimes fixes weird issues

---

## Emergency Restore

If something breaks, restore from Git:

```bash
# Discard all changes and return to last commit
git checkout .

# Or undo last commit (if not pushed)
git reset --hard HEAD~1

# Restore from backup if available
# Then run: npm install && npm run dev
```

---

## Still Stuck?

1. **Check the logs**: Terminal and browser console (F12)
2. **Review API responses**: Browser Network tab
3. **Simplify the problem**: Test one thing at a time
4. **Restart everything**: `npm run dev` can fix many issues
5. **Search error message**: Usually has solution online

---

*Remember: Most issues are solved by:*
- *Hard refresh (Ctrl+Shift+R)*
- *Restarting dev server*
- *Clearing cache*
- *Checking file permissions*

**Good luck! 🚀**
