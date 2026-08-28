# Project Guidelines

Romantic full-screen photo/video slideshow PWA for Rachel & Nathan, deployed to
GitHub Pages at rachelandnathan.com. React 19 + TypeScript + Vite + MUI v9.

## Build and Test

- `npm run dev` — dev server. `npm run dev-regular|dev-pre|dev-anniversary|dev-post` open a specific mode.
- `npm run build` — type-check (`tsc -b`) + Vite production build. Must pass before done.
- `npm run lint` — oxlint. Keep it clean (no new warnings).
- `npm test` — Vitest (pure logic only). `npm run test:watch` to iterate.
- `npm run prep-media` — regenerates `public/media/` and `src/media-manifest.json` from the private source photo folders. Requires `ffmpeg`/`ffprobe` on PATH.

## Architecture

- Four date-driven modes (regular / pre / anniversary / post) resolved in [src/lib/mode.ts](../src/lib/mode.ts); `?mode=` overrides for preview.
- [src/components/Slideshow.tsx](../src/components/Slideshow.tsx) is the crossfade engine (tap/swipe/auto-advance, orientation-filtered queue, `blankIntro` slide). Per-mode text lives in [src/components/overlays/](../src/components/overlays/).
- [scripts/prep-media.mjs](../scripts/prep-media.mjs) is the media pipeline: sharp (images) + ffmpeg (videos).

## Conventions

- 4-space indentation; functional components; style via MUI `sx`.
- Comments only when the code can't show intent; one line, no doc-blocks. Don't add docs/comments to code you didn't change.
- Tests cover pure logic only (mode/date, media selection). Import `{ describe, it, expect }` from `vitest` explicitly (no globals).

## Gotchas (project-critical)

- `src/media-manifest.json` and `public/media/` are **generated** — never hand-edit; rerun `npm run prep-media`. `public/media` IS committed (the deploy build has no access to originals).
- The prep script strips ALL metadata (GPS/PII) and audio, and gives media anonymized integer filenames — preserve this behavior; filenames themselves are treated as PII.
- Photo pools are orientation-filtered; both orientations exist in every pool (no cross-orientation fallback needed).
- Import per-subset fontsource CSS (e.g. `@fontsource/nunito/latin-400.css`), not the bare package.
- PWA: only the app shell is precached; media is runtime-cached. The service worker runs only in a production build, not `npm run dev`.
