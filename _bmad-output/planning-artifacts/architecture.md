---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-02-11'

inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/product-brief-Siesa-Agents-2026-02-10.md
  - 03-inventory-module-brief 1.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
workflowType: 'architecture'
project_name: 'Siesa-Agents'
user_name: 'SiesaTeam'
date: '2026-02-11'
communication_language: 'es'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The Inventory Module is a critical component for warehouse visibility, focusing on real-time data access and decision support.
- **Dashboard:** Centralized view with aggregated KPIs (Total SKUs, Value, Low Stock) and visualizations (Pie Chart) for immediate status assessment.
- **Product Catalog:** High-performance search (Name/SKU) and filtering (Category, Status) to locate items quickly.
- **Product Details:** Granular view of stock levels across specific warehouse locations (North, Central, South).
- **Warehouse Management:** High-level summary of distribution centers.
- **Integration:** Seamless operation within the Siesa App Shell (Sidebar, SSO, i18n).

**Non-Functional Requirements:**
Architectural decisions will be heavily influenced by strict performance and integration standards:
- **Performance:** Sub-1.5s LCP and sub-500ms search latency require efficient API design and frontend caching strategies (TanStack Query).
- **Integration:** Strict Single-SPA compliance and Shared Auth (JWT) dictate the frontend lifecycle and security model.
- **UX/UI:** Adherence to Siesa UI Kit and WCAG 2.1 AA standards.
- **Resilience:** Graceful degradation in case of backend failure.

**Scale & Complexity:**
- **Primary Domain:** Enterprise ERP / Inventory Management.
- **Complexity Level:** Medium. While the scope is well-defined (Read-heavy MVP), the strict performance and integration constraints add architectural rigor.
- **Estimated Architectural Components:** ~5 (Frontend MFE, Backend API, Database, Auth Integration, Seed Data logic).
- **Project Type:** Greenfields Microfrontend + Microservice.

### Technical Constraints & Dependencies

- **Frontend:** React 18, TanStack Router/Query, Vite, Single-SPA.
- **Backend:** .NET 10 Web API, Clean Architecture, DDD.
- **Database:** PostgreSQL 18+.
- **Ecosystem:** Must coexist with Siesa App Shell and other modules (Finance).
- **Standards:** Strict adherence to `siesa-ui-kit` and company architectural patterns.

### Cross-Cutting Concerns Identified

- **Authentication & Authorization:** Consuming shell-provided tokens and enforcing RBAC at the API level.
- **Internationalization (i18n):** Global support for ES/EN, synchronized with the shell.
- **Observability:** Distributed tracing and structured logging to monitor the < 500ms targets.
- **Data Consistency:** Ensuring dashboard aggregates match detail rows (eventual vs strong consistency).

## Starter Template Evaluation

### Primary Technology Domain
Enterprise Microfrontend (Single-SPA) & Microservice API.

### Starter Options Considered
1.  **Standard Vite Starter (`npm create vite`)**: Good for React, but lacks Single-SPA and .NET integration.
2.  **T3 Stack**: Too opinionated towards Next.js/Serverless, conflicts with .NET/Clean Architecture requirement.
3.  **Custom Siesa Scaffold (Recommended)**: Manual setup of Frontend (Vite+React+SingleSPA) and Backend (.NET 10 Clean Arch) to strictly follow company standards.

### Selected Starter: Custom Siesa-Compliant Scaffold

**Rationale for Selection:**
Strict adherence to `_siesa-agents/bmm/data/company-standards` requires a specific directory structure and library set (Single-SPA, Siesa UI Kit, .NET 10) that no public starter provides out-of-the-box. We will initialize the Frontend and Backend explicitly to match the `architecture-patterns.md`.

**Initialization Strategy:**

*   **Frontend:** Vite + React 18 + TypeScript + Single-SPA plugin.
*   **Backend:** .NET 10 Solution with Clean Architecture layers (Domain, Application, Infrastructure, API).

**Architectural Decisions Provided by Standard:**

**Language & Runtime:**
- Frontend: TypeScript 5.x / Node.js 22+ (LTS)
- Backend: C# 14 / .NET 10

**Styling Solution:**
- `siesa-ui-kit` (Company Standard) + Tailwind CSS v4 (Utility-first)

**Build Tooling:**
- Vite 6.x (Fast HMR, Module Federation support via plugin)

