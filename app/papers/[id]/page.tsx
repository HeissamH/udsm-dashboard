'use client';

import { use } from 'react';
import { MOCK_PAPERS } from '@/lib/db/mock-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Download, Share2, Quote, Eye, Calendar, User } from 'lucide-react';
import Link from 'next/link';

export default function PaperDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const paper = MOCK_PAPERS.find(p => p.id === id);

    if (!paper) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#334E68] mb-2">Paper Not Found</h1>
                    <p className="text-slate-600 mb-6">The requested publication could not be found.</p>
                    <Link href="/papers">
                        <Button>Back to Papers</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <Link href="/papers" className="inline-block mb-6">
                        <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent hover:text-[#FFD900]">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Browse
                        </Button>
                    </Link>

                    <Badge variant="warning" className="bg-[#FFD900]/10 text-[#334E68] mb-4">
                        {paper.category}
                    </Badge>

                    <h1 className="text-3xl md:text-4xl font-bold text-[#334E68] mb-6 leading-tight">
                        {paper.title}
                    </h1>

                    <div className="flex flex-wrap gap-6 text-slate-600">
                        <div className="flex items-center">
                            <User className="w-5 h-5 mr-2 text-[#FFD900]" />
                            <span className="font-medium">{paper.authors.join(', ')}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-[#FFD900]" />
                            <span>{paper.publicationDate}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold mr-2">Journal:</span>
                            <span>{paper.journalName}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Content */}
                    <div className="md:col-span-2 space-y-8">
                        <section className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                            <h2 className="text-xl font-bold text-[#334E68] mb-4">Abstract</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {paper.abstract}
                            </p>
                        </section>

                        <section className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                            <h2 className="text-xl font-bold text-[#334E68] mb-4">Citation</h2>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-sm text-slate-600">
                                {paper.authors[0]} et al. ({paper.publicationDate.split('-')[0]}). "{paper.title}". {paper.journalName}.
                            </div>
                            <Button variant="ghost" className="mt-2 text-sm">
                                <Quote className="w-4 h-4 mr-2" />
                                Copy Citation
                            </Button>
                        </section>
                    </div>

                    {/* Right Column - Actions & Stats */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 sticky top-8">
                            <Button className="w-full mb-3" size="lg">
                                <Download className="w-5 h-5 mr-2" />
                                Download PDF
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Share2 className="w-5 h-5 mr-2" />
                                Share
                            </Button>

                            <div className="mt-8 space-y-4">
                                <h3 className="font-semibold text-[#334E68] border-b border-slate-100 pb-2">
                                    Impact Metrics
                                </h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 flex items-center">
                                        <Eye className="w-4 h-4 mr-2" /> Views
                                    </span>
                                    <span className="font-bold text-[#334E68]">{paper.stats.views}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 flex items-center">
                                        <Download className="w-4 h-4 mr-2" /> Downloads
                                    </span>
                                    <span className="font-bold text-[#334E68]">{paper.stats.downloads}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 flex items-center">
                                        <Quote className="w-4 h-4 mr-2" /> Citations
                                    </span>
                                    <span className="font-bold text-[#334E68]">{paper.stats.citations}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
