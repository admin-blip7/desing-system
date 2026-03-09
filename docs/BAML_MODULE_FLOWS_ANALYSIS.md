# Análisis de Módulos y Flujos de IA con BAML

## Resumen Ejecutivo

**55 módulos** distribuidos en **7 fases**, cada uno requiere un tipo específico de flujo de IA. 
Usando BAML, podemos crear **6 tipos de flujos especializados** que se reutilizan entre módulos similares.

---

## 🔄 Tipos de Flujos BAML

### 1. **TEXT_FLOW** - Generación de contenido estructurado
- **Entrada**: Respuestas del usuario + contexto de marca
- **Procesamiento**: LLM con BAML para estructurar JSON
- **Salida**: Documento estructurado (guías, protocolos, estrategias)
- **BAML Functions**: `GenerateBrandGuide`, `GenerateProtocol`, `GenerateStrategy`

### 2. **VISUAL_IDENTITY_FLOW** - Generación de elementos visuales
- **Entrada**: Parámetros visuales + paleta de colores + tipografía
- **Procesamiento**: Prompt engineering + generación de imágenes
- **Salida**: URLs de imágenes + especificaciones técnicas
- **BAML Functions**: `GenerateLogo`, `GenerateIcon`, `GenerateIllustration`

### 3. **UI_COMPONENT_FLOW** - Sistema de diseño digital
- **Entrada**: Tokens de diseño + componentes base
- **Procesamiento**: Generación de código + especificaciones
- **Salida**: CSS/JSON con tokens + documentación de uso
- **BAML Functions**: `GenerateDesignTokens`, `GenerateComponentSpec`

### 4. **TEMPLATE_FLOW** - Plantillas reutilizables
- **Entrada**: Contexto de uso + restricciones de formato
- **Procesamiento**: Generación de layouts + contenido placeholder
- **Salida**: Templates HTML/JSON para múltiples formatos
- **BAML Functions**: `GenerateEmailTemplate`, `GenerateSocialTemplate`

### 5. **MULTIMEDIA_FLOW** - Audio, video y animación
- **Entrada**: Estilo de marca + parámetros técnicos
- **Procesamiento**: Generación de descripciones + scripts
- **Salida**: Guías de producción + especificaciones técnicas
- **BAML Functions**: `GenerateAudioGuidelines`, `GenerateMotionSpec`

### 6. **INTEGRATION_FLOW** - Conectores y exports
- **Entrada**: Estructura de datos + formato destino
- **Procesamiento**: Transformación + validación
- **Salida**: Archivos exportables + configuraciones
- **BAML Functions**: `GenerateMarkdownExport`, `GenerateNotionSync`

---

## 📊 Matriz de Módulos por Tipo de Flujo

### FASE 1: Fundamentos de Identidad (8 módulos)

| Módulo | Key | Flujo BAML | Complejidad | Dependencias |
|--------|-----|-----------|-------------|--------------|
| Brand Story | `brandStory` | **TEXT_FLOW** | Media | Ninguna |
| Filosofía de Marca | `brandPhilosophy` | **TEXT_FLOW** | Media | Ninguna |
| Voice & Tone | `voiceTone` | **TEXT_FLOW** | Alta | Filosofía de Marca |
| Customer Personas | `customerPersonas` | **TEXT_FLOW** | Media | Ninguna |
| Logo & Isotipo | `logo` | **VISUAL_IDENTITY_FLOW** | Alta | Ninguna |
| Paleta de Color | `colorPalette` | **VISUAL_IDENTITY_FLOW** | Media | Logo |
| Tipografía | `typography` | **UI_COMPONENT_FLOW** | Media | Logo, Paleta |
| Entidades Geométricas | `geometry` | **VISUAL_IDENTITY_FLOW** | Media | Paleta |

### FASE 2: Sistema Visual Extendido (6 módulos)

