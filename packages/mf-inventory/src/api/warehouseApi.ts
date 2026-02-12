interface WarehouseDto {
  id: string;
  name: string;
  location: string;
  totalItems: number;
  totalValue: number;
}

export const getWarehouses = async (token?: string | null): Promise<WarehouseDto[]> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/v1/warehouses', {
    headers
  });

  if (!response.ok) {
    throw new Error('Failed to fetch warehouses');
  }

  return response.json();
};

export type { WarehouseDto };
