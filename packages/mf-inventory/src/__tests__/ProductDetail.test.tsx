import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductDetail from '../features/products/product-detail';
import { ProductStockStatus } from '../types/product';
import * as ReactQuery from '@tanstack/react-query';

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ productId: '123' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key
  }),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'mock-token' }),
}));

// Mock siesa-ui-kit components to simplify testing
vi.mock('siesa-ui-kit', () => ({
  DescriptionList: ({ term, details }: any) => <div data-testid="description-list">{term}: {details}</div>,
  Table: ({ columns, data, emptyMessage }: any) => (
    <div data-testid="table">
      {data.length === 0 ? <div>{emptyMessage}</div> : (
        <table>
          <thead>
            <tr>
              {columns.map((col: any) => <th key={col.header}>{col.header}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, i: number) => (
              <tr key={i}>
                {columns.map((col: any) => (
                  <td key={col.header}>
                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  ),
  Badge: ({ label, color }: any) => <span data-testid="badge" data-color={color}>{label}</span>,
  Button: ({ children }: any) => <button>{children}</button>,
}));

// Mock useQuery
vi.mock('@tanstack/react-query', () => {
    return {
        useQuery: vi.fn(),
    };
});

describe('ProductDetail Component', () => {
  const mockProduct = {
    id: '123',
    sku: 'SKU-001',
    name: 'Test Product',
    description: 'Test Description',
    category: 'Test Category',
    reorderPoint: 10,
    unitPrice: 99.99,
    totalCompanyStock: 100,
    stockStatus: ProductStockStatus.InStock,
    warehouseStock: [
      { warehouseId: 'w1', warehouseName: 'Warehouse A', quantity: 60, stockValue: 6000 },
      { warehouseId: 'w2', warehouseName: 'Warehouse B', quantity: 40, stockValue: 4000 },
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    (ReactQuery.useQuery as any).mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined
    });

    const { container } = render(<ProductDetail />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (ReactQuery.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined
    });

    render(<ProductDetail />);
    expect(screen.getByText('Product not found')).toBeInTheDocument();
  });

  it('renders product details correctly', () => {
    (ReactQuery.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockProduct
    });

    render(<ProductDetail />);

    // Header info
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();

    // Check DescriptionList items
    expect(screen.getByText(/SKU-001/)).toBeInTheDocument();
    expect(screen.getByText(/Test Category/)).toBeInTheDocument();
    expect(screen.getByText(/99.99/)).toBeInTheDocument(); // Price format might vary based on localeString in Node, but usually includes numbers properties
    expect(screen.getAllByText(/100/)[0]).toBeInTheDocument();

    // Check Badge
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('InStock');
    expect(badge).toHaveAttribute('data-color', 'green');

    // Check Table
    expect(screen.getByText('Warehouse A')).toBeInTheDocument();
    expect(screen.getByText('Warehouse B')).toBeInTheDocument();
    // Check custom render in table (currency)
    // Use regex to handle potential locale differences in number formatting (e.g., 6,000 vs 6.000 vs 6000)
    expect(screen.getByText(/\$6[.,]?000/)).toBeInTheDocument();
  });
});