| Módulo | Key | Flujo BAML | Complejidad | Dependencias |
|--------|-----|-----------|-------------|--------------|
| Dirección de Fotografía | `photography` | **MULTIMEDIA_FLOW** | Alta | Paleta, Personalidad |
| Estilo de Ilustración | `illustration` | **VISUAL_IDENTITY_FLOW** | Alta | Paleta, Geometría |
| Iconografía | `iconography` | **VISUAL_IDENTITY_FLOW** | Media | Tipografía, Geometría |
| Motion & Animación | `motion` | **MULTIMEDIA_FLOW** | Alta | Iconografía, Tipografía |
| Audio Branding | `audioBranding` | **MULTIMEDIA_FLOW** | Media | Voice & Tone |
| Data Visualization | `dataVisualization` | **UI_COMPONENT_FLOW** | Media | Paleta, Tipografía |

### FASE 3: UI Kit (9 módulos)

| Módulo | Key | Flujo BAML | Complejidad | Dependencias |
|--------|-----|-----------|-------------|--------------|
| Design Tokens | `designTokens` | **UI_COMPONENT_FLOW** | Media | Paleta, Tipografía |
| Botones | `buttons` | **UI_COMPONENT_FLOW** | Baja | Design Tokens |
| Formularios | `forms` | **UI_COMPONENT_FLOW** | Media | Design Tokens |
| Grids & Layouts | `gridsLayouts` | **UI_COMPONENT_FLOW** | Baja | Design Tokens |
| Navegación | `navigation` | **UI_COMPONENT_FLOW** | Media | Design Tokens |
| Cards & Contenedores | `cardsContainers` | **UI_COMPONENT_FLOW** | Media | Design Tokens |
| Tags & Status | `tagsStatus` | **UI_COMPONENT_FLOW** | Baja | Design Tokens |
| Empty & Error States | `emptyErrorStates` | **UI_COMPONENT_FLOW** | Media | Voice & Tone, Iconografía |
| Tablas & Listas | `tablesLists` | **UI_COMPONENT_FLOW** | Media | Design Tokens |

### FASE 4: Presencia Digital (10 módulos)

| Módulo | Key | Flujo BAML | Complejidad | Dependencias |
|--------|-----|-----------|-------------|--------------|
| Landing Pages | `landingPages` | **TEMPLATE_FLOW** | Alta | Botones, Voice & Tone |
| Página de Producto | `productPage` | **TEMPLATE_FLOW** | Alta | Cards, Fotografía |
| Carrito & Checkout | `cartCheckout` | **TEMPLATE_FLOW** | Alta | Formularios, Botones |
| Social Media Kit | `socialMediaKit` | **TEMPLATE_FLOW** | Alta | Fotografía, Voice & Tone |
| Perfiles de Redes | `socialProfiles` | **TEMPLATE_FLOW** | Media | Logo, Voice & Tone |
| Email & Newsletters | `emailNewsletters` | **TEMPLATE_FLOW** | Media | Voice & Tone, Templates |
| Tickets de Soporte | `supportTickets` | **TEXT_FLOW** | Media | Voice & Tone |
| SEO & Meta | `seoMeta` | **TEXT_FLOW** | Media | Voice & Tone |
| Presentaciones | `presentations` | **TEMPLATE_FLOW** | Media | Data Visualization |
| Video Templates | `videoTemplates` | **MULTIMEDIA_FLOW** | Alta | Motion, Audio Branding |

### FASE 5: Identidad Física (10 módulos)

| Módulo | Key | Flujo BAML | Complejidad | Dependencias |
|--------|-----|-----------|-------------|--------------|
| Guía de Impresión | `printGuide` | **TEXT_FLOW** | Media | Paleta, Logo |
| Papelería | `stationery` | **TEMPLATE_FLOW** | Media | Logo, Tipografía, Print |
| Etiquetado | `labeling` | **TEMPLATE_FLOW** | Media | Logo, Print |
| QR Codes | `qrCodes` | **VISUAL_IDENTITY_FLOW** | Baja | Logo, Paleta |
| Packaging | `packaging` | **TEMPLATE_FLOW** | Alta | Logo, Paleta, Print |
| Uniformes | `uniforms` | **TEMPLATE_FLOW** | Media | Logo, Paleta |
| Merchandising | `merchandising` | **TEMPLATE_FLOW** | Media | Logo, Geometría |
| Señalización | `signage` | **TEMPLATE_FLOW** | Alta | Iconografía, Tipografía |
| Diseño Arquitectónico | `architectural` | **TEXT_FLOW** | Alta | Paleta, Geometría |
| Vehículos | `vehicles` | **TEMPLATE_FLOW** | Media | Logo, Paleta |

