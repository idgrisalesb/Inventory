---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-03-core-experience
  - step-04-emotional-response
  - step-05-inspiration
  - step-06-design-system
  - step-07-defining-experience
  - step-08-visual-foundation
  - step-09-design-directions
  - step-10-user-journeys
  - step-11-component-strategy
  - step-12-ux-patterns
  - step-13-responsive-accessibility
  - step-14-complete
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-Siesa-Agents-2026-02-10.md
  - _bmad-output/planning-artifacts/prd.md
  - _siesa-agents/bmm/workflows/2-plan-workflows/create-ux-desing/workflow_ext.md
classification:
  projectType: web_app
  designSystem: Siesa UI Kit
  language: es
---

# UX Design Specification: Siesa-Agents Inventory Module

**Author:** SiesaTeam
**Date:** 2026-02-11
**Design System:** Siesa UI Kit

---

## 1. Visión y Descubrimiento (Discovery)

### Propósito del Proyecto
El módulo de Inventario tiene como objetivo proporcionar visibilidad en tiempo real del stock en múltiples almacenes, permitiendo a los gestores de inventario y operarios de almacén tomar decisiones rápidas y basadas en datos confiables.

### Usuarios Principales
1.  **Elena (Inventory Manager):** Necesita una visión macro y alertas proactivas para prevenir roturas de stock. Valora la "Confianza" y la "Información Instantánea".
2.  **Carlos (Warehouse Staff):** Necesita respuestas inmediatas ("¿Dónde está el producto X?"). Valora la "Velocidad" y la "Simplicidad".

### Pilares de la Experiencia (Core Experience)
*   **Instantaneidad:** Cargas de dashboard < 1.5s y búsquedas < 500ms. El usuario no espera.
*   **Confianza:** Datos siempre visibles y actualizados. Indicadores claros de "frescura" de datos.
*   **Eficiencia:** Densidad de información adecuada para usuarios expertos. Evitar clics innecesarios.

### Respuesta Emocional
*   **En Control:** El usuario siente que domina el caos del almacén gracias a la claridad de los datos.
*   **Alivio:** Las alertas tempranas (Low Stock) previenen crisis antes de que ocurran.

---

## 2. Estrategia de Sistema de Diseño

**Decisión:** **Opción 3 (Established/Themeable) - Siesa UI Kit**

### Racional
De acuerdo con los estándares corporativos y para asegurar la consistencia con el ecosistema Siesa ERP existente, se utilizará estrictamente el **Siesa UI Kit**.
*   **Consistencia:** Integración visual perfecta con el App Shell y otros módulos (Finanzas, Ventas).
*   **Velocidad de Desarrollo:** Uso de componentes pre-validados reduce bugs en un 90%.
*   **Marca:** Cumplimiento automático de las guías de marca corporativas.

---

## 3. Definición de la Experiencia (Layout & Estructura)

### Estructura General
El módulo vivirá dentro del Siesa App Shell (Single-SPA).
*   **Navegación:** Barra lateral global (provista por el Shell).
*   **Área de Contenido:** Contenedor fluido con padding estándar.
*   **Breadcrumbs:** Navegación jerárquica (e.g., Inventario > Catálogo > Detalle).

### Vistas Principales
1.  **Dashboard (Home):**
    *   Layout de Grid (Rejilla).
    *   Tarjetas de KPI en la parte superior (Total Value, Low Stock).
    *   Listas de resumen (Top Low Stock Items) en la mitad inferior.
2.  **Catálogo de Productos (List):**
    *   Layout de Tabla con Barra de Herramientas (Filtros, Búsqueda).
    *   Paginación en la parte inferior.
3.  **Detalle de Producto:**
    *   Header con información clave (SKU, Nombre).
    *   Cards o Tablas para desglose por almacén.

---

## 4. Fundación Visual

**Regla Estricta:** Adherencia total a **Siesa UI Kit**.

*   **Paleta de Colores:**
    *   Primario: Siesa Blue (Acciones principales, Headers).
    *   Fondo: White / Light Gray (para contraste en tablas).
    *   Estados:
        *   🟢 Éxito/Stock OK: Siesa Green.
        *   🟡 Advertencia/Low Stock: Siesa Yellow.
        *   🔴 Error/Out of Stock: Siesa Red.
