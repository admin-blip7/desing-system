type BrandData = Record<string, any>;

export const SYSTEM_PROMPT = `
Eres un experto consultor de branding de clase mundial. Tu objetivo es transformar los inputs básicos de un emprendedor en una estrategia de marca sofisticada, coherente y accionable.
Debes basarte estrictamente en la "Personalidad de Marca" seleccionada y usar los datos del cuestionario para dar contexto.
Responde siempre en español. Usa un tono que refleje la personalidad de la marca.
Estructura tus respuestas con Markdown claro, usando títulos, listas y negritas para facilitar la lectura.
`;

function normalizeModuleName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function formatValue(value: unknown, fallback = "No proporcionado"): string {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : fallback;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "object") {
    const json = JSON.stringify(value, null, 2);
    return json && json !== "{}" ? json : fallback;
  }

  const text = String(value).trim();
  return text.length ? text : fallback;
}

function buildPersonalityContext(brandData: BrandData) {
  const profile = brandData.personalityProfile as Record<string, unknown> | undefined;
  if (!profile) {
    return "Perfil detallado de personalidad: No disponible.";
  }

  return `
Perfil de personalidad seleccionado:
- Nombre: ${formatValue(profile.name)}
- Arquetipo: ${formatValue(profile.archetype)}
- Tagline: ${formatValue(profile.tagline)}
- Filosofía: ${formatValue(profile.philosophy)}
- Principios clave: ${formatValue(profile.keyPrinciples)}
- DNA de diseño (tipografía, color, layout, motion, foto, voz): ${formatValue(profile.dna)}
`;
}

function buildDependencyContext(brandData: BrandData) {
  const dependencyOutputs = brandData.dependencyOutputs as Record<string, unknown> | undefined;
  if (!dependencyOutputs || Object.keys(dependencyOutputs).length === 0) {
    return "No hay módulos previos completados para este paso.";
  }

  const lines = Object.entries(dependencyOutputs).map(([key, value]) => {
    const normalized =
      value && typeof value === "object" && "content" in (value as Record<string, unknown>)
        ? (value as Record<string, unknown>).content
        : value;
    return `- ${key}: ${formatValue(normalized)}`;
  });

  return `Módulos previos relevantes:\n${lines.join("\n")}`;
}

function buildCommonContext(brandData: BrandData) {
  return `
Marca: ${formatValue(brandData.name)}
Personalidad: ${formatValue(brandData.personalityId)}
Industria: ${formatValue(brandData.industry)}
Oferta principal: ${formatValue(brandData.offering)}
Público objetivo: ${formatValue(brandData.primaryAudience)}
Canales: ${formatValue(brandData.channels)}
Estilo visual preferido: ${formatValue(brandData.visualStyle)}
Referencias visuales: ${formatValue(brandData.visualInspo)}
Palabras clave de marca: ${formatValue(brandData.brandWords)}
${buildPersonalityContext(brandData)}
${buildDependencyContext(brandData)}
`;
}

export const getStoryPrompt = (brandData: BrandData) => `
# Módulo: Brand Story (Narrativa de Marca)
Marca: ${formatValue(brandData.name)}
Personalidad: ${formatValue(brandData.personalityId)}

## Contexto del Usuario:
- Origen: ${formatValue(brandData.originStory)}
- Momento clave: ${formatValue(brandData.pivotMoment)}
- Visión a 5 años: ${formatValue(brandData.vision5yr)}

## Tarea:
Crea una narrativa de marca completa (Storytelling). Estructura el relato en:
1. **La Llamada**: El origen y la necesidad que dio vida al negocio.
2. **El Desafío**: Los obstáculos superados.
3. **La Transformación**: El estado actual y lo que hace a la marca única.
4. **El Futuro**: La visión inspiradora hacia donde se dirige.
La historia debe conectar emocionalmente con el cliente ideal.
`;

