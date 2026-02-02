'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import CountUp from 'react-countup';
import { formatCompactNumber } from '@/lib/utils/format';

interface MetricsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    trend?: number;
    loading?: boolean;
}

export function MetricsCard({ title, value, icon, trend, loading }: MetricsCardProps) {
    const getTrendIcon = () => {
        if (!trend || trend === 0) return <Minus className="w-4 h-4" />;
        return trend > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
    };

    const getTrendColor = () => {
        if (!trend || trend === 0) return 'text-slate-500';
        return trend > 0 ? 'text-green-600' : 'text-red-600';
    };

    return (
        <Card className="hover:border-[#FFD900] transition-colors">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-[#FFD900]/10 rounded-lg">
                        {icon}
                    </div>
                    {trend !== undefined && (
                        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
                            {getTrendIcon()}
                            <span className="text-sm font-semibold">
                                {Math.abs(trend).toFixed(1)}%
                            </span>
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm text-slate-600 mb-1">{title}</p>
                    {loading ? (
                        <div className="h-8 w-24 bg-slate-200 animate-pulse rounded" />
                    ) : (
                        <p className="text-3xl font-bold text-[#334E68]">
                            <CountUp
                                end={value}
                                duration={2}
                                separator=","
                                formattingFn={(value) => formatCompactNumber(value)}
                            />
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function MetricsGrid() {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics', 'overview'],
        queryFn: async () => {
            const response = await fetch('/api/analytics/overview');
            if (!response.ok) throw new Error('Failed to fetch metrics');
            return response.json();
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    const metrics = [
        {
            title: 'Total Views',
            value: data?.totalViews || 0,
            icon: <div className="w-6 h-6 text-[#334E68]">👁️</div>,
            trend: data?.growthRate?.views || 0,
        },
        {
            title: 'Total Downloads',
            value: data?.totalDownloads || 0,
            icon: <div className="w-6 h-6 text-[#334E68]">⬇️</div>,
            trend: data?.growthRate?.downloads || 0,
        },
        {
            title: 'Total Citations',
            value: data?.totalCitations || 0,
            icon: <div className="w-6 h-6 text-[#334E68]">📚</div>,
            trend: data?.growthRate?.citations || 0,
        },
        {
            title: 'Countries Reached',
            value: data?.uniqueCountries || 0,
            icon: <div className="w-6 h-6 text-[#334E68]">🌍</div>,
            trend: undefined,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
                <MetricsCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    icon={metric.icon}
                    trend={metric.trend}
                    loading={isLoading}
                />
            ))}
        </div>
    );
}
