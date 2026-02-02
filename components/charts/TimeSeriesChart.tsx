'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { format, subDays, subMonths, subYears } from 'date-fns';

type DateRange = '7d' | '30d' | '90d' | '1y' | 'all';
type ChartType = 'line' | 'area' | 'bar';

interface TimeSeriesChartProps {
    title: string;
    description?: string;
    defaultRange?: DateRange;
    defaultType?: ChartType;
}

const dateRanges: { value: DateRange; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'all', label: 'All Time' },
];

const chartTypes: { value: ChartType; label: string }[] = [
    { value: 'line', label: 'Line' },
    { value: 'area', label: 'Area' },
    { value: 'bar', label: 'Bar' },
];

export function TimeSeriesChart({
    title,
    description,
    defaultRange = '30d',
    defaultType = 'line',
}: TimeSeriesChartProps) {
    const [dateRange, setDateRange] = useState<DateRange>(defaultRange);
    const [chartType, setChartType] = useState<ChartType>(defaultType);

    const { data, isLoading } = useQuery({
        queryKey: ['analytics', 'timeseries', dateRange],
        queryFn: async () => {
            const response = await fetch(`/api/analytics/timeseries?range=${dateRange}`);
            if (!response.ok) throw new Error('Failed to fetch time series data');
            return response.json();
        },
        refetchInterval: 60000, // Refetch every minute
    });

    const chartData = useMemo(() => {
        if (!data?.timeSeries) return [];

        return data.timeSeries.map((item: any) => ({
            date: format(new Date(item.date), 'MMM dd'),
            views: item.views || 0,
            downloads: item.downloads || 0,
            citations: item.citations || 0,
        }));
    }, [data]);

    const renderChart = () => {
        const commonProps = {
            data: chartData,
            margin: { top: 10, right: 30, left: 0, bottom: 0 },
        };

        switch (chartType) {
            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCitations" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FFD900" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#FFD900" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                        <YAxis stroke="#64748B" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="views"
                            stroke="#3B82F6"
                            fillOpacity={1}
                            fill="url(#colorViews)"
                            name="Views"
                        />
                        <Area
                            type="monotone"
                            dataKey="downloads"
                            stroke="#10B981"
                            fillOpacity={1}
                            fill="url(#colorDownloads)"
                            name="Downloads"
                        />
                        <Area
                            type="monotone"
                            dataKey="citations"
                            stroke="#FFD900"
                            fillOpacity={1}
                            fill="url(#colorCitations)"
                            name="Citations"
                        />
                    </AreaChart>
                );

            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                        <YAxis stroke="#64748B" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        <Legend />
                        <Bar dataKey="views" fill="#3B82F6" name="Views" />
                        <Bar dataKey="downloads" fill="#10B981" name="Downloads" />
                        <Bar dataKey="citations" fill="#FFD900" name="Citations" />
                    </BarChart>
                );

            default: // line
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                        <YAxis stroke="#64748B" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="views"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                            name="Views"
                        />
                        <Line
                            type="monotone"
                            dataKey="downloads"
                            stroke="#10B981"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                            name="Downloads"
                        />
                        <Line
                            type="monotone"
                            dataKey="citations"
                            stroke="#FFD900"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                            name="Citations"
                        />
                    </LineChart>
                );
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        {description && (
                            <p className="text-sm text-slate-600 mt-1">{description}</p>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Chart type selector */}
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            {chartTypes.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => setChartType(type.value)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${chartType === type.value
                                            ? 'bg-white text-[#334E68] shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {/* Date range selector */}
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            {dateRanges.map((range) => (
                                <button
                                    key={range.value}
                                    onClick={() => setDateRange(range.value)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${dateRange === range.value
                                            ? 'bg-white text-[#334E68] shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-80 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">
                        <p className="text-slate-500">Loading chart data...</p>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="h-80 flex items-center justify-center">
                        <p className="text-slate-500">No data available for this period</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                        {renderChart()}
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
