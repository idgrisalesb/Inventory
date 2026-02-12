# Story 1.4: Dashboard Aggregated KPIs

Status: ready-for-dev

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

- [ ] **Backend: API Layer**
    - [ ] Create `DashboardKpiDto` in `Inventory.Application/DTOs` (Props: `TotalSkus`, `TotalStockValue`, `LowStockCount`, `OutOfStockCount`).
    - [ ] Create `DashboardController` in `Inventory.API/Controllers`.
    - [ ] Define `GET /api/v1/dashboard/kpis` endpoint.
- [ ] **Backend: Business Logic**
    - [ ] Create `IDashboardService` in `Inventory.Application/Contracts`.
    - [ ] Implement `DashboardService` in `Inventory.Application/Services`.
    - [ ] Implement `GetKpisAsync`:
        - [ ] Query 1: Count all Products (`TotalSkus`).
        - [ ] Query 2: Sum of (Quantity * UnitPrice) across all StockLevels (`TotalStockValue`).
        - [ ] Query 3: Count Products where TotalQuantity <= ReorderPoint (`LowStockCount`).
        - [ ] Query 4: Count Products where TotalQuantity == 0 (`OutOfStockCount`).
    - [ ] **Optimization:** Use `AsNoTracking()` for all queries. Execute queries in parallel using `Task.WhenAll` to meet < 500ms latency requirement.
- [ ] **Frontend: Feature Implementation**
    - [ ] Create `packages/mf-inventory/src/api/dashboardApi.ts` (fetchKpis).
    - [ ] Create `packages/mf-inventory/src/features/dashboard/Dashboard.tsx`.
    - [ ] Implement `useDashboardKpis` hook with TanStack Query (Key: `['dashboard', 'kpis']`).
    - [ ] Create `KPIGrid` layout component.
    - [ ] Implement `KPICard` component using `SiesaCard`.
    - [ ] Implement Skeleton loading state using `SiesaSkeleton`.
- [ ] **Testing**
    - [ ] **Backend:** Unit test `DashboardService` aggregation logic (Mock DbContext).
    - [ ] **Frontend:** Test `Dashboard` component renders correct values and handles loading state.

## Dev Notes

### Technical Requirements
-   **Frameworks:** .NET 10 Web API (Backend), React 18 + Vite (Frontend).
-   **State Management:** TanStack Query v5 is **CRITICAL** for caching and meeting the < 1.5s LCP requirement. Do not use `useEffect` for data fetching.
-   **Database:** PostgreSQL 18+. Use EF Core 10 `AsNoTracking()` for read-only dashboard queries.
-   **Styling:** Use `SiesaCard` from `siesa-ui-kit`. Use **CSS Grid** for the 4-card layout (responsive: 1 col mobile, 2 cols tablet, 4 cols desktop).

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
-   **UI:** Reuse the `SiesaSkeleton` pattern used in Warehouse List for consistency.

### File Structure Requirements
-   `services/inventory/src/Inventory.Application/DTOs/DashboardKpiDto.cs`
-   `services/inventory/src/Inventory.Application/Services/DashboardService.cs`
-   `services/inventory/src/Inventory.API/Controllers/DashboardController.cs`
-   `packages/mf-inventory/src/features/dashboard/Dashboard.tsx`
-   `packages/mf-inventory/src/features/dashboard/components/KpiCard.tsx`

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Completion Notes List
- Comprehensive story created based on Epics and Architecture.
- Defined parallel execution strategy for backend queries to ensure performance.
- Enforced strict Clean Architecture layering.
- Defined specific frontend components and hooks.

### File List
- services/inventory/src/Inventory.Application/DTOs/DashboardKpiDto.cs
- services/inventory/src/Inventory.Application/Services/DashboardService.cs
- services/inventory/src/Inventory.API/Controllers/DashboardController.cs
- packages/mf-inventory/src/features/dashboard/Dashboard.tsx
- packages/mf-inventory/src/features/dashboard/components/KpiCard.tsx