### FASE 6: Experiencia del Cliente (6 módulos)

| Módulo | Key | Flujo BAML | Complejidad | Dependencias |
|--------|-----|-----------|-------------|--------------|
| Manual de Comportamiento | `behaviorManual` | **TEXT_FLOW** | Alta | Voice & Tone, Filosofía |
| Manejo de Problemas | `incidentManagement` | **TEXT_FLOW** | Media | Manual de Comportamiento |
| Sistema CX | `cxSystem` | **TEXT_FLOW** | Media | Customer Personas |
| Onboarding Empleados | `employeeOnboarding` | **TEXT_FLOW** | Media | Manual de Comportamiento |
| Co-branding | `coBranding` | **TEXT_FLOW** | Media | Logo Guidelines |
| Benchmark | `benchmark` | **TEXT_FLOW** | Baja | Filosofía de Marca |

### FASE 7: Integraciones (6 módulos)

| Módulo | Key | Flujo BAML | Complejidad | Dependencias |
|--------|-----|-----------|-------------|--------------|
| Conector Notion | `notionConnector` | **INTEGRATION_FLOW** | Alta | Todos los módulos |
| Export .md para LLMs | `exportMdLlms` | **INTEGRATION_FLOW** | Media | Todos los módulos |
| Asset Library | `assetLibrary` | **INTEGRATION_FLOW** | Media | Logo, Paleta, Tipografía |
| Release Notes | `releaseNotes` | **TEXT_FLOW** | Baja | Ninguna |
| Brand Audit | `brandAudit` | **TEXT_FLOW** | Media | Todos los módulos |
| Roadmap Generator | `roadmapGenerator` | **TEXT_FLOW** | Media | Todos los módulos |

---

## 🔑 Sistema BYO API (Bring Your Own API)

### Concepto
Permitir que cada cliente configure sus propias credenciales de API para cada tipo de flujo, reduciendo costos y dando flexibilidad total sobre qué proveedor usar.

### Arquitectura de Routing de APIs

```
┌─────────────────────────────────────────────────────────────┐
│                    API Router Layer                         │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ TEXT_FLOW    │  │ VISUAL_FLOW  │  │ TEMPLATE_    │      │
│  │   Router     │  │   Router     │  │   FLOW       │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ openai/gpt-4 │  │ anthropic/   │  │ google/      │      │
│  │ openai/gpt-4o│  │ claude-3-son │  │ gemini-1.5   │      │
│  │ azure/gpt-4  │  │ claude-3-haiku│ │ mistral/     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ MULTIMEDIA_  │  │ UI_COMPONENT │  │ INTEGRATION_ │      │
│  │   FLOW       │  │   _FLOW      │  │   FLOW       │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ stability/   │  │ groq/llama   │  │ openai/      │      │
│  │ stable-xl    │  │ cohere/      │  │ gpt-4        │      │
│  │ replicate/   │  │ command-r    │  │ anthropic/   │      │
│  │ sdxl         │  │              │  │ claude       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Configuración de APIs por Cliente

```typescript
// Estructura de configuración API por workspace
interface ApiConfiguration {
  workspace_id: string;
  
  // Configuración por tipo de flujo
  flows: {
    [flowType: string]: FlowApiConfig;
  };
  
  // Configuración global (fallback)
  default_provider: string;
  default_model: string;
}

interface FlowApiConfig {
  enabled: boolean;
  provider: ApiProvider;
  model: string;
  credentials: EncryptedCredentials;
  cost_tracking: CostTracking;
  fallback_chain: string[]; // ['openai', 'anthropic', 'azure']
}

