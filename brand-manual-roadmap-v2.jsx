import { useState } from "react";

const phases = [
  {
    id: 1,
    phase: "FASE 1",
    title: "Fundamentos de Identidad",
    subtitle: "El ADN de la marca — quién eres y por qué existes",
    color: "#F5C518",
    weeks: "Semanas 1–4",
    modules: [
      { name: "Brand Story & Historia", desc: "Historia de la marca, fundador, origen, hitos clave, qué inspiró el negocio. Contexto narrativo que explica el 'por qué' detrás de cada decisión de diseño", output: "brand-story.html", isNew: true },
      { name: "Filosofía de Marca", desc: "Misión, visión, valores, propósito, posicionamiento. Personalidad de marca como personaje (brand persona). Experiencias que queremos generar", output: "brand-philosophy.html", isNew: false },
      { name: "Voz & Tono de Marca", desc: "Guía de copywriting: cómo habla la marca, vocabulario permitido/prohibido, matriz de tono por canal (formal en facturas, cálido en WhatsApp, técnico en web), ejemplos de frases", output: "voice-tone.html", isNew: true },
      { name: "Customer Personas", desc: "Perfiles de cliente ideal, segmentos, comportamientos, motivaciones de compra, pain points. Esto guía todas las decisiones de diseño y comunicación", output: "personas.html", isNew: true },
      { name: "Logo & Isotipo", desc: "Logo principal, variantes (horizontal, vertical, ícono), isotipo, versiones monocromáticas, área de protección, tamaños mínimos, usos incorrectos (Do's & Don'ts)", output: "logo-guidelines.html", isNew: false },
      { name: "Paleta de Color", desc: "Primarios, secundarios, acentos, escalas de grises. Valores HEX, RGB, HSL, CMYK y Pantone. Tokens CSS. Ratios de contraste WCAG. Modos claro/oscuro", output: "color-system.html", isNew: false },
      { name: "Tipografía", desc: "Familias tipográficas (display, body, mono), escala fluid, jerarquías, pesos, interlineado, tracking. Fuente para web, print, y código", output: "typography.html", isNew: false },
      { name: "Entidades Geométricas", desc: "Formas y geometrías de marca, patrones, texturas, elementos decorativos, motivos visuales de soporte", output: "brand-geometry.html", isNew: false },
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
      { name: "Dirección de Fotografía", desc: "Estilo fotográfico de marca: iluminación, composición, paleta de color en fotos, tratamiento de imagen, filtros permitidos. Guía de fotos de producto, lifestyle, y equipo. Do's & Don'ts", output: "photography.html", isNew: true },
      { name: "Estilo de Ilustración", desc: "Si la marca usa ilustraciones: estilo (flat, line art, 3D), grosor de línea, paleta, nivel de detalle, personajes, escenas permitidas", output: "illustration.html", isNew: true },
      { name: "Iconografía", desc: "Set de íconos de marca, estilo (outline, solid, duotone), grid de construcción, tamaños, espaciado, guía de creación de nuevos íconos", output: "icons-system.html", isNew: false },
      { name: "Motion & Animación", desc: "Cómo se mueve la marca: curvas de easing, duraciones, transiciones de página, micro-interacciones, loading animations, reveals. Principios de movimiento", output: "motion-guidelines.html", isNew: true },
      { name: "Audio Branding", desc: "Identidad sonora: jingle/sonic logo, tono de notificaciones, música de fondo para contenido, estilo de voiceover, paisaje sonoro de tienda física", output: "audio-branding.html", isNew: true },
      { name: "Data Visualization", desc: "Estilo de gráficas, charts, tablas de datos: colores, tipografía, ejes, leyendas. Para reportes, dashboards, presentaciones", output: "data-viz.html", isNew: true },
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
      { name: "Design Tokens", desc: "Spacing (8pt grid), sizing, border-radius, shadows, z-index, breakpoints, opacity. Variables CSS completas para todo el sistema", output: "design-tokens.html", isNew: true },
      { name: "Botones & Acciones", desc: "Primario, secundario, ghost, danger, link. Estados: hover, active, disabled, loading. Tamaños: sm, md, lg. Con íconos", output: "buttons.html", isNew: false },
      { name: "Formularios & Inputs", desc: "Text inputs, selects, checkboxes, radios, toggles, date pickers, sliders. Validaciones, estados de error, labels, placeholders, helper text", output: "form-elements.html", isNew: false },
      { name: "Grids & Layouts", desc: "Sistema de grid (12 columnas), gutters, breakpoints responsive, layouts de página, contenedores, aspect ratios", output: "grid-layouts.html", isNew: false },
      { name: "Navegación", desc: "Header, sidebar, mobile nav, footer, breadcrumbs, tabs, paginación, search bar", output: "navigation.html", isNew: false },
      { name: "Cards & Contenedores", desc: "Estilos de cards (producto, info, stat, testimonial), modales, drawers, popovers, tooltips, accordions", output: "cards-containers.html", isNew: true },
      { name: "Tags, Badges & Status", desc: "Etiquetas de estado, badges de notificación, budget tags, chips, pills, indicadores de progreso", output: "tags-badges.html", isNew: false },
      { name: "Empty States & Errores", desc: "Páginas 404, estados vacíos, error states, skeleton loaders, loading spinners branded, estados offline", output: "empty-error-states.html", isNew: true },
      { name: "Tablas & Listas", desc: "Data tables, listas ordenables, filtros, bulk actions, row states. Para dashboards y admin panels", output: "tables-lists.html", isNew: true },
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
      { name: "Landing Pages", desc: "Templates de landing para productos/servicios, hero sections, CTAs, testimonios, pricing, FAQ. Diseño de conversión", output: "landing-templates.html", isNew: false },
      { name: "Página de Producto", desc: "Ficha de producto/servicio: galería, especificaciones, precios, CTA, reviews, productos relacionados", output: "product-page.html", isNew: false },
      { name: "Carrito & Checkout", desc: "Flujo de compra: carrito, resumen, formulario de pago, confirmación. Si aplica para e-commerce", output: "cart-checkout.html", isNew: true },
      { name: "Social Media Kit", desc: "Templates para: Instagram (posts, stories, reels, highlights), Facebook (posts, covers), WhatsApp (catálogos, estados). Dimensiones, grids de feed", output: "social-media-kit.html", isNew: false },
      { name: "Perfiles de Redes Sociales", desc: "Avatars, cover photos, bios, links. Cómo se ve la marca en cada plataforma. Guía de publicación", output: "social-profiles.html", isNew: true },
      { name: "Email & Newsletters", desc: "Templates de email transaccional (confirmación, envío, factura), newsletters, notificaciones, firma de correo electrónico", output: "email-templates.html", isNew: false },
      { name: "Tickets de Soporte", desc: "Templates para tickets de Instagram, WhatsApp Business, Facebook Messenger. Respuestas rápidas, flujos de atención", output: "support-tickets.html", isNew: true },
      { name: "SEO & Meta Content", desc: "Estilo de títulos SEO, meta descriptions, OG images (preview al compartir links), favicon, structured data", output: "seo-meta.html", isNew: true },
      { name: "Presentaciones", desc: "Templates de PowerPoint/Keynote/Google Slides con branding: portada, contenido, gráficas, cierre", output: "presentations.html", isNew: true },
      { name: "Video Templates", desc: "Intros, outros, lower thirds, títulos, transiciones. Estilo para reels, YouTube, TikTok. Guía de edición", output: "video-templates.html", isNew: true },
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
      { name: "Guía de Impresión", desc: "Especificaciones de print: CMYK, Pantone, resolución mínima, bleeds, tipos de papel, acabados. Para que imprenta no arruine la marca", output: "print-guidelines.html", isNew: true },
      { name: "Papelería Corporativa", desc: "Facturas, notas de venta, recibos, cotizaciones, tarjetas de presentación, hojas membretadas, sobres", output: "stationery.html", isNew: false },
      { name: "Etiquetado de Productos", desc: "Etiquetas de precio, stickers, códigos QR con branding, tags de producto, empaques individuales", output: "product-labels.html", isNew: false },
      { name: "QR Codes Branded", desc: "Estilo de QR codes de marca: colores, logo integrado, frames, call to action. Para pagos, links, WhatsApp", output: "qr-codes.html", isNew: true },
      { name: "Packaging & Bolsas", desc: "Diseño de bolsas de entrega, cajas, empaques, tissue paper, stickers de sellado, unboxing experience", output: "packaging.html", isNew: false },
      { name: "Uniformes & Vestimenta", desc: "Guía de uniforme: colores, posición de logo, variantes por rol, accesorios permitidos, dress code", output: "uniforms.html", isNew: false },
      { name: "Libretas & Merchandising", desc: "Libretas corporativas, plumas, llaveros, tazas, mousepads, USB, merchandise promocional", output: "merchandise.html", isNew: false },
      { name: "Señalización & Wayfinding", desc: "Letreros exteriores, señalización interior, directorios, etiquetas de anaqueles, números de pasillo, señales de seguridad", output: "signage.html", isNew: true },
      { name: "Diseño Arquitectónico", desc: "Lineamientos de fachada, interior, exhibidores, iluminación, materiales, colores de pared, disposición de mobiliario", output: "architecture.html", isNew: false },
      { name: "Vehículos & Flotilla", desc: "Si aplica: rotulado de vehículos de entrega/servicio, motocicletas, bicicletas. Posición de logo, colores", output: "vehicle-branding.html", isNew: true },
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
      { name: "Manual de Comportamiento", desc: "Protocolo de atención: saludo, presentación de producto, cierre de venta, despedida. Lenguaje de marca en persona. Qué decir y qué NO decir", output: "behavior-manual.html", isNew: false },
      { name: "Manejo de Problemas", desc: "Protocolos de resolución: escalamiento, compensación, devoluciones, garantías. Cómo actuar en crisis, comunicación difícil", output: "problem-handling.html", isNew: false },
      { name: "Sistema de Seguimiento CX", desc: "Tracking de experiencia: post-venta, motivación a recompra, programas de lealtad, puntos, referidos, NPS, encuestas", output: "cx-tracking.html", isNew: false },
      { name: "Onboarding de Empleados", desc: "Kit de bienvenida, training de marca para nuevos empleados: cómo representar la marca, materiales de capacitación", output: "employee-onboarding.html", isNew: true },
      { name: "Co-branding & Partners", desc: "Reglas para uso de marca por terceros: partners, proveedores, alianzas. Cómo aparece el logo junto a otros. Lock-ups permitidos", output: "co-branding.html", isNew: true },
      { name: "Benchmark & Referentes", desc: "Estudio de referentes (Apple, Microsoft, Google), análisis de mejores prácticas, qué tomar y qué no, diferenciadores", output: "benchmark.html", isNew: false },
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
      { name: "Conector Notion", desc: "Sincronización del manual completo con Notion: páginas, bases de datos de assets, galería de componentes", output: "notion-connector", isNew: false },
      { name: "Export .md para LLMs", desc: "Archivos markdown optimizados para alimentar IA con contexto de marca completo. Prompts pre-hechos para generar contenido on-brand", output: "llm-export.md", isNew: false },
      { name: "Asset Library & Downloads", desc: "Centro de descargas: logos en todos los formatos (SVG, PNG, PDF), paleta, fuentes, templates. Organizado por categoría", output: "asset-library", isNew: true },
      { name: "Release Notes & Versionado", desc: "Sistema de versiones del manual, changelog, notificaciones de cambios, historial de evolución de marca", output: "release-system", isNew: false },
      { name: "Brand Audit Checklist", desc: "Checklist automático para auditar si un material cumple con el manual: colores correctos, fuentes, logo, tono, etc.", output: "brand-audit", isNew: true },
      { name: "Roadmap Generator", desc: "Generación automática de roadmaps visuales para planificación de marca y producto", output: "roadmap-generator", isNew: false },
    ]
  }
];

