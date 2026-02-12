import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDashboardKpis } from './hooks/useDashboardKpis';
import { fetchCharts, fetchAlerts } from '../../api/dashboardApi';
import { KpiCard } from './components/KpiCard';
import { StockValueChart } from './components/StockValueChart';
import { LowStockAlerts } from './components/LowStockAlerts';
import { Alert, AlertDescription, AlertTitle } from 'siesa-ui-kit';

const Dashboard = memo(() => {
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
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Error loading Dashboard. Please try again later.</AlertDescription>
            </Alert>
        );
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    title="Total SKUs"
                    value={kpiData?.totalSkus ?? 0}
                    isLoading={kpiLoading}
                />
                <KpiCard
                    title="Total Value"
                    value={kpiLoading ? 0 : formatCurrency(kpiData?.totalStockValue ?? 0)}
                    isLoading={kpiLoading}
                />
                <KpiCard
                    title="Low Stock"
                    value={kpiData?.lowStockCount ?? 0}
                    isLoading={kpiLoading}
                />
                <KpiCard
                    title="Out of Stock"
                    value={kpiData?.outOfStockCount ?? 0}
                    isLoading={kpiLoading}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                    {chartLoading ? (
                        <div className="h-[300px] flex items-center justify-center bg-white rounded-lg shadow">
                            <span className="text-gray-500">Loading Chart...</span>
                        </div>
                    ) : chartError ? (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>Failed to load chart data.</AlertDescription>
                        </Alert>
                    ) : (
                        <StockValueChart data={chartData || []} />
                    )}
                </div>
                <div className="md:col-span-1">
                    {alertsLoading ? (
                        <div className="h-[300px] flex items-center justify-center bg-white rounded-lg shadow">
                            <span className="text-gray-500">Loading Alerts...</span>
                        </div>
                    ) : alertsError ? (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>Failed to load alerts.</AlertDescription>
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
