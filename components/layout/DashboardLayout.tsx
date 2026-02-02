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
                    className="fixed inset-y-0 left-0 z-50 w-64 bg-primary border-r border-blue-800 lg:translate-x-0 lg:static lg:z-0 shadow-xl"
                >
                    {/* Logo */}
                    <div className="flex items-center space-x-3 h-20 px-6 border-b border-blue-800/50 bg-black/10">
                        <Link href="/dashboard" className="flex items-center space-x-3 w-full">
                            <div className="relative w-10 h-10 flex-shrink-0 bg-white p-0.5 rounded-lg shadow-sm">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/en/thumb/8/87/University_of_Dar_es_Salaam_Logo.png/220px-University_of_Dar_es_Salaam_Logo.png"
                                    alt="UDSM Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-white text-lg leading-tight">UDSM</span>
                                <span className="text-[10px] text-blue-200 uppercase tracking-wider font-medium">Digital Commons</span>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-blue-200 hover:text-white"
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
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium
                    ${isActive
                                            ? 'bg-secondary text-primary shadow-md transform scale-[1.02]'
                                            : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                        }
                  `}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-blue-300'}`} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="border-t border-blue-800/50 p-4 bg-black/10">
                        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20 group-hover:border-secondary/50 transition-colors">
                                <User className="w-5 h-5 text-blue-100 group-hover:text-secondary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">Admin User</p>
                                <p className="text-xs text-blue-300 truncate group-hover:text-blue-200">admin@udsm.ac.tz</p>
                            </div>
                        </div>
                        <button className="w-full mt-2 flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-300 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm">
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
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
