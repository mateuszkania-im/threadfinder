import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { SignalMeter } from '@/components/SignalMeter'
import { SourceIcon } from '@/components/SourceIcon'
import {
  NextStepsBlock,
  PeopleBlock,
  SourcesBlock,
  SummaryBlock,
  TimelineBlock,
} from '@/components/ContextSections'
import { SCENARIOS, SOURCE_META, type SourceType } from '@/data/scenarios'

const SAMPLE = SCENARIOS[0]

/* ── tiny primitives for the doc ──────────────────────────────────────────── */

function Section({
  n,
  title,
  desc,
  children,
}: {
  n: string
  title: string
  desc?: string
  children: ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-28 border-t border-border/70 py-12 first:border-t-0"
    >
      <div className="mb-7 flex items-baseline gap-3">
        <span className="font-mono text-[12px] font-medium tabular text-primary">{n}</span>
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight text-ink">{title}</h2>
          {desc && <p className="mt-1 max-w-xl text-[14px] text-muted-foreground">{desc}</p>}
        </div>
      </div>
      {children}
    </motion.section>
  )
}

function Swatch({
  name,
  value,
  sub,
  dark,
}: {
  name: string
  value: string
  sub?: string
  dark?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-white shadow-card">
      <div className="h-20 w-full" style={{ background: value }} />
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-ink">{name}</p>
          {sub && <p className="truncate text-[11px] text-muted-foreground">{sub}</p>}
        </div>
        <code
          className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-slate"
          style={dark ? { color: value } : undefined}
        >
          {value}
        </code>
      </div>
    </div>
  )
}

