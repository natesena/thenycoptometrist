// app/api/email/report/route.ts
//
// Manual API endpoint for triggering analytics email reports.
// Use this for testing or manual report generation.
//
// Usage:
//   GET /api/email/report
//   curl https://www.thenycoptometrist.com/api/email/report
//
// This endpoint and /api/cron/weekly-report both use the same
// underlying service (lib/analytics-report.ts) for consistency.

import { NextResponse } from 'next/server';
import { generateAndSendWeeklyReport } from '@/lib/analytics-report';

// Force dynamic execution - this endpoint should never be cached
export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('[email-report] Manual report request received', {
    timestamp: new Date().toISOString()
  });

  const result = await generateAndSendWeeklyReport();

  if (!result.success) {
    console.error('[email-report] Report generation failed', {
      error: result.error,
      timing: result.timing
    });

    return NextResponse.json({
      success: false,
      error: result.error,
      timing: result.timing
    }, { status: 500 });
  }

  console.log('[email-report] Report sent successfully', {
    timing: result.timing
  });

  return NextResponse.json({
    success: true,
    message: 'Analytics report sent successfully',
    data: result.data,
    timing: result.timing
  });
}
