import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventType, Prisma } from '@prisma/client';

// Simple admin password protection
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.split(' ')[1];
  if (!token) return false;
  
  // Simple base64 password check
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    return decoded === ADMIN_PASSWORD;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  // Check admin authorization
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const eventType = searchParams.get('eventType');
    const pathname = searchParams.get('pathname');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const groupBy = searchParams.get('groupBy'); // 'date', 'event', 'path'

    // Build where clause
    const whereClause: Prisma.MetricsEventWhereInput = {};
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
    }
    
    if (eventType && Object.values(EventType).includes(eventType as EventType)) {
      whereClause.eventType = eventType as EventType;
    }
    
    if (pathname) {
      whereClause.pathname = { contains: pathname };
    }

    // Handle grouped/aggregated data
    if (groupBy) {
      let groupedData;
      
      switch (groupBy) {
        case 'date':
          groupedData = await prisma.metricsEvent.groupBy({
            by: ['createdAt'],
            where: whereClause,
            _count: { id: true },
            orderBy: { createdAt: 'desc' },
          });
          break;
          
        case 'event':
          groupedData = await prisma.metricsEvent.groupBy({
            by: ['eventType'],
            where: whereClause,
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
          });
          break;
          
        case 'path':
          groupedData = await prisma.metricsEvent.groupBy({
            by: ['pathname'],
            where: whereClause,
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
          });
          break;
          
        default:
          throw new Error('Invalid groupBy parameter');
      }
      
      return NextResponse.json({ data: groupedData });
    }

    // Regular paginated data
    const offset = (page - 1) * limit;
    
    const [events, total] = await Promise.all([
      prisma.metricsEvent.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.metricsEvent.count({ where: whereClause }),
    ]);

    // Get summary stats
    const summaryStats = await prisma.metricsEvent.groupBy({
      by: ['eventType'],
      where: whereClause,
      _count: { id: true },
    });

    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      summary: summaryStats,
    });
    
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

// Export analytics data (CSV format)
export async function POST(request: NextRequest) {
  // Check admin authorization
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { format = 'json', ...filters } = body;

    // Build where clause from filters
    const whereClause: Prisma.MetricsEventWhereInput = {};
    
    if (filters.startDate || filters.endDate) {
      whereClause.createdAt = {};
      if (filters.startDate) whereClause.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) whereClause.createdAt.lte = new Date(filters.endDate);
    }
    
    if (filters.eventType) {
      whereClause.eventType = filters.eventType;
    }

    const events = await prisma.metricsEvent.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'csv') {
      // Convert to CSV
      const headers = ['Date/Time', 'Event Type', 'URL', 'Path', 'User Agent', 'Referrer'];
      const csvRows = [
        headers.join(','),
        ...events.map(event => [
          event.createdAt.toISOString(),
          event.eventType,
          `"${event.url}"`,
          `"${event.pathname}"`,
          `"${event.userAgent || ''}"`,
          `"${event.referrer || ''}"`,
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="metrics-export.csv"',
        },
      });
    }

    return NextResponse.json({ events });
    
  } catch (error) {
    console.error('Error exporting metrics:', error);
    return NextResponse.json(
      { error: 'Failed to export metrics' },
      { status: 500 }
    );
  }
}