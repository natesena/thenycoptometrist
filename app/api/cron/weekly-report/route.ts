import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verify the request is coming from Vercel Cron
    const authHeader = request.headers.get('authorization');

    if (process.env.CRON_SECRET) {
      // Validate cron secret if configured
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.error('Unauthorized cron request');
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
    } else {
      console.warn('CRON_SECRET not configured - skipping validation');
    }

    console.log('Weekly analytics report cron triggered at:', new Date().toISOString());

    // Call the report generation endpoint
    const reportUrl = new URL('/api/email/report', request.url);

    const reportResponse = await fetch(reportUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const reportData = await reportResponse.json();

    if (!reportResponse.ok) {
      console.error('Report generation failed:', reportData);
      return NextResponse.json(
        {
          success: false,
          error: 'Report generation failed',
          details: reportData
        },
        { status: reportResponse.status }
      );
    }

    console.log('Weekly analytics report sent successfully:', reportData);

    return NextResponse.json({
      success: true,
      message: 'Weekly analytics report sent successfully',
      timestamp: new Date().toISOString(),
      data: reportData
    });

  } catch (error) {
    console.error('Error in weekly report cron:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to execute weekly report cron'
      },
      { status: 500 }
    );
  }
}
