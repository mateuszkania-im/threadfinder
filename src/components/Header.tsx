import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SHOW_DEV_TOOLS } from '@/lib/env'
import { SourceIcon } from '@/components/SourceIcon'
import { SOURCE_META, type SourceType } from '@/data/scenarios'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const CONNECTED: SourceType[] = ['jira', 'confluence', 'figma', 'onedrive', 'github']

export type Route = 'app' | 'design'

export function Header({
  route,
  onRoute,
  onMenu,
}: {
  route: Route
  onRoute: (r: Route) => void
  onMenu: () => void
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-white/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        {/* mobile menu */}
        <button
          onClick={onMenu}
          className="grid h-9 w-9 place-items-center rounded-lg border border-border/70 bg-white text-slate md:hidden"
          aria-label="Open history"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* connected sources */}
        <TooltipProvider delayDuration={120}>
          <div className="hidden items-center gap-1 sm:flex">
            <span className="mr-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Connected
            </span>
            {CONNECTED.map((s, i) => (
              <Tooltip key={s}>
                <TooltipTrigger asChild>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="grid h-7 w-7 place-items-center rounded-md border border-border/70 bg-white"
                  >
                    <SourceIcon type={s} size={15} />
                  </motion.span>
                </TooltipTrigger>
                <TooltipContent>{SOURCE_META[s].label} · synced</TooltipContent>
              </Tooltip>
            ))}
            <span className="ml-1.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5">
              <span className="h-1.5 w-1.5 animate-signal-pulse rounded-full bg-signal-high" />
              <span className="text-[11px] font-medium text-emerald-700">Live</span>
            </span>
          </div>
        </TooltipProvider>

        {/* route switcher — development only */}
        {SHOW_DEV_TOOLS && (
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground lg:inline">
              dev
            </span>
            <div className="flex items-center gap-0.5 rounded-full border border-border/70 bg-secondary/60 p-0.5">
              {(
                [
                  ['app', 'Assistant'],
                  ['design', 'Design system'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => onRoute(key)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-all',
                    route === key
                      ? 'bg-white text-ink shadow-[0_1px_3px_rgba(10,37,64,0.1)]'
                      : 'text-muted-foreground hover:text-slate',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
