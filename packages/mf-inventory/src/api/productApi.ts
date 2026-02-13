import { Product, PaginatedResult } from '../types';

export const getProducts = async (page: number = 1, pageSize: number = 20, token?: string | null, search?: string, category?: string | null, status?: string | null, sortBy?: string | null, sortDir?: boolean | null): Promise<PaginatedResult<Product>> => {
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
  if (category) {
    queryParams.append('category', category);
  }
  if (status) {
    queryParams.append('status', status);
  }
  if (sortBy) {
    queryParams.append('sortBy', sortBy);
  }
  if (sortDir !== undefined && sortDir !== null) {
      queryParams.append('sortDescending', sortDir.toString());
  }

  const response = await fetch(`/api/v1/products?${queryParams.toString()}`, {
    headers
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
};

export const getCategories = async (token?: string | null): Promise<string[]> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/v1/products/categories', {
        headers
    });

    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }

    return response.json();
};
