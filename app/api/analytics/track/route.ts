import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getGeolocation } from '@/lib/geo/cache';
import { hashIp } from '@/lib/geo/utils';
import { eventExists, recordEvent } from '@/lib/analytics/tracking';

const trackEventSchema = z.object({
    paperId: z.string().uuid(),
    eventType: z.enum(['view', 'download']),
    sessionId: z.string(),
    ip: z.string(),
    userAgent: z.string().optional(),
    referrer: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        // Verify internal secret
        const authHeader = request.headers.get('authorization');
        const expectedSecret = process.env.ANALYTICS_SECRET;

        if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const data = trackEventSchema.parse(body);

        // Check for duplicate event
        const isDuplicate = await eventExists(
            data.sessionId,
            data.paperId,
            data.eventType
        );

        if (isDuplicate) {
            return NextResponse.json({ success: true, duplicate: true });
        }

        // Get geolocation data
        const geoData = await getGeolocation(data.ip);
        const ipHash = hashIp(data.ip);

        // Record the event
        await recordEvent({
            paperId: data.paperId,
            eventType: data.eventType,
            ipHash,
            sessionId: data.sessionId,
            countryCode: geoData?.countryCode,
            countryName: geoData?.countryName,
            city: geoData?.city,
            latitude: geoData?.latitude,
            longitude: geoData?.longitude,
            userAgent: data.userAgent,
            referrer: data.referrer,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics tracking error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
