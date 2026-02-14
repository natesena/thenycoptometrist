/**
 * Bot Tracking API Endpoint
 *
 * Reference: docs/cloudflare-analytics-plan.md
 *
 * Receives bot visit data from the middleware and stores it in the database.
 * This endpoint is called via fire-and-forget from the bot detection middleware.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventType } from '@prisma/client';

/**
 * Payload expected from the bot detection middleware
 * (matches BotTrackingPayload from cloudflare-traffic-analytics)
 */
interface BotTrackingPayload {
  botProvider: string;
  botName: string;
  isAIBot: boolean;
  url: string;
  pathname: string;
  userAgent: string;
  referrer: string | null;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BotTrackingPayload = await request.json();

    // Validate required fields
    if (!body.botProvider || !body.botName || !body.url || !body.pathname) {
      return NextResponse.json(
        { error: 'Missing required fields: botProvider, botName, url, pathname' },
        { status: 400 }
      );
    }

    // Create metrics event with ai_bot_visit type
    const event = await prisma.metricsEvent.create({
      data: {
        eventType: EventType.ai_bot_visit,
        url: body.url,
        pathname: body.pathname,
        userAgent: body.userAgent || null,
        referrer: body.referrer || null,
        eventData: {
          botProvider: body.botProvider,
          botName: body.botName,
          isAIBot: body.isAIBot,
          timestamp: body.timestamp,
        },
      },
    });

    return NextResponse.json({ success: true, id: event.id }, { status: 201 });
  } catch (error) {
    console.error('Error tracking bot visit:', error);
    return NextResponse.json(
      { error: 'Failed to track bot visit' },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint - useful for testing the endpoint is reachable
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'bot-track',
    description: 'Bot visit tracking endpoint for AI bot detection',
  });
}
