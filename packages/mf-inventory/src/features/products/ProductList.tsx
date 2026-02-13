import React, { useMemo, useState } from 'react';
import { Table, Badge, BadgeColor, Input } from 'siesa-ui-kit';
import { MagnifyingGlassIcon } from '../../components/icons/MagnifyingGlassIcon';
import { useProductList } from './hooks/useProductList';
import { Product } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

const currencyFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });

const getStatusColor = (status: string): BadgeColor => {
    switch (status?.toLowerCase()) {
        case 'in stock': return 'green';
        case 'low stock': return 'yellow';
        case 'out of stock': return 'red';
        default: return 'zinc';
    }
};

const ProductList: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);
    const { data, isLoading, isError, error, page, setPage } = useProductList({ search: debouncedSearch });

    const columns = useMemo(() => [
        { header: 'SKU', accessor: 'sku' as keyof Product },
        { header: 'Name', accessor: 'name' as keyof Product },
        { header: 'Category', accessor: 'category' as keyof Product },
        { header: 'Total Quantity', accessor: 'totalQuantity' as keyof Product },
        {
            header: 'Unit Price',
            accessor: 'unitPrice' as keyof Product,
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
             <div className="mb-4 max-w-md">
                 <Input
                     placeholder="Search by Name or SKU..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     leftIcon={<MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />}
                     fullWidth
                 />
             </div>
             <Table
                data={data?.items || []}
                columns={columns}
                loading={isLoading}
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