export const getVoicePrompt = (brandData: BrandData) => `
# Módulo: Voz y Tono de Marca
Marca: ${formatValue(brandData.name)}
Personalidad: ${formatValue(brandData.personalityId)}

## Contexto del Usuario:
- Tono actual: ${formatValue(brandData.currentTone)}
- Uso de jerga: ${formatValue(brandData.techJargon)}
- Ejemplo real: "${formatValue(brandData.sampleMessage)}"

## Tarea:
Define la personalidad verbal de la marca:
1. **Atributos de Voz**: 3-4 adjetivos que describen cómo suena la marca al hablar.
2. **Matriz de Tono**: Cómo varía el tono según el canal (WhatsApp vs Instagram vs Documento Formal).
3. **Vocabulario**: Palabras que debemos usar y palabras a evitar.
4. **Ejemplos de Aplicación**: Reescribe el ejemplo del usuario usando la nueva voz de marca.
`;

export const getPersonasPrompt = (brandData: BrandData) => `
# Módulo: Customer Personas (Perfiles de Cliente)
Marca: ${formatValue(brandData.name)}
Sector: ${formatValue(brandData.industry || brandData.sector)}

## Contexto del Usuario:
- Mejor cliente: ${formatValue(brandData.bestCustomer)}
- Objeción común: ${formatValue(brandData.mainObjection)}
- Canales: ${formatValue(brandData.discoveryChannels)}

## Tarea:
Genera 2 perfiles detallados de "Buyer Persona":
1. **Nombre y Perfil**: Edad, ocupación, estilo de vida.
2. **Necesidades y Dolores**: Qué problema busca resolver y qué le preocupa.
3. **Motivaciones**: Por qué elegiría a ${formatValue(brandData.name)}.
4. **Customer Journey**: Cómo interactúa con la marca desde el descubrimiento hasta la compra.
`;

export const getNamingPrompt = (brandData: BrandData) => `
# Módulo: Propuesta de Naming
Marca Actual: ${formatValue(brandData.name)}
Sector: ${formatValue(brandData.industry || brandData.sector)}
Público: ${formatValue(brandData.primaryAudience || brandData.target)}

## Tarea:
Analiza el nombre actual y genera 5 alternativas creativas si el usuario busca un cambio, o valida el actual si es potente.
Para cada uno, explica la semiótica y por qué funciona con la personalidad ${formatValue(brandData.personalityId)}.
`;

export const getValuesPrompt = (brandData: BrandData) => `
# Módulo: Filosofía y Valores
Marca: ${formatValue(brandData.name)}
Personalidad: ${formatValue(brandData.personalityId)}

## Contexto del Usuario:
- Problema que resuelve: ${formatValue(brandData.problemSolved)}
- Diferenciador: ${formatValue(brandData.differentiator)}
- Valores base: ${formatValue(brandData.coreValues)}

## Tarea:
Extrae la esencia de la marca:
1. **Propósito**: El "por qué" más allá del dinero.
2. **Promesa de Marca**: El compromiso innegociable con el cliente.
3. **Valores Fundamentales**: 4 pilares definidos con un párrafo explicativo.
4. **Propuesta de Valor**: Una frase única que resuma por qué elegir esta marca.
`;

export const getVisualPrompt = (moduleName: string, brandData: BrandData) => `
# Módulo Visual: ${moduleName}
Marca: ${formatValue(brandData.name)}
Personalidad: ${formatValue(brandData.personalityId)}

## Tarea:
Define las directrices visuales para este módulo (${moduleName}).
Proporciona recomendaciones técnicas sobre estilo, estética y cómo refuerza la personalidad ${formatValue(brandData.personalityId)}.
`;

