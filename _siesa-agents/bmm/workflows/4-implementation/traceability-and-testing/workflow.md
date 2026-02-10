---
name: traceability-and-testing
description: 'Generate functional traceability map (FR→Epic→Story→Task) and consolidated epic-level test plans from existing test cases'
web_bundle: true
version: 1.0.0
testCaseFormat: 'Siesa Standard (FT-SD-007 v5.0)'
parameters:
  epic_number:
    description: 'Optional: Epic number to process (e.g., "1", "2", "3"). If not provided, user will be prompted to select'
    required: false
    type: string
---

# Traceability & Test Planning Workflow

**Goal:** Create comprehensive functional traceability from requirements to tasks and generate epic-level test plans consolidating existing test cases.

**Your Role:** In addition to your name, communication_style, and persona, you are also a Test Architect and Requirements Engineer collaborating with the project team. This is a partnership, not a client-vendor relationship. You bring expertise in requirements traceability, test planning, and quality assurance, while the user brings their project context, requirements documentation, and testing needs. Work together as equals.

---

## Test Case File Format

This workflow uses a standardized test case format based on Siesa standards (FT-SD-007 v5.0).

**Complete Documentation:** `{workflow_path}/templates/test-cases-structure.md`
**CSV Template:** `{workflow_path}/templates/test-cases-template.csv`
**Templates README:** `{workflow_path}/templates/README.md`

The workflow has **permanent built-in knowledge** of the test case file structure through these template files. All projects using this workflow should follow the documented structure for consistent parsing and traceability generation.

---

## Test Scope and Levels

**IMPORTANT:** This workflow focuses on **functional-level testing and above**, NOT unit testing.

**Supported Test Types:**
- **Funcional (Functional):** Tests that validate complete features, user flows, and business requirements from an end-user perspective
- **Integración (Integration):** Tests that validate interaction between components, modules, or systems
- **E2E (End-to-End):** Tests that validate complete user journeys across the entire application

**OUT OF SCOPE:**
- Unit tests (code-level, developer-focused tests)
- Component tests (isolated UI component tests)
- Code coverage metrics

**Focus:** This workflow generates and organizes test cases at the **acceptance level** - validating that the system meets functional requirements and user expectations, not testing individual code units.

---

## TEST GENERATION MODES

This workflow supports **TWO MODES** for test case generation, each tailored to different project types and target audiences. The mode is selected during initialization and affects how test cases are written.

### Mode 1: UI Functional Testing

**When to use:** Projects with user interface (Frontend, Fullstack)

**Target audience:** Manual testers or users with NO technical background who execute tests from the UI

**Test case characteristics:**
- Written in **functional, user-visible language**
- Steps describe user actions (click, type, select, navigate)
- Results describe visual outcomes (appears, displays, shows)
- **Strictly prohibits technical terms:** No code references, API details, callbacks, localStorage, HTTP codes, state management, or framework-specific concepts

**Example test case (UI mode):**
```
Title: Crear factura con múltiples productos
Steps:
1. Iniciar sesión como usuario Facturador
2. Ir al menú Ventas → Nueva Factura
3. Hacer clic en "Agregar Producto"
4. Escribir "PROD001" en el campo Código
5. Hacer clic en "Guardar"

Expected Results:
1. Sistema autentica al usuario
2. Pantalla de factura se muestra
3. Producto aparece en la lista
4. Total se calcula automáticamente
5. Mensaje "Factura guardada" aparece
```

**Language validation:**
- ✅ "Hacer clic en el botón Guardar" | ❌ "Ejecutar callback handleSave()"
- ✅ "Aparece mensaje de error" | ❌ "Estado cambia a 'error'"
- ✅ "El campo está deshabilitado" | ❌ "Propiedad disabled=true"

---

### Mode 2: Backend API Testing

**When to use:** Backend-only projects (APIs, Microservices)

**Target audience:** QA engineers who validate APIs using Postman, Insomnia, or test scripts (NO source code access)

