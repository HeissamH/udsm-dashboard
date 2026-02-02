import { NextRequest, NextResponse } from 'next/server';
import { getGeographicData } from '@/lib/analytics/aggregation';
import { z } from 'zod';

const querySchema = z.object({
    startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    eventType: z.enum(['view', 'download', 'citation']).optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const params = querySchema.parse({
            startDate: searchParams.get('startDate') || undefined,
            endDate: searchParams.get('endDate') || undefined,
            eventType: searchParams.get('eventType') || undefined,
        });

        const geoData = await getGeographicData(
            params.startDate,
            params.endDate,
            params.eventType
        );

        return NextResponse.json(geoData);
    } catch (error) {
        console.error('Geographic data error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
