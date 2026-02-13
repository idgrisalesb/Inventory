# Story 2.5: Sorting & KPI Navigation

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an Inventory Manager,
I want to sort the product list by Quantity or Price and navigate directly from Dashboard alerts,
so that I can investigate the most expensive or scarce items first.

## Acceptance Criteria

1. **Dashboard Navigation**:
   - Clicking the "Low Stock" KPI card redirects to `/products`.
   - The redirect automatically applies the filter `?status=LowStock`.
   - Clicking the "Out of Stock" KPI card redirects to `/products?status=OutOfStock`.

2. **Product List Sorting**:
   - The Product List table supports sorting by: **Name**, **SKU**, **Total Quantity**, and **Unit Price**.
   - Clicking a column header toggles between **Ascending** and **Descending**.
   - Visual indicators (arrows) show the active sort column and direction.
   - Sorting is server-side (applied via API query parameters).

3. **State Persistence**:
   - Sorting state is reflected in the URL (e.g., `?sortBy=price&sortDir=desc`).
   - Reloading the page preserves the sort order and filters.

## Tasks / Subtasks

- [ ] **Backend: API Sorting Support**
  - [ ] Update `ProductDto` / `GetProductsQuery` to accept `SortBy` and `SortDescending` parameters.
  - [ ] Implement dynamic sorting in `ProductService` (LINQ `OrderBy` / `OrderByDescending`).
  - [ ] Validate allowed sort keys (Name, Sku, Quantity, Price).

- [ ] **Frontend: Dashboard Navigation**
  - [ ] Update `LowStockAlerts` and KPI components to use `Link` from `@tanstack/react-router`.
  - [ ] Construct URLs with query parameters (`/products?status=LowStock`).

- [ ] **Frontend: Product List Sorting**
  - [ ] Import `SortDirection` type from `siesa-ui-kit`.
  - [ ] Add `sortBy` and `sortDir` to `ProductSearch` params (TanStack Router).
  - [ ] Implement `onSort` handler in `ProductList` component.
  - [ ] Pass `sortColumn`, `sortDirection`, and `onSort` props to `siesa-ui-kit` Table.

## Dev Notes

### Siesa UI Kit Analysis (Mandatory)

Based on analysis of `packages/mf-inventory/node_modules/siesa-ui-kit/dist/components/Table/Table.types.d.ts`, strict adherence to the **Table** component API is required:

1.  **Types**:
    - Use `SortDirection` type: `'asc' | 'desc' | null`.
    - Use `TableColumn<T>` interface for column definitions.

2.  **Props Implementation**:
    - `onSort`: Must match signature `(column: keyof T | string, direction: SortDirection) => void`.
    - `sortColumn`: Pass the current sort key (string).
    - `sortDirection`: Pass the current direction.
    - `columns`: Ensure `sortable: true` is set for Name, SKU, Quantity, Price columns.

3.  **Example Usage**:
    ```tsx
    import { Table, SortDirection, TableColumn } from 'siesa-ui-kit';

    const handleSort = (column: string, direction: SortDirection) => {
      // Update router search params
      navigate({ search: (prev) => ({ ...prev, sortBy: column, sortDir: direction }) });
    };

    <Table
      data={products}
      columns={columns}
      sortColumn={search.sortBy}
      sortDirection={search.sortDir}
      onSort={handleSort}
    />
    ```

### Architecture Patterns

- **State Management**: Use **URL-driven state** (TanStack Router `useSearch`) instead of local `useState` for sorting. This ensures bookmarkability and deep linking from Dashboard.
- **API**: Use `camelCase` for query parameters (`sortBy`, `sortDir`) to match strict guidelines.
- **Performance**: Ensure server-side sorting is efficient (indexed columns in DB).

### References

- **Architecture**: `_bmad-output/planning-artifacts/architecture.md` (Naming Conventions, API structure).
- **Epics**: `_bmad-output/planning-artifacts/epics.md` (Story 2.5 requirements).
- **UI Kit**: `node_modules/siesa-ui-kit/dist/components/Table/Table.types.d.ts`.

## Dev Agent Record

### Agent Model Used
Claude 3.7 Sonnet (Preview)

### File List
- `packages/mf-inventory/src/features/products/ProductList.tsx`
- `services/inventory/src/Inventory.Application/Services/ProductService.cs`
- `services/inventory/src/Inventory.API/Controllers/ProductsController.cs`
- `packages/mf-inventory/src/features/dashboard/components/Dashboard.tsx` (KPI Cards)