**Test case characteristics:**
- Include **endpoint, HTTP method, headers, body structure**
- Specify **expected HTTP status codes** and response structure
- Generate **positive AND negative test cases** (happy path + validation/auth/edge cases)
- Provide **executable JSON examples** that can be copied to API testing tools

**Example test case (API mode):**
```
Title: POST /api/facturas - Crear factura exitosamente
Type: Positivo

Preconditions:
• Endpoint /api/v1/facturas disponible
• Token de admin válido
• Cliente ID "CLI-001" existe

Steps:
1. Configurar headers:
   - Authorization: Bearer {{admin_token}}
   - Content-Type: application/json
2. Preparar body:
   {
     "cliente_id": "CLI-001",
     "productos": [{"codigo": "PROD001", "cantidad": 5}]
   }
3. Enviar POST a /api/v1/facturas
4. Capturar respuesta

Expected Results:
• Status: 201 Created
• Body contiene:
  {
    "success": true,
    "data": {
      "factura_id": "[uuid]",
      "numero": "FAC-2026-0001",
      "total": 5000
    }
  }
```

**Negative test example (API mode):**
```
Title: POST /api/facturas - Validar campo cliente_id requerido
Type: Negativo - Validación

Body: { "productos": [...] }  // Sin cliente_id

Expected Results:
• Status: 400 Bad Request
• Body: { "error": "El campo cliente_id es requerido" }
```

**Test categories generated:**
- ✅ Happy path (valid data)
- ✅ Validation (missing/invalid fields)
- ✅ Authentication (no token, expired token)
- ✅ Authorization (insufficient permissions)
- ✅ Edge cases (boundaries, null values, special characters)

---

### Mode Selection

**During workflow initialization (Step 1):**
1. User is prompted to select project type:
   - **"Proyecto con UI (Frontend/Fullstack)"** → `ui-functional` mode
   - **"Proyecto solo Backend (APIs/Servicios)"** → `backend-api` mode

2. Mode is stored in frontmatter:
   ```yaml
   testGenerationMode: "ui-functional" | "backend-api"
   ```

3. Test generation (Step 3) applies mode-specific guidelines:
   - **UI mode:** Prohibits all technical terms, focuses on user-visible actions
   - **API mode:** Includes HTTP details, generates positive + negative cases

**Reference documentation:**
- Full quality guidelines: See `{workflow_path}/steps/step-03-interpret-tests.md > Section 1.5`
- Structure reference: See `{workflow_path}/templates/test-cases-structure.md > Test Generation Modes`

---

## WORKFLOW ARCHITECTURE

**EXECUTION MODE: Fully Automated - Zero User Interaction (Megaprompt-Driven)**

This workflow executes using a master megaprompt with automatic data loading from standard BMAD paths. NO user input required - completely autonomous execution.

### Architecture Principles

- **Single-Prompt Execution**: The entire test design process runs from one master prompt
- **Zero User Interaction**: No menus, no confirmation steps - fully automated execution
- **Comprehensive Output**: Generates complete test design documentation in one pass
- **BMAD V6.0 Methodology**: Implements all 4 phases (Gatekeeper, FAC, Blind Spots, ISO 29119-4)
- **Structured Output**: Produces formatted tables (I-V) plus traceability matrix

### Execution Flow

1. **Load Configuration** → Read project config and epics
2. **Execute Megaprompt** → Run complete analysis (4 phases)
3. **Generate Output** → Create comprehensive test-design-complete.md file
4. **Confirm Completion** → Report metrics and file location to user

### Critical Rules (NO EXCEPTIONS)

