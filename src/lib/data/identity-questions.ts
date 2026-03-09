/**
 * Identity Questionnaire Data
 * Questions for the design identity generation flow
 * Extends the onboarding question structure
 */

import type { Question } from "@/lib/data/onboarding";

// Re-export Question type for convenience
export type { Question };

// ============================================================================
// Identity Questionnaire Steps
// ============================================================================

export interface IdentityQuestionStep {
    id: string;
    name: string;
    description?: string;
    questions: Question[];
}

// ============================================================================
// Base Questions (Always Shown)
// ============================================================================

const brandFoundationQuestions: Question[] = [
    {
        q: "¿Cuál es el nombre de tu marca/negocio?",
        type: "text",
        key: "brand_name",
        required: true,
        example: "22 Electronic",
    },
    {
        q: "¿Tienes un slogan o tagline?",
        type: "text",
        key: "tagline",
        required: false,
        example: "Tecnología al alcance de todos",
    },
    {
        q: "¿En qué industria/sector operas?",
        type: "select",
        key: "industry",
        required: true,
        options: [
            "Electrónica/Tecnología",
            "Moda/Ropa",
            "Alimentos/Restaurante",
            "Salud/Bienestar",
            "Servicios Profesionales",
            "Educación",
            "Construcción",
            "Automotriz",
            "Belleza/Cosméticos",
            "Finanzas",
            "Entretenimiento",
            "Deportes",
            "Arte/Diseño",
            "Otro",
        ],
    },
    {
        q: "Describe qué hace tu marca en una frase",
        type: "textarea",
        key: "brand_description",
        required: true,
        example: "Venta de celulares, accesorios, reparaciones y créditos",
    },
];

const identityCustomizationQuestions: Question[] = [
    {
        q: "¿Qué tan audaz debe ser tu identidad?",
        type: "range",
        key: "intensity_level",
        required: true,
    },
    {
        q: "¿Qué rasgos quieres enfatizar en tu marca?",
        type: "multi-select",
        key: "emphasized_traits",
        required: true,
        options: [
            "Innovación",
            "Confianza",
            "Velocidad",
            "Sostenibilidad",
            "Elegancia",
            "Diversión",
            "Sencillez",
            "Audacia",
            "Tradición",
            "Creatividad",
        ],
    },
    {
        q: "¿Hay marcas que admires? (menciona hasta 3)",
        type: "tags",
        key: "reference_brands",
        required: false,
        example: "Apple, Nike, Spotify",
    },
    {
        q: "¿Qué palabras clave definen tu marca?",
        type: "tags",
        key: "custom_keywords",
        required: true,
        example: "Tecnología, Accesibilidad, Confianza",
    },
];

const targetAudienceQuestions: Question[] = [
    {
        q: "¿Quién es tu cliente principal?",
        type: "textarea",
        key: "audience_description",
        required: true,
        example:
            "Personas de 25-45 años de nivel socioeconómico medio que buscan celulares de buena calidad",
    },
    {
        q: "¿Rango de edad de tus clientes?",
        type: "select",
        key: "audience_age_range",
        required: true,
        options: [
            "Menos de 18 años",
            "18-24 años",
            "25-34 años",
            "35-44 años",
            "45-54 años",
            "55-64 años",
            "65 años o más",
            "Todas las edades",
        ],
    },
    {
        q: "¿Nivel profesional de tu audiencia?",
        type: "multi-select",
        key: "audience_professional_level",
        required: true,
        options: [
            "Estudiantes",
            "Junior/Entry-level",
            "Mid-level",
            "Senior/Executives",
            "Emprendedores",
            "Dueños de negocio",
        ],
    },
];

const visualPreferencesQuestions: Question[] = [
    {
        q: "¿Qué tipo de paleta de colores prefieres?",
        type: "select",
        key: "color_palette_preference",
        required: true,
        options: [
            "Monocromática (un color + variantes)",
            "Análoga (colores adyacentes)",
            "Complementaria (colores opuestos)",
            "Tríadica (3 colores equidistantes)",
            "Vibrante/COLORIDA",
            "Neutra/Tierra",
            "Déjame sugerir basado en mi personalidad",
        ],
    },
    {
        q: "¿Qué estilo de tipografía prefieres?",
        type: "select",
        key: "typography_preference",
        required: true,
        options: [
            "Sans-serif moderna (limpia, digital)",
            "Serif elegante (tradicional, editorial)",
            "Display/Decorativa (única, llamativa)",
            "Monospace (técnica, industrial)",
            "Mixta (combinación)",
            "Déjame sugerir basado en mi personalidad",
        ],
    },
    {
        q: "¿Tienes materiales de inspiración?",
        type: "textarea",
        key: "uploaded_inspirations",
        required: false,
        example: "Links a sitios, screenshots, o descripciones de estilos que te gustan",
    },
];

