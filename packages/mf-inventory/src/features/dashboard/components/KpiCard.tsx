import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from 'siesa-ui-kit';
import { Link } from '@tanstack/react-router';

interface KpiCardProps {
    title: string;
    value: string | number;
    isLoading?: boolean;
    to?: string;
    search?: Record<string, string>;
}

export const KpiCard = memo(({ title, value, isLoading, to, search }: KpiCardProps) => {
    const cardContent = (
        <Card className={to ? "cursor-pointer hover:bg-slate-50 transition-colors" : ""}>
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

    if (to) {
        return (
            <Link to={to} search={search} className="block no-underline">
                {cardContent}
            </Link>
        );
    }

    return cardContent;
});