- 🎯 **ALWAYS** execute the complete megaprompt without stopping
- 📄 **ALWAYS** load `prompts/MegaPrompt_DiseñoPruebas_BMAD_V6_Feb6.md` as the execution source
- 💾 **ALWAYS** save output to `{implementation_artifacts}/test-design-complete.md`
- 📋 **ALWAYS** include frontmatter with metadata in generated file
- ✅ **ALWAYS** communicate in `{communication_language}` (Spanish for user messages)
- 📝 **ALWAYS** generate documents in `{document_output_language}` (English for test design)
- 📁 **ALWAYS** use relative paths (from project-root) in generated documents, NEVER absolute paths

### Alternative Mode (Preserved for Future Use)

The original interactive step-by-step workflow files are preserved in the `steps/` directory. These can be used if interactive, user-guided execution is needed in the future. However, the default execution mode is now fully automated via the megaprompt.

---

## WORKFLOW PARAMETERS

### Epic Selection (Optional)

This workflow can process:
- **All epics** (default): Generate traceability and test plans for all epics in the project
- **Multiple epics (N epics)**: Process a specific number of epics to group related functionality
- **Single epic**: Process only a specific epic by number (e.g., "1", "2", "3")

**Why multiple epics?**
Test cases are high-level and functional. Sometimes a complete feature (like "login") is developed across multiple epics (authentication, session management, password recovery). Grouping N epics allows generating coherent test cases that cover a complete functional unit.

**Usage:**
```
/traceability-and-testing              # Process all epics (user will be prompted)
/traceability-and-testing 1            # Process only Epic 1
```

If no epic number is provided as a parameter, the workflow will ask the user to select:
1. **All epics**: Process everything
2. **N epics**: Specify how many epics to analyze, then select which ones

This allows consolidating test plans for functional units that span multiple epics.

---

## PATH HANDLING RULES

🚨 **CRITICAL:** All file paths written to generated documents (frontmatter, content, messages) MUST be relative to {project-root}.

**Why:** Absolute paths (e.g., `C:\Users\username\Desktop\project\...`) are specific to one machine and break portability.

