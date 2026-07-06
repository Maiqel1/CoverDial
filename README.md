# CoverDial — AI Cover Letter Generator

Generate a tailored cover letter from your resume + a job description, then
refine it with a rich-text editor and an AI Assistant. Export to PDF or DOCX.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme`, no `tailwind.config.js`)
- **React Hook Form + Zod** — forms & validation
- **Zustand** (persisted to `localStorage`) — the shared letter
- **Google Gemini** (`@google/genai`, `gemini-2.5-flash`) — all AI
- **pdf.js + mammoth** — resume parsing (PDF / DOCX), in-browser
- **jsPDF + docx** — export
- **Tiptap** — rich-text editor

## Getting started

```bash
npm install
cp .env.example .env.local      # then paste your key (see below)
npm run dev                     # http://localhost:3000
```

### Gemini API key

1. Get a free key at <https://aistudio.google.com/apikey>.
2. Put it in `.env.local`: `GEMINI_API_KEY=your_key_here`
3. Restart `npm run dev` (env vars load at startup).

The key is read **server-side only** (in route handlers) and never shipped to
the browser. `.env.local` is gitignored.

## Project structure

```
src/
  app/
    layout.tsx              # Inter + Material Symbols, AppShell, store hydrator
    page.tsx                # redirect → /generator
    generator/page.tsx      # Generator screen
    editor/page.tsx         # Editor screen
    api/generate/route.ts   # POST → create a letter
    api/revise/route.ts     # POST → revise the existing letter
  components/
    ui/                     # design-system primitives (Button, Input, Card, …)
    layout/                 # AppShell, Sidebar, MobileTopBar, Footer
    generator/              # GeneratorForm, ResumeInput, LetterPreview, GeneratorView
    editor/                 # EditorView, EditorToolbar, RichTextEditor, AiAssistantPanel, QuickSuggestions
    shared/                 # LetterActions (copy/export), StoreHydrator
  lib/
    ai/                     # provider.ts (interface), gemini.ts, index.ts (selector)
    prompts/                # generate-prompt.ts, revise-prompt.ts
    files/parse-resume.ts   # PDF/DOCX → text (in-browser)
    export/                 # pdf.ts, docx.ts
    validation/schemas.ts   # Zod schemas (shared by form + API)
    store/letter-store.ts   # Zustand (persisted)
    utils/                  # cn, download, letter-format
  types/                    # shared domain types (Tone, Length, …)
```

## How the AI request lifecycle works

1. **Generate.** `GeneratorForm` validates with Zod, then `GeneratorView` POSTs
   the form JSON to `/api/generate`.
2. The route **re-validates** with the same Zod schema (never trust the client),
   calls `buildGeneratePrompt()` to assemble a system + user prompt, then
   `getAIProvider().generateText()`.
3. The provider (`gemini.ts`) calls Gemini with the server-only key and returns
   plain text. Errors become a typed `AIError` mapped to an HTTP status.
4. The letter is stored in Zustand (and `localStorage`) and rendered in the
   preview.
5. **Revise.** In the Editor, the AI Assistant sends the *current* letter plus
   an instruction to `/api/revise`, which uses `buildRevisePrompt()` (edit in
   place, lower temperature) and swaps the result back into the editor + store.

## Where things live

- **Prompts:** `src/lib/prompts/` — generation and revision, separate from the
  API call so they can be tuned in isolation.
- **API key:** `GEMINI_API_KEY` in `.env.local`, read only in
  `src/lib/ai/gemini.ts` (server).
- **Provider seam:** `src/lib/ai/provider.ts` (interface) + `index.ts`
  (selector).

## Swapping Gemini for another provider

Implement the `AIProvider` interface (one `generateText` method) in a new file —
e.g. `src/lib/ai/openai.ts` or `claude.ts` — and return it from
`getAIProvider()` in `src/lib/ai/index.ts`. No feature/UI code changes; prompts
and routes are provider-agnostic.

## Extending the app

- **Authentication:** add a provider (e.g. Auth.js), gate the `/api/*` routes.
- **Saved letters / history:** add a database (e.g. Postgres + Prisma); persist
  letters per user instead of `localStorage`; add a list view.
- **Templates:** store reusable prompt/letter templates; add a picker to the
  Generator that seeds the prompt.
- **Analytics:** wrap `generateText` to log usage/latency; add a dashboard.

## Notes

- No dark mode by design (monochrome light theme only).
- The resume is parsed entirely in the browser — files never leave the device.
- The current letter persists locally; there is no server-side storage.
