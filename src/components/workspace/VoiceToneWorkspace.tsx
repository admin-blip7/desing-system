"use client";

import { useState } from "react";
import {
  MessageSquare,
  BookOpen,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Lightbulb,
  LayoutTemplate,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Search,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type TabId = "matrix" | "vocabulary" | "dodont" | "audit" | "suggestions" | "templates";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  description: string;
}

// Data: Tone Matrix
const toneMatrixData = [
  {
    channel: "Instagram Feed",
    tone: "Cercano, aspiracional",
    formality: "Semi-formal",
    energy: "Alta",
    characteristics: "Uso de emojis moderado, lenguaje visual, storytelling",
    color: "#E1306C"
  },
  {
    channel: "Instagram Stories",
    tone: "Espontáneo, detrás de cámaras",
    formality: "Casual",
    energy: "Muy alta",
    characteristics: "Contenido efímero, stickers, interacción directa",
    color: "#E1306C"
  },
  {
    channel: "WhatsApp Business",
    tone: "Personal, atento",
    formality: "Semi-formal",
    energy: "Media",
    characteristics: "Respuestas rápidas, uso de voz, solucionador",
    color: "#25D366"
  },
  {
    channel: "Email Marketing",
    tone: "Profesional pero cercano",
    formality: "Formal",
    energy: "Media",
    characteristics: "Asunto llamativo, cuerpo escaneable, CTA claro",
    color: "#EA4335"
  },
  {
    channel: "Email Transaccional",
    tone: "Directo, funcional",
    formality: "Formal",
    energy: "Baja",
    characteristics: "Información clara, sin adornos, foco en utilidad",
    color: "#EA4335"
  },
  {
    channel: "Atención al Cliente (Tienda)",
    tone: "Servicial, empático",
    formality: "Semi-formal",
    energy: "Variable según cliente",
    characteristics: "Escucha activa, resolución, paciencia",
    color: "#FF6B35"
  },
  {
    channel: "Sitio Web",
    tone: "Informativo, persuasivo",
    formality: "Semi-formal",
    energy: "Media",
    characteristics: "Copy orientado a conversión, beneficios claros",
    color: "#3B82F6"
  },
  {
    channel: "Publicidad Pagada",
    tone: "Persuasivo, urgente",
    formality: "Semi-formal",
    energy: "Alta",
    characteristics: "Ofertas claras, scannability, FOMO sutil",
    color: "#F5C518"
  }
];

// Data: Vocabulary
const vocabularyData = {
  values: [
    { word: "Respaldamos", category: "Confianza", usage: "Para transmitir seguridad y garantía" },
    { word: "Garantizamos", category: "Confianza", usage: "Compromiso con calidad y servicio" },
    { word: "Compromiso", category: "Confianza", usage: "Promesa de atención dedicada" },
    { word: "Premium", category: "Calidad", usage: "Productos de alta gama" },
    { word: "Seleccionado", category: "Calidad", usage: "Productos cuidadosamente elegidos" },
    { word: "Certificado", category: "Calidad", usage: "Productos con garantía oficial" },
    { word: "Última tecnología", category: "Innovación", usage: "Productos recientes lanzados" },
    { word: "Nuevo", category: "Innovación", usage: "Lanzamientos y novedades" },
    { word: "Avanzado", category: "Innovación", usage: "Características técnicas superiores" },
    { word: "Te atendemos", category: "Servicio", usage: "Atención personalizada" },
    { word: "Contigo", category: "Servicio", usage: "Cercanía y acompañamiento" },
    { word: "Para ti", category: "Servicio", usage: "Personalización del servicio" }
  ],
  differentiators: [
    { phrase: "Asesoría especializada", alternative: "Solo vendemos", context: "Enfatiza expertise vs. transacción" },
    { phrase: "Soluciones tecnológicas", alternative: "Productos", context: "Enfoque en resolver necesidades" },
    { phrase: "Acompañamiento", alternative: "Transacción", context: "Relación continua vs. venta única" },
    { phrase: "Experiencia", alternative: "Compra", context: "Momento completo vs. solo adquisición" }
  ],
  emotions: [
    { word: "Conecta", tone: "Cercanía", usage: "Para crear relación con el cliente" },
    { word: "Descubre", tone: "Curiosidad", usage: "Para presentar novedades" },
    { word: "Transforma", tone: "Empoderamiento", usage: "Para mostrar cambio positivo" },
    { word: "Simplifica", tone: "Facilidad", usage: "Para resaltar acceso" },
    { word: "Potencia", tone: "Fortaleza", usage: "Para destacar capacidades" },
    { word: "Eleva", tone: "Superación", usage: "Para progreso y mejora" },
    { word: "Innova", tone: "Modernity", usage: "Para diferenciarse" },
    { word: "Crece", tone: "Desarrollo", usage: "Para acompañamiento al cliente" }
  ],
  phrases: [
    "Tecnología al alcance de todos",
    "La experticia que necesitas, la cercanía que buscas",
    "No solo vendemos, te asesoramos",
    "Tu satisfacción es nuestra medida de éxito"
  ]
};

