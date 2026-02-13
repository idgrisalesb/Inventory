// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import ProductList from '../ProductList';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as useProductListHook from '../hooks/useProductList';
import React from 'react';

// Mock hook
vi.mock('../hooks/useProductList', () => ({
    useProductList: vi.fn()
}));

const mockData = {
    items: [
        { id: '1', sku: 'SKU001', name: 'Product A', category: 'Category A', stockStatus: 'In Stock', totalQuantity: 100, unitPrice: 50.00 },
        { id: '2', sku: 'SKU002', name: 'Product B', category: 'Category B', stockStatus: 'Low Stock', totalQuantity: 5, unitPrice: 20.00 }
    ],
    totalCount: 2,
    totalPages: 2,
    hasNextPage: true,
    hasPreviousPage: false,
    pageNumber: 1,
    pageSize: 20
};

describe('ProductList Feature UI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders table with products and status badges', () => {
        (useProductListHook.useProductList as any).mockReturnValue({
            data: mockData,
            isLoading: false,
            page: 1,
            setPage: vi.fn(),
            pageSize: 20
        });

        render(<ProductList />);

        // Headers
        expect(screen.getByText('SKU')).toBeTruthy();
        expect(screen.getByText('Name')).toBeTruthy();
        expect(screen.getByText('Category')).toBeTruthy();
        expect(screen.getByText('Status')).toBeTruthy();

        // Data
        expect(screen.getByText('SKU001')).toBeTruthy();
        expect(screen.getByText('Product A')).toBeTruthy();
        expect(screen.getByText('In Stock')).toBeTruthy();

        expect(screen.getByText('SKU002')).toBeTruthy();
        expect(screen.getByText('Product B')).toBeTruthy();
        expect(screen.getByText('Low Stock')).toBeTruthy();
    });

    it('handles loading state', () => {
        (useProductListHook.useProductList as any).mockReturnValue({
            data: undefined,
            isLoading: true,
            page: 1,
            setPage: vi.fn()
        });

        render(<ProductList />);
        // Table component should handle loading internally (e.g. skeletons)
        // We assume it renders without crashing.
    });

    it('handles error state', () => {
        (useProductListHook.useProductList as any).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: new Error('API Failure'),
            page: 1,
            setPage: vi.fn()
        });

        render(<ProductList />);
        expect(screen.getByText('Error')).toBeTruthy();
        expect(screen.getByText(/Failed to load products: API Failure/i)).toBeTruthy();
    });

    it('wires up pagination', () => {
        const setPage = vi.fn();
        (useProductListHook.useProductList as any).mockReturnValue({
            data: { ...mockData, totalPages: 5 },
            isLoading: false,
            page: 1,
            setPage,
            pageSize: 20
        });

        render(<ProductList />);

        // siesa-ui-kit might render multiple elements with same text (e.g. mobile/desktop or responsive variants)
        // We try clicking the first visible one
        const nextButtons = screen.getAllByText('Siguiente');
        expect(nextButtons.length).toBeGreaterThan(0);

        fireEvent.click(nextButtons[0]);
        expect(setPage).toHaveBeenCalledWith(2);
    });

    it('renders search input', () => {
        (useProductListHook.useProductList as any).mockReturnValue({
            data: mockData,
            isLoading: false,
            page: 1,
            setPage: vi.fn(),
            pageSize: 20
        });

        render(<ProductList />);
        // siesa-ui-kit might render multiple inputs due to complex styling/accessibility
        const inputs = screen.getAllByPlaceholderText('Search by Name or SKU...');
        expect(inputs.length).toBeGreaterThan(0);
        expect(inputs[0]).toBeTruthy();
    });
});
