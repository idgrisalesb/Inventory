import React, { memo } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { DescriptionList, Table, Badge, Button } from 'siesa-ui-kit';
import { getProductDetail } from '../../api/productApi';
import { ProductDetailDto, ProductStockStatus } from '../../types/product';
import { useAuth } from '../../context/AuthContext';

const getStatusColor = (status: ProductStockStatus) => {
    switch (status) {
        case ProductStockStatus.InStock: return 'green';
        case ProductStockStatus.LowStock: return 'yellow';
        case ProductStockStatus.OutOfStock: return 'red';
        default: return 'zinc';
    }
};

const ProductDetail = memo(() => {
    const { productId } = useParams({ from: '/products/$productId' });
    const { t } = useTranslation();
    const { token } = useAuth();

    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['products', productId],
        queryFn: () => getProductDetail(productId, token),
        enabled: !!productId && !!token
    });

    if (isLoading) {
        return (
            <div className="p-6 space-y-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    {t('error.productNotFound', 'Product not found')}
                </div>
                <div className="mt-4">
                    <Link to="/products">
                        <Button variant="outline">{t('common.back', 'Back')}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const warehouseColumns = [
        { header: t('products.warehouseName', 'Warehouse Name'), accessor: 'warehouseName' as const },
        { header: t('products.quantity', 'Quantity'), accessor: 'quantity' as const },
        {
            header: t('products.stockValue', 'Stock Value'),
            accessor: 'stockValue' as const,
            render: (val: number) => `$${val.toLocaleString()}`
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <Link to="/products">
                    <Button variant="secondary">{t('common.back', 'Back')}</Button>
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                 <h2 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">{t('products.details', 'Product Details')}</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <DescriptionList term="SKU" details={product.sku} />
                    <DescriptionList term={t('products.category', 'Category')} details={product.category} />
                    <DescriptionList term={t('products.unitPrice', 'Unit Price')} details={`$${product.unitPrice.toLocaleString()}`} />
                    <DescriptionList term={t('products.reorderPoint', 'Reorder Point')} details={product.reorderPoint.toString()} />
                    <DescriptionList term={t('products.totalStock', 'Total Stock')} details={product.totalCompanyStock.toString()} />

                    {/* Custom Status Row imitating DescriptionList style since details prop only accepts string */}
                    <div className="flex flex-col sm:flex-row justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                        <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">{t('products.status', 'Status')}</dt>
                        <dd className="text-sm text-gray-900">
                            <Badge label={product.stockStatus} color={getStatusColor(product.stockStatus)} />
                        </dd>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <DescriptionList term={t('products.description', 'Description')} details={product.description} />
                    </div>
                 </div>
            </div>

             <div className="bg-white p-4 rounded-lg shadow">
                 <h2 className="text-lg font-semibold mb-4 text-gray-900">{t('products.warehouseStock', 'Warehouse Stock')}</h2>
                 <Table
                    columns={warehouseColumns}
                    data={product.warehouseStock}
                    showShadow={false}
                    showBorder={true}
                    emptyMessage={t('dashboard.charts.noData', 'No data available')}
                 />
                 <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                    <div className="text-right">
                        <span className="text-sm text-gray-500 mr-2">{t('products.totalStock', 'Total Stock')}:</span>
                        <span className="text-lg font-bold text-gray-900">{product.totalCompanyStock}</span>
                    </div>
                 </div>
            </div>
        </div>
    );
});

export default ProductDetail;

