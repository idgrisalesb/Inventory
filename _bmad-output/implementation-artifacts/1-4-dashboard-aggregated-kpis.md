# Story 1.4: Dashboard Aggregated KPIs

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **Inventory Manager**,
I want to **see the Total SKUs, Total Value, Low Stock Count, and Out of Stock Count on the dashboard**,
so that **I can assess the inventory health in under 5 seconds**.

## Acceptance Criteria

1.  **Given** the user is on the Dashboard
2.  **When** the page loads
3.  **Then** 4 KPI Cards (Total SKUs, Total Value, Low Stock, Out of Stock) should appear
4.  **And** the data must be fetched from `GET /api/v1/dashboard/kpis`
5.  **And** the "Total Value" must be formatted as Currency
6.  **And** the load time (LCP) must be under 1.5 seconds
7.  **And** a Skeleton loader should appear while fetching data.

## Tasks / Subtasks

- [x] **Backend: API Layer**
    - [x] Create `DashboardKpiDto` in `Inventory.Application/DTOs` (Props: `TotalSkus`, `TotalStockValue`, `LowStockCount`, `OutOfStockCount`).
    - [x] Create `DashboardController` in `Inventory.API/Controllers`.
    - [x] Define `GET /api/v1/dashboard/kpis` endpoint.
- [x] **Backend: Business Logic**
    - [x] Create `IDashboardService` in `Inventory.Application/Contracts`.
    - [x] Implement `DashboardService` in `Inventory.Application/Services`.
    - [x] Implement `GetKpisAsync`:
        - [x] Query 1: Count all Products (`TotalSkus`).
        - [x] Query 2: Sum of (Quantity * UnitPrice) across all StockLevels (`TotalStockValue`).
        - [x] Query 3: Count Products where TotalQuantity <= ReorderPoint (`LowStockCount`).
        - [x] Query 4: Count Products where TotalQuantity == 0 (`OutOfStockCount`).
    - [x] **Optimization:** Use `AsNoTracking()` for all queries. Execute queries in parallel using `Task.WhenAll` to meet < 500ms latency requirement.
- [x] **Frontend: Feature Implementation**
    - [x] Create `packages/mf-inventory/src/api/dashboardApi.ts` (fetchKpis).
    - [x] Create `packages/mf-inventory/src/features/dashboard/Dashboard.tsx`.
    - [x] Implement `useDashboardKpis` hook with TanStack Query (Key: `['dashboard', 'kpis']`).
    - [x] Create `KPIGrid` layout component.
    - [x] Implement `KPICard` component using `Card`.
    - [x] Implement Skeleton loading state using `Skeleton`.
- [x] **Testing**
    - [x] **Backend:** Unit test `DashboardService` aggregation logic (Mock DbContext).
    - [x] **Frontend:** Test `Dashboard` component renders correct values and handles loading state.

## Dev Notes

### Technical Requirements
-   **Frameworks:** .NET 10 Web API (Backend), React 18 + Vite (Frontend).
-   **State Management:** TanStack Query v5 is **CRITICAL** for caching and meeting the < 1.5s LCP requirement. Do not use `useEffect` for data fetching.
-   **Database:** PostgreSQL 18+. Use EF Core 10 `AsNoTracking()` for read-only dashboard queries.
-   **Styling:** Use `Card` from `siesa-ui-kit`. Use **CSS Grid** for the 4-card layout (responsive: 1 col mobile, 2 cols tablet, 4 cols desktop).

### Architecture Compliance
-   **Clean Architecture:**
    -   **API:** `DashboardController` depends on `IDashboardService`.
    -   **Application:** `DashboardService` implements business logic, depends on `IInventoryDbContext`.
    -   **Domain:** No direct dependency, but queries `Product` and `StockLevel` entities.
-   **Naming Conventions:**
    -   API Endpoint: `kebab-case` -> `/api/v1/dashboard/kpis`
    -   JSON Response: `camelCase` -> `totalSkus`, `totalStockValue`...
    -   C# DTO: `PascalCase` -> `TotalSkus`, `TotalStockValue`...
-   **Security:** Ensure endpoint is protected by `[Authorize(Policy = "InventoryManager")]` (as per NFR7).

### Previous Story Intelligence (from Story 1.3)
-   **Pattern:** Logic for aggregation was established in 1.3 (`TotalValue` per warehouse). This story aggregates across *all* warehouses.
-   **Auth:** Continue using the authenticated session pattern established in Story 1.1.
-   **UI:** Reuse the `Skeleton` pattern used in Warehouse List for consistency.

### File Structure Requirements
-   `services/inventory/src/Inventory.Application/DTOs/DashboardKpiDto.cs`
-   `services/inventory/src/Inventory.Application/Services/DashboardService.cs`
-   `services/inventory/src/Inventory.API/Controllers/DashboardController.cs`
-   `packages/mf-inventory/src/features/dashboard/Dashboard.tsx`
-   `packages/mf-inventory/src/features/dashboard/components/KpiCard.tsx`

## Dev Agent Record

### Agent Model Used
Gemini 3 Pro Preview

### Completion Notes List
- Implemented full backend stack with Clean Architecture (DTO, Service, Controller).
- Implemented efficient parallel queries using `Task.WhenAll` and `AsNoTracking` for performance.
- Implemented frontend Dashboard with `siesa-ui-kit` components (`Card`, `Skeleton`).
- Added responsive Grid layout.
- Added comprehensive Unit Tests for Backend (Service & Controller) and Frontend (Component & Loading State).
- Refactored `IInventoryDbContext` to allow proper mocking of DbSets.
- **Code Review Fixes:**
    - Refactored `DashboardService.cs` to execute queries sequentially to prevent DbContext concurrency issues.
    - Added `dashboardKeys.ts` for TanStack Query Factory Pattern.
    - Improved `Dashboard.tsx` error handling with `Alert`.
    - Updated `warehouse-list.tsx` to use `Skeleton` from `siesa-ui-kit`.
    - Documented `main.tsx` and `vite.config.mts` changes.

### File List
- services/inventory/src/Inventory.Application/DTOs/DashboardKpiDto.cs
- services/inventory/src/Inventory.Application/Services/DashboardService.cs
- services/inventory/src/Inventory.API/Controllers/DashboardController.cs
- services/inventory/src/Inventory.Application/Contracts/IDashboardService.cs
- services/inventory/src/Inventory.Application/Contracts/IInventoryDbContext.cs
- services/inventory/src/Inventory.Infrastructure/Persistence/InventoryDbContext.cs
- packages/mf-inventory/src/api/dashboardApi.ts
- packages/mf-inventory/src/features/dashboard/Dashboard.tsx
- packages/mf-inventory/src/features/dashboard/dashboardKeys.ts
- packages/mf-inventory/src/features/dashboard/components/KpiCard.tsx
- packages/mf-inventory/src/features/dashboard/hooks/useDashboardKpis.ts
- packages/mf-inventory/src/features/warehouses/warehouse-list.tsx
- packages/mf-inventory/src/main.tsx
- packages/mf-inventory/vite.config.mts
- services/inventory/tests/Inventory.UnitTests/Services/DashboardServiceTests.cs
- services/inventory/tests/Inventory.UnitTests/Controllers/DashboardControllerTests.cs
- packages/mf-inventory/src/features/dashboard/__tests__/Dashboard.test.tsx

## Change Log
- 2026-02-12: Implemented Dashboard KPIs (Backend + Frontend) and Tests.
- 2026-02-12: Code Review Fixes (Concurrency, Query Keys, Error Handling, Documentation).
