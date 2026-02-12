---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
status: complete
completedAt: '2026-02-11'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# Siesa-Agents - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Siesa-Agents, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can view a high-level summary of "Total SKUs" across all warehouses.
FR2: Users can view the aggregated "Total Stock Value" in the base currency.
FR3: Users can see a count of "Low Stock" items that are below their reorder point.
FR4: Users can see a count of "Out of Stock" items (quantity = 0).
FR5: Users can click on KPI cards (Low Stock, Out of Stock) to navigate to a pre-filtered Product List.
FR6: Users can view a "Stock Value by Category" chart (e.g., Pie Chart) to understand inventory distribution.
FR7: Users can view a tabular list of the top "Low Stock Alerts" directly on the dashboard.
FR8: Users can view a paginated list of all products in the system.
FR9: Users can search for products by "Name" or "SKU" via a global search bar.
FR10: Users can filter the product list by "Category" (e.g., Electronics, Mechanical).
FR11: Users can filter the product list by "Stock Status" (In Stock, Low Stock, Out of Stock).
FR12: Users can sort the product list by "Name", "SKU", "Total Quantity", or "Unit Price".
FR13: Users can view the status of each product with visual indicators (Green/Yellow/Red).
FR14: Users can view detailed information for a specific product (SKU, Description, Category, Reorder Point).
FR15: Users can view a breakdown of stock levels for a specific product across all individual warehouses.
FR16: Users can see the calculated "Stock Value" for a product at each specific warehouse location.
FR17: Users can view the "Total Company Stock" for the product (sum of all warehouses).
FR18: Users can view a list of all active warehouses/distribution centers.
FR19: Users can view key metrics for each warehouse (Total Items held, Total Value held) in the list view.
FR20: Users can navigate to the Inventory module via the Siesa App Shell sidebar.
FR21: The system must automatically authenticate users using the App Shell's shared session (Single Sign-On).
FR22: Users can switch the interface language between English and Spanish.
FR23: The system must persist the user's language preference across sessions (handled by App Shell).

### NonFunctional Requirements

NFR1 (LCP): Largest Contentful Paint must occur within 1.5 seconds on a standard warehouse workstation (i5/8GB) over a 4G connection.
NFR2 (Search Latency): Global product search must return results in under 500ms for the 95th percentile of requests (P95).
NFR3 (Transition): Route transitions between Dashboard and Product Detail must feel instantaneous (< 200ms) once resources are cached.
NFR4 (Availability): The system must be available 99.9% of the time during business hours (Mon-Sat, 6am-10pm).
NFR5 (Recovery): In case of a backend failure, the frontend must display a "graceful degradation" message (e.g., "Offline Mode - Last updated 10m ago") rather than a white screen.
NFR6 (Authentication): The module must strictly use the JWT Token provided by the Siesa App Shell. It must never prompt for credentials itself.
NFR7 (Authorization): API endpoints must validate user permissions (Role: InventoryManager vs WarehouseStaff) before returning sensitive cost data.
NFR8 (Isolation): The microfrontend must use Shadow DOM or strict CSS scoping (Modules/Tailwind prefix) to prevent style bleeding into the App Shell.
NFR9 (Bundle Size): The initial JavaScript bundle size for the microfrontend must not exceed 200KB (gzipped).
NFR10 (Standards): The UI must comply with WCAG 2.1 Level AA.
NFR11 (Keyboard Nav): All interactive elements (Grid rows, Filters) must be navigable via Keyboard (Tab/Arrow keys) for efficiency.

### Additional Requirements

