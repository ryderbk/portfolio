# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Spider-Man Landing Page (`artifacts/spiderman`)
- **Type**: React + Vite, presentation-first (no backend)
- **Preview path**: `/`
- **Font**: Bebas Neue (Google Fonts) + Inter
- **Theme**: Dark cinematic, black/red color scheme
- **Components**:
  - `SpiderManHero` — Full-screen dark hero with parallax, cast tags (Tobey/Andrew/Zendaya/Tom at 40px red), navigation, Book Now CTA
  - `ReferenceSection` — Story/synopsis, genre chips, card stack effect, pull quote
  - `ReferenceDetailsSection` — Cast list with avatars + vertical arrows, film details card, booking card, media gallery
  - `DeadpoolPosterSection` — Three-card multiverse Spider-Men selector (interactive)
  - `BottomPlaceholderSection` — Stats band ($1.9B box office, 97% RT), final CTA, footer
  - `FloatingRedPlaceholder` — Scroll-animated floating red orb
  - `WhiteStage` — White background wrapper for lower sections
  - `Navigation` — Fixed navigation component
