# Story 1.3: Warehouse List & Summary API

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Logistics Coordinator,
I want to view a list of all distribution centers with their total item count and value,
so that I can identify which warehouses are holding the most inventory.

## Acceptance Criteria

1.  **Given** the user is on the Inventory module
2.  **When** they navigate to the "Warehouses" view
3.  **Then** they should see a list of all 5 seeded warehouses
4.  **And** each row should show "Total Items" and "Total Value"
5.  **And** the data must come from a new GET `/api/v1/warehouses` endpoint
6.  **And** the endpoint response must be in JSON `camelCase` format
7.  **And** the UI must use `SiesaTable` component.

## Tasks / Subtasks

- [ ] **Backend: API Layer & Contract**
    - [x] Create `WarehouseDto` in `Inventory.Application/DTOs` (Properties: `Id`, `Name`, `Location`, `TotalItems`, `TotalValue`).
    - [x] Create `WarehouseController` in `Inventory.API/Controllers`.
    - [x] Define `GET /api/v1/warehouses` endpoint.
- [x] **Backend: Business Logic**
    - [x] Create `IWarehouseService` interface in `Inventory.Application/Contracts`.
    - [x] Implement `WarehouseService` in `Inventory.Application/Services`.
    - [x] Implement logic to query Warehouses and aggregate StockLevels for `TotalItems` (Sum of Quantity) and `TotalValue` (Sum of Quantity * UnitPrice).
    - [x] Optimization: Ensure efficient efficient query (e.g., projection or GroupBy) to avoid N+1 loading of all StockLevels.
- [x] **Backend: Unit Tests**
    - [x] Write unit tests for `WarehouseService` (Mock Repository/DbContext).
    - [x] Verify aggregation logic (Items and Value calculations).
- [x] **Frontend: Feature Setup**
    - [x] Create `src/features/warehouses` directory.
    - [x] Create `Warehouses.tsx` (Route component).
    - [x] Add route definition to `App.tsx` (Path: `/warehouses`).
- [x] **Frontend: UI Implementation**
    - [x] Fetch data from `/api/v1/warehouses` using TanStack Query (`useQuery`).
    - [x] Implement `SiesaTable` to display the list.
    - [x] Columns: Name, Location, Total Items, Total Value (Format as Currency).
    - [x] Handle Loading state (SiesaSkeleton).
    - [x] Handle Error state.

## Dev Notes

-   **Architecture:** Follow Clean Architecture. Service Layer should handle the interaction between Repositories and DTO mapping.
-   **Performance:** Aggregation of "Total Value" might be heavy if many stock items. For MVP, doing it on the fly is acceptable given the limited seed data (50 products). For production, consider database views or pre-calculated fields, but keep it simple for now (LINQ `Select`).
-   **Naming:**
    -   API Endpoint: `kebab-case` -> `/api/v1/warehouses`
    -   JSON Response: `camelCase` -> `totalItems`, `totalValue`
    -   C# DTO: `PascalCase` -> `TotalItems`, `TotalValue`
-   **Frontend:**
    -   Use `siesa-ui-kit` (specifically `SiesaTable`).
    -   Ensure `AuthContext` token is used for the API request (although 1.3 AC doesn't explicitly mention auth, 1.1 established it).

### Project Structure Notes

-   **Backend:**
    -   `Inventory.Application/DTOs/WarehouseDto.cs`
    -   `Inventory.Application/Services/WarehouseService.cs`
    -   `Inventory.API/Controllers/WarehousesController.cs`
-   **Frontend:**
    -   `packages/mf-inventory/src/features/warehouses/WarehouseList.tsx`
    -   `packages/mf-inventory/src/api/warehouseApi.ts`

### References

-   **Epics:** `_bmad-output/planning-artifacts/epics.md` (Story 1.3)
-   **Architecture:** `_bmad-output/planning-artifacts/architecture.md`
-   **Previous Story:** `_bmad-output/implementation-artifacts/1-1-module-initialization-shell-integration.md` (Auth integration)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List
- Implemented `WarehouseService` (Application) with aggregation logic using EF Core projection.
- Created `WarehouseController` (API) exposed at `/api/v1/warehouses`.
- Implemented `Warehouses.tsx` (Frontend) using `siesa-ui-kit` (SiesaTable) and TanStack Query.
- Added comprehensive Unit Tests for Service, Controller, and DTOs using Moq and custom AsyncQueryProvider mock to ensure stability.
- Verified all Acceptance Criteria.

### File List
- services/inventory/src/Inventory.Application/DTOs/WarehouseDto.cs
- services/inventory/src/Inventory.Application/Contracts/IWarehouseService.cs
- services/inventory/src/Inventory.Application/Contracts/IWarehouseRepository.cs
- services/inventory/src/Inventory.Application/Services/WarehouseService.cs
- services/inventory/src/Inventory.Application/DependencyInjection.cs
- services/inventory/src/Inventory.Infrastructure/Repositories/WarehouseRepository.cs
- services/inventory/src/Inventory.API/Controllers/WarehouseController.cs
- packages/mf-inventory/src/features/warehouses/warehouse-list.tsx
- packages/mf-inventory/src/api/warehouseApi.ts
- packages/mf-inventory/src/routes/warehouses.tsx
- services/inventory/tests/Inventory.UnitTests/Services/WarehouseServiceTests.cs
- services/inventory/tests/Inventory.UnitTests/Controllers/WarehouseControllerTests.cs
- services/inventory/tests/Inventory.UnitTests/DTOs/WarehouseDtoTests.cs
- services/inventory/tests/Inventory.UnitTests/Helpers/TestAsyncQueryProvider.cs
- services/inventory/src/Inventory.API/Program.cs
- services/inventory/src/Inventory.Infrastructure/DependencyInjection.cs
- packages/mf-inventory/src/App.tsx
- packages/mf-inventory/src/main.tsx

### Senior Developer Review (AI)
- **Security Fixed**: Added `[Authorize]` attribute to `WarehouseController.cs` to enforce shared session security (FR21/NFR7).
- **Architecture Fixed**: Refactored frontend to use `api/warehouseApi.ts` client instead of direct `fetch` calls.
- **Standards Fixed**: Renamed `Warehouses.tsx` to `warehouse-list.tsx` to comply with Kebab Case rules.
- **Code Quality Fixed**: Improved type safety in `warehouse-list.tsx` (removed `any`).
- **Status**: Changes applied automatically. Ready for merge.
