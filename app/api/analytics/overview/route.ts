import { NextRequest, NextResponse } from 'next/server';
import { getOverviewMetrics } from '@/lib/analytics/aggregation';
import { z } from 'zod';

const querySchema = z.object({
    startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    paperId: z.string().uuid().optional(),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const params = querySchema.parse({
            startDate: searchParams.get('startDate') || undefined,
            endDate: searchParams.get('endDate') || undefined,
            paperId: searchParams.get('paperId') || undefined,
        });

        const metrics = await getOverviewMetrics(
            params.startDate,
            params.endDate,
            params.paperId
        );

        return NextResponse.json(metrics);
    } catch (error) {
        console.error('Overview metrics error:', error);

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
