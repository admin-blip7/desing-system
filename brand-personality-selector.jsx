import { useState } from "react";

const personalities = [
  {
    id: "apple",
    name: "Apple",
    archetype: "El Estándar de Oro",
    tagline: "Integración invisible — ahora con Liquid Glass (2025)",
    philosophy: "Si algo no es esencial, se elimina. En 2025, Liquid Glass redefine la UI con translucidez, refracción y superficies vivas",
    color: "#A1A1AA",
    accentColor: "#fff",
    bg: "linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)",
    cardBg: "#111",
    ideal: ["Tecnología", "Retail premium", "Servicios profesionales", "Salud", "Fintech"],
    notIdeal: ["Streetwear", "Restaurantes casuales", "Entretenimiento infantil"],
    dna: {
      typography: { primary: "SF Pro Display / Myriad Pro", style: "Sans-serif humanista, ultra legible", weight: "Ultralight para títulos, Regular para body", letterSpacing: "Tight en headlines, normal en body" },
      colors: { palette: "Monocromático dominante (blanco, negro, grises)", accent: "Color como función, no como decoración — azul para links, verde para éxito", rule: "El producto ES el color — el sistema es neutro" },
      layout: { grid: "Centrado, simétrico, mucho espacio en blanco", spacing: "Generoso — el vacío es el diseño", density: "Ultra-baja. Una idea por pantalla" },
      motion: { style: "Liquid Glass: translucidez con refracción, superficies que responden al contenido subyacente", easing: "Ease-out con inercia física, capas que se mueven independientemente", speed: "Medium — nunca se siente apresurado, transiciones fluidas entre capas" },
      photography: { style: "Producto en fondo limpio, iluminación perfecta", treatment: "Sin filtros, colores naturales, profundidad de campo", mood: "Aspiracional pero alcanzable" },
      voice: { tone: "Directo, simple, confiado sin ser arrogante", length: "Frases cortas. Párrafos de 1-2 líneas", words: "Verbos activos, sin jerga técnica" }
    },
    keyPrinciples: [
      "Reducción obsesiva — cada elemento debe justificar su existencia",
      "Liquid Glass (WWDC 2025) — mayor rediseño visual en una década: translucidez, refracción, capas vivas",
      "Apple cumple 50 años (1 abril 2026) — Tim Cook prometió celebración especial del hito",
      "iOS 26 / macOS 26 — naming basado en año, 20+ productos nuevos en 2026 incl. iPhone Fold",
      "Consistencia brutal — el mismo Liquid Glass unifica iPhone, iPad, Mac, Watch, TV y Vision",
      "Apple Creator Studio (Ene 2026): suscripción unificada de apps creativas (Final Cut, Logic, Pixelmator)"
    ],
    cssPreview: { fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif", background: "#000", foreground: "#fff", accent: "#0071E3", radius: "16px", shadow: "0 4px 24px rgba(0,0,0,0.3)" }
  },
  {
    id: "teenage-engineering",
    name: "Teenage Engineering",
    archetype: "Los Rockstars del Diseño",
    tagline: "Hacer la tecnología divertida y física otra vez",
    philosophy: "Diseño post-Bauhaus: cada limitación es una oportunidad creativa. En 2025, se expande a vehículos eléctricos y productos culturales",
    color: "#FF6B35",
    accentColor: "#FF6B35",
    bg: "linear-gradient(145deg, #1a1714 0%, #0d0b09 100%)",
    cardBg: "#151210",
    ideal: ["Electrónica", "Música/Audio", "Startups tech", "Makers/DIY", "Gaming"],
    notIdeal: ["Abogados", "Banca tradicional", "Medicina seria"],
    dna: {
      typography: { primary: "Fuentes monoespaciadas / Display geométricas", style: "Industrial, técnico, como manual de instrucciones", weight: "Medium a Bold, todo uppercase para labels", letterSpacing: "Wide en labels, tight en display" },
      colors: { palette: "Blanco/Negro como base + UN color primario brillante (naranja, amarillo)", accent: "Colores primarios Bauhaus — sin degradados, planos", rule: "Color como identidad de producto — cada producto tiene su color" },
      layout: { grid: "Modular, como blueprint técnico", spacing: "Denso pero ordenado — información empaquetada con precisión", density: "Alta pero legible — como un PCB bien diseñado" },
      motion: { style: "Mecánico, con clicks satisfactorios", easing: "Linear o steps — nada orgánico", speed: "Rápido y preciso, como un mecanismo" },
      photography: { style: "Producto como objeto de deseo, ángulos técnicos", treatment: "Fondo neutro, iluminación dura, sombras definidas", mood: "Juguete de precisión para adultos" },
      voice: { tone: "Directo, técnico pero accesible, con humor sutil", length: "Mínimo. Specs hablan por sí solas", words: "Terminología técnica pero usada casualmente" }
    },
    keyPrinciples: [
      "Lo físico importa — perillas, clicks, texturas táctiles",
      "Limitaciones como feature — menos opciones = más creatividad",
      "Packaging como experiencia — papel prensado, bandas elásticas",
      "Accesible en precio Y en complejidad — profundidad sin intimidar",
      "Pocket Operator cumple 10 años (Ene 2025). OP-1 Field VST (Apr 2025). Field System Black (Jun 2025)",
      "EPA-1 moped eléctrico con Vässla + EP-40 Riddim sampler (Nov 2025) — expansión a vehículos y cultura",
      "EP-133 KO II: nueva versión 128MB (Ene 2026). Colaboraciones vigentes: IKEA, Playdate, Rabbit R1, Nothing, Vässla"
    ],
    cssPreview: { fontFamily: "'IBM Plex Mono', 'Courier New', monospace", background: "#F5F0EB", foreground: "#1a1a1a", accent: "#FF6B35", radius: "0px", shadow: "none" }
  },
  {
    id: "polestar",
    name: "Polestar",
    archetype: "Minimalismo Escandinavo Puro",
    tagline: "Sofisticación a través de la tipografía y la ausencia",
    philosophy: "Pure, Progressive, Performance — reducción a lo esencial. Polestar 5 GT (884hp) debutó en IAA Munich 2025",
    color: "#C8C8C8",
    accentColor: "#E8E8E8",
    bg: "linear-gradient(145deg, #141416 0%, #0a0a0b 100%)",
    cardBg: "#111113",
    ideal: ["Automotriz", "Arquitectura", "Moda minimalista", "Galería/Arte", "Consultoría premium"],
    notIdeal: ["Comida rápida", "E-commerce masivo", "Entretenimiento"],
    dna: {
      typography: { primary: "Unica77 (una sola familia, un peso)", style: "Neutral-puro, ni frío ni cálido", weight: "UN solo peso para todo — la consistencia extrema", letterSpacing: "Generoso, tracking abierto" },
      colors: { palette: "Monocromático: negro, blanco, grises plateados", accent: "Prácticamente ninguno — el color viene del producto/fotografía", rule: "El sistema es invisible — como un museo blanco" },
      layout: { grid: "Asimétrico pero equilibrado, mucho aire", spacing: "Extremadamente generoso — el vacío ES el mensaje", density: "Ultra-mínima — una palabra puede ser toda la pantalla" },
      motion: { style: "Casi invisible, transiciones lentas y suaves", easing: "Ease-in-out largo, como respirar", speed: "Lento y deliberado — el lujo no tiene prisa" },
      photography: { style: "Arquitectónica, con mucho espacio negativo", treatment: "Desaturada, tonal, como fotografía de galería", mood: "Contemplativo, silencioso, poderoso" },
      voice: { tone: "Pocas palabras, cada una pesa. Silencio > ruido", length: "Frases de 3-5 palabras. Poesía industrial", words: "Adjetivos eliminados — solo sustantivos y verbos" }
    },
    keyPrinciples: [
      "Una tipografía (Unica77), un peso, un tamaño — consistencia radical",
      "Monochrome como filosofía — 'Storm' y 'Midnight' como únicos colores de la gama 2026",
      "Nuevo Head of Design: Philipp Roemers — diseñando Polestar 7 (compact SUV, 2028)",
      "Sostenibilidad visible en materiales (ampliTex, flax, Econyl, cuero Bridge of Weir chrome-free)",
      "Polestar 5 GT (Sep 2025): 884hp Performance, plataforma aluminio propia (PPA), 800V, sin ventana trasera",
      "BST (Beast) sub-brand permanente — ediciones alto rendimiento para toda la gama (late 2026/2027)",
      "Ventas +36% en 2025 (60K unidades). Diseño premiado: Red Dot, iF Gold, IDEA Gold"
    ],
    cssPreview: { fontFamily: "'Suisse Intl', 'Helvetica Neue', sans-serif", background: "#FAFAFA", foreground: "#1a1a1a", accent: "#999", radius: "0px", shadow: "none" }
  },
  {
    id: "linear",
    name: "Linear",
    archetype: "El Nuevo Estándar SaaS",
    tagline: "Minimalismo mágico — de gradientes a monocromático puro en 2025",
    philosophy: "La interfaz debe sentirse tan rápida como el pensamiento. En 2025, evolucionó de gradientes a neutrales casi absolutos",
    color: "#5E6AD2",
    accentColor: "#5E6AD2",
    bg: "linear-gradient(145deg, #0D0F1A 0%, #080A12 100%)",
    cardBg: "#0F1120",
    ideal: ["Software/SaaS", "Startups tech", "Developer tools", "Fintech digital", "AI/ML products"],
    notIdeal: ["Retail físico", "Restaurantes", "Moda", "Niños"],
    dna: {
      typography: { primary: "Inter / Inter Display para headings", style: "Sans-serif neutral, optimizado para pantalla", weight: "Medium para UI, Semibold para emphasis", letterSpacing: "Tight en headlines, normal en body" },
      colors: { palette: "Dark mode: negros profundos (#0A0A0F) con capas de elevación", accent: "Gradientes sutiles como aura (purple → blue → teal)", rule: "Color como luz — los gradientes simulan iluminación, no decoración" },
      layout: { grid: "Lineal — dirección única de lectura, progresión vertical", spacing: "Tight pero respirable — densidad informativa sin claustrofobia", density: "Media-alta — tool-like, productivo" },
      motion: { style: "Ultra-fluido, spring animations, 60fps obligatorio", easing: "Spring con damping bajo — todo rebota sutilmente", speed: "Rápido — la velocidad ES la marca" },
      photography: { style: "No usa fotografía — todo es UI, renders y gradientes", treatment: "Screenshots de producto tratados como hero art", mood: "Productividad elegante, pro-tools para pros" },
      voice: { tone: "Conciso, inteligente, para developers que valoran su tiempo", length: "Directo al punto. Changelogs como poesía", words: "Terminología técnica es bienvenida — el usuario es experto" }
    },
    keyPrinciples: [
      "Dark mode no es negro — es tu brand color al 1-10% lightness",
      "2025: Evolución de gradientes→monocromático. Menos color, más neutrales. Maduración del estilo",
      "Orbiter: design system interno (no público) sobre Radix UI components",
      "LCH color space para temas consistentes: base color + accent + contrast = todo generado",
      "Inter Display para headings, Inter regular para body — tipografía optimizada para pantalla",
      "Keyboard-first — atajos como feature premium, velocidad percibida es la marca",
      "El 'Linear look' se volvió industria — pero Linear mismo lo superó con más restraint"
    ],
    cssPreview: { fontFamily: "'Inter', -apple-system, sans-serif", background: "#0A0A12", foreground: "#E2E8F0", accent: "#5E6AD2", radius: "8px", shadow: "0 0 0 1px rgba(94,106,210,0.15), 0 4px 12px rgba(0,0,0,0.4)" }
  },
  {
    id: "bang-olufsen",
    name: "Bang & Olufsen",
    archetype: "La Alquimia de los Materiales",
    tagline: "100 años de tratar la tecnología como mobiliario de alta gama atemporal (1925-2025)",
    philosophy: "No diseñamos gadgets — diseñamos objetos que duran 50 años. Identidad de marca refrescada en su centenario 2025",
    color: "#C9A96E",
    accentColor: "#C9A96E",
    bg: "linear-gradient(145deg, #17130E 0%, #0B0907 100%)",
    cardBg: "#151110",
    ideal: ["Audio/Luxury", "Hotelería", "Real estate premium", "Moda de lujo", "Gastronomía fine dining"],
    notIdeal: ["Tech masivo", "Discount retail", "Servicios básicos"],
    dna: {
      typography: { primary: "Serif editorial para display / Sans-serif para body", style: "Editorial de lujo — como revista de interiorismo", weight: "Light para títulos grandes, Regular para texto", letterSpacing: "Elegante, ligeramente abierto" },
      colors: { palette: "Tierra y metálicos: bronce, champagne, roble, antracita", accent: "Dorado/bronce como material, no como color", rule: "Los colores vienen de los materiales — aluminio, madera, cuero" },
      layout: { grid: "Editorial — como revista de diseño danés", spacing: "Lujosamente espacioso — cada elemento respira", density: "Muy baja — menos es siempre más" },
      motion: { style: "Cinematográfico, slowmo, con peso físico", easing: "Ease-out largo y sedoso", speed: "Deliberadamente lento — el lujo no corre" },
      photography: { style: "Producto como pieza de arte en ambiente de interiorismo", treatment: "Warm tones, iluminación suave lateral, profundidad atmosférica", mood: "Showroom privado de un coleccionista" },
      voice: { tone: "Sussurrado, poético, sensorial", length: "Breve pero evocativo — descripciones de materiales", words: "Adjetivos sensoriales: aterciopelado, cálido, envolvente" }
    },
    keyPrinciples: [
      "Los materiales SON la identidad — aluminio anodizado, roble, tela acústica, carbon fiber",
      "Atemporalidad > tendencia — debe verse bien en 2075",
      "100 aniversario (Nov 2025): brand identity refrescada, campaña centenaria, takeover en Harrods",
      "Nuevo concepto 'Culture Store' — SF (la más grande del mundo), París. Retail como galería",
      "Beolab 90 Anniversary Editions: Phantom ($211k+) y Mirage — limitados a 10 pares cada uno",
      "Collab con BIG (Bjarke Ingels) en 3 Days of Design Copenhagen 2025"
    ],
    cssPreview: { fontFamily: "'Playfair Display', Georgia, serif", background: "#0F0C08", foreground: "#E8DDD0", accent: "#C9A96E", radius: "0px", shadow: "0 8px 40px rgba(0,0,0,0.5)" }
  },
  {
    id: "nothing",
    name: "Nothing",
    archetype: "Transparencia Retro-Futurista",
    tagline: "Desnudar la tecnología — del Glyph Interface al Glyph Matrix, y rebrand en curso (Ene 2026)",
    philosophy: "Romper la norma de que todo debe ser una caja negra. En enero 2026, Nothing teasea nuevo logo abandonando NDot por tipografía más limpia — señal de maduración de marca",
    color: "#E8E8E8",
    accentColor: "#FF0000",
    bg: "linear-gradient(145deg, #141414 0%, #0A0A0A 100%)",
    cardBg: "#111111",
    ideal: ["Tech disruptivo", "Streetwear tech", "Gaming", "Electrónica joven", "Startups de hardware"],
    notIdeal: ["Lujo clásico", "Salud", "Finanzas tradicionales", "Gobierno"],
    dna: {
      typography: { primary: "NDot (dot-matrix) → nuevo wordmark limpio (rebrand Ene 2026)", style: "Retro-futurista en transición: de terminal del futuro a mainstream elevado", weight: "Medium uniforme — sin jerarquía tradicional", letterSpacing: "Wide, como impresión de matriz de puntos" },
      colors: { palette: "Blanco/Negro absoluto como base, transparencia como textura", accent: "Rojo como señal — Glyph Matrix (Phone 3) y Glyph Lights (Phone 3a) como lenguaje visual dual", rule: "El color es luz LED, no pigmento — dos sistemas visuales coexistiendo" },
      layout: { grid: "Técnico, como diagrama de componentes electrónicos", spacing: "Ajustado pero ordenado — empaquetado con propósito", density: "Media — información revelada, no oculta" },
      motion: { style: "Pulsante, como LEDs y señales digitales", easing: "Steps / Linear — digital, no orgánico", speed: "Rápido, con pulsos y blinks" },
      photography: { style: "Transparencia literal — se ven los componentes internos", treatment: "Alto contraste, macro shots de PCBs y bobinas", mood: "Cyberpunk accesible — Matrix meets IKEA" },
      voice: { tone: "Rebelde pero articulado, provocador con sustancia", length: "Punchy, como tweet con impacto", words: "Anti-corporativo — nunca suena a 'comunicado de prensa'" }
    },
    keyPrinciples: [
      "Transparencia como metáfora — mostrar las 'tripas' de todo",
      "Phone 3 (Jul 2025): 'Killed the Glyph' → Glyph Matrix: LEDs circulares que forman patrones, logos y texto",
      "REBRAND en curso (Ene 2026): nuevo logo abandonando NDot por tipografía más limpia y convencional",
      "Nuevo HQ en King's Cross por Heatherwick Studio (Q1 2026). Tiendas: Bengaluru (Feb 14), NYC y Tokyo próximas",
      "Charlie Smith (ex-CMO Loewe) como Chief Brand Officer — señal de posicionamiento lifestyle/fashion",
      "Phone 3 es el flagship para todo 2026 — no habrá Phone 4. Phone 4a en marzo 2026",
      "NothingOS 4.0 + Essential Apps: plataforma AI para crear mini-apps con texto, sin código",
      "$1B en ventas lifetime, unicornio ($1.3B valuación). CMF separada como entidad independiente"
    ],
    cssPreview: { fontFamily: "'Space Mono', 'Courier New', monospace", background: "#fff", foreground: "#000", accent: "#FF0000", radius: "0px", shadow: "none" }
  },
  {
    id: "aesop",
    name: "Aēsop",
    archetype: "El Boticario Intelectual",
    tagline: "Diseño como ritual — cada detalle es una experiencia sensorial",
    philosophy: "Funcionalidad inteligente envuelta en estética atemporal. Adquirida por L'Oréal ($2.53B, 2023) — identidad intacta",
    color: "#8B7355",
    accentColor: "#C4956A",
    bg: "linear-gradient(145deg, #16130F 0%, #0B0A07 100%)",
    cardBg: "#141210",
    ideal: ["Salud/Bienestar", "Cosmética", "Cafeterías especializadas", "Boutiques", "Spas/Clínicas estéticas"],
    notIdeal: ["Tech", "Electrónica", "Fast fashion", "Comida rápida"],
    dna: {
      typography: { primary: "Serif clásico de alta calidad (Suisse Works / Caslon)", style: "Editorial-literaria, como portada de libro elegante", weight: "Regular para todo — la uniformidad es refinamiento", letterSpacing: "Normal a ligeramente abierto" },
      colors: { palette: "Tierra: ámbar, arena, terracota, oliva, crema", accent: "El marrón/ámbar del packaging ES la marca", rule: "Colores derivados de ingredientes naturales" },
      layout: { grid: "Editorial limpio, columnas clásicas", spacing: "Generoso pero cálido — no frío como Polestar", density: "Baja — cada producto tiene su momento" },
      motion: { style: "Casi inexistente — el contenido es estático y deliberado", easing: "Ease suave, como abrir un frasco", speed: "Lento — los rituales no se apresuran" },
      photography: { style: "Producto como naturaleza muerta (still life)", treatment: "Cálido, natural, texturas táctiles de botánicos", mood: "Apotecario del siglo XXI en Kioto" },
      voice: { tone: "Culto pero accesible, como un amigo que lee mucho", length: "Descriptivo — ingredientes y procesos explicados con cuidado", words: "Vocabulario rico, referencias literarias y botánicas" }
    },
    keyPrinciples: [
      "El packaging uniformado ES la marca — botella ámbar = Aēsop",
      "Cada tienda es única pero inconfundiblemente Aēsop — 400+ tiendas globales",
      "Adquirida por L'Oréal (2023, $2.53B) — la mayor adquisición en su historia. Identidad de diseño intacta",
      "CEO histórico Michael O'Keeffe se fue Dic 2024 tras 20+ años — transición bajo L'Oréal Luxe",
      "Tipografía serif (Optima) + colores ámbar como señal de intelectualidad y naturaleza",
      "B Corp re-certificada 2024 — sostenibilidad como identidad, no como marketing"
    ],
    cssPreview: { fontFamily: "'Crimson Pro', 'Georgia', serif", background: "#FAF6F1", foreground: "#2C2416", accent: "#8B7355", radius: "2px", shadow: "0 2px 8px rgba(44,36,22,0.1)" }
  },
  {
    id: "manual",
    name: "Modo Manual",
    archetype: "Construye desde cero",
    tagline: "Para quienes saben exactamente lo que quieren",
    philosophy: "Tu visión, tus reglas — el sistema te guía sin imponerse",
    color: "#F5C518",
    accentColor: "#F5C518",
    bg: "linear-gradient(145deg, #111 0%, #0A0A0A 100%)",
    cardBg: "#151515",
    ideal: ["Cualquier industria"],
    notIdeal: [],
    dna: null,
    keyPrinciples: [
      "Onboarding completo de 22 preguntas sin plantilla base",
      "Puedes subir assets existentes (logo, fotos, colores, docs)",
      "La IA analiza lo que subes y sugiere dirección",
      "Máxima flexibilidad — cada respuesta es abierta",
      "Perfecto si ya tienes una identidad parcial",
      "Combina elementos de múltiples personalidades"
    ],
    cssPreview: null
  }
];

const dnaCategories = [
  { key: "typography", label: "Tipografía", icon: "Aa" },
  { key: "colors", label: "Color", icon: "◆" },
  { key: "layout", label: "Layout", icon: "⊞" },
  { key: "motion", label: "Motion", icon: "↝" },
  { key: "photography", label: "Fotografía", icon: "◐" },
  { key: "voice", label: "Voz & Tono", icon: "❝" },
];

function CSSPreview({ css, name }) {
  if (!css) return null;
  return (
    <div style={{
      background: css.background, borderRadius: 8, padding: 20,
      border: `1px solid ${css.accent}25`, fontFamily: css.fontFamily,
      overflow: "hidden"
    }}>
      <div style={{ fontSize: 9, letterSpacing: "0.2em", color: css.accent, textTransform: "uppercase", marginBottom: 8, opacity: 0.7 }}>
        PREVIEW — {name}
      </div>
      <div style={{ fontSize: 28, fontWeight: 300, color: css.foreground, marginBottom: 4, letterSpacing: "-0.02em" }}>
        Tu Marca Aquí
      </div>
      <div style={{ fontSize: 12, color: css.foreground, opacity: 0.5, marginBottom: 16 }}>
        Así se vería tu manual de marca con esta personalidad
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{
          padding: "8px 16px", borderRadius: css.radius,
          background: css.accent, color: css.background,
          fontSize: 11, fontWeight: 600, fontFamily: css.fontFamily
        }}>Botón primario</div>
        <div style={{
          padding: "8px 16px", borderRadius: css.radius,
          border: `1px solid ${css.accent}50`, color: css.accent,
          fontSize: 11, fontWeight: 500, fontFamily: css.fontFamily
        }}>Secundario</div>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        {[css.background, css.foreground, css.accent, css.accent + "80", css.foreground + "40"].map((c, i) => (
          <div key={i} style={{ width: 24, height: 24, borderRadius: css.radius === "0px" ? 0 : 4, background: c, border: "1px solid rgba(128,128,128,0.2)" }} />
        ))}
      </div>
    </div>
  );
}

