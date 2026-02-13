import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../../api/productApi';
import { useAuth } from '../../../context/AuthContext';

export const useCategories = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(token),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
