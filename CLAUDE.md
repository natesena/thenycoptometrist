# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 website for The NYC Optometrist (Dr. Joanna Latek), featuring comprehensive eye care services, blog content, and appointment booking functionality. The site uses the App Router with TypeScript and integrates with external services for content management and database operations.

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
- **Database**: PostgreSQL (local dev) / Supabase (production)
- **ORM**: Prisma
- **CMS**: Strapi (headless CMS for blog content)
- **UI Libraries**: Radix UI components, Framer Motion, GSAP
- **Smooth Scrolling**: Lenis

### Database Architecture

**Two-Database System:**
1. **Metrics Database** (Supabase): Tracks analytics via Prisma
   - Local dev: PostgreSQL (`thenycoptometrist_dev`)
   - Production: Supabase PostgreSQL
   - Schema: `prisma/schema.prisma`
   - Connection pooling configured for Vercel serverless

2. **Blog Content** (Strapi CMS): Headless CMS for blog posts
   - Strapi runs separately (not in this repo)
   - Content fetched via `lib/strapi.ts`
   - Environment variable: `NEXT_PUBLIC_STRAPI_URL`

**Important**: These are completely separate systems. Metrics use Prisma + Supabase. Blog content uses Strapi API.

### Project Structure

```
app/
  ├── components/           # All UI components
  │   ├── header/          # Navigation and menu
  │   ├── hero/            # Hero section
  │   ├── reviews/         # Review components
  │   ├── ConversionDrawer/# Booking drawer
  │   └── AnalyticsTracker.tsx  # Auto-tracks page views
  ├── blog/                # Blog pages (fetches from Strapi)
  ├── api/
  │   └── metrics/track/   # POST endpoint for analytics
  ├── layout.tsx           # Root layout with SEO, JSON-LD
  └── page.tsx             # Homepage

lib/
  ├── analytics.ts         # Client-side tracking utilities
  ├── strapi.ts           # Strapi CMS API client
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
- `BlogPost`, `StrapiResponse` (CMS integration)

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

**Strapi Integration:**
- Blog posts fetched via `getBlogPosts()` and `getBlogPostBySlug()`
- Content uses Strapi Blocks format (rich text)
- Rendered with `@strapi/blocks-react-renderer`
- Images hosted on Cloudinary

**Image Configuration:**
Next.js configured for:
- Strapi local: `localhost:1337/uploads/**`
- Cloudinary: `**.cloudinary.com/**`

### Environment Variables

Required variables (see `.env.local.example`):
```bash
# Metrics Database (Supabase)
DATABASE_URL=          # Connection pooling URL (Session mode)
DIRECT_URL=           # Direct connection URL (Transaction mode)

# Blog CMS (Strapi)
NEXT_PUBLIC_STRAPI_URL=  # Strapi API base URL
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
- Ensure DATABASE_URL and DIRECT_URL are set in Vercel
- Run `npx prisma migrate deploy` after schema changes
- Verify NEXT_PUBLIC_STRAPI_URL points to production Strapi

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

See `.claude/commands/` for all available commands.

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
- Strapi responses typed via `StrapiResponse<T>`

**Data Flow:**
- Static data: `data/` directory
- CMS content: Fetched at build time (ISR with 60s revalidation)
- Analytics: Client-side collection → API route → Supabase
- All external data fetching uses Next.js caching

**Performance Considerations:**
- Images optimized via Next.js Image component
- Remote patterns configured for Strapi and Cloudinary
- ISR (Incremental Static Regeneration) for blog pages
- Analytics tracking is non-blocking
