# Quick Start Guide 🚀

## ⚡ Get Everything Running in 3 Steps

### Step 1: Create Environment File

Create `.env.local` in the root of your Next.js project:

```bash
cd /Users/MAC/Documents/projects/work/frontend/thenycoptometrist
cat > .env.local << 'EOF'
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_URL=http://localhost:1337/api
EOF
```

### Step 2: Start Strapi (Terminal 1)

```bash
cd /Users/MAC/Documents/projects/work/frontend/thenycoptometrist-cms
npm run develop
```

**Admin Panel:** http://localhost:1337/admin

### Step 3: Start Next.js (Terminal 2)

```bash
cd /Users/MAC/Documents/projects/work/frontend/thenycoptometrist
npm run dev
```

**Your Site:** http://localhost:3000

---

## 🎯 What to Do Next

### Create Your First Blog Post

1. Visit http://localhost:1337/admin
2. Go to **Content Manager** → **Blog Post** → **Create new entry**
3. Fill in:
   - **Title:** e.g., "5 Tips for Healthy Eyes"
   - **Content:** Write in Markdown
   - **Published Date:** Today's date
   - **Excerpt:** Brief summary
4. Click **Save** then **Publish**
5. View it at http://localhost:3000/blog

### View Your OG Image

Visit: http://localhost:3000/api/og

This is the image that shows when people share your site on social media!

---

## 📁 Key Files Created

- `/lib/strapi.ts` - Strapi API integration
- `/app/blog/page.tsx` - Blog listing
- `/app/blog/[slug]/page.tsx` - Individual blog posts
- `/app/api/og/route.tsx` - Social sharing image
- `.env.local` - Configuration (you need to create this)

---

## 📖 Full Documentation

- **Complete Updates:** `PROJECT_UPDATES.md`
- **Strapi Setup:** `STRAPI_SETUP.md`
- **OG Image Guide:** `OG_IMAGE_GUIDE.md`

---

## ✅ What's Been Done

1. ✅ Phone number verified (already correct)
2. ✅ OG image created with 4.9★ rating
3. ✅ Strapi CMS installed and configured
4. ✅ Blog integration complete
5. ✅ Navigation updated with Blog link
6. ✅ SEO optimized
7. ✅ Mobile responsive

---

**You're all set!** 🎉



