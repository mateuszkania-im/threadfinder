import { SCENARIOS } from '@/data/scenarios'
import { HISTORY } from '@/data/history'
import type { ThreadfinderApi } from './client'

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/**
 * In-memory mock backed by the fixtures in `src/data/*`. Simulates orchestrator
 * latency so the retrieval animation and loading states match real behaviour.
 * Everything the UI shows comes from here — replace with `createHttpApi` to go live.
 */
export const mockApi: ThreadfinderApi = {
  async ask(question, opts) {
    await delay(1500)
    const q = question.trim()
    const byId = opts?.scenarioId
      ? SCENARIOS.find((s) => s.id === opts.scenarioId)
      : undefined
    const byText = q
      ? SCENARIOS.find((s) => s.question.toLowerCase().includes(q.toLowerCase().slice(0, 6)))
      : undefined
    const scenario = byId ?? byText ?? SCENARIOS[0]
    return { ...scenario, question: q || scenario.question }
  },

  async getHistory() {
    await delay(0)
    return HISTORY
  },
}
