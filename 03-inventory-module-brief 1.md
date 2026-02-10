# Inventory Module Brief

## Executive Summary

The Inventory Module is a single-spa microfrontend providing warehouse and stock visibility for the ERP system. It includes a dashboard with KPIs, product catalog browsing, product details, and warehouse listing. Built with React and TanStack, it demonstrates data table patterns and master-detail navigation while operating as a fully autonomous microfrontend.

## Problem Statement

Inventory management in enterprises requires:

- **Stock visibility** across multiple warehouses
- **Product catalog access** with search and filtering capabilities
- **Warehouse overview** for distribution planning

Workshop participants need to implement a module that showcases these patterns while demonstrating microfrontend architecture principles.

## Proposed Solution

Develop a React-based microfrontend featuring:

- Inventory dashboard with key metrics and alerts
- Product catalog with search and filters
- Product detail view with stock by warehouse
- Warehouse listing
- Sidebar navigation with module switcher integration
- Full i18n support for English and Spanish

## Target Users

| User Type | Description |
|-----------|-------------|
| **Warehouse Staff** | View product information and stock levels |
| **Inventory Managers** | Monitor stock KPIs and alerts |
| **Logistics Coordinators** | Review warehouse distribution |

## MVP Scope

### In Scope

- Dashboard with inventory KPIs and low stock alerts
- Product catalog list (read-only)
- Product detail view with stock by warehouse (read-only)
- Warehouse list (read-only)
- Sidebar menu with module switcher
- Standalone development mode
- Full i18n support for all UI text

### Out of Scope

- Create/Edit/Delete operations
- Stock movements
- Barcode/QR scanning
- Reports generation
- Export functionality

## Technical Requirements

```
Framework: React 18+ with TypeScript
Routing: TanStack Router
State Management: TanStack Query for server state
Tables: TanStack Table for filtering/sorting/pagination
UI Components: siesa-ui-kit
Charts: Recharts
i18n: react-i18next with i18next
Supported Languages: English (en), Spanish (es)
Default Language: Spanish (es)
Build: Vite with single-spa-react
Development Port: 3002
```

## Internationalization (i18n)

### Supported Languages

| Code | Language | Status |
|------|----------|--------|
| es | Spanish | Default |
| en | English | Supported |

### Translation Structure

```
src/locales/
├── en/
│   ├── common.json
│   ├── dashboard.json
│   └── products.json
└── es/
    ├── common.json
    ├── dashboard.json
    └── products.json
```

## User Stories/Features

| ID | User Story | Priority |
|----|------------|----------|
| INV-01 | As a user, I can view a dashboard with inventory KPIs | High |
| INV-02 | As a user, I can see low stock alerts | High |
| INV-03 | As a user, I can browse the product catalog | High |
| INV-04 | As a user, I can view product details with stock by warehouse | High |
| INV-05 | As a user, I can view the list of warehouses | High |
| INV-06 | As a user, I can switch to other ERP modules from sidebar | High |
| INV-07 | As a user, I can view the module in my preferred language | High |

## Key Screens & Routes

### Internal Routes Structure

```
/inventory
├── /dashboard                    - Inventory Dashboard
├── /products                     - Product Catalog
├── /products/:id                 - Product Detail
└── /warehouses                   - Warehouse List
```

### Screen Specifications

#### 1. Inventory Dashboard (`/inventory/dashboard`)

```
+----------------------------------------------------------+
| SIDEBAR |              Dashboard Content                  |
|         | +----------+ +----------+ +----------+ +------+ |
| [Menu]  | |{t('kpi. | |{t('kpi. | |{t('kpi. | |{t('kpi|
|         | |totalSKU')}|stockValue')}|lowStock')}|outOf')}|
|         | | 247      | | $850,000 | | 12 ⚠️    | | 3 🔴 | |
|         | +----------+ +----------+ +----------+ +------+ |
|         |                                                 |
|         | +---------------------------+ +---------------+ |
|         | |{t('charts.valueByCategory')}| Low Stock     | |
|         | | (Pie chart)               | | Alerts Table  | |
|         | +---------------------------+ +---------------+ |
| [Switch]|                                                 |
+----------------------------------------------------------+
```

**Components:**
- 4 KPI cards: Total SKUs, Stock Value, Low Stock Count, Out of Stock Count
- Stock value by category pie chart
- Low stock alerts table

#### 2. Product Catalog (`/inventory/products`)

```
+----------------------------------------------------------+
| SIDEBAR |  {t('products.title')}                          |
|         |  [Search by name/SKU___]                        |
|         |  {t('category')}: [All ▼] {t('status')}: [All ▼]|
|         | +---------------------------------------------+ |
|         | |{t('sku')}|{t('name')}|{t('category')}|{t('qty')}|{t('status')}|
|         | |--------|-----------|------|-----|--------| |
|         | | PRD001 | Widget A  | Elec | 150 | ✅     | |
|         | | PRD002 | Gadget B  | Elec | 0   | 🔴     | |
|         | | PRD003 | Part C    | Mech | 8   | ⚠️     | |
|         | +---------------------------------------------+ |
|         | {t('showing')} 1-20 {t('of')} 247 [< 1 2 3 >]  |
+----------------------------------------------------------+
```

