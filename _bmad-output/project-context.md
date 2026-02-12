---
project_name: 'Siesa-Agents'
user_name: 'SiesaTeam'
date: '2026-02-11'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 35
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Frontend Framework**: React 18+ (Concurrent features enabled)
- **Build Tool**: Vite 6.x
- **Microfrontend**: Single-SPA (via `vite-plugin-single-spa`)
- **Routing**: TanStack Router v1+ (File-based, Type-safe)
- **State Management**:
    - **Server State**: TanStack Query v5+ (REQUIRED for API data)
    - **Client State**: Zustand v4+ (Global UI state only)
- **Styling**: Tailwind CSS v4 + `siesa-ui-kit` (Company Standard)
- **Language**: TypeScript 5.x (Strict Mode)
- **Testing**: Vitest + React Testing Library + MSW
- **Package Manager**: pnpm (Recommended)
- **Backend**: .NET 10 Web API (Clean Architecture)

---

## Critical Implementation Rules

### Language-Specific Rules (TypeScript/React)
- **Strict Mode**: `strict: true` in `tsconfig.json`. No `any`.
- **Component Definition**: Use `const Component = memo(...)` pattern.
- **Props Interface**: Always define `interface ComponentProps`.
- **Exports**: Named exports preferred over default exports for components.

### Framework-Specific Rules
- **siesa-ui-kit (CRITICAL)**:
    - **ALWAYS** check `siesa-ui-kit` documentation before creating ANY new UI component.
    - **Usage**: Use existing kit components over custom implementations.
    - **Fallback**: Create new components ONLY if missing from kit, following kit's design tokens.
- **TanStack Router**:
    - **Pathless Layouts**: Use `_` prefix (e.g., `_app.tsx`).
    - **Flat Routing**: Use `.` for nesting (e.g., `orders.index.tsx`).
    - **Exclusions**: Use `-` prefix for collocated files (e.g., `-components/`).
- **TanStack Query**:
    - **Keys**: Use Factory Pattern for Query Keys (`productKeys.all`, `productKeys.list(...)`).
    - **Error Handling**: Handle errors in `onError` callback or Error Boundary, not `try/catch` in components.

### Testing Rules
- **Unit Tests**: Vitest for all business logic (Use Cases, Hooks).
- **Component Tests**: React Testing Library for all UI components. `data-testid` is mandatory for interactive elements.
- **Mocking**: Use MSW for network requests. Do not mock `fetch` or `axios` directly in tests if possible.

### Code Quality & Style Rules
- **Language Standards**:
    - **UI/Visible Text**: MUST be in **Spanish** (Labels, Messages, Errors).
    - **Code/Comments**: MUST be in **English** (Variables, Functions).
- **Naming Conventions**:
    - **Files**: `kebab-case` (e.g., `user-profile.tsx`).
    - **Components**: `PascalCase` (e.g., `UserProfile`).
    - **Functions**: `camelCase`.
- **Folder Structure**:
    - **Pattern**: Module/Domain/Feature.
    - **Path**: `src/modules/{module}/{domain}/{feature}/...`

### Development Workflow Rules
- **Git**:
    - **Branches**: `feat/`, `fix/`, `chore/`.
    - **Commits**: Conventional Commits (e.g., `feat: add user login`).
- **Single-SPA**:
    - **CSS**: Ensure CSS isolation via `cssLifecycleFactory`.
    - **DOM**: Never access `window` or `document` outside of the MFE's mount lifecycle if possible.

### Critical Don't-Miss Rules (Anti-Patterns)
- **NO Mixing Languages**: Never put English text in UI or Spanish in code variable names.
- **NO Direct API Calls**: All API calls must go through the `infrastructure` layer (Repository pattern).
- **NO Global State for Server Data**: Do not put API responses in Zustand/Context; use TanStack Query cache.
- **NO Styles in JS**: Use Tailwind classes. Avoid `style={{...}}` props.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-02-11
