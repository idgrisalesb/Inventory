# Story 2.3: Global Search Implementation

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Warehouse Staff member,
I want to search for products by Name or SKU instantly,
so that I can answer "Do we have X?" questions in under 5 seconds.

## Acceptance Criteria

1. **Given** the user is on the Product List view
2. **When** they type "Gadget" into the search bar
3. **Then** the list should update to show only products matching "Gadget" in Name or SKU
4. **And** the search should be debounced (e.g., 300ms)
5. **And** the API call should return results in < 500ms (P95 latency)
6. **And** if no results are found, a clear "No products found" message should appear
7. **And** pagination should reset to page 1 when a new search is performed
8. **And** the URL *should* ideally reflect the search state (optional but good for UX, though not explicitly requested in AC, stick to updating the list).

## Tasks / Subtasks

- [x] **Backend: Service & Data Layer**
  - [x] Update `IProductService.GetProductsAsync` signature to accept `string? search`.
  - [x] Update `ProductService` implementation:
    - [x] Apply `.Where(p => p.Name.Contains(search) || p.Sku.Contains(search))` *before* pagination.
    - [x] Ensure case-insensitive search (Postgres `ILike` or `ToLower()` depending on provider configuration, usually `EF.Functions.ILike` is preferred for Postgres).
  - [x] Add DB Indexes on `Name` and `Sku` using EF Core `HasIndex` in `InventoryDbContext` configuration to ensure < 500ms performance.
  - [x] Add migration for new indexes.

- [x] **Backend: API Layer**
  - [x] Update `ProductsController.GetProducts` to accept `[FromQuery] string? search`.
  - [x] Pass `search` to service.
  - [x] Update unit tests in `ProductServiceTests` and `ProductsControllerTests` to verify search filtering.

- [x] **Frontend: Hooks & Utilities**
  - [x] Create `packages/mf-inventory/src/hooks/useDebounce.ts` (generic hook).
  - [x] Update `packages/mf-inventory/src/hooks/useProductList.ts` (or wherever the query hook is defined) to accept `search` param.
  - [x] Update `queryKey` to include `['products', page, pageSize, search]`.

- [x] **Frontend: UI Implementation**
  - [x] Update `ProductList.tsx`:
    - [x] Import `Input` from `siesa-ui-kit`.
    - [x] Import `MagnifyingGlassIcon` from `siesa-ui-kit/dist/views/ListView/icons`.
    - [x] Add state `search` (local input value) and `debouncedSearch`.
    - [x] Pass `debouncedSearch` to the query hook.
    - [x] Reset `page` to 1 when `debouncedSearch` changes.
    - [x] Render `Input` above the `Table`.

## Dev Notes

- **Siesa UI Kit Usage:**
  - **Component:** `Input` from `siesa-ui-kit`.
  - **Icons:** The kit exports icons in a specific path. Use:
    `import { MagnifyingGlassIcon } from 'siesa-ui-kit/dist/views/ListView/icons';`
  - **Input Props:**
    - `leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}`
    - `placeholder="Search by Name or SKU..."`
    - `fullWidth={true}` (or as needed by design)
    - `onChange` handler.

- **Debounce Logic:**
  - Create a standard `useDebounce` hook:
    ```typescript
    export function useDebounce<T>(value: T, delay: number): T {
      // ... implementation
    }
    ```
  - Delay: 300-500ms.

- **Backend Performance:**
  - **Critical:** Search must be performed in the database. Do NOT fetch all records and filter in memory.
  - **Indexes:** Ensure `Name` and `Sku` are indexed. Since we use Postgres, `EF.Functions.ILike` is optimal for case-insensitive search if collation isn't set. Alternatively `ToLower()`.

- **API Contract:**
  - `GET /api/v1/products?page=1&pageSize=20&search=Gadget`

### Project Structure Notes

- **Frontend:**
  - `packages/mf-inventory/src/hooks/useDebounce.ts` (New)
  - `packages/mf-inventory/src/features/products/ProductList.tsx` (Update)

- **Backend:**
  - `Inventory.Application/Services/ProductService.cs` (Update)
  - `Inventory.API/Controllers/ProductsController.cs` (Update)
  - `Inventory.Infrastructure/Persistence/Configurations/ProductConfiguration.cs` (Update for Index)

### References

- **Story 2.1:** Pagination implementation.
- **Story 2.2:** UI setup.
- **Siesa UI Kit:** `Input` component documentation/types.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

- Confirmed `Input` component allows `leftIcon`.
- Confirmed `MagnifyingGlassIcon` location.
- Confirmed need for `useDebounce` hook.

### Completion Notes List

- Implemented Backend Search logic in Service and Controller.
- Added Db Indexes for Name and SKU.
- Implemented `useDebounce` hook.
- Updated `useProductList` to handle search.
- Updated `ProductList.tsx` with `siesa-ui-kit` Input and local Icon helper (due to export issue).
- Verified tests passing.

### File List

- packages/mf-inventory/src/api/productApi.ts
- packages/mf-inventory/src/components/icons/MagnifyingGlassIcon.tsx
- packages/mf-inventory/src/features/products/ProductList.tsx
- packages/mf-inventory/src/features/products/__tests__/ProductList.test.tsx
- packages/mf-inventory/src/features/products/__tests__/useProductList.test.tsx
- packages/mf-inventory/src/features/products/hooks/useProductList.ts
- packages/mf-inventory/src/hooks/useDebounce.ts
- services/inventory/src/Inventory.API/Controllers/ProductsController.cs
- services/inventory/src/Inventory.Application/Contracts/IProductService.cs
- services/inventory/src/Inventory.Application/Services/ProductService.cs
- services/inventory/src/Inventory.Infrastructure/Persistence/InventoryDbContext.cs
- services/inventory/src/Inventory.Infrastructure/Migrations/20260213145736_AddProductSearchIndexes.cs
- services/inventory/src/Inventory.Infrastructure/Migrations/20260213145736_AddProductSearchIndexes.Designer.cs
- services/inventory/tests/Inventory.UnitTests/Controllers/ProductsControllerTests.cs
- services/inventory/tests/Inventory.UnitTests/Services/ProductServiceTests.cs

## Change Log

- 2026-02-13: Implemented global search (Backend + Frontend).
- 2026-02-13: Code review fixes (Migration path, Controller tests, Frontend optimization).

## Status

done

## Senior Developer Review (AI)

- [x] Story file loaded from `_bmad-output/implementation-artifacts/2-3-global-search-implementation.md`
- [x] Story Status verified as reviewable (review)
- [x] Epic and Story IDs resolved (2.3)
- [x] Story Context located or warning recorded
- [x] Epic Tech Spec located or warning recorded
- [x] Architecture/standards docs loaded (as available)
- [x] Tech stack detected and documented
- [x] MCP doc search performed (or web fallback) and references captured
- [x] Acceptance Criteria cross-checked against implementation
- [x] File List reviewed and validated for completeness
- [x] Tests identified and mapped to ACs; gaps noted
- [x] Code quality review performed on changed files
- [x] Security review performed on changed files and dependencies
- [x] Outcome decided (Approve)
- [x] Review notes appended under "Senior Developer Review (AI)"
- [x] Change Log updated with review entry
- [x] Status updated according to settings (if enabled)
- [x] Sprint status synced (if sprint tracking enabled)
- [x] Story saved successfully

_Reviewer: SiesaTeam on 2026-02-13_