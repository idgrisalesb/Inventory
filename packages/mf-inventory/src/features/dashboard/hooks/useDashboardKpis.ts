import { useQuery } from '@tanstack/react-query';
import { fetchKpis } from '../../../api/dashboardApi';
import { dashboardKeys } from '../dashboardKeys';

export const useDashboardKpis = () => {
    return useQuery({
        queryKey: dashboardKeys.kpis(),
        queryFn: fetchKpis,
        staleTime: 5000,
    });
};
