# Community Playbook

This playbook is the practical execution guide for contributors who want to finish and harden the platform.

## 1. Product Mission

Transform fragmented brand assets into a complete enterprise design system that is:

- generated with AI,
- editable by humans,
- operational across channels,
- exportable and governance-ready.

## 2. Technical Baseline

- App framework: Next.js App Router
- UI: React + Tailwind
- Data/auth: Supabase
- AI layer: BAML + OpenAI
- Export: PDF/HTML/Markdown

Key folders:

- `src/app/**` routes and APIs
- `src/components/**` workspaces and UI
- `src/lib/**` domain, AI, persistence utilities
- `src/actions/**` server actions

## 3. Core Runtime Flow

1. User completes onboarding.
2. System creates brand context.
3. User generates module outputs (AI).
4. User edits and saves module content.
5. System exports full manual.
6. Manual can be shared publicly via token.

## 4. Most Fragile Areas

- AI output shape vs workspace parser expectations
- module persistence consistency in `modules`
- route duality and navigation drift
- export behavior for mixed/legacy content formats

## 5. PR Design Rules

- One primary intent per PR.
- Avoid broad refactors unless explicitly scoped.
- Keep backward compatibility when possible.
- Update docs when contracts/behavior change.

## 6. Validation Standard

Minimum:

- `npm run lint`
- `npm run build`
- manual verification notes for impacted flow

Recommended:

- unit tests for utility-level changes
- integration tests for API behavior
- smoke e2e for critical journeys

## 7. Track-Specific Guidance

## Modules / Workspaces

- validate generated + existing content parsing
- verify save/load integrity
- verify preview and export compatibility

## APIs

- enforce auth and ownership checks
- keep production error responses sanitized
- avoid sensitive payload logs

## AI / BAML

- enforce stable input/output contracts
- handle provider failure with robust fallback
- validate structured output before persistence

## 8. Production-Readiness Criteria

A module is production-ready when it:

- generates useful outputs consistently,
- can be edited without structural breakage,
- persists and reloads safely,
- exports correctly,
- has documented validation evidence.

## 9. Security Expectations

- no secret files or API keys committed,
- no personal local-tooling artifacts committed,
- no debug endpoints enabled in production behavior,
- immediate reporting of potential leaks.

## 10. High-Impact Backlog Themes

1. Route consolidation
2. Persistence contract hardening
3. Critical test coverage
4. Phase 2-7 completion
5. Integration and distribution reliability

## 11. What Great PRs Include

- clear problem statement,
- implementation summary,
- explicit in-scope / out-of-scope,
- validation evidence,
- risk and rollback note.
