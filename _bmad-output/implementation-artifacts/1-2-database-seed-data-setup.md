# Story 1.2: Database & Seed Data Setup

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer (on behalf of users),
I want a PostgreSQL database populated with seed data (Products, Warehouses, Stock Levels),
so that the dashboard has meaningful data to display immediately upon deployment.

## Acceptance Criteria

1.  **Given** a clean PostgreSQL 18+ instance
2.  **When** the .NET 10 Backend service starts (or migration script runs)
3.  **Then** the `InventoryDbContext` should apply migrations
4.  **And** the database should be seeded with at least:
    - 5 Warehouses (North, South, etc.)
    - 50+ Products (Widgets, Gadgets)
    - Stock entries linking Products to Warehouses
5.  **And** the Entity Framework Core configuration should use `snake_case` for tables and columns
6.  **And** the solution structure must follow Clean Architecture (Domain, Application, Infrastructure, API).

## Tasks / Subtasks

- [x] Initialize .NET 10 Solution & Projects in `services/inventory`
    - [x] Create `Inventory.sln`
    - [x] Create `src/Inventory.Domain` (Class Lib)
    - [x] Create `src/Inventory.Application` (Class Lib)
    - [x] Create `src/Inventory.Infrastructure` (Class Lib)
    - [x] Create `src/Inventory.API` (Web API)
    - [x] Create `tests/Inventory.UnitTests` (xUnit)
    - [x] Setup project references (API -> Infra -> App -> Domain)
- [x] Implement Domain Entities in `Inventory.Domain`
    - [x] Create `Warehouse` entity (Id, Name, Location)
    - [x] Create `Product` entity (Id, SKU, Name, Description, Category, ReorderPoint, UnitPrice)
    - [x] Create `StockLevel` entity (WarehouseId, ProductId, Quantity)
    - [x] Configure Entity relationships (One-to-Many, Many-to-Many)
- [x] Implement Infrastructure & Persistence in `Inventory.Infrastructure`
    - [x] Install `Npgsql.EntityFrameworkCore.PostgreSQL` and `EFCore.NamingConventions`
    - [x] Implement `InventoryDbContext` inheriting from `DbContext`
    - [x] Configure `snake_case` naming convention (UseSnakeCaseNamingConvention)
    - [x] Configure Connection String handling
- [x] Implement Data Seeding
    - [x] Use `HasData` in `OnModelCreating` or a dedicated `ModelBuilder` extension
    - [x] Generate 5 Warehouses (North, South, East, West, Central)
    - [x] Generate 50+ Products (Categorized: Electronics, Mechanical, etc.)
    - [x] Generate Stock Levels for products in warehouses
- [x] Docker & Orchestration
    - [x] Create `Dockerfile` for Inventory.API
    - [x] Create/Update `docker-compose.yml` in project root to include Postgres and Inventory.API
- [x] Verification
    - [x] Run Migrations (`dotnet ef database update`)
    - [x] Verify Data in Database (inspect using psql or similar during dev)

## Dev Notes

- **Architecture:** Clean Architecture + DDD.
- **Database:** PostgreSQL 18+.
- **ORM:** EF Core 10.
- **Naming:** STRICT `snake_case` for DB tables/columns. Use `EFCore.NamingConventions` package.
- **Seeding:** Use `HasData` for MVP static data to ensure consistency across environments.
- **Structure:** Follow the folder structure defined in `architecture.md`.

### Project Structure Notes

- **Root:** `services/inventory/`
- **Projects:**
    - `src/Inventory.Domain`: Core entities, no external dependencies.
    - `src/Inventory.Application`: Interfaces, DTOs (if needed for seeding/setup), Logic.
    - `src/Inventory.Infrastructure`: EF Core, PostgreSQL implementation.
    - `src/Inventory.API`: Entry point, Program.cs, Dockerfile.
    - `tests/Inventory.UnitTests`: Unit tests.

### References

- **Epics:** `_bmad-output/planning-artifacts/epics.md` (Story 1.2)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Clean Architecture, Database, Seed Data)
- **Tech Stack:** .NET 10, PostgreSQL 18.

## Dev Agent Record

### Agent Model Used

Google Gemini 3 Pro Preview (Adversarial Review by Claude Code)

### Debug Log References

### Completion Notes List

- Implemented standard .NET 10 Clean Architecture solution structure.
- Configured Entity Framework Core with Npgsql and SnakeCaseNamingConvention.
- Implemented `InventoryDbContext` with composite key configuration for `StockLevel`.
- Created `ModelBuilderExtensions` to seed 5 warehouses and 50 products with deterministic UUIDs.
- Configured `docker-compose.yml` to run Postgres on port 5433 (to avoid conflict with shared siesa-postgres on 5432).
- Updated `appsettings.json` to point to port 5433 and auto-apply migrations on startup (via `dotnet ef database update`).
- Verified database tables and data using `psql` inside the container.
- All 6 Acceptance Criteria passed.
- **Review Updates:**
    - Fixed `Program.cs` to remove WeatherForecast code and implement automatic migration application on startup.
    - Added `DomainTests.cs` to `Inventory.UnitTests` to verify domain entities and seeding logic structures.
    - Removed invalid `WarehouseDtoTests.cs`.

### File List

- `services/inventory/Inventory.sln`
- `services/inventory/src/Inventory.Domain/Entities/Warehouse.cs`
- `services/inventory/src/Inventory.Domain/Entities/Product.cs`
- `services/inventory/src/Inventory.Domain/Entities/StockLevel.cs`
- `services/inventory/src/Inventory.Infrastructure/Inventory.Infrastructure.csproj`
- `services/inventory/src/Inventory.Infrastructure/DependencyInjection.cs`
- `services/inventory/src/Inventory.Infrastructure/Persistence/InventoryDbContext.cs`
- `services/inventory/src/Inventory.Infrastructure/Persistence/ModelBuilderExtensions.cs`
- `services/inventory/src/Inventory.Infrastructure/Migrations/*`
- `services/inventory/src/Inventory.API/Inventory.API.csproj`
- `services/inventory/src/Inventory.API/Program.cs`
- `services/inventory/src/Inventory.API/appsettings.json`
- `services/inventory/src/Inventory.API/Dockerfile`
- `services/inventory/tests/Inventory.UnitTests/Inventory.UnitTests.csproj`
- `services/inventory/tests/Inventory.UnitTests/DomainTests.cs`
- `docker-compose.yml`
