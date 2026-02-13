# Story 3.1: Product Detail API

**Status:** ready-for-dev
**Story:** 3.1
**Epic:** 3 - Detailed Stock Analysis
**Author:** SiesaTeam (BMad Workflow)

## STORY REQUIREMENTS

### User Story

**As a** Developer (on behalf of users),
**I want** a RESTful API endpoint to retrieve detailed information for a specific product including its stock levels across all warehouses,
**So that** the frontend can display a complete picture of inventory distribution.

### Acceptance Criteria

- [ ] **Endpoint:** `GET /api/v1/products/{id}`
- [ ] **Response Structure:** Return a `ProductDetailDto` containing:
    - Basic Info: `id`, `sku`, `name`, `description`, `category`, `reorderPoint`.
    - Calculated: `totalCompanyStock` (Sum of quantities), `stockStatus` (derived).
    - Breakdown: `warehouseStock` list.
- [ ] **Warehouse Stock Entry:** Each item in the breakdown must include:
    - `warehouseId`
    - `warehouseName`
    - `quantity`
    - `stockValue` (Calculated: `quantity` * `unitPrice`).
- [ ] **Data Source:** Must query `Products` table and Includes `StockLevels` and `Warehouses`.
- [ ] **Error Handling:** Return `404 Not Found` if product ID does not exist.
- [ ] **Performance:** Query should be optimized (avoid N+1) using EF Core `.Include()`.

---

## DEVELOPER CONTEXT COMPENDIUM

### 1. Technical Implementation Guidelines

**Architecture & Patterns:**
- **Layering:** Follow Strict Clean Architecture.
    - **API:** `ProductsController` (Presentation).
    - **Application:** `IProductService` / `ProductService` (Business Logic & Mapping).
    - **Domain:** `Product`, `StockLevel`, `Warehouse` (Entities).
    - **Infrastructure:** `InventoryDbContext` (Data Access).
- **Mapping:** Use manual mapping or `Mapster`/`AutoMapper` (Project standard seems to be manual or specific helper, check `Inventory.Application`). *Optimization:* Ensure mapping logic handles the `StockValue` calculation (`Quantity * UnitPrice`).
- **Data Access:** Use `inventoryContext.Products.Include(p => p.StockLevels).ThenInclude(sl => sl.Warehouse)...`

**Required Changes:**

1.  **Modify `Inventory.Application/Contracts/IProductService.cs`:**
    - Add `Task<ProductDetailDto?> GetProductByIdAsync(int id);`

2.  **Modify `Inventory.Application/Services/ProductService.cs`:**
    - Implement `GetProductByIdAsync`.
    - Logic: `_context.Products.AsNoTracking().Include(...).FirstOrDefaultAsync(...)`.
    - Map to `ProductDetailDto`.

3.  **Modify `Inventory.API/Controllers/ProductsController.cs`:**
    - Add `[HttpGet("{id}")]`.
    - Logic: Call service. If null -> `NotFound()`. Else -> `Ok(dto)`.

4.  **Create DTOs (`Inventory.Application/DTOs/`):**
    - `ProductDetailDto.cs` (Extends or separate from `ProductDto`? Better separate to avoid over-fetching in list view).
    - `WarehouseStockDto.cs` (Can be inside `ProductDetailDto.cs` or separate).

### 2. Architecture Compliance & Guardrails

- **Naming Conventions:**
    - C# Classes: `PascalCase` (`ProductDetailDto`).
    - JSON Properties: `camelCase` (handled by serializer).
    - Endpoint: `/api/v1/products/{id}` (Standard REST).
- **Error Handling:**
    - Use `NotFoundException` in Service or return null?
    - *Pattern:* If service returns null, Controller returns `NotFound()`.
- **Performance:**
    - Use `AsNoTracking()` for read-only queries.
    - Validate `Include` chains to specific strict navigation properties.

### 3. File Structure & Location Requirements

- **DTOs:** `services/inventory/src/Inventory.Application/DTOs/ProductDetailDto.cs`
- **Interface:** `services/inventory/src/Inventory.Application/Contracts/IProductService.cs`
- **Implementation:** `services/inventory/src/Inventory.Application/Services/ProductService.cs`
- **Controller:** `services/inventory/src/Inventory.API/Controllers/ProductsController.cs`
- **Tests:**
    - `services/inventory/tests/Inventory.UnitTests/Services/ProductServiceTests.cs`
    - `services/inventory/tests/Inventory.UnitTests/Controllers/ProductsControllerTests.cs`

### 4. Testing Requirements

- **Unit Tests:**
    - **Service:** Mock `InventoryDbContext` (or use In-Memory/Sqlite if configured for integration). Test calculation of `TotalCompanyStock` and `StockValue`.
    - **Controller:** Test `200 OK` generic return and `404 Not Found`.
- **Integration Tests:** (Optional for this story if Unit Tests cover logic, but recommended to verify EF Includes).

---

## PREVIOUS STORY INTELLIGENCE
*From Story 2.1 (Product List API)*

- **Learnings:**
    - `ProductService` already exists. Extend it, do not create a duplicate service.
    - Check if `ProductDto` is reused. Recommendation: Create a dedicated `ProductDetailDto` because it contains the `WarehouseStock` list which is expensive/unnecessary for the list view.
    - Ensure `UnitPrice` is handled with correct exact precision (decimal).

---

## LATEST TECHNICAL SPECIFICS
*(Simulated for .NET 10 Context)*

- **EF Core 10:**
    - Use `AsSplitQuery()` if the breakdown list causes a Cartesian explosion, though for a single product with ~5 warehouses, single query is fine.
- **REST Protocol:**
    - ID parameter should be validated (positive integer).

---

## PROJECT CONTEXT REFERENCE

- **Architecture:** `_bmad-output/planning-artifacts/architecture.md`
- **UX Design:** `_bmad-output/planning-artifacts/ux-design-specification.md` (Reference for data fields needed)
- **PRD:** `_bmad-output/planning-artifacts/prd.md`

---

## STORY COMPLETION STATUS

**Definition of Done:**
1.  Allowed methods: `GET`.
2.  Response format matches `ProductDetailDto` specific structure.
3.  Unit tests passing.
4.  Swagger/OpenAPI shows input/output correct.
5.  Project builds without warnings.

**Ready for Dev?** YES.
