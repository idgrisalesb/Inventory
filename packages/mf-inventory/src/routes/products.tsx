import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import ProductList from '../features/products/ProductList';

export const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductList,
});
