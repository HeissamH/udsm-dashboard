import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Eye, Download, Quote } from 'lucide-react';
import Link from 'next/link';

interface PaperCardProps {
    id: string;
    title: string;
    authors: string[];
    publicationDate: string;
    abstract: string;
    category: string;
    stats: {
        views: number;
        downloads: number;
        citations: number;
    };
}

export function PaperCard({
    id,
    title,
    authors,
    publicationDate,
    abstract,
    category,
    stats,
}: PaperCardProps) {
    return (
        <Link href={`/papers/${id}`}>
            <Card className="hover:border-[#FFD900] transition-colors cursor-pointer h-full">
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                        <Badge variant="warning" className="bg-[#FFD900]/10 text-[#334E68] hover:bg-[#FFD900]/20">
                            {category}
                        </Badge>
                        <span className="text-sm text-slate-500">{publicationDate}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#334E68] mb-2 line-clamp-2">
                        {title}
                    </h3>

                    <p className="text-sm text-slate-600 mb-2">
                        By <span className="font-medium">{authors.join(', ')}</span>
                    </p>

                    <p className="text-slate-500 text-sm line-clamp-3 mb-6">
                        {abstract}
                    </p>

                    <div className="flex items-center space-x-6 text-sm text-slate-500 border-t border-slate-100 pt-4 mt-auto">
                        <div className="flex items-center space-x-1.5">
                            <Eye className="w-4 h-4" />
                            <span>{stats.views}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <Download className="w-4 h-4" />
                            <span>{stats.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <Quote className="w-4 h-4" />
                            <span>{stats.citations}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
