import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Skeleton } from 'siesa-ui-kit';
import { useAuth } from '../../context/AuthContext';
import { getWarehouses } from '../../api/warehouseApi';

export const WarehouseList = () => {
  const { token } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => getWarehouses(token || null),
  });

  if (isPending) return <div className="p-4"><Skeleton className="h-64 w-full" /></div>;

  if (error) return <div className="p-4 text-red-500">Error loading warehouses: {error.message}</div>;

  const columns = [
    {
        header: 'Nombre', // Spanish UI
        accessorKey: 'name'
    },
    {
        header: 'Ubicación',
        accessorKey: 'location'
    },
    {
        header: 'Total Items',
        accessorKey: 'totalItems'
    },
    {
        header: 'Valor Total',
        accessorKey: 'totalValue',
        cell: (info: { getValue: () => unknown }) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(info.getValue() as number)
    },
  ];

  return (
    <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Centros de Distribución</h1>
        <Table
            data={data}
            columns={columns}
        />
    </div>
  );
};