export const getPhase2Prompt = (moduleName: string, brandData: BrandData) => {
  const commonContext = buildCommonContext(brandData);
  const key = normalizeModuleName(moduleName);

  if (key.includes("fotografia")) {
    return `
# Módulo Fase 2: Dirección de Fotografía
${commonContext}
Fuente de fotos: ${formatValue(brandData.photoSource)}
Tipos de foto: ${formatValue(brandData.photoTypes)}
Quién toma fotos: ${formatValue(brandData.photoCreator)}

## Tarea
Genera una guía ejecutable de fotografía de marca con:
1. Principios de dirección (composición, encuadre, distancia focal, perspectiva).
2. Iluminación por caso de uso (producto, lifestyle, equipo, local).
3. Paleta fotográfica y tratamiento de color.
4. Reglas Do/Don't.
5. Shot list de 12 fotos prioritarias para próximas 2 semanas.
Entrega en Markdown estructurado.
`;
  }

  if (key.includes("ilustracion")) {
    return `
# Módulo Fase 2: Estilo de Ilustración
${commonContext}
Uso de ilustraciones: ${formatValue(brandData.usesIllustrations)}
Estilo preferido: ${formatValue(brandData.illustrationStyle)}

## Tarea
Construye un sistema de ilustración de marca:
1. Lenguaje de forma (línea, volumen, esquinas, proporciones).
2. Reglas de color y contraste.
3. Biblioteca inicial de 10 escenas/íconos ilustrados.
4. Reglas de consistencia para escalar estilo.
5. Guía de aplicación (web, redes, presentaciones).
Entrega en Markdown con checklist aplicable por diseñadores.
`;
  }

  if (key.includes("iconografia")) {
    return `
# Módulo Fase 2: Iconografía
${commonContext}
Necesidades de íconos: ${formatValue(brandData.iconNeeds)}
Estilo de ícono: ${formatValue(brandData.iconStyle)}

## Tarea
Define el sistema de iconografía:
1. Grid base, stroke, esquina, tamaño mínimo.
2. Reglas outline/filled/duotone según contexto.
3. Lista priorizada de 24 íconos núcleo.
4. Convenciones de naming y export (SVG).
5. Do/Don't para mantener coherencia.
Entrega formato JSON válido con claves:
{
  "styleRules": {},
  "grid": {},
  "stroke": {},
  "iconSet": [],
  "usageGuidelines": {}
}
`;
  }

  if (key.includes("motion") || key.includes("animacion")) {
    return `
# Módulo Fase 2: Motion & Animación
${commonContext}
Uso de motion: ${formatValue(brandData.motionUse)}
Sensación deseada: ${formatValue(brandData.motionFeeling)}

## Tarea
Diseña un sistema de motion:
1. Curvas de easing por intención.
2. Duraciones estándar (micro, UI, transición de página).
3. Patrones de entrada/salida.
4. Reglas de accesibilidad motion (reduce motion).
5. Ejemplos por canal (web, app, social).
Entrega en JSON válido con:
{
  "timings": {},
  "easing": {},
  "patterns": [],
  "accessibility": {},
  "channelExamples": []
}
`;
  }

  if (key.includes("audio")) {
    return `
# Módulo Fase 2: Audio Branding
${commonContext}
Audio en tienda: ${formatValue(brandData.hasStoreAudio)}
Estilo musical: ${formatValue(brandData.musicStyle)}

## Tarea
Crea guía sonora de marca:
1. Personalidad sonora (adjetivos y límites).
2. Sonic logo conceptual (duración, textura, ritmo).
3. Catálogo de usos (notificación, intro, ambiente).
4. Playlist direction por momento del día.
5. Reglas de volumen/energía según contexto.
Entrega en JSON válido con:
{
  "sonicIdentity": {},
  "sonicLogo": {},
  "useCases": [],
  "playlistDirection": {},
  "audioDoDont": []
}
`;
  }

  if (key.includes("data visualization")) {
    return `
# Módulo Fase 2: Data Visualization
${commonContext}
Uso de datos: ${formatValue(brandData.usesData)}

## Tarea
Define lineamientos de data viz:
1. Paleta para series, categorías y estados.
2. Tipografía para ejes, títulos y anotaciones.
3. Reglas de selección por tipo de gráfico.
4. Accesibilidad (contraste, color-blind safe).
5. Plantillas para dashboard y presentación.
Entrega en JSON válido con:
{
  "colorSystem": {},
  "typographyRules": {},
  "chartSelectionMatrix": [],
  "accessibilityRules": {},
  "templates": []
}
`;
  }

  return `
# Módulo Fase 2
${commonContext}

Genera guía táctica para ${moduleName} con recomendaciones accionables y ejemplos concretos.
Entrega en Markdown.
`;
};