**Rule:** Before writing ANY path to a document or frontmatter:
1. Check if path is absolute (contains drive letter like `C:\` or starts with `/` on Unix)
2. Convert to relative path by removing {project-root} prefix
3. Use the relative path in the document

**Example:**
```javascript
// Absolute path (DON'T use in documents)
absolute_path = "C:\Users\ssancheze\Desktop\Dev\project\_bmad-output\4-implementation\test-cases.csv"

// Relative path (DO use in documents)
relative_path = "_bmad-output\4-implementation\test-cases.csv"
```

**Apply to:**
- Frontmatter fields: `inputDocuments`, `outputFiles`
- Document content: any file references
- User-facing messages: any displayed paths

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from {project-root}/_bmad/bmm/config.yaml and resolve:

- `project_name`, `output_folder`, `planning_artifacts`, `implementation_artifacts`
- `user_name`, `communication_language`, `document_output_language`
- ✅ YOU MUST COMMUNICATE in `{communication_language}` (Spanish for user interaction)
- ✅ DOCUMENTS MUST BE in `{document_output_language}` (English for all generated documents)

### 2. Parameter Capture

Capture the `epic_number` parameter if provided by the user (e.g., from command arguments).

Store in memory as: `selected_epic_number` (can be null if not provided)

### 3. Input Collection and Megaprompt Execution

**Execution Instructions:**

#### Step 3.1: Automatic Data Loading (Zero User Interaction)

**LOAD ALL INPUTS AUTOMATICALLY:**

1. **INPUT 1 - PROYECTO:**
   - Load from config: `{project_name}`
   - Store as: `input_proyecto`

2. **INPUT 2 - ÉPICAS / HISTORIAS DE USUARIO:**
   - Load from: `{planning_artifacts}/epics.md`
   - Read complete file content
   - Store as: `input_epicas`

3. **INPUT 3 - METAS DE NEGOCIO (PRD):**
   - Search for PRD file in: `{planning_artifacts}/`
   - Look for files matching: `prd.md`, `PRD.md`, `product-requirements.md`, or similar
   - If found, read complete content and store as: `input_metas`
   - If not found, extract business goals from `epics.md` and store as: `input_metas`

4. **INPUT 4 - STACK TECNOLÓGICO:**
   - Load from: `{project-root}/_siesa-agents/bmm/data/company-standards/technology-stack.md`
   - Read complete file content
   - Store as: `input_stack`

**Notify user in `{communication_language}`:**

```
🎯 BMAD V6.0 - Diseño de Pruebas con Megaprompt

✅ Iniciando análisis automático...

📋 Datos cargados:
  • Proyecto: {input_proyecto}
  • Épicas: {planning_artifacts}/epics.md
  • PRD: [ruta encontrada o "extraído de epics.md"]
  • Stack Tecnológico: _siesa-agents/bmm/data/company-standards/technology-stack.md

🚀 Ejecutando las 4 fases de análisis BMAD V6.0...
```

**NO user input required - proceed directly to Step 3.2**

#### Step 3.2: Load and Prepare Megaprompt

1. **Load the Master Prompt:**
   - Read the complete file: `{workflow_path}/prompts/MegaPrompt_DiseñoPruebas_BMAD_V6_Feb6.md`
   - This prompt transforms you into a Principal QA Architect

2. **Inject Collected Inputs:**
   Replace the `[INPUT]` section placeholders with the collected data:
   ```
   # [INPUT]:
   - **PROYECTO**: {input_proyecto}
   - **ÉPICAS / HISTORIAS DE USUARIO**: {input_epicas}
   - **METAS DE NEGOCIO (PRD)**: {input_metas}
   - **STACK TECNOLÓGICO**: {input_stack}
   ```

#### Step 3.3: Execute the Complete Analysis

**Execute ALL 4 PHASES sequentially:**
- FASE 1: GATEKEEPER GRANULAR Y LIMPIEZA DE BACKLOG
- FASE 2: EL ESCALÓN DE CRITERIOS (FAC)
- FASE 3: DETECCIÓN DE PUNTOS CIEGOS
- FASE 4: INGENIERÍA DE DISEÑO (ISO 29119-4) Y CALCULADORA DE RIESGO

**Generate outputs in EXACT format:**
- I. REPORTE DEL GATEKEEPER (GRANULAR)
- II. DEFINICIÓN DE FEATURES Y CRITERIOS MAESTROS (FAC) EN GHERKIN
- III. PUNTOS CIEGOS DETECTADOS POR FEATURE
- IV. MATRIZ INTEGRAL DE PRUEBAS (DISEÑO 360°)
- V. INFORME TSR (TEST SUMMARY REPORT)
- APÉNDICE: MATRIZ DE TRAZABILIDAD

#### Step 3.4: Save Output

Create file: `{implementation_artifacts}/test-design-complete.md`

**Frontmatter:**
```yaml
---
workflow: traceability-and-testing
version: 1.0.0
methodology: BMAD V6.0 MegaPrompt
generated_date: [ISO 8601 date]
project_name: {input_proyecto}
input_documents:
  epics: [source path/content]
  prd: [source path/content]
technology_stack: {input_stack}
---
```

**Body:** Complete output from megaprompt execution (all tables and sections)

#### Step 3.5: Completion

Present to user in `{communication_language}`:
```
✅ DISEÑO DE PRUEBAS COMPLETADO

📄 Archivo generado: {implementation_artifacts}/test-design-complete.md

📊 Métricas:
- Features identificados: [count]
- Casos de prueba totales: [count]
- Casos P0 (Críticos): [count]
- Cobertura de riesgos críticos: [percentage]%

🔍 Revisa el archivo para ver:
- Tabla I: Reporte del Gatekeeper
- Tabla II: Features y FAC (Gherkin)
- Tabla III: Puntos Ciegos
- Tabla IV: Matriz Integral de Pruebas
- Tabla V: Informe TSR
```

**Note:** The original step-by-step workflow files remain in `steps/` directory for reference or alternative execution modes if needed in the future.
