import React, { useMemo, useState, useEffect } from 'react';
import { Table, Badge, BadgeColor, Input, Select, Button, SortDirection } from 'siesa-ui-kit';
import { MagnifyingGlassIcon } from '../../components/icons/MagnifyingGlassIcon';
import { useProductList } from './hooks/useProductList';
import { useCategories } from './hooks/useCategories';
import { Product } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { useSearch, useNavigate } from '@tanstack/react-router';

const currencyFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });

const getStatusColor = (status: string): BadgeColor => {
    switch (status?.toLowerCase()) {
        case 'instock': return 'green';
        case 'lowstock': return 'yellow';
        case 'outofstock': return 'red';
        default: return 'zinc';
    }
};

const ProductList: React.FC = () => {
    const navigate = useNavigate({ from: '/products' });
    const searchParams = useSearch({ from: '/products' });
    const { page, pageSize, search, category, status, sortBy, sortDir } = searchParams;

    const [localSearch, setLocalSearch] = useState(search || '');
    const debouncedSearch = useDebounce(localSearch, 300);

    const { data, isLoading, isError, error } = useProductList({
        page,
        pageSize,
        search, // Query uses URL param
        category,
        status,
        sortBy,
        sortDir: sortDir === 'desc'
    });

    const { data: categories } = useCategories();

    // Sync URL search param with debounced input
    useEffect(() => {
        if (debouncedSearch !== search) {
            navigate({ search: (prev) => ({ ...prev, search: debouncedSearch, page: 1 }) });
        }
    }, [debouncedSearch, navigate, search]);

    // Update local input if URL changes (e.g. navigation)
    useEffect(() => {
        setLocalSearch(search || '');
    }, [search]);

    const handleClearFilters = () => {
        setLocalSearch('');
        navigate({ search: (prev) => ({ ...prev, category: undefined, status: undefined, search: '', page: 1 }) });
    };

    const handleSort = (column: string, direction: SortDirection) => {
        navigate({ search: (prev) => ({
            ...prev,
            sortBy: column,
            sortDir: direction === 'desc' ? 'desc' : 'asc'
        }) });
    };

    const setPage = (newPage: number) => {
        navigate({ search: (prev) => ({ ...prev, page: newPage }) });
    };

    const statusOptions = [
        { value: 'InStock', label: 'In Stock' },
        { value: 'LowStock', label: 'Low Stock' },
        { value: 'OutOfStock', label: 'Out of Stock' }
    ];

    const categoryOptions = categories?.map(c => ({ value: c, label: c })) || [];

    const columns = useMemo(() => [
        { header: 'SKU', accessor: 'sku' as keyof Product, sortable: true },
        { header: 'Name', accessor: 'name' as keyof Product, sortable: true },
        { header: 'Category', accessor: 'category' as keyof Product },
        { header: 'Total Quantity', accessor: 'totalQuantity' as keyof Product, sortable: true },
        {
            header: 'Unit Price',
            accessor: 'unitPrice' as keyof Product,
            sortable: true,
            render: (val: number) => currencyFormatter.format(val)
        },
        {
            header: 'Status',
            accessor: 'stockStatus' as keyof Product,
            render: (val: string) => (
                <Badge label={val} color={getStatusColor(val)} />
            )
        }
    ], []);

    if (isError) {
        return (
            <div className="p-4 text-red-600">
                <h2 className="text-xl font-bold mb-2">Error</h2>
                <p>Failed to load products: {(error as Error).message}</p>
            </div>
        );
    }

    return (
        <div className="p-4">
             <h1 className="text-2xl font-bold mb-4">Products</h1>

             <div className="flex gap-4 mb-4 items-end flex-wrap">
                 <div className="w-full md:w-1/3">
                     <Input
                         placeholder="Search by Name or SKU..."
                         value={localSearch}
                         onChange={(e) => setLocalSearch(e.target.value)}
                         leftIcon={<MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />}
                         fullWidth
                     />
                 </div>
                 <div className="w-full md:w-1/4">
                     <Select
                        placeholder="All Categories"
                        options={categoryOptions}
                        value={category}
                        onChange={(val) => navigate({ search: (prev) => ({ ...prev, category: val as string, page: 1 }) })}
                        fullWidth
                     />
                 </div>
                 <div className="w-full md:w-1/4">
                     <Select
                        placeholder="All Statuses"
                        options={statusOptions}
                        value={status}
                        onChange={(val) => navigate({ search: (prev) => ({ ...prev, status: val as string, page: 1 }) })}
                        fullWidth
                     />
                 </div>
                 <div className="pb-1">
                    <Button
                        type="outline-solid"
                        onClick={handleClearFilters}
                        size="base"
                    >
                        Clear Filters
                    </Button>
                 </div>
             </div>

             <Table
                data={data?.items || []}
                columns={columns}
                loading={isLoading}
                sortColumn={sortBy}
                sortDirection={sortDir}
                onSort={handleSort}
                pagination={{
                    currentPage: page,
                    totalPages: data?.totalPages || 0,
                    onPageChange: setPage,
                    previousLabel: 'Anterior',
                    nextLabel: 'Siguiente'
                }}
             />
        </div>
    );
};

export default ProductList;