export const getPhase3Prompt = (moduleName: string, brandData: BrandData) => {
  const commonContext = buildCommonContext(brandData);
  const key = normalizeModuleName(moduleName);

  if (key.includes("design tokens")) {
    return `
# Módulo Fase 3: Design Tokens
${commonContext}
Necesidades UI: ${formatValue(brandData.uiNeeds)}

## Tarea
Crea un sistema de design tokens listo para implementación.
Devuelve JSON válido con:
{
  "spacing": {},
  "sizing": {},
  "radii": {},
  "shadows": {},
  "zIndex": {},
  "opacity": {},
  "breakpoints": {},
  "semanticAliases": {},
  "cssVariables": {}
}
`;
  }

  if (key.includes("botones")) {
    return `
# Módulo Fase 3: Botones
${commonContext}
CTA principal: ${formatValue(brandData.primaryAction)}

## Tarea
Define un sistema de botones completo para producto digital.
Devuelve JSON válido con:
{
  "variants": [],
  "sizes": [],
  "states": [],
  "iconRules": {},
  "copyGuidelines": {},
  "accessibility": {}
}
`;
  }

  if (key.includes("formularios")) {
    return `
# Módulo Fase 3: Formularios
${commonContext}
Datos recolectados: ${formatValue(brandData.formData)}

## Tarea
Diseña patrones de formularios y validación.
Devuelve JSON válido con:
{
  "fieldPatterns": [],
  "validationRules": [],
  "errorStates": {},
  "successStates": {},
  "layoutPatterns": [],
  "accessibility": {}
}
`;
  }

  if (key.includes("grids")) {
    return `
# Módulo Fase 3: Grids & Layouts
${commonContext}

## Tarea
Define el sistema de layout responsive.
Devuelve JSON válido con:
{
  "gridSystem": {},
  "containerWidths": {},
  "spacingRules": {},
  "pageTemplates": [],
  "responsiveBehavior": {}
}
`;
  }

  if (key.includes("navegacion")) {
    return `
# Módulo Fase 3: Navegación
${commonContext}
Secciones principales: ${formatValue(brandData.navSections)}

## Tarea
Diseña el sistema de navegación para desktop y móvil.
Devuelve JSON válido con:
{
  "header": {},
  "mobileNav": {},
  "breadcrumbs": {},
  "footer": {},
  "searchPatterns": {},
  "iaRecommendations": []
}
`;
  }

  if (key.includes("cards") || key.includes("contenedores")) {
    return `
# Módulo Fase 3: Cards & Contenedores
${commonContext}

## Tarea
Define componentes de superficie y contención.
Devuelve JSON válido con:
{
  "cardTypes": [],
  "containerStyles": [],
  "modalPatterns": [],
  "drawerPatterns": [],
  "tooltipRules": {},
  "accordionRules": {}
}
`;
  }

  if (key.includes("tags") || key.includes("status")) {
    return `
# Módulo Fase 3: Tags & Status
${commonContext}
Estados de negocio: ${formatValue(brandData.statusTags)}

## Tarea
Crea sistema semántico de estados y etiquetas.
Devuelve JSON válido con:
{
  "statusCatalog": [],
  "colorMapping": {},
  "usageRules": {},
  "progressIndicators": [],
  "toneByContext": {}
}
`;
  }

  if (key.includes("empty") || key.includes("error states")) {
    return `
# Módulo Fase 3: Empty & Error States
${commonContext}

## Tarea
Diseña patrones de fallback para toda la experiencia.
Devuelve JSON válido con:
{
  "emptyStates": [],
  "errorStates": [],
  "loadingStates": [],
  "skeletonPatterns": [],
  "microcopyGuidelines": {}
}
`;
  }

  if (key.includes("tablas") || key.includes("listas")) {
    return `
# Módulo Fase 3: Tablas & Listas
${commonContext}

## Tarea
Define sistema de visualización de listados y data tables.
Devuelve JSON válido con:
{
  "tablePatterns": [],
  "listPatterns": [],
  "filteringRules": {},
  "sortingRules": {},
  "paginationRules": {},
  "responsiveRules": {}
}
`;
  }

  return `
# Módulo Fase 3
${commonContext}

Genera lineamientos de UI para ${moduleName} en JSON válido y accionable.
`;
};