**Testing Framework:**
- Frontend: Vitest + Testing Library
- Backend: xUnit + Moq + FluentAssertions

**Code Organization:**
- Frontend: Feature-based (routes/dashboard, routes/products)
- Backend: Clean Architecture (Core/Domain independent of Infrastructure)

**Development Experience:**
- Bi-directional Type Safety (OpenAPI generated types)
- Hot Module Replacement (HMR) for Microfrontends

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- **Data Validation Strategy:** Dual-layer validation (Zod on Client, FluentValidation on Server) to ensure data integrity and UX.
- **State Management:** TanStack Query for server state synchronization to meet the < 1.5s LCP requirement.
- **Authorization Pattern:** Policy-based RBAC in .NET 10 to secure cost data.

**Important Decisions (Shape Architecture):**
- **API Documentation:** OpenAPI (Swagger) enabling client client generation.
- **Containerization:** Dockerfile optimization for .NET 10 (Standard Runtime).

### Data Architecture

- **Database:** PostgreSQL 18+ (Managed via EF Core).
- **ORM:** Entity Framework Core 10.
- **Validation:** FluentValidation for business rules; Zod for form inputs.
- **Seeding:** EF Core `OnModelCreating` seeding for MVP data.

### Authentication & Security

- **Strategy:** Stateless JWT consumption (Token provided by App Shell).
- **Validation:** .NET `JwtBearer` middleware validation against Identity Provider public key.
- **Authorization:** Policy-based (e.g., `RequireRole("InventoryManager")`).

### API & Communication Patterns

- **Style:** RESTful API with strict resource naming.
- **Format:** JSON (System.Text.Json).
- **Documentation:** Swashbuckle / OpenAPI v3.
- **Error Handling:** RFC 7807 `ProblemDetails` via Global Exception Handler.

### Frontend Architecture

- **Framework:** React 18 (Concurrent features enabled).
- **Routing:** TanStack Router (Type-safe file-based routing).
- **State:** TanStack Query (Caching, Optimistic Updates).
- **Lifecycle:** Single-SPA `bootstrap`, `mount`, `unmount`.
- **Forms:** React Hook Form + Zod resolver.

### Infrastructure & Deployment

- **Containerization:** Docker (Alpine Linux based images for size).
- **Orchestration:** Docker Compose for local dev (Database + API).
- **CI/CD:** GitHub Actions (Build, Test, Lint).

### Decision Impact Analysis

**Implementation Sequence:**
1.  **Backend Core:** Entities & EF Core configurations.
2.  **API Layer:** Endpoints with Dummy Data -> Real DB.
3.  **Frontend Shell:** Single-SPA integration test.
4.  **Frontend Features:** Dashboard & Lists connecting to API.

**Cross-Component Dependencies:**
- Frontend Types generation depends on Backend OpenAPI spec.
- Auth policies in Backend must match roles provided by App Shell token.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
Database naming vs API JSON casing, and file naming conventions between .NET and React ecosystems.

### Naming Patterns

**Database Naming Conventions:**
- **Tables:** `snake_case` (e.g., `product_stock_levels`).
- **Columns:** `snake_case` (e.g., `reorder_point`).
- **Keys:** `pk_table_name`, `fk_table_column`.

**API Naming Conventions:**
- **Endpoints:** `kebab-case` plural nouns (e.g., `/api/v1/inventory-items`).
- **JSON Properties:** `camelCase` (e.g., `totalQuantity`).
- **Query Params:** `camelCase` (e.g., `?pageNumber=1`).

**Code Naming Conventions:**
- **C# Classes/Methods:** `PascalCase`.
- **TS Interfaces/Components:** `PascalCase`.
- **TS Variables/Functions:** `camelCase`.
- **File Names (Frontend):** `kebab-case` (e.g., `product-detail.tsx`).
- **File Names (Backend):** `PascalCase` (e.g., `ProductService.cs`).

### Structure Patterns

**Project Organization:**
- **Frontend:** Feature-first. `src/features/dashboard`, `src/features/products`. Shared UI in `src/components`.
- **Backend:** Clean Architecture Layers. `Domain` (Entities), `Application` (UseCases), `Infrastructure` (EF Core), `API` (Controllers).

**File Structure Patterns:**
- **Tests:** Backend tests in separate `Inventory.UnitTests` project. Frontend tests co-located in `__tests__` folder within features.

### Format Patterns

