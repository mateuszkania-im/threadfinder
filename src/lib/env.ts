// App environment flags.
//
// `VITE_APP_ENV` drives which build we are in. When it is absent we treat the
// app as **development** (so dev-only affordances show by default). Only an
// explicit `production` hides them.
//
//   no env set            -> 'development' -> dev tools visible
//   VITE_APP_ENV=development -> dev tools visible
//   VITE_APP_ENV=production  -> dev tools hidden
//
// `.env.development` and `.env.production` set this per Vite mode; see .env.example.

export const APP_ENV: 'development' | 'production' =
  import.meta.env.VITE_APP_ENV === 'production' ? 'production' : 'development'

export const IS_PRODUCTION = APP_ENV === 'production'

/** Dev-only tooling (e.g. the Design system switcher) is shown outside production. */
export const SHOW_DEV_TOOLS = !IS_PRODUCTION
