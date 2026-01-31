# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 website for The NYC Optometrist (Dr. Joanna Latek), featuring comprehensive eye care services, blog content, and appointment booking functionality. The site uses the App Router with TypeScript and integrates with external services for content management and database operations.

## Issue Tracking (bd/Beads)

This project uses **Beads** (`bd`) for issue tracking - issues are stored directly in the codebase at `.beads/issues.jsonl`.

### Quick Reference Commands
```bash
bd list                           # View all issues
bd show <issue-id>                # View issue details
bd create "Issue title"           # Create new issue
bd update <issue-id> --status done # Update issue status
bd sync                           # Sync with git remote
```

See `.beads/README.md` for full documentation on Beads.

## Business Goals

### Primary Objectives
1. **Drive Verifiable Bookings** - Every feature should ultimately lead to ZocDoc bookings or direct appointments
2. **Product Referral Revenue** - Generate affiliate income through curated product recommendations
3. **Automated Blog Creation** - AI-generated draft blog posts for Dr. Latek to review and publish
4. **Content-First Attribution** - Track the full user journey before conversion to understand what content drives bookings
5. **AI Agent Traffic Capture** - Optimize for AI agents (ChatGPT, Perplexity, etc.) to recommend Dr. Latek

### Content-First Attribution Strategy
Track the complete session journey: entry point → pages visited → content consumed → conversion action. This data-driven approach helps understand:
- What blog content users read before booking
- Which pages have highest conversion rates
- What content AI agents access and recommend

### AI Agent Optimization Strategy
- Detect AI agent traffic via user agent analysis
- Serve optimized structured data (JSON-LD schemas, semantic markup)
- Track what AI agents access and how they navigate
- Goal: Be the authoritative source AI agents recommend for NYC eye care

## Features

### Completed ✅
- **Analytics Dashboard** (`/metrics-admin/metrics`) - Full metrics visualization with filtering, date ranges, event type breakdown, and CSV/JSON export
- **Conversion Tracking** - All conversion buttons tracked (Book Now, phone, email, ZocDoc, external links)
- **Blog System** - Payload CMS with SEO-optimized pages, JSON-LD BlogPosting schemas
- **Contact Form** - Functional form with email notifications via Resend API
- **SEO Optimization** - JSON-LD schemas (LocalBusiness, BlogPosting, Person), sitemap.ts, robots.ts
- **Weekly Analytics Reports** - Automated email reports via Vercel cron
- **Mobile Conversion Drawer** - Slide-out drawer with prioritized contact options (ZocDoc → Call → Email)
- **Transparent Header** - Modern header with backdrop blur and white text
- **AI Blog Generation** - `/generate-blog` skill generates drafts via z.ai, saves to Payload CMS, emails with one-click publish

### In Progress 🚧
- **Product Referral System** - Admin CRUD for products/categories, public pages, sitemap integration, affiliate tracking

### Planned 📋
- **Content-First Attribution** - Full session journey tracking before conversion events
- **AI Agent Detection** - Edge worker to identify and track AI agent traffic patterns
- **AI-Optimized Responses** - Serve enhanced structured data specifically for AI agents
- **ZocDoc API Integration** - Show real-time availability directly on the website
- **Image CDN** - Cloud storage (S3/GCS) for optimized image delivery

## Common Commands

### Development
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production (includes Prisma client generation)
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database (Prisma)
```bash
npx prisma generate       # Generate Prisma client (runs automatically on npm install)
npx prisma migrate dev    # Create and apply migrations (local dev)
npx prisma migrate deploy # Apply migrations (production)
npx prisma studio         # Open Prisma Studio GUI to view/edit data
```

### Testing Database Connection
Prisma client is configured in `lib/prisma.ts` with connection pooling support for Supabase.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS + custom SCSS
- **Database**: PostgreSQL (local dev) / Supabase (production) for metrics; Neon PostgreSQL for CMS
- **ORM**: Prisma
- **CMS**: Payload CMS (embedded, deploys with app)
- **UI Libraries**: Radix UI components, Framer Motion, GSAP
- **Smooth Scrolling**: Lenis

### Database Architecture

