import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analyticsEvents } from '@/lib/db/schema';
import { sql, desc, and, gte, lte } from 'drizzle-orm';
import { subDays, subMonths, subYears, startOfDay, endOfDay, eachDayOfInterval, format } from 'date-fns';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const range = searchParams.get('range') || '30d';

        // Calculate date range
        const endDate = new Date();
        let startDate: Date;

        switch (range) {
            case '7d':
                startDate = subDays(endDate, 7);
                break;
            case '30d':
                startDate = subDays(endDate, 30);
                break;
            case '90d':
                startDate = subDays(endDate, 90);
                break;
            case '1y':
                startDate = subYears(endDate, 1);
                break;
            case 'all':
                startDate = subYears(endDate, 10); // Assume max 10 years of data
                break;
            default:
                startDate = subDays(endDate, 30);
        }

        // Fetch analytics data grouped by date
        const timeSeriesData = await db
            .select({
                date: sql<string>`DATE(${analyticsEvents.timestamp})`,
                views: sql<number>`COUNT(CASE WHEN ${analyticsEvents.eventType} = 'view' THEN 1 END)`,
                downloads: sql<number>`COUNT(CASE WHEN ${analyticsEvents.eventType} = 'download' THEN 1 END)`,
                citations: sql<number>`COUNT(CASE WHEN ${analyticsEvents.eventType} = 'citation' THEN 1 END)`,
            })
            .from(analyticsEvents)
            .where(
                and(
                    gte(analyticsEvents.timestamp, startDate),
                    lte(analyticsEvents.timestamp, endDate)
                )
            )
            .groupBy(sql`DATE(${analyticsEvents.timestamp})`)
            .orderBy(sql`DATE(${analyticsEvents.timestamp})`);

        // Fill in missing dates with zero values
        const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
        const dataMap = new Map(
            timeSeriesData.map((item) => [item.date, item])
        );

        const completeTimeSeries = dateRange.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const existing = dataMap.get(dateStr);

            return {
                date: dateStr,
                views: existing?.views || 0,
                downloads: existing?.downloads || 0,
                citations: existing?.citations || 0,
            };
        });

        return NextResponse.json({
            timeSeries: completeTimeSeries,
            range,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });
    } catch (error) {
        console.error('Error fetching time series data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch time series data' },
            { status: 500 }
        );
    }
}
