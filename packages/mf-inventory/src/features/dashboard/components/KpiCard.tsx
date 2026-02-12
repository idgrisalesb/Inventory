import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from 'siesa-ui-kit';

interface KpiCardProps {
    title: string;
    value: string | number;
    isLoading?: boolean;
}

export const KpiCard = memo(({ title, value, isLoading }: KpiCardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-[100px]" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    );
});
