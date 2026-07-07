import type { Route } from '@/components/Header'

// Base path Vite serves under: '/' in dev, '/threadfinder/' on GitHub Pages.
const BASE = import.meta.env.BASE_URL || '/'

const SEGMENT: Record<Route, string> = {
  app: '',
  design: 'design',
  contracts: 'api',
}

/** Route -> URL path (respecting the deploy base). */
export function routeToPath(route: Route): string {
  const seg = SEGMENT[route]
  return seg ? BASE + seg : BASE
}

/** URL path -> Route (unknown paths fall back to the assistant). */
export function pathToRoute(pathname: string): Route {
  let rel = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname
  rel = rel.replace(/^\/+/, '').replace(/\/+$/, '')
  if (rel === 'design') return 'design'
  if (rel === 'api') return 'contracts'
  return 'app'
}
