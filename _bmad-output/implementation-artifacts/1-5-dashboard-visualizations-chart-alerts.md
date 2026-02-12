# Story 1.5: Dashboard Visualizations (Chart & Alerts)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **Inventory Manager**,
I want to **see a visual breakdown of stock value by category and a list of urgent low-stock alerts**,
so that **I can prioritize which categories or items need immediate attention**.

## Acceptance Criteria

1.  **Given** the user is on the Dashboard
2.  **When** they scroll down
3.  **Then** a **Pie Chart** labeled "Stock Value by Category" should be visible
4.  **And** a **"Top Low Stock Alerts" list** should display the top 5 distinct items where `TotalQuantity <= ReorderPoint`
5.  **And** the chart data must be fetched from `GET /api/v1/dashboard/charts`
6.  **And** the alerts data must be fetched from `GET /api/v1/dashboard/alerts`
7.  **And** clicking a "Low Stock" item row should link to the Product Detail view (implement simply as a link to `/inventory/products/{id}`)
8.  **And** the chart should use Siesa Blue colors (Primary/Secondary variants) for visual consistency
9.  **And** the alerts list should highlight the "Status" column with a Red/Yellow indicator

## Tasks / Subtasks

- [ ] **Backend: API Layer**
    - [ ] Create `DashboardChartDto` (CategoryName, TotalValue, Percentage) in `Inventory.Application/DTOs`.
    - [ ] Create `DashboardAlertDto` (ProductId, ProductName, Sku, TotalQuantity, ReorderPoint) in `Inventory.Application/DTOs`.
    - [ ] Update `DashboardController` in `Inventory.API/Controllers`:
        - [ ] Add `GET /api/v1/dashboard/charts` endpoint.
        - [ ] Add `GET /api/v1/dashboard/alerts` endpoint.
- [ ] **Backend: Business Logic**
    - [ ] Update `IDashboardService` and `DashboardService` in `Inventory.Application`:
        - [ ] Implement `GetStockValueByCategoryAsync`: Group products by Category, sum `Quantity * UnitPrice`, order by Value descending.
        - [ ] Implement `GetLowStockAlertsAsync`: Filter products where `TotalQuantity <= ReorderPoint`, order by `TotalQuantity` ASC (most critical first), take top 5.
    - [ ] **Optimization:** Use `AsNoTracking()` and Projection (`Select`) for efficient aggregation.
- [ ] **Frontend: Feature Implementation**
    - [ ] Update `packages/mf-inventory/src/api/dashboardApi.ts`: Add `fetchCharts` and `fetchAlerts`.
    - [ ] Create `packages/mf-inventory/src/features/dashboard/components/StockValueChart.tsx`: Implement Recharts PieChart.
    - [ ] Create `packages/mf-inventory/src/features/dashboard/components/LowStockAlerts.tsx`: Implement table using `SiesaTable` or simple grid for alerts.
    - [ ] Update `packages/mf-inventory/src/features/dashboard/Dashboard.tsx`:
        - [ ] Integrate new components.
        - [ ] specific `useQuery` hooks for charts and alerts (keys: `['dashboard', 'charts']`, `['dashboard', 'alerts']`).
- [ ] **Testing**
    - [ ] **Backend:** Unit test `DashboardService` aggregation logic for categories and alerting rules.
    - [ ] **Frontend:** Test `StockValueChart` renders checking for data presence. Test `LowStockAlerts` renders correct number of rows.

## Dev Notes

### Technical Requirements
-   **Frameworks:** .NET 10 Web API, React 18 + Vite.
-   **Visualization:** Use **Recharts** for the Pie Chart.
    -   ResponsiveContainer: Ensure chart resizes correctly.
    -   Colors: Use tokens from `siesa-ui-kit` (mapped to Tailwind classes or CSS variables).
-   **Data Access:**
    -   Category aggregation can be expensive. Ensure proper indexing on `CategoryId` if applicable, or perform efficient in-memory grouping if dataset is small (< 10k items). For MVP, DB grouping is preferred.
-   **Styling:**
    -   Chart tooltip should follow Siesa design (custom content).
    -   Alerts table should use `SiesaTable` compact mode if available.

### Architecture Compliance
-   **Clean Architecture:**
    -   Domain logic (what constitutes "Low Stock") should ultimately reside in the Domain or extendable Service, but for MVP simple comparison in Service is acceptable.
    -   DTOs must be flat and specialized for the view.
-   **Naming Conventions:**
    -   API: `/api/v1/dashboard/charts` (plural), `/api/v1/dashboard/alerts` (plural).
    -   JSON: `categoryName`, `totalValue` (camelCase).
-   **Security:**
    -   Maintain `[Authorize(Policy = "InventoryManager")]` on new endpoints.

### Previous Story Intelligence (from Story 1.4)
-   **Pattern:** Extend the existing `DashboardService` and `DashboardController` methods rather than creating new services, to keep dashboard logic cohesive.
-   **Frontend:** The `Dashboard.tsx` is already established as a grid. Append these new widgets to the layout (e.g., Chart on left 2/3, Alerts on right 1/3, or stacked below KPIs).
-   **State:** Continue using TanStack Query. Add `staleTime: 5 * 60 * 1000` (5 mins) for the chart as category limits change slowly. Alerts might need shorter cache (e.g., 1 min).

### File Structure Requirements
-   `services/inventory/src/Inventory.Application/DTOs/DashboardChartDto.cs`
-   `services/inventory/src/Inventory.Application/DTOs/DashboardAlertDto.cs`
-   `services/inventory/src/Inventory.Application/Services/DashboardService.cs` (modified)
-   `services/inventory/src/Inventory.API/Controllers/DashboardController.cs` (modified)
-   `packages/mf-inventory/src/features/dashboard/components/StockValueChart.tsx`
-   `packages/mf-inventory/src/features/dashboard/components/LowStockAlerts.tsx`
-   `packages/mf-inventory/src/features/dashboard/Dashboard.tsx` (modified)

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Completion Notes List
-   Extends Story 1.4 foundation.
-   Added specific DTOs for visualization data.
-   Specified Recharts as the charting library.
-   Defined layout strategy for the new widgets.

### File List
-   services/inventory/src/Inventory.Application/DTOs/DashboardChartDto.cs
-   services/inventory/src/Inventory.Application/DTOs/DashboardAlertDto.cs
-   services/inventory/src/Inventory.Application/Services/DashboardService.cs
-   services/inventory/src/Inventory.API/Controllers/DashboardController.cs
-   packages/mf-inventory/src/features/dashboard/components/StockValueChart.tsx
-   packages/mf-inventory/src/features/dashboard/components/LowStockAlerts.tsx
-   packages/mf-inventory/src/features/dashboard/Dashboard.tsx
