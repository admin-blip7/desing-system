# AI On-Brand BAML Architecture (Azure OpenAI Ready)

## 1. Objetivo
Centralizar toda la generacion AI (texto e imagen) para que cada salida respete identidad de marca de forma consistente, reutilizable y auditable.

Esta implementacion agrega:
- Libreria compartida de gobernanza de marca: `src/lib/ai/brand-governance/index.ts`
- Activos de marca para prompts y validacion: `config/brand-ai-assets.default.json`
- Flujos BAML listos para texto e imagen:
  - `bamls/onbrand-text-flow/flow.dag.yaml`
  - `bamls/onbrand-image-flow/flow.dag.yaml`
- Integracion directa en los entry points de mayor trafico:
  - `src/actions/generate-module.ts`
  - `src/app/api/generate-logo/route.ts`

---

## 2. Inventario exhaustivo de puntos de interaccion AI en el workspace

| Punto | Tipo | Entry point tecnico | Estado actual |
|---|---|---|---|
| Generacion de modulo desde grid dashboard | Texto + Imagen (segun modulo) | `src/components/dashboard/BrandModulesGrid.tsx` -> `src/actions/generate-module.ts` | Integrado con gobernanza central |
| Regeneracion de modulo desde editor | Texto + Imagen (segun modulo) | `src/components/dashboard/ModuleEditor.tsx` -> `src/actions/regenerate-module.ts` -> `src/actions/generate-module.ts` | Integrado con gobernanza central |
| Streaming SSE de generacion de modulo | Texto + Imagen (indirecto) | `src/app/api/generate/route.ts` -> `src/actions/generate-module.ts` | Hereda gobernanza central |
| Generacion visual/logo en workspace | Imagen | `src/components/workspace/base/LogoGenerator.tsx` -> `src/app/api/generate-logo/route.ts` | Integrado con gobernanza central |
| Brand generation session run | Texto estructurado multi-agente | `src/app/api/brand-generation/sessions/[sessionId]/run/route.ts` -> `@bm/brand-flow-orchestrator` | Ya usa BAML modular por agente |
| Agente estrategia | Texto | `packages/brand-strategy-agent/src/index.ts` | BAML + few-shot |
| Agente research | Texto | `packages/competitive-research-module/src/index.ts` | BAML + few-shot |
| Agente visual identity | Texto estructurado (lineamientos visuales) | `packages/visual-identity-agent/src/index.ts` | BAML + few-shot |
| Agente copywriting | Texto | `packages/copywriting-agent/src/index.ts` | BAML + few-shot |
| Agente tone analysis | Texto | `packages/tone-analysis-engine/src/index.ts` | BAML + few-shot |
| Agente consistency validator | Texto estructurado | `packages/brand-consistency-validator/src/index.ts` | BAML + few-shot |
| Identity generation API | Texto/visual mock (simulado) | `src/app/api/identity/generate/route.ts` | Pendiente migrar a LLM real + gobernanza |

---

## 3. Arquitectura centralizada implementada

## 3.1 Capa compartida DRY
Archivo: `src/lib/ai/brand-governance/index.ts`

Responsabilidades:
- Resolver perfil de marca por personalidad (`resolveBrandGovernanceProfile`).
- Construir instruccion de sistema dinamica para texto (`buildBrandTextInstruction`).
- Construir prompt de imagen on-brand con paleta hex + composicion + negativos (`buildBrandedImagePrompt`).
- Validar cumplimiento de salida textual (`validateBrandTextOutput`).
- Validar prompt visual antes de invocacion (`validateBrandedImagePrompt`).

## 3.2 Inyeccion sistematica de directrices de marca
- Texto (`src/actions/generate-module.ts`):
  - Se construye `governedSystemPrompt` dinamico con:
    - tono
    - terminologia corporativa
    - formato de salida
    - few-shot examples del manual
  - Se ejecuta validacion post-respuesta.
  - Si falla, se hace un intento de correccion automatica.
  - Si sigue fuera de marca y `BRAND_GUARDRAIL_MODE=strict`, se corta la generacion con error controlado.