/** A Storybook-style panel: component name in the header, examples in the body. */
function Story({
  name,
  desc,
  children,
  className,
}: {
  name: string
  desc?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border/70 bg-white shadow-card',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-canvas/70 px-4 py-2.5">
        <code className="font-mono text-[12.5px] font-medium text-ink">{name}</code>
        {desc && <span className="truncate text-[11px] text-muted-foreground">{desc}</span>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Variant({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <code className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </code>
      <div className="flex flex-wrap items-center gap-2.5">{children}</div>
    </div>
  )
}

/* ── data for the doc ─────────────────────────────────────────────────────── */

const SEMANTIC = [
  { name: 'Background', value: '#FFFFFF', sub: 'surface / base' },
  { name: 'Canvas', value: '#F6F9FC', sub: 'app field · sunken' },
  { name: 'Ink', value: '#0A2540', sub: 'headings · primary text' },
  { name: 'Slate', value: '#3D4B60', sub: 'body copy' },
  { name: 'Muted', value: '#7A8AA0', sub: 'captions · meta' },
  { name: 'Blurple', value: '#635BFF', sub: 'primary · brand', dark: true },
]

const CONFIDENCE = [
  { name: 'High', value: '#10B981', sub: '4 bars · trusted' },
  { name: 'Medium', value: '#F59E0B', sub: '3 bars · caveats' },
  { name: 'Low', value: '#F43F5E', sub: '2 bars · thin evidence' },
]

const SOURCES = Object.entries(SOURCE_META) as [SourceType, (typeof SOURCE_META)[SourceType]][]

const TYPE_SCALE = [
  { label: 'display / 46', cls: 'text-[46px] font-semibold tracking-[-0.02em]', sample: 'What do we know?' },
  { label: 'h1 / 22', cls: 'text-[22px] font-semibold tracking-tight', sample: 'Section heading' },
  { label: 'title / 15', cls: 'text-[15px] font-semibold', sample: 'Card title' },
  { label: 'body / 15.5', cls: 'text-[15.5px] leading-relaxed text-slate', sample: 'Recovering lost context, reducing duplicated work.' },
  { label: 'small / 13', cls: 'text-[13px] text-muted-foreground', sample: 'Supporting caption and metadata.' },
]

/* ── page ─────────────────────────────────────────────────────────────────── */

export function DesignSystem() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-32 pt-14">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
          THREADFINDER · design system
        </span>
        <h1 className="mt-3 text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
          One light system,
          <br />
          one thread through it all.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          A Stripe-bright surface with a single blurple through-line. Data is set in mono so
          retrieved facts always look like facts. The thread and the signal meter are the two
          pieces you will recognise anywhere in the product.
        </p>
      </motion.div>

      {/* 01 — Color */}
      <Section n="01" title="Color" desc="Light surfaces, one saturated brand, semantic confidence and per-source accents.">
        <div className="space-y-8">
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Semantic
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SEMANTIC.map((c) => (
                <Swatch key={c.name} {...c} />
              ))}
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Confidence · Signal
              </p>
              <div className="grid grid-cols-3 gap-3">
                {CONFIDENCE.map((c) => (
                  <Swatch key={c.name} {...c} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Source accents
              </p>
              <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-white p-3 shadow-card">
                {SOURCES.map(([type, meta]) => (
                  <div key={type} className="flex items-center gap-3">
                    <span
                      className="grid h-8 w-8 place-items-center rounded-lg"
                      style={{ background: meta.tint }}
                    >
                      <SourceIcon type={type} size={16} />
                    </span>
                    <span className="flex-1 text-[13px] font-medium text-ink">{meta.label}</span>
                    <code className="font-mono text-[11px] text-muted-foreground">{meta.color}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 02 — Typography */}
      <Section n="02" title="Typography" desc="Geist for everything human, Geist Mono for everything machine.">
        <div className="grid gap-6 sm:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-border/70 bg-white p-5 shadow-card">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Display / UI
              </span>
              <p className="mt-2 font-sans text-[30px] font-semibold tracking-tight text-ink">Geist</p>
              <p className="mt-1 text-[13px] text-muted-foreground">300 · 400 · 500 · 600 · 700 · 800</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-white p-5 shadow-card">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Data / meta
              </span>
              <p className="mt-2 font-mono text-[28px] font-medium text-ink">Geist Mono</p>
              <p className="mt-1 font-mono text-[13px] text-muted-foreground">PATCH-142 · 84% · 12 Apr</p>
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-white p-5 shadow-card">
            {TYPE_SCALE.map((t) => (
              <div key={t.label} className="border-b border-border/60 py-3 last:border-b-0">
                <code className="mb-1 block font-mono text-[11px] text-muted-foreground">{t.label}</code>
                <p className={t.cls}>{t.sample}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 03 — Signature */}
      <Section n="03" title="Signature" desc="The thread and the signal meter — how trust and provenance are drawn.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Signal meter · confidence</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-end gap-8">
                <div className="flex flex-col items-center gap-2">
                  <SignalMeter level="high" score={84} animate={false} />
                  <span className="font-mono text-[11px] text-muted-foreground">high</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <SignalMeter level="medium" score={66} animate={false} />
                  <span className="font-mono text-[11px] text-muted-foreground">medium</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <SignalMeter level="low" score={41} animate={false} />
                  <span className="font-mono text-[11px] text-muted-foreground">low</span>
                </div>
              </div>
              <p className="text-[13px] text-muted-foreground">
                Four ascending reception bars. Ties the “Signal” team name to how much you can rely
                on an answer.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>The thread · node</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative flex flex-col items-center">
                  <span className="h-6 w-[2px] rounded-full bg-gradient-to-b from-primary/15 to-primary/55" />
                  <span className="thread-node-glow grid h-8 w-8 place-items-center rounded-full border border-primary/25 bg-white text-primary shadow-[0_2px_10px_-2px_rgba(99,91,255,0.45)]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <span className="h-6 w-[2px] rounded-full bg-gradient-to-b from-primary/55 to-primary/15" />
                </div>
                <p className="flex-1 text-[13px] text-muted-foreground">
                  Each context-pack section hangs off a node. The incoming segment draws, the node
                  lights, then the card arrives — a thread pulled through scattered knowledge.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 rounded-xl border border-border/70 bg-white p-5 shadow-card">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Source glyphs
          </p>
          <div className="flex flex-wrap gap-3">
            {SOURCES.map(([type, meta]) => (
              <div
                key={type}
                className="flex items-center gap-2 rounded-lg border border-border/70 px-2.5 py-1.5"
              >
                <span className="grid h-7 w-7 place-items-center rounded-md" style={{ background: meta.tint }}>
                  <SourceIcon type={type} size={16} />
                </span>
                <span className="text-[12.5px] font-medium text-slate">{meta.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 04 — Components */}
      <Section
        n="04"
        title="Components"
        desc="Every UI primitive with its component name and variants — a live Storybook."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Story name="<Button />" desc="variant · size">
            <div className="flex flex-col gap-4">
              <Variant label="variant">
                <Button>
                  Ask <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline">Outline</Button>
                <Button variant="subtle">Subtle</Button>
                <Button variant="ghost">Ghost</Button>
              </Variant>
              <Variant label="size">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" variant="outline" aria-label="Add">
                  <Plus className="h-4 w-4" />
                </Button>
              </Variant>
            </div>
          </Story>

          <Story name="<Badge />" desc="variant">
            <div className="flex flex-col gap-4">
              <Variant label="neutral">
                <Badge>Context pack</Badge>
                <Badge variant="outline">Owner</Badge>
                <Badge variant="muted">5 sources</Badge>
              </Variant>
              <Variant label="confidence">
                <Badge variant="high">Current</Badge>
                <Badge variant="med">Aging</Badge>
                <Badge variant="low">Stale</Badge>
              </Variant>
            </div>
          </Story>

          <Story name="<SignalMeter />" desc="confidence · Signal">
            <div className="flex items-end gap-8">
              {(['high', 'medium', 'low'] as const).map((lvl) => (
                <div key={lvl} className="flex flex-col items-center gap-2">
                  <SignalMeter level={lvl} score={lvl === 'high' ? 84 : lvl === 'medium' ? 66 : 41} animate={false} />
                  <code className="font-mono text-[10.5px] text-muted-foreground">{lvl}</code>
                </div>
              ))}
            </div>
          </Story>

          <Story name="<Avatar />" desc="AvatarFallback">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[
                  ['GH', '#635BFF'],
                  ['SK', '#A259FF'],
                  ['PP', '#0EA5E9'],
                ].map(([i, h]) => (
                  <Avatar key={i}>
                    <AvatarFallback style={{ background: `linear-gradient(135deg, ${h}, ${h}cc)` }}>
                      {i}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <code className="font-mono text-[11px] text-muted-foreground">stacked · overlap</code>
            </div>
          </Story>

          <Story name="<Tabs />">
            <Tabs defaultValue="a">
              <TabsList>
                <TabsTrigger value="a">Assistant</TabsTrigger>
                <TabsTrigger value="b">Sources</TabsTrigger>
                <TabsTrigger value="c">People</TabsTrigger>
              </TabsList>
            </Tabs>
          </Story>

          <Story name="<SourceIcon />" desc="type">
            <div className="flex flex-wrap gap-2.5">
              {(Object.keys(SOURCE_META) as SourceType[]).map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-2 rounded-lg border border-border/70 px-2.5 py-1.5"
                >
                  <span
                    className="grid h-7 w-7 place-items-center rounded-md"
                    style={{ background: SOURCE_META[type].tint }}
                  >
                    <SourceIcon type={type} size={16} />
                  </span>
                  <code className="font-mono text-[11px] text-slate">{type}</code>
                </div>
              ))}
            </div>
          </Story>

          <Story name="Freshness" desc="pattern">
            <div className="flex flex-wrap items-center gap-5">
              {[
                ['current', '#10B981'],
                ['aging', '#F59E0B'],
                ['stale', '#F43F5E'],
              ].map(([l, c]) => (
                <span key={l} className="inline-flex items-center gap-1.5 font-mono text-[12px]" style={{ color: c }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: c }} />
                  {l}
                </span>
              ))}
            </div>
          </Story>

          <Story name="<Separator />">
            <div className="flex flex-col gap-3">
              <span className="text-[13px] text-slate">Above</span>
              <Separator />
              <span className="text-[13px] text-slate">Below</span>
            </div>
          </Story>
        </div>
      </Section>

      {/* 05 — Context pack blocks */}
      <Section
        n="05"
        title="Context pack blocks"
        desc="The composed product sections, rendered live from a sample ContextPack."
      >
        <div className="flex flex-col gap-4">
          <Story name="<SummaryBlock />" desc="the answer + status + confidence">
            <SummaryBlock pack={SAMPLE} />
          </Story>
          <Story name="<SourcesBlock />" desc="provenance grid with freshness">
            <SourcesBlock pack={SAMPLE} />
          </Story>
          <div className="grid gap-4 md:grid-cols-2">
            <Story name="<PeopleBlock />" desc="who to talk to">
              <PeopleBlock pack={SAMPLE} />
            </Story>
            <Story name="<TimelineBlock />" desc="how it got here">
              <TimelineBlock pack={SAMPLE} />
            </Story>
          </div>
          <Story name="<NextStepsBlock />" desc="suggested steps + gaps">
            <NextStepsBlock pack={SAMPLE} />
          </Story>
        </div>
      </Section>

      {/* 06 — Foundations */}
      <Section n="06" title="Foundations" desc="Radius, elevation and the motion choreography.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-white p-5 shadow-card">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Radius &amp; elevation
            </p>
            <div className="flex items-end gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="h-16 w-16 rounded-sm border border-border bg-canvas" />
                <code className="font-mono text-[11px] text-muted-foreground">sm · .45rem</code>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-16 w-16 rounded-md border border-border bg-canvas" />
                <code className="font-mono text-[11px] text-muted-foreground">md · .6rem</code>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-16 w-16 rounded-lg border border-border bg-canvas" />
                <code className="font-mono text-[11px] text-muted-foreground">lg · .85rem</code>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-16 w-16 rounded-lg bg-white shadow-float" />
                <code className="font-mono text-[11px] text-muted-foreground">float</code>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-white p-5 shadow-card">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Motion · pack reveal
            </p>
            <div className="flex flex-col gap-2.5 font-mono text-[12px]">
              {[
                ['segment draws', 'delay 0 · 300ms'],
                ['node lights', 'delay 220ms · spring'],
                ['card arrives', 'delay 280ms · blur→0'],
                ['row stagger', '+550ms per section'],
                ['ease', 'cubic 0.22, 1, 0.36, 1'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-border/60 pb-2 last:border-b-0">
                  <span className="text-slate">{k}</span>
                  <span className="text-muted-foreground">{v}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-muted-foreground">
              Honors <code className="font-mono">prefers-reduced-motion</code> — reveals resolve
              instantly.
            </p>
          </div>
        </div>
      </Section>
    </div>
  )
}