// Tipos de proveedores soportados
type ApiProvider = 
  | 'openai'          // GPT-4, GPT-4o, GPT-3.5
  | 'anthropic'       // Claude 3 (Opus, Sonnet, Haiku)
  | 'azure'           // Azure OpenAI
  | 'google'          // Gemini 1.5 (Pro, Flash)
  | 'groq'            // Llama 3.1, Mixtral (ultra rápido)
  | 'cohere'          // Command R+
  | 'mistral'         // Mistral Large
  | 'stability'       // Stable Diffusion XL
  | 'replicate'       // Modelos custom
  | 'custom';         // Endpoints propios
```

### Ejemplo de Implementación en BAML

```baml
// clients.baml - Configuración dinámica de clientes

// Cliente base que usa las credenciales del workspace
client<dynamic> WorkspaceClient {
  provider openai
  options {
    model ctx.model
    api_key ctx.api_key
    base_url ctx.base_url
  }
}

// Router que selecciona el proveedor correcto según el flujo
function RouteToProvider {
  input {
    flow_type: FlowType
    workspace_config: ApiConfiguration
    request: BamlRequest
  }
  output {
    provider_config: ProviderConfig
    credentials: EncryptedCredentials
  }
  
  implementation {
    // Lógica de routing basada en disponibilidad y costo
    match flow_type {
      FlowType.TEXT_FLOW => {
        provider_config: workspace_config.flows.TEXT_FLOW
      }
      FlowType.VISUAL_IDENTITY_FLOW => {
        provider_config: workspace_config.flows.VISUAL_IDENTITY_FLOW
      }
      // ... otros flujos
    }
  }
}

// Función genérica que usa el provider del cliente
function GenerateWithClientApi {
  input {
    flow_type: FlowType
    workspace_id: string
    request_data: RequestData
  }
  output {
    result: GenerationResult
    cost_info: CostInfo
  }
  
  client WorkspaceClient
  
  prompt #"
    {{ _.context(request_data) }}
    
    Genera el contenido solicitado usando el provider configurado 
    para el flujo {{ flow_type }} del workspace {{ workspace_id }}.
  "#
}
```

### UI de Configuración de APIs

```
┌─────────────────────────────────────────────────────┐
│ Configuración de APIs por Flujo                     │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🔤 Generación de Texto (TEXT_FLOW)              │ │
│ │                                                 │ │
│ │ Proveedor: [OpenAI ▼]  Modelo: [GPT-4o ▼]       │ │
│ │                                                 │ │
│ │ API Key: [••••••••••••••••sk-abc...] 👁️         │ │
│ │                                                 │ │
│ │ [✓] Usar este proveedor para este flujo         │ │
│ │ [✓] Habilitar fallback automático               │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🎨 Generación Visual (VISUAL_IDENTITY_FLOW)     │ │
│ │                                                 │ │
│ │ Proveedor: [Stability AI ▼]  Modelo: [SDXL ▼]   │ │
│ │                                                 │ │
│ │ API Key: [••••••••••••••••sk-def...] 👁️         │ │
│ │                                                 │ │
│ │ [✓] Usar este proveedor para este flujo         │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🧩 UI Components (UI_COMPONENT_FLOW)            │ │
│ │                                                 │ │
│ │ Proveedor: [Groq ▼]  Modelo: [Llama 3.1 ▼]      │ │
│ │                                                 │ │
│ │ API Key: [••••••••••••••••gsk-xyz...] 👁️        │ │
│ │                                                 │ │
│ │ [✓] Usar este proveedor para este flujo         │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ 💰 Costo estimado mensual: $47.50 (con tus APIs)    │
│ 💰 Costo con nuestras APIs: $142.50                 │
│ 📊 Ahorro: 66%                                      │
│                                                     │
│ [💾 Guardar Configuración]                          │
└─────────────────────────────────────────────────────┘
```

### Beneficios para el Cliente

| Beneficio | Descripción |
|-----------|-------------|
| **Ahorro de Costos** | Usa sus propias credenciales, paga directamente al proveedor |
| **Control Total** | Decide qué modelo usar para cada tipo de tarea |
| **Sin Vendor Lock-in** | Puede cambiar de proveedor cuando quiera |
| **Latencia Optimizada** | Usa el proveedor más rápido para cada caso |
| **Compliance** | Datos nunca pasan por nuestros servidores |

### Implementación Técnica

```typescript
// api-router.service.ts
export class ApiRouterService {
  