**API Response Formats:**
- **Success (Item):** Direct JSON object.
- **Success (List):** `{ data: T[], meta: { totalCount, page, pageSize } }`.
- **Error:** RFC 7807 `ProblemDetails`.

**Data Exchange Formats:**
- **Dates:** ISO 8601 UTC string (`2023-10-27T10:00:00Z`).
- **Currency:** Decimals sent as numbers (Frontend formats).

### Process Patterns

**Error Handling Patterns:**
- **Backend:** Throw Custom Exceptions (e.g., `NotFoundException`) -> Caught by Global Middleware -> Converted to 404 ProblemDetails.
- **Frontend:** Catch 4xx/5xx in TanStack Query `onError` -> Show Toast or Error Boundary.

**Loading State Patterns:**
- **UI:** Use `SiesaSkeleton` matching the content shape during `isLoading`.
- **UX:** Avoid blocking whole page; block only the widget loading.

### Enforcement Guidelines

**All AI Agents MUST:**
- Respect the `kebab-case` file naming for React files to ensure cross-OS compatibility.
- Use `System.Text.Json` naming policies to convert Pascal (C#) to camel (JSON) automatically.

**Pattern Examples:**

**Good Example (Frontend Service):**
```typescript
// inventory-service.ts
export const getStockLevel = async (id: string): Promise<StockLevel> => {
  const { data } = await api.get(`/inventory-items/${id}/stock`);
  return data;
};
```

**Anti-Pattern:**
```typescript
// InventoryService.ts (Wrong casing)
function GetStock(ID: string) { ... } // Wrong casing
```

## Project Structure & Boundaries

### Complete Project Directory Structure
```
/
├── packages/
│   └── mf-inventory/              # React Microfrontend
│       ├── package.json
│       ├── vite.config.ts         # Vite + Single-SPA Config
│       ├── tsconfig.json
│       ├── src/
│       │   ├── root.component.tsx # Single-SPA Lifecycle (Bootstrap/Mount/Unmount)
│       │   ├── index.tsx          # Standalone Dev Entry
│       │   ├── App.tsx            # Main Layout/Router Provider
│       │   ├── api/               # API Clients (generated or manual)
│       │   ├── components/        # Shared Atoms/Molecules (Wrappers of Siesa UI Kit)
│       │   ├── features/          # Feature Modules
│       │   │   ├── dashboard/     # Dashboard Widgets & Logic
│       │   │   ├── products/      # Catalog & Detail Views
│       │   │   └── warehouses/    # Warehouse Listing
│       │   ├── hooks/             # Custom Hooks (useAuth, useTheme)
│       │   ├── types/             # Shared TS Types
│       │   └── utils/             # Formatters, Helpers
│       └── __tests__/             # Unit/Component Tests
├── services/
│   └── inventory/                 # .NET 10 Microservice
│       ├── Inventory.sln
│       ├── src/
│       │   ├── Inventory.API/           # Web API Layer
│       │   │   ├── Controllers/
│       │   │   ├── Middleware/      # Error Handling, Auth
│       │   │   ├── Program.cs
│       │   │   └── Dockerfile
│       │   ├── Inventory.Application/   # Application Logic (MediatR/Services)
│       │   │   ├── Contracts/       # Interfaces
│       │   │   ├── DTOs/
│       │   │   ├── Mappers/
│       │   │   └── Services/        # Business Logic Implementation
│       │   ├── Inventory.Domain/        # Core Domain Entities (No dependencies)
│       │   │   ├── Entities/        # Product, Warehouse, StockLevel
│       │   │   └── ValueObjects/
│       │   └── Inventory.Infrastructure/# Database & External Concerns
│       │       ├── Persistence/
│       │       │   ├── Configurations/ # EF Core TypeConfigs
│       │       │   ├── InventoryDbContext.cs
│       │       │   └── Migrations/
│       │       └── Repositories/
│       └── tests/
│           ├── Inventory.UnitTests/
│           └── Inventory.IntegrationTests/
├── docker-compose.yml             # Orchestration for Dev (DB + API)
└── README.md
```

### Architectural Boundaries

**API Boundaries:**
- **Public API:** `src/Inventory.API/Controllers/*` (Exposed via Port 5000/5001).
- **Frontend Client:** `packages/mf-inventory/src/api/client.ts` (Consumes API).

**Component Boundaries:**
- **Shell vs MFE:** MFE must not access Shell DOM directly. Communication via Custom Events or passed Props (Auth Token).
- **Feature vs Feature:** Features (Dashboard vs Products) should be loosely coupled. Navigation via URL changes, not direct imports.

**Data Boundaries:**
- **Database:** `InventoryDbContext` is the ONLY access point to the Postgres DB. No raw SQL in Controllers.
- **DTOs:** API returns DTOs, never Domain Entities directly.

### Requirements to Structure Mapping

**Feature/Epic Mapping:**
- **Dashboard (FR1-FR7):**
    - UI: `packages/mf-inventory/src/features/dashboard/*`
    - API: `Inventory.API/Controllers/DashboardController.cs`
- **Product Catalog (FR8-FR13):**
    - UI: `packages/mf-inventory/src/features/products/ProductList.tsx`
    - Logic: `Inventory.Application/Services/ProductService.cs`
- **Warehouse List (FR18-FR19):**
    - UI: `packages/mf-inventory/src/features/warehouses/*`
    - Data: `Inventory.Domain/Entities/Warehouse.cs`

**Cross-Cutting Concerns:**
- **Auth:** `Inventory.API/Middleware/JwtMiddleware.cs` & `packages/mf-inventory/src/hooks/useAuth.ts`.
- **Validation:** `Inventory.Application/Validators/*` (FluentValidation) & `packages/mf-inventory/src/features/*/schema.ts` (Zod).

### File Organization Patterns

**Source Organization:**
- **Frontend:** Co-location of styles (modules.css), tests (`.test.tsx`), and logic (`hooks.ts`) within feature folders.
- **Backend:** Separation of concerns by Project (Assembly). `Domain` -> `Application` -> `Infrastructure` -> `API`.

**Test Organization:**
- **Frontend:** Vitest files alongside components.
- **Backend:** xUnit projects mirroring the source structure (`Inventory.UnitTests/Application/Services/...`).

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
The selection of **.NET 10 Web API** and **React 18 Microfrontend** is highly compatible, utilizing standard REST/JSON communication. **Vite** facilitates the Single-SPA build process efficiently.

**Pattern Consistency:**
Naming conventions specifically address the C# (PascalCase) vs JSON/JS (camelCase) impedance mismatch, ensuring `System.Text.Json` policies handle serialization seamlessly.

**Structure Alignment:**
The monorepo-style structure (`packages/` vs `services/`) clearly separates concerns while allowing for unified orchestration via `docker-compose`.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
- **Dashboard (FR1-7):** Supported by `DashboardController` aggregation endpoints and Recharts on frontend.
- **Catalog (FR8-13):** Supported by `ProductController` with filtering/pagination params.
- **Detail (FR14-17):** Supported by dedicated `GetById` endpoints and Domain Entities.
- **Integration (FR20-23):** Supported by `root.component.tsx` lifecycle and `useAuth` hooks.

**Non-Functional Requirements Coverage:**
- **Performance:** Sub-1.5s LCP supported by TanStack Query caching and efficient .NET JSON serialization.
- **Security:** Policy-based Authorization (`RequireRole`) covers the RBAC requirement.
- **Isolation:** CSS Scoping (via Siesa UI Kit/Modules) prevents style bleeding.

### Implementation Readiness Validation ✅

**Decision Completeness:**
All critical stack choices (Language, Framework, DB, ORM, Auth) are finalized with version numbers.

**Structure Completeness:**
Full directory tree provided, including test locations and build configurations.

**Pattern Completeness:**
Concrete examples for Naming, API calls, and Directory structure are documented to guide AI coding agents.

### Gap Analysis Results

**Priority: Low (Non-Blocking)**
- **Detailed API Schemas:** While endpoints are defined, the exact OpenAPI YAML is not yet generated (will be done during implementation).
- **Seed Data Scripts:** Exact SQL for initial data needs to be written.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH. The architecture leverages established patterns (Clean Arch, Single-SPA) standardized by the company, reducing risk.

**Key Strengths:**
- Strong separation of concerns (Frontend MFE vs Backend Service).
- Type safety across the stack (TS + C#).
- Clear integration path with Siesa App Shell.

**Areas for Future Enhancement:**
- Event-Driven Architecture (RabbitMQ/Kafka) for inter-module communication (Phase 2).
- Real-time WebSockets for "Live" stock updates (currently polling).

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and boundaries.
- Refer to this document for all architectural questions.

**First Implementation Priority:**
Initialize the Project Structure (Scaffold) using the defined directory tree.





