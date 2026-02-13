import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getProducts } from '../../../api/productApi';
import { useAuth } from '../../../context/AuthContext';

interface UseProductListOptions {
    initialPage?: number;
    initialPageSize?: number;
    search?: string;
}

export const useProductList = ({ initialPage = 1, initialPageSize = 20, search }: UseProductListOptions = {}) => {
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const { token } = useAuth();

    // Reset page to 1 when search term changes
    useEffect(() => {
        if (search !== undefined) {
            setPage(1);
        }
    }, [search]);

    const query = useQuery({
        queryKey: ['products', page, pageSize, search],
        queryFn: () => getProducts(page, pageSize, token, search),
        placeholderData: keepPreviousData,
    });

    return {
        ...query,
        page,
        setPage,
        pageSize,
        setPageSize
    };
};
