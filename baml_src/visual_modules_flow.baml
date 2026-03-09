// VISUAL_FLOW - Modulos de identidad visual
// Para: logo, colorPalette, geometry, illustration, iconography, qrCodes, typography

class VisualContext {
  module_key string
  module_name string
  brand_context BrandContext
  personality_profile PersonalityProfile
  user_answers map<string, string>
  visual_style string
  generation_mode string  // "questions" or "auto"
}

class ColorSpec {
  hex string
  rgb string
  name string
  usage string
}

class LogoVariation {
  type string
  description string
  use_case string
}

class GeometrySpec {
  shape_type string
  description string
  usage string
  color string
}

class PatternSpec {
  name string
  description string
  style string
}

class GeometryOutput {
  title string
  description string
  base_shapes GeometrySpec[]
  patterns PatternSpec[]
  dos string[]
  donts string[]
  guidelines string[]
}

class VisualModuleOutput {
  title string
  description string
  specifications map<string, string>
  colors ColorSpec[]
  variations LogoVariation[]
  dos string[]
  donts string[]
  examples string[]
}

function GenerateVisualModule(input: VisualContext) -> VisualModuleOutput {
  client CustomGPT5Mini

  prompt #"
You are a brand identity expert specializing in visual systems.

Generate visual guidelines for "{{ input.module_name }}" for "{{ input.brand_context.name }}".

## Brand Context
- Industry: {{ input.brand_context.industry }}
- Offering: {{ input.brand_context.offering }}

## Brand Personality
- Archetype: {{ input.personality_profile.archetype }}
- DNA: {{ input.personality_profile.dna }}

## User Preferences
{% for key, value in input.user_answers %}
{{ key }}: {{ value }}
{% endfor %}

## Task
Create comprehensive {{ input.module_name }} guidelines including:
1. Detailed specifications with technical requirements
2. Color palette with HEX, RGB, and usage guidelines
3. Variations and when to use each
4. Clear DOs and DON'Ts
5. Practical examples

Return JSON following the VisualModuleOutput structure.
"#
}

test test_color_palette {
  functions [GenerateVisualModule]
  args {
    module_key "colorPalette"
    module_name "Color Palette"
    brand_context {
      name "EcoBrand"
      personality_id "caregiver"
      industry "Sustainability"
      offering "Eco products"
    }
    personality_profile {
      id "caregiver"
      name "The Caregiver"
      archetype "Caregiver"
      tagline "We care for you and the planet"
      philosophy "Compassionate sustainability"
      key_principles ["Care", "Trust", "Sustainability"]
      dna "Warm, Nurturing, Authentic"
    }
    user_answers {
      "preference" "Nature inspired"
      "mood" "Calm and trustworthy"
    }
    visual_style "Organic and minimal"
  }
}

function GenerateGeometryWithQuestions(input: VisualContext) -> GeometryOutput {
  client CustomGPT5Mini

  prompt #"
You are a brand identity expert specializing in geometric shape systems.

Generate geometric shape guidelines for "{{ input.brand_context.name }}" based on user input.

## Brand Context
- Industry: {{ input.brand_context.industry }}
- Offering: {{ input.brand_context.offering }}

## Brand Personality
- Archetype: {{ input.personality_profile.archetype }}
- DNA: {{ input.personality_profile.dna }}

## User Preferences
{% for key, value in input.user_answers %}
{{ key }}: {{ value }}
{% endfor %}

## Task
Create comprehensive geometry guidelines based on the user's answers:
1. Base shapes: Define circle, square, triangle, rectangle, polygon variations
2. Patterns: Define repetition patterns, textures, decorative elements
3. DOs: Clear rules for using shapes correctly
4. DON'Ts: Clear rules for what to avoid
5. Guidelines: Technical usage instructions

Return JSON following the GeometryOutput structure.
"#
}

function GenerateGeometryAuto(input: VisualContext) -> GeometryOutput {
  client CustomGPT5Mini

  prompt #"
You are a brand identity expert specializing in geometric shape systems.

Generate geometric shape guidelines for "{{ input.brand_context.name }}" automatically based on the brand's existing identity.

## Brand Context
- Industry: {{ input.brand_context.industry }}
- Offering: {{ input.brand_context.offering }}

## Brand Personality
- Archetype: {{ input.personality_profile.archetype }}
- DNA: {{ input.personality_profile.dna }}

## Task
Based on the brand personality and context, automatically create a geometric shape system that complements the brand identity. Consider:
1. Base shapes that match the personality (e.g., rounded for warm/caregiver, sharp for authoritative/leader)
2. Patterns and textures that enhance the visual identity
3. Clear usage guidelines
4. DOs and DON'Ts

Return JSON following the GeometryOutput structure.
"#
}
