import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Header, type Route } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { DesignSystem } from '@/components/DesignSystem'
import { Composer } from '@/components/Composer'
import { RetrievalIndicator } from '@/components/RetrievalIndicator'
import { ContextPackView } from '@/components/ContextPackView'
import { Button } from '@/components/ui/button'
import { SCENARIOS, type ContextPack } from '@/data/scenarios'
import { HISTORY, type HistoryItem } from '@/data/history'
import { SHOW_DEV_TOOLS } from '@/lib/env'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { cn } from '@/lib/utils'

type Mode = 'idle' | 'thinking' | 'answer'

const ALL_HISTORY = HISTORY.flatMap((g) => g.items)

function packFor(item: HistoryItem): ContextPack | null {
  const scenario = SCENARIOS.find((s) => s.id === item.scenarioId)
  return scenario ? { ...scenario, question: item.title } : null
}

export default function App() {
  const [route, setRoute] = useState<Route>('app')
  const [mode, setMode] = useState<Mode>('idle')
  const [pack, setPack] = useState<ContextPack | null>(null)
  const [play, setPlay] = useState(false)
  const [activeHistoryId, setActiveHistoryId] = useLocalStorage<string | null>(
    'tf.activeThread',
    null,
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  const ask = useCallback((next: ContextPack) => {
    clearTimers()
    setPlay(false)
    setPack(next)
    setMode('thinking')
    // mock orchestrator latency, then reveal + play the thread
    timers.current.push(
      window.setTimeout(() => {
        setMode('answer')
        timers.current.push(window.setTimeout(() => setPlay(true), 60))
      }, 1750),
    )
  }, [])

  // Restore the last opened thread on load — instantly, no retrieval replay.
  useEffect(() => {
    const item = activeHistoryId ? ALL_HISTORY.find((i) => i.id === activeHistoryId) : null
    const restored = item ? packFor(item) : null
    if (restored) {
      setPack(restored)
      setMode('answer')
      setPlay(true)
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reset = () => {
    clearTimers()
    setMode('idle')
    setPlay(false)
    setPack(null)
    setActiveHistoryId(null)
    setRoute('app')
    setSidebarOpen(false)
  }

  const selectHistory = (item: HistoryItem) => {
    const next = packFor(item)
    if (!next) return
    setActiveHistoryId(item.id)
    setRoute('app')
    setSidebarOpen(false)
    ask(next)
  }

  const effectiveRoute: Route = SHOW_DEV_TOOLS ? route : 'app'

  return (
    <div className="app-canvas flex min-h-dvh">
      <Sidebar
        activeId={activeHistoryId}
        onNew={reset}
        onSelect={selectHistory}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header route={route} onRoute={setRoute} onMenu={() => setSidebarOpen(true)} />

        {effectiveRoute === 'design' && <DesignSystem />}

        {/* answer top bar */}
        <AnimatePresence>
          {effectiveRoute === 'app' && mode === 'answer' && pack && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="sticky top-16 z-20 border-b border-border/60 bg-white/70 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 px-5 py-2.5">
                {SHOW_DEV_TOOLS ? (
                  <>
                    <span className="mr-1 hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:inline">
                      dev · scenarios
                    </span>
                    <div className="flex flex-1 items-center gap-1.5 overflow-x-auto">
                      {SCENARIOS.map((s, i) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setActiveHistoryId(null)
                            ask(s)
                          }}
                          className={cn(
                            'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-all',
                            s.id === pack.id && !activeHistoryId
                              ? 'border-transparent bg-ink text-white'
                              : 'border-border/70 bg-white text-slate hover:border-primary/30 hover:text-primary',
                          )}
                        >
                          <span className="font-mono text-[10px] opacity-70">0{i + 1}</span>
                          {s.scenario}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate text-[13px] font-medium text-ink">{pack.question}</span>
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={reset} className="shrink-0">
                  <Plus className="h-4 w-4" /> New question
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {effectiveRoute === 'app' && (
          <main className="relative pb-28">
            <AnimatePresence mode="wait">
              {mode === 'idle' && (
                <motion.div key="idle" exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                  <Composer onAsk={ask} />
                </motion.div>
              )}

              {mode === 'thinking' && pack && (
                <RetrievalIndicator key="thinking" question={pack.question} />
              )}

              {mode === 'answer' && pack && (
                <motion.div
                  key={`answer-${pack.id}-${activeHistoryId ?? 'demo'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-5 pt-10"
                >
                  <ContextPackView pack={pack} play={play} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        )}
      </div>
    </div>
  )
}
