# Story 2.4: Advanced Filtering

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an Inventory Manager,
I want to filter the product list by Category and Stock Status,
so that I can focus on specific segments like "Low Stock Electronics".

## Acceptance Criteria

1. **Given** the user is on the Product List view
2. **When** they select "Electronics" from the Category dropdown
3. **And** they select "Low Stock" from the Status dropdown
4. **Then** the list should only show Electronic items that are Low Stock
5. **And** the API request should include `?category=Electronics&status=LowStock`
6. **And** filters should be clearable with a single click
7. **And** pagination should reset to page 1 when filters are applied

## Tasks / Subtasks

- [ ] **Backend: API & Service Layer**
  - [ ] Update `IProductService` and `ProductService`:
    - [ ] Add `string? category` and `ProductStockStatus? status` parameters to `GetProductsAsync`.
    - [ ] Implement `category` filtering: `query = query.Where(p => p.Category == category)` (if not null).
    - [ ] Implement `status` filtering (Logic Translation):
      - [ ] `LowStock`: `q > 0 && q <= reorderPoint`
      - [ ] `OutOfStock`: `q == 0`
      - [ ] `InStock`: `q > reorderPoint`
  - [ ] Update `ProductsController`:
    - [ ] Accept `[FromQuery] string? category` and `[FromQuery] ProductStockStatus? status`.
    - [ ] Pass parameters to service.
  - [ ] Create `GET /api/v1/products/categories` endpoint (to populate dropdown).
    - [ ] Return distinct categories from DB: `_context.Products.Select(p => p.Category).Distinct().ToListAsync()`.

- [ ] **Frontend: Hooks & State**
  - [ ] Create `useCategories` hook (fetching from new endpoint).
  - [ ] Update `useProductList` to accept `category` and `status`.
  - [ ] Update `queryKey` to `['products', page, pageSize, search, category, status]`.

- [ ] **Frontend: UI Implementation**
  - [ ] Import `Select`, `Button` from `siesa-ui-kit`.
  - [ ] Update `ProductList.tsx`:
    - [ ] Add state mapping for filters.
    - [ ] Render **Filter Bar** above table (below or next to Search).
    - [ ] Implement "Clear Filters" button (resets state to null/undefined).

## Technical Requirements

### Backend (Filtering Logic)
- **Status Filter:** Since `StockStatus` is a computed property (not persisted), you **CANNOT** use `Where(p => p.Status == status)`. You must replicate the domain logic in LINQ:
  ```csharp
  if (status.HasValue)
  {
      query = status.Value switch
      {
          ProductStockStatus.OutOfStock => query.Where(p => p.TotalQuantity == 0),
          ProductStockStatus.LowStock => query.Where(p => p.TotalQuantity > 0 && p.TotalQuantity <= p.ReorderPoint),
          ProductStockStatus.InStock => query.Where(p => p.TotalQuantity > p.ReorderPoint),
          _ => query
      };
  }
  ```
- **Category Filter:** Simple exact match. `Where(p => p.Category == category)`.

### Frontend (Siesa UI Kit)
- **Library Analysis:**
  - Used `node_modules/siesa-ui-kit` for validation.
  - **Select Component:** `import { Select } from 'siesa-ui-kit';`
  - **Button Component:** `import { Button } from 'siesa-ui-kit';`
- **Component Props:**
  - `Select`:
    - `options`: `{ label: string, value: string }[]`
    - `value`: current selected value
    - `onChange`: handler
    - `placeholder`: "Select Category" / "Select Status"
    - `isClearable`: Check if supported, otherwise use clean button.

## Architecture Compliance

- **Naming:** Query params `camelCase` (`category`, `status`).
- **State Management:** URL state synchronization is recommended but optional for MVP (AC doesn't explicitly force it, but "Deep Linking" is a nice to have). For now, local React State + TanStack Query is sufficient.
- **Performance:** DB-side filtering is mandatory. No in-memory filtering.

## Testing Requirements

- **Backend Unit Tests:**
  - Verify `ProductService` filters correctly for each Status enum value.
  - Verify combination of Category + Status filters.
- **Frontend Integration:**
  - Verify sending correct query params.
  - Verify UI updates when filters change.

## References

- **Epics:** Story 2.4
- **Previous Story:** 2.1 (Service Pattern), 2.3 (Search Pattern)
- **Siesa UI Kit:** `node_modules/siesa-ui-kit/dist/components/Select/Select.d.ts`

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Completion Notes List
- Implemented category and status filtering in backend.
- Added logic translation for computed status in EF Core query.
- Integrated `siesa-ui-kit` Select component.
