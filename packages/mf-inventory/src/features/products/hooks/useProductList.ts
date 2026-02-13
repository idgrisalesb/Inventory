import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getProducts } from '../../../api/productApi';
import { useAuth } from '../../../context/AuthContext';

interface UseProductListOptions {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string | null;
    status?: string | null;
    sortBy?: string | null;
    sortDir?: boolean | null;
}

export const useProductList = ({ page = 1, pageSize = 20, search, category, status, sortBy, sortDir }: UseProductListOptions = {}) => {
    const { token } = useAuth();

    const query = useQuery({
        queryKey: ['products', page, pageSize, search, category, status, sortBy, sortDir],
        queryFn: () => getProducts(page, pageSize, token, search, category, status, sortBy, sortDir),
        placeholderData: keepPreviousData,
    });

    return {
        ...query,
        page,
        pageSize,
    };
};
