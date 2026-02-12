# Story 1.6: Internationalization (i18n)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **Warehouse User**,
I want to **switch the interface language between Spanish and English**,
so that **I can work in my preferred language**.

## Acceptance Criteria

1.  **Given** the user is viewing the Inventory module
2.  **When** they change the language in the Siesa App Shell (e.g., via a global settings menu)
3.  **Then** the Inventory module UI text (Headers, Labels, Buttons, Tooltips) should update **immediately** without a full page reload if possible, or with a seamless reload.
4.  **And** the preference should be persisted by the App Shell (the module just reacts to the current state).
5.  **And** the default language should match the App Shell's current setting upon mounting.
6.  **And** all hardcoded text in the Dashboard, Product List, and Detail views must be moved to resource/translation files (`en.json`, `es.json`).
7.  **And** technical domain terms like "**SKU**" or "**ID**" should remain consistent (untranslated) or have specific agreed-upon translations (e.g. "SKU / Código").
8.  **And** number and currency formatting should respect the selected locale (e.g., `,` vs `.` for decimals).

## Tasks / Subtasks

- [ ] **Frontend: Infrastructure & Config**
    - [ ] Install dependencies: `i18next`, `react-i18next`.
    - [ ] Create configuration file `packages/mf-inventory/src/i18n/config.ts`.
    - [ ] Setup `i18n` instance to initialize with a default language (e.g., 'es').
    - [ ] Create translation assets structure:
        - [ ] `packages/mf-inventory/src/locales/es/translation.json`
        - [ ] `packages/mf-inventory/src/locales/en/translation.json`
    - [ ] Configure `i18next` to use these resources (embedded or lazy-loaded via dynamic imports).

- [ ] **Frontend: Shell Integration**
    - [ ] Update `packages/mf-inventory/src/root.component.tsx` or `App.tsx`:
        - [ ] Read `customProps` passed by Single-SPA for initial language (if provided).
        - [ ] Implement an event listener for a custom shell event (e.g., `siesa:language:change` or `single-spa:routing-event` checks) to update the `i18n` language dynamically.
        - [ ] **Decision**: If shell contract is unclear, implement a `window.addEventListener('language-change')` stub that can be easily connected to the real shell event.

- [ ] **Frontend: Implementation (Refactor)**
    - [ ] **Dashboard**: Replace hardcoded strings in `Dashboard.tsx`, `StockValueChart.tsx`, `LowStockAlerts.tsx`.
    - [ ] **Navigation**: Update Sidebar/Menu links text (if managed internally).
    - [ ] **Shared Components**: Update `SiesaTable` column headers and `SiesaStatus` labels to accept translated strings.
    - [ ] **Formatting**: Use `Intl.NumberFormat` or `i18next` formatting for Currency and Numbers based on the current locale.

- [ ] **Backend: API Considerations**
    - [ ] Ensure `ProblemDetails` error messages uses codes (e.g. `ERR_STOCK_LOW`) rather than just text, so frontend can translate distinct errors. (Refactor `Inventory.API` if necessary, though mainly UI focus).

- [ ] **Testing**
    - [ ] **Unit Tests**: Test that `t` function returns correct keys/values.
    - [ ] **Integration**: Test that changing the language triggers a re-render with new text.

## Dev Notes

### Technical Requirements
-   **Library**: Use `react-i18next` (v13+).
-   **Pattern**: Use the `useTranslation` hook in functional components.
-   **Keys**: Use nested keys for organization, e.g., `dashboard.kpi.totalSku`, `product.list.columns.name`.
-   **Interpolation**: Use `{{value}}` for dynamic values in strings.
-   **Fallback**: Set 'es' as the fallback language.

### Architecture Compliance
-   **Isolation**: The i18n instance should be isolated to this microfrontend to avoid conflicts with other MFEs, unless the Shell provides a global i18n instance (unlikely in strict isolation).
-   **Performance**: Avoid large bundles. If translation files grow large (>10KB), implement lazy loading. For MVP, importing directly is acceptable (`import es from './locales/es/translation.json'`).

### Previous Story Intelligence
-   **Consistency**: Ensure the terms used in Story 1.5 ("Stock Value by Category", "Top Low Stock Alerts") are the exact strings added to the translation files.
-   **Date/Number Formatting**: Story 1.4 mentioned Currency formatting. This must now be dynamic based on locale (e.g., `$1,200.00` vs `$1.200,00`).

### References
-   [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Section 7] Patrones UX (Copywriting en Español) & Terminología.
-   [Source: packages/mf-inventory/src/main.tsx] Check entry point for i18n provider wrapping.

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Completion Notes List
-   Focus is on Frontend UI translation.
-   Assumes Shell communicates language changes via event or props.
-   Infrastructure setup included.

### File List
-   packages/mf-inventory/src/i18n/config.ts
-   packages/mf-inventory/src/locales/es/translation.json
-   packages/mf-inventory/src/locales/en/translation.json
-   packages/mf-inventory/src/App.tsx
-   packages/mf-inventory/src/features/dashboard/Dashboard.tsx
-   packages/mf-inventory/src/features/dashboard/components/StockValueChart.tsx
-   packages/mf-inventory/src/features/dashboard/components/LowStockAlerts.tsx