**Two-Database System:**
1. **Metrics Database** (Supabase): Tracks analytics via Prisma
   - Local dev: PostgreSQL (`thenycoptometrist_dev`)
   - Production: Supabase PostgreSQL
   - Schema: `prisma/schema.prisma`
   - Connection pooling configured for Vercel serverless

2. **Blog/CMS Content** (Payload CMS): Embedded CMS for blog posts
   - Payload CMS is embedded in the Next.js app (deploys together)
   - Uses Neon PostgreSQL for CMS data storage
   - Admin UI at `/admin` (Google OAuth authentication)
   - Content fetched via `lib/payload-api.ts`
   - Environment variables: `PAYLOAD_DATABASE_URL`, `PAYLOAD_SECRET`

**Important**: These are separate database systems. Metrics use Prisma + Supabase. Blog content uses Payload CMS + Neon PostgreSQL.

### Project Structure

```
app/
  ├── components/           # All UI components
  │   ├── header/          # Navigation and menu
  │   ├── hero/            # Hero section
  │   ├── reviews/         # Review components
  │   ├── ConversionDrawer/# Booking drawer
  │   └── AnalyticsTracker.tsx  # Auto-tracks page views
  ├── blog/                # Blog pages (fetches from Payload CMS)
  ├── api/
  │   └── metrics/track/   # POST endpoint for analytics
  ├── layout.tsx           # Root layout with SEO, JSON-LD
  └── page.tsx             # Homepage

lib/
  ├── analytics.ts         # Client-side tracking utilities
  ├── payload-api.ts       # Payload CMS API client
  ├── prisma.ts           # Prisma client singleton
  ├── supabase.ts         # Supabase client (for metrics DB)
  ├── constants.ts        # Contact info constants (phone, email, ZocDoc URL)
  └── lenis-wrapper.tsx   # Smooth scroll wrapper

prisma/
  ├── schema.prisma       # Database schema (metrics only)
  └── migrations/         # Database migrations

components/ui/            # Shadcn components (Radix UI wrappers)
data/                     # Static data (services, reviews)
scripts/                  # Python/JS utilities for review extraction
types/index.d.ts         # Global TypeScript types
```

### Key Patterns

**Path Aliases:**
- `@/*` maps to project root (e.g., `@/lib/analytics`)

**Global Types:**
All major types are declared globally in `types/index.d.ts`:
- `Service`, `Review`, `CategoryType` (UI data)
- `BlogPost`, `PayloadBlogPost` (CMS integration)

**Analytics System:**
See `lib/analytics.md` for comprehensive documentation. Key points:
- Auto-tracks page views via `AnalyticsTracker` in layout
- Manual click tracking via `trackClick({ eventData })`
- Events stored in Supabase via `/api/metrics/track`
- Never throws errors (fails silently)

**Contact Information:**
Always use constants from `lib/constants.ts`:
- `ZOCDOC_URL`: Dr. Latek's ZocDoc booking link
- `PHONE_NUMBER`: Practice phone number
- `EMAIL`: Contact email

**Payload CMS Integration:**
- Blog posts fetched via `getBlogPosts()` and `getBlogPostBySlug()` from `lib/payload-api.ts`
- Admin panel at `/admin` with Google OAuth authentication
- Rich text editor with SEO fields (meta title, description, keywords)
- Images stored in Payload media library

**Image Configuration:**
Next.js configured for:
- Payload uploads: Same-origin (no remote pattern needed)
- Cloudinary: `**.cloudinary.com/**` (legacy support)

### Environment Variables

Required variables (see `.env.local.example`):
```bash
# Metrics Database (Supabase)
DATABASE_URL=          # Connection pooling URL (Session mode)
DIRECT_URL=           # Direct connection URL (Transaction mode)

# Payload CMS Database (Neon)
PAYLOAD_DATABASE_URL=  # Neon PostgreSQL connection string
PAYLOAD_SECRET=        # Payload encryption secret

# Authentication (NextAuth + Google OAuth)
AUTH_SECRET=           # NextAuth secret
AUTH_GOOGLE_ID=        # Google OAuth client ID
AUTH_GOOGLE_SECRET=    # Google OAuth client secret

# Email (Resend)
RESEND_API_KEY=                # Resend API key for emails
ANALYTICS_EMAIL_RECIPIENT=     # Email for weekly reports
ANALYTICS_EMAIL_FROM=          # From address for emails

# AI Blog Generation (optional)
AI_PROVIDER=zai                # zai | openai | anthropic | openrouter
Z_AI_API_KEY=                  # z.ai API key (primary provider)
OPENAI_API_KEY=                # OpenAI fallback
```

