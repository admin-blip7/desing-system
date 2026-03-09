import { useState } from "react";

// ═══════════════════════════════════════════
// PLAN DE DESARROLLO — Brand Manual Generator
// De prototipos JSX a app 100% funcional
// ═══════════════════════════════════════════

const devPlan = [
  {
    fase: 0,
    title: "Setup & Infraestructura",
    subtitle: "Cimientos del proyecto",
    duration: "2–3 días",
    color: "#71717A",
    icon: "⚙",
    summary: "Crear el proyecto Next.js, configurar Supabase, autenticación y estructura de carpetas. Sin esto, nada funciona.",
    prerequisite: null,
    steps: [
      {
        name: "Inicializar proyecto Next.js 15",
        detail: "npx create-next-app@latest brand-manual-app --typescript --tailwind --eslint --app --src-dir",
        type: "terminal",
        why: "Next.js 15 con App Router es la base. TypeScript previene errores. Tailwind para estilar rápido.",
        files: ["package.json", "tsconfig.json", "tailwind.config.ts", "next.config.ts"]
      },
      {
        name: "Instalar dependencias core",
        detail: "npm install @supabase/supabase-js @supabase/ssr zustand react-hook-form zod lucide-react framer-motion sonner",
        type: "terminal",
        why: "Supabase (DB + Auth), Zustand (state global), React Hook Form + Zod (forms + validación), Lucide (iconos), Framer (animaciones), Sonner (toasts).",
        files: ["package.json"]
      },
      {
        name: "Crear proyecto en Supabase",
        detail: "Ir a supabase.com → New Project → Copiar URL y anon key → Crear archivo .env.local con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY",
        type: "config",
        why: "Supabase será la base de datos (PostgreSQL), autenticación y almacenamiento de archivos.",
        files: [".env.local", "src/lib/supabase/client.ts", "src/lib/supabase/server.ts"]
      },
      {
        name: "Configurar autenticación",
        detail: "Activar Email/Password + Google OAuth en Supabase Auth. Crear middleware.ts para proteger rutas /dashboard/*. Crear páginas /login y /signup.",
        type: "code",
        why: "Cada usuario tendrá sus propias marcas. Sin auth, todo es público.",
        files: ["src/middleware.ts", "src/app/(auth)/login/page.tsx", "src/app/(auth)/signup/page.tsx"]
      },
      {
        name: "Estructura de carpetas definitiva",
        detail: `src/
  app/
    (auth)/login, signup
    (dashboard)/
      layout.tsx          ← sidebar + header
      page.tsx             ← lista de marcas del usuario
      brands/
        new/page.tsx       ← crear nueva marca (onboarding)
        [brandId]/
          page.tsx         ← vista general de la marca
          modules/
            [moduleId]/page.tsx ← editor de módulo individual
          preview/page.tsx  ← preview completo del manual
          export/page.tsx   ← opciones de exportación
    api/
      generate/route.ts    ← endpoint de generación AI
      export/route.ts      ← endpoint de exportación PDF/HTML
  components/
    ui/                    ← botones, inputs, cards, etc.
    brand/                 ← componentes específicos de marca
    onboarding/            ← wizard de preguntas
    modules/               ← editores por módulo
    preview/               ← previews en vivo
  lib/
    supabase/              ← clients
    ai/                    ← prompts y lógica de Claude API
    templates/             ← HTML templates base
    store/                 ← Zustand stores
    types/                 ← TypeScript types
    utils/                 ← helpers`,
        type: "structure",
        why: "Esta estructura separa claramente auth, dashboard, API, componentes reutilizables y lógica de negocio.",
        files: ["Toda la estructura src/"]
      },
      {
        name: "Esquema de base de datos (SQL)",
        detail: `-- Ejecutar en Supabase SQL Editor:

-- Usuarios ya los maneja Supabase Auth

CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  personality_id TEXT, -- 'apple', 'nothing', etc. o NULL si es manual
  onboarding_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  phase INT NOT NULL,
  module_key TEXT NOT NULL, -- 'logo', 'color-palette', etc.
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, generating, completed, error
  pre_answers JSONB DEFAULT '{}', -- respuestas a preguntas del módulo
  generated_content JSONB DEFAULT '{}', -- contenido generado por AI
  html_output TEXT, -- HTML generado
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(brand_id, module_key)
);

CREATE TABLE brand_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'logo', 'color', 'font', 'image', etc.
  name TEXT NOT NULL,
  value JSONB NOT NULL, -- flexible: hex colors, font names, URLs, etc.
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own brands" ON brands
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own modules" ON modules
  FOR ALL USING (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));

CREATE POLICY "Users see own assets" ON brand_assets
  FOR ALL USING (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));`,
        type: "database",
        why: "3 tablas simples: brands (marca), modules (cada sección del manual), brand_assets (logo files, colores extraídos, etc). RLS asegura que solo el dueño ve sus datos.",
        files: ["supabase/migrations/001_initial.sql"]
      },
      {
        name: "Zustand stores base",
        detail: "Crear stores para: currentBrand (marca activa), onboardingWizard (estado del wizard de preguntas), ui (sidebar abierto, theme, etc.).",
        type: "code",
        why: "Zustand maneja estado global sin la complejidad de Redux. Necesario para que el wizard, el editor y el preview compartan datos.",
        files: ["src/lib/store/brand-store.ts", "src/lib/store/onboarding-store.ts", "src/lib/store/ui-store.ts"]
      }
    ],
    deliverable: "Proyecto corriendo en localhost:3000 con login funcional, base de datos creada, y estructura lista para recibir features."
  },
  {
    fase: 1,
    title: "Selector de Personalidad + Onboarding",
    subtitle: "Primera experiencia del usuario",
    duration: "4–5 días",
    color: "#F5C518",
    icon: "✦",
    summary: "Convertir el personality-selector.jsx y el flujo de onboarding en componentes funcionales reales conectados a Supabase.",
    prerequisite: "Fase 0 completada",
    steps: [
      {
        name: "Migrar datos de personalidades a constantes tipadas",
        detail: `Tomar las 7 personalidades del brand-personality-selector.jsx y crear:
        
src/lib/data/personalities.ts — Array tipado con toda la info de Apple, TE, Polestar, Linear, B&O, Nothing, Aēsop + manual mode.

type BrandPersonality = {
  id: string;
  name: string;
  archetype: string;
  tagline: string;
  philosophy: string;
  dna: BrandDNA;
  keyPrinciples: string[];
  cssPreview: CSSPreviewConfig;
  ideal: string[];
  notIdeal: string[];
}`,
        type: "code",
        why: "Los datos ya existen en el JSX. Solo hay que tiparlos y extraerlos a un archivo importable.",
        files: ["src/lib/data/personalities.ts", "src/lib/types/brand.ts"]
      },
      {
        name: "Crear página /dashboard/brands/new",
        detail: "Multi-step wizard con 3 etapas: 1) Elegir personalidad, 2) Onboarding (preguntas globales), 3) Confirmación y creación de marca.",
        type: "code",
        why: "Es la puerta de entrada. Sin esto, no hay marca que generar.",
        files: ["src/app/(dashboard)/brands/new/page.tsx"]
      },
      {
        name: "Componente PersonalitySelector",
        detail: `Adaptar el JSX actual a un componente real con Tailwind:
- Grid de 8 cards (7 personalidades + manual)
- Click para expandir y ver DNA completo
- Preview CSS en vivo
- Botón "Usar esta personalidad" que avanza al paso 2
- Guardar selección en Zustand store`,
        type: "code",
        why: "Este componente ya está diseñado en el artifact. Hay que convertir los inline styles a Tailwind y conectar con state management.",
        files: ["src/components/onboarding/PersonalitySelector.tsx"]
      },
      {
        name: "Componente OnboardingWizard",
        detail: `Adaptar las preguntas del brand-manual-flow-designer.jsx (sección onboarding):
- 5 pasos: Identidad Base, Personalidad, Público Objetivo, Preferencias Visuales, Contexto de Negocio
- React Hook Form para cada paso
- Validación con Zod
- Progress bar
- Tipos de input: text, textarea, select, multi-select, tags, conditional, range, file
- Persistir respuestas parciales en localStorage (por si cierran la pestaña)`,
        type: "code",
        why: "Las preguntas ya están definidas (~21 preguntas de onboarding). Hay que renderizarlas como formularios funcionales.",
        files: [
          "src/components/onboarding/OnboardingWizard.tsx",
          "src/components/onboarding/steps/BrandBasics.tsx",
          "src/components/onboarding/steps/BrandPersonality.tsx",
          "src/components/onboarding/steps/TargetAudience.tsx",
          "src/components/onboarding/steps/VisualPreferences.tsx",
          "src/components/onboarding/steps/BusinessContext.tsx"
        ]
      },
      {
        name: "Componentes de input custom",
        detail: "Crear inputs reutilizables para los tipos especiales del wizard: MultiSelect (chips seleccionables), TagsInput (escribir tags con Enter), ConditionalField (se muestra dependiendo de otra respuesta), RangeSlider (para edad), FileUpload (para logo).",
        type: "code",
        why: "El flow-designer define tipos de pregunta especiales (multi-select, tags, conditional). Necesitan componentes dedicados.",
        files: [
          "src/components/ui/MultiSelect.tsx",
          "src/components/ui/TagsInput.tsx",
          "src/components/ui/ConditionalField.tsx",
          "src/components/ui/RangeSlider.tsx",
          "src/components/ui/FileUpload.tsx"
        ]
      },
      {
        name: "Guardar marca en Supabase",
        detail: `Al completar el wizard:
1. Crear registro en tabla 'brands' con: name, personality_id, onboarding_data (JSON con todas las respuestas)
2. Crear registros en tabla 'modules' para cada módulo de las 7 fases (estado: 'pending')
3. Si subió logo, guardarlo en Supabase Storage bucket 'brand-assets'
4. Redirigir a /dashboard/brands/[brandId]`,
        type: "code",
        why: "Esto conecta el frontend con la base de datos. La marca existe oficialmente.",
        files: ["src/lib/actions/create-brand.ts"]
      },
      {
        name: "Dashboard de marcas",
        detail: "Página /dashboard que muestra las marcas del usuario en cards. Cada card muestra: nombre, personalidad elegida, progreso (X/55 módulos completados), fecha de creación. Botón para crear nueva marca.",
        type: "code",
        why: "El usuario necesita ver sus marcas y acceder a cada una.",
        files: ["src/app/(dashboard)/page.tsx", "src/components/brand/BrandCard.tsx"]
      }
    ],
    deliverable: "Usuario puede registrarse, elegir personalidad, responder onboarding, y ver su marca creada en el dashboard."
  },
  {
    fase: 2,
    title: "Vista de Marca + Sistema de Módulos",
    subtitle: "La interfaz principal de trabajo",
    duration: "5–7 días",
    color: "#3B82F6",
    icon: "◈",
    summary: "Crear la vista detallada de cada marca con sus 7 fases y módulos. El usuario puede navegar, ver estados, y entrar a cada módulo.",
    prerequisite: "Fase 1 completada",
    steps: [
      {
        name: "Layout del dashboard de marca",
        detail: `Crear /dashboard/brands/[brandId]/layout.tsx con:
- Sidebar izquierdo: 7 fases como secciones colapsables, cada una con sus módulos listados
- Indicador de estado por módulo: pending (gris), generating (amarillo pulsante), completed (verde), error (rojo)
- Header: nombre de marca, personalidad seleccionada, progreso general
- Breadcrumb: Dashboard > Marca > Fase > Módulo`,
        type: "code",
        why: "Es la interfaz principal donde el usuario pasará el 80% del tiempo.",
        files: ["src/app/(dashboard)/brands/[brandId]/layout.tsx", "src/components/brand/BrandSidebar.tsx"]
      },
      {
        name: "Página overview de marca",
        detail: `Vista general (/dashboard/brands/[brandId]/page.tsx):
- Resumen de la marca (nombre, personalidad, datos del onboarding)
- Grid de 7 fases con progreso individual
- Módulos completados vs pendientes
- Quick actions: "Generar siguiente módulo", "Ver preview", "Exportar"
- Timeline de actividad reciente`,
        type: "code",
        why: "El usuario necesita una vista de pájaro antes de sumergirse en módulos individuales.",
        files: ["src/app/(dashboard)/brands/[brandId]/page.tsx"]
      },
      {
        name: "Migrar definición de módulos a constantes",
        detail: `Extraer del flow-designer.jsx toda la estructura de fases/módulos:

src/lib/data/modules-definition.ts — Cada módulo con:
- key, name, phase, preQuestions, aiGenerates, feedsInto
- Unlock questions por fase
- Dependencias entre módulos`,
        type: "code",
        why: "Los ~55 módulos con sus preguntas y dependencias ya están definidos en el artifact. Hay que tiparlos.",
        files: ["src/lib/data/modules-definition.ts", "src/lib/types/module.ts"]
      },
      {
        name: "Página de módulo individual",
        detail: `Crear /dashboard/brands/[brandId]/modules/[moduleId]/page.tsx con 3 estados:

ESTADO 1 — PENDIENTE:
- Mostrar preguntas pre-módulo (del flow-designer)
- Formulario con React Hook Form
- Botón "Generar con IA"

ESTADO 2 — GENERANDO:
- Loading state con animación
- Skeleton del output esperado
- Progress indicator

ESTADO 3 — COMPLETADO:
- Output generado visible
- Editor para ajustar
- Botón "Regenerar" y "Aprobar"
- Preview del HTML generado`,
        type: "code",
        why: "Este es el corazón de la app: cada módulo tiene sus preguntas → genera contenido → el usuario ajusta.",
        files: [
          "src/app/(dashboard)/brands/[brandId]/modules/[moduleId]/page.tsx",
          "src/components/modules/ModuleQuestionnaire.tsx",
          "src/components/modules/ModuleGenerating.tsx",
          "src/components/modules/ModuleResult.tsx"
        ]
      },
      {
        name: "Sistema de dependencias entre módulos",
        detail: `Implementar lógica que:
- Muestre qué módulos alimentan al actual (ej: "Paleta de Color" necesita datos de "Filosofía de Marca")
- Sugiera orden de generación lógico
- Pase automáticamente los outputs previos como contexto al AI
- Marque módulos "bloqueados" si sus dependencias no están completas`,
        type: "code",
        why: "El flow-designer define 'feedsInto' para cada módulo. Esto debe ser funcional para que la AI genere contenido coherente.",
        files: ["src/lib/utils/module-dependencies.ts"]
      },
      {
        name: "Unlock questions por fase",
        detail: "Algunas fases tienen preguntas de desbloqueo (ej: Fase 5 pregunta '¿Tienes local físico?'). Si el usuario responde que no, los módulos de esa fase se marcan como 'skipped' en lugar de 'pending'.",
        type: "code",
        why: "No todos los módulos aplican a todos los negocios. Un negocio 100% digital no necesita 'Señalización' ni 'Vehículos'.",
        files: ["src/components/modules/PhaseUnlockGate.tsx"]
      }
    ],
    deliverable: "El usuario puede navegar todas las fases y módulos, responder preguntas por módulo, y ver el estado de progreso de su manual completo."
  },
  {
    fase: 3,
    title: "Integración con Claude API",
    subtitle: "El cerebro de la generación",
    duration: "5–7 días",
    color: "#FF6B35",
    icon: "⚡",
    summary: "Conectar la app con la API de Claude para generar contenido real por módulo. Cada módulo tiene su prompt especializado que recibe contexto de marca + respuestas.",
    prerequisite: "Fase 2 completada",
    steps: [
      {
        name: "Configurar Claude API",
        detail: `Instalar SDK: npm install @anthropic-ai/sdk

Crear .env.local:
ANTHROPIC_API_KEY=<YOUR_ANTHROPIC_API_KEY>

Crear servidor de API: src/app/api/generate/route.ts
- POST endpoint que recibe: brandId, moduleKey
- Valida autenticación
- Llama a Anthropic con el prompt correcto
- Guarda resultado en Supabase
- Retorna al frontend`,
        type: "code",
        why: "La generación ocurre server-side para proteger la API key. Nunca exponer en el frontend.",
        files: ["src/app/api/generate/route.ts", ".env.local"]
      },
      {
        name: "Sistema de prompts por módulo",
        detail: `Crear un prompt template para CADA módulo. Ejemplo para "Paleta de Color":

const colorPalettePrompt = (brand: Brand) => \`
Eres un director de arte experto en sistemas de color para marcas.

MARCA: \${brand.name}
INDUSTRIA: \${brand.onboarding_data.industry}
PERSONALIDAD: \${brand.personality_id ? getPersonality(brand.personality_id).dna.colors : 'Sin referencia'}
MOOD DESEADO: \${brand.modules.colorPalette.pre_answers.colorMood}
COLORES A EVITAR: \${brand.modules.colorPalette.pre_answers.colorAvoid}
NECESITA DARK MODE: \${brand.modules.colorPalette.pre_answers.needsDarkMode}
FILOSOFÍA YA GENERADA: \${brand.modules.philosophy?.generated_content || 'Aún no generada'}
PALABRAS CLAVE DE MARCA: \${brand.onboarding_data.brandWords}

Genera un sistema de color completo en formato JSON:
{
  "primary": { "hex": "#...", "name": "...", "usage": "..." },
  "secondary": { ... },
  "accent": { ... },
  "neutrals": { "50": "#...", ... "950": "#..." },
  "semantic": { "success": "#...", "error": "#...", "warning": "#...", "info": "#..." },
  "darkMode": { ... },
  "rationale": "...",
  "wcagCompliance": { ... }
}
\`

Repetir para los ~55 módulos, cada uno con su prompt especializado.`,
        type: "code",
        why: "La calidad del output depende 100% del prompt. Cada módulo necesita recibir el contexto correcto: datos del onboarding + personalidad elegida + outputs de módulos previos.",
        files: ["src/lib/ai/prompts/", "src/lib/ai/prompts/color-palette.ts", "src/lib/ai/prompts/typography.ts", "...uno por módulo"]
      },
      {
        name: "Context builder (el puente de datos)",
        detail: `Función que arma el contexto completo para cualquier módulo:

buildModuleContext(brandId, moduleKey) → {
  // 1. Datos del onboarding
  // 2. Personalidad elegida (su DNA completo)
  // 3. Respuestas pre-módulo
  // 4. Outputs de módulos ya completados (los que 'feedsInto' este)
  // 5. Assets existentes (logo subido, colores elegidos, etc.)
}

Esto se pasa al prompt template como variables.`,
        type: "code",
        why: "Sin contexto completo, Claude genera cosas genéricas. Con contexto, genera cosas específicas para la marca del usuario.",
        files: ["src/lib/ai/context-builder.ts"]
      },
      {
        name: "Parseo de respuestas de Claude",
        detail: `Claude retorna JSON, Markdown o HTML según el módulo. Crear parsers:
- parseJSON: para módulos estructurados (paleta de color, tokens, etc.)
- parseMarkdown: para módulos narrativos (filosofía, voice & tone)
- parseHTML: para módulos visuales (landing, cards, etc.)

Incluir validación de schema para asegurar que el JSON tiene la estructura esperada.`,
        type: "code",
        why: "Claude puede retornar formatos variados. El parser asegura que el contenido se guarda correctamente y se puede renderizar.",
        files: ["src/lib/ai/parsers.ts"]
      },
      {
        name: "Empezar con los 5 módulos de Fase 1",
        detail: `Crear prompts especializados para:
1. Brand Story → output: markdown narrativo
2. Filosofía de Marca → output: JSON (misión, visión, valores, etc.)
3. Voice & Tone → output: JSON (matriz de tono por canal)
4. Customer Personas → output: JSON (array de 2-3 personas)
5. Logo Guidelines → output: HTML (guía visual)
6. Paleta de Color → output: JSON (sistema de colores completo)
7. Tipografía → output: JSON (sistema tipográfico)
8. Entidades Geométricas → output: HTML (guía visual con SVGs)

PRIORIZAR que funcionen estos 8 antes de avanzar. Son los fundamentos.`,
        type: "code",
        why: "La Fase 1 es la base. Si estos módulos generan bien, los demás son variaciones del mismo patrón.",
        files: ["src/lib/ai/prompts/brand-story.ts", "src/lib/ai/prompts/philosophy.ts", "...etc"]
      },
      {
        name: "Streaming de respuestas",
        detail: "Implementar streaming de la respuesta de Claude para que el usuario vea el contenido aparecer en tiempo real (como ChatGPT). Usar ReadableStream en el API route + EventSource o fetch con reader en el frontend.",
        type: "code",
        why: "Generar un módulo puede tomar 15-30 segundos. Sin streaming, el usuario ve una pantalla en blanco. Con streaming, ve el progreso.",
        files: ["src/app/api/generate/route.ts (modificar)", "src/hooks/useStreamGeneration.ts"]
      },
      {
        name: "Rate limiting y error handling",
        detail: "Limitar a 10 generaciones por hora por usuario. Manejar errores de Claude API (rate limit, server error, context too long). Retry automático con exponential backoff. Guardar generaciones fallidas para debug.",
        type: "code",
        why: "La API de Claude tiene límites. Sin rate limiting, un usuario puede agotar tu cuota.",
        files: ["src/lib/ai/rate-limiter.ts", "src/lib/ai/error-handler.ts"]
      }
    ],
    deliverable: "El usuario puede hacer click en 'Generar' en cualquier módulo de Fase 1 y ver contenido profesional generado por Claude, con streaming en tiempo real."
  },
  {
    fase: 4,
    title: "Previews en Vivo + Editor",
    subtitle: "Ver y ajustar el resultado",
    duration: "5–7 días",
    color: "#10B981",
    icon: "◐",
    summary: "El usuario necesita VER cómo queda su manual en tiempo real y poder ajustar colores, tipografía y contenido sin regenerar todo.",
    prerequisite: "Fase 3 completada (al menos Fase 1 de módulos)",
    steps: [
      {
        name: "HTML Preview renderer",
        detail: `Componente que renderiza el HTML generado por cada módulo dentro de un iframe sandbox:
- iframe con srcdoc para renderizar HTML seguro
- Inyectar los CSS tokens de la marca (colores, fuentes)
- Responsive toggle (desktop, tablet, mobile)
- Zoom in/out`,
        type: "code",
        why: "Muchos módulos generan HTML (landing pages, cards, formularios). El usuario necesita verlos renderizados, no como código.",
        files: ["src/components/preview/HTMLPreview.tsx"]
      },
      {
        name: "Color Palette editor visual",
        detail: `Editor interactivo para la paleta de color:
- Color pickers para cada color del sistema
- Preview en vivo de cómo se ven los colores juntos
- WCAG contrast checker automático
- Exportar como CSS variables, Tailwind config, o JSON
- "Regenerar variación" (pedir a Claude una variante basada en ajustes)`,
        type: "code",
        why: "El color es lo más visual y lo que más quieren ajustar los usuarios. Un editor visual es esencial.",
        files: ["src/components/modules/editors/ColorEditor.tsx"]
      },
      {
        name: "Typography preview",
        detail: "Preview en vivo del sistema tipográfico: headline, subheadline, body, captions. Con Google Fonts loader para cargar la fuente sugerida en tiempo real. Slider para ajustar tamaños.",
        type: "code",
        why: "Las fuentes se ven diferente en pantalla que en texto. El usuario necesita ver ejemplos reales.",
        files: ["src/components/modules/editors/TypographyPreview.tsx"]
      },
      {
        name: "Markdown renderer para módulos narrativos",
        detail: "Instalar react-markdown. Crear componente que renderiza módulos como Brand Story, Voice & Tone, Filosofía con formato limpio y la tipografía/colores de la marca.",
        type: "code",
        why: "Los módulos narrativos generan Markdown. Necesitan verse como un documento profesional, no como código.",
        files: ["src/components/preview/MarkdownPreview.tsx"]
      },
      {
        name: "Editor inline de contenido",
        detail: `Permitir al usuario editar el output generado:
- Para JSON: formulario con campos editables
- Para Markdown: editor con toolbar básico (bold, italic, headers)
- Para HTML: toggle entre visual y código
- Auto-save a Supabase con debounce de 2 segundos
- Versionado: guardar historial de ediciones`,
        type: "code",
        why: "Claude genera el 80%, el usuario ajusta el 20%. Sin editor, tiene que regenerar todo cada vez.",
        files: ["src/components/modules/editors/ContentEditor.tsx", "src/components/modules/editors/MarkdownEditor.tsx"]
      },
      {
        name: "Preview completo del manual",
        detail: `Página /dashboard/brands/[brandId]/preview que muestra TODOS los módulos completados en secuencia, como un manual de marca real:
- Tabla de contenidos
- Secciones por fase
- Transiciones entre secciones
- Modo presentación (fullscreen)`,
        type: "code",
        why: "El resultado final es un MANUAL completo, no módulos sueltos. El usuario necesita ver el libro completo.",
        files: ["src/app/(dashboard)/brands/[brandId]/preview/page.tsx"]
      }
    ],
    deliverable: "El usuario puede ver previews en vivo de cada módulo, editar contenido directamente, y ver una preview del manual completo."
  },
  {
    fase: 5,
    title: "Exportación",
    subtitle: "El output final tangible",
    duration: "3–5 días",
    color: "#8B5CF6",
    icon: "↗",
    summary: "El usuario genera su manual y necesita descargarlo. PDF para imprimir, HTML para web, Markdown para alimentar otras IAs.",
    prerequisite: "Fase 4 completada",
    steps: [
      {
        name: "Exportar a PDF",
        detail: `Instalar puppeteer o usar servicio como html-pdf-node.
Crear API route /api/export/pdf que:
1. Toma todos los módulos completados
2. Arma un HTML completo con estilos inline
3. Convierte a PDF con headers, footers, numeración
4. Retorna el archivo para descarga`,
        type: "code",
        why: "El PDF es el formato estándar para manuales de marca. Es lo que se comparte con diseñadores, imprentas y equipos.",
        files: ["src/app/api/export/pdf/route.ts", "src/lib/exporters/pdf-generator.ts"]
      },
      {
        name: "Exportar a HTML estático",
        detail: "Generar un archivo HTML standalone con todos los estilos embebidos. El usuario descarga un .html que puede abrir en cualquier navegador sin servidor.",
        type: "code",
        why: "Algunos usuarios quieren un archivo que funcione sin internet. HTML standalone es perfecto.",
        files: ["src/lib/exporters/html-generator.ts"]
      },
      {
        name: "Exportar a Markdown para LLMs",
        detail: "Generar un .md optimizado con todo el contexto de marca, estructurado para alimentar Claude, GPT u otras IAs. Incluir prompts pre-hechos como '## Prompt para generar copy de producto'.",
        type: "code",
        why: "Uno de los superpoderes de la app: tu manual de marca alimenta tus otras herramientas de IA.",
        files: ["src/lib/exporters/markdown-generator.ts"]
      },
      {
        name: "Asset library / centro de descargas",
        detail: "Página donde el usuario puede descargar assets individuales: logo en SVG/PNG, paleta como .ase (Adobe), fuentes como links, tokens como JSON/CSS.",
        type: "code",
        why: "Los diseñadores no quieren el manual completo, quieren el logo en PNG o los colores en HEX.",
        files: ["src/app/(dashboard)/brands/[brandId]/export/page.tsx"]
      }
    ],
    deliverable: "El usuario puede descargar su manual como PDF profesional, HTML standalone, o Markdown para IAs."
  },
  {
    fase: 6,
    title: "Expandir Módulos (Fases 2–7)",
    subtitle: "De 8 módulos a 55",
    duration: "2–4 semanas",
    color: "#EC4899",
    icon: "◆",
    summary: "Con la infraestructura lista (wizard → preguntas → Claude → preview → editor → export), es solo crear prompts y previews para los 47 módulos restantes.",
    prerequisite: "Fases 0–5 completadas",
    steps: [
      {
        name: "Fase 2: Visual Extendido (6 módulos)",
        detail: "Fotografía, Ilustración, Iconografía, Motion, Audio, Data Viz. Cada uno necesita: prompt, parser, preview component. Priorizar Fotografía e Iconografía.",
        type: "code",
        why: "Los más impactantes visualmente después de los fundamentos.",
        files: ["src/lib/ai/prompts/phase-2/"]
      },
      {
        name: "Fase 3: UI Kit (9 módulos)",
        detail: "Design Tokens, Botones, Formularios, Grids, Navegación, Cards, Tags, Empty States, Tablas. Estos generan HTML interactivo — necesitan previews especiales.",
        type: "code",
        why: "Para negocios con web/app, esta es la fase más valiosa.",
        files: ["src/lib/ai/prompts/phase-3/"]
      },
      {
        name: "Fase 4: Digital (10 módulos)",
        detail: "Landings, Producto, Carrito, Social Media Kit, Perfiles, Email, Tickets, SEO, Presentaciones, Video. Los más grandes en cantidad. Social Media Kit es el más demandado.",
        type: "code",
        why: "La presencia digital es urgente para el 90% de los negocios.",
        files: ["src/lib/ai/prompts/phase-4/"]
      },
      {
        name: "Fase 5: Físico (10 módulos)",
        detail: "Impresión, Papelería, Etiquetas, QR, Packaging, Uniformes, Merch, Señalización, Arquitectónico, Vehículos. Muchos dependen de 'unlock questions' — solo se activan si aplican.",
        type: "code",
        why: "Para negocios con tienda física — como 22 Electronic.",
        files: ["src/lib/ai/prompts/phase-5/"]
      },
      {
        name: "Fase 6: Experiencia (6 módulos)",
        detail: "Manual de Comportamiento, Manejo de Problemas, Sistema CX, Onboarding Empleados, Co-branding, Benchmark. Estos generan más texto que visual.",
        type: "code",
        why: "La experiencia del cliente es lo que diferencia un negocio bueno de uno excelente.",
        files: ["src/lib/ai/prompts/phase-6/"]
      },
      {
        name: "Fase 7: Distribución (6 módulos)",
        detail: "Conector Notion, Export MD, Asset Library, Release Notes, Brand Audit, Roadmap Generator. Estos son más herramienta que contenido.",
        type: "code",
        why: "El cierre del ciclo: distribuir y mantener el manual vivo.",
        files: ["src/lib/ai/prompts/phase-7/"]
      }
    ],
    deliverable: "Los 55 módulos funcionando. El manual de marca más completo que existe."
  },
  {
    fase: 7,
    title: "Polish, Deploy y Lanzamiento",
    subtitle: "De localhost al mundo",
    duration: "3–5 días",
    color: "#EF4444",
    icon: "●",
    summary: "Pulir la UX, optimizar rendimiento, desplegar en producción y preparar para usuarios reales.",
    prerequisite: "Fase 6 con al menos Fases 1-4 de módulos completadas",
    steps: [
      {
        name: "Responsive design",
        detail: "Asegurar que toda la app funciona en móvil. El wizard de onboarding, los editores, y los previews deben ser usables en pantallas pequeñas.",
        type: "code",
        why: "Muchos usuarios de negocios pequeños usan más el celular que la computadora.",
        files: ["Todos los componentes"]
      },
      {
        name: "Loading states y skeleton screens",
        detail: "Agregar skeletons para: lista de marcas, vista de módulo, previews. Usar Suspense boundaries de Next.js.",
        type: "code",
        why: "Sin loading states, la app se siente rota cuando espera datos.",
        files: ["src/components/ui/Skeleton.tsx"]
      },
      {
        name: "Error boundaries",
        detail: "Agregar error boundaries globales y por módulo. Si Claude falla, no se rompe toda la app — solo ese módulo muestra 'Error, reintentar'.",
        type: "code",
        why: "Las APIs fallan. La app no debe romperse por eso.",
        files: ["src/components/ErrorBoundary.tsx"]
      },
      {
        name: "Deploy a Vercel",
        detail: "Conectar repo de GitHub a Vercel. Configurar environment variables (Supabase URL, key, Anthropic key). Configurar dominio custom si lo hay.",
        type: "config",
        why: "Vercel es el deploy natural para Next.js. Free tier es suficiente para empezar.",
        files: ["vercel.json (si es necesario)"]
      },
      {
        name: "Monitoreo y analytics",
        detail: "Agregar Vercel Analytics para performance. Opcionalmente PostHog o Plausible para user analytics. Logs de errores con Sentry.",
        type: "config",
        why: "Necesitas saber si la app funciona bien en producción y dónde fallan los usuarios.",
        files: [".env.local"]
      }
    ],
    deliverable: "App en producción, accesible desde cualquier navegador, monitoreada y lista para usuarios reales."
  }
];