  async routeRequest(
    flowType: FlowType,
    workspaceId: string,
    request: BamlRequest
  ): Promise<GenerationResult> {
    
    // 1. Obtener configuración del workspace
    const config = await this.getWorkspaceConfig(workspaceId);
    
    // 2. Seleccionar provider según el flujo
    const flowConfig = config.flows[flowType];
    
    if (!flowConfig?.enabled) {
      // Usar provider por defecto de la aplicación
      return this.useDefaultProvider(flowType, request);
    }
    
    // 3. Intentar con el provider principal
    try {
      return await this.executeWithProvider(
        flowConfig.provider,
        flowConfig.model,
        flowConfig.credentials,
        request
      );
    } catch (error) {
      // 4. Fallback a proveedores alternativos
      for (const fallbackProvider of flowConfig.fallback_chain) {
        try {
          return await this.executeWithProvider(
            fallbackProvider,
            flowConfig.model,
            flowConfig.credentials,
            request
          );
        } catch (fallbackError) {
          continue;
        }
      }
      
      throw new Error('All providers failed');
    }
  }
  
  // Cada provider implementa la misma interfaz
  private async executeWithProvider(
    provider: ApiProvider,
    model: string,
    credentials: EncryptedCredentials,
    request: BamlRequest
  ): Promise<GenerationResult> {
    
    const adapter = this.getProviderAdapter(provider);
    
    return await adapter.generate({
      model,
      apiKey: this.decrypt(credentials.apiKey),
      baseUrl: credentials.baseUrl,
      request
    });
  }
}
```

### Seguridad y Encriptación

```typescript
// Encriptación de credenciales
interface EncryptedCredentials {
  apiKey: string;        // Encriptado con AES-256
  baseUrl?: string;      // Opcional para endpoints custom
  encryptedAt: Date;
  version: string;       // Para rotación de keys
}

// Las credenciales nunca se almacenan en texto plano
// Solo el workspace owner puede ver sus propias credenciales
// Rotación automática de keys cada 90 días
```

### Proveedores Recomendados por Flujo

| Flujo | Proveedor Recomendado | Modelo | Ventaja |
|-------|----------------------|--------|---------|
| **TEXT_FLOW** | Anthropic | Claude 3.5 Sonnet | Mejor para contenido creativo |
| **TEXT_FLOW** (económico) | Groq | Llama 3.1 70B | Ultra rápido, muy económico |
| **VISUAL_IDENTITY** | Stability AI | SDXL | Mejor calidad/price |
| **UI_COMPONENT** | OpenAI | GPT-4o | Excelente en código |
| **MULTIMEDIA** | Replicate | Cualquier modelo | Flexibilidad total |
| **TEMPLATE** | Anthropic | Claude 3 Haiku | Rápido para templates |

---

## 🎯 Arquitectura BAML Recomendada

### Estructura de Archivos BAML

```
baml_src/
├── clients.baml                    # Configuración de providers
├── generators.baml                 # Configuración de salida
├── common/
│   ├── types.baml                  # Tipos base reutilizables
│   └── helpers.baml                # Funciones auxiliares
├── flows/
│   ├── text_flow.baml             # TEXT_FLOW
│   ├── visual_identity_flow.baml  # VISUAL_IDENTITY_FLOW
│   ├── ui_component_flow.baml     # UI_COMPONENT_FLOW
│   ├── template_flow.baml         # TEMPLATE_FLOW
│   ├── multimedia_flow.baml       # MULTIMEDIA_FLOW
│   └── integration_flow.baml      # INTEGRATION_FLOW
└── modules/                        # Overrides específicos por módulo
    ├── logo.baml
    ├── color_palette.baml
    ├── voice_tone.baml
    └── ... (para módulos que necesiten lógica especial)
