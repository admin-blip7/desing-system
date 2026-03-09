// TEXT_FLOW - Modulos de texto basados en contenido narrativo
// Para: brandStory, brandPhilosophy, voiceTone, missionVision, values, tagline, messaging, brandName

class TextContext {
  module_key string
  module_name string
  brand_context BrandContext
  personality_profile PersonalityProfile
  user_answers map<string, string>
  tone_profile string
}

class TextModuleOutput {
  title string
  content string
  variations string[]
  examples string[]
  guidelines string[]
}

class BuyerPersona {
  name string
  role string
  age string
  location string
  income string
  goals string
  pain_points string
  motivations string
  objections string
  quote string
}

class CustomerPersonasOutput {
  title string
  personas BuyerPersona[]
  ideal_client_suggestions string[]
  acquisition_channels string[]
}

function GenerateTextModule(input: TextContext) -> TextModuleOutput {
  client CustomGPT5Mini

  prompt #"
You are a brand strategy expert specializing in verbal identity and storytelling.

Generate content for the "{{ input.module_name }}" module of "{{ input.brand_context.name }}".

## Brand Context
- Industry: {{ input.brand_context.industry }}
- Offering: {{ input.brand_context.offering }}

## Brand Personality
- Archetype: {{ input.personality_profile.archetype }}
- DNA: {{ input.personality_profile.dna }}
- Philosophy: {{ input.personality_profile.philosophy }}

## User Input
{% for key, value in input.user_answers %}
{{ key }}: {{ value }}
{% endfor %}

## Task
Generate comprehensive {{ input.module_name }} content that:
1. Aligns with the {{ input.personality_profile.archetype }} archetype
2. Reflects the brand DNA: {{ input.personality_profile.dna }}
3. Provides clear guidelines for consistent application
4. Includes practical examples

Return JSON with title, main content, variations, examples, and guidelines.
"#
}

function GenerateCustomerPersonas(input: TextContext) -> CustomerPersonasOutput {
  client CustomGPT5Mini

  prompt #"
You are a senior customer research and brand strategy specialist.

Generate complete Buyer Personas for "{{ input.brand_context.name }}".

## Brand Context
- Module: {{ input.module_name }} ({{ input.module_key }})
- Industry: {{ input.brand_context.industry }}
- Offering: {{ input.brand_context.offering }}

## Brand Personality
- Archetype: {{ input.personality_profile.archetype }}
- DNA: {{ input.personality_profile.dna }}
- Philosophy: {{ input.personality_profile.philosophy }}

## User Input
{% for key, value in input.user_answers %}
{{ key }}: {{ value }}
{% endfor %}

## Task
Return 3 to 5 realistic buyer personas with practical detail for sales and marketing execution.
Each persona must include:
- Demographics: age, location, income, professional role
- Goals: what they want to achieve with this brand/product
- Pain points: current frustrations and blockers
- Objections: barriers to purchase
- Motivations and one representative quote

Also include:
1. ideal_client_suggestions: concrete profiles to target first (who to look for and why)
2. acquisition_channels: where these personas are most likely to be found

Output must be valid JSON strictly matching CustomerPersonasOutput.
"#
}

test test_brand_story {
  functions [GenerateTextModule]
  args {
    module_key "brandStory"
    module_name "Brand Story"
    brand_context {
      name "TechStartup"
      personality_id "innovator"
      industry "Technology"
      offering "AI Platform"
    }
    personality_profile {
      id "innovator"
      name "The Innovator"
      archetype "Magician"
      tagline "Making the impossible possible"
      philosophy "We transform reality through innovation"
      key_principles ["Vision", "Innovation", "Excellence"]
      dna "Bold, Visionary, Disruptive"
    }
    user_answers {
      "founded" "2020"
      "founders" "Jane Doe and John Smith"
      "milestone" "First AI breakthrough"
    }
    tone_profile "Inspiring and authoritative"
  }
}

test test_customer_personas {
  functions [GenerateCustomerPersonas]
  args {
    module_key "customerPersonas"
    module_name "Customer Personas"
    brand_context {
      name "TechStartup"
      personality_id "innovator"
      industry "Technology"
      offering "AI Platform"
    }
    personality_profile {
      id "innovator"
      name "The Innovator"
      archetype "Magician"
      tagline "Making the impossible possible"
      philosophy "We transform reality through innovation"
      key_principles ["Vision", "Innovation", "Excellence"]
      dna "Bold, Visionary, Disruptive"
    }
    user_answers {
      "product_type" "B2B SaaS"
      "target_region" "Mexico and LATAM"
    }
    tone_profile "Strategic and practical"
  }
}
