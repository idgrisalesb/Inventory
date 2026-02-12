import { Table, Badge } from 'siesa-ui-kit';
import { DashboardAlert } from '../../../api/dashboardApi';
import { useNavigate } from '@tanstack/react-router';

interface LowStockAlertsProps {
  data: DashboardAlert[];
}

export const LowStockAlerts = ({ data }: LowStockAlertsProps) => {
  const navigate = useNavigate();

  const handleRowClick = (row: DashboardAlert) => {
    // Navigate to product detail
    // Assuming route /inventory/products/$productId based on conventions
    // Using simple imperative navigation or valid route path
    navigate({ to: `/inventory/products/${row.productId}` });
  };

  const columns = [
    { header: 'Product', accessor: 'productName' },
    { header: 'Qty', accessor: 'totalQuantity' },
    { header: 'Reorder Pt', accessor: 'reorderPoint' },
    {
      header: 'Status',
      accessor: 'totalQuantity',
      render: (_: any, row: DashboardAlert) => {
        const isOutOfStock = row.totalQuantity === 0;
        return (
          <Badge color={isOutOfStock ? 'red' : 'yellow'}>
            {isOutOfStock ? 'Out of Stock' : 'Low Stock'}
          </Badge>
        );
      }
    }
  ];

  return (
      <Table
        title="Top Low Stock Alerts"
        columns={columns}
        data={data}
        onRowClick={handleRowClick}
        variant="striped"
        showShadow={true}
        emptyMessage="No alerts at this time"
        fullWidth
      />
  );
};