// Data: DO and DON'T
const doDontData = [
  {
    context: "Saludo inicial",
    doExample: "¡Hola! Bienvenido a [Marca]. ¿En qué puedo ayudarte?",
    dontExample: "Dígame.",
    why: "El cliente busca conexión, no transacción"
  },
  {
    context: "Oferta de producto",
    doExample: "Este modelo tiene [beneficio] ideal para [necesidad]",
    dontExample: "Lleve este, está barato.",
    why: "Enfócate en valor, no solo precio"
  },
  {
    context: "Manejo de reclamación",
    doExample: "Entiendo tu preocupación. Vamos a resolverlo juntos.",
    dontExample: "No es problema nuestro.",
    why: "Validación y ownership construyen lealtad"
  },
  {
    context: "Cierre de venta",
    doExample: "¿Te gustaría que te explique las opciones de financiamiento?",
    dontExample: "¿Lo llevas?",
    why: "Ofrece valor añadido, no solo cierre"
  },
  {
    context: "Seguimiento post-venta",
    doExample: "¿Cómo está funcionando tu producto? ¿Necesitas algo?",
    dontExample: "Ya compró, bye.",
    why: "El post-venta genera recompra"
  },
  {
    context: "Redes sociales - Stories",
    doExample: "Detrás de cámaras: así preparamos tu pedido",
    dontExample: "Comprando ahora",
    why: "Autenticidad genera conexión"
  },
  {
    context: "Respuesta a 'No tengo dinero'",
    doExample: "Entiendo. Tenemos opciones que se ajustan a diferentes presupuestos.",
    dontExample: "Ah, ok. Gracias.",
    why: "Siempre hay una puerta abierta"
  },
  {
    context: "Descripción de producto",
    doExample: "Este smartphone incluye [specs] + [beneficio personal]",
    dontExample: "Celular, 32GB, negro.",
    why: "Especificaciones + contexto = decisión"
  }
];

