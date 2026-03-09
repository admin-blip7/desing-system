
import { Question } from "./onboarding";

export interface PromptModule {
    name: string;
    key: string; // Added key
    preQuestions: Question[];
    aiGenerates: string;
    feedsInto: string[];
    description?: string; // Added description optional for UI
}

export interface Phase {
    id: number;
    phase: string;
    title: string;
    color: string;
    unlockQuestions: Question[];
    modules: PromptModule[];
}

export const phases: Phase[] = [
    {
        id: 1,
        phase: "FASE 1",
        title: "Identidad",
        color: "#F5C518",
        unlockQuestions: [],
        modules: [
            {
                name: "Brand Story",
                key: "brandStory",
                description: "Narrativa completa de marca con estructura: origen, transformación, presente y visión futura",
                preQuestions: [
                    { q: "Cuéntame brevemente cómo nació tu negocio", type: "textarea", key: "originStory", example: "Empecé vendiendo fundas en un puesto, después abrí local..." },
                    { q: "¿Hubo un momento clave que definió el rumbo?", type: "textarea", key: "pivotMoment" },
                    { q: "¿Cuál es tu visión a 5 años?", type: "textarea", key: "vision5yr" },
                ],
                aiGenerates: "Narrativa completa de marca con estructura: origen, transformación, presente y visión futura",
                feedsInto: ["Filosofía de Marca", "Employee Onboarding", "Voice & Tone"]
            },
            {
                name: "Filosofía de Marca",
                key: "brandPhilosophy",
                description: "Misión, visión, valores, propósito, posicionamiento, promesa de marca, propuesta de valor",
                preQuestions: [
                    { q: "¿Cuál es el problema que resuelves para tu cliente?", type: "textarea", key: "problemSolved" },
                    { q: "¿Qué te diferencia de tu competencia directa?", type: "textarea", key: "differentiator" },
                    { q: "¿Cuáles son tus valores más importantes? (max 5)", type: "tags", key: "coreValues", example: "Honestidad, Servicio, Calidad, Innovación" },
                ],
                aiGenerates: "Misión, visión, valores, propósito, posicionamiento, promesa de marca, propuesta de valor",
                feedsInto: ["Voice & Tone", "Manual de Comportamiento", "Benchmark"]
            },
            {
                name: "Voice & Tone",
                key: "voiceTone",
                description: "Matriz de tono por canal, vocabulario de marca, frases DO y DON'T",
                preQuestions: [
                    { q: "¿Cómo le hablas a tus clientes actualmente?", type: "select", key: "currentTone", options: ["Muy formal (usted)", "Semi-formal", "Casual (tú)", "Muy informal/coloquial"] },
                    { q: "¿Usas jerga técnica con tus clientes?", type: "select", key: "techJargon", options: ["Sí, mis clientes la entienden", "A veces, pero la explico", "No, hablo simple siempre"] },
                    { q: "Pega un ejemplo de mensaje real que le enviarías a un cliente", type: "textarea", key: "sampleMessage" },
                ],
                aiGenerates: "Matriz de tono por canal (WhatsApp, Instagram, Web, en persona, factura), vocabulario de marca, frases DO y DON'T",
                feedsInto: ["Social Media Kit", "Email Templates", "Tickets de Soporte", "Manual de Comportamiento"]
            },
            {
                name: "Customer Personas",
                key: "customerPersonas",
                description: "Perfiles de buyer persona con nombre, demografía, motivaciones, frustraciones",
                preQuestions: [
                    { q: "Describe a tu mejor cliente (el que más compra y recomienda)", type: "textarea", key: "bestCustomer" },
                    { q: "¿Cuál es la objeción más común que recibes?", type: "textarea", key: "mainObjection" },
                    { q: "¿Cómo te encuentran tus clientes normalmente?", type: "multi-select", key: "discoveryChannels", options: ["Pasan por el local", "Recomendación", "Redes sociales", "Google/búsqueda", "WhatsApp", "Marketplace"] },
                ],
                aiGenerates: "2-3 perfiles de buyer persona con nombre, demografía, motivaciones, frustraciones, journey map básico",
                feedsInto: ["Landing Pages", "Social Media Kit", "Página de Producto", "CX Tracking"]
            },
            {
                name: "Logo & Isotipo",
                key: "logo",
                description: "Guía completa: versiones del logo, áreas de protección, tamaños mínimos, usos incorrectos",
                preQuestions: [
                    { q: "Sube tu logo actual (si tienes)", type: "file", key: "currentLogo" },
                    { q: "¿Qué te gusta de tu logo actual?", type: "textarea", key: "logoLikes", condition: "hasLogo=Sí, y me gusta|Sí, pero quiero mejorarlo" },
                    { q: "¿Prefieres logo tipográfico, simbólico, o combinado?", type: "select", key: "logoType", options: ["Tipográfico (solo letras)", "Simbólico (solo ícono)", "Combinado (texto + ícono)", "No estoy seguro"] },
                    { q: "¿El logo necesita funcionar en espacios muy pequeños? (ej: favicon, app icon)", type: "select", key: "logoSmallUse", options: ["Sí, es importante", "A veces", "No realmente"] },
                ],
                aiGenerates: "Guía completa: versiones del logo, áreas de protección, tamaños mínimos, usos incorrectos, versiones monocromáticas, fondos permitidos",
                feedsInto: ["TODOS los módulos visuales"]
            },
            {
                name: "Paleta de Color",
                key: "colorPalette",
                description: "Paleta completa: primarios, secundarios, acentos, grises, semánticos",
                preQuestions: [
                    { q: "¿Cuál es el 'mood' que quieres transmitir con los colores?", type: "multi-select", key: "colorMood", options: ["Confianza/Estabilidad", "Energía/Acción", "Lujo/Exclusividad", "Naturaleza/Calma", "Tecnología/Innovación", "Calidez/Cercanía", "Seriedad/Corporativo"] },
                    { q: "¿Hay colores que definitivamente NO quieres?", type: "text", key: "colorAvoid" },
                    { q: "¿Necesitas modo oscuro para tu marca?", type: "select", key: "needsDarkMode", options: ["Sí, es importante", "Sería nice", "No lo necesito"] },
                ],
                aiGenerates: "Paleta completa: primarios, secundarios, acentos, grises, semánticos (error, success, warning). HEX, RGB, HSL, CMYK, Pantone. Tokens CSS. Ratios WCAG",
                feedsInto: ["Botones", "Formularios", "Social Media Kit", "Papelería", "Todo lo visual"]
            },
            {
                name: "Tipografía",
                key: "typography",
                description: "Sistema tipográfico: display, body, mono. Escala fluid, jerarquías, pesos",
                preQuestions: [
                    { q: "¿Prefieres fuentes con serif (elegante) o sans-serif (moderna)?", type: "select", key: "fontPreference", options: ["Sans-serif (moderna, limpia)", "Serif (elegante, editorial)", "Mezcla de ambas", "No tengo preferencia"] },
                    { q: "¿Tu contenido es más visual o más textual?", type: "select", key: "contentType", options: ["Muy visual (pocas palabras)", "Balanceado", "Mucho texto (catálogos, descripciones)"] },
                    { q: "¿Ya usas alguna fuente específica?", type: "text", key: "currentFont", example: "Inter, Helvetica, etc." },
                ],
                aiGenerates: "Sistema tipográfico: display, body, mono. Escala fluid, jerarquías, pesos, line-height, letter-spacing. Para web, print, y mobile",
                feedsInto: ["Todos los módulos de UI", "Papelería", "Social Media"]
            },
            {
                name: "Entidades Geométricas",
                key: "geometry",
                description: "Sistema de formas: geometrías base, patrones, texturas, elementos decorativos",
                preQuestions: [
                    { q: "¿Tu marca se inclina más hacia formas suaves/orgánicas o angulares/geométricas?", type: "select", key: "shapeStyle", options: ["Suaves/Redondeadas", "Angulares/Geométricas", "Mezcla", "Sin preferencia"] },
                    { q: "¿Quieres patrones/texturas como parte de tu marca?", type: "select", key: "wantsPatterns", options: ["Sí, son importantes", "Sutiles, como fondo", "No, prefiero limpio"] },
                ],
                aiGenerates: "Sistema de formas: geometrías base, patrones, texturas, elementos decorativos, frames, dividers, backgrounds con brand patterns",
                feedsInto: ["Social Media Kit", "Packaging", "Arquitectura", "Merch"]
            },
        ]
    },
    {
        id: 2,
        phase: "FASE 2",
        title: "Visual Extendido",
        color: "#EC4899",
        unlockQuestions: [
            { q: "¿Tu marca usa fotografía propia o stock?", type: "select", key: "photoSource", options: ["Fotos propias", "Stock/banco de imágenes", "Ambas", "Casi no uso fotos"] },
            { q: "¿Usas video para promocionar tu marca?", type: "select", key: "usesVideo", options: ["Sí, frecuentemente", "A veces", "No, pero quiero empezar", "No me interesa"] },
        ],
        modules: [
            {
                name: "Dirección de Fotografía",
                key: "photography",
                description: "Guía de dirección de foto: composición, iluminación, paleta, mood board",
                preQuestions: [
                    { q: "¿Qué tipo de fotos usas más?", type: "multi-select", key: "photoTypes", options: ["Producto en fondo blanco", "Producto en contexto/lifestyle", "Del local/tienda", "Del equipo/empleados", "Testimonios de clientes", "Behind the scenes"] },
                    { q: "¿Tienes un fotógrafo o las tomas tú?", type: "select", key: "photoCreator", options: ["Fotógrafo profesional", "Yo con celular", "Mezcla"] },
                ],
                aiGenerates: "Guía de dirección de foto: composición, iluminación, paleta fotográfica, tratamiento, filtros, do's y don'ts, mood board",
                feedsInto: ["Social Media Kit", "Landing Pages", "Producto"]
            },
            {
                name: "Estilo de Ilustración",
                key: "illustration",
                description: "Sistema de ilustración: estilo, línea, paleta y reglas de consistencia",
                preQuestions: [
                    { q: "¿Tu marca usa o quiere usar ilustraciones?", type: "select", key: "usesIllustrations", options: ["Sí, son parte de la identidad", "Me gustaría incorporarlas", "No, solo fotografía"] },
                    { q: "¿Qué estilo te atrae?", type: "select", key: "illustrationStyle", options: ["Flat/2D", "Line art/Trazo", "3D/Isométrico", "Cartoon/Character", "Abstracto/Artístico"], condition: "usesIllustrations!=No" },
                ],
                aiGenerates: "Guía de ilustración: estilo, grosor de línea, paleta, personajes, escenas, nivel de detalle, grid de construcción",
                feedsInto: ["Social Media Kit", "Email", "Presentaciones", "Web"]
            },
            {
                name: "Iconografía",
                key: "iconography",
                description: "Sistema de íconos con grid, stroke y reglas de uso por canal",
                preQuestions: [
                    { q: "¿Qué acciones/conceptos necesitas representar con íconos?", type: "textarea", key: "iconNeeds", example: "Carrito, WhatsApp, envío, garantía, crédito, empeño..." },
                    { q: "¿Prefieres íconos de línea, sólidos o duotone?", type: "select", key: "iconStyle", options: ["Línea (outline)", "Sólidos (filled)", "Duotone (dos colores)", "Lo que combine mejor"] },
                ],
                aiGenerates: "Set de íconos de marca: grid de construcción, tamaños, pesos, espaciado, guía de creación de nuevos íconos consistentes",
                feedsInto: ["UI Kit completo", "Señalización", "Social Media"]
            },
            {
                name: "Motion & Animación",
                key: "motion",
                description: "Principios de movimiento aplicados a web, app y social",
                preQuestions: [
                    { q: "¿Dónde necesitas animaciones?", type: "multi-select", key: "motionUse", options: ["Sitio web", "App móvil", "Redes sociales (reels, stories)", "Presentaciones", "Loading de la marca"] },
                    { q: "¿La marca se siente más rápida/dinámica o calmada/suave?", type: "select", key: "motionFeeling", options: ["Rápida y dinámica", "Suave y elegante", "Equilibrada"] },
                ],
                aiGenerates: "Principios de motion: curvas de easing, duraciones, transiciones, micro-interacciones, loading animation, hover states, page reveals",
                feedsInto: ["Web", "App", "Social Media", "Presentaciones"]
            },
            {
                name: "Audio Branding",
                key: "audioBranding",
                description: "Identidad sonora: usos, tonalidad y reglas operativas",
                preQuestions: [
                    { q: "¿Tu negocio tiene sonido/música en el local?", type: "select", key: "hasStoreAudio", options: ["Sí, ponemos música", "No, es silencioso", "No tengo local"] },
                    { q: "¿Qué género/estilo de música representa tu marca?", type: "multi-select", key: "musicStyle", options: ["Electrónica/Moderna", "Pop/Mainstream", "Lofi/Chill", "Corporativo/Ambient", "Latina/Regional", "Sin música, solo efectos"] },
                ],
                aiGenerates: "Guía de audio: estilo musical, sonic logo, tonos de notificación, playlist curada, voiceover style, paisaje sonoro de tienda",
                feedsInto: ["Video Templates", "Tienda Física", "App/Web"]
            },
            {
                name: "Data Visualization",
                key: "dataVisualization",
                description: "Lineamientos de visualización de datos para dashboard y reportes",
                preQuestions: [
                    { q: "¿Manejas datos/estadísticas en tu comunicación?", type: "select", key: "usesData", options: ["Sí, frecuentemente (reportes, dashboards)", "A veces (en presentaciones)", "Casi nunca"] },
                ],
                aiGenerates: "Estilo de charts, gráficas y tablas de marca: colores por categoría, tipografía de ejes, leyendas, estilos de barras/líneas/pies",
                feedsInto: ["Presentaciones", "Reportes", "Dashboard"]
            },
        ]
    },
    {
        id: 3,
        phase: "FASE 3",
        title: "UI Kit",
        color: "#3B82F6",
        unlockQuestions: [
            { q: "¿Tienes o planeas tener sitio web/app?", type: "select", key: "hasWebApp", options: ["Sí, tengo", "Estoy desarrollando uno", "Lo planeo", "No por ahora"] },
            { q: "¿Qué tipo de interfaz necesitas?", type: "multi-select", key: "uiNeeds", options: ["Tienda online", "Landing page", "Dashboard/Admin", "App móvil", "Portal de clientes", "Solo redes/WhatsApp"] },
        ],
        modules: [
            {
                name: "Design Tokens",
                key: "designTokens",
                description: "Sistema base de variables de diseño para spacing, radios, sombras y breakpoints",
                preQuestions: [],
                aiGenerates: "Spacing scale, sizing, radii, shadows, z-index, breakpoints, opacity como variables CSS completas",
                feedsInto: ["Todos los componentes UI"]
            },
            {
                name: "Botones",
                key: "buttons",
                description: "Sistema de botones con variantes, tamaños y estados",
                preQuestions: [
                    { q: "¿Cuál es la acción más importante de tu sitio? (ej: 'Comprar', 'Cotizar', 'WhatsApp')", type: "text", key: "primaryAction" },
                ],
                aiGenerates: "Sistema de botones: primary, secondary, ghost, danger. Estados, tamaños, con íconos",
                feedsInto: ["Landing", "Producto", "Checkout"]
            },
            {
                name: "Formularios",
                key: "forms",
                description: "Sistema de campos de entrada, validaciones y estados de error",
                preQuestions: [
                    { q: "¿Qué datos recolectas de tus clientes?", type: "multi-select", key: "formData", options: ["Nombre", "Teléfono", "Email", "Dirección", "Datos de pago", "Datos de producto (para empeño/reparación)"] },
                ],
                aiGenerates: "Inputs, selects, checkboxes, validaciones, error states, labels",
                feedsInto: ["Checkout", "Contacto", "Soporte"]
            },
            {
                name: "Grids & Layouts",
                key: "gridsLayouts",
                description: "Sistema de layout y grillas responsive para toda la interfaz",
                preQuestions: [],
                aiGenerates: "Grid de 12 columnas, gutters, breakpoints responsive, layouts de página, contenedores",
                feedsInto: ["Todas las páginas"]
            },
            {
                name: "Navegación",
                key: "navigation",
                description: "Componentes de navegación principal y secundaria",
                preQuestions: [
                    { q: "¿Cuántas secciones principales tiene tu sitio?", type: "text", key: "navSections", example: "Inicio, Productos, Créditos, Empeño, Contacto" },
                ],
                aiGenerates: "Header, sidebar, mobile nav, footer, breadcrumbs, tabs, search",
                feedsInto: ["Toda la web/app"]
            },
            {
                name: "Cards & Contenedores",
                key: "cardsContainers",
                description: "Familia de contenedores y componentes de superficie",
                preQuestions: [],
                aiGenerates: "Cards de producto, info, testimonial. Modales, drawers, tooltips, accordions",
                feedsInto: ["Producto", "Landing", "Dashboard"]
            },
            {
                name: "Tags & Status",
                key: "tagsStatus",
                description: "Sistema de badges, etiquetas y estados semánticos",
                preQuestions: [
                    { q: "¿Qué estados manejas? (ej: Nuevo, En oferta, Agotado, En crédito)", type: "textarea", key: "statusTags" },
                ],
                aiGenerates: "Tags, badges, chips, pills, indicadores de progreso branded",
                feedsInto: ["Producto", "Dashboard", "Admin"]
            },
            {
                name: "Empty & Error States",
                key: "emptyErrorStates",
                description: "Biblioteca de estados de carga, vacío y error",
                preQuestions: [],
                aiGenerates: "404, empty states, error states, skeleton loaders, loading spinners con personalidad de marca",
                feedsInto: ["Web/App completa"]
            },
            {
                name: "Tablas & Listas",
                key: "tablesLists",
                description: "Componentes de tablas, listas, filtros y paginación",
                preQuestions: [],
                aiGenerates: "Data tables, listas, filtros, paginación de datos. Para dashboards y admin",
                feedsInto: ["Dashboard", "Admin", "Reportes"]
            },
        ]
    },
    {
        id: 4,
        phase: "FASE 4",
        title: "Digital",
        color: "#10B981",
        unlockQuestions: [],
        modules: [
            {
                name: "Landing Pages",
                key: "landingPages",
                description: "Plantillas de landing orientadas a conversión",
                preQuestions: [
                    { q: "¿Cuál es el objetivo #1 de tu landing? (Vender, captar leads, informar...)", type: "select", key: "landingGoal", options: ["Vender directo", "Captar WhatsApp/teléfono", "Informar servicios", "Generar citas/visitas"] },
                ],
                aiGenerates: "Templates de landing: hero, beneficios, testimonios, CTA, FAQ, pricing",
                feedsInto: ["SEO", "Social Media Ads"]
            },
            {
                name: "Página de Producto",
                key: "productPage",
                description: "Patrón de ficha de producto y arquitectura de detalle",
                preQuestions: [
                    { q: "¿Cuántos productos/servicios manejas aproximadamente?", type: "select", key: "productCount", options: ["1-10", "10-50", "50-200", "200+"] },
                    { q: "¿Los productos tienen variantes? (colores, capacidad, etc)", type: "select", key: "hasVariants", options: ["Sí", "No", "Algunos"] },
                ],
                aiGenerates: "Ficha de producto: galería, specs, precios, CTA, reviews, productos relacionados, comparador",
                feedsInto: ["Carrito", "SEO"]
            },
            {
                name: "Carrito & Checkout",
                key: "cartCheckout",
                description: "Flujo completo de compra, pago y confirmación",
                preQuestions: [
                    { q: "¿Cómo cobras actualmente?", type: "multi-select", key: "paymentMethods", options: ["Efectivo", "Tarjeta en local", "Transferencia", "Pago en línea", "Crédito propio", "Mercado Pago"] },
                ],
                aiGenerates: "Flujo de compra: carrito, resumen, checkout, confirmación",
                feedsInto: ["Email transaccional"]
            },
            {
                name: "Social Media Kit",
                key: "socialMediaKit",
                description: "Sistema de piezas para redes sociales por formato y plataforma",
                preQuestions: [
                    { q: "¿Con qué frecuencia publicas?", type: "select", key: "postFrequency", options: ["Diario", "3-5 veces/semana", "1-2 veces/semana", "Irregular"] },
                    { q: "¿Qué tipo de contenido publicas más?", type: "multi-select", key: "contentTypes", options: ["Fotos de producto", "Ofertas/Promociones", "Tips/Educativo", "Memes/Entretenimiento", "Behind the scenes", "Testimonios"] },
                ],
                aiGenerates: "Templates por plataforma: posts, stories, reels covers, highlights, Facebook covers. Grid de feed",
                feedsInto: ["Video Templates"]
            },
            {
                name: "Perfiles de Redes",
                key: "socialProfiles",
                description: "Optimización visual y textual de perfiles sociales",
                preQuestions: [],
                aiGenerates: "Avatars, covers, bios optimizadas, links, highlight covers para cada plataforma",
                feedsInto: ["Social Media Kit"]
            },
            {
                name: "Email & Newsletters",
                key: "emailNewsletters",
                description: "Sistema de comunicación por email transaccional y comercial",
                preQuestions: [
                    { q: "¿Envías emails a tus clientes?", type: "select", key: "sendsEmail", options: ["Sí, frecuentemente", "Solo transaccionales", "No, pero quiero empezar", "No me interesa"] },
                ],
                aiGenerates: "Templates: bienvenida, confirmación, envío, factura, newsletter, promo, firma",
                feedsInto: ["CX Tracking"]
            },
            {
                name: "Tickets de Soporte",
                key: "supportTickets",
                description: "Mensajería de soporte y flujos de atención",
                preQuestions: [
                    { q: "¿Por dónde te contactan más tus clientes con problemas?", type: "multi-select", key: "supportChannels", options: ["WhatsApp", "Instagram DM", "Facebook Messenger", "Teléfono", "Email", "En persona"] },
                ],
                aiGenerates: "Templates de respuesta rápida, flujos de atención, mensajes automáticos, escalamiento",
                feedsInto: ["Manejo de Problemas"]
            },
            {
                name: "SEO & Meta",
                key: "seoMeta",
                description: "Sistema de metadata y pautas SEO por tipo de página",
                preQuestions: [
                    { q: "¿Tu negocio depende de que lo encuentren en Google?", type: "select", key: "seoImportance", options: ["Mucho", "Algo", "No realmente"] },
                ],
                aiGenerates: "Estilo de titles, descriptions, OG images al compartir links, favicon, structured data",
                feedsInto: ["Landing", "Producto"]
            },
            {
                name: "Presentaciones",
                key: "presentations",
                description: "Plantillas y narrativa visual para presentaciones",
                preQuestions: [
                    { q: "¿Para qué usas presentaciones?", type: "multi-select", key: "presentationUse", options: ["Pitch a inversionistas", "Propuestas a clientes", "Capacitación interna", "Reportes mensuales", "No uso presentaciones"] },
                ],
                aiGenerates: "Templates Keynote/Slides: portada, contenido, gráficas, comparativos, cierre",
                feedsInto: ["Data Viz"]
            },
            {
                name: "Video Templates",
                key: "videoTemplates",
                description: "Lineamientos audiovisuales para contenido de video",
                preQuestions: [
                    { q: "¿Qué tipo de videos produces?", type: "multi-select", key: "videoTypes", options: ["Reels/TikToks", "YouTube", "Historias", "Ads pagados", "Videos de producto", "No hago video aún"] },
                ],
                aiGenerates: "Intros, outros, lower thirds, títulos, transiciones, thumbnails con branding",
                feedsInto: ["Social Media Kit", "Audio Branding"]
            },
        ]
    },
    {
        id: 5,
        phase: "FASE 5",
        title: "Físico",
        color: "#F97316",
        unlockQuestions: [
            { q: "¿Tienes un local/oficina física?", type: "select", key: "hasPhysicalSpace", options: ["Sí, tienda abierta al público", "Sí, oficina", "Sí, bodega/taller", "No, soy 100% digital"] },
            { q: "¿Manejas productos físicos que empacas/etiquetas?", type: "select", key: "hasPhysicalProducts", options: ["Sí", "No"] },
        ],
        modules: [
            {
                name: "Guía de Impresión",
                key: "printGuide",
                description: "Especificaciones técnicas para impresión consistente",
                preQuestions: [
                    { q: "¿Con qué frecuencia mandas a imprimir materiales?", type: "select", key: "printFrequency", options: ["Semanal", "Mensual", "Pocas veces al año", "Casi nunca"] },
                ],
                aiGenerates: "Specs de print: CMYK, Pantone, resolución, bleeds, papeles, acabados. Para que la imprenta no arruine la marca",
                feedsInto: ["Papelería", "Etiquetas", "Packaging"]
            },
            {
                name: "Papelería",
                key: "stationery",
                description: "Sistema de documentos y piezas impresas corporativas",
                preQuestions: [
                    { q: "¿Qué documentos imprimes?", type: "multi-select", key: "printedDocs", options: ["Facturas/Notas", "Cotizaciones", "Tarjetas de presentación", "Hojas membretadas", "Recibos/Tickets", "Contratos (crédito/empeño)"] },
                ],
                aiGenerates: "Diseño completo: facturas, notas, cotizaciones, tarjetas, hojas, sobres, recibos",
                feedsInto: []
            },
            {
                name: "Etiquetado",
                key: "labeling",
                description: "Sistema de etiquetas funcionales y promocionales",
                preQuestions: [
                    { q: "¿Qué tipo de etiquetas usas?", type: "multi-select", key: "labelTypes", options: ["Precios", "Identificación de producto", "Garantía/Sello", "QR para info", "Stickers decorativos", "Código de barras"] },
                ],
                aiGenerates: "Diseño de etiquetas por tipo, stickers, precios, garantías con branding",
                feedsInto: ["QR Codes"]
            },
            {
                name: "QR Codes",
                key: "qrCodes",
                description: "Estrategia y diseño de códigos QR con identidad de marca",
                preQuestions: [
                    { q: "¿Para qué usas QR?", type: "multi-select", key: "qrUse", options: ["Pagos (CoDi, PayPal)", "Link a WhatsApp", "Link a web/producto", "Redes sociales", "Wi-Fi del local", "No uso QR"] },
                ],
                aiGenerates: "QR codes branded por uso: colores, logo integrado, frames, CTA, tamaños",
                feedsInto: ["Etiquetado", "Papelería"]
            },
            {
                name: "Packaging",
                key: "packaging",
                description: "Sistema de empaque y experiencia de unboxing",
                preQuestions: [
                    { q: "¿Cómo entregas tus productos?", type: "multi-select", key: "deliveryMethod", options: ["Bolsa con logo", "Caja/empaque", "Bolsa genérica", "No empaco (servicio)"] },
                ],
                aiGenerates: "Diseño de bolsas, cajas, tissue paper, stickers de sellado, unboxing experience",
                feedsInto: []
            },
            {
                name: "Uniformes",
                key: "uniforms",
                description: "Guía de uniformes y presencia del equipo",
                preQuestions: [
                    { q: "¿Tu personal usa uniforme?", type: "select", key: "hasUniforms", options: ["Sí, formal", "Sí, casual (playera)", "No, pero quiero implementar", "No aplica"] },
                ],
                aiGenerates: "Guía de uniforme: playera/polo, colores, posición de logo, accesorios, variantes por rol",
                feedsInto: []
            },
            {
                name: "Merchandising",
                key: "merchandising",
                description: "Sistema de productos promocionales y de marca",
                preQuestions: [
                    { q: "¿Regalas o vendes merch de tu marca?", type: "select", key: "hasMerch", options: ["Sí", "Quiero empezar", "No me interesa"] },
                ],
                aiGenerates: "Diseño de libretas, plumas, tazas, mousepads, llaveros, USB branded",
                feedsInto: []
            },
            {
                name: "Señalización",
                key: "signage",
                description: "Sistema de señalética interior y exterior",
                preQuestions: [
                    { q: "¿Qué áreas tiene tu local?", type: "multi-select", key: "storeAreas", options: ["Exhibición/Mostrador", "Bodega", "Taller/Reparación", "Caja/Punto de pago", "Sala de espera", "Exterior/Fachada"], condition: "hasPhysicalSpace!=No" },
                ],
                aiGenerates: "Letreros, señalización interior, etiquetas de anaquel, fachada, directorios",
                feedsInto: ["Arquitectónico"]
            },
            {
                name: "Arquitectónico",
                key: "architectural",
                description: "Lineamientos espaciales para local, oficina o showroom",
                preQuestions: [
                    { q: "¿Cuánto espacio tiene tu local (m²)?", type: "text", key: "storeSize", condition: "hasPhysicalSpace!=No" },
                    { q: "¿Planeas remodelar o abrir nuevo local?", type: "select", key: "plansRemodel", options: ["Sí, pronto", "En el futuro", "No"] },
                ],
                aiGenerates: "Lineamientos: fachada, interior, exhibidores, iluminación, materiales, colores de pared, mobiliario",
                feedsInto: []
            },
            {
                name: "Vehículos",
                key: "vehicles",
                description: "Sistema de rotulación para flotilla y reparto",
                preQuestions: [
                    { q: "¿Qué tipo de vehículos usas?", type: "multi-select", key: "vehicleTypes", options: ["Auto", "Camioneta", "Moto", "Bicicleta", "No tengo vehículos de marca"], condition: "hasDelivery=Sí, con vehículos propios" },
                ],
                aiGenerates: "Rotulado de vehículos: posición de logo, colores, información de contacto",
                feedsInto: []
            },
        ]
    },
    {
        id: 6,
        phase: "FASE 6",
        title: "Experiencia",
        color: "#EF4444",
        unlockQuestions: [],
        modules: [
            {
                name: "Manual de Comportamiento",
                key: "behaviorManual",
                description: "Protocolo de interacción del equipo con clientes",
                preQuestions: [
                    { q: "¿Cuál es la queja más frecuente de tus clientes?", type: "textarea", key: "topComplaint" },
                    { q: "¿Qué hace que un cliente regrese a tu negocio?", type: "textarea", key: "returnReason" },
                    { q: "Describe el proceso ideal desde que entra un cliente hasta que se va", type: "textarea", key: "idealJourney" },
                ],
                aiGenerates: "Protocolo completo: saludo, presentación, cierre, despedida. Scripts por situación. Do's & Don'ts",
                feedsInto: ["Onboarding", "Problemas"]
            },
            {
                name: "Manejo de Problemas",
                key: "incidentManagement",
                description: "Framework de resolución de incidencias y crisis",
                preQuestions: [
                    { q: "¿Cuáles son los problemas más comunes?", type: "multi-select", key: "commonProblems", options: ["Producto defectuoso", "Entrega tardía", "Precio incorrecto", "Mal servicio del staff", "Garantía", "Devolución"] },
                    { q: "¿Tienes política de devoluciones?", type: "select", key: "hasReturnPolicy", options: ["Sí, formal", "Informal/caso por caso", "No"] },
                ],
                aiGenerates: "Protocolos de resolución, escalamiento, compensación, comunicación en crisis, scripts de disculpa",
                feedsInto: ["Tickets de Soporte"]
            },
            {
                name: "Sistema CX",
                key: "cxSystem",
                description: "Sistema de experiencia de cliente y retención",
                preQuestions: [
                    { q: "¿Haces seguimiento después de la venta?", type: "select", key: "hasPostSale", options: ["Sí, sistematizado", "A veces, manual", "No"] },
                    { q: "¿Tienes programa de lealtad?", type: "select", key: "hasLoyalty", options: ["Sí", "Lo estoy planeando", "No"] },
                ],
                aiGenerates: "Sistema de tracking: post-venta, recompra, lealtad, referidos, NPS, encuestas automáticas",
                feedsInto: ["Email", "WhatsApp"]
            },
            {
                name: "Onboarding Empleados",
                key: "employeeOnboarding",
                description: "Programa estructurado de incorporación de personal",
                preQuestions: [
                    { q: "¿Cómo capacitas a un empleado nuevo actualmente?", type: "select", key: "currentOnboarding", options: ["Le enseño yo directamente", "Manual/documento", "Aprende sobre la marcha", "No tengo proceso"] },
                ],
                aiGenerates: "Kit de bienvenida, checklist de capacitación, guía de marca para staff, evaluación de conocimiento",
                feedsInto: ["Manual de Comportamiento"]
            },
            {
                name: "Co-branding",
                key: "coBranding",
                description: "Reglas para alianzas y uso conjunto de marca",
                preQuestions: [
                    { q: "¿Trabajas con otras marcas/partners?", type: "select", key: "hasPartners", options: ["Sí, frecuentemente", "A veces", "No"] },
                    { q: "¿Qué tipo de alianzas?", type: "multi-select", key: "partnerTypes", options: ["Proveedores que co-promocionan", "Alianzas con otras tiendas", "Sponsors de eventos", "Programa de referidos con negocios"], condition: "hasPartners!=No" },
                ],
                aiGenerates: "Reglas de co-branding: lock-ups, proporciones, espaciado, fondos, usos permitidos/prohibidos",
                feedsInto: []
            },
            {
                name: "Benchmark",
                key: "benchmark",
                description: "Análisis competitivo y oportunidades de diferenciación",
                preQuestions: [
                    { q: "¿Quiénes son tus 3 competidores principales?", type: "textarea", key: "competitors" },
                    { q: "¿Qué marcas admiras (no necesariamente de tu industria)?", type: "textarea", key: "admiredBrands" },
                ],
                aiGenerates: "Análisis de referentes, mejores prácticas, diferenciadores, oportunidades, posicionamiento competitivo",
                feedsInto: ["Filosofía", "Visual Style"]
            },
        ]
    },
    {
        id: 7,
        phase: "FASE 7",
        title: "Distribución",
        color: "#8B5CF6",
        unlockQuestions: [],
        modules: [
            {
                name: "Conector Notion",
                key: "notionConnector",
                description: "Definición de sincronización del manual hacia Notion",
                preQuestions: [
                    { q: "¿Usas Notion?", type: "select", key: "usesNotion", options: ["Sí, es mi herramienta principal", "Sí, a veces", "No, pero me interesa", "No"] },
                ],
                aiGenerates: "Sync completo del manual a Notion: páginas por sección, base de datos de assets, vistas por equipo",
                feedsInto: []
            },
            {
                name: "Export .md para LLMs",
                key: "exportMdLlms",
                description: "Export estructurado para consumo por modelos de IA",
                preQuestions: [],
                aiGenerates: "Markdown optimizado con todo el contexto de marca para alimentar Claude, GPT, etc. Prompts pre-hechos",
                feedsInto: []
            },
            {
                name: "Asset Library",
                key: "assetLibrary",
                description: "Centro único de activos de marca por formato y canal",
                preQuestions: [],
                aiGenerates: "Centro de descargas: logos (SVG, PNG, PDF), paleta, fuentes, templates. Organizado por categoría y formato",
                feedsInto: []
            },
            {
                name: "Release Notes",
                key: "releaseNotes",
                description: "Historial de cambios y evolución de la marca",
                preQuestions: [],
                aiGenerates: "Sistema de versionado, changelog automático, historial de evolución, notificaciones de cambios",
                feedsInto: []
            },
            {
                name: "Brand Audit",
                key: "brandAudit",
                description: "Checklist de cumplimiento y control de calidad de marca",
                preQuestions: [],
                aiGenerates: "Checklist automático para verificar si un material cumple: colores, fuentes, logo, tono, spacing",
                feedsInto: []
            },
            {
                name: "Roadmap Generator",
                key: "roadmapGenerator",
                description: "Plan de implementación y priorización por etapas",
                preQuestions: [],
                aiGenerates: "Roadmaps visuales para planificación de marca, timeline de implementación",
                feedsInto: []
            },
        ]
    },
];