const typeColors = {
  terminal: "#10B981",
  code: "#3B82F6",
  config: "#F59E0B",
  database: "#8B5CF6",
  structure: "#EC4899"
};

const typeLabels = {
  terminal: "Terminal",
  code: "Código",
  config: "Configuración",
  database: "Base de Datos",
  structure: "Estructura"
};

export default function DevPlan() {
  const [activeFase, setActiveFase] = useState(0);
  const [expandedStep, setExpandedStep] = useState(null);
  const [view, setView] = useState("phases"); // phases | timeline | checklist

  const currentFase = devPlan[activeFase];
  const totalSteps = devPlan.reduce((a, f) => a + f.steps.length, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#09090B", color: "#E5E5E5", fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
      {/* ═══ HEADER ═══ */}
      <div style={{ borderBottom: "1px solid #18181B", padding: "28px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#3F3F46", textTransform: "uppercase", marginBottom: 6 }}>Brand Manual Generator</div>
            <h1 style={{ fontSize: 32, fontWeight: 200, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
              Plan de Desarrollo
            </h1>
            <p style={{ color: "#52525B", fontSize: 13, marginTop: 6 }}>
              De 3 prototipos JSX → App 100% funcional. Cada fase construye sobre la anterior.
            </p>
          </div>
          <div style={{ display: "flex", gap: 4, background: "#18181B", borderRadius: 6, padding: 3 }}>
            {[
              { key: "phases", label: "Fases" },
              { key: "timeline", label: "Timeline" },
              { key: "checklist", label: "Checklist" },
            ].map(v => (
              <button key={v.key} onClick={() => setView(v.key)} style={{
                padding: "6px 14px", borderRadius: 4, border: "none",
                background: view === v.key ? "#27272A" : "transparent",
                color: view === v.key ? "#F5C518" : "#52525B",
                fontSize: 11, cursor: "pointer", fontWeight: 500
              }}>{v.label}</button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 28, marginTop: 20 }}>
          {[
            { label: "Fases", value: devPlan.length },
            { label: "Pasos totales", value: totalSteps },
            { label: "Duración estimada", value: "6–10 sem" },
            { label: "Stack", value: "Next.js + Supabase + Claude" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 20, fontWeight: 300, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 8, color: "#3F3F46", textTransform: "uppercase", letterSpacing: "0.15em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Source files */}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {[
            { name: "brand-manual-generator-roadmap.jsx", desc: "Roadmap + Estructura", lines: 566 },
            { name: "brand-manual-flow-designer.jsx", desc: "Flujo de Preguntas", lines: 726 },
            { name: "brand-personality-selector.jsx", desc: "7 Personalidades + Manual", lines: 633 },
          ].map((f, i) => (
            <div key={i} style={{
              padding: "8px 12px", background: "#111113", borderRadius: 6,
              border: "1px solid #1E1E22", fontSize: 11
            }}>
              <span style={{ color: "#F5C518", fontFamily: "monospace", fontSize: 10 }}>{f.name}</span>
              <span style={{ color: "#3F3F46", marginLeft: 8 }}>{f.desc} · {f.lines} líneas</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ PHASES VIEW ═══ */}
      {view === "phases" && (
        <div style={{ display: "flex", minHeight: "calc(100vh - 220px)" }}>
          {/* Sidebar */}
          <div style={{ width: 280, borderRight: "1px solid #18181B", padding: "16px 0", flexShrink: 0, overflowY: "auto" }}>
            <div style={{ padding: "0 16px 12px", fontSize: 8, letterSpacing: "0.25em", color: "#3F3F46", textTransform: "uppercase" }}>
              Fases de desarrollo
            </div>
            {devPlan.map((f, i) => (
              <button key={i} onClick={() => { setActiveFase(i); setExpandedStep(null); }} style={{
                display: "block", width: "100%", textAlign: "left", border: "none",
                padding: "12px 16px", cursor: "pointer",
                background: activeFase === i ? "#18181B" : "transparent",
                borderLeft: `2px solid ${activeFase === i ? f.color : "transparent"}`,
                transition: "all 0.15s"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: activeFase === i ? f.color : "#3F3F46" }}>{f.icon}</span>
                  <span style={{ fontSize: 10, letterSpacing: "0.15em", color: activeFase === i ? f.color : "#52525B", fontWeight: 600 }}>
                    FASE {f.fase}
                  </span>
                  <span style={{ fontSize: 9, color: "#27272A", marginLeft: "auto" }}>{f.steps.length} pasos</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 400, color: activeFase === i ? "#fff" : "#71717A", marginTop: 3, marginLeft: 22 }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 10, color: activeFase === i ? "#52525B" : "#27272A", marginTop: 2, marginLeft: 22 }}>
                  {f.duration}
                </div>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, padding: "24px 32px", overflowY: "auto" }}>
            {currentFase && (
              <>
                {/* Phase Header */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 18, color: currentFase.color }}>{currentFase.icon}</span>
                    <span style={{ fontSize: 10, letterSpacing: "0.2em", color: currentFase.color, fontWeight: 600 }}>
                      FASE {currentFase.fase} — {currentFase.duration}
                    </span>
                  </div>
                  <h2 style={{ fontSize: 26, fontWeight: 300, color: "#fff", margin: "0 0 4px" }}>{currentFase.title}</h2>
                  <p style={{ fontSize: 13, color: "#52525B", margin: "0 0 12px" }}>{currentFase.subtitle}</p>
                  <p style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.7, maxWidth: 700, margin: 0, padding: "12px 16px", background: "#111113", borderRadius: 8, borderLeft: `3px solid ${currentFase.color}30` }}>
                    {currentFase.summary}
                  </p>
                  {currentFase.prerequisite && (
                    <div style={{ fontSize: 11, color: "#F59E0B", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>⚠</span> Requisito: {currentFase.prerequisite}
                    </div>
                  )}
                </div>

                {/* Steps */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {currentFase.steps.map((step, i) => {
                    const isExpanded = expandedStep === i;
                    return (
                      <div key={i} style={{
                        background: "#111113", borderRadius: 10,
                        border: `1px solid ${isExpanded ? currentFase.color + "30" : "#1E1E22"}`,
                        overflow: "hidden", transition: "all 0.2s"
                      }}>
                        {/* Step Header */}
                        <button onClick={() => setExpandedStep(isExpanded ? null : i)} style={{
                          display: "flex", alignItems: "center", gap: 12, width: "100%",
                          padding: "14px 18px", border: "none", background: "transparent",
                          cursor: "pointer", textAlign: "left"
                        }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 6,
                            background: currentFase.color + "15",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 700, color: currentFase.color, flexShrink: 0
                          }}>
                            {String(i + 1).padStart(2, "0")}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{step.name}</div>
                          </div>
                          <span style={{
                            fontSize: 9, padding: "3px 8px", borderRadius: 4,
                            background: typeColors[step.type] + "15",
                            color: typeColors[step.type],
                            border: `1px solid ${typeColors[step.type]}20`,
                            fontWeight: 600, letterSpacing: "0.05em"
                          }}>
                            {typeLabels[step.type]}
                          </span>
                          <span style={{ color: "#3F3F46", fontSize: 14, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "none" }}>▾</span>
                        </button>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div style={{ padding: "0 18px 18px", borderTop: "1px solid #1E1E22" }}>
                            {/* What to do */}
                            <div style={{ marginTop: 14 }}>
                              <div style={{ fontSize: 9, letterSpacing: "0.15em", color: currentFase.color, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>
                                Qué hacer
                              </div>
                              <pre style={{
                                fontSize: 12, color: "#D4D4D8", lineHeight: 1.7,
                                whiteSpace: "pre-wrap", wordBreak: "break-word",
                                fontFamily: step.type === "terminal" || step.type === "database" ? "'IBM Plex Mono', 'SF Mono', monospace" : "inherit",
                                background: step.type === "terminal" || step.type === "database" ? "#0C0C0E" : "transparent",
                                padding: step.type === "terminal" || step.type === "database" ? "12px 14px" : "0",
                                borderRadius: 6, margin: 0,
                                border: step.type === "terminal" || step.type === "database" ? "1px solid #1E1E22" : "none"
                              }}>
                                {step.detail}
                              </pre>
                            </div>

                            {/* Why */}
                            <div style={{ marginTop: 14 }}>
                              <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "#F59E0B", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>
                                Por qué es necesario
                              </div>
                              <p style={{ fontSize: 12, color: "#A1A1AA", lineHeight: 1.6, margin: 0 }}>{step.why}</p>
                            </div>

                            {/* Files */}
                            <div style={{ marginTop: 14 }}>
                              <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "#3F3F46", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>
                                Archivos a crear/modificar
                              </div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                {step.files.map((f, j) => (
                                  <span key={j} style={{
                                    fontSize: 10, padding: "3px 8px", borderRadius: 4,
                                    background: "#0C0C0E", color: "#71717A",
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    border: "1px solid #1E1E22"
                                  }}>{f}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Deliverable */}
                <div style={{
                  marginTop: 20, padding: "16px 18px", borderRadius: 10,
                  background: currentFase.color + "08",
                  border: `1px solid ${currentFase.color}20`
                }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.15em", color: currentFase.color, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>
                    ✓ Entregable de esta fase
                  </div>
                  <p style={{ fontSize: 13, color: "#D4D4D8", lineHeight: 1.6, margin: 0 }}>{currentFase.deliverable}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══ TIMELINE VIEW ═══ */}
      {view === "timeline" && (
        <div style={{ padding: "32px 36px", maxWidth: 900 }}>
          <h2 style={{ fontSize: 22, fontWeight: 300, color: "#fff", margin: "0 0 24px" }}>Timeline de Desarrollo</h2>
          <div style={{ position: "relative", paddingLeft: 32 }}>
            <div style={{ position: "absolute", left: 11, top: 0, bottom: 0, width: 1, background: "#1E1E22" }} />
            {devPlan.map((f, i) => (
              <div key={i} style={{ marginBottom: 32, position: "relative" }}>
                <div style={{
                  position: "absolute", left: -32, top: 4,
                  width: 22, height: 22, borderRadius: "50%",
                  background: f.color + "20", border: `2px solid ${f.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: f.color
                }}>
                  {f.fase}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.15em", color: f.color, fontWeight: 600 }}>FASE {f.fase}</div>
                    <div style={{ fontSize: 18, fontWeight: 400, color: "#fff", marginTop: 2 }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: "#52525B", marginTop: 2 }}>{f.subtitle}</div>
                    <div style={{ fontSize: 12, color: "#71717A", marginTop: 8, lineHeight: 1.6 }}>{f.summary}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 24 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{f.duration}</div>
                    <div style={{ fontSize: 10, color: "#3F3F46" }}>{f.steps.length} pasos</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
                  {f.steps.map((s, j) => (
                    <span key={j} style={{
                      fontSize: 9, padding: "3px 8px", borderRadius: 4,
                      background: "#111113", color: "#71717A",
                      border: "1px solid #1E1E22"
                    }}>{s.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ CHECKLIST VIEW ═══ */}
      {view === "checklist" && (
        <div style={{ padding: "32px 36px", maxWidth: 900 }}>
          <h2 style={{ fontSize: 22, fontWeight: 300, color: "#fff", margin: "0 0 8px" }}>Checklist Completo</h2>
          <p style={{ fontSize: 12, color: "#52525B", marginBottom: 24 }}>{totalSteps} pasos en {devPlan.length} fases — imprime esta lista y ve tachando</p>
          {devPlan.map((f, i) => (
            <div key={i} style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: f.color }}>{f.icon}</span>
                <span style={{ fontSize: 11, letterSpacing: "0.15em", color: f.color, fontWeight: 600 }}>FASE {f.fase}</span>
                <span style={{ fontSize: 14, color: "#fff", fontWeight: 400 }}>{f.title}</span>
                <span style={{ fontSize: 10, color: "#3F3F46", marginLeft: "auto" }}>{f.duration}</span>
              </div>
              {f.steps.map((s, j) => (
                <div key={j} style={{
                  display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px",
                  background: j % 2 === 0 ? "#0C0C0E" : "transparent",
                  borderRadius: 4
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 3, border: "1.5px solid #27272A",
                    marginTop: 1, flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 12, color: "#D4D4D8" }}>{s.name}</span>
                  </div>
                  <span style={{
                    fontSize: 8, padding: "2px 6px", borderRadius: 3,
                    background: typeColors[s.type] + "10",
                    color: typeColors[s.type],
                    fontWeight: 600, flexShrink: 0
                  }}>
                    {typeLabels[s.type]}
                  </span>
                </div>
              ))}
            </div>
          ))}

          {/* Final note */}
          <div style={{
            marginTop: 24, padding: "20px", borderRadius: 10,
            background: "#F5C51808", border: "1px solid #F5C51820"
          }}>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#F5C518", fontWeight: 600, marginBottom: 8, textTransform: "uppercase" }}>
              Nota importante
            </div>
            <p style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.7, margin: 0 }}>
              Este plan está diseñado para que <strong style={{ color: "#fff" }}>cada fase sea funcional por sí sola</strong>. 
              No necesitas completar las 8 fases para tener algo útil. Al terminar la Fase 3 ya tienes una app que genera módulos de marca con IA. 
              Las fases 4-7 agregan pulido, más módulos y exportación. 
              <strong style={{ color: "#fff" }}> Empieza por Fase 0 y avanza en orden. No saltar fases.</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
