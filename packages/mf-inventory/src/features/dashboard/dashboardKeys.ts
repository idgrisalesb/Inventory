export const dashboardKeys = {
    all: ['dashboard'] as const,
    kpis: () => [...dashboardKeys.all, 'kpis'] as const,
};
