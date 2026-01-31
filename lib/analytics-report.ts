// lib/analytics-report.ts
//
// Shared service for generating and sending weekly analytics reports.
// Used by both:
//   - /api/cron/weekly-report (automated Monday emails)
//   - /api/email/report (manual API testing)
//
// Reference: PRD for Weekly Analytics Email System

import { prisma } from '@/lib/prisma';
import { sendAnalyticsReport, AnalyticsData } from '@/lib/email';
import { EventType } from '@prisma/client';

/**
 * Result returned by generateAndSendWeeklyReport()
 * Includes success status, analytics data, error details, and timing metrics for observability
 */
export interface ReportResult {
  success: boolean;
  data?: AnalyticsData;
  error?: string;
  timing?: {
    queryDurationMs: number;
    emailDurationMs: number;
    totalDurationMs: number;
  };
}

/**
 * Generates and sends the weekly analytics report email.
 *
 * This function:
 * 1. Queries the database for current and previous week metrics
 * 2. Calculates analytics data (visits, clicks, top pages, etc.)
 * 3. Sends the report via Resend email
 * 4. Returns detailed timing and result information
 *
 * @returns ReportResult with success status, data, error, and timing metrics
 */
export async function generateAndSendWeeklyReport(): Promise<ReportResult> {
  const startTime = Date.now();
  let queryEndTime = 0;
  let emailEndTime = 0;

  try {
    // 1. Calculate date ranges for current and previous weeks
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - 7);

    const previousWeekStart = new Date(now);
    previousWeekStart.setDate(now.getDate() - 14);

    const previousWeekEnd = new Date(currentWeekStart);

    console.log('[analytics-report] Generating report', {
      currentWeek: { start: currentWeekStart.toISOString(), end: now.toISOString() },
      previousWeek: { start: previousWeekStart.toISOString(), end: previousWeekEnd.toISOString() }
    });

    // 2. Query metrics from database (parallel queries for current and previous week)
    const queryStartTime = Date.now();
    const [currentWeekEvents, previousWeekEvents] = await Promise.all([
      prisma.metricsEvent.findMany({
        where: {
          createdAt: {
            gte: currentWeekStart,
            lte: now
          }
        },
        select: {
          eventType: true,
          pathname: true
        }
      }),
      prisma.metricsEvent.findMany({
        where: {
          createdAt: {
            gte: previousWeekStart,
            lt: previousWeekEnd
          }
        },
        select: {
          eventType: true
        }
      })
    ]);
    queryEndTime = Date.now();

    console.log('[analytics-report] Query complete', {
      currentWeekCount: currentWeekEvents.length,
      previousWeekCount: previousWeekEvents.length,
      queryDurationMs: queryEndTime - queryStartTime
    });

    // 3. Calculate current week metrics
    const currentMetrics = {
      totalEvents: currentWeekEvents.length,
      uniqueVisitors: currentWeekEvents.filter(e => e.eventType === EventType.visit).length,
      bookNowClicks: currentWeekEvents.filter(e => e.eventType === EventType.book_now_clicked).length,
      phoneClicks: currentWeekEvents.filter(e => e.eventType === EventType.phone_clicked).length,
      emailClicks: currentWeekEvents.filter(e => e.eventType === EventType.email_clicked).length,
      socialClicks: currentWeekEvents.filter(e => e.eventType === EventType.social_media_clicked).length,
      blogClicks: currentWeekEvents.filter(e => e.eventType === EventType.blog_post_clicked).length,
      externalClicks: currentWeekEvents.filter(e => e.eventType === EventType.external_link_clicked).length,
    };

    // 4. Calculate previous week metrics for comparison
    const previousMetrics = {
      totalEvents: previousWeekEvents.length,
      uniqueVisitors: previousWeekEvents.filter(e => e.eventType === EventType.visit).length,
      bookNowClicks: previousWeekEvents.filter(e => e.eventType === EventType.book_now_clicked).length,
      phoneClicks: previousWeekEvents.filter(e => e.eventType === EventType.phone_clicked).length,
      emailClicks: previousWeekEvents.filter(e => e.eventType === EventType.email_clicked).length,
      socialClicks: previousWeekEvents.filter(e => e.eventType === EventType.social_media_clicked).length,
      blogClicks: previousWeekEvents.filter(e => e.eventType === EventType.blog_post_clicked).length,
      externalClicks: previousWeekEvents.filter(e => e.eventType === EventType.external_link_clicked).length,
    };

    // 5. Calculate top 3 pages by visit count
    const pageViews = currentWeekEvents
      .filter(e => e.eventType === EventType.visit)
      .reduce((acc, event) => {
        acc[event.pathname] = (acc[event.pathname] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topPages = Object.entries(pageViews)
      .map(([pathname, views]) => ({ pathname, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);

    // 6. Format dates for email display
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    // 7. Prepare analytics data for email
    const analyticsData: AnalyticsData = {
      totalEvents: currentMetrics.totalEvents,
      uniqueVisitors: currentMetrics.uniqueVisitors,
      bookNowClicks: currentMetrics.bookNowClicks,
      phoneClicks: currentMetrics.phoneClicks,
      emailClicks: currentMetrics.emailClicks,
      socialClicks: currentMetrics.socialClicks,
      blogClicks: currentMetrics.blogClicks,
      externalClicks: currentMetrics.externalClicks,
      topPages: topPages,

      previousTotalEvents: previousMetrics.totalEvents,
      previousUniqueVisitors: previousMetrics.uniqueVisitors,
      previousBookNowClicks: previousMetrics.bookNowClicks,
      previousPhoneClicks: previousMetrics.phoneClicks,
      previousEmailClicks: previousMetrics.emailClicks,
      previousSocialClicks: previousMetrics.socialClicks,
      previousBlogClicks: previousMetrics.blogClicks,
      previousExternalClicks: previousMetrics.externalClicks,

      startDate: formatDate(currentWeekStart),
      endDate: formatDate(now),
    };

    console.log('[analytics-report] Analytics data prepared', {
      totalEvents: analyticsData.totalEvents,
      uniqueVisitors: analyticsData.uniqueVisitors,
      bookNowClicks: analyticsData.bookNowClicks,
      topPagesCount: topPages.length
    });

    // 8. Send email via Resend
    const emailStartTime = Date.now();
    const emailResult = await sendAnalyticsReport(analyticsData);
    emailEndTime = Date.now();

    if (!emailResult.success) {
      console.error('[analytics-report] Email send failed', {
        error: emailResult.error,
        timing: {
          queryDurationMs: queryEndTime - queryStartTime,
          emailDurationMs: emailEndTime - emailStartTime,
          totalDurationMs: Date.now() - startTime
        }
      });

      return {
        success: false,
        data: analyticsData,
        error: emailResult.error,
        timing: {
          queryDurationMs: queryEndTime - queryStartTime,
          emailDurationMs: emailEndTime - emailStartTime,
          totalDurationMs: Date.now() - startTime
        }
      };
    }

    console.log('[analytics-report] Report sent successfully', {
      totalDurationMs: Date.now() - startTime,
      queryDurationMs: queryEndTime - queryStartTime,
      emailDurationMs: emailEndTime - emailStartTime
    });

    return {
      success: true,
      data: analyticsData,
      timing: {
        queryDurationMs: queryEndTime - queryStartTime,
        emailDurationMs: emailEndTime - emailStartTime,
        totalDurationMs: Date.now() - startTime
      }
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('[analytics-report] Unexpected error', {
      error: errorMessage,
      stack: errorStack,
      totalDurationMs: Date.now() - startTime
    });

    return {
      success: false,
      error: errorMessage,
      timing: {
        queryDurationMs: queryEndTime > 0 ? queryEndTime - startTime : 0,
        emailDurationMs: emailEndTime > 0 ? emailEndTime - queryEndTime : 0,
        totalDurationMs: Date.now() - startTime
      }
    };
  }
}
