// app/api/cron/weekly-report/route.ts
//
// Vercel Cron job endpoint for weekly analytics emails.
// Runs every Monday at 9:00 AM EST (2:00 PM UTC).
//
// This endpoint uses direct function invocation (no HTTP fetch)
// to avoid issues with internal requests in Vercel's serverless environment.
//
// Reference: Vercel Cron Jobs documentation
// https://vercel.com/guides/troubleshooting-vercel-cron-jobs

import { NextRequest, NextResponse } from 'next/server';
import { generateAndSendWeeklyReport } from '@/lib/analytics-report';

// Force dynamic execution - prevents Next.js from caching cron responses
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Generate correlation ID for tracing this execution through logs
  const cronId = `cron-${Date.now()}`;

  console.log(`[cron:${cronId}] Weekly report triggered`, {
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent')
  });

  try {
    // Verify cron secret if configured (Vercel sends this header)
    if (process.env.CRON_SECRET) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.error(`[cron:${cronId}] Unauthorized request - invalid cron secret`);
        return NextResponse.json(
          { success: false, cronId, error: 'Unauthorized' },
          { status: 401 }
        );
      }
    } else {
      console.warn(`[cron:${cronId}] CRON_SECRET not configured - skipping validation`);
    }

    // Direct function call - no HTTP request needed
    // This avoids issues with internal fetch in Vercel serverless
    const result = await generateAndSendWeeklyReport();

    if (!result.success) {
      console.error(`[cron:${cronId}] Report generation failed`, {
        error: result.error,
        timing: result.timing
      });

      return NextResponse.json({
        success: false,
        cronId,
        error: result.error,
        timing: result.timing
      }, { status: 500 });
    }

    console.log(`[cron:${cronId}] Report completed successfully`, {
      timing: result.timing,
      metrics: {
        totalEvents: result.data?.totalEvents,
        uniqueVisitors: result.data?.uniqueVisitors,
        bookNowClicks: result.data?.bookNowClicks
      }
    });

    return NextResponse.json({
      success: true,
      cronId,
      message: 'Weekly analytics report sent successfully',
      timing: result.timing,
      summary: {
        totalEvents: result.data?.totalEvents,
        uniqueVisitors: result.data?.uniqueVisitors,
        bookNowClicks: result.data?.bookNowClicks,
        phoneClicks: result.data?.phoneClicks,
        dateRange: `${result.data?.startDate} - ${result.data?.endDate}`
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error(`[cron:${cronId}] Unexpected error`, {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json({
      success: false,
      cronId,
      error: errorMessage
    }, { status: 500 });
  }
}
