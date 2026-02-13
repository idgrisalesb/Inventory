// @vitest-environment jsdom
import { renderHook, waitFor, act } from '@testing-library/react';
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

        expect(getProducts).toHaveBeenCalledWith(1, 20, 'test-token', undefined);
    });

    it('updates page state and refetches', async () => {
        const mockData = { items: [], totalPages: 1, totalCount: 0 };
        (getProducts as Mock).mockResolvedValue(mockData);

        const { result } = renderHook(() => useProductList(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => {
            result.current.setPage(2);
        });

        await waitFor(() => {
            expect(result.current.page).toBe(2);
        });
        // The first call was for page 1, verify the second call
        expect(getProducts).toHaveBeenCalledWith(2, 20, 'test-token', undefined);
    });

    it('fetches products with search term', async () => {
        const mockData = { items: [], totalPages: 1, totalCount: 0 };
        (getProducts as Mock).mockResolvedValue(mockData);

        // @ts-ignore - search param not implemented yet
        const { result } = renderHook(() => useProductList({ search: 'Gadget' }), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getProducts).toHaveBeenCalledWith(1, 20, 'test-token', 'Gadget');
    });
});