**Architecture:**
- **Starter Template:** Custom Siesa Scaffold (Recommended). Strict adherence to `_siesa-agents/bmm/data/company-standards`.
- **Infrastructure:** .NET 10 Web API, Clean Architecture, DDD. PostgreSQL 18+ (Managed via EF Core). Docker (Alpine Linux based images).
- **Integration:** Strict Single-SPA compliance and Shared Auth (JWT). Coexist with Siesa App Shell and other modules.
- **Data Migration:** Seed Data logic (read-only for MVP). EF Core `OnModelCreating` seeding.
- **Monitoring:** Distributed tracing and structured logging.
- **Security:** Policy-based RBAC in .NET 10.
- **API:** RESTful API with strict resource naming. JSON (System.Text.Json). OpenAPI (Swagger).
- **Frontend:** React 18, TanStack Router/Query, Vite, Single-SPA. Siesa UI Kit + Tailwind CSS v4.

**UX Design:**
- **Design System:** Strict adherence to **Siesa UI Kit**.
- **Responsive:** Desktop First (1920x1080), Tablet Support (1024px).
- **Feedback:** "Cargando inventario..." (Skeleton), "No se encontraron productos...", "No pudimos conectar...".
- **Terminology:** Spanish UI. "SKU / Código", "Almacén / Centro de Distribución", "Nivel de Stock", "Punto de Reorden", "Stock Bajo", "Agotado".
- **Accessibility:** Keyboard navigation, WCAG AA contrast, aria-labels.
- **Visuals:** Siesa Blue (Primary), Green/Yellow/Red status indicators.

### FR Coverage Map

FR1: Epic 1 - Dashboard Total SKUs Summary
FR2: Epic 1 - Dashboard Total Stock Value
FR3: Epic 1 - Dashboard Low Stock Count
FR4: Epic 1 - Dashboard Out of Stock Count
FR5: Epic 2 - Navigate from KPI to Filtered List (Cross-cutting, implemented in Epic 2)
FR6: Epic 1 - Dashboard Stock Value Chart
FR7: Epic 1 - Dashboard Low Stock List
FR8: Epic 2 - Product Catalog List
FR9: Epic 2 - Global Product Search
FR10: Epic 2 - Product List Categories Filter
FR11: Epic 2 - Product List Stock Status Filter
FR12: Epic 2 - Product List Sorting
FR13: Epic 2 - Product List Status Indicators
FR14: Epic 3 - Product Detail Basic Info
FR15: Epic 3 - Product Detail Warehouse Breakdown
FR16: Epic 3 - Product Detail Stock Value per Warehouse
FR17: Epic 3 - Product Detail Total Company Stock
FR18: Epic 1 - Warehouse List View
FR19: Epic 1 - Warehouse Key Metrics
FR20: Epic 1 - App Shell Navigation & Integration
FR21: Epic 1 - App Shell Authentication (SSO)
FR22: Epic 1 - Language Switching (ES/EN)
FR23: Epic 1 - Language Persistence

## Epic List

### Epic 1: Core Inventory Visibility & Dashboard
Enable users to access the module via the App Shell, view real-time aggregated inventory data on a dashboard, and monitor high-level warehouse metrics to make immediate decisions.
**FRs covered:** FR1, FR2, FR3, FR4, FR6, FR7, FR18, FR19, FR20, FR21, FR22, FR23

### Epic 2: Product Catalog & Discovery
Enable users to quickly locate specific products through high-performance global search, filtering, and sorting to answer stock queries and investigate issues.
**FRs covered:** FR5, FR8, FR9, FR10, FR11, FR12, FR13

### Epic 3: Detailed Stock Analysis
Enable users to view granular stock levels for a specific product across all individual warehouses to plan transfers or replenishments and verify specific location data.
**FRs covered:** FR14, FR15, FR16, FR17

## Epic 1: Core Inventory Visibility & Dashboard

Enable users to access the module via the App Shell, view real-time aggregated inventory data on a dashboard, and monitor high-level warehouse metrics to make immediate decisions.

### Story 1.1: Module Initialization & Shell Integration

As a System Administrator,
I want the Inventory Module to be mountable within the Siesa App Shell and consume the shared authentication token,
So that users can access the new module securely without logging in again.

**Acceptance Criteria:**

