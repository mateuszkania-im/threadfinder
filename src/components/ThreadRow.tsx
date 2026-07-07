import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * One node on the THREADFINDER "thread". The incoming segment draws in, the
 * node lights up, then the card content arrives — in that order — so the whole
 * pack reads as a single thread being pulled through scattered knowledge.
 */
export function ThreadRow({
  icon,
  isFirst = false,
  isLast = false,
  delay = 0,
  play,
  children,
}: {
  icon: ReactNode
  isFirst?: boolean
  isLast?: boolean
  delay?: number
  play: boolean
  children: ReactNode
}) {
  const state = play ? 'in' : 'out'

  return (
    <div className="relative flex gap-4 sm:gap-5">
      {/* Thread gutter */}
      <div className="relative flex w-8 shrink-0 flex-col items-center">
        {/* incoming segment (draws first) */}
        {!isFirst && (
          <motion.span
            className="absolute left-1/2 top-0 h-[26px] w-[2px] -translate-x-1/2 origin-top rounded-full"
            style={{
              background: 'linear-gradient(180deg, rgba(99,91,255,0.15), rgba(99,91,255,0.55))',
            }}
            initial={false}
            variants={{ out: { scaleY: 0, opacity: 0 }, in: { scaleY: 1, opacity: 1 } }}
            animate={state}
            transition={{ delay, duration: 0.3, ease: 'easeOut' }}
          />
        )}

        {/* node */}
        <motion.span
          className="thread-node-glow relative z-10 mt-[22px] grid h-8 w-8 place-items-center rounded-full border border-primary/25 bg-white text-primary shadow-[0_2px_10px_-2px_rgba(99,91,255,0.45)]"
          initial={false}
          variants={{
            out: { scale: 0.4, opacity: 0 },
            in: { scale: 1, opacity: 1 },
          }}
          animate={state}
          transition={{ delay: delay + 0.22, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {icon}
        </motion.span>

        {/* outgoing segment (fills the rest of the row height) */}
        {!isLast && (
          <motion.span
            className={cn('w-[2px] flex-1 origin-top rounded-full')}
            style={{
              background: 'linear-gradient(180deg, rgba(99,91,255,0.55), rgba(99,91,255,0.15))',
            }}
            initial={false}
            variants={{ out: { scaleY: 0, opacity: 0 }, in: { scaleY: 1, opacity: 1 } }}
            animate={state}
            transition={{ delay: delay + 0.4, duration: 0.45, ease: 'easeOut' }}
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        className="min-w-0 flex-1 pb-6"
        initial={false}
        variants={{
          out: { opacity: 0, y: 14, filter: 'blur(6px)' },
          in: { opacity: 1, y: 0, filter: 'blur(0px)' },
        }}
        animate={state}
        transition={{ delay: delay + 0.28, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
