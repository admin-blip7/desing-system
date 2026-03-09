# Contributing

Thank you for helping build an open-source enterprise design-system platform.

## Contribution Goal

We are moving the project from “functional prototype” to “production-ready platform.”

High-value contributions improve:

- technical reliability,
- brand-system consistency,
- UX quality in module workspaces,
- testing coverage,
- contributor documentation.

## Before You Start

1. Read [README.md](./README.md)
2. Read [COMMUNITY_ROADMAP.md](./COMMUNITY_ROADMAP.md)
3. Read [docs/COMMUNITY_PLAYBOOK.md](./docs/COMMUNITY_PLAYBOOK.md)
4. Pick one focused task

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Recommended Workflow

1. Create a feature branch.
2. Open/claim an issue (for anything non-trivial).
3. Implement one primary change per PR.
4. Validate.
5. Submit PR with clear context.

## Definition of Done

A PR is ready when:

- it solves one clear problem,
- the affected flow works end-to-end,
- no secrets or private data are introduced,
- docs are updated when behavior changes.

Minimum checks:

- `npm run lint`
- `npm run build`
- manual validation notes for the changed flow

## Pull Request Standards

Include:

- problem statement,
- implementation summary,
- scope (in/out),
- risk notes,
- validation evidence.

## Contributing to Design Identities

Identity profiles live in: `src/lib/data/personalities.ts`

When adding/updating an identity:

- define a clear archetype and philosophy,
- include ideal and non-ideal industry fit,
- specify full DNA dimensions (typography, color, layout, motion, photography, voice),
- keep principles actionable (not vague branding slogans),
- preserve compatibility with existing onboarding and generation flows.

Reference: [docs/IDENTITY_ARCHETYPES.md](./docs/IDENTITY_ARCHETYPES.md)

## Security Rules

- Never commit `.env.local` or real API keys.
- Never include local dumps with user data.
- Never expose internals in production errors (`stack/details`).
- Report potential leaks immediately via issue.

## Priority Areas

- phase completion (especially phases 2-7),
- test coverage for critical flows,
- API hardening and consistency,
- export reliability,
- versioning and distribution workflows.
