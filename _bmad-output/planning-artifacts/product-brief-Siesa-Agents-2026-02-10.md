---
project_name: "Siesa-Agents"
creation_date: "2026-02-10"
status: "Draft"
version: "1.0.0"
authors: ["SiesaTeam", "Gemini"]
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - "03-inventory-module-brief 1.md"
  - "_siesa-agents/bmm/data/company-standards/architecture-patterns.md"
  - "_siesa-agents/bmm/data/company-standards/backend-standards.md"
  - "_siesa-agents/bmm/data/company-standards/database-conventions.md"
  - "_siesa-agents/bmm/data/company-standards/frontend-standards.md"
  - "_siesa-agents/bmm/data/company-standards/technical-preferences-ux.md"
  - "_siesa-agents/bmm/data/company-standards/technology-stack.md"
  - "_siesa-agents/bmm/data/company-standards/vite-config-standard.md"
---

# Product Brief: Siesa-Agents

## 1. Executive Summary

The Inventory Module is a specialized single-spa microfrontend designed to provide comprehensive warehouse and stock visibility within the Siesa ERP system. Upgrading from a mock-based concept to a production-ready architecture, this module features a real-time dashboard with KPIs, a searchable product catalog, and detailed warehouse listings. It is built with **React 18** and **TanStack** on the frontend and powered by a dedicated **.NET 10 microservice** with **PostgreSQL 18+**, strictly adhering to Siesa's Clean Architecture and DDD standards to ensure scalability, data integrity, and seamless integration.

## 2. Product Vision & Value

### Problem Statement
Enterprise inventory management suffers from fragmented data and delayed visibility across multiple warehouse locations. Stakeholders, including Warehouse Staff and Logistics Coordinators, lack a centralized, real-time view of stock levels, leading to inefficient distribution, stockouts, and capital tied up in overstocking.

### Problem Impact
- **Operational Inefficiency:** Manual reconciliation of stock across warehouses.
- **Lost Revenue:** Missed sales opportunities due to inaccurate "Out of Stock" indicators.
- **Financial Loss:** Excessive carrying costs from unidentified overstocking.

### Why Existing Solutions Fall Short
Current manual processes or disconnected spreadsheets fail to provide real-time updates. Previous prototype attempts using "Mock Data" were insufficient for validating the transactional integrity and real-time consistency required for a mission-critical ERP module.

### Proposed Solution
A fully autonomous **Inventory Microfrontend** backed by a **Microservice Architecture**:
-   **Frontend:** React 18, TanStack Router/Query, Single-SPA, using `siesa-ui-kit`.
-   **Backend:** A dedicated **.NET 10 Web API** with **PostgreSQL**, implementing Clean Architecture + DDD.
-   **Data Strategy:** Replaces "Mock Data" with a real relational database schema (Products, Warehouses, StockLevels), seeded with initial data for development.
-   **Key Features:** Dashboard with KPIs (Total Value, Low Stock), Product Catalog (Search/Filter), and Warehouse Views.

### Key Differentiators
-   **True Real-Time Consistency:** Powered by a live SQL backend rather than static JSON mocks.
-   **Enterprise Scalability:** Built on .NET 10 and PostgreSQL 18+ to handle high transaction volumes.
-   **Seamless Integration:** Native Single-SPA integration with the Siesa App Shell and i18n support.

## 3. Target Audience & User Personas

### Primary Users

#### 1. Inventory Manager (Elena)
*   **Role:** Regional Inventory Manager responsible for stock levels across all distribution centers.
*   **Context:** Works from a desktop in the corporate office. Heavy user of the ERP system.
*   **Goal:** Prevent stockouts, minimize excess inventory, and ensure capital efficiency.
*   **Pain Points:** Currently relies on disparate spreadsheets or delayed reports to know what is in each warehouse. Cannot trust the data availability.
*   **Success Vision:** Opening the **Dashboard** and immediately seeing accurate, real-time KPIs. Being able to click "Low Stock" and instantly see which products need reordering without running a manual report.

#### 2. Warehouse Staff (Carlos)
*   **Role:** Floor operator in the Central Warehouse.
*   **Context:** Uses a shared workstation or tablet on the warehouse floor.
*   **Goal:** Quickly answer "Do we have this item?" and "Where is it?" for internal queries or order picking.
*   **Pain Points:** Wasting time walking to locations that are actually empty because the system data is stale.
*   **Success Vision:** Searching for a product SKU in the **Product Catalog** and seeing an exact, trustworthy quantity for his specific warehouse location.

### Secondary Users

