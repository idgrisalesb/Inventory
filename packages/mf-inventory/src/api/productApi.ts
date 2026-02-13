import { Product, PaginatedResult } from '../types';

export const getProducts = async (page: number = 1, pageSize: number = 20, token?: string | null, search?: string): Promise<PaginatedResult<Product>> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString()
  });

  if (search) {
    queryParams.append('search', search);
  }

  const response = await fetch(`/api/v1/products?${queryParams.toString()}`, {
    headers
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
};
