# Community Roadmap

This roadmap defines how contributors can help finish the platform as a true enterprise-ready design-system product.

## Platform Scope

- 7 phases
- 55 modules
- AI-assisted generation + editing + export

Current state: strong functional base, still incomplete for production-scale reliability and governance.

## Top Priorities

1. Consolidate duplicated route patterns (`/workspace/*` vs `/dashboard/brands/[id]/workspace/*`).
2. Ensure `modules` is the single source of truth for module persistence.
3. Harden remaining sensitive/debug API behavior.
4. Expand automated test coverage for critical flows.
5. Standardize AI output contracts by module type.
6. Remove `.bak`/legacy drift in active runtime paths.
7. Complete phase-level module quality and acceptance criteria.
8. Improve export quality for enterprise deliverables.
9. Stabilize versioning/changelog strategy.
10. Improve onboarding docs for new contributors.

## Phase-by-Phase Work

## Phase 1 - Identity Foundations

Status: partially stable.

Needs:

- stronger read/write consistency in foundation modules,
- better content quality validation,
- UX and performance QA in key editors.

Acceptance:

- onboarding -> generate -> edit -> export works without manual recovery.

## Phase 2 - Extended Visual System

Status: incomplete.

Needs:

- stronger outputs in visual modules (`photography`, `illustration`, `motion`, `audioBranding`, `dataVisualization`),
- normalized content structure for preview/export,
- robust text/image fallback handling.

Acceptance:

- all visual modules produce usable and export-safe outputs.

## Phase 3 - Digital Design System (UI Kit)

Status: incomplete.

Needs:

- component and token consistency across workspaces,
- stronger pattern uniformity,
- regression validation in core UI modules.

Acceptance:

- consistent contracts and behavior across critical UI modules.

## Phase 4 - Digital Presence

Status: incomplete.

Needs:

- stable end-to-end outputs in channel modules,
- better editing UX for cross-channel content,
- business-ready export quality.

Acceptance:

- non-technical teams can use outputs directly with minimal edits.

## Phase 5 - Physical Identity

Status: incomplete.

Needs:

- stronger production-ready templates,
- technical constraints for print and physical applications.

Acceptance:

- outputs are execution-ready for print and physical vendors.

## Phase 6 - Customer Experience

Status: incomplete.

Needs:

- stronger operational protocol structures,
- consistency between generated content and export behavior.

Acceptance:

- daily operations can follow the generated standards without ambiguity.

## Phase 7 - Integrations & Distribution

Status: incomplete.

Needs:

- reliable real integrations,
- strong versioning and traceability,
- better internal distribution experience.

Acceptance:

- manuals are versioned, distributable, and governance-ready.

## Cross-Cutting Tracks

## Testing

- unit tests for critical utilities,
- integration tests for module/export APIs,
- e2e smoke flows (auth -> onboarding -> generation -> export).

## Security

- no secrets in repo,
- production-safe error responses,
- authenticated access to sensitive endpoints,
- stronger rate-limit strategy.

## Technical Debt

- remove `.bak` artifacts,
- reduce legacy route debt,
- normalize data contracts.

## Developer Experience

- clean issue/PR triage,
- module-level implementation guides,
- clear acceptance checklists.

## How to Pick a Task

1. Choose a phase or cross-cutting track.
2. Open an issue with problem, proposal, validation.
3. Submit a focused PR.
4. Attach verification evidence.
5. Update docs for any behavior change.

## High-Need Contributor Profiles

- maintainers for specific phases,
- QA contributors for full business flows,
- engineers focused on testing infrastructure,
- contributors improving technical docs and onboarding.
