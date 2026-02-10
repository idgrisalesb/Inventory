# SIESA Agents v2

Paquete para instalar y configurar el ecosistema **BMAD v6** con los agentes especializados de SIESA en tu proyecto.

## Acerca de esta versión

**SIESA Agents v2** es la nueva generación del sistema de agentes, construido sobre **BMAD v6** (Break Method Approach to Development). Esta versión representa una evolución significativa respecto a las versiones anteriores basadas en BMAD v4.

### Stack Tecnológico Optimizado

Esta versión está diseñada y optimizada para el siguiente stack tecnológico empresarial:

**Frontend:**
- Vite 7+ como bundler (builds rápidos, HMR instantáneo)
- TanStack Router 1+ (file-based routing, type-safe)
- React 18+ con TypeScript (strict mode)
- TanStack Query 5+ para server state
- Zustand 5+ para client state
- Shadcn/ui + Radix UI + TailwindCSS v4
- React Hook Form + Zod para formularios
- Vitest para testing
- Preparado para microfrontends con Module Federation

**Backend:**
- .NET 10 con C# Minimal API
- Entity Framework Core 10 + linq2db + LinqKit
- PostgreSQL 18+ como base de datos primaria
- Arquitectura de Microservicios

**Principios Arquitectónicos:**
- Clean Architecture + Domain-Driven Design (DDD)
- Test-Driven Development (TDD)
- Database per Microservice

## Instalación

### Instalación única con npx (Recomendado)

```bash
npx siesa-agents
```

Este comando instalará automáticamente las carpetas necesarias en tu directorio actual.

### Instalación global

```bash
npm install -g siesa-bmad-agents
siesa-agents
```

### Versiones disponibles

- **Versión estable**: `npx siesa-agents`
- **Versión desarrollo**: `npx siesa-agents@dev`

## ¿Qué hace este paquete?

El paquete instala el ecosistema completo de BMAD v6 en tu proyecto:

- **`_bmad/`** - Sistema modular BMAD v6 con agentes, workflows y configuración
- **`.vscode/`** - Configuración de Visual Studio Code
- **`.github/`** - Configuración de GitHub Actions y workflows
- **`.claude/`** - Configuración de Claude Code Commands y workflows
- **`.gemini/`** - Configuración de Gemini CLI

## Características

- **Instalación automática**: Copia las carpetas necesarias automáticamente
- **Actualización inteligente**: Detecta instalaciones existentes y las actualiza
- **Instalación local**: Se instala en el directorio donde ejecutas el comando
- **Sobrescritura segura**: Reemplaza archivos existentes sin perder configuración
- **BMAD v6**: Sistema modular con workflows paso a paso y agentes especializados
- **Compatibilidad siesa-ui-kit**: Integración nativa con el kit de componentes UI de SIESA

## Uso

1. Navega al directorio donde quieres instalar los agentes BMAD
2. Ejecuta `npx siesa-agents`
3. Las carpetas se instalarán automáticamente

### Actualización

Para actualizar una instalación existente, simplemente ejecuta el comando nuevamente:

```bash
npx siesa-agents
```

El sistema detectará automáticamente que ya existe una instalación y la actualizará.

## Requisitos

- Node.js >= 20.0.0
- npm >= 8.0.0 (o pnpm >= 8.0.0 recomendado)
- Python >= 3.7 (requerido para hooks de Claude Code)

## Estructura de archivos instalados

```
tu-proyecto/
├── _bmad/
│   ├── core/           # Sistema central BMAD
│   ├── bmm/            # BMAD Method Module (workflows de desarrollo)
│   ├── bmb/            # BMAD Builder Module
│   └── _config/        # Manifiestos y configuración
├── .vscode/
│   └── [configuración de VS Code]
├── .github/
│   └── [workflows y configuración de GitHub]
├── .claude/
│   └── [comandos de Claude Code]
└── .gemini/
    └── [configuración de Gemini CLI]
```

## Soporte

Si encuentras algún problema durante la instalación, por favor verifica:

1. Que tienes permisos de escritura en el directorio
2. Que Node.js está instalado correctamente
3. Que tienes acceso a npm

## Licencia

MIT

## Autor

SIESA - Sistemas de Información Empresarial

---
*SIESA Agents v2 | BMAD v6 | Versión actualizada automáticamente por CI/CD*