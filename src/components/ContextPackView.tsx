import { motion } from 'framer-motion'
import { Activity, Layers, ListChecks, Sparkles, Users } from 'lucide-react'
import type { ContextPack } from '@/data/scenarios'
import { ThreadRow } from '@/components/ThreadRow'
import {
  NextStepsBlock,
  PeopleBlock,
  SourcesBlock,
  SummaryBlock,
  TimelineBlock,
} from '@/components/ContextSections'

const ICON = 'h-4 w-4'

export function ContextPackView({ pack, play }: { pack: ContextPack; play: boolean }) {
  const rows = [
    { icon: <Sparkles className={ICON} />, node: <SummaryBlock pack={pack} /> },
    { icon: <Layers className={ICON} />, node: <SourcesBlock pack={pack} /> },
    { icon: <Users className={ICON} />, node: <PeopleBlock pack={pack} /> },
    { icon: <Activity className={ICON} />, node: <TimelineBlock pack={pack} /> },
    { icon: <ListChecks className={ICON} />, node: <NextStepsBlock pack={pack} /> },
  ]

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* the question, echoed as the user's ask */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex flex-col items-end"
      >
        <span className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {pack.askedAs} asked
        </span>
        <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-ink px-4 py-2.5 text-[14px] leading-snug text-white shadow-float">
          {pack.question}
        </div>
      </motion.div>

      <div className="flex flex-col">
        {rows.map((r, i) => (
          <ThreadRow
            key={i}
            icon={r.icon}
            isFirst={i === 0}
            isLast={i === rows.length - 1}
            delay={0.1 + i * 0.55}
            play={play}
          >
            {r.node}
          </ThreadRow>
        ))}
      </div>
    </div>
  )
}
