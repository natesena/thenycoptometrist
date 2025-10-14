# Strapi CMS Integration Setup

## Overview
Your blog is now integrated with Strapi CMS! This allows you to manage blog posts through a user-friendly admin panel.

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root of your Next.js project:

```bash
# Strapi CMS Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_URL=http://localhost:1337/api
```

**For Production:** Update these URLs to your production Strapi URL when deployed.

### 2. Start Strapi CMS

Open a new terminal and run:

```bash
cd /Users/MAC/Documents/projects/work/frontend/thenycoptometrist-cms
npm run develop
```

This will start Strapi at: http://localhost:1337/admin

### 3. Start Next.js Development Server

In another terminal:

```bash
cd /Users/MAC/Documents/projects/work/frontend/thenycoptometrist
npm run dev
```

Your site will be at: http://localhost:3000

### 4. Creating Blog Posts

1. Go to http://localhost:1337/admin
2. Navigate to **Content Manager** → **Blog Post**
3. Click **Create new entry**
4. Fill in the fields:
   - **Title**: Your blog post title
   - **Slug**: Auto-generated from title (can be edited)
   - **Content**: Write your blog post in Markdown
   - **Excerpt**: Short summary (shown on blog listing)
   - **Featured Image**: Upload an image (optional)
   - **Published Date**: When the post should be dated
   - **Author**: Default is "Dr. Joanna Latek"
   - **Meta Description**: For SEO (optional)
5. Click **Save**
6. Click **Publish** to make it live

### 5. Blog Features

- **Blog Listing**: `/blog` - Shows all published blog posts
- **Blog Post Detail**: `/blog/[slug]` - Individual blog post pages
- **Navigation**: Blog link added to main navigation menu
- **SEO**: Automatic metadata generation for each post
- **Responsive**: Mobile-friendly design

## Markdown Support

Your blog posts support full Markdown formatting:

- **Headings**: `# H1`, `## H2`, `### H3`
- **Bold**: `**text**`
- **Italic**: `*text*`
- **Lists**: Use `-` or `1.`
- **Links**: `[text](url)`
- **Images**: `![alt](url)`
- **Quotes**: `> quote text`
- **Code**: \`code\`

## OG Image (Social Sharing)

A dynamic Open Graph image has been created at `/api/og` that displays:
- Dr. Joanna Latek's name
- The NYC Optometrist branding
- 4.9★ rating badge
- Professional gradient background

This image will appear when sharing your site on social media.

## Deployment

### Deploying Strapi:

You can deploy Strapi to:
- **Strapi Cloud** (easiest)
- **Railway**
- **Render**
- **DigitalOcean**
- **AWS/Google Cloud/Azure**

**Important:** After deploying Strapi, update the environment variables in your Next.js app:

```bash
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com
STRAPI_API_URL=https://your-strapi-domain.com/api
```

### Database for Production:

Currently using SQLite (good for development). For production, configure Strapi to use:
- PostgreSQL (recommended)
- MySQL
- MariaDB

Edit `/thenycoptometrist-cms/config/database.ts` to configure.

## Next Steps

1. Create your first blog post in Strapi
2. Visit http://localhost:3000/blog to see it
3. Customize blog styling if needed
4. Deploy both applications to production

## Support

- Strapi Docs: https://docs.strapi.io
- Next.js Docs: https://nextjs.org/docs

---

**Created by AI Assistant** - October 13, 2025