**Given** the Siesa App Shell is running
**When** the user navigates to `/inventory`
**Then** the Inventory Microfrontend (React 18 + Vite) should mount successfully
**And** the `single-spa` lifecycle methods (bootstrap, mount, unmount) should execute without errors
**And** the module should read the JWT token from the shell props/event bus
**And** the UI should use `siesa-ui-kit` components (e.g., Shell Skeleton)
**And** the directory structure must follow the "Custom Siesa Scaffold" pattern defined in Architecture.

### Story 1.2: Database & Seed Data Setup

As a Developer (on behalf of users),
I want a PostgreSQL database populated with seed data (Products, Warehouses, Stock Levels),
So that the dashboard has meaningful data to display immediately upon deployment.

**Acceptance Criteria:**

**Given** a clean PostgreSQL 18+ instance
**When** the .NET 10 Backend service starts (or migration script runs)
**Then** the `InventoryDbContext` should apply migrations
**And** the database should be seeded with at least:
- 5 Warehouses (North, South, etc.)
- 50+ Products (Widgets, Gadgets)
- Stock entries linking Products to Warehouses
**And** the Entity Framework Core configuration should use `snake_case` for tables and columns
**And** the solution structure must follow Clean Architecture (Domain, Application, Infrastructure, API).

### Story 1.3: Warehouse List & Summary API

As a Logistics Coordinator,
I want to view a list of all distribution centers with their total item count and value,
So that I can identify which warehouses are holding the most inventory.

**Acceptance Criteria:**

**Given** the user is on the Inventory module
**When** they navigate to the "Warehouses" view
**Then** they should see a list of all 5 seeded warehouses
**And** each row should show "Total Items" and "Total Value"
**And** the data must come from a new GET `/api/v1/warehouses` endpoint
**And** the endpoint response must be in JSON `camelCase` format
**And** the UI must use `SiesaTable` component.

### Story 1.4: Dashboard Aggregated KPIs

As an Inventory Manager,
I want to see the Total SKUs, Total Value, Low Stock Count, and Out of Stock Count on the dashboard,
So that I can assess the inventory health in under 5 seconds.

**Acceptance Criteria:**

**Given** the user is on the Dashboard
**When** the page loads
**Then** 4 KPI Cards (Total SKUs, Value, Low Stock, Out of Stock) should appear
**And** the data must be fetched from GET `/api/v1/dashboard/kpis`
**And** the "Total Value" must be formatted as Currency
**And** the load time (LCP) must be under 1.5 seconds
**And** a Skeleton loader should appear while fetching data.

### Story 1.5: Dashboard Visualizations (Chart & Alerts)

As an Inventory Manager,
I want to see a visual breakdown of stock value by category and a list of urgent low-stock alerts,
So that I can prioritize which categories or items need immediate attention.

**Acceptance Criteria:**

**Given** the user is on the Dashboard
**When** they scroll down
**Then** they should see a Pie Chart showing "Stock Value by Category"
**And** they should see a "Top Low Stock Alerts" table with the top 5 critical items
**And** the data must come from GET `/api/v1/dashboard/charts` and `/api/v1/dashboard/alerts`
**And** clicking a "Low Stock" item should eventually link to its detail view (placeholder link for now).

### Story 1.6: Internationalization (i18n)

As a Warehouse User,
I want to switch the interface language between Spanish and English,
So that I can work in my preferred language.

**Acceptance Criteria:**

**Given** the user is viewing the Inventory module
**When** they change the language in the Siesa App Shell
**Then** the Inventory module UI text (Headers, Labels, Buttons) should update immediately
**And** the preference should persist if they reload the page
**And** all hardcoded text must be moved to resource/translation files
**And** technical terms like "SKU" should remain consistent.

## Epic 2: Product Catalog & Discovery

Enable users to quickly locate specific products through high-performance global search, filtering, and sorting to answer stock queries and investigate issues.

### Story 2.1: Product List API with Pagination

As a Developer (on behalf of users),
I want a performant API endpoint to retrieve a paginated list of products,
So that the frontend can display large catalogs without crashing the browser.

**Acceptance Criteria:**