const applicationContextQuestions: Question[] = [
    {
        q: "¿Dónde vivirá tu identidad principalmente?",
        type: "multi-select",
        key: "primary_touchpoints",
        required: true,
        options: [
            "Sitio web / App",
            "Redes sociales",
            "Materiales impresos",
            "Empaquetado de producto",
            "Email marketing",
            "Tienda física",
            "Soporte al cliente",
            "Entrega de producto",
        ],
    },
    {
        q: "¿Qué es más importante para tu caso de uso?",
        type: "select",
        key: "primary_goal",
        required: true,
        options: [
            "consistencia",
            "flexibilidad",
            "velocidad",
        ],
    },
];

// ============================================================================
// Additional Questions by Identity Type (Conditional)
// ============================================================================

const luxuryAdditionalQuestions: Question[] = [
    {
        q: "¿Qué posición de precio tienes?",
        type: "select",
        key: "price_positioning",
        required: true,
        options: [
            "Premium lujo (alto-alto)",
            "Premium medio (alto-medio)",
            "Accesible lujo (medio-alto)",
            "Masivo premium",
        ],
    },
];

const techAdditionalQuestions: Question[] = [
    {
        q: "¿Qué plataforma/tecnología usas principalmente?",
        type: "multi-select",
        key: "tech_stack",
        required: false,
        options: [
            "Web (React/Vue/Next)",
            "Mobile (iOS/Android)",
            "Desktop",
            "SaaS/B2B",
            "E-commerce",
            "AI/ML",
        ],
    },
];

const productAdditionalQuestions: Question[] = [
    {
        q: "¿Qué tipo de empaquetado usas?",
        type: "multi-select",
        key: "packaging_type",
        required: false,
        options: [
            "Caja personalizada",
            "Empaque ecológico",
            "Empaque minimal",
            "Etiquetas/stickers",
            "Sin empaquetado (digital)",
        ],
    },
];

// ============================================================================
// Full Question Sets
// ============================================================================

export const identityQuestionnaireSteps: IdentityQuestionStep[] = [
    {
        id: "brand-foundation",
        name: "Fundamento de Marca",
        description: "Información básica sobre tu negocio",
        questions: brandFoundationQuestions,
    },
    {
        id: "identity-customization",
        name: "Personalización de Identidad",
        description: "Ajusta la personalidad seleccionada a tu marca",
        questions: identityCustomizationQuestions,
    },
    {
        id: "target-audience",
        name: "Público Objetivo",
        description: "¿Quién es tu cliente ideal?",
        questions: targetAudienceQuestions,
    },
    {
        id: "visual-preferences",
        name: "Preferencias Visuales",
        description: "Define la dirección visual de tu marca",
        questions: visualPreferencesQuestions,
    },
    {
        id: "application-context",
        name: "Contexto de Aplicación",
        description: "¿Dónde se usará tu identidad?",
        questions: applicationContextQuestions,
    },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get additional questions based on selected identity
 */
export const getAdditionalQuestionsForIdentity = (
    identityId: string
): Question[] => {
    switch (identityId) {
        case "apple":
        case "polestar":
        case "bang-olufsen":
            return luxuryAdditionalQuestions;
        case "linear":
        case "nothing":
        case "teenage-engineering":
            return techAdditionalQuestions;
        default:
            return [];
    }
};

/**
 * Get total steps including conditional questions
 */
export const getTotalStepsForIdentity = (identityId: string): number => {
    const baseSteps = identityQuestionnaireSteps.length;
    const additionalQuestions = getAdditionalQuestionsForIdentity(identityId);
    return additionalQuestions.length > 0 ? baseSteps + 1 : baseSteps;
};

/**
 * Get step name by index
 */
export const getStepName = (index: number): string => {
    return identityQuestionnaireSteps[index]?.name || `Paso ${index + 1}`;
};

/**
 * Map select option values to enum values
 */
export const mapTouchpointValue = (value: string): string => {
    const mapping: Record<string, string> = {
        "Sitio web / App": "website-app",
        "Redes sociales": "social-media",
        "Materiales impresos": "physical-print",
        "Empaquetado de producto": "product-packaging",
        "Email marketing": "email-marketing",
        "Tienda física": "physical-store",
        "Soporte al cliente": "customer-support",
        "Entrega de producto": "product-delivery",
    };
    return mapping[value] || value;
};
