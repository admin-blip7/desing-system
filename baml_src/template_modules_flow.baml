// TEMPLATE_FLOW - Modulos de plantillas
// Para: emailTemplates, slideTemplates, socialTemplates, documentTemplates

class TemplateContext {
  template_key string
  template_name string
  template_type string
  brand_context BrandContext
  personality_profile PersonalityProfile
  user_answers map<string, string>
}

class TemplateField {
  field_name string
  field_type string
  description string
  required bool
}

class TemplateOutput {
  template_name string
  description string
  use_cases string[]
  structure string
  fields TemplateField[]
  example_content string
  customization_guidelines string[]
}

function GenerateTemplateModule(input: TemplateContext) -> TemplateOutput {
  client CustomGPT5Mini

  prompt #"
You are a brand communications expert specializing in template design.

Generate a "{{ input.template_name }}" template for "{{ input.brand_context.name }}".

## Brand Context
- Industry: {{ input.brand_context.industry }}
- Personality: {{ input.personality_profile.archetype }}
- DNA: {{ input.personality_profile.dna }}

## User Requirements
{% for key, value in input.user_answers %}
{{ key }}: {{ value }}
{% endfor %}

## Task
Create a comprehensive template specification:
1. Template structure and layout
2. All editable fields with types and descriptions
3. Example content showing proper usage
4. Guidelines for customization while maintaining brand consistency

Return JSON with complete template specification.
"#
}

test test_email_template {
  functions [GenerateTemplateModule]
  args {
    template_key "emailTemplates"
    template_name "Newsletter Email"
    template_type "email"
    brand_context {
      name "MediaCo"
      personality_id "jester"
      industry "Media"
      offering "Entertainment"
    }
    personality_profile {
      id "jester"
      name "The Jester"
      archetype "Jester"
      tagline "Life's a party"
      philosophy "Joy and entertainment"
      key_principles ["Fun", "Creativity", "Surprise"]
      dna "Playful, Bold, Dynamic"
    }
    user_answers {
      "frequency" "Weekly"
      "audience" "Gen Z and Millennials"
    }
  }
}
