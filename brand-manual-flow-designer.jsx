import { useState } from "react";

const flow = {
  onboarding: {
    title: "Onboarding Global",
    subtitle: "Se pregunta UNA vez — alimenta TODOS los módulos",
    icon: "◉",
    color: "#F5C518",
    steps: [
      {
        id: "brand-basics",
        name: "Identidad Base",
        questions: [
          { q: "¿Cuál es el nombre de tu marca/negocio?", type: "text", key: "brandName", required: true, example: "22 Electronic" },
          { q: "¿Tienes un slogan o tagline?", type: "text", key: "tagline", required: false, example: "Tecnología al alcance de todos" },
          { q: "¿En qué industria/sector operas?", type: "select", key: "industry", required: true, options: ["Electrónica/Tecnología", "Moda/Ropa", "Alimentos/Restaurante", "Salud/Bienestar", "Servicios Profesionales", "Educación", "Construcción", "Automotriz", "Belleza/Cosméticos", "Otro (especificar)"] },
          { q: "¿Qué vendes exactamente?", type: "textarea", key: "offering", required: true, example: "Venta de celulares, accesorios, reparaciones, créditos y empeño" },
          { q: "¿Cuántos años llevas operando?", type: "select", key: "yearsActive", required: true, options: ["Aún no lanzo", "Menos de 1 año", "1-3 años", "3-5 años", "5-10 años", "Más de 10 años"] },
        ]
      },
      {
        id: "brand-personality",
        name: "Personalidad",
        questions: [
          { q: "Si tu marca fuera una persona, ¿cómo sería?", type: "multi-select", key: "personality", required: true, options: ["Profesional y seria", "Amigable y cercana", "Innovadora y tech", "Elegante y premium", "Divertida y joven", "Confiable y tradicional", "Audaz y disruptiva", "Minimalista y sofisticada"] },
          { q: "¿Qué 3 palabras definen tu marca?", type: "tags", key: "brandWords", required: true, example: "Confianza, Tecnología, Accesibilidad" },
          { q: "¿Qué experiencia quieres que sienta tu cliente?", type: "textarea", key: "desiredExperience", required: true, example: "Que se sienta seguro comprando tecnología sin ser experto, con asesoría real y precios justos" },
          { q: "¿Qué NO quieres que tu marca transmita?", type: "textarea", key: "brandAvoid", required: false, example: "No queremos vernos baratos, informales o como tianguis" },
        ]
      },
      {
        id: "target-audience",
        name: "Público Objetivo",
        questions: [
          { q: "¿Quién es tu cliente principal?", type: "textarea", key: "primaryAudience", required: true, example: "Personas de 25-45 años de nivel socioeconómico medio que buscan celulares de buena calidad" },
          { q: "¿Rango de edad de tus clientes?", type: "range", key: "ageRange", required: true, example: "18-55" },
          { q: "¿Nivel socioeconómico?", type: "multi-select", key: "socioeconomic", required: true, options: ["Popular/Bajo", "Medio-bajo", "Medio", "Medio-alto", "Alto/Premium"] },
          { q: "¿Tu cliente compra por necesidad o por gusto?", type: "select", key: "buyMotivation", required: true, options: ["Principalmente necesidad", "Mezcla de ambos", "Principalmente gusto/deseo", "Impulso"] },
        ]
      },
      {
        id: "visual-preferences",
        name: "Preferencias Visuales",
        questions: [
          { q: "¿Ya tienes un logo?", type: "select", key: "hasLogo", required: true, options: ["Sí, y me gusta", "Sí, pero quiero mejorarlo", "No, necesito uno"] },
          { q: "¿Tienes colores de marca definidos?", type: "conditional", key: "hasColors", required: true, options: ["Sí (especificar HEX o describir)", "No, quiero que me sugieran"], followUp: { condition: "Sí", q: "¿Cuáles son tus colores?", type: "text", key: "brandColors" } },
          { q: "¿Qué estilo visual prefieres?", type: "multi-select", key: "visualStyle", required: true, options: ["Minimalista/Limpio", "Bold/Llamativo", "Elegante/Luxury", "Moderno/Tech", "Orgánico/Natural", "Retro/Vintage", "Industrial/Raw", "Colorido/Playful"] },
          { q: "¿Hay alguna marca cuyo estilo visual admires?", type: "textarea", key: "visualInspo", required: false, example: "Apple por su minimalismo, Samsung por su tech feel" },
        ]
      },
      {
        id: "business-context",
        name: "Contexto de Negocio",
        questions: [
          { q: "¿Dónde opera tu negocio?", type: "multi-select", key: "channels", required: true, options: ["Tienda física", "E-commerce/Web", "Redes sociales", "WhatsApp Business", "Marketplace (Amazon, ML)", "Solo digital/Sin local"] },
          { q: "¿Cuántos empleados tienes?", type: "select", key: "teamSize", required: true, options: ["Solo yo", "2-5", "6-15", "16-50", "50+"] },
          { q: "¿Tienes presencia en redes sociales?", type: "multi-select", key: "socialMedia", required: true, options: ["Instagram", "Facebook", "TikTok", "YouTube", "Twitter/X", "LinkedIn", "Ninguna aún"] },
          { q: "¿Manejas envíos/entregas?", type: "select", key: "hasDelivery", required: false, options: ["Sí, con vehículos propios", "Sí, con servicio externo", "Solo en tienda", "No aplica"] },
        ]
      }
    ]
  },
  phases: [
    {
      id: 1,
      phase: "FASE 1",
      title: "Identidad",
      color: "#F5C518",
      unlockQuestions: [],
      modules: [
        {
          name: "Brand Story",
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
          preQuestions: [
            { q: "¿Qué tipo de fotos usas más?", type: "multi-select", key: "photoTypes", options: ["Producto en fondo blanco", "Producto en contexto/lifestyle", "Del local/tienda", "Del equipo/empleados", "Testimonios de clientes", "Behind the scenes"] },
            { q: "¿Tienes un fotógrafo o las tomas tú?", type: "select", key: "photoCreator", options: ["Fotógrafo profesional", "Yo con celular", "Mezcla"] },
          ],
          aiGenerates: "Guía de dirección de foto: composición, iluminación, paleta fotográfica, tratamiento, filtros, do's y don'ts, mood board",
          feedsInto: ["Social Media Kit", "Landing Pages", "Producto"]
        },
        {
          name: "Estilo de Ilustración",
          preQuestions: [
            { q: "¿Tu marca usa o quiere usar ilustraciones?", type: "select", key: "usesIllustrations", options: ["Sí, son parte de la identidad", "Me gustaría incorporarlas", "No, solo fotografía"] },
            { q: "¿Qué estilo te atrae?", type: "select", key: "illustrationStyle", options: ["Flat/2D", "Line art/Trazo", "3D/Isométrico", "Cartoon/Character", "Abstracto/Artístico"], condition: "usesIllustrations!=No" },
          ],
          aiGenerates: "Guía de ilustración: estilo, grosor de línea, paleta, personajes, escenas, nivel de detalle, grid de construcción",
          feedsInto: ["Social Media Kit", "Email", "Presentaciones", "Web"]
        },
        {
          name: "Iconografía",
          preQuestions: [
            { q: "¿Qué acciones/conceptos necesitas representar con íconos?", type: "textarea", key: "iconNeeds", example: "Carrito, WhatsApp, envío, garantía, crédito, empeño..." },
            { q: "¿Prefieres íconos de línea, sólidos o duotone?", type: "select", key: "iconStyle", options: ["Línea (outline)", "Sólidos (filled)", "Duotone (dos colores)", "Lo que combine mejor"] },
          ],
          aiGenerates: "Set de íconos de marca: grid de construcción, tamaños, pesos, espaciado, guía de creación de nuevos íconos consistentes",
          feedsInto: ["UI Kit completo", "Señalización", "Social Media"]
        },
        {
          name: "Motion & Animación",
          preQuestions: [
            { q: "¿Dónde necesitas animaciones?", type: "multi-select", key: "motionUse", options: ["Sitio web", "App móvil", "Redes sociales (reels, stories)", "Presentaciones", "Loading de la marca"] },
            { q: "¿La marca se siente más rápida/dinámica o calmada/suave?", type: "select", key: "motionFeeling", options: ["Rápida y dinámica", "Suave y elegante", "Equilibrada"] },
          ],
          aiGenerates: "Principios de motion: curvas de easing, duraciones, transiciones, micro-interacciones, loading animation, hover states, page reveals",
          feedsInto: ["Web", "App", "Social Media", "Presentaciones"]
        },
        {
          name: "Audio Branding",
          preQuestions: [
            { q: "¿Tu negocio tiene sonido/música en el local?", type: "select", key: "hasStoreAudio", options: ["Sí, ponemos música", "No, es silencioso", "No tengo local"] },
            { q: "¿Qué género/estilo de música representa tu marca?", type: "multi-select", key: "musicStyle", options: ["Electrónica/Moderna", "Pop/Mainstream", "Lofi/Chill", "Corporativo/Ambient", "Latina/Regional", "Sin música, solo efectos"] },
          ],
          aiGenerates: "Guía de audio: estilo musical, sonic logo, tonos de notificación, playlist curada, voiceover style, paisaje sonoro de tienda",
          feedsInto: ["Video Templates", "Tienda Física", "App/Web"]
        },
        {
          name: "Data Visualization",
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
        { name: "Design Tokens", preQuestions: [], aiGenerates: "Spacing scale, sizing, radii, shadows, z-index, breakpoints, opacity — como variables CSS completas", feedsInto: ["Todos los componentes UI"] },
        { name: "Botones", preQuestions: [{ q: "¿Cuál es la acción más importante de tu sitio? (ej: 'Comprar', 'Cotizar', 'WhatsApp')", type: "text", key: "primaryAction" }], aiGenerates: "Sistema de botones: primary, secondary, ghost, danger. Estados, tamaños, con íconos", feedsInto: ["Landing", "Producto", "Checkout"] },
        { name: "Formularios", preQuestions: [{ q: "¿Qué datos recolectas de tus clientes?", type: "multi-select", key: "formData", options: ["Nombre", "Teléfono", "Email", "Dirección", "Datos de pago", "Datos de producto (para empeño/reparación)"] }], aiGenerates: "Inputs, selects, checkboxes, validaciones, error states, labels", feedsInto: ["Checkout", "Contacto", "Soporte"] },
        { name: "Grids & Layouts", preQuestions: [], aiGenerates: "Grid de 12 columnas, gutters, breakpoints responsive, layouts de página, contenedores", feedsInto: ["Todas las páginas"] },
        { name: "Navegación", preQuestions: [{ q: "¿Cuántas secciones principales tiene tu sitio?", type: "text", key: "navSections", example: "Inicio, Productos, Créditos, Empeño, Contacto" }], aiGenerates: "Header, sidebar, mobile nav, footer, breadcrumbs, tabs, search", feedsInto: ["Toda la web/app"] },
        { name: "Cards & Contenedores", preQuestions: [], aiGenerates: "Cards de producto, info, testimonial. Modales, drawers, tooltips, accordions", feedsInto: ["Producto", "Landing", "Dashboard"] },
        { name: "Tags & Status", preQuestions: [{ q: "¿Qué estados manejas? (ej: Nuevo, En oferta, Agotado, En crédito)", type: "textarea", key: "statusTags" }], aiGenerates: "Tags, badges, chips, pills, indicadores de progreso branded", feedsInto: ["Producto", "Dashboard", "Admin"] },
        { name: "Empty & Error States", preQuestions: [], aiGenerates: "404, empty states, error states, skeleton loaders, loading spinners con personalidad de marca", feedsInto: ["Web/App completa"] },
        { name: "Tablas & Listas", preQuestions: [], aiGenerates: "Data tables, listas, filtros, paginación de datos. Para dashboards y admin", feedsInto: ["Dashboard", "Admin", "Reportes"] },
      ]
    },
    {
      id: 4,
      phase: "FASE 4",
      title: "Digital",
      color: "#10B981",
      unlockQuestions: [],
      modules: [
        { name: "Landing Pages", preQuestions: [{ q: "¿Cuál es el objetivo #1 de tu landing? (Vender, captar leads, informar...)", type: "select", key: "landingGoal", options: ["Vender directo", "Captar WhatsApp/teléfono", "Informar servicios", "Generar citas/visitas"] }], aiGenerates: "Templates de landing: hero, beneficios, testimonios, CTA, FAQ, pricing", feedsInto: ["SEO", "Social Media Ads"] },
        { name: "Página de Producto", preQuestions: [{ q: "¿Cuántos productos/servicios manejas aproximadamente?", type: "select", key: "productCount", options: ["1-10", "10-50", "50-200", "200+"] }, { q: "¿Los productos tienen variantes? (colores, capacidad, etc)", type: "select", key: "hasVariants", options: ["Sí", "No", "Algunos"] }], aiGenerates: "Ficha de producto: galería, specs, precios, CTA, reviews, productos relacionados, comparador", feedsInto: ["Carrito", "SEO"] },
        { name: "Carrito & Checkout", preQuestions: [{ q: "¿Cómo cobras actualmente?", type: "multi-select", key: "paymentMethods", options: ["Efectivo", "Tarjeta en local", "Transferencia", "Pago en línea", "Crédito propio", "Mercado Pago"] }], aiGenerates: "Flujo de compra: carrito, resumen, checkout, confirmación", feedsInto: ["Email transaccional"] },
        { name: "Social Media Kit", preQuestions: [{ q: "¿Con qué frecuencia publicas?", type: "select", key: "postFrequency", options: ["Diario", "3-5 veces/semana", "1-2 veces/semana", "Irregular"] }, { q: "¿Qué tipo de contenido publicas más?", type: "multi-select", key: "contentTypes", options: ["Fotos de producto", "Ofertas/Promociones", "Tips/Educativo", "Memes/Entretenimiento", "Behind the scenes", "Testimonios"] }], aiGenerates: "Templates por plataforma: posts, stories, reels covers, highlights, Facebook covers. Grid de feed", feedsInto: ["Video Templates"] },
        { name: "Perfiles de Redes", preQuestions: [], aiGenerates: "Avatars, covers, bios optimizadas, links, highlight covers para cada plataforma", feedsInto: ["Social Media Kit"] },
        { name: "Email & Newsletters", preQuestions: [{ q: "¿Envías emails a tus clientes?", type: "select", key: "sendsEmail", options: ["Sí, frecuentemente", "Solo transaccionales", "No, pero quiero empezar", "No me interesa"] }], aiGenerates: "Templates: bienvenida, confirmación, envío, factura, newsletter, promo, firma", feedsInto: ["CX Tracking"] },
        { name: "Tickets de Soporte", preQuestions: [{ q: "¿Por dónde te contactan más tus clientes con problemas?", type: "multi-select", key: "supportChannels", options: ["WhatsApp", "Instagram DM", "Facebook Messenger", "Teléfono", "Email", "En persona"] }], aiGenerates: "Templates de respuesta rápida, flujos de atención, mensajes automáticos, escalamiento", feedsInto: ["Manejo de Problemas"] },
        { name: "SEO & Meta", preQuestions: [{ q: "¿Tu negocio depende de que lo encuentren en Google?", type: "select", key: "seoImportance", options: ["Mucho", "Algo", "No realmente"] }], aiGenerates: "Estilo de titles, descriptions, OG images al compartir links, favicon, structured data", feedsInto: ["Landing", "Producto"] },
        { name: "Presentaciones", preQuestions: [{ q: "¿Para qué usas presentaciones?", type: "multi-select", key: "presentationUse", options: ["Pitch a inversionistas", "Propuestas a clientes", "Capacitación interna", "Reportes mensuales", "No uso presentaciones"] }], aiGenerates: "Templates Keynote/Slides: portada, contenido, gráficas, comparativos, cierre", feedsInto: ["Data Viz"] },
        { name: "Video Templates", preQuestions: [{ q: "¿Qué tipo de videos produces?", type: "multi-select", key: "videoTypes", options: ["Reels/TikToks", "YouTube", "Historias", "Ads pagados", "Videos de producto", "No hago video aún"] }], aiGenerates: "Intros, outros, lower thirds, títulos, transiciones, thumbnails con branding", feedsInto: ["Social Media Kit", "Audio Branding"] },
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
        { name: "Guía de Impresión", preQuestions: [{ q: "¿Con qué frecuencia mandas a imprimir materiales?", type: "select", key: "printFrequency", options: ["Semanal", "Mensual", "Pocas veces al año", "Casi nunca"] }], aiGenerates: "Specs de print: CMYK, Pantone, resolución, bleeds, papeles, acabados. Para que la imprenta no arruine la marca", feedsInto: ["Papelería", "Etiquetas", "Packaging"] },
        { name: "Papelería", preQuestions: [{ q: "¿Qué documentos imprimes?", type: "multi-select", key: "printedDocs", options: ["Facturas/Notas", "Cotizaciones", "Tarjetas de presentación", "Hojas membretadas", "Recibos/Tickets", "Contratos (crédito/empeño)"] }], aiGenerates: "Diseño completo: facturas, notas, cotizaciones, tarjetas, hojas, sobres, recibos", feedsInto: [] },
        { name: "Etiquetado", preQuestions: [{ q: "¿Qué tipo de etiquetas usas?", type: "multi-select", key: "labelTypes", options: ["Precios", "Identificación de producto", "Garantía/Sello", "QR para info", "Stickers decorativos", "Código de barras"] }], aiGenerates: "Diseño de etiquetas por tipo, stickers, precios, garantías con branding", feedsInto: ["QR Codes"] },
        { name: "QR Codes", preQuestions: [{ q: "¿Para qué usas QR?", type: "multi-select", key: "qrUse", options: ["Pagos (CoDi, PayPal)", "Link a WhatsApp", "Link a web/producto", "Redes sociales", "Wi-Fi del local", "No uso QR"] }], aiGenerates: "QR codes branded por uso: colores, logo integrado, frames, CTA, tamaños", feedsInto: ["Etiquetado", "Papelería"] },
        { name: "Packaging", preQuestions: [{ q: "¿Cómo entregas tus productos?", type: "multi-select", key: "deliveryMethod", options: ["Bolsa con logo", "Caja/empaque", "Bolsa genérica", "No empaco (servicio)"] }], aiGenerates: "Diseño de bolsas, cajas, tissue paper, stickers de sellado, unboxing experience", feedsInto: [] },
        { name: "Uniformes", preQuestions: [{ q: "¿Tu personal usa uniforme?", type: "select", key: "hasUniforms", options: ["Sí, formal", "Sí, casual (playera)", "No, pero quiero implementar", "No aplica"] }], aiGenerates: "Guía de uniforme: playera/polo, colores, posición de logo, accesorios, variantes por rol", feedsInto: [] },
        { name: "Merchandising", preQuestions: [{ q: "¿Regalas o vendes merch de tu marca?", type: "select", key: "hasMerch", options: ["Sí", "Quiero empezar", "No me interesa"] }], aiGenerates: "Diseño de libretas, plumas, tazas, mousepads, llaveros, USB branded", feedsInto: [] },
        { name: "Señalización", preQuestions: [{ q: "¿Qué áreas tiene tu local?", type: "multi-select", key: "storeAreas", options: ["Exhibición/Mostrador", "Bodega", "Taller/Reparación", "Caja/Punto de pago", "Sala de espera", "Exterior/Fachada"], condition: "hasPhysicalSpace!=No" }], aiGenerates: "Letreros, señalización interior, etiquetas de anaquel, fachada, directorios", feedsInto: ["Arquitectónico"] },
        { name: "Arquitectónico", preQuestions: [{ q: "¿Cuánto espacio tiene tu local (m²)?", type: "text", key: "storeSize", condition: "hasPhysicalSpace!=No" }, { q: "¿Planeas remodelar o abrir nuevo local?", type: "select", key: "plansRemodel", options: ["Sí, pronto", "En el futuro", "No"] }], aiGenerates: "Lineamientos: fachada, interior, exhibidores, iluminación, materiales, colores de pared, mobiliario", feedsInto: [] },
        { name: "Vehículos", preQuestions: [{ q: "¿Qué tipo de vehículos usas?", type: "multi-select", key: "vehicleTypes", options: ["Auto", "Camioneta", "Moto", "Bicicleta", "No tengo vehículos de marca"], condition: "hasDelivery=Sí, con vehículos propios" }], aiGenerates: "Rotulado de vehículos: posición de logo, colores, información de contacto", feedsInto: [] },
      ]
    },
    {
      id: 6,
      phase: "FASE 6",
      title: "Experiencia",
      color: "#EF4444",
      unlockQuestions: [],
      modules: [
        { name: "Manual de Comportamiento", preQuestions: [{ q: "¿Cuál es la queja más frecuente de tus clientes?", type: "textarea", key: "topComplaint" }, { q: "¿Qué hace que un cliente regrese a tu negocio?", type: "textarea", key: "returnReason" }, { q: "Describe el proceso ideal desde que entra un cliente hasta que se va", type: "textarea", key: "idealJourney" }], aiGenerates: "Protocolo completo: saludo, presentación, cierre, despedida. Scripts por situación. Do's & Don'ts", feedsInto: ["Onboarding", "Problemas"] },
        { name: "Manejo de Problemas", preQuestions: [{ q: "¿Cuáles son los problemas más comunes?", type: "multi-select", key: "commonProblems", options: ["Producto defectuoso", "Entrega tardía", "Precio incorrecto", "Mal servicio del staff", "Garantía", "Devolución"] }, { q: "¿Tienes política de devoluciones?", type: "select", key: "hasReturnPolicy", options: ["Sí, formal", "Informal/caso por caso", "No"] }], aiGenerates: "Protocolos de resolución, escalamiento, compensación, comunicación en crisis, scripts de disculpa", feedsInto: ["Tickets de Soporte"] },
        { name: "Sistema CX", preQuestions: [{ q: "¿Haces seguimiento después de la venta?", type: "select", key: "hasPostSale", options: ["Sí, sistematizado", "A veces, manual", "No"] }, { q: "¿Tienes programa de lealtad?", type: "select", key: "hasLoyalty", options: ["Sí", "Lo estoy planeando", "No"] }], aiGenerates: "Sistema de tracking: post-venta, recompra, lealtad, referidos, NPS, encuestas automáticas", feedsInto: ["Email", "WhatsApp"] },
        { name: "Onboarding Empleados", preQuestions: [{ q: "¿Cómo capacitas a un empleado nuevo actualmente?", type: "select", key: "currentOnboarding", options: ["Le enseño yo directamente", "Manual/documento", "Aprende sobre la marcha", "No tengo proceso"] }], aiGenerates: "Kit de bienvenida, checklist de capacitación, guía de marca para staff, evaluación de conocimiento", feedsInto: ["Manual de Comportamiento"] },
        { name: "Co-branding", preQuestions: [{ q: "¿Trabajas con otras marcas/partners?", type: "select", key: "hasPartners", options: ["Sí, frecuentemente", "A veces", "No"] }, { q: "¿Qué tipo de alianzas?", type: "multi-select", key: "partnerTypes", options: ["Proveedores que co-promocionan", "Alianzas con otras tiendas", "Sponsors de eventos", "Programa de referidos con negocios"], condition: "hasPartners!=No" }], aiGenerates: "Reglas de co-branding: lock-ups, proporciones, espaciado, fondos, usos permitidos/prohibidos", feedsInto: [] },
        { name: "Benchmark", preQuestions: [{ q: "¿Quiénes son tus 3 competidores principales?", type: "textarea", key: "competitors" }, { q: "¿Qué marcas admiras (no necesariamente de tu industria)?", type: "textarea", key: "admiredBrands" }], aiGenerates: "Análisis de referentes, mejores prácticas, diferenciadores, oportunidades, posicionamiento competitivo", feedsInto: ["Filosofía", "Visual Style"] },
      ]
    },
    {
      id: 7,
      phase: "FASE 7",
      title: "Distribución",
      color: "#8B5CF6",
      unlockQuestions: [],
      modules: [
        { name: "Conector Notion", preQuestions: [{ q: "¿Usas Notion?", type: "select", key: "usesNotion", options: ["Sí, es mi herramienta principal", "Sí, a veces", "No, pero me interesa", "No"] }], aiGenerates: "Sync completo del manual a Notion: páginas por sección, base de datos de assets, vistas por equipo", feedsInto: [] },
        { name: "Export .md para LLMs", preQuestions: [], aiGenerates: "Markdown optimizado con todo el contexto de marca para alimentar Claude, GPT, etc. Prompts pre-hechos", feedsInto: [] },
        { name: "Asset Library", preQuestions: [], aiGenerates: "Centro de descargas: logos (SVG, PNG, PDF), paleta, fuentes, templates. Organizado por categoría y formato", feedsInto: [] },
        { name: "Release Notes", preQuestions: [], aiGenerates: "Sistema de versionado, changelog automático, historial de evolución, notificaciones de cambios", feedsInto: [] },
        { name: "Brand Audit", preQuestions: [], aiGenerates: "Checklist automático para verificar si un material cumple: colores, fuentes, logo, tono, spacing", feedsInto: [] },
        { name: "Roadmap Generator", preQuestions: [], aiGenerates: "Roadmaps visuales para planificación de marca, timeline de implementación", feedsInto: [] },
      ]
    }
  ]
};

const totalQuestions = flow.onboarding.steps.reduce((a, s) => a + s.questions.length, 0) +
  flow.phases.reduce((a, p) => a + p.unlockQuestions.length + p.modules.reduce((b, m) => b + m.preQuestions.length, 0), 0);

export default function FlowDesigner() {
  const [activeView, setActiveView] = useState("onboarding");
  const [activeStep, setActiveStep] = useState(0);
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);

  const activePhase = flow.phases[activePhaseIdx];
  const activeModule = activePhase?.modules[activeModuleIdx];

  return (
    <div style={{ minHeight: "100vh", background: "#09090B", color: "#E5E5E5", fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
      {/* Top Bar */}
      <div style={{ padding: "20px 32px", borderBottom: "1px solid #18181B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#3F3F46", textTransform: "uppercase" }}>Brand Manual Generator</div>
          <h1 style={{ fontSize: 24, fontWeight: 200, color: "#fff", margin: "4px 0 0" }}>
            Flujo de Preguntas & Generación
          </h1>
        </div>
        <div style={{ display: "flex", gap: 4, background: "#18181B", borderRadius: 6, padding: 3 }}>
          {[
            { key: "onboarding", label: "Onboarding" },
            { key: "modules", label: "Por Módulo" },
            { key: "datamap", label: "Data Map" },
          ].map(v => (
            <button key={v.key} onClick={() => setActiveView(v.key)} style={{
              padding: "6px 14px", borderRadius: 4, border: "none",
              background: activeView === v.key ? "#27272A" : "transparent",
              color: activeView === v.key ? "#F5C518" : "#52525B",
              fontSize: 11, cursor: "pointer", fontWeight: 500
            }}>{v.label}</button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ padding: "12px 32px", borderBottom: "1px solid #18181B", display: "flex", gap: 24, background: "#0C0C0E" }}>
        {[
          { label: "Preguntas Onboarding", value: flow.onboarding.steps.reduce((a, s) => a + s.questions.length, 0) },
          { label: "Preguntas por Fase", value: flow.phases.reduce((a, p) => a + p.unlockQuestions.length, 0) },
          { label: "Preguntas por Módulo", value: flow.phases.reduce((a, p) => a + p.modules.reduce((b, m) => b + m.preQuestions.length, 0), 0) },
          { label: "Total Preguntas", value: totalQuestions, highlight: true },
          { label: "Módulos Generables", value: flow.phases.reduce((a, p) => a + p.modules.length, 0) },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: 18, fontWeight: 300, color: s.highlight ? "#F5C518" : "#fff" }}>{s.value}</div>
            <div style={{ fontSize: 8, color: "#3F3F46", textTransform: "uppercase", letterSpacing: "0.15em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ONBOARDING VIEW */}
      {activeView === "onboarding" && (
        <div style={{ display: "flex", minHeight: "calc(100vh - 140px)" }}>
          {/* Step Sidebar */}
          <div style={{ width: 240, borderRight: "1px solid #18181B", padding: "16px 0" }}>
            <div style={{ padding: "0 16px 12px", fontSize: 9, letterSpacing: "0.2em", color: "#3F3F46", textTransform: "uppercase" }}>
              Pasos del Onboarding
            </div>
            {flow.onboarding.steps.map((s, i) => (
              <button key={i} onClick={() => setActiveStep(i)} style={{
                display: "block", width: "100%", textAlign: "left", border: "none",
                padding: "10px 16px", cursor: "pointer",
                background: activeStep === i ? "#18181B" : "transparent",
                borderLeft: `2px solid ${activeStep === i ? "#F5C518" : "transparent"}`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 4,
                    background: activeStep === i ? "#F5C51820" : "#18181B",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: activeStep === i ? "#F5C518" : "#52525B"
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 12, color: activeStep === i ? "#fff" : "#71717A" }}>{s.name}</span>
                  <span style={{ fontSize: 9, color: "#3F3F46", marginLeft: "auto" }}>{s.questions.length}</span>
                </div>
              </button>
            ))}
            <div style={{ padding: "16px", borderTop: "1px solid #18181B", marginTop: 8 }}>
              <div style={{ fontSize: 10, color: "#52525B", lineHeight: 1.6 }}>
                Estas preguntas se hacen <span style={{ color: "#F5C518" }}>una sola vez</span> al crear la marca. Las respuestas alimentan todos los módulos automáticamente.
              </div>
            </div>
          </div>

          {/* Questions */}
          <div style={{ flex: 1, padding: "24px 32px" }}>
            {flow.onboarding.steps[activeStep] && (
              <>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 10, color: "#F5C518", letterSpacing: "0.15em", fontWeight: 600, marginBottom: 4 }}>
                    PASO {activeStep + 1} DE {flow.onboarding.steps.length}
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 300, color: "#fff", margin: 0 }}>
                    {flow.onboarding.steps[activeStep].name}
                  </h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {flow.onboarding.steps[activeStep].questions.map((q, i) => (
                    <div key={i} style={{
                      background: "#111113", borderRadius: 8, padding: 16,
                      border: "1px solid #1E1E22"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div style={{ fontSize: 13, color: "#E4E4E7", fontWeight: 400, lineHeight: 1.5, flex: 1 }}>
                          {q.q}
                        </div>
                        <div style={{ display: "flex", gap: 4, marginLeft: 12, flexShrink: 0 }}>
                          <span style={{
                            fontSize: 8, padding: "2px 6px", borderRadius: 3,
                            background: q.type === "text" ? "#3B82F620" : q.type === "textarea" ? "#8B5CF620" : q.type === "select" ? "#10B98120" : q.type === "multi-select" ? "#F5C51820" : q.type === "tags" ? "#EC489920" : q.type === "file" ? "#F9731620" : "#52525B20",
                            color: q.type === "text" ? "#3B82F6" : q.type === "textarea" ? "#8B5CF6" : q.type === "select" ? "#10B981" : q.type === "multi-select" ? "#F5C518" : q.type === "tags" ? "#EC4899" : q.type === "file" ? "#F97316" : "#52525B",
                            fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase"
                          }}>
                            {q.type}
                          </span>
                          {q.required && (
                            <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 3, background: "#EF444420", color: "#EF4444", fontWeight: 600 }}>
                              REQ
                            </span>
                          )}
                        </div>
                      </div>
                      {q.options && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                          {q.options.map((o, j) => (
                            <span key={j} style={{
                              fontSize: 10, padding: "3px 8px", borderRadius: 4,
                              background: "#18181B", color: "#71717A", border: "1px solid #27272A"
                            }}>{o}</span>
                          ))}
                        </div>
                      )}
                      {q.example && (
                        <div style={{ fontSize: 11, color: "#3F3F46", marginTop: 6, fontStyle: "italic" }}>
                          Ej: "{q.example}"
                        </div>
                      )}
                      <div style={{ fontSize: 9, color: "#27272A", marginTop: 6, fontFamily: "monospace" }}>
                        key: {q.key}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODULES VIEW */}
      {activeView === "modules" && (
        <div style={{ display: "flex", minHeight: "calc(100vh - 140px)" }}>
          {/* Phase + Module Sidebar */}
          <div style={{ width: 280, borderRight: "1px solid #18181B", padding: "12px 0", overflowY: "auto" }}>
            {flow.phases.map((p, pi) => (
              <div key={pi}>
                <div
                  onClick={() => { setActivePhaseIdx(pi); setActiveModuleIdx(0); }}
                  style={{
                    padding: "8px 16px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />
                  <span style={{ fontSize: 10, letterSpacing: "0.12em", color: activePhaseIdx === pi ? p.color : "#3F3F46", fontWeight: 600 }}>
                    {p.phase}
                  </span>
                  <span style={{ fontSize: 10, color: "#27272A" }}>{p.title}</span>
                </div>
                {activePhaseIdx === pi && p.modules.map((m, mi) => (
                  <button key={mi} onClick={() => setActiveModuleIdx(mi)} style={{
                    display: "block", width: "100%", textAlign: "left", border: "none",
                    padding: "6px 16px 6px 30px", cursor: "pointer",
                    background: activeModuleIdx === mi ? "#18181B" : "transparent",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 9, color: activeModuleIdx === mi ? p.color : "#27272A", fontWeight: 600 }}>
                        {String(mi + 1).padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: 11, color: activeModuleIdx === mi ? "#fff" : "#52525B" }}>
                        {m.name}
                      </span>
                      {m.preQuestions.length > 0 && (
                        <span style={{ fontSize: 8, color: "#3F3F46", marginLeft: "auto" }}>
                          {m.preQuestions.length}q
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Module Detail */}
          <div style={{ flex: 1, padding: "24px 32px" }}>
            {activeModule && (
              <>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: activePhase.color }} />
                    <span style={{ fontSize: 9, letterSpacing: "0.15em", color: activePhase.color, fontWeight: 600 }}>{activePhase.phase}</span>
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 300, color: "#fff", margin: 0 }}>{activeModule.name}</h2>
                </div>

                {/* Unlock Questions */}
                {activePhase.unlockQuestions.length > 0 && (
                  <div style={{ marginBottom: 20, padding: 16, background: "#111113", borderRadius: 8, border: `1px solid ${activePhase.color}20` }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.15em", color: activePhase.color, fontWeight: 600, marginBottom: 10 }}>
                      PREGUNTAS DE FASE (se preguntan al entrar a {activePhase.phase})
                    </div>
                    {activePhase.unlockQuestions.map((q, i) => (
                      <div key={i} style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ color: "#3F3F46", fontSize: 11 }}>→</span>
                        <div>
                          <div style={{ fontSize: 12, color: "#A1A1AA" }}>{q.q}</div>
                          {q.options && <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
                            {q.options.map((o, j) => <span key={j} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "#18181B", color: "#52525B" }}>{o}</span>)}
                          </div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Module Pre-Questions */}
                {activeModule.preQuestions.length > 0 ? (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "#52525B", fontWeight: 600, marginBottom: 10 }}>
                      PREGUNTAS ESPECÍFICAS DEL MÓDULO
                    </div>
                    {activeModule.preQuestions.map((q, i) => (
                      <div key={i} style={{
                        background: "#111113", borderRadius: 8, padding: 14,
                        border: "1px solid #1E1E22", marginBottom: 8
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, color: "#D4D4D8" }}>{q.q}</span>
                          <span style={{
                            fontSize: 8, padding: "2px 6px", borderRadius: 3, flexShrink: 0, marginLeft: 8,
                            background: q.type === "textarea" ? "#8B5CF620" : q.type === "select" ? "#10B98120" : q.type === "multi-select" ? "#F5C51820" : "#3B82F620",
                            color: q.type === "textarea" ? "#8B5CF6" : q.type === "select" ? "#10B981" : q.type === "multi-select" ? "#F5C518" : "#3B82F6",
                            fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em"
                          }}>{q.type}</span>
                        </div>
                        {q.options && <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 6 }}>
                          {q.options.map((o, j) => <span key={j} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "#18181B", color: "#52525B", border: "1px solid #27272A" }}>{o}</span>)}
                        </div>}
                        {q.example && <div style={{ fontSize: 10, color: "#3F3F46", marginTop: 4, fontStyle: "italic" }}>Ej: "{q.example}"</div>}
                        {q.condition && <div style={{ fontSize: 9, color: "#F5C518", marginTop: 4, fontFamily: "monospace" }}>⚡ Solo si: {q.condition}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: 16, background: "#111113", borderRadius: 8, border: "1px solid #1E1E22", marginBottom: 20 }}>
                    <div style={{ fontSize: 12, color: "#52525B" }}>
                      ✦ Este módulo no necesita preguntas adicionales — se genera automáticamente con los datos del onboarding y los módulos previos.
                    </div>
                  </div>
                )}

                {/* AI Output */}
                <div style={{ padding: 16, background: "#0D1117", borderRadius: 8, border: "1px solid #1E293B", marginBottom: 20 }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "#3B82F6", fontWeight: 600, marginBottom: 6 }}>
                    🤖 LA IA GENERA
                  </div>
                  <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>
                    {activeModule.aiGenerates}
                  </div>
                </div>

                {/* Dependencies */}
                {activeModule.feedsInto && activeModule.feedsInto.length > 0 && (
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "#3F3F46", fontWeight: 600, marginBottom: 8 }}>
                      ALIMENTA A →
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {activeModule.feedsInto.map((f, i) => (
                        <span key={i} style={{
                          fontSize: 10, padding: "4px 10px", borderRadius: 4,
                          background: "#18181B", color: "#71717A", border: "1px solid #27272A"
                        }}>{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* DATA MAP VIEW */}
      {activeView === "datamap" && (
        <div style={{ padding: "24px 32px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 300, color: "#fff", margin: "0 0 4px" }}>Flujo de Datos</h2>
          <p style={{ color: "#3F3F46", fontSize: 12, marginBottom: 24 }}>Cómo las respuestas del usuario fluyen a través del sistema</p>

          {/* Flow Diagram */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Onboarding Box */}
            <div style={{ background: "#111113", borderRadius: 10, padding: 20, border: "1px solid #F5C51830" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F5C518" }} />
                <span style={{ fontSize: 11, letterSpacing: "0.15em", color: "#F5C518", fontWeight: 600 }}>ONBOARDING GLOBAL</span>
                <span style={{ fontSize: 9, color: "#3F3F46" }}>→ Se pregunta 1 vez, alimenta TODO</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {flow.onboarding.steps.map((s, i) => (
                  <div key={i} style={{ background: "#18181B", borderRadius: 6, padding: 10, border: "1px solid #27272A" }}>
                    <div style={{ fontSize: 11, color: "#D4D4D8", fontWeight: 500, marginBottom: 4 }}>{s.name}</div>
                    <div style={{ fontSize: 9, color: "#3F3F46" }}>{s.questions.length} preguntas</div>
                    <div style={{ marginTop: 6 }}>
                      {s.questions.slice(0, 3).map((q, j) => (
                        <div key={j} style={{ fontSize: 9, color: "#52525B", padding: "1px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          · {q.key}
                        </div>
                      ))}
                      {s.questions.length > 3 && <div style={{ fontSize: 9, color: "#3F3F46" }}>+{s.questions.length - 3} más</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div style={{ textAlign: "center", padding: "4px 0", color: "#27272A", fontSize: 16 }}>▼</div>

            {/* Context Engine */}
            <div style={{ background: "#0D1117", borderRadius: 10, padding: 16, border: "1px solid #1E293B", textAlign: "center" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#3B82F6", fontWeight: 600 }}>
                🧠 CONTEXT ENGINE
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
                Combina onboarding + respuestas de fase + respuestas de módulo → genera prompt óptimo para cada módulo
              </div>
            </div>

            <div style={{ textAlign: "center", padding: "4px 0", color: "#27272A", fontSize: 16 }}>▼</div>

            {/* Phases */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
              {flow.phases.map((p, i) => (
                <div key={i} style={{
                  background: "#111113", borderRadius: 8, padding: 14,
                  border: `1px solid ${p.color}15`
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />
                    <span style={{ fontSize: 9, color: p.color, fontWeight: 600, letterSpacing: "0.1em" }}>{p.phase}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#D4D4D8", fontWeight: 500, marginBottom: 6 }}>{p.title}</div>
                  {p.unlockQuestions.length > 0 && (
                    <div style={{ fontSize: 9, color: "#52525B", marginBottom: 6, padding: "3px 6px", background: "#18181B", borderRadius: 3, display: "inline-block" }}>
                      {p.unlockQuestions.length} preguntas de fase
                    </div>
                  )}
                  <div>
                    {p.modules.map((m, j) => (
                      <div key={j} style={{
                        fontSize: 10, color: "#52525B", padding: "3px 0",
                        display: "flex", justifyContent: "space-between"
                      }}>
                        <span>{m.name}</span>
                        <span style={{ color: "#27272A" }}>{m.preQuestions.length > 0 ? `${m.preQuestions.length}q` : "auto"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", padding: "4px 0", color: "#27272A", fontSize: 16 }}>▼</div>

            {/* Output */}
            <div style={{ background: "#111113", borderRadius: 10, padding: 16, border: "1px solid #10B98130", textAlign: "center" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#10B981", fontWeight: 600 }}>
                📦 OUTPUT
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
                HTML interactivo · PDF exportable · Markdown para LLMs · Notion sync · Asset downloads
              </div>
            </div>
          </div>

          {/* Smart Logic */}
          <div style={{ marginTop: 28, padding: 20, background: "#111113", borderRadius: 8, border: "1px solid #1E1E22" }}>
            <h3 style={{ fontSize: 13, fontWeight: 500, color: "#F5C518", margin: "0 0 14px" }}>Lógica Inteligente del Flujo</h3>
            {[
              { rule: "Preguntas condicionales", desc: "Si el usuario dice 'No tengo local', se saltan automáticamente: Señalización, Arquitectónico, Audio en tienda, Áreas del local" },
              { rule: "Progressive disclosure", desc: "Solo preguntamos lo necesario para cada módulo. Si el módulo puede generarse con datos del onboarding, no preguntamos nada extra" },
              { rule: "Respuestas reutilizadas", desc: "brandName, personality, colors, fonts, voice → se inyectan automáticamente en CADA módulo sin re-preguntar" },
              { rule: "Módulos que se alimentan entre sí", desc: "Logo → alimenta a Papelería, Social Media, Packaging. Voice → alimenta a Emails, WhatsApp, Tickets. Personas → alimenta a Landing, CX" },
              { rule: "Generación incremental", desc: "Cada módulo se puede generar individualmente. No necesitas completar toda la fase para generar uno." },
              { rule: "Edición post-generación", desc: "Después de generar, el usuario puede ajustar colores, textos, layout antes de exportar" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < 5 ? "1px solid #18181B" : "none" }}>
                <div style={{ minWidth: 180, fontSize: 11, color: "#A1A1AA", fontWeight: 500 }}>{r.rule}</div>
                <div style={{ fontSize: 11, color: "#52525B", lineHeight: 1.5 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
