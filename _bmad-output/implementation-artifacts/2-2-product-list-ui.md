# Story 2.2: Product List UI

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Warehouse Staff member,
I want to view a table of all products with their current stock status,
so that I can browse the inventory.

## Acceptance Criteria

1. **Given** the user navigates to the "Products" view
2. **When** the list loads
3. **Then** a `SiesaTable` (exported as `Table` from `siesa-ui-kit`) should display the products
4. **And** columns should include: SKU, Name, Category, Total Quantity, Unit Price, Status
5. **And** the "Status" column should show a Green/Yellow/Red indicator based on stock level
6. **And** pagination controls (Next/Prev) should work
7. **And** loading states should use `SiesaSkeleton` (handled internally by `Table` via `loading` prop).

## Tasks / Subtasks

- [x] **Frontend: Feature Setup**
  - [x] Create `packages/mf-inventory/src/features/products` folder structure.
  - [x] Create `ProductList.tsx` component.
  - [x] Define `Product` interface in `types.ts` matching the API DTO from Story 2.1.
- [x] **Frontend: State & Hooks**
  - [x] Implement `useProductList` hook using `@tanstack/react-query` v5.
  - [x] Hook should accept `page` and `pageSize` arguments.
  - [x] Manage local state for `page` (default 1) and `pageSize` (default 20).
- [x] **Frontend: UI Implementation**
  - [x] implement `ProductList` using `Table` component from `siesa-ui-kit`.
  - [x] Configure `columns` definition with correct accessors and render functions.
  - [x] Implement `Badge` for 'Status' column (Green=In Stock, Yellow=Low Stock, Red=Out of Stock).
  - [x] Wire up `pagination` prop of `Table` to the hook's metadata and state setters.
  - [x] Handle `isLoading` state from query by passing it to `Table`.

## Dev Notes

- **Siesa UI Kit Usage:**
  - **Component:** Use `Table` from `siesa-ui-kit` (do NOT Import `SiesaTable` as it's not exported).
  - **Props:**
    - `data`: Array of products.
    - `columns`: Array of column definitions.
    - `loading`: Boolean from query `isLoading`.
    - `pagination`: Object `{ currentPage: page, totalPages: data.totalPages, onPageChange: setPage }`.
  - **Badge Usage:**
    - Use `Badge` for the status column.
    - Props: `label={statusText}`, `color={statusColor}`.
    - Colors: `green` (In Stock), `yellow` (Low Stock), `red` (Out of Stock).
    - **CRITICAL:** `Badge` takes `label` as a prop, NOT as children. Example: `<Badge label="Low Stock" color="yellow" />`.

- **API Integration:**
  - Endpoint: `GET /api/v1/products?page=1&pageSize=20`.
  - Response Shape: `PaginatedResult<ProductDto>` (items, totalCount, totalPages, hasNextPage).
  - Ensure `Product` type matches the API DTO fields: `id`, `sku`, `name`, `category`, `stockStatus`, `totalQuantity`, `unitPrice`.

- **State Management:**
  - Use `useState` for `page` and `pageSize`.
  - Use `keepPreviousData: true` (or `placeholderData: keepPreviousData` in v5) in `useQuery` to prevent flashing during pagination.

### Project Structure Notes

- **File Location:** `packages/mf-inventory/src/features/products/ProductList.tsx`
- **Route:** The route is already set up in `root.component.tsx` or `App.tsx` (likely `/products` or similar). If not, ensure it's accessible.
- **Exports:** Export `ProductList` as default.

### References

- **Story 2.1:** API Definitions (`api/v1/products`).
- **Siesa UI Kit:** `node_modules/siesa-ui-kit/dist/index.d.ts` and `Table.d.ts`, `Badge.types.d.ts`.
- **TanStack Query:** v5 Documentation (Object syntax).

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

- Verified `siesa-ui-kit` exports: `Table`, `Badge`.
- Verified `Badge` props: `label` (string) required, `color`.
- Verified `Table` props: `loading` (boolean), `pagination` (PaginationProps).

### Completion Notes List

- Analysis of `siesa-ui-kit` confirmed `Table` and `Badge` usage.
- `SiesaSkeleton` is internal to `Table` via `loading` prop.
- Updated Acceptance Criteria to reflect actual library exports.
- Implemented `ProductList` component using `siesa-ui-kit` `Table` and `Badge` components.
- Implemented `useProductList` hook using react-query v5 with pagination state.
- Created Typescript interface `PaginatedResult` to handle paged data.
- Added comprehensive unit tests for UI and Hook logic.
- Ensured 100% compliance with `siesa-ui-kit` usage guidelines.
- **Code Review Fixes:**
    - Register `ProductList` in `App.tsx` and `routeTree`.
    - Add navigation to `src/routes/__root.tsx`.
    - Fix error handling in `ProductList.tsx`.
    - Improve performance (memoize `columns`).
    - Update translations.


### File List

- packages/mf-inventory/node_modules/siesa-ui-kit/dist/components/Table/Table.types.d.ts
- packages/mf-inventory/node_modules/siesa-ui-kit/dist/components/Badge/Badge.types.d.ts
- packages/mf-inventory/src/api/productApi.ts
- packages/mf-inventory/src/features/products/ProductList.tsx
- packages/mf-inventory/src/features/products/hooks/useProductList.ts
- packages/mf-inventory/src/features/products/__tests__/ProductList.test.tsx
- packages/mf-inventory/src/features/products/__tests__/useProductList.test.tsx
- packages/mf-inventory/src/types.ts
- packages/mf-inventory/src/routes/products.tsx
- packages/mf-inventory/src/App.tsx
- packages/mf-inventory/src/routes/__root.tsx
- packages/mf-inventory/src/locales/en/translation.json
- packages/mf-inventory/src/locales/es/translation.json
