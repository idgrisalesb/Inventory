import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Skeleton } from 'siesa-ui-kit';
import { useAuth } from '../../context/AuthContext';
import { getWarehouses } from '../../api/warehouseApi';
import { useTranslation } from 'react-i18next';

export const WarehouseList = () => {
  const { token } = useAuth();
  const { t, i18n } = useTranslation();

  const { isPending, error, data } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => getWarehouses(token || null),
  });

  if (isPending) return <div className="p-4"><Skeleton className="h-64 w-full" /></div>;

  if (error) return <div className="p-4 text-red-500">{t('warehouses.error', { error: error.message })}</div>;

  const columns = [
    {
        header: t('warehouses.columns.name'),
        accessorKey: 'name'
    },
    {
        header: t('warehouses.columns.location'),
        accessorKey: 'location'
    },
    {
        header: t('warehouses.columns.totalItems'),
        accessorKey: 'totalItems'
    },
    {
        header: t('warehouses.columns.totalValue'),
        accessorKey: 'totalValue',
        cell: (info: { getValue: () => unknown }) => new Intl.NumberFormat(i18n.language || 'es-CO', { style: 'currency', currency: 'COP' }).format(info.getValue() as number)
    },
  ];

  return (
    <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">{t('warehouses.title')}</h1>
        <Table
            data={data}
            columns={columns}
        />
    </div>
  );
};
