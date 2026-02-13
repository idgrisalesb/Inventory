import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDashboardKpis } from './hooks/useDashboardKpis';
import { fetchCharts, fetchAlerts } from '../../api/dashboardApi';
import { KpiCard } from './components/KpiCard';
import { StockValueChart } from './components/StockValueChart';
import { LowStockAlerts } from './components/LowStockAlerts';
import { Alert, AlertDescription, AlertTitle } from 'siesa-ui-kit';

const Dashboard = memo(() => {
    const { t, i18n } = useTranslation();
    const { data: kpiData, isLoading: kpiLoading, error: kpiError } = useDashboardKpis();

    const { data: chartData, isLoading: chartLoading, error: chartError } = useQuery({
        queryKey: ['dashboard', 'charts'],
        queryFn: fetchCharts,
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    const { data: alertsData, isLoading: alertsLoading, error: alertsError } = useQuery({
        queryKey: ['dashboard', 'alerts'],
        queryFn: fetchAlerts,
        staleTime: 60 * 1000 // 1 minute
    });

    if (kpiError) {
        return (
            <Alert variant="destructive">
                <AlertTitle>{t('dashboard.errors.title')}</AlertTitle>
                <AlertDescription>{t('dashboard.errors.general')}</AlertDescription>
            </Alert>
        );
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(i18n.language || 'es-CO', {
            style: 'currency',
            currency: 'COP',
        }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    title={t('dashboard.kpi.totalSkus')}
                    value={kpiData?.totalSkus ?? 0}
                    isLoading={kpiLoading}
                />
                <KpiCard
                    title={t('dashboard.kpi.totalValue')}
                    value={kpiLoading ? 0 : formatCurrency(kpiData?.totalStockValue ?? 0)}
                    isLoading={kpiLoading}
                />
                <KpiCard
                    title={t('dashboard.kpi.lowStock')}
                    value={kpiData?.lowStockCount ?? 0}
                    isLoading={kpiLoading}
                />
                <KpiCard
                    title={t('dashboard.kpi.outOfStock')}
                    value={kpiData?.outOfStockCount ?? 0}
                    isLoading={kpiLoading}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                    {chartLoading ? (
                        <div className="h-[300px] flex items-center justify-center bg-white rounded-lg shadow">
                            <span className="text-gray-500">{t('dashboard.charts.loading')}</span>
                        </div>
                    ) : chartError ? (
                        <Alert variant="destructive">
                            <AlertTitle>{t('dashboard.errors.title')}</AlertTitle>
                            <AlertDescription>{t('dashboard.charts.error')}</AlertDescription>
                        </Alert>
                    ) : (
                        <StockValueChart data={chartData || []} />
                    )}
                </div>
                <div className="md:col-span-1">
                    {alertsLoading ? (
                        <div className="h-[300px] flex items-center justify-center bg-white rounded-lg shadow">
                            <span className="text-gray-500">{t('dashboard.alerts.loading')}</span>
                        </div>
                    ) : alertsError ? (
                        <Alert variant="destructive">
                            <AlertTitle>{t('dashboard.errors.title')}</AlertTitle>
                            <AlertDescription>{t('dashboard.alerts.error')}</AlertDescription>
                        </Alert>
                    ) : (
                        <LowStockAlerts data={alertsData || []} />
                    )}
                </div>
            </div>
        </div>
    );
});

export default Dashboard;