export const getPhase4Prompt = (moduleName: string, brandData: BrandData) => {
  const commonContext = buildCommonContext(brandData);
  const key = normalizeModuleName(moduleName);

  if (key.includes("landing pages")) {
    return `
# Módulo Fase 4: Landing Pages
${commonContext}
Objetivo principal de landing: ${formatValue(brandData.landingGoal)}

## Tarea
Construye blueprint de landing con foco en conversión.
Devuelve JSON válido con:
{
  "hero": {},
  "sections": [],
  "ctaStrategy": {},
  "copyAngles": [],
  "conversionPatterns": [],
  "abTests": []
}
`;
  }

  if (key.includes("pagina de producto")) {
    return `
# Módulo Fase 4: Página de Producto
${commonContext}
Volumen de catálogo: ${formatValue(brandData.productCount)}
Variantes: ${formatValue(brandData.hasVariants)}

## Tarea
Define arquitectura de página de producto.
Devuelve JSON válido con:
{
  "informationArchitecture": {},
  "mediaBlock": {},
  "specsBlock": {},
  "pricingBlock": {},
  "trustSignals": [],
  "crossSellRules": []
}
`;
  }

  if (key.includes("carrito") || key.includes("checkout")) {
    return `
# Módulo Fase 4: Carrito & Checkout
${commonContext}
Métodos de pago actuales: ${formatValue(brandData.paymentMethods)}

## Tarea
Define flujo de compra minimizando fricción.
Devuelve JSON válido con:
{
  "cartFlow": [],
  "checkoutSteps": [],
  "paymentUX": {},
  "trustAndSecurity": {},
  "errorRecovery": {},
  "postPurchase": {}
}
`;
  }

  if (key.includes("social media kit")) {
    return `
# Módulo Fase 4: Social Media Kit
${commonContext}
Frecuencia de publicación: ${formatValue(brandData.postFrequency)}
Tipos de contenido: ${formatValue(brandData.contentTypes)}

## Tarea
Crea sistema de contenido reusable para redes.
Devuelve JSON válido con:
{
  "platformTemplates": {},
  "contentPillars": [],
  "weeklyCadence": {},
  "visualRules": {},
  "captionFrameworks": [],
  "kpiTracking": {}
}
`;
  }

  if (key.includes("perfiles de redes")) {
    return `
# Módulo Fase 4: Perfiles de Redes
${commonContext}

## Tarea
Optimiza presencia de perfiles por plataforma.
Devuelve JSON válido con:
{
  "profileImages": {},
  "coverRules": {},
  "bioTemplates": [],
  "linkInBioArchitecture": {},
  "highlightStructure": []
}
`;
  }

  if (key.includes("email") || key.includes("newsletters")) {
    return `
# Módulo Fase 4: Email & Newsletters
${commonContext}
Uso actual de email: ${formatValue(brandData.sendsEmail)}

## Tarea
Diseña sistema de comunicación por email.
Devuelve JSON válido con:
{
  "transactionalTemplates": [],
  "marketingTemplates": [],
  "subjectLineFramework": [],
  "toneByEmailType": {},
  "sendCadence": {},
  "deliverabilityChecklist": []
}
`;
  }

  if (key.includes("tickets de soporte")) {
    return `
# Módulo Fase 4: Tickets de Soporte
${commonContext}
Canales de soporte: ${formatValue(brandData.supportChannels)}

## Tarea
Estructura flujo de atención y resolución.
Devuelve JSON válido con:
{
  "intakeFlow": {},
  "responseTemplates": [],
  "slaLevels": {},
  "escalationRules": {},
  "toneGuidelines": {},
  "qaChecklist": []
}
`;
  }

  if (key.includes("seo") || key.includes("meta")) {
    return `
# Módulo Fase 4: SEO & Meta
${commonContext}
Importancia SEO: ${formatValue(brandData.seoImportance)}

## Tarea
Define estándar SEO y metadata para ecosistema digital.
Devuelve JSON válido con:
{
  "titlePatterns": [],
  "metaDescriptionPatterns": [],
  "openGraphRules": {},
  "structuredData": [],
  "faviconAndIcons": {},
  "contentSeoChecklist": []
}
`;
  }

  if (key.includes("presentaciones")) {
    return `
# Módulo Fase 4: Presentaciones
${commonContext}
Uso de presentaciones: ${formatValue(brandData.presentationUse)}

## Tarea
Define sistema narrativo y visual para decks.
Devuelve JSON válido con:
{
  "slideTypes": [],
  "storyArc": [],
  "chartRules": {},
  "visualDoDont": [],
  "templatesByUseCase": {}
}
`;
  }

  if (key.includes("video templates")) {
    return `
# Módulo Fase 4: Video Templates
${commonContext}
Tipos de video: ${formatValue(brandData.videoTypes)}

## Tarea
Diseña sistema audiovisual para piezas de video.
Devuelve JSON válido con:
{
  "introOutroRules": {},
  "titleSystems": [],
  "transitionSystem": {},
  "thumbnailGuidelines": {},
  "formatSpecs": {},
  "channelAdaptations": {}
}
`;
  }

  return `
# Módulo Fase 4
${commonContext}

Genera lineamientos digitales para ${moduleName} en JSON válido y operativo.
`;
};

