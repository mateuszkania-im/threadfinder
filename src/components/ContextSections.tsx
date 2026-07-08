import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { SignalMeter } from '@/components/SignalMeter'
import { SourceIcon } from '@/components/SourceIcon'
import { SOURCE_META, type ContextPack, type Freshness } from '@/data/scenarios'
import { cn } from '@/lib/utils'
import { ArrowUpRight, CircleDot, Sparkles } from 'lucide-react'

const FRESHNESS: Record<Freshness, { color: string; label: string }> = {
  current: { color: '#10B981', label: 'Current' },
  aging: { color: '#F59E0B', label: 'Aging' },
  stale: { color: '#F43F5E', label: 'Stale' },
}

const STATUS_TONE: Record<
  ContextPack['status']['tone'],
  { dot: string; badge: string }
> = {
  active: { dot: '#10B981', badge: 'bg-emerald-50 text-emerald-700' },
  paused: { dot: '#F59E0B', badge: 'bg-amber-50 text-amber-700' },
  shipped: { dot: '#635BFF', badge: 'bg-primary/10 text-primary' },
  unknown: { dot: '#F43F5E', badge: 'bg-rose-50 text-rose-600' },
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </span>
  )
}

/* ── 1. Summary — the answer, with status + confidence ──────────────────── */
export function SummaryBlock({ pack }: { pack: ContextPack }) {
  const tone = STATUS_TONE[pack.status.tone]
  return (
    <Card className="overflow-hidden shadow-float">
      <div className="h-1 w-full bg-gradient-to-r from-primary/70 via-src-figma/60 to-src-jira/60" />
      <CardContent className="p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> Context pack
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium',
              tone.badge,
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone.dot }} />
            {pack.status.label}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <SignalMeter level={pack.confidence.level} score={pack.confidence.score} />
          </div>
        </div>

        <p className="text-[15.5px] leading-relaxed text-slate">{pack.summary}</p>

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-canvas px-3.5 py-2.5">
          <CircleDot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {pack.status.note} · <span className="text-slate">{pack.confidence.rationale}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ── 2. Sources ─────────────────────────────────────────────────────────── */
export function SourcesBlock({ pack }: { pack: ContextPack }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Where this comes from</CardTitle>
        <Badge variant="muted">
          <span className="font-mono">{pack.sources.length}</span> sources
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-2.5 sm:grid-cols-2">
        {pack.sources.map((s, i) => {
          const meta = SOURCE_META[s.type]
          const fr = FRESHNESS[s.freshness]
          return (
            <motion.a
              key={s.ref}
              href="#"
              onClick={(e) => e.preventDefault()}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
              className="group flex items-start gap-3 rounded-lg border border-border/70 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card"
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                style={{ background: meta.tint }}
              >
                <SourceIcon type={s.type} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[13.5px] font-medium text-ink">{s.title}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{s.ref}</span>
                  <span
                    className="inline-flex items-center gap-1 font-mono text-[10.5px]"
                    style={{ color: fr.color }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: fr.color }} />
                    {fr.label}
                  </span>
                </div>
                <p className="mt-1 truncate text-[12px] text-muted-foreground">{s.meta}</p>
              </div>
            </motion.a>
          )
        })}
      </CardContent>
    </Card>
  )
}

/* ── 3. People ──────────────────────────────────────────────────────────── */
const RELATION_LABEL: Record<string, string> = {
  owner: 'Owner',
  contributor: 'Contributor',
  reviewer: 'Decision',
  knows: 'Ask them',
}

export function PeopleBlock({ pack }: { pack: ContextPack }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Who to talk to</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {pack.people.map((p, i) => (
          <div key={p.name}>
            {i > 0 && <Separator className="my-1" />}
            <div className="flex items-center gap-3 py-1.5">
              <Avatar>
                <AvatarFallback
                  style={{
                    background: `linear-gradient(135deg, ${p.hue}, ${p.hue}cc)`,
                  }}
                >
                  {p.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium text-ink">{p.name}</p>
                <p className="truncate text-[12px] text-muted-foreground">{p.role}</p>
              </div>
              <Badge variant={p.relation === 'knows' ? 'default' : 'outline'}>
                {RELATION_LABEL[p.relation]}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

/* ── 4. Timeline ────────────────────────────────────────────────────────── */
const KIND_COLOR: Record<string, string> = {
  ticket: '#2684FF',
  design: '#A259FF',
  doc: '#8B5CF6',
  code: '#1F2328',
  decision: '#635BFF',
}

const KIND_LABEL: Record<string, string> = {
  ticket: 'Ticket',
  design: 'Design',
  doc: 'Document',
  code: 'Code',
  decision: 'Decision',
}

export function TimelineBlock({ pack }: { pack: ContextPack }) {
  const kinds = Array.from(new Set(pack.timeline.map((t) => t.kind)))
  return (
    <Card>
      <CardHeader>
        <CardTitle>How it got here</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative ml-1 border-l border-dashed border-border pl-5">
          {pack.timeline.map((t, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.3 }}
              className="relative pb-3.5 last:pb-0"
            >
              <span
                className="absolute -left-[23px] top-1 h-2.5 w-2.5 rounded-full ring-2 ring-white"
                style={{ background: KIND_COLOR[t.kind] }}
              />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[11px] font-medium tabular text-muted-foreground">
                  {t.date}
                </span>
                <span className="text-[13px] text-slate">{t.label}</span>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* colour legend — what the dots mean */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border/60 pt-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
            What the dots mean
          </span>
          {kinds.map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 text-[12px] text-slate">
              <span className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR[k] }} />
              {KIND_LABEL[k]}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/* ── 5. Next steps + gaps ───────────────────────────────────────────────── */
export function NextStepsBlock({ pack }: { pack: ContextPack }) {
  return (
    <Card className="border-primary/20 bg-gradient-to-b from-accent/40 to-white">
      <CardHeader>
        <CardTitle>Suggested next steps</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          {pack.nextSteps.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.3 }}
              className="flex items-start gap-3"
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary font-mono text-[11px] font-semibold text-white">
                {i + 1}
              </span>
              <span className="text-[13.5px] leading-relaxed text-slate">{step}</span>
            </motion.li>
          ))}
        </ul>

        {pack.gaps.length > 0 && (
          <div className="rounded-lg border border-amber-200/70 bg-amber-50/60 p-3.5">
            <Eyebrow>Gaps &amp; caveats</Eyebrow>
            <ul className="mt-1.5 flex flex-col gap-1">
              {pack.gaps.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-[12.5px] text-amber-800">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
