import { motion } from 'framer-motion'
import type { Confidence } from '@/data/scenarios'
import { cn } from '@/lib/utils'

const LEVELS: Record<Confidence, { bars: number; color: string; label: string }> = {
  high: { bars: 4, color: '#10B981', label: 'High confidence' },
  medium: { bars: 3, color: '#F59E0B', label: 'Medium confidence' },
  low: { bars: 2, color: '#F43F5E', label: 'Low confidence' },
}

/**
 * Signal-strength confidence meter — the team is "Signal", so trust is drawn
 * as reception bars. Four ascending bars fill to the confidence level.
 */
export function SignalMeter({
  level,
  score,
  animate = true,
  className,
}: {
  level: Confidence
  score?: number
  animate?: boolean
  className?: string
}) {
  const spec = LEVELS[level]
  const heights = [8, 12, 16, 20]

  return (
    <div className={cn('inline-flex items-end gap-[3px]', className)} aria-label={spec.label}>
      {heights.map((h, i) => {
        const on = i < spec.bars
        return (
          <motion.span
            key={i}
            initial={animate ? { scaleY: 0.15, opacity: 0.3 } : false}
            animate={{ scaleY: 1, opacity: on ? 1 : 0.22 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-[3.5px] origin-bottom rounded-full"
            style={{ height: h, background: on ? spec.color : '#C9D2DE' }}
          />
        )
      })}
      {typeof score === 'number' && (
        <span className="ml-1.5 font-mono text-[11px] font-medium tabular text-slate">
          {score}
          <span className="text-muted-foreground">%</span>
        </span>
      )}
    </div>
  )
}
