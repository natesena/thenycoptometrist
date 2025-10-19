import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.eventType || !body.url || !body.pathname) {
      return NextResponse.json(
        { error: 'Missing required fields: eventType, url, pathname' },
        { status: 400 }
      );
    }

    // Validate eventType is a valid enum value
    if (!Object.values(EventType).includes(body.eventType as EventType)) {
      return NextResponse.json(
        {
          error: `Invalid eventType. Must be one of: ${Object.values(EventType).join(', ')}`
        },
        { status: 400 }
      );
    }

    // Create metrics event
    const event = await prisma.metricsEvent.create({
      data: {
        eventType: body.eventType,
        url: body.url,
        pathname: body.pathname,
        userAgent: body.userAgent || null,
        referrer: body.referrer || null,
        eventData: body.eventData || null,
      },
    });

    return NextResponse.json({ success: true, id: event.id }, { status: 201 });
  } catch (error) {
    console.error('Error tracking metrics:', error);
    return NextResponse.json(
      { error: 'Failed to track metrics' },
      { status: 500 }
    );
  }
}
