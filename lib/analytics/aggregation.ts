import { db } from '../db';
import { analyticsEvents, papers } from '../db/schema';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';

export interface OverviewMetrics {
    totalViews: number;
    totalDownloads: number;
    totalCitations: number;
    uniqueCountries: number;
    growthRate: {
        views: number;
        downloads: number;
        citations: number;
    };
}

export interface GeographicData {
    countries: Array<{
        code: string;
        name: string;
        count: number;
        percentage: number;
        coordinates: [number, number];
    }>;
}

export interface TimeSeriesData {
    data: Array<{
        date: string;
        views: number;
        downloads: number;
        citations: number;
    }>;
}

export interface TopPaper {
    id: string;
    title: string;
    authors: string[];
    views: number;
    downloads: number;
    citations: number;
    countries: number;
}

/**
 * Get overview metrics
 */
export async function getOverviewMetrics(
    startDate?: Date,
    endDate?: Date,
    paperId?: string
): Promise<OverviewMetrics> {
    const conditions = [];

    if (startDate) {
        conditions.push(gte(analyticsEvents.timestamp, startDate));
    }
    if (endDate) {
        conditions.push(lte(analyticsEvents.timestamp, endDate));
    }
    if (paperId) {
        conditions.push(eq(analyticsEvents.paperId, paperId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get current period metrics
    const metrics = await db
        .select({
            eventType: analyticsEvents.eventType,
            count: sql<number>`count(*)::int`,
        })
        .from(analyticsEvents)
        .where(whereClause)
        .groupBy(analyticsEvents.eventType);

    const uniqueCountries = await db
        .select({
            count: sql<number>`count(distinct ${analyticsEvents.countryCode})::int`,
        })
        .from(analyticsEvents)
        .where(whereClause);

    const totalViews = metrics.find((m) => m.eventType === 'view')?.count || 0;
    const totalDownloads = metrics.find((m) => m.eventType === 'download')?.count || 0;
    const totalCitations = metrics.find((m) => m.eventType === 'citation')?.count || 0;

    // Calculate growth rates (simplified - compare to previous period)
    // In production, this would compare to the same time period before
    const growthRate = {
        views: 0,
        downloads: 0,
        citations: 0,
    };

    return {
        totalViews,
        totalDownloads,
        totalCitations,
        uniqueCountries: uniqueCountries[0]?.count || 0,
        growthRate,
    };
}

/**
 * Get geographic distribution
 */
export async function getGeographicData(
    startDate?: Date,
    endDate?: Date,
    eventType?: 'view' | 'download' | 'citation'
): Promise<GeographicData> {
    const conditions = [];

    if (startDate) {
        conditions.push(gte(analyticsEvents.timestamp, startDate));
    }
    if (endDate) {
        conditions.push(lte(analyticsEvents.timestamp, endDate));
    }
    if (eventType) {
        conditions.push(eq(analyticsEvents.eventType, eventType));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const geoData = await db
        .select({
            code: analyticsEvents.countryCode,
            name: analyticsEvents.countryName,
            count: sql<number>`count(*)::int`,
            avgLat: sql<number>`avg(${analyticsEvents.latitude})::float`,
            avgLng: sql<number>`avg(${analyticsEvents.longitude})::float`,
        })
        .from(analyticsEvents)
        .where(whereClause)
        .groupBy(analyticsEvents.countryCode, analyticsEvents.countryName)
        .orderBy(desc(sql`count(*)`));

    const total = geoData.reduce((sum, item) => sum + item.count, 0);

    return {
        countries: geoData.map((item) => ({
            code: item.code || 'XX',
            name: item.name || 'Unknown',
            count: item.count,
            percentage: total > 0 ? (item.count / total) * 100 : 0,
            coordinates: [item.avgLng || 0, item.avgLat || 0] as [number, number],
        })),
    };
}

/**
 * Get top papers
 */
export async function getTopPapers(
    limit: number = 10,
    sortBy: 'views' | 'downloads' | 'citations' = 'views',
    startDate?: Date,
    endDate?: Date
): Promise<TopPaper[]> {
    const conditions = [];

    if (startDate) {
        conditions.push(gte(analyticsEvents.timestamp, startDate));
    }
    if (endDate) {
        conditions.push(lte(analyticsEvents.timestamp, endDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sortMapping = {
        views: 'view',
        downloads: 'download',
        citations: 'citation'
    };
    const sortEvent = sortMapping[sortBy];

    const topPapers = await db
        .select({
            paperId: analyticsEvents.paperId,
            views: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'view')::int`,
            downloads: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'download')::int`,
            citations: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'citation')::int`,
            countries: sql<number>`count(distinct ${analyticsEvents.countryCode})::int`,
        })
        .from(analyticsEvents)
        .where(whereClause)
        .groupBy(analyticsEvents.paperId)
        .orderBy(desc(sql`count(*) filter (where ${analyticsEvents.eventType} = ${sortEvent})`))
        .limit(limit);

    // Fetch paper details
    const paperIds = topPapers.map((p) => p.paperId);
    const paperDetails = await db
        .select()
        .from(papers)
        .where(sql`${papers.id} = any(${paperIds})`);

    return topPapers.map((tp) => {
        const paper = paperDetails.find((p) => p.id === tp.paperId);
        return {
            id: tp.paperId,
            title: paper?.title || 'Unknown',
            authors: paper?.authors || [],
            views: tp.views,
            downloads: tp.downloads,
            citations: tp.citations,
            countries: tp.countries,
        };
    });
}
