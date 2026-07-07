import type { SourceType } from '@/data/scenarios'
import { SOURCE_META } from '@/data/scenarios'

/**
 * Compact, brand-tinted glyph for each connected source system.
 * Simple shapes rather than logos — recognisable, license-clean, on-palette.
 */
export function SourceIcon({ type, size = 18 }: { type: SourceType; size?: number }) {
  const { color } = SOURCE_META[type]
  const s = size
  const common = { width: s, height: s, viewBox: '0 0 24 24' as const }

  switch (type) {
    case 'jira':
      return (
        <svg {...common} fill="none" aria-hidden>
          <path d="M12 3 21 12 12 21 3 12z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M12 8.5 15.5 12 12 15.5 8.5 12z" fill={color} />
        </svg>
      )
    case 'confluence':
      return (
        <svg {...common} fill="none" aria-hidden>
          <path d="M4 16c3-5 6-6 10-3 3 2 5 2 6 1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M20 8c-3 5-6 6-10 3-3-2-5-2-6-1" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
        </svg>
      )
    case 'figma':
      return (
        <svg {...common} fill="none" aria-hidden>
          <circle cx="15" cy="12" r="3" stroke={color} strokeWidth="1.8" />
          <path d="M9 5h3v14a3 3 0 1 1-3-3h3M9 5a3 3 0 0 0 0 6h3M9 11a3 3 0 1 0 3 3" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )
    case 'onedrive':
      return (
        <svg {...common} fill="none" aria-hidden>
          <path d="M7 17h11a3 3 0 0 0 .4-6A5 5 0 0 0 9 9.5 3.5 3.5 0 0 0 7 17z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )
    case 'github':
      return (
        <svg {...common} fill="none" aria-hidden>
          <path d="M9 19c-4 1-4-2-6-2m12 4v-3.5c0-1 .1-1.4-.5-2 2-.2 4-1 4-4.5a3.5 3.5 0 0 0-1-2.5 3.3 3.3 0 0 0-.1-2.5S16 3 14 4.3a11 11 0 0 0-6 0C6 3 5.1 3.5 5.1 3.5A3.3 3.3 0 0 0 5 6a3.5 3.5 0 0 0-1 2.5C4 12 6 12.8 8 13c-.6.6-.6 1.2-.5 2V21" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return (
        <svg {...common} fill="none" aria-hidden>
          <path d="M7 3h7l4 4v14H7z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M14 3v4h4M9.5 12h5M9.5 15.5h5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
  }
}