function PhaseTimeline({ phases, activePhase, setActivePhase }) {
  return (
    <div style={{ display: "flex", gap: 2, padding: "0 40px", background: "#050505", borderBottom: "1px solid #141414" }}>
      {phases.map(p => {
        const isActive = activePhase === p.id;
        return (
          <button key={p.id} onClick={() => setActivePhase(p.id)} style={{
            flex: 1, padding: "14px 8px 12px", border: "none", cursor: "pointer",
            background: isActive ? "#0D0D0D" : "transparent",
            borderBottom: `2px solid ${isActive ? p.color : "transparent"}`,
            transition: "all 0.2s"
          }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", color: isActive ? p.color : "#333", fontWeight: 700, marginBottom: 2 }}>
              {p.phase}
            </div>
            <div style={{ fontSize: 11, color: isActive ? "#aaa" : "#444", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {p.title}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function BrandManualRoadmapV2() {
  const [activePhase, setActivePhase] = useState(1);
  const [view, setView] = useState("roadmap");
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const currentPhase = phases.find(p => p.id === activePhase);
  const totalModules = phases.reduce((acc, p) => acc + p.modules.length, 0);
  const newModules = phases.reduce((acc, p) => acc + p.modules.filter(m => m.isNew).length, 0);
  const originalModules = totalModules - newModules;

  const filteredModules = currentPhase
    ? (showOnlyNew ? currentPhase.modules.filter(m => m.isNew) : currentPhase.modules)
    : [];

  return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0A", color: "#E5E5E5",
      fontFamily: "'Inter', -apple-system, system-ui, sans-serif"
    }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #141414", padding: "28px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#444", textTransform: "uppercase", marginBottom: 6 }}>
              Brand Manual Generator App
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 200, letterSpacing: "-0.03em", color: "#fff", margin: 0, lineHeight: 1.1 }}>
              Roadmap v2.0
              <span style={{ fontSize: 13, color: "#F5C518", fontWeight: 500, marginLeft: 12, verticalAlign: "middle" }}>
                +{newModules} nuevos módulos
              </span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { key: "roadmap", label: "Roadmap" },
              { key: "audit", label: "Auditoría" },
              { key: "all", label: "Todos" }
            ].map(v => (
              <button key={v.key} onClick={() => setView(v.key)} style={{
                padding: "7px 14px", borderRadius: 5, border: "1px solid",
                borderColor: view === v.key ? "#F5C518" : "#1A1A1A",
                background: view === v.key ? "#F5C51810" : "transparent",
                color: view === v.key ? "#F5C518" : "#555",
                fontSize: 11, cursor: "pointer", textTransform: "uppercase",
                letterSpacing: "0.1em", fontWeight: 500
              }}>
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 28, marginTop: 20 }}>
          {[
            { label: "Fases", value: phases.length, color: "#fff" },
            { label: "Módulos Total", value: totalModules, color: "#fff" },
            { label: "Originales", value: originalModules, color: "#888" },
            { label: "Nuevos", value: newModules, color: "#F5C518" },
            { label: "Semanas", value: "28", color: "#fff" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 22, fontWeight: 300, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: "0.15em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Timeline */}
      <PhaseTimeline phases={phases} activePhase={activePhase} setActivePhase={setActivePhase} />

      {view === "roadmap" && currentPhase && (
        <div style={{ padding: "28px 40px" }}>
          {/* Phase Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: currentPhase.color }} />
                <span style={{ fontSize: 10, letterSpacing: "0.2em", color: currentPhase.color, fontWeight: 600 }}>
                  {currentPhase.phase} — {currentPhase.weeks}
                </span>
                <span style={{
                  fontSize: 9, padding: "2px 8px", borderRadius: 3,
                  background: currentPhase.color + "15", color: currentPhase.color
                }}>
                  {currentPhase.modules.length} módulos · {currentPhase.modules.filter(m => m.isNew).length} nuevos
                </span>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 300, color: "#fff", margin: 0 }}>{currentPhase.title}</h2>
              <p style={{ color: "#444", fontSize: 12, marginTop: 4 }}>{currentPhase.subtitle}</p>
            </div>
            <button
              onClick={() => setShowOnlyNew(!showOnlyNew)}
              style={{
                padding: "6px 12px", borderRadius: 5, border: "1px solid",
                borderColor: showOnlyNew ? "#F5C518" : "#1A1A1A",
                background: showOnlyNew ? "#F5C51815" : "transparent",
                color: showOnlyNew ? "#F5C518" : "#555",
                fontSize: 10, cursor: "pointer", letterSpacing: "0.08em"
              }}
            >
              {showOnlyNew ? "✦ Solo nuevos" : "Mostrar todos"}
            </button>
          </div>

          {/* Module Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
            {filteredModules.map((m, i) => (
              <div key={i} style={{
                background: "#0F0F0F", borderRadius: 8, padding: 20,
                border: `1px solid ${m.isNew ? currentPhase.color + "30" : "#151515"}`,
                transition: "all 0.2s", position: "relative"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = currentPhase.color + "50"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = m.isNew ? currentPhase.color + "30" : "#151515"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {m.isNew && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    fontSize: 8, padding: "2px 6px", borderRadius: 3,
                    background: "#F5C51820", color: "#F5C518",
                    fontWeight: 700, letterSpacing: "0.15em"
                  }}>
                    NUEVO
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 5,
                    background: currentPhase.color + "12",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: currentPhase.color
                  }}>
                    {String(currentPhase.modules.indexOf(m) + 1).padStart(2, "0")}
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 500, color: "#fff", margin: 0 }}>
                    {m.name}
                  </h3>
                </div>
                <p style={{ fontSize: 12, color: "#555", lineHeight: 1.65, margin: "0 0 10px" }}>
                  {m.desc}
                </p>
                <div style={{
                  fontSize: 9, color: "#333", fontFamily: "monospace",
                  padding: "3px 6px", background: "#080808", borderRadius: 3, display: "inline-block"
                }}>
                  → {m.output}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "audit" && (
        <div style={{ padding: "28px 40px", maxWidth: 900 }}>
          <h2 style={{ fontSize: 22, fontWeight: 300, color: "#fff", margin: "0 0 6px" }}>
            Auditoría: ¿Qué se agregó y por qué?
          </h2>
          <p style={{ color: "#444", fontSize: 12, marginBottom: 28 }}>
            {newModules} módulos nuevos identificados comparando contra manuales de Apple, Google, NASA, Mailchimp, Netflix, IBM y Airbus
          </p>

          {phases.map(p => {
            const newOnes = p.modules.filter(m => m.isNew);
            if (newOnes.length === 0) return null;
            return (
              <div key={p.id} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />
                  <span style={{ fontSize: 10, letterSpacing: "0.15em", color: p.color, fontWeight: 600 }}>{p.phase}</span>
                  <span style={{ fontSize: 13, color: "#ccc" }}>{p.title}</span>
                  <span style={{
                    fontSize: 9, padding: "2px 6px", borderRadius: 3,
                    background: "#F5C51815", color: "#F5C518", marginLeft: 8
                  }}>+{newOnes.length}</span>
                </div>
                {newOnes.map((m, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 16, padding: "12px 16px",
                    background: i % 2 === 0 ? "#0D0D0D" : "transparent",
                    borderRadius: 6, marginBottom: 2
                  }}>
                    <div style={{ minWidth: 180 }}>
                      <div style={{ fontSize: 13, color: "#ddd", fontWeight: 500 }}>{m.name}</div>
                    </div>
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                      {m.desc}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Why section */}
          <div style={{
            marginTop: 32, padding: 20, background: "#0D0D0D",
            borderRadius: 8, border: "1px solid #1A1A1A"
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: "#F5C518", margin: "0 0 12px" }}>
              ¿Por qué estos módulos son críticos?
            </h3>
            {[
              { area: "Fotografía & Ilustración", why: "Sin dirección visual, cada diseñador interpreta diferente. Apple y Airbus lo documentan exhaustivamente." },
              { area: "Motion & Audio", why: "Spotify, Google y Netflix definen cómo se mueve y suena la marca. Es lo que separa una marca amateur de una profesional." },
              { area: "Voice & Tone", why: "Mailchimp es famoso por su matriz de tono por canal. Sin esto, la marca habla diferente en cada punto de contacto." },
              { area: "Customer Personas", why: "Todo diseño responde a alguien. Sin personas definidas, diseñas para nadie." },
              { area: "Design Tokens", why: "Spacing, shadows, radii — son la infraestructura invisible que hace consistente al sistema." },
              { area: "Print Guidelines", why: "Sin CMYK/Pantone la marca se ve diferente en cada imprenta. Error muy común en PyMEs." },
              { area: "Co-branding", why: "Netflix y Instacart definen cómo aparecen junto a otros. Crítico cuando creces." },
              { area: "Brand Audit", why: "El manual no sirve si nadie verifica que se cumpla. El checklist automático lo resuelve." },
              { area: "Employee Onboarding", why: "IBM y Airbus capacitan a cada empleado nuevo en marca. Sin esto, solo marketing la entiende." },
              { area: "Asset Library", why: "Bang & Olufsen y Cash App tienen centros de descarga. Si los assets no son fáciles de encontrar, nadie los usa." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < 9 ? "1px solid #141414" : "none" }}>
                <div style={{ minWidth: 180, fontSize: 12, color: "#aaa", fontWeight: 500 }}>{item.area}</div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{item.why}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "all" && (
        <div style={{ padding: "28px 40px" }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 300, color: "#fff", margin: "0 0 4px" }}>
              Mapa completo — {totalModules} módulos
            </h2>
            <p style={{ color: "#444", fontSize: 12 }}>{phases.length} fases · 28 semanas · {newModules} nuevos</p>
          </div>
          {phases.map(p => (
            <div key={p.id} style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />
                <span style={{ fontSize: 10, letterSpacing: "0.15em", color: p.color, fontWeight: 600 }}>{p.phase}</span>
                <span style={{ fontSize: 13, color: "#ddd" }}>{p.title}</span>
                <span style={{ fontSize: 10, color: "#333" }}>· {p.weeks} · {p.modules.length} módulos</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 6 }}>
                {p.modules.map((m, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#0D0D0D", borderRadius: 5, padding: "8px 12px",
                    border: `1px solid ${m.isNew ? p.color + "20" : "#131313"}`, fontSize: 12
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#ccc" }}>{m.name}</span>
                      {m.isNew && <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 2, background: "#F5C51820", color: "#F5C518", fontWeight: 700 }}>NEW</span>}
                    </div>
                    <span style={{ fontSize: 9, color: "#333", fontFamily: "monospace" }}>
                      {m.output.split(".").pop() || "app"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
