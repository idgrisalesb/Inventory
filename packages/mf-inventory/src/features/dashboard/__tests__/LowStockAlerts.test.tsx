import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LowStockAlerts } from '../components/LowStockAlerts';
import { DashboardAlert } from '../../../api/dashboardApi';

const mockNavigate = vi.fn();

// Mock router
vi.mock('@tanstack/react-router', () => ({
    useNavigate: () => mockNavigate
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en-US' }
    }),
}));

// Mock siesa-ui-kit
// We need to implement just enough of Table to trigger the row click
vi.mock('siesa-ui-kit', () => ({
    Table: ({ data, onRowClick }: any) => (
        <div data-testid="table-mock">
            {data.map((row: any) => (
                <div
                    key={row.productId}
                    data-testid="table-row"
                    onClick={() => onRowClick(row)}
                >
                    {row.productName}
                </div>
            ))}
        </div>
    ),
    Badge: ({ children }: any) => <span>{children}</span>
}));

describe('LowStockAlerts', () => {
    it('renders correct number of rows and navigates on click', () => {
        const mockData: DashboardAlert[] = [
            { productId: '1', productName: 'P1', sku: 'S1', totalQuantity: 0, reorderPoint: 5 },
            { productId: '2', productName: 'P2', sku: 'S2', totalQuantity: 3, reorderPoint: 5 }
        ];

        render(<LowStockAlerts data={mockData} />);

        // Check row count
        const rows = screen.getAllByTestId('table-row');
        expect(rows).toHaveLength(2);

        // Test navigation
        fireEvent.click(rows[0]);
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/inventory/products/1' });
    });
});
