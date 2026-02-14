/**
 * Next.js Middleware - Bot Detection
 *
 * Reference: docs/cloudflare-analytics-plan.md
 *
 * Detects AI bots (GPTBot, ClaudeBot, PerplexityBot, etc.) and tracks
 * their visits via the /api/metrics/bot-track endpoint.
 */

import { createBotMiddleware } from 'cloudflare-traffic-analytics';

export default createBotMiddleware({
  trackingEndpoint: '/api/metrics/bot-track',
  skipPaths: [
    '/api/',
    '/_next/',
    '/admin/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
  ],
  // Only track AI bots (not traditional search crawlers)
  trackingMode: 'ai-only',
  // Enable debug logging in development
  debug: process.env.NODE_ENV === 'development',
});

export const config = {
  // Match all routes except static files and internal Next.js routes
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|css|js|map)$).*)',
  ],
};
