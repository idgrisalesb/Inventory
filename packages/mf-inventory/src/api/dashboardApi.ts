export interface DashboardKpi {
  totalSkus: number;
  totalStockValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export const fetchKpis = async (): Promise<DashboardKpi> => {
  const response = await fetch('/api/v1/dashboard/kpis');
  if (!response.ok) {
    throw new Error('Failed to fetch KPIs');
  }
  return response.json();
};

export interface DashboardChart {
  categoryName: string;
  totalValue: number;
  percentage: number;
}

export interface DashboardAlert {
  productId: string;
  productName: string;
  sku: string | null;
  totalQuantity: number;
  reorderPoint: number;
}

export const fetchCharts = async (): Promise<DashboardChart[]> => {
  const response = await fetch('/api/v1/dashboard/charts');
  if (!response.ok) {
    throw new Error('Failed to fetch charts');
  }
  return response.json();
};

export const fetchAlerts = async (): Promise<DashboardAlert[]> => {
  const response = await fetch('/api/v1/dashboard/alerts');
  if (!response.ok) {
    throw new Error('Failed to fetch alerts');
  }
  return response.json();
};
