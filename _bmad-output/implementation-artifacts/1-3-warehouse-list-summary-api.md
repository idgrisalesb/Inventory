# Story 1.3: Warehouse List & Summary API

Status: ready-for-dev

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
    - [ ] Create `WarehouseDto` in `Inventory.Application/DTOs` (Properties: `Id`, `Name`, `Location`, `TotalItems`, `TotalValue`).
    - [ ] Create `WarehouseController` in `Inventory.API/Controllers`.
    - [ ] Define `GET /api/v1/warehouses` endpoint.
- [ ] **Backend: Business Logic**
    - [ ] Create `IWarehouseService` interface in `Inventory.Application/Contracts`.
    - [ ] Implement `WarehouseService` in `Inventory.Application/Services`.
    - [ ] Implement logic to query Warehouses and aggregate StockLevels for `TotalItems` (Sum of Quantity) and `TotalValue` (Sum of Quantity * UnitPrice).
    - [ ] Optimization: Ensure efficient efficient query (e.g., projection or GroupBy) to avoid N+1 loading of all StockLevels.
- [ ] **Backend: Unit Tests**
    - [ ] Write unit tests for `WarehouseService` (Mock Repository/DbContext).
    - [ ] Verify aggregation logic (Items and Value calculations).
- [ ] **Frontend: Feature Setup**
    - [ ] Create `src/features/warehouses` directory.
    - [ ] Create `Warehouses.tsx` (Route component).
    - [ ] Add route definition to `App.tsx` (Path: `/warehouses`).
- [ ] **Frontend: UI Implementation**
    - [ ] Fetch data from `/api/v1/warehouses` using TanStack Query (`useQuery`).
    - [ ] Implement `SiesaTable` to display the list.
    - [ ] Columns: Name, Location, Total Items, Total Value (Format as Currency).
    - [ ] Handle Loading state (SiesaSkeleton).
    - [ ] Handle Error state.

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

### File List
