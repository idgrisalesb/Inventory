import { memo } from 'react';
import { Link } from '@tanstack/react-router';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface KpiCardProps {
    title: string;
    value: string | number;
    isLoading?: boolean;
    to?: string;
    search?: Record<string, string>;
}

function cn(...inputs: (string | undefined)[]) {
  return twMerge(clsx(inputs));
}

export const KpiCard = memo(({ title, value, isLoading, to, search }: KpiCardProps) => {
    const cardContent = (
        <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm bg-white", to ? "cursor-pointer hover:bg-slate-50 transition-colors" : "")}>
            <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <h3 className="text-sm font-medium tracking-tight">{title}</h3>
            </div>
            <div className="p-6 pt-0">
                {isLoading ? (
                    <div className="animate-pulse rounded-md bg-gray-200 h-8 w-[100px]" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </div>
        </div>
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
