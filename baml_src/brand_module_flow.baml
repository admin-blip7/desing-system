// Flow para generar modulos del brand manual
// Sintaxis basada en resume.baml que funciona correctamente

// Clases de entrada
class BrandContext {
  name string
  personality_id string
  industry string
  offering string
}

class PersonalityProfile {
  id string
  name string
  archetype string
  tagline string
  philosophy string
  key_principles string[]
  dna string
}

class BrandModuleInput {
  module_key string
  module_name string
  brand_context BrandContext
  personality_profile PersonalityProfile
  user_answers map<string, string>
}

// Clases de salida
class BrandModuleSection {
  heading string
  content string
  examples string[]
}

class BrandModuleOutput {
  title string
  description string
  body string
  sections BrandModuleSection[]
}

// Funcion principal de generacion
function GenerateBrandModule(input: BrandModuleInput) -> BrandModuleOutput {
  client CustomGPT5Mini

  prompt #"
Eres un experto en estrategia de marca y desarrollo de brand manuals.

Genera contenido completo para el modulo "{{ input.module_name }}" de la marca "{{ input.brand_context.name }}".

## Contexto de la Marca
- Industria: {{ input.brand_context.industry }}
- Oferta: {{ input.brand_context.offering }}
- ID Personalidad: {{ input.brand_context.personality_id }}

## Personalidad de Marca
- Arquetipo: {{ input.personality_profile.archetype }}
- DNA: {{ input.personality_profile.dna }}
- Filosofia: {{ input.personality_profile.philosophy }}
- Principios clave: {{ input.personality_profile.key_principles }}

## Respuestas del Usuario
{% for key, value in input.user_answers %}
- {{ key }}: {{ value }}
{% endfor %}

Genera contenido estructurado que incluya:
1. Titulo descriptivo
2. Breve descripcion del proposito del modulo
3. Cuerpo principal con lineamientos detallados
4. Secciones organizadas por topicos relevantes
5. Ejemplos practicos cuando aplique

IMPORTANTE: Retorna un objeto JSON valido con la estructura BrandModuleOutput.
No incluyas markdown ni texto extra fuera del JSON.
"#
}

// Test para TEXT_FLOW
test test_text_flow {
  functions [GenerateBrandModule]
  args {
    module_key "brandStory"
    module_name "Brand Story"
    brand_context {
      name "TechBrand"
      personality_id "innovator"
      industry "Technology"
      offering "SaaS platform"
    }
    personality_profile {
      id "innovator"
      name "The Innovator"
      archetype "Magician"
      tagline "Transforming reality through technology"
      philosophy "We believe in pushing boundaries"
      key_principles ["Innovation", "Excellence", "Impact"]
      dna "Bold, Visionary, Disruptive"
    }
    user_answers {
      "founding_year" "2020"
      "mission" "Democratize AI"
    }
  }
}