export const getPhase5Prompt = (moduleName: string, brandData: BrandData) => {
  const commonContext = buildCommonContext(brandData);
  const key = normalizeModuleName(moduleName);

  if (key.includes("impresion")) {
    return `
# Módulo Fase 5: Guía de Impresión
${commonContext}
Frecuencia de impresión: ${formatValue(brandData.printFrequency)}

## Tarea
Define estándar técnico de impresión.
Devuelve JSON válido con:
{
  "colorSpecs": {},
  "resolutionAndBleed": {},
  "paperRecommendations": [],
  "finishRecommendations": [],
  "preflightChecklist": []
}
`;
  }

  if (key.includes("papeleria")) {
    return `
# Módulo Fase 5: Papelería
${commonContext}
Documentos impresos: ${formatValue(brandData.printedDocs)}

## Tarea
Diseña sistema de papelería corporativa.
Devuelve JSON válido con:
{
  "documentTemplates": [],
  "layoutRules": {},
  "logoUsage": {},
  "typographyRules": {},
  "printProductionNotes": []
}
`;
  }

  if (key.includes("etiquetado")) {
    return `
# Módulo Fase 5: Etiquetado
${commonContext}
Tipos de etiqueta: ${formatValue(brandData.labelTypes)}

## Tarea
Define arquitectura de etiquetas por contexto de uso.
Devuelve JSON válido con:
{
  "labelFamilies": [],
  "contentHierarchy": {},
  "sizeMatrix": {},
  "materialRecommendations": [],
  "legibilityRules": {}
}
`;
  }

  if (key.includes("qr codes")) {
    return `
# Módulo Fase 5: QR Codes
${commonContext}
Usos de QR: ${formatValue(brandData.qrUse)}

## Tarea
Diseña sistema de QR codes de marca.
Devuelve JSON válido con:
{
  "useCases": [],
  "visualStyles": [],
  "logoIntegrationRules": {},
  "sizeAndPlacement": {},
  "trackingAndAnalytics": {}
}
`;
  }

  if (key.includes("packaging")) {
    return `
# Módulo Fase 5: Packaging
${commonContext}
Método de entrega: ${formatValue(brandData.deliveryMethod)}

## Tarea
Define sistema de empaque con coherencia de marca.
Devuelve JSON válido con:
{
  "packagingTypes": [],
  "materialGuidelines": [],
  "printZones": {},
  "unboxingExperience": {},
  "sustainabilityRecommendations": []
}
`;
  }

  if (key.includes("uniformes")) {
    return `
# Módulo Fase 5: Uniformes
${commonContext}
Estado actual de uniformes: ${formatValue(brandData.hasUniforms)}

## Tarea
Diseña sistema de uniformes por rol.
Devuelve JSON válido con:
{
  "roleVariants": [],
  "garmentRules": {},
  "logoPlacement": {},
  "colorRules": {},
  "groomingGuidelines": []
}
`;
  }

  if (key.includes("merchandising")) {
    return `
# Módulo Fase 5: Merchandising
${commonContext}
Interés en merch: ${formatValue(brandData.hasMerch)}

## Tarea
Define catálogo base de merchandising.
Devuelve JSON válido con:
{
  "productCatalog": [],
  "designApplications": {},
  "productionMethods": [],
  "costTiers": {},
  "launchStrategy": {}
}
`;
  }

  if (key.includes("senalizacion")) {
    return `
# Módulo Fase 5: Señalización
${commonContext}
Áreas del local: ${formatValue(brandData.storeAreas)}

## Tarea
Diseña sistema de señalización física.
Devuelve JSON válido con:
{
  "signTypes": [],
  "wayfindingRules": {},
  "materialAndFinish": {},
  "placementHeuristics": {},
  "accessibilityRules": {}
}
`;
  }

  if (key.includes("arquitectonico")) {
    return `
# Módulo Fase 5: Arquitectónico
${commonContext}
Tamaño del espacio: ${formatValue(brandData.storeSize)}
Plan de remodelación: ${formatValue(brandData.plansRemodel)}

## Tarea
Define lineamientos de arquitectura y ambientación.
Devuelve JSON válido con:
{
  "facadeGuidelines": {},
  "interiorZoning": {},
  "materialPalette": [],
  "lightingStrategy": {},
  "furnitureRules": {}
}
`;
  }

  if (key.includes("vehiculos")) {
    return `
# Módulo Fase 5: Vehículos
${commonContext}
Tipos de vehículos: ${formatValue(brandData.vehicleTypes)}

## Tarea
Define sistema de rotulación vehicular.
Devuelve JSON válido con:
{
  "vehicleTypes": [],
  "logoPlacementRules": {},
  "contactInfoRules": {},
  "visibilityAndSafety": {},
  "productionSpecs": {}
}
`;
  }

  return `
# Módulo Fase 5
${commonContext}

Genera lineamientos de marca física para ${moduleName} en JSON válido.
`;
};

