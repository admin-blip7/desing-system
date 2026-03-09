
export type QuestionType = "text" | "textarea" | "select" | "multi-select" | "tags" | "range" | "file" | "conditional";

export interface Question {
    q: string;
    type: QuestionType;
    key: string;
    required?: boolean;
    example?: string;
    options?: string[];
    condition?: string;
    followUp?: {
        condition: string;
        q: string;
        type: QuestionType;
        key: string;
    };
}

export interface OnboardingStep {
    id: string;
    name: string;
    questions: Question[];
}

export const onboardingSteps: OnboardingStep[] = [
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
];
