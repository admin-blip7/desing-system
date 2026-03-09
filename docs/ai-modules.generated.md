# AI Module Contracts (Generated)

Generated at: 2026-02-12T08:24:15.878Z

Este documento se genera automáticamente desde los manifiestos exportados por cada workspace de agente.

## Brand Consistency Validator (`brand-consistency-validator`)

Valida la consistencia transversal entre estrategia, visual, copy y tono.

- Prompt version: `1.0.0`
- Input contract:
  - `strategy.*`
  - `visualIdentity.*`
  - `copywriting.*`
  - `tone.*`
- Output contract:
  - `passed`
  - `score`
  - `issues[]`
  - `recommendations[]`

## Brand Strategy Agent (`brand-strategy`)

Define posicionamiento, misión, visión, valores y diferenciadores de marca.

- Prompt version: `1.0.0`
- Input contract:
  - `brief.brandName`
  - `brief.industry`
  - `brief.audience`
  - `brief.goals`
  - `brief.personality`
- Output contract:
  - `brandEssence`
  - `positioningStatement`
  - `mission`
  - `vision`
  - `values[]`
  - `differentiators[]`

## Competitive Research Module (`competitive-research`)

Analiza competencia, oportunidades de whitespace y riesgos estratégicos.

- Prompt version: `1.0.0`
- Input contract:
  - `brief.*`
  - `strategy.brandEssence`
  - `strategy.values[]`
  - `strategy.differentiators[]`
- Output contract:
  - `competitorInsights[]`
  - `whitespaceOpportunities[]`
  - `strategicRisks[]`

## Copywriting Agent (`copywriting`)

Produce activos de copy por canal consistentes con estrategia e identidad visual.

- Prompt version: `1.0.0`
- Input contract:
  - `brief.*`
  - `strategy.*`
  - `visual.colorPalette`
  - `visual.iconographySystem`
- Output contract:
  - `tagline`
  - `elevatorPitch`
  - `voicePillars[]`
  - `messagingByChannel[]`

## Tone Analysis Engine (`tone-analysis`)

Evalúa el tono dominante del copy y recomienda ajustes para coherencia de marca.

- Prompt version: `1.0.0`
- Input contract:
  - `copy.tagline`
  - `copy.elevatorPitch`
  - `copy.messagingByChannel[]`
- Output contract:
  - `dominantTone`
  - `scores`
  - `recommendations[]`

## Visual Identity Agent (`visual-identity`)

Genera sistema visual (color, tipografía, logo e iconografía) alineado con estrategia.

- Prompt version: `1.0.0`
- Input contract:
  - `brief.*`
  - `strategy.*`
  - `research.competitorInsights[]`
  - `research.whitespaceOpportunities[]`
- Output contract:
  - `colorPalette`
  - `typography`
  - `logoDirections[]`
  - `iconographySystem`
