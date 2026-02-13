import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '../Dashboard';
import * as dashboardApi from '../../../api/dashboardApi';

// Mock API
vi.mock('../../../api/dashboardApi');

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'dashboard.kpi.totalSkus': 'Total SKUs',
                'dashboard.kpi.totalValue': 'Total Value',
                'dashboard.kpi.lowStock': 'Low Stock',
                'dashboard.kpi.outOfStock': 'Out of Stock',
                'dashboard.charts.stockValue': 'Stock Value by Category',
                'dashboard.charts.noData': 'No data available',
                'dashboard.alerts.title': 'Top Low Stock Alerts',
                'dashboard.alerts.empty': 'No alerts at this time',
                'dashboard.charts.loading': 'Loading Chart...',
                'dashboard.alerts.loading': 'Loading Alerts...',
                'dashboard.errors.title': 'Error',
                'dashboard.errors.general': 'Error loading Dashboard. Please try again later.',
                'dashboard.charts.error': 'Failed to load chart data.',
                'dashboard.alerts.error': 'Failed to load alerts.',
                'dashboard.alerts.columns.product': 'Product',
                'dashboard.alerts.columns.qty': 'Qty',
                'dashboard.alerts.columns.reorderPt': 'Reorder Pt',
                'dashboard.alerts.columns.status': 'Status',
                'dashboard.alerts.status.outOfStock': 'Out of Stock',
                'dashboard.alerts.status.lowStock': 'Low Stock'
            };
            return translations[key] || key;
        },
        i18n: {
            language: 'en-US',
            changeLanguage: vi.fn(),
        }
    }),
}));

// Mock siesa-ui-kit
vi.mock('siesa-ui-kit', () => ({
    Card: ({ children }: any) => <div>{children}</div>,
    CardHeader: ({ children }: any) => <div>{children}</div>,
    CardTitle: ({ children }: any) => <div>{children}</div>,
    CardContent: ({ children }: any) => <div>{children}</div>,
    Alert: ({ children }: any) => <div data-testid="alert">{children}</div>,
    AlertTitle: ({ children }: any) => <div>{children}</div>,
    AlertDescription: ({ children }: any) => <div>{children}</div>,
    Table: ({ title }: any) => <div data-testid="table">{title}</div>,
    Badge: ({ children }: any) => <div>{children}</div>,
    Skeleton: () => <div data-testid="skeleton">Skeleton</div>
}));

// Mock Recharts to avoid SVG issues
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    PieChart: ({ children }: any) => <div>{children}</div>,
    Pie: () => <div>Pie</div>,
    Cell: () => <div>Cell</div>,
    Tooltip: () => <div>Tooltip</div>
}));

// Mock Router
vi.mock('@tanstack/react-router', () => ({
    useNavigate: () => vi.fn(),
}));

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mocks
        vi.mocked(dashboardApi.fetchKpis).mockResolvedValue({ totalSkus: 0, totalStockValue: 0, lowStockCount: 0, outOfStockCount: 0 });
        vi.mocked(dashboardApi.fetchCharts).mockResolvedValue([]);
        vi.mocked(dashboardApi.fetchAlerts).mockResolvedValue([]);
    });

    it('shows skeletons while loading', () => {
        // Return a pending promise to simulate loading
        vi.mocked(dashboardApi.fetchKpis).mockReturnValue(new Promise(() => {}));
        vi.mocked(dashboardApi.fetchCharts).mockReturnValue(new Promise(() => {}));
        vi.mocked(dashboardApi.fetchAlerts).mockReturnValue(new Promise(() => {}));

        render(
            <QueryClientProvider client={createTestQueryClient()}>
                <Dashboard />
            </QueryClientProvider>
        );

        // Expect skeletons for KPIs
        // Note: Chart/Alert loading states render explicit "Loading..." texts, not skeletons in current implementation
        // Check finding by testid skeleton which is used in KpiCard
        const skeletons = screen.getAllByTestId('skeleton');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders KPIs correctly after successful fetch', async () => {
        const mockData = {
            totalSkus: 42,
            totalStockValue: 12500.50,
            lowStockCount: 5,
            outOfStockCount: 2
        };

        vi.mocked(dashboardApi.fetchKpis).mockResolvedValue(mockData);

        render(
            <QueryClientProvider client={createTestQueryClient()}>
                <Dashboard />
            </QueryClientProvider>
        );

        // Check if values appear
        expect(await screen.findByText('42')).toBeInTheDocument(); // SKUs
        // Currency format check (regex for simple currency)
        // With COP currency hardcoded, it should contain COP
        expect(await screen.findByText(/COP/)).toBeInTheDocument();
        expect(await screen.findByText(/12,500\.50/)).toBeInTheDocument();
        expect(await screen.findByText('5')).toBeInTheDocument(); // Low Stock
        expect(await screen.findByText('2')).toBeInTheDocument(); // Out of Stock
    });

    it('renders charts and alerts correctly', async () => {
         const mockCharts = [{ categoryName: 'Elec', totalValue: 1000, percentage: 80 }];
         const mockAlerts = [{ productId: '1', productName: 'P1', sku: 'SKU1', totalQuantity: 0, reorderPoint: 5 }];

         vi.mocked(dashboardApi.fetchCharts).mockResolvedValue(mockCharts);
         vi.mocked(dashboardApi.fetchAlerts).mockResolvedValue(mockAlerts);

         render(
             <QueryClientProvider client={createTestQueryClient()}>
                 <Dashboard />
             </QueryClientProvider>
         );

         expect(await screen.findByText('Stock Value by Category')).toBeInTheDocument();
         expect(await screen.findByText('Top Low Stock Alerts')).toBeInTheDocument();
    });
});