- Imagen (`src/actions/generate-module.ts`, `src/app/api/generate-logo/route.ts`):
  - Se concatena prompt base + descriptores de estilo + paleta HEX + reglas de composicion.
  - Se agrega `negative_prompt` robusto.
  - Se valida el bundle antes de invocar el proveedor.
  - Se pasa `negativePrompt` a `generateImage(...)`.

## 3.3 Abstraccion de invocaciones BAML
Archivo: `src/lib/ai/bamlClient.ts`

Mejoras:
- soporte para `baseUrl`, `endpointPath`, `promptKey`, `systemKey`, `outputKey` por request.
- soporte para `inputs` adicionales en payload.
- mantiene contrato backward-compatible para `/score`.

---

## 4. Configuracion especifica de BAMLs (YAML)

## 4.1 Flujo de texto on-brand
- Definicion: `bamls/onbrand-text-flow/flow.dag.yaml`
- Template: `bamls/onbrand-text-flow/chat.jinja2`
- Output esperado: `answer`

Inputs principales:
- `question`
- `system_prompt` (dinamico)
- `brand_tone`
- `corporate_terms`
- `output_contract`
- `few_shot_examples`
- `force_json`

## 4.2 Flujo de imagen on-brand (prompt composer)
- Definicion: `bamls/onbrand-image-flow/flow.dag.yaml`
- Template: `bamls/onbrand-image-flow/chat.jinja2`
- Output esperado: `answer` (JSON string con `positive_prompt` y `negative_prompt`)

Inputs principales:
- `user_prompt`
- `style_descriptors`
- `palette_hex`
- `composition_guidelines`
- `negative_prompt_base`

---

## 5. Variables de entorno para activos de marca y runtime

Definidas/actualizadas en `.env.example`:

| Variable | Uso |
|---|---|
| `BRAND_AI_ASSETS_FILE` | Ruta del archivo de activos de marca (tono, terminos, few-shot, paleta, negativos). |
| `BRAND_TEXT_FEWSHOT_LIMIT` | Limite de ejemplos few-shot inyectados en la instruccion dinamica. |
| `BRAND_TEXT_REQUIRED_TERMS_MIN` | Minimo de terminos corporativos requeridos en salida textual. |
| `BRAND_GUARDRAIL_MODE` | `strict` bloquea salidas off-brand tras retry; `warn` permite salida con warning. |
| `BAML_BASE_URL` | Endpoint base para `/score`. |
| `BAML_PROMPT_KEY` | Campo de prompt de usuario para BAML. |
| `BAML_SYSTEM_KEY` | Campo de system prompt para BAML. |
| `BAML_OUTPUT_KEY` | Campo de salida consumido por app. |
| `BAML_TIMEOUT_MS` | Timeout de invocacion BAML. |
| `DEAPI_API_KEY` / `IMAGE_GENERATION_API_KEY` | Credenciales de proveedor de imagen. |
| `IMAGE_PROVIDER` | Seleccion de proveedor visual (`deapi`, `byteplus`). |

---

## 6. Validacion y manejo de errores

## Texto
- Validacion semantica por terminologia requerida.
- Bloqueo por terminos prohibidos.
- Verificacion JSON cuando aplica.
- Retry de correccion guiada.
- Falla explicita en modo estricto.

## Imagen
- Validacion previa del prompt (prompt positivo/negativo no vacio).
- Verificacion de paleta corporativa (>=2 HEX en prompt final).
- Error controlado si el prompt no cumple contrato.

---

## 7. Seguridad, rendimiento y escalabilidad (produccion)

## Seguridad
- Eliminado logging sensible de entorno en `generate-logo`.
- Uso server-side de llaves API.
- Validaciones de entrada y ownership ya existentes en rutas protegidas.
- Contratos de salida con validacion estructural reducen prompt injection accidental.

## Rendimiento
- Reuso de perfiles en cache de archivo de activos.
- Prompt budgeting en `generate-module` se mantiene.
- Retry de correccion textual limitado a un ciclo.
- BAML client con timeout configurable.

## Escalabilidad
- Gobernanza desacoplada y reusable para nuevos workspaces.
- Flujos BAML separados (texto/imagen) para despliegue independiente.
- Compatible con estrategia provider-based existente (`openai`, `baml`, `mock`).
- Mantiene principio DRY al centralizar reglas de marca en una sola libreria y un solo archivo de activos.