**Features:**
- Search by product name or SKU
- Filter by category
- Filter by stock status
- Pagination
- Click row to view detail

#### 3. Product Detail (`/inventory/products/:id`)

```
+----------------------------------------------------------+
| SIDEBAR |  [← {t('back')}]                                |
|         | +---------------------------------------------+ |
|         | | PRD001 - Widget A                           | |
|         | | {t('category')}: Electronics                | |
|         | | {t('unitPrice')}: $25.00                    | |
|         | | {t('reorderPoint')}: 20 units               | |
|         | +---------------------------------------------+ |
|         |                                                 |
|         |  {t('stockByWarehouse')}                       |
|         | +---------------------------------------------+ |
|         | | {t('warehouse')} | {t('qty')} | {t('value')}| |
|         | |----------------|----------|----------------| |
|         | | Central        | 100      | $2,500.00      | |
|         | | North          | 50       | $1,250.00      | |
|         | | {t('total')}   | 150      | $3,750.00      | |
|         | +---------------------------------------------+ |
+----------------------------------------------------------+
```

#### 4. Warehouse List (`/inventory/warehouses`)

```
+----------------------------------------------------------+
| SIDEBAR |  {t('warehouses.title')}                        |
|         | +---------------------------------------------+ |
|         | |{t('code')}|{t('name')}|{t('location')}|{t('skus')}|{t('value')}|
|         | |------|----------------|----------|------|------|
|         | | WH01 | Central        | New York | 180  | $500K|
|         | | WH02 | North          | Chicago  | 120  | $250K|
|         | | WH03 | South          | Miami    | 95   | $100K|
|         | +---------------------------------------------+ |
+----------------------------------------------------------+
```

## Mock Data Requirements

### Data Models

```typescript
interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  unitPrice: number;
  reorderPoint: number;
  totalQuantity: number;
  stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

interface Warehouse {
  id: string;
  code: string;
  name: string;
  location: string;
  totalSKUs: number;
  totalValue: number;
}

interface StockLevel {
  productId: string;
  warehouseId: string;
  quantity: number;
}
```

### Mock Data Quantities

| Entity | Quantity |
|--------|----------|
| Products | 50 |
| Warehouses | 5 |
| Stock Levels | 100 |

## Integration Points with App Shell

| Integration | Implementation |
|-------------|----------------|
| **Module Registration** | Export `bootstrap`, `mount`, `unmount` lifecycle functions |
| **Route Activation** | Active when path starts with `/inventory` |
| **Event Bus** | Emit `NAVIGATION_REQUESTED` for module switching |
| **i18n** | Use shared i18n instance from App Shell |

## Sidebar Menu Structure

```
+------------------------+
| [Siesa Logo]           |
+------------------------+
| {t('sidebar.title')}   |
+------------------------+
| ○ {t('nav.dashboard')} |
| ○ {t('nav.products')}  |
| ○ {t('nav.warehouses')}|
+------------------------+
| {t('nav.switchModule')}|
+------------------------+
| [💰] {t('modules.finance')}      |
| [📦] {t('modules.inventory')} ←  |
| [👥] {t('modules.humanResources')}|
+------------------------+
```

## Project Structure

```
packages/mf-inventory/
├── src/
│   ├── index.ts                    # Entry point, single-spa lifecycle
│   ├── root.component.tsx          # Root component with router
│   ├── App.tsx                     # Main app with layout
│   ├── routes/
│   │   ├── index.tsx               # Route definitions
│   │   ├── dashboard.tsx           # Dashboard page
│   │   ├── products/
│   │   │   ├── list.tsx            # Product catalog
│   │   │   └── detail.tsx          # Product detail
│   │   └── warehouses/
│   │       └── list.tsx            # Warehouse list
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── ModuleSwitcher.tsx
│   │   ├── products/
│   │   │   ├── ProductTable.tsx
│   │   │   └── StockBadge.tsx
│   │   └── dashboard/
│   │       ├── KPICard.tsx
│   │       └── LowStockAlerts.tsx
│   ├── hooks/
│   │   └── useProducts.ts
│   ├── i18n/
│   │   └── locales/
│   ├── services/
│   │   └── mock-api.ts
│   └── types/
│       └── index.ts
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Success Criteria

- [ ] Module loads successfully via single-spa from App Shell
- [ ] Module runs standalone on port 3002
- [ ] All 4 routes render correctly
- [ ] Dashboard displays KPIs and low stock alerts
- [ ] Products list with search and filters
- [ ] Product detail shows stock by warehouse
- [ ] Warehouse list displays summary data
- [ ] Module switcher navigates to other modules
- [ ] All UI text uses i18n translation keys
- [ ] Language switches between English and Spanish

## Development Commands

```bash
npm run start              # Starts on port 3002
npm run build
npm run typecheck
```
