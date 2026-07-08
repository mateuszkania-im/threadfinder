import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SCENARIOS } from '@/data/scenarios'
import { cn } from '@/lib/utils'

export function Composer({
  onAsk,
}: {
  onAsk: (question: string, scenarioId?: string) => void
}) {
  const [value, setValue] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onAsk(value.trim())
  }

  return (
    <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-6 pt-16 sm:pt-24">
      {/* aurora atmosphere behind the hero */}
      <div
        aria-hidden
        className="aurora pointer-events-none absolute -top-14 left-1/2 -z-10 h-[380px] w-[740px] max-w-[128vw] -translate-x-1/2 animate-aurora-drift opacity-90"
      />

      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate backdrop-blur"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        Project memory · one question away
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-balance text-center text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[46px]"
      >
        What do we already
        <br />
        know about&nbsp;
        <span className="bg-gradient-to-r from-[#17B866] via-[#2EE07E] to-[#4FE3C0] bg-clip-text text-transparent">
          this?
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-4 max-w-lg text-balance text-center text-[15px] leading-relaxed text-muted-foreground"
      >
        Ask in plain language. Threadfinder pulls the thread through Jira, Confluence,
        Figma, OneDrive and GitHub, and hands back a context pack, not just an answer.
      </motion.p>

      {/* ask box */}
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.22 }}
        className="group mt-8 flex w-full items-center gap-2 rounded-2xl border border-border bg-card p-2 pl-4 shadow-float transition-all focus-within:border-primary/40 focus-within:shadow-glow"
      >
        <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. what's the state of the Patchwork Branding work?"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-ink outline-none placeholder:text-muted-foreground/70"
        />
        <Button type="submit" size="lg" className="shrink-0 rounded-xl">
          Ask <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.form>

      {/* scenario chips = the three demo flows from the board */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.32 }}
        className="mt-6 w-full"
      >
        <p className="mb-2.5 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Popular questions
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => onAsk(s.question, s.id)}
              className={cn(
                'group flex flex-1 flex-col items-start gap-1.5 rounded-xl border border-border/80 bg-card/80 p-3.5 text-left backdrop-blur transition-all',
                'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card',
              )}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                {s.askedAs}
              </span>
              <span className="text-[13px] font-medium leading-snug text-ink transition-colors group-hover:text-primary">
                {s.question}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