// Data: Image Audit
const imageAuditData = [
  {
    location: "Header/Dashboard",
    purpose: "Branding inicial",
    dimensions: "1200x200px",
    visualTone: "Limpio, marca visible",
    status: "exists" as const
  },
  {
    location: "Tarjetas de módulo",
    purpose: "Preview de contenido",
    dimensions: "400x300px",
    visualTone: "Coherente con módulo",
    status: "needs-reinforcement" as const
  },
  {
    location: "Sección Voice & Tone",
    purpose: "Ejemplos visuales de comunicación",
    dimensions: "800x600px",
    visualTone: "Humanizado, team",
    status: "missing" as const
  },
  {
    location: "Social Media Kit",
    purpose: "Templates listos",
    dimensions: "1080x1080px (posts), 1080x1920px (stories)",
    visualTone: "Branded, editable",
    status: "needs-reinforcement" as const
  },
  {
    location: "Email Templates",
    purpose: "Preview de correos",
    dimensions: "800px ancho",
    visualTone: "Profesional pero cálido",
    status: "needs-reinforcement" as const
  },
  {
    location: "WhatsApp Templates",
    purpose: "Ejemplos de chat",
    dimensions: "375x812px (mobile)",
    visualTone: "Conversacional",
    status: "missing" as const
  },
  {
    location: "Customer Personas",
    purpose: "Perfiles visuales",
    dimensions: "500x600px",
    visualTone: "Realista, diverso",
    status: "needs-reinforcement" as const
  },
  {
    location: "Manual de Comportamiento",
    purpose: "Situaciones de atención",
    dimensions: "1200x800px",
    visualTone: "Fotográfico real",
    status: "missing" as const
  },
  {
    location: "Packaging & Etiquetas",
    purpose: "Aplicación física",
    dimensions: "Varios",
    visualTone: "Producto real en uso",
    status: "needs-reinforcement" as const
  },
  {
    location: "Uniformes",
    purpose: "Vista previa de prenda",
    dimensions: "600x800px",
    visualTone: "Modelos reales",
    status: "missing" as const
  }
];

// Data: Visual Suggestions for Instagram
const visualSuggestionsData = {
  feedGrid: {
    pattern: [
      ["PRO", "LIF", "PRO"],
      ["TST", "VAL", "TST"],
      ["BEH", "PRO", "BEH"]
    ],
    description: "3x3 con alternancia: Producto (60%) - Lifestyle (30%) - Behind Scenes (10%)",
    colorPalette: "Primarios de marca: 60%, Neutros: 30%, Acento: 10%"
  },
  photography: {
    productOnWhite: {
      lighting: "Softbox lateral principal + fill suave",
      background: "#FFFFFF o #F5F5F5",
      angle: "45° elevado (showing depth)",
      shadows: "Suaves, no duras"
    },
    lifestyle: {
      model: "Diverso, edad 25-45",
      setting: "Uso real del producto",
      lighting: "Natural o daylight balanced",
      colors: "Coherentes con paleta de marca"
    }
  },
  typography: {
    title: {
      font: "[Font Display]",
      size: "48-72px",
      weight: "Bold/700",
      color: "Color primario o contraste alto"
    },
    body: {
      font: "[Font Body]",
      size: "18-24px",
      weight: "Regular/Medium",
      maxLength: "120 caracteres",
      color: "#333333 sobre fondos claros"
    }
  }
};

// Data: Templates
const templatesData = [
  {
    id: "instagram-post",
    name: "Post de Instagram (Cuadrado)",
    dimensions: "1080x1080px",
    type: "social" as const,
    preview: {
      header: { height: 100, content: "[Brand Logo] [•••]" },
      hero: { height: 600, content: "[Hero Image 800x600px]" },
      copy: { height: 200, content: "[Título] [Body] [Bullets]" },
      footer: { height: 100, content: "[CTA] [Hashtags]" }
    }
  },
  {
    id: "instagram-story",
    name: "Story (Vertical)",
    dimensions: "1080x1920px",
    type: "social" as const,
    preview: {
      header: { height: 50, content: "[Logo] [Mute 🔊]" },
      body: { height: 1620, content: "[Background] [Content Box 600px]" },
      footer: { height: 80, content: "[← Previous] [Next →]" }
    }
  },
  {
    id: "email-template",
    name: "Email Marketing",
    dimensions: "600px ancho",
    type: "email" as const,
    preview: {
      header: { height: 80, content: "[Logo] [View in Browser] [Unsubscribe]" },
      hero: { height: 300, content: "[Hero Image 600x300px]" },
      body: { height: 400, content: "[Preheadline] [Headline] [Body] [CTA]" },
      secondary: { height: 200, content: "[Feature Grid 2 column]" },
      footer: { height: 100, content: "[Social Links] [Contact] [Legal]" }
    }
  }
];

