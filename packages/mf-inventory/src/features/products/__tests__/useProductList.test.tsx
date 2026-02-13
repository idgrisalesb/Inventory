// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { useProductList } from '../hooks/useProductList';
import { getProducts } from '../../../api/productApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import * as AuthContext from '../../../context/AuthContext';
import React from 'react';

vi.mock('../../../api/productApi', () => ({
  getProducts: vi.fn(),
}));

const useAuthSpy = vi.spyOn(AuthContext, 'useAuth');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useProductList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        useAuthSpy.mockReturnValue({ token: 'test-token', setToken: vi.fn() });
    });

    it('fetches products with default pagination', async () => {
        const mockData = { items: [], totalPages: 1, totalCount: 0 };
        (getProducts as Mock).mockResolvedValue(mockData);

        const { result } = renderHook(() => useProductList(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getProducts).toHaveBeenCalledWith(1, 20, 'test-token', undefined, undefined, undefined, undefined, undefined);
    });

    it('updates page prop and refetches', async () => {
        const mockData = { items: [], totalPages: 1, totalCount: 0 };
        (getProducts as Mock).mockResolvedValue(mockData);

        const { result, rerender } = renderHook((props: any) => useProductList(props), { wrapper, initialProps: { page: 1 } });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Update props
        rerender({ page: 2 });

        await waitFor(() => {
            expect(result.current.page).toBe(2);
        });

        expect(getProducts).toHaveBeenCalledWith(2, 20, 'test-token', undefined, undefined, undefined, undefined, undefined);
    });

    it('fetches products with search term', async () => {
        const mockData = { items: [], totalPages: 1, totalCount: 0 };
        (getProducts as Mock).mockResolvedValue(mockData);

        const { result } = renderHook(() => useProductList({ search: 'Gadget' }), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getProducts).toHaveBeenCalledWith(1, 20, 'test-token', 'Gadget', undefined, undefined, undefined, undefined);
    });

    it('fetches products with category and status', async () => {
        const mockData = { items: [], totalPages: 1, totalCount: 0 };
        (getProducts as Mock).mockResolvedValue(mockData);

        const { result } = renderHook(() => useProductList({ category: 'Electronics', status: 'InStock' }), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getProducts).toHaveBeenCalledWith(1, 20, 'test-token', undefined, 'Electronics', 'InStock', undefined, undefined);
    });

     it('fetches products with sorting', async () => {
        const mockData = { items: [], totalPages: 1, totalCount: 0 };
        (getProducts as Mock).mockResolvedValue(mockData);

        const { result } = renderHook(() => useProductList({ sortBy: 'price', sortDir: true }), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getProducts).toHaveBeenCalledWith(1, 20, 'test-token', undefined, undefined, undefined, 'price', true);
    });
});