#### 1. Logistics Coordinator (Miguel)
*   **Role:** Plans distribution routes and inter-warehouse transfers.
*   **Interest:** Needs the **Warehouse List** and aggregated stock views to decide which warehouse should fulfill a large order or if a transfer is needed.
*   **Key Interaction:** Viewing the **Product Detail** screen to compare stock levels across "North", "Central", and "South" warehouses side-by-side.

### User Journey: Elena's Morning Routine
1.  **Log in:** Elena logs into the Siesa ERP shell.
2.  **Switch Module:** She clicks the "Inventory" icon in the sidebar (App Shell integration).
3.  **Instant Insight:** The **Dashboard** loads. She sees a red alert: "Low Stock: 12 items".
4.  **Investigation:** She clicks the "Low Stock" card (Navigation).
5.  **Analysis:** The **Product Catalog** opens, auto-filtered to show only the 12 items. She sorts by "Reorder Point".
6.  **Deep Dive:** She clicks "Widget A". The **Product Detail** view shows it is out of stock in "North" but has 100 units in "Central".
7.  **Decision:** She has the data she needs to request a transfer (out of scope for MVP, but the *decision* is enabled by the view).

## 4. Key Features & Requirements

### User Success Metrics
*   **Information Retrieval Speed:** Warehouse staff can locate product stock levels across all locations in **under 5 seconds** via the global search.
*   **Decision Confidence:** Inventory managers trust the **Dashboard KPIs** enough to make reordering decisions without needing to verify with physical warehouse checks.
*   **System Responsiveness:** Users experience "instant" page loads (under 1.5s) for critical views like the Dashboard and Product Catalog, fostering a fluid workflow.

### Business Objectives
*   **Inventory Visibility:** Achieve 100% real-time visibility of stock across all distribution centers, eliminating data silos.
*   **Technical Modernization:** Successfully deploy a production-grade **.NET 10 Microservice** that adheres to Clean Architecture standards, serving as a reference for future modules.
*   **Operational Efficiency:** Reduce the man-hours spent on manual inventory reconciliation and report generation.

### Key Performance Indicators (KPIs)

| Metric | Target | Rationale |
| :--- | :--- | :--- |
| **Dashboard Load Time (LCP)** | < 1.5 seconds | Ensures a high-performance UX consistent with Siesa standards. |
| **API Latency (P95)** | < 500ms | Verifies the efficiency of the .NET 10 backend and PostgreSQL queries. |
| **Data Freshness** | Real-time (< 1s) | Time between a stock change and its reflection on the Dashboard. |
| **System Uptime** | 99.9% | Critical for warehouse operations continuity. |

## 5. Success Metrics (KPIs)
<!-- To be filled in Step 5 -->
Pending discovery.

## 6. MVP Scope

### Core Features
*   **Real-Time Dashboard:** Displays aggregated KPIs (Total SKUs, Total Value, Low Stock Alerts) directly from the PostgreSQL database.
*   **Product Catalog:** Server-side paginated list with Filtering (Category, Status) and Search (Name, SKU).
*   **Product Detail View:** Comprehensive view of a single product's stock levels across all configured warehouses.
*   **Warehouse Listing:** Summary view of distribution centers with their specific KPIs.
*   **Shell Integration:** Fully functional Sidebar navigation and Module Switcher within the Single-SPA environment.
*   **Localization:** Complete UI translation for English and Spanish.

### Out of Scope for MVP
*   **Product Management (C/U/D):** Users cannot Create, Update, or Delete product definitions (Data will be seeded via SQL scripts).
*   **Inventory Transactions:** No features to process stock movements, adjustments, or transfers between warehouses.
*   **Hardware Integration:** No support for Barcode or QR code scanning.
*   **Advanced Reporting:** No "Export to Excel/PDF" functionality or historical trend analysis.

### MVP Success Criteria
*   **Integration Verification:** The module loads seamlessly within the Siesa App Shell, sharing the Authentication context.
*   **Performance Benchmark:** The Dashboard and Product List load in under 1.5 seconds with a dataset of 50+ products.
*   **Data Integrity:** Stock values displayed on the Dashboard match exactly with the sum of warehouse-level stock in the database.

### Future Vision
*   **Phase 2 (Transactional):** Enable "Inventory Managers" to process stock transfers and adjustments directly in the UI.
*   **Phase 3 (Optimization):** Implement "Reorder Recommendations" based on historical consumption trends.
*   **Phase 4 (Mobility):** Develop a companion PWA for "Warehouse Staff" to perform cycle counts using camera-based barcode scanning.

## 7. Timeline & Milestones
<!-- To be filled in Step 6 -->
Pending finalization.

---
*Generated by BMAD Product Brief Workflow*
