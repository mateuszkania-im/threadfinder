import { mockApi } from './mock'
import { createHttpApi } from './http'
import type { ThreadfinderApi } from './client'

const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined

/**
 * The one place data comes from. No `VITE_API_BASE_URL` → in-memory mock
 * (default, what the demo ships with). Set it → live HTTP API. Nothing else
 * in the app references the data source directly.
 */
export const api: ThreadfinderApi = baseUrl ? createHttpApi(baseUrl) : mockApi

/** True while running on fixtures — handy for a "demo data" badge, etc. */
export const IS_MOCK = !baseUrl

export type { ThreadfinderApi, AskOptions } from './client'
export type * from './types'
