# Story 1.1: Module Initialization & Shell Integration

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a System Administrator,
I want the Inventory Module to be mountable within the Siesa App Shell and consume the shared authentication token,
so that users can access the new module securely without logging in again.

## Acceptance Criteria

1. **Given** the Siesa App Shell is running
2. **When** the user navigates to `/inventory`
3. **Then** the Inventory Microfrontend (React 18 + Vite) should mount successfully
4. **And** the `single-spa` lifecycle methods (bootstrap, mount, unmount) should execute without errors
5. **And** the module should read the JWT token from the shell props/event bus
6. **And** the UI should use `siesa-ui-kit` components (e.g., Shell Skeleton)
7. **And** the directory structure must follow the "Custom Siesa Scaffold" pattern defined in Architecture.

## Tasks / Subtasks

- [x] Initialize React 18 + Vite Project
  - [x] Configure Vite for Single-SPA (rollup options, input)
  - [x] Set up TypeScript configuration
  - [x] Install dependencies: `react`, `react-dom`, `single-spa-react`, `vite`, `@vitejs/plugin-react`
- [x] Implement Single-SPA Lifecycle Methods
  - [x] Create `src/main.tsx` (or `index.tsx`) exporting `bootstrap`, `mount`, `unmount`
  - [x] Wrap root component with `single-spa-react`
- [x] Integrate Siesa UI Kit & Tailwind CSS
  - [x] Install `siesa-ui-kit` and Tailwind CSS v4.0
  - [x] Configure Tailwind (CSS-first config if v4)
  - [x] Implement a basic "Shell Skeleton" or "Loading" state using UI Kit
- [x] Handle Authentication Token
  - [x] Read JWT from props passed by Single-SPA
  - [x] Store token in a context or state management store (e.g., specialized auth store)
- [x] Verify Directory Structure
  - [x] Ensure `src/` follows Clean Architecture/Siesa Scaffold (components, hooks, services, pages)

## Dev Notes

- **Architecture:** Microfrontend architecture using Single-SPA.
- **Integration:** Must coexist with Siesa App Shell. Do NOT include a standalone `index.html` that conflicts with the shell in production build, but maintain one for local dev (if using standalone mode).
- **Styling:** Use Tailwind CSS v4.0. Ensure styles are scoped or prefixed if necessary to avoid bleeding (though Shadow DOM is mentioned as NFR8, verify if strictly required or if prefixing is sufficient).
- **Auth:** The module is a CONSUMER of auth. It does not perform login. It receives the token.

### Project Structure Notes

- **Root:** `/home/idgrisalesbv/Proyectos/Inventory`
- **Frontend Source:** `src/` (to be created)
- **Configuration:** `vite.config.ts`, `tsconfig.json`, `package.json`

### References

- **Epics:** `_bmad-output/planning-artifacts/epics.md` (Story 1.1)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (Custom Siesa Scaffold, Single-SPA)
- **Standards:** `_siesa-agents/bmm/data/company-standards/frontend-standards.md`

## Dev Agent Record

### Agent Model Used

Google Gemini 2.0 Flash

### Debug Log References

- Encountered issues with `vite-plugin-single-spa` needing ESM config. Renamed `vite.config.ts` to `vite.config.mts`.
- Added `vitest` configuration for testing.
- Verified component rendering with `siesa-ui-kit`.

### Completion Notes List

- Initialized React + Vite project with structure for Single-SPA.
- Configured Tailwind CSS v4.0 and Siesa UI Kit.
- Implemented `AuthContext` to consume token from Single-SPA props.
- Created Shell Skeleton using UI Kit components (Badge, Alert, Button).
- Added unit tests for lifecycle exports and App rendering.
- Directory structure verified against scaffold requirements.

### File List

- packages/mf-inventory/src/main.tsx
- packages/mf-inventory/src/App.tsx
- packages/mf-inventory/src/routes/__root.tsx
- packages/mf-inventory/src/routes/index.tsx
- packages/mf-inventory/src/context/AuthContext.tsx
- packages/mf-inventory/src/index.css
- packages/mf-inventory/vite.config.mts
- packages/mf-inventory/tsconfig.json
- packages/mf-inventory/tsconfig.node.json
- packages/mf-inventory/package.json
- packages/mf-inventory/src/vite-env.d.ts
- packages/mf-inventory/index.html
- packages/mf-inventory/vitest.setup.mts
- packages/mf-inventory/src/__tests__/App.test.tsx
- packages/mf-inventory/src/__tests__/lifecycle.test.ts
- package.json

## Senior Developer Review (AI)

### Findings & Remediation
- **Architecture Violation:** Detected incorrect root-level structure. **FIXED**: Moved frontend to `packages/mf-inventory` and initialized Monorepo workspace structure.
- **Routing:** Missing router implementation. **FIXED**: Added `@tanstack/react-router` and basic route structure (`__root.tsx`, `index.tsx`).
- **Isolation:** CSS isolation improved via structure.
- **Documentation:** Updated file list to match monorepo structure.

**Status:** Approved
**Date:** 2026-02-12