```

### Contratos BAML por Flujo

#### 1. TEXT_FLOW

```baml
// Genera guías de texto estructuradas
function GenerateBrandGuide {
  input {
    module_key: string
    brand_context: BrandContext
    user_answers: UserAnswers
    dependencies: DependencyContext[]
  }
  output {
    content: GuideContent
    sections: Section[]
    recommendations: Recommendation[]
  }
}

class GuideContent {
  title: string
  description: string
  body: string
}

class Section {
  heading: string
  content: string
  examples?: string[]
}

class Recommendation {
  priority: "high" | "medium" | "low"
  action: string
  rationale: string
}
```

**Módulos que usan este flujo:**
- Brand Story
- Filosofía de Marca
- Voice & Tone
- Customer Personas
- Manual de Comportamiento
- Manejo de Problemas
- Sistema CX
- Onboarding Empleados
- Co-branding
- Benchmark
- Guía de Impresión
- Diseño Arquitectónico
- Tickets de Soporte
- SEO & Meta
- Release Notes
- Brand Audit
- Roadmap Generator

#### 2. VISUAL_IDENTITY_FLOW

```baml
// Genera elementos visuales con especificaciones técnicas
function GenerateVisualAsset {
  input {
    module_key: string
    asset_type: "logo" | "icon" | "illustration" | "pattern" | "qr"
    brand_context: BrandContext
    color_palette: ColorPalette
    typography: TypographySpec
    user_preferences: UserVisualPreferences
  }
  output {
    specifications: VisualSpec
    image_prompts: ImagePrompt[]
    usage_guidelines: UsageGuideline[]
  }
}

class VisualSpec {
  dimensions: Dimension[]
  formats: string[]
  color_variants: ColorVariant[]
  min_sizes: SizeConstraint[]
  clear_space: SpaceConstraint
}

class ImagePrompt {
  purpose: string
  prompt: string
  negative_prompt: string
  aspect_ratio: string
}

class UsageGuideline {
  scenario: string
  do_examples: string[]
  dont_examples: string[]
}
```

**Módulos que usan este flujo:**
- Logo & Isotipo
- Paleta de Color
- Entidades Geométricas
- Estilo de Ilustración
- Iconografía
- QR Codes

#### 3. UI_COMPONENT_FLOW

```baml
// Genera tokens y componentes de UI
function GenerateDesignTokens {
  input {
    module_key: string
    base_palette: ColorPalette
    base_typography: TypographySpec
    brand_personality: PersonalityProfile
  }
  output {
    tokens: DesignTokenSet
    css_variables: CSSVariable[]
    component_specs: ComponentSpec[]
  }
}

class DesignTokenSet {
  colors: ColorToken[]
  typography: TypographyToken[]
  spacing: SpacingToken[]
  sizing: SizingToken[]
  effects: EffectToken[]
}

class ComponentSpec {
  component_name: string
  variants: VariantSpec[]
  states: StateSpec[]
  anatomy: string
  usage: string
  code_example: string
}

class VariantSpec {
  name: string
  properties: map<string, string>
  preview_description: string
}
```

**Módulos que usan este flujo:**
- Design Tokens
- Botones
- Formularios
- Grids & Layouts
- Navegación
- Cards & Contenedores
- Tags & Status
- Empty & Error States
- Tablas & Listas
- Tipografía
- Data Visualization

#### 4. TEMPLATE_FLOW

```baml
// Genera plantillas reutilizables
function GenerateTemplate {
  input {
    module_key: string
    template_type: "email" | "social" | "landing" | "print" | "presentation"
    brand_context: BrandContext
    design_tokens: DesignTokenSet
    voice_tone: VoiceToneProfile
  }
  output {
    templates: Template[]
    placeholders: Placeholder[]
    variations: TemplateVariation[]
  }
}

class Template {
  name: string
  format: string
  layout_description: string
  sections: TemplateSection[]
  recommended_usage: string
}

class TemplateSection {
  section_name: string
  content_type: string
  optional: bool
  content_guidelines: string
}

