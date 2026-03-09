export interface RoadmapModule {
  name: string;
  desc: string;
  output: string;
  isNew: boolean;
  key: string; // Mapeo al sistema existente
}

export interface RoadmapPhase {
  id: number;
  phase: string;
  title: string;
  subtitle: string;
  color: string;
  weeks: string;
  modules: RoadmapModule[];
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 1,
    phase: "FASE 1",
    title: "Fundamentos de Identidad",
    subtitle: "El ADN de la marca — quién eres y por qué existes",
    color: "#F5C518",
    weeks: "Semanas 1–4",
    modules: [
      { name: "Brand Story & Historia", desc: "Historia de la marca, fundador, origen, hitos clave, qué inspiró el negocio. Contexto narrativo que explica el 'por qué' detrás de cada decisión de diseño", output: "brand-story.html", isNew: true, key: "brandStory" },
      { name: "Filosofía de Marca", desc: "Misión, visión, valores, propósito, posicionamiento. Personalidad de marca como personaje (brand persona). Experiencias que queremos generar", output: "brand-philosophy.html", isNew: false, key: "brandPhilosophy" },
      { name: "Voz & Tono de Marca", desc: "Guía de copywriting: cómo habla la marca, vocabulario permitido/prohibido, matriz de tono por canal (formal en facturas, cálido en WhatsApp, técnico en web), ejemplos de frases", output: "voice-tone.html", isNew: true, key: "voiceTone" },
      { name: "Customer Personas", desc: "Perfiles de cliente ideal, segmentos, comportamientos, motivaciones de compra, pain points. Esto guía todas las decisiones de diseño y comunicación", output: "personas.html", isNew: true, key: "customerPersonas" },
      { name: "Logo & Isotipo", desc: "Logo principal, variantes (horizontal, vertical, ícono), isotipo, versiones monocromáticas, área de protección, tamaños mínimos, usos incorrectos (Do's & Don'ts)", output: "logo-guidelines.html", isNew: false, key: "logo" },
      { name: "Paleta de Color", desc: "Primarios, secundarios, acentos, escalas de grises. Valores HEX, RGB, HSL, CMYK y Pantone. Tokens CSS. Ratios de contraste WCAG. Modos claro/oscuro", output: "color-system.html", isNew: false, key: "colorPalette" },
      { name: "Tipografía", desc: "Familias tipográficas (display, body, mono), escala fluid, jerarquías, pesos, interlineado, tracking. Fuente para web, print, y código", output: "typography.html", isNew: false, key: "typography" },
      { name: "Entidades Geométricas", desc: "Formas y geometrías de marca, patrones, texturas, elementos decorativos, motivos visuales de soporte", output: "brand-geometry.html", isNew: false, key: "geometry" },
    ]
  },
  {
    id: 2,
    phase: "FASE 2",
    title: "Sistema Visual Extendido",
    subtitle: "Fotografía, ilustración, movimiento y sonido",
    color: "#EC4899",
    weeks: "Semanas 5–8",
    modules: [
      { name: "Dirección de Fotografía", desc: "Estilo fotográfico de marca: iluminación, composición, paleta de color en fotos, tratamiento de imagen, filtros permitidos. Guía de fotos de producto, lifestyle, y equipo. Do's & Don'ts", output: "photography.html", isNew: true, key: "photography" },
      { name: "Estilo de Ilustración", desc: "Si la marca usa ilustraciones: estilo (flat, line art, 3D), grosor de línea, paleta, nivel de detalle, personajes, escenas permitidas", output: "illustration.html", isNew: true, key: "illustration" },
      { name: "Iconografía", desc: "Set de íconos de marca, estilo (outline, solid, duotone), grid de construcción, tamaños, espaciado, guía de creación de nuevos íconos", output: "icons-system.html", isNew: false, key: "iconography" },
      { name: "Motion & Animación", desc: "Cómo se mueve la marca: curvas de easing, duraciones, transiciones de página, micro-interacciones, loading animations, reveals. Principios de movimiento", output: "motion-guidelines.html", isNew: true, key: "motion" },
      { name: "Audio Branding", desc: "Identidad sonora: jingle/sonic logo, tono de notificaciones, música de fondo para contenido, estilo de voiceover, paisaje sonoro de tienda física", output: "audio-branding.html", isNew: true, key: "audioBranding" },
      { name: "Data Visualization", desc: "Estilo de gráficas, charts, tablas de datos: colores, tipografía, ejes, leyendas. Para reportes, dashboards, presentaciones", output: "data-viz.html", isNew: true, key: "dataVisualization" },
    ]
  },
  {
    id: 3,
    phase: "FASE 3",
    title: "Sistema de Diseño Digital (UI Kit)",
    subtitle: "Componentes, tokens y patrones de interfaz",
    color: "#3B82F6",
    weeks: "Semanas 9–12",
    modules: [
      { name: "Design Tokens", desc: "Spacing (8pt grid), sizing, border-radius, shadows, z-index, breakpoints, opacity. Variables CSS completas para todo el sistema", output: "design-tokens.html", isNew: true, key: "designTokens" },
      { name: "Botones & Acciones", desc: "Primario, secundario, ghost, danger, link. Estados: hover, active, disabled, loading. Tamaños: sm, md, lg. Con íconos", output: "buttons.html", isNew: false, key: "buttons" },
      { name: "Formularios & Inputs", desc: "Text inputs, selects, checkboxes, radios, toggles, date pickers, sliders. Validaciones, estados de error, labels, placeholders, helper text", output: "form-elements.html", isNew: false, key: "forms" },
      { name: "Grids & Layouts", desc: "Sistema de grid (12 columnas), gutters, breakpoints responsive, layouts de página, contenedores, aspect ratios", output: "grid-layouts.html", isNew: false, key: "gridsLayouts" },
      { name: "Navegación", desc: "Header, sidebar, mobile nav, footer, breadcrumbs, tabs, paginación, search bar", output: "navigation.html", isNew: false, key: "navigation" },
      { name: "Cards & Contenedores", desc: "Estilos de cards (producto, info, stat, testimonial), modales, drawers, popovers, tooltips, accordions", output: "cards-containers.html", isNew: true, key: "cardsContainers" },
      { name: "Tags, Badges & Status", desc: "Etiquetas de estado, badges de notificación, budget tags, chips, pills, indicadores de progreso", output: "tags-badges.html", isNew: false, key: "tagsStatus" },
      { name: "Empty States & Errores", desc: "Páginas 404, estados vacíos, error states, skeleton loaders, loading spinners branded, estados offline", output: "empty-error-states.html", isNew: true, key: "emptyErrorStates" },
      { name: "Tablas & Listas", desc: "Data tables, listas ordenables, filtros, bulk actions, row states. Para dashboards y admin panels", output: "tables-lists.html", isNew: true, key: "tablesLists" },
    ]
  },
  {
    id: 4,
    phase: "FASE 4",
    title: "Presencia Digital",
    subtitle: "Web, redes sociales, email y contenido",
    color: "#10B981",
    weeks: "Semanas 13–16",
    modules: [
      { name: "Landing Pages", desc: "Templates de landing para productos/servicios, hero sections, CTAs, testimonios, pricing, FAQ. Diseño de conversión", output: "landing-templates.html", isNew: false, key: "landingPages" },
      { name: "Página de Producto", desc: "Ficha de producto/servicio: galería, especificaciones, precios, CTA, reviews, productos relacionados", output: "product-page.html", isNew: false, key: "productPage" },
      { name: "Carrito & Checkout", desc: "Flujo de compra: carrito, resumen, formulario de pago, confirmación. Si aplica para e-commerce", output: "cart-checkout.html", isNew: true, key: "cartCheckout" },
      { name: "Social Media Kit", desc: "Templates para: Instagram (posts, stories, reels, highlights), Facebook (posts, covers), WhatsApp (catálogos, estados). Dimensiones, grids de feed", output: "social-media-kit.html", isNew: false, key: "socialMediaKit" },
      { name: "Perfiles de Redes Sociales", desc: "Avatars, cover photos, bios, links. Cómo se ve la marca en cada plataforma. Guía de publicación", output: "social-profiles.html", isNew: true, key: "socialProfiles" },
      { name: "Email & Newsletters", desc: "Templates de email transaccional (confirmación, envío, factura), newsletters, notificaciones, firma de correo electrónico", output: "email-templates.html", isNew: false, key: "emailNewsletters" },
      { name: "Tickets de Soporte", desc: "Templates para tickets de Instagram, WhatsApp Business, Facebook Messenger. Respuestas rápidas, flujos de atención", output: "support-tickets.html", isNew: true, key: "supportTickets" },
      { name: "SEO & Meta Content", desc: "Estilo de títulos SEO, meta descriptions, OG images (preview al compartir links), favicon, structured data", output: "seo-meta.html", isNew: true, key: "seoMeta" },
      { name: "Presentaciones", desc: "Templates de PowerPoint/Keynote/Google Slides con branding: portada, contenido, gráficas, cierre", output: "presentations.html", isNew: true, key: "presentations" },
      { name: "Video Templates", desc: "Intros, outros, lower thirds, títulos, transiciones. Estilo para reels, YouTube, TikTok. Guía de edición", output: "video-templates.html", isNew: true, key: "videoTemplates" },
    ]
  },
  {
    id: 5,
    phase: "FASE 5",
    title: "Identidad Física",
    subtitle: "Aplicaciones tangibles y espacio de marca",
    color: "#F97316",
    weeks: "Semanas 17–20",
    modules: [
      { name: "Guía de Impresión", desc: "Especificaciones de print: CMYK, Pantone, resolución mínima, bleeds, tipos de papel, acabados. Para que imprenta no arruine la marca", output: "print-guidelines.html", isNew: true, key: "printGuide" },
      { name: "Papelería Corporativa", desc: "Facturas, notas de venta, recibos, cotizaciones, tarjetas de presentación, hojas membretadas, sobres", output: "stationery.html", isNew: false, key: "stationery" },
      { name: "Etiquetado de Productos", desc: "Etiquetas de precio, stickers, códigos QR con branding, tags de producto, empaques individuales", output: "product-labels.html", isNew: false, key: "labeling" },
      { name: "QR Codes Branded", desc: "Estilo de QR codes de marca: colores, logo integrado, frames, call to action. Para pagos, links, WhatsApp", output: "qr-codes.html", isNew: true, key: "qrCodes" },
      { name: "Packaging & Bolsas", desc: "Diseño de bolsas de entrega, cajas, empaques, tissue paper, stickers de sellado, unboxing experience", output: "packaging.html", isNew: false, key: "packaging" },
      { name: "Uniformes & Vestimenta", desc: "Guía de uniforme: colores, posición de logo, variantes por rol, accesorios permitidos, dress code", output: "uniforms.html", isNew: false, key: "uniforms" },
      { name: "Libretas & Merchandising", desc: "Libretas corporativas, plumas, llaveros, tazas, mousepads, USB, merchandise promocional", output: "merchandise.html", isNew: false, key: "merchandising" },
      { name: "Señalización & Wayfinding", desc: "Letreros exteriores, señalización interior, directorios, etiquetas de anaqueles, números de pasillo, señales de seguridad", output: "signage.html", isNew: true, key: "signage" },
      { name: "Diseño Arquitectónico", desc: "Lineamientos de fachada, interior, exhibidores, iluminación, materiales, colores de pared, disposición de mobiliario", output: "architecture.html", isNew: false, key: "architectural" },
      { name: "Vehículos & Flotilla", desc: "Si aplica: rotulado de vehículos de entrega/servicio, motocicletas, bicicletas. Posición de logo, colores", output: "vehicle-branding.html", isNew: true, key: "vehicles" },
    ]
  },
  {
    id: 6,
    phase: "FASE 6",
    title: "Experiencia del Cliente",
    subtitle: "Comportamiento, protocolos y cultura de marca",
    color: "#EF4444",
    weeks: "Semanas 21–24",
    modules: [
      { name: "Manual de Comportamiento", desc: "Protocolo de atención: saludo, presentación de producto, cierre de venta, despedida. Lenguaje de marca en persona. Qué decir y qué NO decir", output: "behavior-manual.html", isNew: false, key: "behaviorManual" },
      { name: "Manejo de Problemas", desc: "Protocolos de resolución: escalamiento, compensación, devoluciones, garantías. Cómo actuar en crisis, comunicación difícil", output: "problem-handling.html", isNew: false, key: "incidentManagement" },
      { name: "Sistema de Seguimiento CX", desc: "Tracking de experiencia: post-venta, motivación a recompra, programas de lealtad, puntos, referidos, NPS, encuestas", output: "cx-tracking.html", isNew: false, key: "cxSystem" },
      { name: "Onboarding de Empleados", desc: "Kit de bienvenida, training de marca para nuevos empleados: cómo representar la marca, materiales de capacitación", output: "employee-onboarding.html", isNew: true, key: "employeeOnboarding" },
      { name: "Co-branding & Partners", desc: "Reglas para uso de marca por terceros: partners, proveedores, alianzas. Cómo aparece el logo junto a otros. Lock-ups permitidos", output: "co-branding.html", isNew: true, key: "coBranding" },
      { name: "Benchmark & Referentes", desc: "Estudio de referentes (Apple, Microsoft, Google), análisis de mejores prácticas, qué tomar y qué no, diferenciadores", output: "benchmark.html", isNew: false, key: "benchmark" },
    ]
  },
  {
    id: 7,
    phase: "FASE 7",
    title: "Integraciones & Distribución",
    subtitle: "Conectores, exports y automatización",
    color: "#8B5CF6",
    weeks: "Semanas 25–28",
    modules: [
      { name: "Conector Notion", desc: "Sincronización del manual completo con Notion: páginas, bases de datos de assets, galería de componentes", output: "notion-connector", isNew: false, key: "notionConnector" },
      { name: "Export .md para LLMs", desc: "Archivos markdown optimizados para alimentar IA con contexto de marca completo. Prompts pre-hechos para generar contenido on-brand", output: "llm-export.md", isNew: false, key: "exportMdLlms" },
      { name: "Asset Library & Downloads", desc: "Centro de descargas: logos en todos los formatos (SVG, PNG, PDF), paleta, fuentes, templates. Organizado por categoría", output: "asset-library", isNew: true, key: "assetLibrary" },
      { name: "Release Notes & Versionado", desc: "Sistema de versiones del manual, changelog, notificaciones de cambios, historial de evolución de marca", output: "release-system", isNew: false, key: "releaseNotes" },
      { name: "Brand Audit Checklist", desc: "Checklist automático para auditar si un material cumple con el manual: colores correctos, fuentes, logo, tono, etc.", output: "brand-audit", isNew: true, key: "brandAudit" },
      { name: "Roadmap Generator", desc: "Generación automática de roadmaps visuales para planificación de marca y producto", output: "roadmap-generator", isNew: false, key: "roadmapGenerator" },
    ]
  }
];

// Función auxiliar para obtener módulo por key
export function getRoadmapModuleByKey(key: string): RoadmapModule | undefined {
  for (const phase of roadmapPhases) {
    const module = phase.modules.find(m => m.key === key);
    if (module) return module;
  }
  return undefined;
}

// Función auxiliar para obtener fase por ID
export function getRoadmapPhaseById(id: number): RoadmapPhase | undefined {
  return roadmapPhases.find(p => p.id === id);
}
