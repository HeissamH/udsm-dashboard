'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { WorldHeatMap } from '@/components/dashboard/WorldHeatMap';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { PapersTable } from '@/components/papers/PapersTable';

export default function DashboardPage() {
    return (
        <DashboardLayout>
            {/* Page Title */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#334E68] mb-2">
                    Overview
                </h1>
                <p className="text-slate-600">
                    Track the worldwide reach and influence of University of Dar es Salaam publications
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="mb-8">
                <MetricsGrid />
            </div>

            {/* Time Series Chart */}
            <div className="mb-8">
                <TimeSeriesChart
                    title="Engagement Trends"
                    description="Track views, downloads, and citations over time"
                    defaultRange="30d"
                    defaultType="line"
                />
            </div>

            {/* World Heat Map */}
            <div className="mb-8">
                <WorldHeatMap />
            </div>

            {/* Top Papers Table */}
            <div className="mb-8">
                <PapersTable />
            </div>

            {/* Additional Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-[#334E68] mb-3">📊 About This Dashboard</h3>
                    <p className="text-sm text-slate-600 mb-4">
                        This dashboard provides real-time analytics on the global visibility and impact of UDSM research publications.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li>✓ Live tracking of views, downloads, and citations</li>
                        <li>✓ Geographic distribution across 150+ countries</li>
                        <li>✓ Privacy-preserving analytics (IP hashing)</li>
                        <li>✓ Updates every 30 seconds</li>
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-[#334E68] to-[#243B53] rounded-xl p-6 text-white shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">🚀 System Status</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Backend APIs</span>
                            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Active</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Database</span>
                            <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Setup Required</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Geolocation Service</span>
                            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Online</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Real-time Updates</span>
                            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Enabled</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Setup Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                    <div className="text-2xl">💡</div>
                    <div>
                        <h4 className="font-semibold text-[#334E68] mb-1">Next Steps</h4>
                        <p className="text-sm text-slate-600 mb-2">
                            To see live data in this dashboard, complete the following setup:
                        </p>
                        <ol className="text-sm text-slate-600 list-decimal list-inside space-y-1">
                            <li>Configure Supabase connection in <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
                            <li>Push database schema: <code className="bg-blue-100 px-1 rounded">pnpm drizzle-kit push</code></li>
                            <li>Seed sample data: <code className="bg-blue-100 px-1 rounded">pnpm db:seed</code></li>
                            <li>Set up authentication with NextAuth.js</li>
                        </ol>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
