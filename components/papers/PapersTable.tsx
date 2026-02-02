'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download } from 'lucide-react';
import Link from 'next/link';
import { formatCompactNumber } from '@/lib/utils/format';
import { format } from 'date-fns';

interface Paper {
    id: string;
    title: string;
    authors: string[];
    publishedAt: string;
    views: number;
    downloads: number;
    citations: number;
    journal: string;
}

export function PapersTable() {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'views', desc: true }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const { data, isLoading } = useQuery({
        queryKey: ['papers', 'top', pagination.pageIndex, pagination.pageSize],
        queryFn: async () => {
            const response = await fetch(
                `/api/analytics/top-papers?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`
            );
            if (!response.ok) throw new Error('Failed to fetch papers');
            return response.json();
        },
    });

    const columns = useMemo<ColumnDef<Paper>[]>(
        () => [
            {
                accessorKey: 'title',
                header: ({ column }) => (
                    <button
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="flex items-center space-x-2 hover:text-[#334E68]"
                    >
                        <span>Title</span>
                        <ArrowUpDown className="w-4 h-4" />
                    </button>
                ),
                cell: ({ row }) => (
                    <Link
                        href={`/papers/${row.original.id}`}
                        className="font-medium text-[#334E68] hover:text-[#FFD900] hover:underline line-clamp-2"
                    >
                        {row.original.title}
                    </Link>
                ),
            },
            {
                accessorKey: 'authors',
                header: 'Authors',
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600 line-clamp-1">
                        {row.original.authors.join(', ')}
                    </span>
                ),
            },
            {
                accessorKey: 'journal',
                header: 'Journal',
                cell: ({ row }) => (
                    <span className="text-sm text-slate-700">{row.original.journal}</span>
                ),
            },
            {
                accessorKey: 'publishedAt',
                header: ({ column }) => (
                    <button
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="flex items-center space-x-2 hover:text-[#334E68]"
                    >
                        <span>Published</span>
                        <ArrowUpDown className="w-4 h-4" />
                    </button>
                ),
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600">
                        {format(new Date(row.original.publishedAt), 'MMM dd, yyyy')}
                    </span>
                ),
            },
            {
                accessorKey: 'views',
                header: ({ column }) => (
                    <button
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="flex items-center space-x-2 hover:text-[#334E68]"
                    >
                        <span>Views</span>
                        <ArrowUpDown className="w-4 h-4" />
                    </button>
                ),
                cell: ({ row }) => (
                    <span className="font-semibold text-blue-600">
                        {formatCompactNumber(row.original.views)}
                    </span>
                ),
            },
            {
                accessorKey: 'downloads',
                header: ({ column }) => (
                    <button
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="flex items-center space-x-2 hover:text-[#334E68]"
                    >
                        <span>Downloads</span>
                        <ArrowUpDown className="w-4 h-4" />
                    </button>
                ),
                cell: ({ row }) => (
                    <span className="font-semibold text-green-600">
                        {formatCompactNumber(row.original.downloads)}
                    </span>
                ),
            },
            {
                accessorKey: 'citations',
                header: ({ column }) => (
                    <button
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="flex items-center space-x-2 hover:text-[#334E68]"
                    >
                        <span>Citations</span>
                        <ArrowUpDown className="w-4 h-4" />
                    </button>
                ),
                cell: ({ row }) => (
                    <span className="font-semibold text-[#FFD900]">
                        {formatCompactNumber(row.original.citations)}
                    </span>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: data?.papers || [],
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: data?.totalPages || 0,
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Top Performing Papers</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">
                            Most viewed and cited research publications
                        </p>
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-[#334E68] text-white rounded-lg hover:bg-[#243B53] transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Export CSV</span>
                    </button>
                </div>

                {/* Search bar */}
                <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search papers by title, authors, or journal..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD900] focus:border-transparent"
                    />
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id} className="border-b border-slate-200">
                                            {headerGroup.headers.map((header) => (
                                                <th
                                                    key={header.id}
                                                    className="px-4 py-3 text-left text-sm font-semibold text-slate-700"
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody>
                                    {table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-4 py-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-slate-600">
                                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                    data?.total || 0
                                )}{' '}
                                of {data?.total || 0} papers
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
