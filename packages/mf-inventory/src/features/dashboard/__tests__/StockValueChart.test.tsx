import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StockValueChart } from '../components/StockValueChart';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'dashboard.charts.stockValue': 'Stock Value by Category',
                'dashboard.charts.noData': 'No data available',
            };
            return translations[key] || key;
        },
        i18n: { language: 'en-US' }
    }),
}));

// Mock Recharts
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    PieChart: ({ children }: any) => <div>PieChart {children}</div>,
    Pie: ({ data }: any) => <div>Pie Data: {data.length}</div>,
    Cell: () => null,
    Tooltip: () => null
}));

describe('StockValueChart', () => {
    it('renders chart with data', () => {
        const mockData = [{ categoryName: 'Cat1', totalValue: 100, percentage: 50 }];
        render(<StockValueChart data={mockData} />);
        expect(screen.getByText('Stock Value by Category')).toBeInTheDocument();
        expect(screen.getByText('Pie Data: 1')).toBeInTheDocument();
    });

    it('renders no data message when empty', () => {
        render(<StockValueChart data={[]} />);
        // Checking for English text as implemented
        expect(screen.getByText('No data available')).toBeInTheDocument();
    });
});
