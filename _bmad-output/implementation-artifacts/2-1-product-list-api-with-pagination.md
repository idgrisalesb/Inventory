# Story 2.1: Product List API with Pagination

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer (on behalf of users),
I want a performant API endpoint to retrieve a paginated list of products,
so that the frontend can display large catalogs without crashing the browser.

## Acceptance Criteria

1. **Given** the database contains 1000+ products
2. **When** a GET request is made to `/api/v1/products?page=1&pageSize=20`
3. **Then** the response should contain the first 20 products
4. **And** the response metadata should include `totalCount`, `totalPages`, `hasNextPage`
5. **And** the query execution time should be under 200ms
6. **And** the `ProductDto` should include basic details (Id, SKU, Name, Category, StockStatus)

## Tasks / Subtasks

- [x] **Backend: Common Infrastructure**
    - [x] Create `PaginatedResult<T>` class in `Inventory.Application/Common/Models` to standardize pagination responses across the API.
    - [x] Properties: `Items` (IEnumerable<T>), `TotalCount` (int), `PageNumber` (int), `PageSize` (int), `TotalPages` (int), `HasNextPage` (bool).
- [x] **Backend: API Layer & Contract**
    - [x] Create `ProductDto` in `Inventory.Application/DTOs` with required fields.
    - [x] Create `ProductsController` in `Inventory.API/Controllers`.
    - [x] Define `GET /api/v1/products` endpoint accepting `page` and `pageSize` query parameters.
    - [x] Apply `[Authorize]` attribute to controller.
- [x] **Backend: Business Logic**
    - [x] Create `IProductService` interface in `Inventory.Application/Contracts`.
    - [x] Implement `ProductService` in `Inventory.Application/Services`.
    - [x] Implement `GetProductsAsync` with EF Core `CountAsync`, `Skip`, and `Take`.
    - [x] Optimize query to Project directly to DTO (`Select`) to avoid fetching unnecessary columns.
- [x] **Backend: Testing**
    - [x] Write unit tests for `ProductService` pagination logic (ensure correct Skip/Take calculations).
    - [x] Write unit tests for `ProductsController` ensuring correct status codes and response structure.
    - [x] Verify `PaginatedResult` metadata calculations.

## Dev Notes

- **Pagination Standard:** Use a reusable `PaginatedResult<T>` wrapper. The response structure should look like:
  ```json
  {
    "items": [...],
    "pageNumber": 1,
    "totalPages": 5,
    "totalCount": 100,
    "hasNextPage": true
  }
  ```
- **Performance:**
  - Execute `CountAsync()` first.
  - Then execute `Skip((page-1)*pageSize).Take(pageSize).Select(...)`.
  - Ensure the `Select` projection is used to only fetch needed fields (Id, Sku, Name, Category, StockStatus) to minimize DB load.
- **Naming Conventions:**
  - Controller: `ProductsController` -> Endpoint `/api/v1/products`.
  - Query Params: `page` (or `pageNumber`), `pageSize`.
  - DTO: `ProductDto`.
- **Learnings from Story 1.3:**
  - `WarehouseController` used `[Authorize]`, ensure `ProductsController` does too.
  - Use `InventoryDbContext` injected via constructor.
  - Return `ActionResult<PaginatedResult<ProductDto>>`.

### Project Structure Notes

- **Backend:**
    - `Inventory.Application/Common/Models/PaginatedResult.cs` (New Shared)
    - `Inventory.Application/DTOs/ProductDto.cs`
    - `Inventory.Application/Contracts/IProductService.cs`
    - `Inventory.Application/Services/ProductService.cs`
    - `Inventory.API/Controllers/ProductsController.cs`

### References

- **Epics:** `_bmad-output/planning-artifacts/epics.md` (Story 2.1)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md`
- **Previous Work:** `Inventory.API/Controllers/WarehouseController.cs` (Reference for Controller structure)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List
- Implemented `PaginatedResult<T>` with proper metadata calculation.
- Created `IProductService` and `ProductService` implementing pagination with EF Core `Skip`/`Take` and projection for performance.
- Implemented `ProductsController` with `[Authorize]` and standardized response.
- Added comprehensive unit tests for DTO, Service, and Controller.
- Calculated `StockStatus` dynamically based on stock levels and reorder point.
- Code Review Fixes: Added input validation, migrated StockStatus to Enum for i18n, added CancellationToken support.

### File List
- services/inventory/src/Inventory.Application/Common/Models/PaginatedResult.cs
- services/inventory/src/Inventory.Application/DTOs/ProductDto.cs
- services/inventory/src/Inventory.Application/DTOs/ProductStockStatus.cs
- services/inventory/src/Inventory.Application/Contracts/IProductService.cs
- services/inventory/src/Inventory.Application/Services/ProductService.cs
- services/inventory/src/Inventory.API/Controllers/ProductsController.cs
- services/inventory/tests/Inventory.UnitTests/Common/Models/PaginatedResultTests.cs
- services/inventory/tests/Inventory.UnitTests/Services/ProductServiceTests.cs
- services/inventory/tests/Inventory.UnitTests/Controllers/ProductsControllerTests.cs

## Change Log
- 2026-02-13: Implemented Product List API with pagination (Story 2.1).
- 2026-02-13: Senior Developer Code Review - Fixed validation, i18n issues, and async cancellation.
