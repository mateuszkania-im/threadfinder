// Wire types shared by the mock and the live API. These are the exact shapes
// the backend must return — keep them in sync with the server contract.
export type {
  ContextPack,
  SourceItem,
  Person,
  TimelineItem,
  SourceType,
  Freshness,
  Confidence,
  Relation,
} from '@/data/scenarios'
export type { HistoryItem, HistoryGroup } from '@/data/history'
