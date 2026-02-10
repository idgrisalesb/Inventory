# Siesa UI Kit Logic in Workflow (Dev Story)

This document extracts and consolidates all logic, rules, and protocols related to `siesa-ui-kit` found in the `dev-story` workflow (`_bmad/bmm/workflows/4-implementation/dev-story`).

## Critical References
*   **Component Documentation**: [Siesa UI Kit LLM Docs](https://siesa-ui-kit.netlify.app/llms.txt) - Main source for correct usage of each component.
*   **Frontend Standards**: [Frontend Standards](../../../data/company-standards/frontend-standards.md) - General frontend standards.
*   **UX/Technical Preferences**: [Technical Preferences UX](../../../data/company-standards/technical-preferences-ux.md) - Technical and UX preferences.

## 1. Environment Preparation (Step 04)

### UI Requirement Analysis
Before starting, scan tasks and acceptance criteria for UI-related keywords:
*   `table`, `form`, `view`, `css`, `style`, `component`
*   `dark mode`, `modal`, `button`, `input`, `grid`, `layout`
*   `theme`, `icon`, `frontend`, `interface`, `screen`
*   `dialog`, `popup`, `widget`, `dashboard`, `chart`, `visualization`

### Installation and Configuration
**If UI keywords are found:**
1.  **Install/Update:** Execute `npm install siesa-ui-kit@latest` (or `pnpm`, respecting the project's package manager).
    *   Expected Output: `✅ siesa-ui-kit ensured at latest version.`
2.  **Verify Import:**
    *   Locate the project's main entry file (`src/app/layout.tsx`, `src/main.jsx`, etc.).
    *   Read the content to verify the presence of `siesa-ui-kit/styles.css`.
    *   **If missing:** Add `import 'siesa-ui-kit/styles.css'` (or equivalent).
    *   Expected Output: `✅ Verified/Added 'siesa-ui-kit/styles.css' import.`

**If NO keywords are found:**
*   Output: `ℹ️ No specific UI tasks detected. Skipping siesa-ui-kit check.`

## 2. Implementation Definition (Step 07)

### Mandatory Rules
*   🎨 **Mandatory Usage of `siesa-ui-kit`**: You must strictly comply with the library usage. Consult `https://siesa-ui-kit.netlify.app/llms.txt` for examples and API.

### UI Kit Validation
For the current task:
1.  **Strictly Prohibited:** Creating custom UI components if `siesa-ui-kit` has an equivalent.
2.  **Missing Component Protocol:**
    *   If a component is missing from the library, **ASK** the user:
        *   [1] Shadcn/ui (MCP)
        *   [2] Custom (MR to Platform)
    *   Log the decision in "Dev Notes".

## 3. Testing and Validations (Step 09)

### Standards Check
1.  **UI Library Check:** Verify that NO custom styles or components have been created where one already exists in `siesa-ui-kit` (unless registered as an exception).

### Failure Handling
*   **UI Violation:** STOP and Refactor.

## 4. Validation and Task Completion (Step 10 & 11)

### Validation Gates
To mark a task or story as complete, the following UI-related validations must be met:
1.  **`siesa-ui-kit` Compliance:** Confirm that the implementation complies with library rules.
2.  **Definition of Done (DoD Checklist) Validation:**
    *   All UI elements use `siesa-ui-kit` (no custom styles/components unless there is an approved and logged exception).
    *   Critical checklist validation: "UI Kit Compliance".
