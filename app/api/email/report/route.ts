import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAnalyticsReport, AnalyticsData } from '@/lib/email';
import { EventType } from '@prisma/client';

export async function GET() {
  try {
    // Calculate date ranges
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - 7);

    const previousWeekStart = new Date(now);
    previousWeekStart.setDate(now.getDate() - 14);

    const previousWeekEnd = new Date(currentWeekStart);

    console.log('Generating analytics report for:', {
      currentWeek: `${currentWeekStart.toISOString()} - ${now.toISOString()}`,
      previousWeek: `${previousWeekStart.toISOString()} - ${previousWeekEnd.toISOString()}`
    });

    // Query current week metrics
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

    console.log('Query results:', {
      currentWeekCount: currentWeekEvents.length,
      previousWeekCount: previousWeekEvents.length
    });

    // Calculate current week metrics
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

    // Calculate previous week metrics
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

    // Calculate top 3 pages by visit count
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

    // Format dates for email
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    // Prepare analytics data for email
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

    console.log('Sending email with analytics data:', analyticsData);

    // Send email
    const emailResult = await sendAnalyticsReport(analyticsData);

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error,
          message: 'Failed to send analytics email'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Analytics report sent successfully',
      data: analyticsData
    });

  } catch (error) {
    console.error('Error generating analytics report:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to generate analytics report'
      },
      { status: 500 }
    );
  }
}