// Status badge component
function StatusBadge({ status }: { status: "exists" | "needs-reinforcement" | "missing" }) {
  const config = {
    exists: { label: "Existe", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: "✓" },
    "needs-reinforcement": { label: "Necesita reforzar", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", icon: "⚠" },
    missing: { label: "Falta", color: "bg-rose-500/10 text-rose-400 border-rose-500/30", icon: "✕" }
  };

  const { label, color, icon } = config[status];

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      color
    )}>
      <span>{icon}</span>
      {label}
    </span>
  );
}

// Tone Matrix Component
function ToneMatrix() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--bm-color-text-primary)]">Matriz de Tono por Canal</h3>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg border border-[var(--bm-color-border)] hover:bg-[var(--bm-color-surface-muted)]">
            <Filter className="w-4 h-4 text-[var(--bm-color-text-secondary)]" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--bm-color-border)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--bm-color-border)]">
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)]">Canal</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)]">Tono</th>
              <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)]">Formalidad</th>
              <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)]">Energía</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)]">Características</th>
            </tr>
          </thead>
          <tbody>
            {toneMatrixData.map((row, index) => (
              <tr
                key={index}
                className={cn(
                  "border-b border-[var(--bm-color-border)] hover:bg-[var(--bm-color-surface-muted)] transition-colors",
                  expandedRow === index && "bg-[var(--bm-color-surface-muted)]"
                )}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="font-medium text-[var(--bm-color-text-primary)]">{row.channel}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-[var(--bm-color-text-secondary)]">{row.tone}</td>
                <td className="p-4 text-center">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[var(--bm-color-surface-muted)] border border-[var(--bm-color-border)]">
                    {row.formality}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {row.energy === "Alta" && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--bm-color-accent)]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--bm-color-accent)]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--bm-color-accent)]" />
                      </>
                    )}
                    {row.energy === "Muy alta" && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--bm-color-accent)]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--bm-color-accent)]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--bm-color-accent)] animate-pulse" />
                      </>
                    )}
                    {row.energy === "Media" && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--bm-color-text-secondary)]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--bm-color-text-secondary)]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--bm-color-border)]" />
                      </>
                    )}
                    {row.energy === "Baja" && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--bm-color-border)]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--bm-color-border)]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--bm-color-border)]" />
                      </>
                    )}
                    {row.energy === "Variable según cliente" && (
                      <span className="text-xs text-[var(--bm-color-text-secondary)]">~</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-sm text-[var(--bm-color-text-secondary)]">{row.characteristics}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Vocabulary List Component
function VocabularyList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const allWords = [...vocabularyData.values, ...vocabularyData.emotions];

  const filteredWords = allWords.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         word.usage?.toLowerCase().includes(searchQuery.toLowerCase());
    // Handle both category (for values) and tone (for emotions)
    const category = "category" in word ? word.category : "tone" in word ? word.tone : "";
    const matchesCategory = selectedCategory === "all" || category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--bm-color-text-primary)]">Vocabulario de Marca</h3>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--bm-color-text-secondary)]" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-[var(--bm-color-border)] bg-[var(--bm-input-bg)] text-sm text-[var(--bm-color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--bm-color-focus)]/40"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            selectedCategory === "all"
              ? "bg-[var(--bm-color-accent)] text-[var(--bm-color-accent-contrast)]"
              : "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)]"
          )}
        >
          Todos ({allWords.length})
        </button>
        <button
          onClick={() => setSelectedCategory("Confianza")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            selectedCategory === "Confianza"
              ? "bg-[var(--bm-color-accent)] text-[var(--bm-color-accent-contrast)]"
              : "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)]"
          )}
        >
          Confianza ({vocabularyData.values.filter(v => v.category === "Confianza").length})
        </button>
        <button
          onClick={() => setSelectedCategory("Calidad")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            selectedCategory === "Calidad"
              ? "bg-[var(--bm-color-accent)] text-[var(--bm-color-accent-contrast)]"
              : "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)]"
          )}
        >
          Calidad ({vocabularyData.values.filter(v => v.category === "Calidad").length})
        </button>
        <button
          onClick={() => setSelectedCategory("Innovación")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            selectedCategory === "Innovación"
              ? "bg-[var(--bm-color-accent)] text-[var(--bm-color-accent-contrast)]"
              : "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)]"
          )}
        >
          Innovación ({vocabularyData.values.filter(v => v.category === "Innovación").length})
        </button>
        <button
          onClick={() => setSelectedCategory("Servicio")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            selectedCategory === "Servicio"
              ? "bg-[var(--bm-color-accent)] text-[var(--bm-color-accent-contrast)]"
              : "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)]"
          )}
        >
          Servicio ({vocabularyData.values.filter(v => v.category === "Servicio").length})
        </button>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-[var(--bm-color-border)] bg-[var(--bm-card-bg)] hover:border-[var(--bm-color-border-strong)] transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-lg font-semibold text-[var(--bm-color-accent)]">&quot;{word.word}&quot;</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)]">
                {"category" in word ? word.category : "tone" in word ? word.tone : ""}
              </span>
            </div>
            {"tone" in word && word.tone && (
              <p className="text-xs text-[var(--bm-color-text-secondary)] mb-2">Tono: {word.tone}</p>
            )}
            <p className="text-sm text-[var(--bm-color-text-secondary)]">{word.usage}</p>
          </div>
        ))}
      </div>

      {/* Brand Phrases */}
      <div className="module-section-secondary rounded-lg p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)] mb-4">
          Frases que Definen la Marca
        </h4>
        <div className="space-y-3">
          {vocabularyData.phrases.map((phrase, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bm-color-bg)] border border-[var(--bm-color-border)]"
            >
              <span className="text-[var(--bm-color-accent)]">💬</span>
              <span className="text-sm text-[var(--bm-color-text-primary)] italic">&quot;{phrase}&quot;</span>
              <button
                className="ml-auto p-1.5 rounded hover:bg-[var(--bm-color-surface-muted)] transition-colors"
                onClick={() => navigator.clipboard.writeText(phrase)}
              >
                <Copy className="w-4 h-4 text-[var(--bm-color-text-secondary)]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Differentiators */}
      <div className="module-section-secondary rounded-lg p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)] mb-4">
          Diferenciadores de Lenguaje
        </h4>
        <div className="space-y-3">
          {vocabularyData.differentiators.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[var(--bm-color-success)]" />
                  <span className="font-medium text-[var(--bm-color-text-primary)]">{item.phrase}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--bm-color-text-secondary)]">
                  <XCircle className="w-4 h-4 text-[var(--bm-color-danger)]" />
                  <span className="line-through opacity-60">{item.alternative}</span>
                </div>
              </div>
              <span className="text-xs text-[var(--bm-color-text-secondary)] italic">({item.context})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Do/Don't Table Component
function DoDontTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[var(--bm-color-text-primary)]">Frases DO y DON'T</h3>

      <div className="space-y-3">
        {doDontData.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-[var(--bm-color-border)] bg-[var(--bm-card-bg)] overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[var(--bm-color-border)] bg-[var(--bm-color-surface-muted)]">
              <span className="text-sm font-medium text-[var(--bm-color-text-primary)]">{item.context}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--bm-color-border)]">
              {/* DO */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--bm-color-success)]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-[var(--bm-color-success)]" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--bm-color-success)] mb-1 block">
                      Di esto
                    </span>
                    <p className="text-sm text-[var(--bm-color-text-secondary)] leading-relaxed">
                      {item.doExample}
                    </p>
                  </div>
                </div>
              </div>

              {/* DON'T */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--bm-color-danger)]/10 flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-[var(--bm-color-danger)]" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--bm-color-danger)] mb-1 block">
                      No esto
                    </span>
                    <p className="text-sm text-[var(--bm-color-text-secondary)] leading-relaxed line-through opacity-60">
                      {item.dontExample}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-[var(--bm-color-bg)] border-t border-[var(--bm-color-border)]">
              <p className="text-xs text-[var(--bm-color-text-secondary)]">
                <span className="font-semibold text-[var(--bm-color-accent)]">Por qué:</span> {item.why}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Image Audit Component
