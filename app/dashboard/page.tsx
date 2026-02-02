'use client';

import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { WorldHeatMap } from '@/components/dashboard/WorldHeatMap';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-yellow-50">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#FFD900] rounded-lg flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-[#334E68]" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-[#334E68]">Analytics Dashboard</h1>
                                    <p className="text-xs text-slate-600">Real-time global impact metrics</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm text-slate-600">Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#334E68] mb-2">
                        UDSM Research Global Impact
                    </h2>
                    <p className="text-slate-600">
                        Track the worldwide reach and influence of University of Dar es Salaam publications
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="mb-8">
                    <MetricsGrid />
                </div>

                {/* World Heat Map */}
                <div className="mb-8">
                    <WorldHeatMap />
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
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

                    <div className="bg-gradient-to-br from-[#334E68] to-[#243B53] rounded-xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-3">🚀 System Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Backend APIs</span>
                                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Active</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Database</span>
                                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Connected</span>
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

                {/* Demo Notice */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                        <div className="text-2xl">⚠️</div>
                        <div>
                            <h4 className="font-semibold text-[#334E68] mb-1">Demo Mode</h4>
                            <p className="text-sm text-slate-600">
                                This dashboard is currently in demo mode. To see live data, you need to:
                            </p>
                            <ol className="mt-2 text-sm text-slate-600 list-decimal list-inside space-y-1">
                                <li>Push the database schema to Supabase (<code className="bg-yellow-100 px-1 rounded">pnpm drizzle-kit push</code>)</li>
                                <li>Seed the database with sample papers and analytics events</li>
                                <li>Configure authentication secrets in <code className="bg-yellow-100 px-1 rounded">.env.local</code></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
