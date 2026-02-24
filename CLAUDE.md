# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (flat config, eslint.config.mjs)
```

No test suite is configured.

## Architecture

LavoroChiaro is an Italian payslip analysis tool. Users upload a payslip (PDF/JPEG/PNG/HEIC), it gets OCR'd by GPT-4o Vision, then analyzed by GPT-4o for compliance issues. Results display with a traffic-light (semaforo) system: verde/giallo/rosso.

### AI Pipeline (two-step)

1. **Upload** (`POST /api/upload`) — validates file, converts HEIC→JPEG, optimizes with sharp, uploads to Supabase Storage, creates DB row
2. **Analysis** (`POST /api/analizza`, `maxDuration=60`) — downloads file, sends directly to `estraiDatiDocumento()` (GPT-4o Vision OCR), then `analizzaBustaPaga()` (GPT-4o analysis), validates result with Zod, updates DB

Both AI functions are in `src/lib/ai/`. Prompts are in `src/lib/ai/prompts.ts`. Both strip markdown code fences before `JSON.parse`.

### Demo Mode

Activates automatically when `NEXT_PUBLIC_SUPABASE_URL` is not set. Upload returns a fake UUID; analysis waits 4s then returns `MOCK_RISULTATO` from `src/lib/mock-data.ts`. No env flag needed.

### Client Flow

`/analisi/[id]/page.tsx` (client component) uses `useAnalysis` hook → fires `POST /api/analizza` → drives state machine (`processing` → `completed` | `error`) → renders `AnalysisLoading` or `AnalysisResult`.

## Stack & Configuration

- **Next.js 16** with App Router, React Compiler enabled
- **TypeScript** strict mode, path alias `@/*` → `./src/*`
- **Tailwind v4** — config lives in `@theme` blocks inside `globals.css`, no `tailwind.config.ts`
- **shadcn/ui** — `new-york` style, add components with `npx shadcn@latest add <name>`
- **Zod v4** for runtime validation (breaking changes from v3)
- **Vercel AI SDK v6** — use `maxOutputTokens` not `maxTokens`
- **ESLint 9** flat config

## Technical Gotchas

- **serverExternalPackages**: `sharp`, `heic-convert` must stay in `next.config.ts` `serverExternalPackages` — they are native/ESM-only and cannot be bundled
- **ESM-only imports**: `heic-convert` requires dynamic `await import()` inside functions
- **heic-convert types**: No `@types` package — custom declaration at `src/types/heic-convert.d.ts`
- **Buffer types in TS5+**: `Buffer.from(await blob.arrayBuffer())` returns `Buffer<ArrayBuffer>`. Wrap with `Buffer.from()` when chaining to keep types consistent
- **All UI text is in Italian** — maintain Italian for user-facing strings

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
```

Supabase requires: `documenti` storage bucket (private), `analisi` table from `supabase/migrations/001_initial.sql`.
