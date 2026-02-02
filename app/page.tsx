'use client';

import { ArrowRight, Globe, BarChart3, Download, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-yellow-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#FFD900] rounded-lg flex items-center justify-center">
                <span className="text-[#334E68] font-bold text-xl">U</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#334E68]">UDSM Journal Analytics</h1>
                <p className="text-xs text-slate-600">Global Impact Dashboard</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/papers" className="text-slate-600 hover:text-[#334E68] transition-colors">
                Papers
              </Link>
              <Link href="/dashboard" className="text-slate-600 hover:text-[#334E68] transition-colors">
                Dashboard
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-[#FFD900] text-[#334E68] rounded-lg font-semibold hover:bg-[#FACC15] transition-colors"
              >
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-[#FFD900]/10 border border-[#FFD900]/30 rounded-full">
            <span className="text-[#334E68] font-semibold text-sm">🚀 Real-time Analytics System</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#334E68] mb-6">
            UDSM Research
            <br />
            <span className="text-[#FFD900]">Global Impact</span> Dashboard
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Track, visualize, and evidence the global visibility of University of Dar es Salaam research publications in real-time.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-[#334E68] text-white rounded-lg font-semibold hover:bg-[#243B53] transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/papers"
              className="px-8 py-4 border-2 border-[#334E68] text-[#334E68] rounded-lg font-semibold hover:bg-[#334E68] hover:text-white transition-all"
            >
              Browse Papers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Globe, label: 'Countries Reached', value: '150+', color: 'bg-blue-500' },
            { icon: BarChart3, label: 'Total Views', value: '1.2M+', color: 'bg-green-500' },
            { icon: Download, label: 'Downloads', value: '450K+', color: 'bg-purple-500' },
            { icon: MapPin, label: 'Institutions', value: '5,000+', color: 'bg-orange-500' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-[#334E68] mb-1">{stat.value}</p>
              <p className="text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#334E68] mb-4">Powerful Analytics Features</h2>
          <p className="text-xl text-slate-600">Everything you need to track global research impact</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Interactive World Map',
              description: 'Visualize where your research is being read globally with real-time heat maps.',
              icon: '🗺️',
            },
            {
              title: 'Live Metrics',
              description: 'Track views, downloads, and citations as they happen with dynamic counters.',
              icon: '📊',
            },
            {
              title: 'Geographic Insights',
              description: 'Understand which countries and regions engage most with your research.',
              icon: '🌍',
            },
            {
              title: 'Time-Series Analysis',
              description: 'Identify trends and patterns in research engagement over time.',
              icon: '📈',
            },
            {
              title: 'Top Papers Ranking',
              description: 'Discover which publications are making the biggest impact worldwide.',
              icon: '🏆',
            },
            {
              title: 'Multilingual Support',
              description: 'Full support for English and Kiswahili languages.',
              icon: '🌐',
            },
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:border-[#FFD900] transition-all">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-[#334E68] mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Implementation Status */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-[#334E68] to-[#243B53] rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">🚧 Implementation Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#FFD900]">✅ Completed</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Complete database schema (5 tables)</li>
                <li>✓ Geolocation service with caching</li>
                <li>✓ Analytics tracking API</li>
                <li>✓ Aggregation APIs (overview, geographic, top papers)</li>
                <li>✓ Internationalization (English/Kiswahili)</li>
                <li>✓ UDSM branding & theme</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#FFD900]">🚧 In Progress</h3>
              <ul className="space-y-2 text-sm">
                <li>⏳ Dashboard UI components</li>
                <li>⏳ World heat map visualization</li>
                <li>⏳ Authentication system</li>
                <li>⏳ Demo journal module</li>
                <li>⏳ Middleware implementation</li>
                <li>⏳ Deployment setup</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Overall Progress</p>
                <p className="text-2xl font-bold">~40% Complete</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80">Backend Infrastructure</p>
                <p className="text-2xl font-bold text-[#FFD900]">100%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-[#FFD900] rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-[#334E68] mb-4">
            Ready to Showcase UDSM's Global Impact?
          </h2>
          <p className="text-xl text-[#334E68]/80 mb-8">
            Join us in evidencing the worldwide reach of UDSM research
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-[#334E68] text-white rounded-lg font-semibold hover:bg-[#243B53] transition-all transform hover:scale-105"
          >
            <span>Explore the Dashboard</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-600 text-sm">
              © 2026 University of Dar es Salaam. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-600 hover:text-[#334E68] text-sm">Privacy</a>
              <a href="#" className="text-slate-600 hover:text-[#334E68] text-sm">Terms</a>
              <a href="#" className="text-slate-600 hover:text-[#334E68] text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
