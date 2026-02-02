import { db } from '../db';
import { analyticsEvents } from '../db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Check if an event already exists (deduplication)
 */
export async function eventExists(
    sessionId: string,
    paperId: string,
    eventType: 'view' | 'download' | 'citation'
): Promise<boolean> {
    const existing = await db
        .select({ id: analyticsEvents.id })
        .from(analyticsEvents)
        .where(
            and(
                eq(analyticsEvents.sessionId, sessionId),
                eq(analyticsEvents.paperId, paperId),
                eq(analyticsEvents.eventType, eventType)
            )
        )
        .limit(1);

    return existing.length > 0;
}

/**
 * Record an analytics event
 */
export async function recordEvent(data: {
    paperId: string;
    eventType: 'view' | 'download' | 'citation';
    ipHash: string;
    sessionId: string;
    countryCode?: string;
    countryName?: string;
    city?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    userAgent?: string;
    referrer?: string;
}): Promise<void> {
    await db.insert(analyticsEvents).values({
        paperId: data.paperId,
        eventType: data.eventType,
        ipHash: data.ipHash,
        sessionId: data.sessionId,
        countryCode: data.countryCode || null,
        countryName: data.countryName || null,
        city: data.city || null,
        latitude: data.latitude?.toString() || null,
        longitude: data.longitude?.toString() || null,
        userAgent: data.userAgent || null,
        referrer: data.referrer || null,
    });
}
