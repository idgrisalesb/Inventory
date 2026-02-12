import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LowStockAlerts } from '../components/LowStockAlerts';
import { DashboardAlert } from '../../../api/dashboardApi';

// Mock siesa-ui-kit
vi.mock('siesa-ui-kit', () => ({
    Table: ({ data }: any) => <div data-testid="table-mock">Rows: {data.length}</div>,
    Badge: ({ children }: any) => <span>{children}</span>
}));

// Mock router
vi.mock('@tanstack/react-router', () => ({
    useNavigate: () => vi.fn()
}));

describe('LowStockAlerts', () => {
    it('renders correct number of rows', () => {
        const mockData: DashboardAlert[] = [
            { productId: '1', productName: 'P1', sku: 'S1', totalQuantity: 0, reorderPoint: 5 },
            { productId: '2', productName: 'P2', sku: 'S2', totalQuantity: 3, reorderPoint: 5 }
        ];

        render(<LowStockAlerts data={mockData} />);
        expect(screen.getByTestId('table-mock')).toHaveTextContent('Rows: 2');
    });
});
