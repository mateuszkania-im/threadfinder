# THREADFINDER — UI

Front-end for **THREADFINDER**, the project-memory assistant by **Team Signal**
(Hackathon 2026). Ask a plain-language question, get back a **context pack** — not
just an AI answer — stitched from Jira, Confluence, Figma, OneDrive and GitHub.

> Scope: **UI only.** All data is mocked. The backend / orchestrator is wired in
> separately — this repo just needs to be handed the shape below.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
```

## Two screens

- **Assistant** — hero → retrieval animation → the context pack assembling along
  an animated "thread", section by section (summary → sources → people → timeline
  → next steps), each with a **signal-strength confidence meter**.
- **Design system** — precise tokens: color, type scale, the signature elements,
  shadcn components and the motion choreography. Toggle in the top-right.

## The data contract (this is what backend fills)

Everything the UI renders comes from one typed object per query,
`ContextPack`, defined in [`src/data/scenarios.ts`](src/data/scenarios.ts).
Swap the mock array for a real API response — **no component changes needed**.

```ts
interface ContextPack {
  id: string
  scenario: string          // short label, e.g. "Picking up paused work"
  question: string          // the user's question, echoed back
  askedAs: string           // persona, e.g. "New FE developer"
  summary: string           // the answer, in prose
  status: { label; tone: 'active'|'paused'|'shipped'|'unknown'; note }
  confidence: { level: 'high'|'medium'|'low'; score: 0-100; rationale }
  sources: SourceItem[]     // { type, title, ref, meta, freshness }
  people: Person[]          // { name, initials, role, relation, hue }
  timeline: TimelineItem[]  // { date, label, kind }
  nextSteps: string[]
  gaps: string[]            // caveats / missing evidence
}
```

`SourceItem.type` is one of `jira | confluence | figma | onedrive | github | doc`
— it drives the glyph, brand tint and label (see `SOURCE_META`).
`freshness` is `current | aging | stale`. `Person.relation` is
`owner | contributor | reviewer | knows`.

### Wiring it up

In `src/App.tsx`, `ask(pack)` is the single entry point. Today the demo chips call
it with a static `ContextPack`; replace the body with a `fetch` that returns the
same shape, keep the `thinking → answer` transition, and the reveal animation runs
itself.

## Environments

Dev-only tooling — right now the **Assistant / Design system** switcher — is gated
by `VITE_APP_ENV` (see `src/lib/env.ts`):

| `VITE_APP_ENV`      | Behaviour                          |
| ------------------- | ---------------------------------- |
| _unset_ (default)   | development — dev tools **shown**   |
| `development`       | development — dev tools **shown**   |
| `production`        | dev tools **hidden**                |

`.env.development` and `.env.production` set it per Vite mode, so
`npm run dev` shows the switcher and `npm run build && npm run preview` hides it.

## Persistence

Sidebar collapse state and the last-opened thread are stored in `localStorage`
(`tf.sidebar.collapsed`, `tf.activeThread`) via `src/lib/useLocalStorage.ts`, so a
reload restores where you left off. Storage failures degrade gracefully.

## Stack

Vite · React + TypeScript · Tailwind · shadcn/ui (Radix) · Framer Motion ·
Geist / Geist Mono · lucide-react.