function ImageAudit() {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredData = filterStatus === "all"
    ? imageAuditData
    : imageAuditData.filter(item => item.status === filterStatus);

  const stats = {
    total: imageAuditData.length,
    exists: imageAuditData.filter(i => i.status === "exists").length,
    needs: imageAuditData.filter(i => i.status === "needs-reinforcement").length,
    missing: imageAuditData.filter(i => i.status === "missing").length
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--bm-color-text-primary)]">Auditoría de Imágenes</h3>

        {/* Stats */}
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {stats.exists} existen
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            {stats.needs} necesitan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            {stats.missing} faltan
          </span>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
            filterStatus === "all"
              ? "bg-[var(--bm-color-accent)] text-[var(--bm-color-accent-contrast)]"
              : "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)]"
          )}
        >
          Todos
        </button>
        <button
          onClick={() => setFilterStatus("missing")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
            filterStatus === "missing"
              ? "bg-[var(--bm-color-accent)] text-[var(--bm-color-accent-contrast)]"
              : "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)]"
          )}
        >
          Faltan
        </button>
        <button
          onClick={() => setFilterStatus("needs-reinforcement")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
            filterStatus === "needs-reinforcement"
              ? "bg-[var(--bm-color-accent)] text-[var(--bm-color-accent-contrast)]"
              : "bg-[var(--bm-color-surface-muted)] text-[var(--bm-color-text-secondary)]"
          )}
        >
          Necesitan reforzar
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--bm-color-border)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--bm-color-border)]">
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)]">Ubicación</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)]">Propósito</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)]">Dimensiones</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)]">Tono Visual</th>
              <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="border-b border-[var(--bm-color-border)] hover:bg-[var(--bm-color-surface-muted)] transition-colors"
              >
                <td className="p-4 font-medium text-[var(--bm-color-text-primary)]">{item.location}</td>
                <td className="p-4 text-sm text-[var(--bm-color-text-secondary)]">{item.purpose}</td>
                <td className="p-4 text-sm text-[var(--bm-color-text-secondary)]">
                  <code className="px-2 py-0.5 rounded bg-[var(--bm-color-bg)] text-xs">{item.dimensions}</code>
                </td>
                <td className="p-4 text-sm text-[var(--bm-color-text-secondary)]">{item.visualTone}</td>
                <td className="p-4 text-center">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Visual Suggestions Component