export const getPhase6Prompt = (moduleName: string, brandData: BrandData) => {
  const commonContext = buildCommonContext(brandData);
  const key = normalizeModuleName(moduleName);

  if (key.includes("manual de comportamiento")) {
    return `
# Módulo Fase 6: Manual de Comportamiento
${commonContext}
Queja principal: ${formatValue(brandData.topComplaint)}
Razón de recompra: ${formatValue(brandData.returnReason)}
Journey ideal: ${formatValue(brandData.idealJourney)}

## Tarea
Escribe protocolo de comportamiento para equipos de atención.
Entrega en Markdown con:
- Principios de trato.
- Scripts por momento (saludo, diagnóstico, cierre, seguimiento).
- Tabla Do/Don't.
- Indicadores de calidad de interacción.
`;
  }

  if (key.includes("manejo de problemas")) {
    return `
# Módulo Fase 6: Manejo de Problemas
${commonContext}
Problemas comunes: ${formatValue(brandData.commonProblems)}
Política de devoluciones: ${formatValue(brandData.hasReturnPolicy)}

## Tarea
Diseña protocolo de resolución y escalamiento.
Entrega en Markdown con:
- Árbol de decisión por tipo de incidente.
- Scripts de disculpa y compensación.
- Niveles de escalamiento.
- Métricas para medir recuperación de confianza.
`;
  }

  if (key.includes("sistema cx")) {
    return `
# Módulo Fase 6: Sistema CX
${commonContext}
Post-venta: ${formatValue(brandData.hasPostSale)}
Programa de lealtad: ${formatValue(brandData.hasLoyalty)}

## Tarea
Define sistema de experiencia de cliente end-to-end.
Entrega en Markdown con:
- Blueprint de ciclo de vida.
- Triggers de seguimiento.
- Estrategia de lealtad y referidos.
- Framework de NPS/CSAT.
`;
  }

  if (key.includes("onboarding empleados")) {
    return `
# Módulo Fase 6: Onboarding Empleados
${commonContext}
Proceso actual: ${formatValue(brandData.currentOnboarding)}

## Tarea
Crea programa de onboarding para nuevos colaboradores.
Entrega en Markdown con:
- Checklist de primer día, primera semana y primer mes.
- Materiales obligatorios.
- Plan de evaluación.
- Ritual de alineación cultural con la marca.
`;
  }

  if (key.includes("co-branding")) {
    return `
# Módulo Fase 6: Co-branding
${commonContext}
Tiene partners: ${formatValue(brandData.hasPartners)}
Tipo de alianzas: ${formatValue(brandData.partnerTypes)}

## Tarea
Define reglas de co-branding para colaboraciones.
Entrega en Markdown con:
- Jerarquía entre marcas.
- Lock-ups permitidos.
- Fondos y contraste.
- Casos prohibidos.
- Flujo de aprobación.
`;
  }

  if (key.includes("benchmark")) {
    return `
# Módulo Fase 6: Benchmark
${commonContext}
Competidores: ${formatValue(brandData.competitors)}
Marcas admiradas: ${formatValue(brandData.admiredBrands)}

## Tarea
Realiza benchmark accionable.
Entrega en Markdown con:
- Matriz comparativa.
- Oportunidades de diferenciación.
- Riesgos de convergencia visual/verbal.
- Recomendaciones prioritizadas a 90 días.
`;
  }

  return `
# Módulo Fase 6
${commonContext}

Genera recomendaciones de experiencia de marca para ${moduleName} en Markdown.
`;
};

