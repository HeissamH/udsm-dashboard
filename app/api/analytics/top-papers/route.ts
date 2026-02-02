import { NextRequest, NextResponse } from 'next/server';
import { getTopPapers } from '@/lib/analytics/aggregation';
import { z } from 'zod';

const querySchema = z.object({
    limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
    sortBy: z.enum(['views', 'downloads', 'citations']).optional().default('views'),
    startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const params = querySchema.parse({
            limit: searchParams.get('limit') || undefined,
            sortBy: searchParams.get('sortBy') || undefined,
            startDate: searchParams.get('startDate') || undefined,
            endDate: searchParams.get('endDate') || undefined,
        });

        const topPapers = await getTopPapers(
            params.limit,
            params.sortBy,
            params.startDate,
            params.endDate
        );

        return NextResponse.json({ papers: topPapers });
    } catch (error) {
        console.error('Top papers error:', error);

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
