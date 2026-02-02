'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    BarChart3,
    Settings,
    Menu,
    X,
    Globe,
    LogOut,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Papers', href: '/papers', icon: FileText },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile sidebar backdrop */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                <motion.aside
                    initial={{ x: -280 }}
                    animate={{ x: sidebarOpen ? 0 : -280 }}
                    className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 lg:translate-x-0 lg:static lg:z-0"
                >
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
                        <Link href="/dashboard" className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[#FFD900] rounded-lg flex items-center justify-center">
                                <span className="text-[#334E68] font-bold text-lg">U</span>
                            </div>
                            <span className="font-bold text-[#334E68]">UDSM Analytics</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-slate-600 hover:text-slate-900"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                    ${isActive
                                            ? 'bg-[#FFD900] text-[#334E68] font-semibold'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }
                  `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="border-t border-slate-200 p-4">
                        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-100 cursor-pointer">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">Admin User</p>
                                <p className="text-xs text-slate-500 truncate">admin@udsm.ac.tz</p>
                            </div>
                        </div>
                        <button className="w-full mt-2 flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </motion.aside>
            </AnimatePresence>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white border-b border-slate-200 backdrop-blur-sm bg-white/80">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-slate-600 hover:text-slate-900"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Breadcrumb */}
                        <div className="hidden lg:flex items-center space-x-2 text-sm">
                            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
                                Dashboard
                            </Link>
                            {pathname !== '/dashboard' && (
                                <>
                                    <span className="text-slate-400">/</span>
                                    <span className="text-slate-900 font-medium">
                                        {pathname.split('/').pop()?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Header actions */}
                        <div className="flex items-center space-x-4">
                            {/* Language switcher */}
                            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                                <Globe className="w-4 h-4 text-slate-600" />
                                <span className="text-sm text-slate-700">EN</span>
                            </button>

                            {/* Notifications badge */}
                            <div className="relative">
                                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                    <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1"></div>
                                    <BarChart3 className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
