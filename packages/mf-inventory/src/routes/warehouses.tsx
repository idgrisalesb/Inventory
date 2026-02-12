import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { WarehouseList } from '../features/warehouses/warehouse-list';

export const warehousesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/warehouses',
  component: WarehouseList,
});