function VisualSuggestions() {
  const [selectedChannel, setSelectedChannel] = useState<string>("instagram");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--bm-color-text-primary)]">Sugerencias Visuales por Contexto</h3>

        <select
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[var(--bm-color-border)] bg-[var(--bm-input-bg)] text-sm text-[var(--bm-color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--bm-color-focus)]/40"
        >
          <option value="instagram">Instagram</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
          <option value="web">Sitio Web</option>
        </select>
      </div>

      {selectedChannel === "instagram" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feed Grid Pattern */}
          <div className="module-section-secondary rounded-lg p-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)] mb-4">
              Estructura del Feed Grid
            </h4>
            <div className="grid grid-cols-3 gap-1 mb-4">
              {visualSuggestionsData.feedGrid.pattern.map((row, i) => (
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={cn(
                      "aspect-square rounded flex items-center justify-center text-xs font-medium",
                      cell === "PRO" && "bg-[var(--bm-color-accent)]/20 text-[var(--bm-color-accent)]",
                      cell === "LIF" && "bg-[var(--bm-color-success)]/20 text-[var(--bm-color-success)]",
                      cell === "TST" && "bg-[var(--bm-color-danger)]/20 text-[var(--bm-color-danger)]",
                      cell === "VAL" && "bg-[var(--bm-color-purple)]/20 text-[var(--bm-color-purple)]",
                      cell === "BEH" && "bg-[var(--bm-color-blue)]/20 text-[var(--bm-color-blue)]"
                    )}
                  >
                    {cell}
                  </div>
                ))
              ))}
            </div>
            <p className="text-sm text-[var(--bm-color-text-secondary)]">{visualSuggestionsData.feedGrid.description}</p>
            <p className="text-xs text-[var(--bm-color-text-secondary)] mt-2">{visualSuggestionsData.feedGrid.colorPalette}</p>
          </div>

          {/* Photography Style */}
          <div className="module-section-secondary rounded-lg p-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)] mb-4">
              Estilo Fotográfico
            </h4>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-[var(--bm-color-bg)]">
                <h5 className="text-sm font-medium text-[var(--bm-color-text-primary)] mb-2">Producto en fondo blanco</h5>
                <ul className="space-y-1 text-sm text-[var(--bm-color-text-secondary)]">
                  <li>• Iluminación: {visualSuggestionsData.photography.productOnWhite.lighting}</li>
                  <li>• Fondo: {visualSuggestionsData.photography.productOnWhite.background}</li>
                  <li>• Ángulo: {visualSuggestionsData.photography.productOnWhite.angle}</li>
                  <li>• Sombras: {visualSuggestionsData.photography.productOnWhite.shadows}</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bm-color-bg)]">
                <h5 className="text-sm font-medium text-[var(--bm-color-text-primary)] mb-2">Lifestyle/Contexto</h5>
                <ul className="space-y-1 text-sm text-[var(--bm-color-text-secondary)]">
                  <li>• Modelo: {visualSuggestionsData.photography.lifestyle.model}</li>
                  <li>• Setting: {visualSuggestionsData.photography.lifestyle.setting}</li>
                  <li>• Iluminación: {visualSuggestionsData.photography.lifestyle.lighting}</li>
                  <li>• Colores: {visualSuggestionsData.photography.lifestyle.colors}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="module-section-secondary rounded-lg p-6 lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--bm-color-text-secondary)] mb-4">
              Tipografía para Posts
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[var(--bm-color-bg)]">
                <h5 className="text-sm font-medium text-[var(--bm-color-text-primary)] mb-3">Títulos</h5>
                <ul className="space-y-2 text-sm text-[var(--bm-color-text-secondary)]">
                  <li>• Fuente: {visualSuggestionsData.typography.title.font}</li>
                  <li>• Tamaño: {visualSuggestionsData.typography.title.size}</li>
                  <li>• Peso: {visualSuggestionsData.typography.title.weight}</li>
                  <li>• Color: {visualSuggestionsData.typography.title.color}</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-[var(--bm-color-bg)]">
                <h5 className="text-sm font-medium text-[var(--bm-color-text-primary)] mb-3">Body/Copy</h5>
                <ul className="space-y-2 text-sm text-[var(--bm-color-text-secondary)]">
                  <li>• Fuente: {visualSuggestionsData.typography.body.font}</li>
                  <li>• Tamaño: {visualSuggestionsData.typography.body.size}</li>
                  <li>• Peso: {visualSuggestionsData.typography.body.weight}</li>
                  <li>• Longitud máx: {visualSuggestionsData.typography.body.maxLength}</li>
                  <li>• Color: {visualSuggestionsData.typography.body.color}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Templates Component
function TemplateGallery() {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templatesData[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--bm-color-text-primary)]">Plantillas de Ejecución Visual</h3>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bm-color-accent)] text-[var(--bm-color-accent-contrast)] hover:brightness-110 transition-all">
          <Download className="w-4 h-4" />
          Exportar todas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templatesData.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className="cursor-pointer rounded-lg border border-[var(--bm-color-border)] bg-[var(--bm-card-bg)] hover:border-[var(--bm-color-border-strong)] transition-all overflow-hidden"
          >
            <div className="p-4 border-b border-[var(--bm-color-border)] bg-[var(--bm-color-surface-muted)]">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-[var(--bm-color-text-primary)]">{template.name}</h4>
                <span className="text-xs text-[var(--bm-color-text-secondary)]">{template.dimensions}</span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {Object.entries(template.preview).map(([section, config]: [string, { height: string; content: string }]) => (
                <div key={section} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-sm"
                      style={{ backgroundColor: section === 'hero' ? '#E1306C' : '#71717A' }}
                    />
                    <span className="text-xs font-medium uppercase text-[var(--bm-color-text-secondary)]">{section}</span>
                    <span className="text-xs text-[var(--bm-color-text-secondary)]">({config.height})</span>
                  </div>
                  <p className="text-xs text-[var(--bm-color-text-secondary)] pl-4">{config.content}</p>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-[var(--bm-color-bg)] border-t border-[var(--bm-color-border)]">
              <button className="w-full flex items-center justify-center gap-2 text-sm text-[var(--bm-color-accent)] hover:underline">
                <Copy className="w-4 h-4" />
                Copiar especificaciones
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Detail Modal would go here */}
    </div>
  );
}

