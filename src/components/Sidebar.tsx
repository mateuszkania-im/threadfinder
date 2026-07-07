import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Search,
} from 'lucide-react'
import { HISTORY, type HistoryItem } from '@/data/history'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { cn } from '@/lib/utils'

const DOT: Record<string, string> = {
  high: '#10B981',
  medium: '#F59E0B',
  low: '#F43F5E',
}

export function Sidebar({
  activeId,
  onNew,
  onSelect,
  open,
  onClose,
}: {
  activeId: string | null
  onNew: () => void
  onSelect: (item: HistoryItem) => void
  open: boolean
  onClose: () => void
}) {
  const [collapsed, setCollapsed] = useLocalStorage('tf.sidebar.collapsed', false)

  return (
    <>
      {/* mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'z-50 flex h-dvh shrink-0 flex-col border-r border-border/70 bg-white/80 backdrop-blur-xl',
          'fixed inset-y-0 left-0 transition-[width,transform] duration-300 ease-out md:sticky md:top-0 md:translate-x-0',
          collapsed ? 'w-[72px]' : 'w-[268px]',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {collapsed ? (
          <CollapsedRail
            activeId={activeId}
            onExpand={() => setCollapsed(false)}
            onNew={onNew}
            onSelect={onSelect}
          />
        ) : (
          <ExpandedBody
            activeId={activeId}
            onCollapse={() => setCollapsed(true)}
            onNew={onNew}
            onSelect={onSelect}
          />
        )}
      </aside>
    </>
  )
}

/* ── expanded ─────────────────────────────────────────────────────────────── */

function ExpandedBody({
  activeId,
  onCollapse,
  onNew,
  onSelect,
}: {
  activeId: string | null
  onCollapse: () => void
  onNew: () => void
  onSelect: (item: HistoryItem) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.05 }}
      className="flex min-h-0 flex-1 flex-col"
    >
      {/* brand */}
      <div className="flex items-center gap-2.5 px-4 pb-3 pt-4">
        <button onClick={onNew} className="flex items-center gap-2.5">
          <ThreadMark />
          <div className="leading-none">
            <span className="font-semibold tracking-tight text-ink">THREAD</span>
            <span className="font-semibold tracking-tight text-primary">FINDER</span>
          </div>
        </button>
        <button
          onClick={onCollapse}
          className="ml-auto hidden h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-ink md:grid"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* new + search */}
      <div className="flex flex-col gap-1.5 px-3 pb-2">
        <motion.button
          onClick={onNew}
          whileHover="h"
          whileTap={{ scale: 0.98 }}
          initial="r"
          animate="r"
          className="flex items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-[13.5px] font-medium text-ink shadow-sm transition-colors hover:border-primary/40"
        >
          <motion.span
            variants={{ r: { rotate: 0, scale: 1 }, h: { rotate: -12, scale: 1.08 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="grid h-6 w-6 place-items-center rounded-md bg-primary text-white"
          >
            <Pencil className="h-3.5 w-3.5" />
          </motion.span>
          New question
          <motion.span
            variants={{ r: { opacity: 0, x: -4 }, h: { opacity: 1, x: 0 } }}
            className="ml-auto text-primary"
          >
            <ArrowUpRight className="h-4 w-4" />
          </motion.span>
        </motion.button>
        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-secondary hover:text-slate">
          <Search className="h-4 w-4" />
          <span>Search history</span>
        </button>
      </div>

      {/* history */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        {HISTORY.map((group) => (
          <div key={group.label} className="mb-3">
            <p className="px-2 pb-1 pt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
              {group.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <HistoryRow
                  key={item.id}
                  item={item}
                  active={item.id === activeId}
                  onSelect={onSelect}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* footer */}
      <div className="border-t border-border/70 px-3 py-3">
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">
            S
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-[12.5px] font-medium text-ink">Team Signal</p>
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-signal-high"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              5 sources synced
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function HistoryRow({
  item,
  active,
  onSelect,
}: {
  item: HistoryItem
  active: boolean
  onSelect: (item: HistoryItem) => void
}) {
  return (
    <li>
      <motion.button
        onClick={() => onSelect(item)}
        whileHover="h"
        initial={false}
        animate={active ? 'h' : 'r'}
        className={cn(
          'group relative flex w-full items-center gap-2.5 overflow-hidden rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors',
          active ? 'bg-accent text-ink' : 'text-slate hover:bg-secondary',
        )}
      >
        {/* animated left accent bar */}
        <motion.span
          variants={{ r: { scaleY: 0, opacity: 0 }, h: { scaleY: 1, opacity: 1 } }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 origin-center rounded-full bg-primary"
        />
        <motion.span
          variants={{ r: { scale: 1 }, h: { scale: 1.35 } }}
          transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          className="ml-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: DOT[item.confidence] }}
        />
        <motion.span
          variants={{ r: { x: 0 }, h: { x: 2 } }}
          className="truncate"
        >
          {item.title}
        </motion.span>
        <motion.span
          variants={{ r: { opacity: 0, x: -4 }, h: { opacity: 1, x: 0 } }}
          className="ml-auto shrink-0 text-muted-foreground"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
        </motion.span>
      </motion.button>
    </li>
  )
}

/* ── collapsed rail ───────────────────────────────────────────────────────── */

function CollapsedRail({
  activeId,
  onExpand,
  onNew,
  onSelect,
}: {
  activeId: string | null
  onExpand: () => void
  onNew: () => void
  onSelect: (item: HistoryItem) => void
}) {
  const items = HISTORY.flatMap((g) => g.items)
  return (
    <TooltipProvider delayDuration={80}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="flex min-h-0 flex-1 flex-col items-center py-4"
      >
        <button onClick={onNew} aria-label="THREADFINDER" className="mb-2">
          <ThreadMark />
        </button>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onExpand}
              className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Expand</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={onNew}
              whileHover={{ scale: 1.08, rotate: -10 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 14 }}
              className="mt-1.5 grid h-9 w-9 place-items-center rounded-lg bg-primary text-white shadow-[0_2px_10px_-2px_rgba(99,91,255,0.55)]"
              aria-label="New question"
            >
              <Pencil className="h-4 w-4" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="right">New question</TooltipContent>
        </Tooltip>

        <div className="my-3 h-px w-8 bg-border" />

        <div className="flex min-h-0 flex-1 flex-col items-center gap-1 overflow-y-auto">
          {items.map((item) => {
            const active = item.id === activeId
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => onSelect(item)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      'grid h-9 w-9 place-items-center rounded-lg transition-colors',
                      active ? 'bg-accent' : 'hover:bg-secondary',
                    )}
                    aria-label={item.title}
                  >
                    <span
                      className={cn('h-2 w-2 rounded-full', active && 'ring-2 ring-offset-2 ring-offset-white')}
                      style={{
                        background: DOT[item.confidence],
                        ...(active ? { boxShadow: `0 0 0 2px ${DOT[item.confidence]}55` } : {}),
                      }}
                    />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        <span className="mt-3 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">
          S
        </span>
      </motion.div>
    </TooltipProvider>
  )
}

/* ── mark ─────────────────────────────────────────────────────────────────── */

function ThreadMark() {
  return (
    <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-ink">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 6c5 0 5 12 10 12 3 0 4-2 4-4"
          stroke="url(#tgs)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="5" cy="6" r="2" fill="#B7C3FF" />
        <circle cx="19" cy="14" r="1.6" fill="#FFC9E0" />
        <defs>
          <linearGradient id="tgs" x1="4" y1="6" x2="20" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B7C3FF" />
            <stop offset="1" stopColor="#C9B6FF" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  )
}
