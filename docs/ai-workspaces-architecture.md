# AI Workspaces Architecture

## Objetivo
Esta arquitectura reemplaza el flujo genérico de módulos con un pipeline de generación de marca multi-agente, modular y desacoplado en `npm workspaces`.

## Estructura

```text
packages/
  ai-shared/
  brand-strategy-agent/
  competitive-research-module/
  visual-identity-agent/
  copywriting-agent/
  tone-analysis-engine/
  brand-consistency-validator/
  brand-flow-orchestrator/
src/
  app/api/brand-generation/sessions/**
  lib/ai/brand-flow/brand-context.ts
  lib/ai/brand-flow/brand-profiles.ts
  lib/ai/brand-flow/session-store.ts
  components/workspace/base/BrandGenerationWorkspace.tsx
config/
  brands.default.json
scripts/
  generate-ai-module-docs.ts
```

## Responsabilidades por workspace

- `@bm/ai-shared`
  - Tipos de dominio y contratos de agentes.
  - Validación (`zod`), sanitización de inputs.
  - Utilidades de retry, rate-limit, control de costos y logger estructurado.
  - Configuración unificada de prompts/modelo/temperature.

- `@bm/brand-strategy-agent`
  - Genera posicionamiento, misión, visión, valores y diferenciadores.

- `@bm/competitive-research-module`
  - Evalúa competidores, whitespace y riesgos estratégicos.

- `@bm/visual-identity-agent`
  - Genera dirección visual: color, tipografía, logo e iconografía.

- `@bm/copywriting-agent`
  - Genera tagline, elevator pitch, pilares de voz y piezas por canal.

- `@bm/tone-analysis-engine`
  - Analiza tono, puntúa dimensiones y recomienda ajustes.

- `@bm/brand-consistency-validator`
  - Valida coherencia transversal y emite score + issues + recomendaciones.

- `@bm/brand-flow-orchestrator`
  - Orquesta ejecución, aplica retries, ciclos de refinamiento y budget guardrails.

## Contrato estándar de agentes
Todos los agentes retornan:

- `agentId`
- `payload`
- `metrics`
  - `durationMs`
  - `estimatedTokens`
  - `estimatedCostUsd`
  - `retries`

Esto permite trazabilidad y control uniforme de costos/errores.

## Orquestación y comunicación entre workspaces

1. Entrada validada y sanitizada (`brandBriefInputSchema`).
2. Orquestador ejecuta agentes en orden:
   - strategy -> research -> visual -> copy -> tone -> consistency.
3. Si consistencia falla, ejecuta ciclo de refinamiento (máximo configurable).
4. Cada paso consume presupuesto en `CostManager`.
5. Toda la telemetría se registra en logger estructurado por `sessionId`.

## Session management

- API:
  - `POST /api/brand-generation/sessions`
  - `GET /api/brand-generation/sessions`
  - `GET /api/brand-generation/sessions/[sessionId]`
  - `POST /api/brand-generation/sessions/[sessionId]/run`

- Persistencia:
  - `src/lib/ai/brand-flow/session-store.ts`
  - almacenamiento en `.tmp/brand-generation-sessions.json` (modo desarrollo).
  - `brandContext` se deriva por marca/personalidad en creación de sesión (`buildBrandContext`) y se persiste para ejecución determinística.

## BAML y versionado

- Cada agente define y registra su `PromptTemplateVersionSeed` (id, módulo, versión, few-shot, checksum).
- Registry persistente: `FilePromptVersionRegistry` (`.tmp/prompt-registry.json` por defecto).
- Configuración multi-marca base: `config/brands.default.json`.
- Override de path por entorno: `BRAND_FLOW_BRANDS_FILE`.

## Observabilidad y resiliencia

- Logger estructurado por `sessionId` con trazas completas.
- Rate limit por módulo (`InMemoryRateLimiter`) y por creación de sesión.
- Circuit breaker por `brandId::moduleId`.
- Retry policy configurable.
- Providers soportados por abstracción (`mock`, `openai`, `baml`).

## Seguridad y calidad

- Autenticación obligatoria de usuario en APIs.
- Verificación de ownership de `brandId`.
- Sanitización de payload de entrada.
- Rate limit para creación de sesiones.
- Guardrails de costo por ejecución.
- Errores estructurados y trazables por sesión.

## Integración UI

- Workspace dedicado: `/dashboard/brands/[id]/workspace/brand-generation`.
- Ruta de módulos legacy redirige:
  - módulo con `workspacePath` -> workspace personalizado.
  - módulo sin workspace -> `brand-generation?moduleKey=...`.

## Pruebas

- `packages/ai-shared/test/shared-utils.test.ts`
- `packages/ai-shared/test/baml-core.test.ts`
- `packages/brand-flow-orchestrator/test/flow.test.ts`

Ejecutar:

```bash
npm run test:ai
```

## Documentación automática

- Manifiestos por agente: `BamlModuleManifest`.
- Generación automática de contratos:

```bash
npm run docs:ai
```

- Salida generada: `docs/ai-modules.generated.md`.