// Tab button component
function TabButton({ tab, isActive, onClick }: { tab: Tab; isActive: boolean; onClick: () => void }) {
  const Icon = tab.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
        "hover:bg-[var(--bm-color-surface-muted)]",
        isActive && "bg-[var(--bm-color-surface-muted)] border border-[var(--bm-color-border)]"
      )}
    >
      <Icon className={cn(
        "w-5 h-5",
        isActive ? "text-[var(--bm-color-accent)]" : "text-[var(--bm-color-text-secondary)]"
      )} />
      <div className="text-left">
        <div className={cn(
          "text-sm font-medium",
          isActive ? "text-[var(--bm-color-text-primary)]" : "text-[var(--bm-color-text-secondary)]"
        )}>
          {tab.label}
        </div>
        <div className="text-xs text-[var(--bm-color-text-secondary)]">{tab.description}</div>
      </div>
      <ChevronRight className={cn(
        "w-4 h-4 text-[var(--bm-color-text-secondary)] transition-transform",
        isActive && "rotate-90"
      )} />
    </button>
  );
}

// Main Component
export default function VoiceToneWorkspace() {
  const [activeTab, setActiveTab] = useState<TabId>("matrix");

  const tabs: Tab[] = [
    { id: "matrix", label: "Matriz de Tono", icon: MessageSquare, description: "Canal × Características" },
    { id: "vocabulary", label: "Vocabulario", icon: BookOpen, description: "Palabras y frases clave" },
    { id: "dodont", label: "DO y DON'T", icon: CheckCircle2, description: "Ejemplos prácticos" },
    { id: "audit", label: "Auditoría", icon: ImageIcon, description: "Estado de imágenes" },
    { id: "suggestions", label: "Sugerencias", icon: Lightbulb, description: "Guías visuales" },
    { id: "templates", label: "Plantillas", icon: LayoutTemplate, description: "Templates exportables" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)]">
      {/* Header */}
      <div className="border-b border-[var(--bm-color-border)] bg-[var(--bm-color-surface)]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-8 h-8 text-[var(--bm-color-accent)]" />
                <h1 className="text-3xl font-semibold tracking-tight">Voice & Tone</h1>
              </div>
              <p className="text-[var(--bm-color-text-secondary)] max-w-2xl">
                Guía centralizada de comunicación de marca. Define cómo suena la marca en cada punto de contacto y proporciona ejemplos prácticos para equipos de marketing, atención al cliente y community managers.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="module-section-secondary rounded-lg p-4 max-w-xs">
                <div className="text-xs text-[var(--bm-color-text-secondary)] mb-2">Alimenta a</div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-[var(--bm-color-surface-muted)] border border-[var(--bm-color-border)]">Social Media Kit</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[var(--bm-color-surface-muted)] border border-[var(--bm-color-border)]">Email Templates</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[var(--bm-color-surface-muted)] border border-[var(--bm-color-border)]">Soporte</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            {activeTab === "matrix" && <ToneMatrix />}
            {activeTab === "vocabulary" && <VocabularyList />}
            {activeTab === "dodont" && <DoDontTable />}
            {activeTab === "audit" && <ImageAudit />}
            {activeTab === "suggestions" && <VisualSuggestions />}
            {activeTab === "templates" && <TemplateGallery />}
          </main>
        </div>
      </div>
    </div>
  );
}