**Given** the database contains 1000+ products
**When** a GET request is made to `/api/v1/products?page=1&pageSize=20`
**Then** the response should contain the first 20 products
**And** the response metadata should include `totalCount`, `totalPages`, `hasNextPage`
**And** the query execution time should be under 200ms
**And** the `ProductDto` should include basic details (Id, SKU, Name, Category, StockStatus).

### Story 2.2: Product List UI

As a Warehouse Staff member,
I want to view a table of all products with their current stock status,
So that I can browse the inventory.

**Acceptance Criteria:**

**Given** the user navigates to the "Products" view
**When** the list loads
**Then** a `SiesaTable` should display the products
**And** columns should include: SKU, Name, Category, Total Quantity, Unit Price, Status
**And** the "Status" column should show a Green/Yellow/Red indicator based on stock level
**And** pagination controls (Next/Prev) should work
**And** loading states should use SiesaSkeleton.

### Story 2.3: Global Search Implementation

As a Warehouse Staff member,
I want to search for products by Name or SKU instantly,
So that I can answer "Do we have X?" questions in under 5 seconds.

**Acceptance Criteria:**

**Given** the user is on the Product List view
**When** they type "Gadget" into the search bar
**Then** the list should update to show only products matching "Gadget" in Name or SKU
**And** the search should be debounced (e.g., 300ms)
**And** the API call should return results in < 500ms (P95 latency)
**And** if no results are found, a clear "No products found" message should appear.

### Story 2.4: Advanced Filtering

As an Inventory Manager,
I want to filter the product list by Category and Stock Status,
So that I can focus on specific segments like "Low Stock Electronics".

**Acceptance Criteria:**

**Given** the user is on the Product List view
**When** they select "Electronics" from the Category dropdown
**And** they select "Low Stock" from the Status dropdown
**Then** the list should only show Electronic items that are Low Stock
**And** the API request should include `?category=Electronics&status=LowStock`
**And** filters should be clearable with a single click.

### Story 2.5: Sorting & KPI Navigation

As an Inventory Manager,
I want to sort the product list by Quantity or Price and navigate directly from Dashboard alerts,
So that I can investigate the most expensive or scarce items first.

**Acceptance Criteria:**

**Given** the user is on the Dashboard
**When** they click the "Low Stock" KPI card
**Then** they should be redirected to the Product List
**And** the "Low Stock" filter should be automatically applied
**And** the user should be able to click column headers to sort by Name, SKU, Quantity, or Price (Asc/Desc).

## Epic 3: Detailed Stock Analysis

Enable users to view granular stock levels for a specific product across all individual warehouses to plan transfers or replenishments and verify specific location data.

### Story 3.1: Product Detail API

As a Developer (on behalf of users),
I want a RESTful API endpoint to retrieve detailed information for a specific product including its stock levels across all warehouses,
So that the frontend can display a complete picture of inventory distribution.

**Acceptance Criteria:**

**Given** a product ID (e.g., `123`)
**When** a GET request is made to `/api/v1/products/123`
**Then** the response should contain the `ProductDto` (SKU, Name, Description, Category, Reorder Point)
**And** the response should include a nested `WarehouseStock` list
**And** each `WarehouseStock` entry should contain `WarehouseName`, `Quantity`, and `StockValue` (Quantity * UnitPrice)
**And** the total company stock (sum of all warehouses) should be calculated or returned.

### Story 3.2: Product Detail UI

As an Inventory Manager,
I want to view the detailed breakdown of stock levels for a product across all warehouses,
So that I can decide where to source inventory from or where to replenish.

**Acceptance Criteria:**

**Given** the user is on the Product List
**When** they click on a product row (e.g., "Widget A")
**Then** they should navigate to the Product Detail view
**And** the transition should feel instantaneous (< 200ms) due to prefetching/caching (TanStack Query)
**And** the view should display the product's basic info in a Header Card
**And** a table below should list each warehouse with its specific stock quantity and value
**And** a "Total Company Stock" summary should be clearly visible.
