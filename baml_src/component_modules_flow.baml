// COMPONENT_FLOW - Modulos de componentes UI
// Para: buttons, forms, cards, navigation, tables, alerts, modals, badges, tabs, accordion, dropdown, tooltip

class ComponentContext {
  component_key string
  component_name string
  brand_context BrandContext
  personality_profile PersonalityProfile
  design_tokens map<string, string>
}

class ComponentVariant {
  name string
  description string
  use_case string
  properties map<string, string>
}

class ComponentModuleOutput {
  component_name string
  description string
  anatomy string
  variants ComponentVariant[]
  states string[]
  accessibility_guidelines string[]
  code_example string
}

function GenerateComponentModule(input: ComponentContext) -> ComponentModuleOutput {
  client CustomGPT5Mini

  prompt #"
You are a design system expert specializing in component design.

Generate specifications for the "{{ input.component_name }}" component for "{{ input.brand_context.name }}".

## Brand Context
- Industry: {{ input.brand_context.industry }}
- Personality: {{ input.personality_profile.archetype }}

## Available Design Tokens
{% for key, value in input.design_tokens %}
{{ key }}: {{ value }}
{% endfor %}

## Task
Create comprehensive component documentation:
1. Component anatomy and structure
2. All variants with use cases
3. Interactive states (hover, active, focus, disabled)
4. Accessibility requirements (WCAG compliance)
5. Code example following best practices

Return JSON with complete component specifications.
"#
}

test test_button_component {
  functions [GenerateComponentModule]
  args {
    component_key "buttons"
    component_name "Button"
    brand_context {
      name "TechApp"
      personality_id "hero"
      industry "Technology"
      offering "Productivity software"
    }
    personality_profile {
      id "hero"
      name "The Hero"
      archetype "Hero"
      tagline "You can do it"
      philosophy "Empowering users to achieve"
      key_principles ["Competence", "Courage", "Excellence"]
      dna "Confident, Reliable, Bold"
    }
    design_tokens {
      "primary" "#0066FF"
      "radius" "8px"
      "font" "Inter, sans-serif"
    }
  }
}
