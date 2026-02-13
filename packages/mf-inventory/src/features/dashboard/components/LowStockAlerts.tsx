import { Table, Badge } from 'siesa-ui-kit';
import { DashboardAlert } from '../../../api/dashboardApi';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

interface LowStockAlertsProps {
  data: DashboardAlert[];
}

export const LowStockAlerts = ({ data }: LowStockAlertsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRowClick = (row: DashboardAlert) => {
    // Navigate to product detail
    // Assuming route /inventory/products/$productId based on conventions
    // Using simple imperative navigation or valid route path
    navigate({ to: `/inventory/products/${row.productId}` });
  };

  const columns = [
    { header: t('dashboard.alerts.columns.product'), accessor: 'productName' },
    { header: t('dashboard.alerts.columns.qty'), accessor: 'totalQuantity' },
    { header: t('dashboard.alerts.columns.reorderPt'), accessor: 'reorderPoint' },
    {
      header: t('dashboard.alerts.columns.status'),
      accessor: 'totalQuantity',
      render: (_: any, row: DashboardAlert) => {
        const isOutOfStock = row.totalQuantity === 0;
        return (
          <Badge color={isOutOfStock ? 'red' : 'yellow'}>
            {isOutOfStock ? t('dashboard.alerts.status.outOfStock') : t('dashboard.alerts.status.lowStock')}
          </Badge>
        );
      }
    }
  ];

  return (
      <Table
        title={t('dashboard.alerts.title')}
        columns={columns}
        data={data}
        onRowClick={handleRowClick}
        variant="striped"
        showShadow={true}
        emptyMessage={t('dashboard.alerts.empty')}
        fullWidth
      />
  );
};
