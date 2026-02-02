'use client';

import { useState } from 'react';
import { PaperCard } from '@/components/papers/PaperCard';
import { SearchBar } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';
import { MOCK_PAPERS } from '@/lib/db/mock-data';

export default function PapersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = Array.from(new Set(MOCK_PAPERS.map(p => p.category)));

    const filteredPapers = MOCK_PAPERS.filter(paper => {
        const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paper.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory ? paper.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                            <h1 className="text-xl font-bold text-[#334E68]">Browse Papers</h1>
                        </div>
                        <div className="text-sm text-slate-500">
                            Showing {filteredPapers.length} publications
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Search papers by title or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        <Button
                            variant={selectedCategory === null ? 'primary' : 'outline'}
                            onClick={() => setSelectedCategory(null)}
                            size="sm"
                        >
                            All
                        </Button>
                        {categories.map(category => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? 'primary' : 'outline'}
                                onClick={() => setSelectedCategory(category)}
                                size="sm"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Papers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPapers.map(paper => (
                        <PaperCard
                            key={paper.id}
                            id={paper.id}
                            title={paper.title}
                            authors={paper.authors}
                            publicationDate={paper.publicationDate}
                            abstract={paper.abstract}
                            category={paper.category}
                            stats={paper.stats}
                        />
                    ))}
                </div>

                {filteredPapers.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">No papers found matching your criteria.</p>
                        <Button
                            variant="ghost"
                            className="mt-4"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory(null);
                            }}
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