export default function PersonalitySelector() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("grid");
  const [activeDna, setActiveDna] = useState("typography");
  const active = personalities.find(p => p.id === selected);

  return (
    <div style={{ minHeight: "100vh", background: "#09090B", color: "#E5E5E5", fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid #18181B" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#3F3F46", textTransform: "uppercase" }}>Brand Manual Generator</div>
            <h1 style={{ fontSize: 28, fontWeight: 200, color: "#fff", margin: "4px 0 0" }}>
              ¿Qué personalidad define tu marca?
            </h1>
            <p style={{ color: "#52525B", fontSize: 13, marginTop: 6, maxWidth: 600, lineHeight: 1.6 }}>
              Cada personalidad es un sistema de diseño completo pre-analizado — tipografía, colores, layout, motion, fotografía y voz. Selecciona una como base y personalízala, o elige <span style={{ color: "#F5C518" }}>Modo Manual</span> para construir desde cero.
            </p>
          </div>
          <div style={{ display: "flex", gap: 4, background: "#18181B", borderRadius: 6, padding: 3 }}>
            {[{ k: "grid", l: "Seleccionar" }, { k: "compare", l: "Comparar" }, { k: "flow", l: "Flujo" }].map(v => (
              <button key={v.k} onClick={() => setView(v.k)} style={{
                padding: "6px 12px", borderRadius: 4, border: "none",
                background: view === v.k ? "#27272A" : "transparent",
                color: view === v.k ? "#F5C518" : "#52525B",
                fontSize: 10, cursor: "pointer", fontWeight: 500
              }}>{v.l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID VIEW — Selection */}
      {view === "grid" && !selected && (
        <div style={{ padding: "24px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {personalities.map(p => (
              <button key={p.id} onClick={() => setSelected(p.id)} style={{
                background: p.cardBg, borderRadius: 10, padding: 20,
                border: `1px solid ${p.color}15`, cursor: "pointer",
                textAlign: "left", transition: "all 0.25s",
                position: "relative", overflow: "hidden"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "40"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = p.color + "15"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {p.id === "manual" && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${p.color}, ${p.color}00)` }} />
                )}
                <div style={{ fontSize: 9, letterSpacing: "0.2em", color: p.color, fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>
                  {p.id === "manual" ? "★ AVANZADO" : p.archetype}
                </div>
                <div style={{ fontSize: 20, fontWeight: 300, color: "#fff", marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#52525B", lineHeight: 1.5, marginBottom: 12, minHeight: 32 }}>{p.tagline}</div>
                {p.ideal.length > 0 && p.id !== "manual" && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {p.ideal.slice(0, 3).map((t, i) => (
                      <span key={i} style={{ fontSize: 8, padding: "2px 6px", borderRadius: 3, background: p.color + "10", color: p.color + "90" }}>{t}</span>
                    ))}
                  </div>
                )}
                {p.id === "manual" && (
                  <div style={{ fontSize: 10, color: "#F5C518", marginTop: 4, opacity: 0.7 }}>
                    + Sube tus assets existentes
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DETAIL VIEW — Selected personality */}
      {view === "grid" && selected && (
        <div style={{ display: "flex", minHeight: "calc(100vh - 120px)" }}>
          {/* Sidebar — Switch personalities */}
          <div style={{ width: 200, borderRight: "1px solid #18181B", padding: "12px 0" }}>
            {personalities.map(p => (
              <button key={p.id} onClick={() => { setSelected(p.id); setActiveDna("typography"); }} style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                padding: "8px 14px", border: "none", cursor: "pointer",
                background: selected === p.id ? "#18181B" : "transparent",
                borderLeft: `2px solid ${selected === p.id ? p.color : "transparent"}`
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, opacity: selected === p.id ? 1 : 0.3 }} />
                <span style={{ fontSize: 11, color: selected === p.id ? "#fff" : "#52525B" }}>{p.name}</span>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div style={{ flex: 1, padding: "24px 32px", overflowY: "auto" }}>
            {active && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.2em", color: active.color, fontWeight: 600, marginBottom: 4 }}>{active.archetype}</div>
                    <h2 style={{ fontSize: 32, fontWeight: 200, color: "#fff", margin: 0 }}>{active.name}</h2>
                    <p style={{ fontSize: 13, color: "#52525B", marginTop: 4, maxWidth: 500 }}>{active.philosophy}</p>
                  </div>
                  <button onClick={() => { /* Navigate to onboarding with personality */ }} style={{
                    padding: "10px 20px", borderRadius: 6, border: "none",
                    background: active.color, color: "#000", fontSize: 12,
                    fontWeight: 600, cursor: "pointer", letterSpacing: "0.05em"
                  }}>
                    Usar esta personalidad →
                  </button>
                </div>

                {active.dna ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {/* Left — DNA Details */}
                    <div>
                      {/* DNA Tabs */}
                      <div style={{ display: "flex", gap: 2, marginBottom: 16, background: "#111113", borderRadius: 6, padding: 3 }}>
                        {dnaCategories.map(c => (
                          <button key={c.key} onClick={() => setActiveDna(c.key)} style={{
                            flex: 1, padding: "6px 4px", borderRadius: 4, border: "none",
                            background: activeDna === c.key ? "#27272A" : "transparent",
                            color: activeDna === c.key ? active.color : "#3F3F46",
                            fontSize: 9, cursor: "pointer", fontWeight: 500,
                            letterSpacing: "0.05em"
                          }}>
                            <span style={{ marginRight: 4 }}>{c.icon}</span>{c.label}
                          </button>
                        ))}
                      </div>

                      {/* DNA Content */}
                      {active.dna[activeDna] && (
                        <div style={{ background: "#111113", borderRadius: 8, padding: 18, border: "1px solid #1E1E22" }}>
                          {Object.entries(active.dna[activeDna]).map(([k, v], i) => (
                            <div key={k} style={{ marginBottom: i < Object.entries(active.dna[activeDna]).length - 1 ? 14 : 0 }}>
                              <div style={{ fontSize: 9, letterSpacing: "0.15em", color: active.color, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>{k}</div>
                              <div style={{ fontSize: 12, color: "#A1A1AA", lineHeight: 1.6 }}>{v}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Key Principles */}
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "#3F3F46", fontWeight: 600, marginBottom: 8, textTransform: "uppercase" }}>Principios Clave</div>
                        {active.keyPrinciples.map((p, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                            <span style={{ color: active.color, fontSize: 10, marginTop: 2 }}>→</span>
                            <span style={{ fontSize: 11, color: "#71717A", lineHeight: 1.5 }}>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right — Preview + Industries */}
                    <div>
                      <CSSPreview css={active.cssPreview} name={active.name} />

                      <div style={{ marginTop: 16, background: "#111113", borderRadius: 8, padding: 16, border: "1px solid #1E1E22" }}>
                        <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "#10B981", fontWeight: 600, marginBottom: 8, textTransform: "uppercase" }}>Ideal para</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {active.ideal.map((t, i) => (
                            <span key={i} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "#10B98115", color: "#10B981", border: "1px solid #10B98120" }}>{t}</span>
                          ))}
                        </div>
                        {active.notIdeal.length > 0 && (
                          <>
                            <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "#EF4444", fontWeight: 600, margin: "12px 0 8px", textTransform: "uppercase" }}>Menos recomendado</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {active.notIdeal.map((t, i) => (
                                <span key={i} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "#EF444410", color: "#EF444480" }}>{t}</span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* How it connects */}
                      <div style={{ marginTop: 16, background: "#0D1117", borderRadius: 8, padding: 16, border: "1px solid #1E293B" }}>
                        <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "#5E6AD2", fontWeight: 600, marginBottom: 8, textTransform: "uppercase" }}>Qué hace el sistema</div>
                        <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.7 }}>
                          Al elegir <strong style={{ color: "#94A3B8" }}>{active.name}</strong>, el motor de generación inyecta este DNA en cada módulo. Tu paleta de colores nace de su filosofía cromática, tu tipografía sigue su escala, tu voz adopta su tono, y tus layouts respetan su densidad. Todo personalizable después.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Manual Mode */
                  <div style={{ background: "#111113", borderRadius: 10, padding: 24, border: "1px solid #F5C51820" }}>
                    <div style={{ fontSize: 14, color: "#F5C518", fontWeight: 500, marginBottom: 12 }}>Modo Manual — Construye tu propia personalidad</div>
                    <div style={{ fontSize: 12, color: "#71717A", lineHeight: 1.7, marginBottom: 20 }}>
                      El onboarding completo te guía paso a paso. Puedes subir assets existentes (logos, fotos, documentos de marca) y la IA los analiza para sugerirte una dirección. También puedes mezclar elementos de múltiples personalidades.
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                      {[
                        { icon: "📤", title: "Sube tu logo", desc: "La IA analiza colores, formas y estilo" },
                        { icon: "📸", title: "Sube fotos de tu marca", desc: "Extrae paleta, mood y dirección visual" },
                        { icon: "📄", title: "Sube documentos", desc: "Manual existente, PDFs, presentaciones" },
                        { icon: "🌐", title: "Comparte tu web", desc: "Analiza tu presencia digital actual" },
                        { icon: "📱", title: "Comparte tu Instagram", desc: "Analiza tu grid, colores y estilo" },
                        { icon: "🎨", title: "Mezcla personalidades", desc: "Ej: 'Tipografía de Polestar + Colores de TE'" },
                      ].map((item, i) => (
                        <div key={i} style={{ background: "#18181B", borderRadius: 8, padding: 14, border: "1px solid #27272A" }}>
                          <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                          <div style={{ fontSize: 12, color: "#D4D4D8", fontWeight: 500, marginBottom: 2 }}>{item.title}</div>
                          <div style={{ fontSize: 10, color: "#52525B" }}>{item.desc}</div>
                        </div>
                      ))}
                    </div>
                    {active.keyPrinciples.map((p, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginTop: i === 0 ? 16 : 4 }}>
                        <span style={{ color: "#F5C518", fontSize: 10 }}>→</span>
                        <span style={{ fontSize: 11, color: "#52525B" }}>{p}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* COMPARE VIEW */}
      {view === "compare" && (
        <div style={{ padding: "24px 32px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #27272A", color: "#3F3F46", fontSize: 9, letterSpacing: "0.15em" }}>ASPECTO</th>
                {personalities.filter(p => p.dna).map(p => (
                  <th key={p.id} style={{ textAlign: "left", padding: "8px 12px", borderBottom: `2px solid ${p.color}30`, minWidth: 140 }}>
                    <div style={{ color: p.color, fontSize: 10, fontWeight: 600 }}>{p.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dnaCategories.map(cat => (
                <tr key={cat.key}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #18181B", color: "#71717A", fontWeight: 500, verticalAlign: "top", whiteSpace: "nowrap" }}>
                    <span style={{ marginRight: 6 }}>{cat.icon}</span>{cat.label}
                  </td>
                  {personalities.filter(p => p.dna).map(p => (
                    <td key={p.id} style={{ padding: "10px 12px", borderBottom: "1px solid #18181B", color: "#52525B", verticalAlign: "top", lineHeight: 1.5 }}>
                      {p.dna[cat.key]?.style || p.dna[cat.key]?.palette || p.dna[cat.key]?.tone || "—"}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td style={{ padding: "10px 12px", color: "#71717A", fontWeight: 500, verticalAlign: "top" }}>Industrias</td>
                {personalities.filter(p => p.dna).map(p => (
                  <td key={p.id} style={{ padding: "10px 12px", verticalAlign: "top" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      {p.ideal.slice(0, 3).map((t, i) => (
                        <span key={i} style={{ fontSize: 8, padding: "1px 4px", borderRadius: 2, background: p.color + "10", color: p.color + "80" }}>{t}</span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* FLOW VIEW */}
      {view === "flow" && (
        <div style={{ padding: "24px 32px", maxWidth: 900 }}>
          <h2 style={{ fontSize: 20, fontWeight: 300, color: "#fff", margin: "0 0 20px" }}>
            Cómo funciona la selección de personalidad
          </h2>

          {[
            { step: "01", title: "El usuario llega sin saber qué quiere", desc: "Se le presentan las 7 personalidades + modo manual como tarjetas visuales con preview de cómo se vería su marca", color: "#F5C518" },
            { step: "02", title: "Explora y compara", desc: "Puede ver el DNA completo de cada una: tipografía, colores, layout, motion, fotografía y voz. La tabla comparativa ayuda a decidir", color: "#3B82F6" },
            { step: "03", title: "Selecciona una base (o manual)", desc: "La personalidad elegida pre-llena respuestas del onboarding: colores sugeridos, estilo tipográfico, mood visual, tono de voz, densidad de layout", color: "#10B981" },
            { step: "04", title: "Onboarding personalizado", desc: "Las preguntas se adaptan. Si eligió 'Linear', no preguntamos si quiere serif. Si eligió 'B&O', sugerimos fotografía editorial. El onboarding se acorta ~40%", color: "#EC4899" },
            { step: "05", title: "Generación con DNA inyectado", desc: "Cada módulo recibe el DNA como contexto: 'Genera la paleta de color siguiendo la filosofía de Polestar: monocromático, con acentos del producto'", color: "#8B5CF6" },
            { step: "06", title: "Personalización post-generación", desc: "El usuario puede override cualquier decisión. Cambiar colores, fuentes, tono — la personalidad es punto de partida, no camisa de fuerza", color: "#F97316" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                background: s.color + "15", border: `1px solid ${s.color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 300, color: s.color
              }}>{s.step}</div>
              <div>
                <div style={{ fontSize: 14, color: "#E4E4E7", fontWeight: 500, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "#52525B", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}

          {/* Onboarding reduction */}
          <div style={{ marginTop: 20, background: "#111113", borderRadius: 8, padding: 18, border: "1px solid #1E1E22" }}>
            <div style={{ fontSize: 12, color: "#F5C518", fontWeight: 500, marginBottom: 10 }}>
              ¿Qué preguntas se saltan con una personalidad?
            </div>
            {[
              { q: "¿Qué estilo visual prefieres?", why: "Ya está definido por la personalidad" },
              { q: "¿Prefieres serif o sans-serif?", why: "La personalidad define la familia tipográfica" },
              { q: "¿Cuál es el mood de colores?", why: "Pre-cargado según DNA cromático" },
              { q: "¿Prefieres formas suaves o angulares?", why: "Definido por geometrías de la personalidad" },
              { q: "¿Tu marca se siente rápida o calmada?", why: "Motion DNA lo establece" },
              { q: "¿Qué marca admires visualmente?", why: "Ya la seleccionaron como base" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 5 ? "1px solid #18181B" : "none" }}>
                <span style={{ fontSize: 11, color: "#71717A", textDecoration: "line-through", opacity: 0.6 }}>{item.q}</span>
                <span style={{ fontSize: 10, color: "#3F3F46" }}>{item.why}</span>
              </div>
            ))}
          </div>

          {/* Upload analysis */}
          <div style={{ marginTop: 20, background: "#0D1117", borderRadius: 8, padding: 18, border: "1px solid #1E293B" }}>
            <div style={{ fontSize: 12, color: "#5E6AD2", fontWeight: 500, marginBottom: 10 }}>
              Análisis de uploads (Modo Manual y personalidades)
            </div>
            <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.7 }}>
              En cualquier modo, el usuario puede subir assets. La IA los analiza:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 10 }}>
              {[
                { input: "Logo (PNG/SVG)", output: "Extrae colores, detecta geometrías, clasifica estilo (minimal, bold, decorativo)" },
                { input: "Fotos del negocio", output: "Genera mood board, paleta fotográfica, dirección de iluminación" },
                { input: "Capturas de Instagram", output: "Analiza grid, consistencia visual, paleta dominante, estilo de post" },
                { input: "PDF/Doc de marca existente", output: "Extrae tipografías, colores, tono de voz, estructura de contenido" },
              ].map((item, i) => (
                <div key={i} style={{ background: "#111827", borderRadius: 6, padding: 12, border: "1px solid #1E293B" }}>
                  <div style={{ fontSize: 10, color: "#818CF8", fontWeight: 500, marginBottom: 4 }}>{item.input}</div>
                  <div style={{ fontSize: 10, color: "#475569", lineHeight: 1.5 }}>{item.output}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
