import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, RotateCcw } from 'lucide-react'
import { Header, type Route } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { DesignSystem } from '@/components/DesignSystem'
import { ContractsPage } from '@/components/ContractsPage'
import { Composer } from '@/components/Composer'
import { RetrievalIndicator } from '@/components/RetrievalIndicator'
import { ContextPackView } from '@/components/ContextPackView'
import { Button } from '@/components/ui/button'
import { SCENARIOS, type ContextPack } from '@/data/scenarios'
import type { HistoryGroup, HistoryItem } from '@/data/history'
import { api } from '@/api'
import { SHOW_DEV_TOOLS } from '@/lib/env'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { cn } from '@/lib/utils'

type Mode = 'idle' | 'thinking' | 'answer' | 'error'

export default function App() {
  const [route, setRoute] = useState<Route>('app')
  const [mode, setMode] = useState<Mode>('idle')
  const [pack, setPack] = useState<ContextPack | null>(null)
  const [pendingQuestion, setPendingQuestion] = useState('')
  const [play, setPlay] = useState(false)
  const [history, setHistory] = useState<HistoryGroup[]>([])
  const [activeHistoryId, setActiveHistoryId] = useLocalStorage<string | null>(
    'tf.activeThread',
    null,
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const reqRef = useRef(0)

  // One async entry point. Everything (chips, history, free text) routes here.
  const ask = useCallback((question: string, scenarioId?: string) => {
    const reqId = ++reqRef.current
    setPlay(false)
    setPendingQuestion(question)
    setMode('thinking')
    api
      .ask(question, { scenarioId })
      .then((result) => {
        if (reqRef.current !== reqId) return
        setPack(result)
        setMode('answer')
        setTimeout(() => {
          if (reqRef.current === reqId) setPlay(true)
        }, 60)
      })
      .catch(() => {
        if (reqRef.current !== reqId) return
        setMode('error')
      })
  }, [])

  // Load sidebar history from the API, then restore the last opened thread.
  useEffect(() => {
    let cancelled = false
    api.getHistory().then((groups) => {
      if (cancelled) return
      setHistory(groups)
      const id = activeHistoryId
      const item = id ? groups.flatMap((g) => g.items).find((i) => i.id === id) : null
      if (item) ask(item.title, item.scenarioId)
    })
    return () => {
      cancelled = true
    }
    // mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reset = () => {
    reqRef.current++
    setMode('idle')
    setPlay(false)
    setPack(null)
    setPendingQuestion('')
    setActiveHistoryId(null)
    setRoute('app')
    setSidebarOpen(false)
  }

  const selectHistory = (item: HistoryItem) => {
    setActiveHistoryId(item.id)
    setRoute('app')
    setSidebarOpen(false)
    ask(item.title, item.scenarioId)
  }

  const effectiveRoute: Route = SHOW_DEV_TOOLS ? route : 'app'

  return (
    <div className="app-canvas flex min-h-dvh">
      <Sidebar
        history={history}
        activeId={activeHistoryId}
        onNew={reset}
        onSelect={selectHistory}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header route={route} onRoute={setRoute} onMenu={() => setSidebarOpen(true)} />

        {effectiveRoute === 'design' && <DesignSystem />}
        {effectiveRoute === 'contracts' && <ContractsPage />}

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
                            ask(s.question, s.id)
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

              {mode === 'thinking' && (
                <RetrievalIndicator key="thinking" question={pendingQuestion} />
              )}

              {mode === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto flex w-full max-w-md flex-col items-center px-6 py-24 text-center"
                >
                  <p className="text-[15px] font-medium text-ink">Couldn’t reach the assistant</p>
                  <p className="mt-1.5 text-[13px] text-muted-foreground">
                    The request didn’t come back. Check the connection and try again.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-5"
                    onClick={() => ask(pendingQuestion)}
                  >
                    <RotateCcw className="h-4 w-4" /> Retry
                  </Button>
                </motion.div>
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
