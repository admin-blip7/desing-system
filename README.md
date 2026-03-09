# Brand Manual App

Build enterprise-ready brand systems with AI.

`brand-manual-app` is an open-source **Brand OS** that helps teams transform fragmented brand assets into a complete, governed design system across product, marketing, and customer experience.

## What This Platform Does

- Runs structured brand onboarding.
- Applies curated identity archetypes (or full manual mode).
- Generates outputs across **55 modules** in **7 phases**.
- Lets teams edit module content in dedicated workspaces.
- Exports manuals to `PDF`, `HTML`, and `Markdown`.
- Supports token-based public read-only sharing.

## Why Contributors Join This Project

This is not “another UI kit repo.”  
It is a full system that connects:

- brand strategy,
- design language,
- operational guidelines,
- and production-ready documentation.

If you want to contribute to a real-world AI + design-system platform with enterprise scope, this repo has meaningful work across architecture, UX, data modeling, AI contracts, and reliability.

## Design Identity System

Identity profiles are defined in `src/lib/data/personalities.ts` and include:

- philosophy,
- best-fit and non-fit contexts,
- typography DNA,
- color DNA,
- layout and motion rules,
- photography direction,
- voice and tone behavior.

Current profiles:

- Apple
- Teenage Engineering
- Polestar
- Linear
- Bang & Olufsen
- Nothing
- Aesop
- Manual mode

Deep dive: [docs/IDENTITY_ARCHETYPES.md](./docs/IDENTITY_ARCHETYPES.md)

## North-Star Goal per Brand

Every generated brand system should be:

- **Distinctive**: clearly recognizable.
- **Consistent**: reusable across channels and teams.
- **Scalable**: useful from early-stage to enterprise growth.
- **Operational**: directly executable by product/marketing/CX teams.
- **Governable**: auditable and maintainable over time.

## Architecture Snapshot

- Routes and APIs: `src/app/**`
- Workspaces and UI: `src/components/**`
- Domain data (phases/modules/identities): `src/lib/data/**`
- AI orchestration: `src/lib/ai/**`, `src/actions/**`
- Supabase integration: `src/lib/supabase/**`
- Export engines: `src/lib/exporters/**`

## Tech Stack

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- Supabase
- BAML
- OpenAI

## Quick Start (Copy/Paste)

```bash
git clone https://github.com/admin-blip7/desing-system.git
cd desing-system
npm install
cp .env.example .env.local
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

## Environment Variables

Use `.env.example` as your template.

Minimum keys to run text generation:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_TEXT_MODEL=gpt-5-mini
AI_PROVIDER=openai
```

Optional keys for image generation:

```env
GOOGLE_API_KEY=your_google_api_key_here
# GEMINI_API_KEY=your_google_api_key_here
```

## npm Publishing (Important)

You **do not need to publish anything to npm** to use or contribute to this project.

Why:

- This repository is an **application monorepo**, not a public package template.
- Root `package.json` is marked `"private": true`.
- Internal workspace packages are local/private and resolved via npm workspaces.

For contributors, the correct setup is always:

1. clone repo,
2. `npm install`,
3. configure `.env.local`,
4. run `npm run dev`.

## Available Scripts

- `npm run dev` - start local development server
- `npm run build` - production build
- `npm run start` - run production build locally
- `npm run lint` - lint project
- `npm run test:ai` - AI package tests
- `npm run docs:ai` - regenerate AI module docs

## Contributing

- Contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Community roadmap: [COMMUNITY_ROADMAP.md](./COMMUNITY_ROADMAP.md)
- Execution playbook: [docs/COMMUNITY_PLAYBOOK.md](./docs/COMMUNITY_PLAYBOOK.md)

Issue/PR templates are included under `.github/`.

## Security Notes

- Never commit `.env.local` or real secrets.
- Never commit local tool artifacts or private dumps.
- Keep production error responses sanitized.
- Report potential secret exposure immediately.

## Project Status

Core flows are functional.  
Primary community opportunity is finishing phase-level quality and production hardening.
