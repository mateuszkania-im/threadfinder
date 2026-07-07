// Mock conversation history for the sidebar (UI only).
// Each entry maps to one of the demo ContextPacks so clicking it loads a result.
import type { Confidence } from '@/data/scenarios'

export interface HistoryItem {
  id: string
  title: string
  scenarioId: string // -> ContextPack.id
  confidence: Confidence
}

export interface HistoryGroup {
  label: string
  items: HistoryItem[]
}

export const HISTORY: HistoryGroup[] = [
  {
    label: 'Today',
    items: [
      {
        id: 'h1',
        title: "State of the Patchwork Branding work?",
        scenarioId: 'paused-work',
        confidence: 'high',
      },
      {
        id: 'h2',
        title: 'Recent research on onboarding activation?',
        scenarioId: 'previous-research',
        confidence: 'medium',
      },
      {
        id: 'h3',
        title: 'Who owns a notifications service?',
        scenarioId: 'overlap-ownership',
        confidence: 'medium',
      },
    ],
  },
  {
    label: 'Yesterday',
    items: [
      {
        id: 'h4',
        title: 'Where did the checkout rewrite land?',
        scenarioId: 'paused-work',
        confidence: 'high',
      },
      {
        id: 'h5',
        title: 'Any prior work on the pricing page redesign?',
        scenarioId: 'overlap-ownership',
        confidence: 'low',
      },
    ],
  },
  {
    label: 'Earlier this week',
    items: [
      {
        id: 'h6',
        title: 'Is the design-token migration documented?',
        scenarioId: 'previous-research',
        confidence: 'medium',
      },
      {
        id: 'h7',
        title: 'Who last touched the auth service?',
        scenarioId: 'overlap-ownership',
        confidence: 'high',
      },
      {
        id: 'h8',
        title: 'What did the Q1 activation study find?',
        scenarioId: 'previous-research',
        confidence: 'high',
      },
    ],
  },
]
