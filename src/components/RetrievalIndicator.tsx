import { motion } from 'framer-motion'
import { SourceIcon } from '@/components/SourceIcon'
import { SOURCE_META, type SourceType } from '@/data/scenarios'

const SWEEP: SourceType[] = ['jira', 'confluence', 'figma', 'onedrive', 'github']

/** Shown briefly while the (mock) orchestrator "retrieves". Sources light up
 *  one by one, then the thread ties them together. */
export function RetrievalIndicator({ question }: { question: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mx-auto flex w-full max-w-xl flex-col items-center px-6 py-20 text-center"
    >
      <div className="relative mb-8 flex items-center gap-3">
        {SWEEP.map((s, i) => (
          <motion.span
            key={s}
            className="grid h-11 w-11 place-items-center rounded-xl border border-border/70 bg-card shadow-card"
            initial={{ opacity: 0.3, scale: 0.9, y: 0 }}
            animate={{
              opacity: [0.3, 1, 0.55],
              scale: [0.9, 1.08, 1],
              y: [0, -6, 0],
              borderColor: ['rgba(10,37,64,0.08)', SOURCE_META[s].color, 'rgba(10,37,64,0.08)'],
            }}
            transition={{
              duration: 1.1,
              delay: i * 0.14,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          >
            <SourceIcon type={s} size={19} />
          </motion.span>
        ))}
        {/* threading sweep */}
        <motion.span
          className="pointer-events-none absolute -bottom-3 left-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ width: 0, x: 0, opacity: 0 }}
          animate={{ width: ['0%', '100%'], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ left: 0, right: 0 }}
        />
      </div>

      <RotatingStatus />

      <p className="mt-2 max-w-md text-[13px] text-muted-foreground">
        “{question}”
      </p>
    </motion.div>
  )
}

const STEPS = [
  'Searching connected sources…',
  'Reading tickets, docs and designs…',
  'Checking who was involved…',
  'Assessing freshness &amp; confidence…',
  'Threading it into a context pack…',
]

function RotatingStatus() {
  return (
    <div className="h-6 overflow-hidden">
      <motion.div
        animate={{ y: STEPS.map((_, i) => -i * 24) }}
        transition={{
          duration: STEPS.length * 0.42,
          ease: 'linear',
          times: STEPS.map((_, i) => i / (STEPS.length - 1)),
        }}
      >
        {STEPS.map((s) => (
          <div
            key={s}
            className="flex h-6 items-center justify-center gap-2 text-[14px] font-medium text-ink"
          >
            <span className="h-1.5 w-1.5 animate-signal-pulse rounded-full bg-primary" />
            <span dangerouslySetInnerHTML={{ __html: s }} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
