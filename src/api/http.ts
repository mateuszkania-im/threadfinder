import type { ContextPack, HistoryGroup } from './types'
import type { AskOptions, ThreadfinderApi } from './client'

/**
 * Live HTTP client. Point `VITE_API_BASE_URL` at the backend and these two
 * endpoints take over — the response bodies must match `ContextPack` and
 * `HistoryGroup[]` (see `src/api/types.ts`).
 *
 *   POST {base}/ask      { question }        -> ContextPack
 *   GET  {base}/history                      -> HistoryGroup[]
 */
export function createHttpApi(baseUrl: string): ThreadfinderApi {
  const base = baseUrl.replace(/\/+$/, '')

  return {
    async ask(question: string, opts?: AskOptions): Promise<ContextPack> {
      const res = await fetch(`${base}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
        signal: opts?.signal,
      })
      if (!res.ok) throw new Error(`ask failed (${res.status})`)
      return (await res.json()) as ContextPack
    },

    async getHistory(): Promise<HistoryGroup[]> {
      const res = await fetch(`${base}/history`)
      if (!res.ok) throw new Error(`history failed (${res.status})`)
      return (await res.json()) as HistoryGroup[]
    },
  }
}