*   **Tipografía:**
    *   Familia: **SiesaBT**.
    *   Tamaños: H1 para títulos de página, Body 14px para tablas (legibilidad en alta densidad).

---

## 5. User Journeys & UI Flows

### Journey 1: Crisis de Stock Bajo (Elena)
1.  **Dashboard:** Elena ve la tarjeta "Low Stock" con un indicador rojo y el número "12".
2.  **Acción:** Clic en la tarjeta.
3.  **Catálogo (Filtrado):** Transición inmediata a la vista de lista.
    *   *Estado UI:* Filtro "Status = Low Stock" pre-aplicado.
    *   *Feedback:* Lista cargada con los 12 ítems.
4.  **Selección:** Clic en "Widget A".
5.  **Detalle:** Vista detallada muestra desglose por almacén.
    *   *Visual:* "North: 0" (Rojo), "Central: 100" (Verde).

### Journey 2: Búsqueda Rápida (Carlos)
1.  **Cualquier Vista:** Carlos usa la barra de búsqueda global (siempre visible o accesible).
2.  **Input:** Escribe "Gadget B".
3.  **Resultados:** Dropdown de autocompletado o resultados instantáneos en tabla.
4.  **Confirmación:** Ve "Stock Total: 50" y ubicación "Bin A1".

---

## 6. Estrategia de Componentes (Component Strategy)

**Análisis de Cobertura vs Siesa UI Kit:**

### Componentes Estándar (Standard Components)
Uso directo de la librería sin modificaciones UX.
*   `SiesaButton`: Acciones primarias y secundarias.
*   `SiesaTable`: Para el catálogo y listas de almacenes. Debe soportar ordenamiento y filtros en cabecera.
*   `SiesaCard`: Contenedores para KPIs y secciones de detalle.
*   `SiesaInput` / `SiesaSearch`: Campo de búsqueda global.
*   `SiesaBadge` / `SiesaTag`: Para indicar estado (In Stock, Low Stock).
*   `SiesaSkeleton`: Para estados de carga.
*   `SiesaBreadcrumb`: Navegación.

### Patrones Compuestos (Composite Patterns)
Composiciones de átomos existentes.
*   **KPI Card:** Composición de `SiesaCard` + `Icon` + `Typography (Label)` + `Typography (Value)` + `TrendIndicator`.
*   **Filter Bar:** Contenedor Flex con múltiples `SiesaSelect` y un botón de "Limpiar Filtros".
*   **Status Indicator:** `Icon` (dot) + `SiesaText` (e.g., 🔴 Out of Stock).

### Candidatos a Custom Component
*   *Ninguno identificado para el MVP.* Todo se puede resolver con primitivas de Siesa UI Kit.

---

## 7. Patrones UX (Copywriting en Español)

**Regla:** Todo el texto de interfaz debe estar en **Español**.

### Mensajes de Feedback
*   **Carga:** "Cargando inventario..." (Usar Skeleton preferiblemente).
*   **Búsqueda Vacía:** "No se encontraron productos con ese criterio."
*   **Error de Sistema:** "No pudimos conectar con el servidor. Mostrando datos cacheados."

### Etiquetas y Terminología
*   "SKU" -> **SKU / Código**
*   "Warehouse" -> **Almacén / Centro de Distribución**
*   "Stock Level" -> **Nivel de Stock**
*   "Reorder Point" -> **Punto de Reorden**
*   "Low Stock" -> **Stock Bajo**
*   "Out of Stock" -> **Agotado**

---

## 8. Accesibilidad y Responsive

### Responsive
*   **Desktop (1920px):** Vista completa. Tablas expandidas con todas las columnas. Dashboard en Grid de 4 columnas.
*   **Tablet (1024px - Landscape):** Tablas con scroll horizontal o columnas ocultables. Dashboard en Grid de 2 columnas.
*   **Mobile:** No prioritario para MVP, pero el layout debe apilarse (Stack) en una sola columna.

### Accesibilidad (A11y)
*   **Teclado:** Navegación completa por tabulación (Focus rings visibles estándar de Siesa UI Kit).
*   **Contraste:** Verificar que el texto gris sobre fondo blanco cumpla WCAG AA, especialmente en las tablas de alta densidad.
*   **Lectores de Pantalla:** Etiquetas `aria-label` en botones de iconos (e.g., botón de búsqueda).
