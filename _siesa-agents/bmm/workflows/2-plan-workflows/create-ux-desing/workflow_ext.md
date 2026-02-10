# Siesa UI Kit Logic for UX Design Workflow

## 1. Overview and Authority
In the context of the workflow `@_bmad/bmm/workflows/2-plan-workflows/create-ux-design`, the **Siesa UI Kit** acts as the mandatory Design System Foundation.

**Rule:** The AI Agent must **enforce** the use of `siesa-ui-kit` over generic design systems (Material, Ant, etc.) or custom solutions, unless explicitly instructed otherwise for a specific "offline-first" exception.

---

## 2. Workflow Step Overrides

The AI Agent must apply the following logic overrides to specific steps in the UX workflow:

### Override for `step-06-design-system.md`
**Standard Behavior:** The step asks the user to choose between Custom, Established, or Themeable systems.
**Strict Logic:**
*   **Cancel Discovery:** Do not ask the user "Which direction feels right?".
*   **Enforce Selection:** Automatically select **Option 3 (Established/Themeable)** and specifically identify it as **Siesa UI Kit**.
*   **Rationale Generation:** The agent must generate the rationale based on:
    *   Consistency with the ecosystem.
    *   Reduced development time (90% bug reduction).
    *   Strict adherence to corporate brand guidelines.

### Override for `step-11-component-strategy.md`
**Standard Behavior:** The step asks to analyze generic "Design System Coverage".
**Strict Logic:**
*   **Targeted Analysis:** The "Gap Analysis" must be performed specifically against the known components of `siesa-ui-kit`.
*   **Terminology:** When documenting "Foundation Components", the agent must use the specific implementation names found in Siesa UI Kit (e.g., `SiesaButton` instead of generic `Button` if applicable, or standard Shadcn/Siesa naming conventions).

---

## 3. UX Component Decision Tree

When defining components in Step 11 (`1. Analyze Design System Coverage`), the agent must follow this logic:

1.  **Is the component in Siesa UI Kit?**
    *   **YES** → Mark as "Standard Component". **No UX specification needed** (refer to Kit docs).
    *   **NO** → Proceed to Step 2.

2.  **Can it be composed of Siesa UI Kit primitives?**
    *   **YES** → Mark as "Composite Pattern". Define how existing atoms/molecules are arranged.
    *   **NO** → Mark as "**Candidate for Custom Component**".

3.  **Custom Component Specification**:
    *   If a component is truly new, the specificatin **must** include a note: *"This component requires a Merge Request to the Platform Team for inclusion in siesa-ui-kit."*

---

## 4. Instructions for AI Agents (Facilitators)

When acting as the UX Facilitator agent:

> **CRITICAL INSTRUCTIONS FOR UX FACILITATOR:**
>
> 1.  **Brand Police**: Ensure all visual definitions in `step-08-visual-foundation.md` align with Siesa branding (Colors: Siesa Blue/White, Fonts: SiesaBT).
> 2.  **Assumption of Standard**: When the user asks for a "Dropdown", assume the `siesa-ui-kit` Select/Combobox behavior unless requirements dictate otherwise.
> 3.  **Language**: All user-facing UX copy defined in `step-12-ux-patterns.md` **MUST BE IN SPANISH** per company policy, even if the workflow language is set to English.
> 4.  **Output**: In the final `ux-design-specification.md`, explicitly state: *"Design System: Siesa UI Kit"* in the metadata or summary.

---

## 5. References & Standards

The following resources act as authoritative sources for this workflow extension:

### 5.1 Primary Component Source
*   **Source:** [https://siesa-ui-kit.netlify.app/llms.txt](https://siesa-ui-kit.netlify.app/llms.txt)
*   **Role:** Sole primary source for correct usage, props, and behavior of `siesa-ui-kit` components. Consult this resource when defining component specifications or usage examples.

### 5.2 Frontend Standards
*   **Source:** `_siesa-agents/bmm/data/company-standards/frontend-standards.md`
*   **Role:** Defines the general frontend development standards (Clean Architecture, Zustand, TanStack Router) that must be adhered to when implementing the UI kit components.

### 5.3 UX & Technical Preferences
*   **Source:** `_siesa-agents/bmm/data/company-standards/technical-preferences-ux.md`
*   **Role:** Provides specific technical preferences and UX configuration details (Color Palette, Typography System, Tailwind Configuration) for implementing UI components with `siesa-ui-kit`.
