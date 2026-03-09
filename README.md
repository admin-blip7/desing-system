# Brand Manual App

Plataforma open source para construir **sistemas de diseño y manuales de marca empresariales** asistidos por IA.

El objetivo es que empresas puedan pasar de ideas de marca a un sistema aplicable en web, producto, marketing, operaciones y soporte, todo en un flujo modular y versionable.

## Que Es Este Proyecto

`brand-manual-app` es un **Brand OS**: una app en Next.js que combina onboarding de marca, generación por módulos, edición colaborativa y exportación.

Capacidades actuales:

- Onboarding estructurado de marca y personalidad.
- 55 módulos organizados en 7 fases.
- Generación de contenido con IA (BAML + OpenAI).
- Edición de workspaces por módulo.
- Exportación `PDF`, `HTML`, `Markdown`.
- Compartición pública por token.

## Para Quien Es

- Equipos de diseño que necesitan estandarizar identidad/UI.
- Equipos de marketing que requieren consistencia multi-canal.
- Equipos de producto que quieren tokens y guías reutilizables.
- Consultoras/agencias que construyen brand systems para clientes B2B.

## Estado Actual

La base funcional ya existe, pero el sistema aún está en etapa de consolidación hacia producción.

Estado resumido:

- Core funcional: onboarding, módulos, preview, export.
- Pendiente: hardening, cobertura de tests, consistencia total entre módulos y rutas.
- Gran oportunidad comunitaria: cerrar fases incompletas y elevar calidad productiva.

Roadmap comunitario completo: [COMMUNITY_ROADMAP.md](./COMMUNITY_ROADMAP.md)

## Arquitectura Rapida

- App Router: `src/app/**`
- UI/workspaces: `src/components/**`
- Dominio de módulos/fases: `src/lib/data/**`
- IA y orquestación: `src/lib/ai/**`, `src/actions/**`
- Persistencia/auth: `src/lib/supabase/**`
- Exportadores: `src/lib/exporters/**`

Documentación técnica extensa:

- [Contribución](./CONTRIBUTING.md)
- [Roadmap de comunidad](./COMMUNITY_ROADMAP.md)
- [Playbook técnico](./docs/COMMUNITY_PLAYBOOK.md)

## Stack

- `next@16`
- `react@19`
- `typescript@5`
- `tailwindcss@4`
- `supabase`
- `@boundaryml/baml`
- `openai`

## Quick Start

1. Instala dependencias:

```bash
npm install
```

2. Configura variables:

```bash
cp .env.example .env.local
```

3. Corre la app:

```bash
npm run dev
```

Abre: [http://localhost:3000](http://localhost:3000)

Variables mínimas:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
OPENAI_TEXT_MODEL=gpt-5-mini
AI_PROVIDER=openai
```

## Seguridad Para Colaboradores

- Nunca subas `.env.local` ni credenciales reales.
- Usa solo placeholders en docs (`<YOUR_API_KEY>`).
- No incluyas dumps de datos privados o archivos temporales locales.
- Si detectas una exposición, abre issue de seguridad inmediatamente.

## Como Ayudar a Terminar el Sistema

1. Elige un frente en [COMMUNITY_ROADMAP.md](./COMMUNITY_ROADMAP.md).
2. Sigue la guía en [CONTRIBUTING.md](./CONTRIBUTING.md).
3. Usa el playbook técnico: [docs/COMMUNITY_PLAYBOOK.md](./docs/COMMUNITY_PLAYBOOK.md).
4. Abre PR pequeño, con evidencia de verificación.

## Enlaces

- Repositorio: [admin-blip7/desing-system](https://github.com/admin-blip7/desing-system)
- Rama comunitaria activa: `codex/community-readme`
