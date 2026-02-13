# Story 3.2: Product Detail UI

Status: ready-for-dev
Story: 3.2
Epic: 3 - Detailed Stock Analysis
Author: SiesaTeam (BMad Workflow)

## STORY REQUIREMENTS

### User Story

**As an** Inventory Manager,
**I want** to view the detailed breakdown of stock levels for a specific product across all warehouses,
**So that** I can decide where to source inventory from or where to replenish.

### Acceptance Criteria

- [ ] **Navigation:** User arrives from Product List via click on row.
- [ ] **Performance:** Transition must feel instantaneous (< 200ms) using TanStack Query pre-fetching/caching.
- [ ] **Header Info:** Display Product Basic Info (SKU, Name, Description, Category, Reorder Point, Total Stock).
- [ ] **Warehouse Breakdown:** Display a table of stock per warehouse.
    - Columns: Warehouse Name, Quantity, Stock Value.
- [ ] **Stock Value:** Show pre-calculated value from API.
- [ ] **Total Summary:** Display "Total Company Stock" clearly.
- [ ] **Error Handling:** Show "Product not found" if API returns 404.
- [ ] **Loading State:** Show skeleton/loading indicator while fetching.

## DEVELOPER CONTEXT COMPENDIUM

### 1. Technical Implementation Guidelines

**Architecture & Patterns:**
- **Component Path:** `packages/mf-inventory/src/features/products/ProductDetail.tsx` (Create if missing).
- **Routing:** Register route path `/products/$productId` in `packages/mf-inventory/src/features/products/products.routes.tsx` (or main router).
- **Data Fetching:**
    - Use `useQuery` from `@tanstack/react-query`.
    - Key: `['products', productId]`.
    - Fetcher: `getProductDetail(productId)` calling `GET /api/v1/products/{id}`.
    - **Important:** Ensure `productId` is parsed correctly from URL params.

**Library/Framework Requirements (siesa-ui-kit):**
- **Strictly use `siesa-ui-kit` exported components:**
    - **Header:** Use `DescriptionList` component for the product basic info card.
        - Import: `import { DescriptionList } from 'siesa-ui-kit';`
    - **Table:** Use `Table` component for the warehouse list.
        - Import: `import { Table, TableColumn } from 'siesa-ui-kit';`
    - **Status:** Use `Badge` for stock status (if applicable in header).
    - **Layout:** Use `LayoutBase` if this is a page view.
    - **Loading:** UX specifies `SiesaSkeleton`, but **WARNING:** `Skeleton` is not explicitly exported in `index.d.ts`.
        - *Action:* Check if it's available as a sub-component or use a fallback loading UI (e.g., `<div>Loading...</div>` styled with Tailwind `animate-pulse`).
    - **Buttons:** Use `Button` for "Back" navigation.

### 2. Architecture Compliance & Guardrails

- **Naming Conventions:**
    - File: `product-detail.tsx` (kebab-case).
    - Component: `ProductDetail` (PascalCase).
    - CSS: Use Tailwind CSS v4 utility classes.
- **State Management:**
    - Do NOT use local `useEffect` for data fetching. Use `useQuery`.
    - Handle `isLoading` and `isError` states from the query.

### 3. File Structure & Location Requirements

- **View Component:** `packages/mf-inventory/src/features/products/ProductDetail.tsx`
- **Route Definition:** `packages/mf-inventory/src/routes/products.tsx` (or similar router file).
- **API Client:** `packages/mf-inventory/src/api/productsV1.ts` (Add `getProductDetail` function).
- **Types:** `packages/mf-inventory/src/types/product.ts` (Add `ProductDetailDto`).

### 4. Testing Requirements

- **Component Tests (`__tests__/ProductDetail.test.tsx`):**
    - Render component with mocked `useQuery` response.
    - Verify Header displays SKU and Name.
    - Verify Table renders correct number of warehouse rows.
    - Verify "Total Company Stock" is displayed.
    - Test Loading and Error states.
- **Integration:**
    - Test navigation from Product List (mocked Router).

## PREVIOUS STORY INTELLIGENCE
*From Story 3.1 (Product Detail API)*

- **Dependency:** This UI consumes the API from Story 3.1.
- **Status Check:** Ensure Story 3.1 API is actually available or use MSW (Mock Service Worker) to mock the response during development.
- **API Contract:** Expect `ProductDetailDto` with `warehouseStock` array.

## GIT INTELLIGENCE SUMMARY
*Recent work on Products Feature*

- **Commit `fe1a2b` (feat: products):** Added `ProductService` and `ProductsController`.
- **Insight:** The backend foundation exists. Ensure frontend types match the DTOs defined in the backend (check `ProductDto.cs` vs `product.ts`).

## LATEST TECHNICAL SPECIFICS

- **React 18:** Use `<Suspense>` if using `useSuspenseQuery`, otherwise handle `isLoading`.
- **siesa-ui-kit:** Validated exports: `DescriptionList`, `Table`, `Badge`, `Button`.
    - **DescriptionList Usage:** Likely accepts an array of items or children. Check prop types in IDE.
    - **Table Usage:** Likely accepts `data` and `columns` props.

## PROJECT CONTEXT REFERENCE

- **UX:** `_bmad-output/planning-artifacts/ux-design-specification.md` - Section 5 (User Journeys) & 6 (Components).
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` - Frontend Architecture sections.

## STORY COMPLETION STATUS

**Definition of Done:**
1.  Page renders at `/products/:id`.
2.  Fetches data from `GET /api/v1/products/:id`.
3.  Displays Product Info using `DescriptionList`.
4.  Displays Warehouse Stock using `Table`.
5.  Matches Siesa UI Kit styling.
6.  Unit tests pass.

**Ready for Dev?** YES.
