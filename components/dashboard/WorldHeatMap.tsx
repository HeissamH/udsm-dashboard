'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export function WorldHeatMap() {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics', 'geographic'],
        queryFn: async () => {
            const response = await fetch('/api/analytics/geographic');
            if (!response.ok) throw new Error('Failed to fetch geographic data');
            return response.json();
        },
        refetchInterval: 60000, // Refetch every minute
    });

    const colorScale = useMemo(() => {
        if (!data?.countries || data.countries.length === 0) {
            return scaleLinear<string>()
                .domain([0, 100])
                .range(['#F3F4F6', '#FFD900']);
        }

        const maxCount = Math.max(...data.countries.map((c: any) => c.count));
        return scaleLinear<string>()
            .domain([0, maxCount])
            .range(['#F3F4F6', '#FFD900']);
    }, [data]);

    const countryData = useMemo(() => {
        if (!data?.countries) return {};
        return data.countries.reduce((acc: any, country: any) => {
            acc[country.code] = country.count;
            return acc;
        }, {});
    }, [data]);

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Global Readership Map</CardTitle>
                <p className="text-sm text-slate-600">
                    Real-time visualization of where UDSM research is being accessed worldwide
                </p>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-96 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">
                        <p className="text-slate-500">Loading map data...</p>
                    </div>
                ) : (
                    <div className="relative">
                        <ComposableMap
                            projection="geoMercator"
                            projectionConfig={{
                                scale: 147,
                            }}
                            className="w-full h-96"
                        >
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => {
                                        const countryCode = geo.id;
                                        const count = countryData[countryCode] || 0;

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill={count > 0 ? colorScale(count) : '#E5E7EB'}
                                                stroke="#FFFFFF"
                                                strokeWidth={0.5}
                                                style={{
                                                    default: { outline: 'none' },
                                                    hover: {
                                                        fill: '#334E68',
                                                        outline: 'none',
                                                        cursor: 'pointer',
                                                    },
                                                    pressed: { outline: 'none' },
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ComposableMap>

                        {/* Legend */}
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                            <p className="text-xs font-semibold text-[#334E68] mb-2">Engagement Level</p>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F3F4F6' }} />
                                    <span className="text-xs text-slate-600">Low</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFD900' }} />
                                    <span className="text-xs text-slate-600">High</span>
                                </div>
                            </div>
                            {data?.countries && (
                                <p className="text-xs text-slate-500 mt-2">
                                    {data.countries.length} countries tracked
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
