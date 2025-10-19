# Analytics & Metrics Tracking

This document explains the metrics tracking system for thenycoptometrist.com.

## Overview

The site tracks visitor metrics (page views and click events) to understand traffic patterns and measure conversion effectiveness.

## Architecture

### Database
- **Local Dev**: PostgreSQL running on localhost (`thenycoptometrist_dev` database)
- **Production**: Supabase PostgreSQL
- **ORM**: Prisma for type-safe database access

### Components

1. **Database Table**: `metrics_events`
   - Stores all tracking events (visits and clicks)
   - Schema defined in `prisma/schema.prisma`

2. **API Endpoint**: `/api/metrics/track`
   - POST endpoint to record metrics
   - Located in `app/api/metrics/track/route.ts`

3. **Client Utilities**: `lib/analytics.ts`
   - `trackPageView()` - Track page visits
   - `trackClick(eventData)` - Track click events
   - Fails silently to not break user experience

4. **Auto-tracking**: `app/components/AnalyticsTracker.tsx`
   - Automatically tracks all page views
   - Included in root layout

## Usage

### Automatic Page View Tracking

Page views are tracked automatically via the `AnalyticsTracker` component in the root layout. No additional code needed.

### Manual Click Tracking

To track specific button/link clicks:

\`\`\`typescript
import { trackClick } from '@/lib/analytics';

// Track a Book Now button click
<button onClick={() => trackClick({ button: 'book-now', location: 'hero' })}>
  Book Now
</button>

// Track a ZocDoc link click
<a
  href="https://zocdoc.com/..."
  onClick={() => trackClick({ link: 'zocdoc', page: 'home' })}
>
  Schedule on ZocDoc
</a>
\`\`\`

## Database Setup

### Local Development

1. **Create local PostgreSQL database** (already done):
   \`\`\`bash
   createdb thenycoptometrist_dev
   \`\`\`

2. **Run migrations**:
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

3. **View in TablePlus**:
   - Host: localhost
   - Port: 5432
   - User: nathanielsena
   - Database: thenycoptometrist_dev

### Production Setup

1. **Get Supabase connection strings**:
   - Go to Supabase Dashboard → Settings → Database → Connection String
   - Copy "Session pooling" URL for `DATABASE_URL`
   - Copy "Transaction pooling" URL for `DIRECT_URL`

2. **Set environment variables in Vercel**:
   - `DATABASE_URL`: Session pooling connection string
   - `DIRECT_URL`: Transaction pooling connection string

3. **Run migrations in production**:
   \`\`\`bash
   npx prisma migrate deploy
   \`\`\`

## Querying Metrics

### Using Prisma Studio (GUI)

\`\`\`bash
npx prisma studio
\`\`\`

### Using Prisma Client (code)

\`\`\`typescript
import { prisma } from '@/lib/prisma';

// Get all visits from last 7 days
const recentVisits = await prisma.metricsEvent.findMany({
  where: {
    eventType: 'visit',
    createdAt: {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  },
  orderBy: { createdAt: 'desc' }
});

// Count visits by pathname
const visitsByPage = await prisma.metricsEvent.groupBy({
  by: ['pathname'],
  where: { eventType: 'visit' },
  _count: true
});
\`\`\`

## Environment Variables

### `.env` (committed to git)
Production reference values with `PROD_` prefix

### `.env.local` (NOT committed)
Local development values - same as `.env` but used locally

## Files

- `prisma/schema.prisma` - Database schema
- `prisma/migrations/` - Database migrations
- `lib/prisma.ts` - Prisma client singleton
- `lib/analytics.ts` - Client-side tracking utilities
- `app/api/metrics/track/route.ts` - API endpoint
- `app/components/AnalyticsTracker.tsx` - Auto-tracking component
- `app/layout.tsx` - Includes AnalyticsTracker

## Next Steps

- Build admin dashboard UI to visualize metrics (task #12)
- Add click tracking to Book Now buttons (task #14)
- Add click tracking to ZocDoc links (task #14)
- Add click tracking to product referral links (task #14)
