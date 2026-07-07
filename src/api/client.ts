import type { ContextPack, HistoryGroup } from './types'

export interface AskOptions {
  /**
   * Mock-only hint: return this specific scenario. The live API can ignore it
   * (it will answer from the question text). Lets demo chips map to fixtures.
   */
  scenarioId?: string
  signal?: AbortSignal
}

/**
 * The single surface the UI talks to. Swap the implementation (mock ↔ http)
 * in `src/api/index.ts`; no component needs to change.
 */
export interface ThreadfinderApi {
  /** Ask a question, get back a full context pack. */
  ask(question: string, opts?: AskOptions): Promise<ContextPack>
  /** Sidebar conversation history, grouped by recency. */
  getHistory(): Promise<HistoryGroup[]>
}
