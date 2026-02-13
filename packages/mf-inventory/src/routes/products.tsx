import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import ProductList from '../features/products/ProductList';

interface ProductSearch {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductList,
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    return {
      page: Number(search.page) || 1,
      pageSize: Number(search.pageSize) || 20,
      search: (search.search as string) || '',
      category: (search.category as string) || undefined,
      status: (search.status as string) || undefined,
      sortBy: (search.sortBy as string) || undefined,
      sortDir: search.sortDir === 'desc' ? 'desc' : (search.sortDir === 'asc' ? 'asc' : undefined),
    }
  },
});
