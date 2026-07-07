import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { ArrowRight, Braces } from 'lucide-react'
import { SCENARIOS } from '@/data/scenarios'
import { HISTORY } from '@/data/history'
import { IS_MOCK } from '@/api'
import { cn } from '@/lib/utils'

/* ── helpers ──────────────────────────────────────────────────────────────── */

function MethodBadge({ method }: { method: 'GET' | 'POST' }) {
  const styles =
    method === 'GET'
      ? 'bg-sky-50 text-sky-700 ring-sky-200'
      : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  return (
    <span
      className={cn(
        'inline-flex min-w-[52px] justify-center rounded-md px-2 py-1 font-mono text-[11px] font-semibold uppercase ring-1',
        styles,
      )}
    >
      {method}
    </span>
  )
}

function highlightJson(value: unknown): string {
  const json = JSON.stringify(value, null, 2)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return json.replace(
    /("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (m) => {
      let cls = 'text-amber-600'
      if (/^"/.test(m)) cls = /:\s*$/.test(m) ? 'text-ink font-medium' : 'text-emerald-600'
      else if (/^(?:true|false|null)$/.test(m)) cls = 'text-violet-600'
      return `<span class="${cls}">${m}</span>`
    },
  )
}

function JsonBlock({ value, cap = 30 }: { value: unknown; cap?: number }) {
  const full = JSON.stringify(value, null, 2).split('\n')
  const clipped = highlightJson(value).split('\n').slice(0, cap).join('\n')
  return (
    <div className="overflow-hidden rounded-lg border border-border/70 bg-[#0A2540]/[0.02]">
      <div className="flex items-center gap-2 border-b border-border/60 bg-canvas/70 px-3 py-1.5">
        <Braces className="h-3.5 w-3.5 text-muted-foreground" />
        <code className="font-mono text-[11px] text-muted-foreground">application/json</code>
      </div>
      <pre className="max-h-[380px] overflow-auto p-4 font-mono text-[12px] leading-relaxed text-slate">
        <code dangerouslySetInnerHTML={{ __html: clipped }} />
        {full.length > cap && (
          <div className="pt-1 text-muted-foreground">… {full.length - cap} more lines</div>
        )}
      </pre>
    </div>
  )
}

interface Field {
  name: string
  type: string
  desc: string
}

function SchemaTable({ name, fields }: { name: string; fields: Field[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-white shadow-card">
      <div className="flex items-center gap-2 border-b border-border/60 bg-canvas/70 px-4 py-2.5">
        <code className="font-mono text-[12.5px] font-medium text-ink">{name}</code>
        <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          object
        </span>
      </div>
      <div className="divide-y divide-border/60">
        {fields.map((f) => (
          <div key={f.name} className="flex flex-col gap-0.5 px-4 py-2.5">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <code className="font-mono text-[12.5px] text-ink">{f.name}</code>
              <code className="font-mono text-[12px] text-primary">{f.type}</code>
            </div>
            <span className="text-[12.5px] leading-snug text-muted-foreground">{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EnumRow({ name, values }: { name: string; values: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border/60 py-2.5 last:border-b-0">
      <code className="w-40 shrink-0 font-mono text-[12.5px] text-ink">{name}</code>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <code
            key={v}
            className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-slate"
          >
            "{v}"
          </code>
        ))}
      </div>
    </div>
  )
}

function Operation({
  method,
  path,
  summary,
  children,
}: {
  method: 'GET' | 'POST'
  path: string
  summary: string
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-white shadow-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-border/60 px-4 py-3">
        <MethodBadge method={method} />
        <code className="font-mono text-[14px] font-medium text-ink">{path}</code>
        <span className="text-[13px] text-muted-foreground">{summary}</span>
      </div>
      <div className="flex flex-col gap-5 p-4">{children}</div>
    </div>
  )
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  )
}

/* ── page ─────────────────────────────────────────────────────────────────── */

export function ContractsPage() {
  const sample = SCENARIOS[0]

  return (
    <div className="mx-auto max-w-4xl px-6 pb-32 pt-14">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
          THREADFINDER · API contracts
        </span>
        <h1 className="mt-3 text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
          Two endpoints,
          <br />
          one context pack.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          The UI talks to a single interface (<code className="font-mono text-[13px]">ThreadfinderApi</code>).
          Today it runs on fixtures; point <code className="font-mono text-[13px]">VITE_API_BASE_URL</code> at a
          server and these two calls take over — response bodies just have to match the models below.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white px-3 py-1.5 font-mono text-[12px]">
            <span className="text-muted-foreground">base</span>
            <span className="text-ink">{'{VITE_API_BASE_URL}'}</span>
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium',
              IS_MOCK ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700',
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', IS_MOCK ? 'bg-amber-500' : 'bg-emerald-500')} />
            {IS_MOCK ? 'Running on mock data' : 'Live API'}
          </span>
        </div>
      </motion.div>

      {/* Endpoints */}
      <section className="mt-12">
        <h2 className="mb-5 text-[22px] font-semibold tracking-tight text-ink">Endpoints</h2>
        <div className="flex flex-col gap-4">
          <Operation method="POST" path="/ask" summary="Ask a question, get a context pack">
            <Block label="Request body">
              <JsonBlock value={{ question: sample.question }} />
            </Block>
            <Block label="200 · Response — ContextPack">
              <JsonBlock value={sample} cap={34} />
            </Block>
          </Operation>

          <Operation method="GET" path="/history" summary="Sidebar conversation history">
            <Block label="200 · Response — HistoryGroup[]">
              <JsonBlock value={HISTORY} cap={22} />
            </Block>
          </Operation>
        </div>
      </section>

      {/* Models */}
      <section className="mt-12">
        <h2 className="mb-2 text-[22px] font-semibold tracking-tight text-ink">Models</h2>
        <p className="mb-5 max-w-xl text-[14px] text-muted-foreground">
          The shapes the backend must return. Mirrored in{' '}
          <code className="font-mono text-[13px]">src/api/types.ts</code>.
        </p>
        <div className="flex flex-col gap-4">
          <SchemaTable
            name="ContextPack"
            fields={[
              { name: 'id', type: 'string', desc: 'Stable id for the answer.' },
              { name: 'scenario', type: 'string', desc: 'Short label, e.g. "Picking up paused work".' },
              { name: 'question', type: 'string', desc: "The user's question, echoed back." },
              { name: 'askedAs', type: 'string', desc: 'Persona, e.g. "New FE developer".' },
              { name: 'summary', type: 'string', desc: 'The answer in prose.' },
              { name: 'status', type: 'Status', desc: '{ label, tone, note }' },
              { name: 'confidence', type: 'Confidence', desc: '{ level, score (0–100), rationale }' },
              { name: 'sources', type: 'SourceItem[]', desc: 'Where the answer comes from.' },
              { name: 'people', type: 'Person[]', desc: 'Who to talk to.' },
              { name: 'timeline', type: 'TimelineItem[]', desc: 'How it got here.' },
              { name: 'nextSteps', type: 'string[]', desc: 'Suggested next steps.' },
              { name: 'gaps', type: 'string[]', desc: 'Caveats / missing evidence.' },
            ]}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <SchemaTable
              name="SourceItem"
              fields={[
                { name: 'type', type: 'SourceType', desc: 'Drives glyph & tint.' },
                { name: 'title', type: 'string', desc: 'Human title.' },
                { name: 'ref', type: 'string', desc: 'Machine ref (mono), e.g. PATCH-142.' },
                { name: 'meta', type: 'string', desc: 'Author · updated etc.' },
                { name: 'freshness', type: 'Freshness', desc: 'current | aging | stale' },
              ]}
            />
            <SchemaTable
              name="Person"
              fields={[
                { name: 'name', type: 'string', desc: 'Display name.' },
                { name: 'initials', type: 'string', desc: 'Avatar fallback.' },
                { name: 'role', type: 'string', desc: 'Role / context.' },
                { name: 'relation', type: 'Relation', desc: 'owner | contributor | reviewer | knows' },
                { name: 'hue', type: 'string', desc: 'Avatar gradient seed (hex).' },
              ]}
            />
            <SchemaTable
              name="TimelineItem"
              fields={[
                { name: 'date', type: 'string', desc: 'Short date label.' },
                { name: 'label', type: 'string', desc: 'What happened.' },
                { name: 'kind', type: 'TimelineKind', desc: 'ticket | design | doc | code | decision' },
              ]}
            />
            <SchemaTable
              name="HistoryGroup / HistoryItem"
              fields={[
                { name: 'label', type: 'string', desc: 'Group heading, e.g. "Today".' },
                { name: 'items', type: 'HistoryItem[]', desc: 'Threads in the group.' },
                { name: 'items[].id', type: 'string', desc: 'Thread id.' },
                { name: 'items[].title', type: 'string', desc: 'Question snippet.' },
                { name: 'items[].confidence', type: 'Confidence', desc: 'Dot colour.' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Enums */}
      <section className="mt-12">
        <h2 className="mb-5 text-[22px] font-semibold tracking-tight text-ink">Enums</h2>
        <div className="rounded-xl border border-border/70 bg-white px-5 py-2 shadow-card">
          <EnumRow name="SourceType" values={['jira', 'confluence', 'figma', 'onedrive', 'github', 'doc']} />
          <EnumRow name="Freshness" values={['current', 'aging', 'stale']} />
          <EnumRow name="Confidence.level" values={['high', 'medium', 'low']} />
          <EnumRow name="Relation" values={['owner', 'contributor', 'reviewer', 'knows']} />
          <EnumRow name="Status.tone" values={['active', 'paused', 'shipped', 'unknown']} />
          <EnumRow name="TimelineKind" values={['ticket', 'design', 'doc', 'code', 'decision']} />
        </div>
      </section>

      <div className="mt-12 flex items-center gap-2 rounded-xl border border-primary/20 bg-accent/40 px-5 py-4">
        <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-[13.5px] text-slate">
          To go live: implement <code className="font-mono text-[12.5px]">POST /ask</code> and{' '}
          <code className="font-mono text-[12.5px]">GET /history</code>, then set{' '}
          <code className="font-mono text-[12.5px]">VITE_API_BASE_URL</code>. No UI changes needed.
        </p>
      </div>
    </div>
  )
}