export const getPhase7Prompt = (moduleName: string, brandData: BrandData) => {
  const commonContext = buildCommonContext(brandData);
  const key = normalizeModuleName(moduleName);

  if (key.includes("conector notion")) {
    return `
# Módulo Fase 7: Conector Notion
${commonContext}
Uso de Notion: ${formatValue(brandData.usesNotion)}

## Tarea
Define integración del manual con Notion.
Devuelve JSON válido con:
{
  "databaseSchema": {},
  "pageStructure": [],
  "syncRules": {},
  "permissionsModel": {},
  "rolloutChecklist": []
}
`;
  }

  if (key.includes("export .md")) {
    return `
# Módulo Fase 7: Export .md para LLMs
${commonContext}

## Tarea
Define formato exportable para modelos de IA.
Devuelve JSON válido con:
{
  "documentStructure": [],
  "contextBlocks": [],
  "promptTemplates": [],
  "maintenanceRules": {},
  "qaChecklist": []
}
`;
  }

  if (key.includes("asset library")) {
    return `
# Módulo Fase 7: Asset Library
${commonContext}

## Tarea
Diseña centro de activos centralizado.
Devuelve JSON válido con:
{
  "taxonomy": {},
  "folderStructure": [],
  "namingConventions": {},
  "formatMatrix": {},
  "accessPolicy": {}
}
`;
  }

  if (key.includes("release notes")) {
    return `
# Módulo Fase 7: Release Notes
${commonContext}

## Tarea
Define sistema de versionado y comunicación de cambios.
Devuelve JSON válido con:
{
  "versioningScheme": {},
  "changeCategories": [],
  "noteTemplate": {},
  "notificationFlow": {},
  "auditTrailRules": {}
}
`;
  }

  if (key.includes("brand audit")) {
    return `
# Módulo Fase 7: Brand Audit
${commonContext}

## Tarea
Construye checklist de cumplimiento de marca.
Devuelve JSON válido con:
{
  "auditCategories": [],
  "passFailCriteria": {},
  "scoringModel": {},
  "frequencyRecommendations": {},
  "remediationPlaybooks": []
}
`;
  }

  if (key.includes("roadmap generator")) {
    return `
# Módulo Fase 7: Roadmap Generator
${commonContext}

## Tarea
Define roadmap operativo para implementación de marca.
Devuelve JSON válido con:
{
  "phases": [],
  "milestones": [],
  "dependencies": [],
  "ownersAndRoles": {},
  "riskMatrix": {}
}
`;
  }

  return `
# Módulo Fase 7
${commonContext}

Genera plan de distribución y escalado para ${moduleName} en JSON válido.
`;
};