**Important**:
- `.env` is committed to git (contains production reference values with `PROD_` prefix)
- `.env.local` is gitignored (used for actual local development)

### Deployment

**Platform**: Vercel

**Build Process:**
1. `npm run build` triggers Next.js build
2. Prisma client auto-generates via `postinstall` script
3. TypeScript compilation with strict mode
4. Static optimization for pages

**Production Checklist:**
- Ensure DATABASE_URL and DIRECT_URL are set in Vercel (metrics DB)
- Ensure PAYLOAD_DATABASE_URL and PAYLOAD_SECRET are set (CMS DB)
- Ensure AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET are set (admin auth)
- Run `npx prisma migrate deploy` after schema changes
- Test admin login at `/admin` after deployment

### SEO & Metadata

**Comprehensive SEO in layout.tsx:**
- OpenGraph and Twitter cards
- JSON-LD structured data (LocalBusiness, Person)
- Canonical URLs and robots meta
- `robots.ts` and `sitemap.ts` for crawlers

**Key SEO Content:**
- Dr. Joanna Latek, NYC Optometrist
- Services: Eye exams, specialty contacts, dry eye, myopia management
- Service area: All five NYC boroughs

### Animation & UX

**Scroll Behavior:**
- Lenis wrapper provides smooth scrolling
- Snap-to sections for better UX
- GSAP for complex animations
- Framer Motion for component transitions

### Custom Slash Commands

This project uses several custom Claude Code commands:
- `/todo` - Show outstanding work across projects
- `/new` - Start new work with plan-first workflow
- `/debug`, `/debug-local`, `/debug-staging` - Systematic debugging workflows
- `/pre-push` - Run pre-push checks
- `/archon-*` - Archon RAG knowledge base integration
- `/generate-blog` - Generate AI-powered blog post drafts

See `.claude/commands/` for all available commands.

### AI Blog Generation System

**Files:**
| File | Purpose |
|------|---------|
| `lib/ai-provider.ts` | Provider-agnostic AI client (z.ai, OpenAI, Anthropic) |
| `lib/blog-generator.ts` | Core blog generation workflow |
| `lib/blog-topics.ts` | 9 topic categories with tags for performance tracking |
| `lib/blog-prompts.ts` | System/user prompts for Dr. Latek's content guidelines |
| `app/api/blog/generate/route.ts` | POST endpoint for programmatic triggering |
| `app/api/blog/publish/route.ts` | GET endpoint for one-click publish from email |

**Workflow:**
1. `/generate-blog [topic]` → Generates blog via AI (z.ai)
2. Draft saved to Payload CMS with tags
3. Email sent with preview + "Publish Now" button
4. Dr. Latek clicks Publish or edits in admin

**Topic Categories:**
Comprehensive Eye Exams, Contact Lenses, Pediatrics, Hot Topics, Dry Eyes, Eyeglasses & Vision Correction, Myopia Management, Disease, Vision Therapy

## Development Notes

**Component Organization:**
- UI components live in `app/components/`
- Reusable primitives in `components/ui/` (Shadcn/Radix)
- Feature-specific components nested in feature directories

**Styling Approach:**
- Utility-first with Tailwind
- Custom styles in `app/globals.css`
- Component-specific SCSS where needed
- CSS variables for theming

**Type Safety:**
- Strict TypeScript enabled
- Prisma generates types automatically
- Global types for shared interfaces
- Payload CMS types auto-generated

**Data Flow:**
- Static data: `data/` directory
- CMS content: Fetched at build time (ISR with 60s revalidation)
- Analytics: Client-side collection → API route → Supabase
- All external data fetching uses Next.js caching

**Performance Considerations:**
- Images optimized via Next.js Image component
- Remote patterns configured for Cloudinary (legacy support)
- ISR (Incremental Static Regeneration) for blog pages (60s revalidation)
- Analytics tracking is non-blocking