class TemplateVariation {
  variation_name: string
  dimensions: string
  platform: string
  adaptations: string
}
```

**Módulos que usan este flujo:**
- Landing Pages
- Página de Producto
- Carrito & Checkout
- Social Media Kit
- Perfiles de Redes
- Email & Newsletters
- Presentaciones
- Papelería
- Etiquetado
- Packaging
- Uniformes
- Merchandising
- Señalización
- Vehículos

#### 5. MULTIMEDIA_FLOW

```baml
// Genera especificaciones para audio, video y motion
function GenerateMultimediaGuidelines {
  input {
    module_key: string
    media_type: "photography" | "motion" | "audio" | "video"
    brand_context: BrandContext
    visual_identity: VisualIdentity
  }
  output {
    style_guidelines: MultimediaStyle
    technical_specs: TechnicalSpec[]
    production_guidelines: ProductionGuideline[]
    examples: Example[]
}

class MultimediaStyle {
  mood_keywords: string[]
  aesthetic_description: string
  color_treatment: string
  composition_rules: string[]
}

class TechnicalSpec {
  format: string
  resolution: string
  frame_rate?: string
  duration?: string
  file_formats: string[]
}

class ProductionGuideline {
  phase: string
  requirements: string[]
  brand_constraints: string[]
}
```

**Módulos que usan este flujo:**
- Dirección de Fotografía
- Motion & Animación
- Audio Branding
- Video Templates

#### 6. INTEGRATION_FLOW

```baml
// Genera exports y conectores
function GenerateIntegration {
  input {
    module_key: string
    integration_type: "notion" | "markdown" | "asset_library"
    brand_data: BrandData
    modules_data: ModuleData[]
  }
  output {
    export_config: ExportConfig
    sync_specification: SyncSpec
    file_structure: FileStructure
  }
}

class ExportConfig {
  format: string
  version: string
  compression: bool
  include_assets: bool
}

class SyncSpec {
  target_platform: string
  auth_method: string
  data_mapping: DataMapping[]
  update_strategy: string
}

class FileStructure {
  directories: Directory[]
  files: File[]
  naming_convention: string
}
```

**Módulos que usan este flujo:**
- Conector Notion
- Export .md para LLMs
- Asset Library

---

## 🚀 Implementación Paso a Paso

### Fase 1: Crear Flujos Base (Semana 1)

1. **TEXT_FLOW** - 3 días
   - Implementar `GenerateBrandGuide`
   - Implementar `GenerateProtocol`
   - Crear test cases con brandStory, voiceTone

2. **VISUAL_IDENTITY_FLOW** - 2 días
   - Implementar `GenerateVisualAsset`
   - Integrar con servicio de imágenes
   - Crear test cases con logo, colorPalette

### Fase 2: Flujos UI y Templates (Semana 2)

3. **UI_COMPONENT_FLOW** - 2 días
   - Implementar `GenerateDesignTokens`
   - Crear component specs para botones, formularios
   
4. **TEMPLATE_FLOW** - 2 días
   - Implementar `GenerateTemplate`
   - Crear plantillas de email y social media

### Fase 3: Multimedia e Integración (Semana 3)

5. **MULTIMEDIA_FLOW** - 2 días
   - Implementar guías de fotografía y motion
   
6. **INTEGRATION_FLOW** - 2 días
   - Implementar exports markdown y Notion

### Fase 4: UI de Generación (Semana 4)

7. Crear botón "Generar con IA" por módulo
8. Crear diálogo de progreso de generación
9. Implementar sistema de colas para generación múltiple

---

## 🎨 Especificaciones de Entrada por Módulo

### Módulos de TEXTO (17 módulos)

Cada módulo de texto necesita:

```typescript
interface TextFlowInput {
  module_key: string;
  brand_context: {
    name: string;
    industry: string;
    personality_id: string;
    foundation_modules: {
      brandStory?: BrandStoryContent;
      brandPhilosophy?: BrandPhilosophyContent;
      // otros módulos base si existen
    };
  };
  user_answers: Record<string, string | string[]>;
  dependencies?: {
    module_key: string;
    content_summary: string;
  }[];
}
```

### Módulos VISUALES (6 módulos)

```typescript
interface VisualFlowInput {
  module_key: string;
  asset_type: string;
  brand_context: {
    personality_id: string;
    color_palette?: ColorPalette;
    typography?: TypographySpec;
  };
  user_preferences: {
    style_preferences?: string[];
    reference_images?: string[];
    constraints?: string[];
  };
}
```

### Módulos UI (9 módulos)

```typescript
interface UIComponentFlowInput {
  module_key: string;
  component_type: string;
  design_tokens: {
    colors: ColorToken[];
    typography: TypographyToken[];
    spacing: SpacingToken[];
  };
  usage_context: string[];
}
```

### Módulos TEMPLATE (13 módulos)

```typescript
interface TemplateFlowInput {
  module_key: string;
  template_type: string;
  platform?: string;
  format_requirements: {
    dimensions?: string;
    file_formats?: string[];
  };
  brand_context: BrandContext;
}
```

### Módulos MULTIMEDIA (4 módulos)

```typescript
interface MultimediaFlowInput {
  module_key: string;
  media_type: string;
  usage_context: string[];
  technical_requirements: {
    duration?: string;
    resolution?: string;
    formats?: string[];
  };
}
```

### Módulos INTEGRACIÓN (3 módulos)

```typescript
interface IntegrationFlowInput {
  module_key: string;
  integration_type: string;
  brand_data: BrandData;
  selected_modules: string[];
  export_preferences: {
    format: string;
    compression: boolean;
  };
}
```

---

## 📈 Optimizaciones BAML

### 1. Few-Shot Learning

Crear ejemplos para cada tipo de módulo:

```baml
function GenerateBrandGuide {
  // Añadir few-shots para mejores resultados
  examples {
    input {
      module_key: "voiceTone"
      brand_context: { personality_id: "playful" }
      user_answers: { currentTone: "Casual (tú)" }
    }
    output {
      content: {
        title: "Guía de Voz y Tono"
        // ... contenido ejemplo
      }
    }
  }
}
```

### 2. Chain of Thought

Para módulos complejos, usar razonamiento paso a paso:

```baml
function GenerateLogo {
  input { ... }
  output {
    reasoning: string  // Explicación del proceso creativo
    specifications: VisualSpec
  }
}
```

### 3. Validación de Output

```baml
function ValidateModuleOutput {
  input {
    module_key: string
    generated_content: string
    brand_context: BrandContext
  }
  output {
    is_valid: bool
    issues: string[]
    suggestions: string[]
  }
}
```

---

## 🔄 Sistema de Click Único

### UI Propuesta

```
┌─────────────────────────────────────────────────────┐
│ Módulo: Voice & Tone                                │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │  Generar con IA                                 │ │
│ │                                                 │ │
│ │  ✓ Usar respuestas previas del onboarding      │ │
│ │  ✓ Incluir contexto de Brand Philosophy        │ │
│ │                                                 │ │
│ │  [🤖 Generar Guía Completa]                    │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Estado: Pendiente │ En Progreso... │ Completado ✓  │
└─────────────────────────────────────────────────────┘
```

### Flujo del Botón

1. **Click** → Validar dependencias
2. **Validación OK** → Construir input para BAML
3. **Llamada BAML** → Ejecutar función correspondiente
4. **Streaming** → Mostrar progreso en tiempo real
5. **Guardado** → Persistir en Supabase
6. **Render** → Actualizar workspace con contenido generado

---

## 📊 Métricas de Éxito

### Rendimiento
- Tiempo de generación: < 30s para texto, < 60s para visual
- Tasa de éxito: > 95%
- Reintentos automáticos: máximo 3

### Calidad
- Validación automática de outputs
- Feedback de usuario integrado
- Versionado de generaciones

### Escalabilidad
- Cola de generación para múltiples módulos
- Procesamiento paralelo donde sea posible
- Caché de contextos reutilizables

---

## 🎯 Próximos Pasos

1. **Crear archivos BAML base** para cada flujo
2. **Implementar API endpoints** que orquesten BAML
3. **Diseñar UI de generación** con estados de progreso
4. **Crear sistema de validación** post-generación
5. **Implementar feedback loop** para mejorar prompts

¿Quieres que profundice en algún flujo específico o que empiece a crear los archivos BAML?
