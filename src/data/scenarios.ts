// ─────────────────────────────────────────────────────────────────────────────
// THREADFINDER — mock data (UI only).
// This is the exact shape the backend/orchestrator will later return per query.
// Every card in the context pack is driven by one field below, so wiring real
// data means swapping these objects — no component changes.
// ─────────────────────────────────────────────────────────────────────────────

export type SourceType =
  | 'jira'
  | 'confluence'
  | 'figma'
  | 'onedrive'
  | 'github'
  | 'doc'

export type Freshness = 'current' | 'aging' | 'stale'
export type Confidence = 'high' | 'medium' | 'low'
export type Relation = 'owner' | 'contributor' | 'reviewer' | 'knows'

export interface SourceItem {
  type: SourceType
  title: string
  ref: string // machine reference, rendered in mono
  meta: string // author · updated etc.
  freshness: Freshness
}

export interface Person {
  name: string
  initials: string
  role: string
  relation: Relation
  hue: string // gradient seed
}

export interface TimelineItem {
  date: string
  label: string
  kind: 'ticket' | 'design' | 'doc' | 'code' | 'decision'
}

export interface ContextPack {
  id: string
  scenario: string
  question: string
  askedAs: string // e.g. "New FE developer"
  summary: string
  status: { label: string; tone: 'active' | 'paused' | 'shipped' | 'unknown'; note: string }
  confidence: { level: Confidence; score: number; rationale: string }
  sources: SourceItem[]
  people: Person[]
  timeline: TimelineItem[]
  nextSteps: string[]
  gaps: string[]
}

export const SOURCE_META: Record<
  SourceType,
  { label: string; color: string; tint: string }
> = {
  jira: { label: 'Jira', color: '#2684FF', tint: 'rgba(38,132,255,0.12)' },
  confluence: { label: 'Confluence', color: '#2563EB', tint: 'rgba(37,99,235,0.12)' },
  figma: { label: 'Figma', color: '#A259FF', tint: 'rgba(162,89,255,0.12)' },
  onedrive: { label: 'OneDrive', color: '#0364B8', tint: 'rgba(3,100,184,0.12)' },
  github: { label: 'GitHub', color: '#1F2328', tint: 'rgba(31,35,40,0.10)' },
  doc: { label: 'Document', color: '#8B5CF6', tint: 'rgba(139,92,246,0.12)' },
}

export const SCENARIOS: ContextPack[] = [
  {
    id: 'paused-work',
    scenario: 'Picking up paused work',
    askedAs: 'New FE developer',
    question: "What's the state of the Patchwork Branding work — can I pick it up?",
    summary:
      'Patchwork Branding is a library-refresh project (rebrand of the shared component library) that ran for six weeks and was paused three months ago when the team shifted to the checkout rewrite. Design is largely done; the build stalled at ~60%. It is safe to pick up, but confirm the tokens with Design first — the palette changed after the last commit.',
    status: {
      label: 'Paused · 3 months',
      tone: 'paused',
      note: 'Last activity 12 Apr. No blocker recorded — deprioritised, not abandoned.',
    },
    confidence: {
      level: 'high',
      score: 84,
      rationale: 'Multiple aligned sources across Jira, Figma and GitHub, all cross-referenced.',
    },
    sources: [
      { type: 'jira', title: 'Patchwork Branding — component library refresh', ref: 'PATCH-142', meta: 'Epic · 18 of 30 issues done · Guy H.', freshness: 'aging' },
      { type: 'figma', title: 'Patchwork Branding — Library', ref: 'figma/patchwork-lib', meta: 'Updated 12 Apr · Sylwia K.', freshness: 'current' },
      { type: 'confluence', title: 'Rebrand rollout plan & token map', ref: 'WIKI/patchwork-rollout', meta: 'Edited 2 Apr · needs a refresh', freshness: 'stale' },
      { type: 'github', title: 'feat/patchwork-tokens (draft PR #318)', ref: 'gh:ui-kit#318', meta: '24 commits · last push 11 Apr', freshness: 'aging' },
      { type: 'onedrive', title: 'Brand palette v3 (final).pdf', ref: 'OneDrive · Brand', meta: 'Shared 9 Apr · supersedes v2', freshness: 'current' },
    ],
    people: [
      { name: 'Guy Harrow', initials: 'GH', role: 'Tech lead · epic owner', relation: 'owner', hue: '#635BFF' },
      { name: 'Sylwia K…', initials: 'SK', role: 'Product designer', relation: 'contributor', hue: '#A259FF' },
      { name: 'Pete Peters', initials: 'PP', role: 'Frontend · last on the PR', relation: 'knows', hue: '#0EA5E9' },
    ],
    timeline: [
      { date: '3 Mar 2026', label: 'Epic opened, scope agreed', kind: 'ticket' },
      { date: '18 Mar 2026', label: 'Design system tokens finalised', kind: 'design' },
      { date: '2 Apr 2026', label: 'Rollout plan drafted', kind: 'doc' },
      { date: '11 Apr 2026', label: 'Last commit, 60% of components', kind: 'code' },
      { date: '12 Apr 2026', label: 'Paused for checkout rewrite', kind: 'decision' },
    ],
    nextSteps: [
      'Confirm the current token set with Sylwia — palette v3 replaced the values in the draft PR.',
      'Reopen draft PR #318 and rebase onto main before continuing.',
      'Re-scope the remaining 12 issues in PATCH-142 with Guy.',
    ],
    gaps: [
      'Rollout doc is 3 months old and predates palette v3.',
      'No QA test plan attached to the epic yet.',
    ],
  },
  {
    id: 'previous-research',
    scenario: 'Finding previous research or decisions',
    askedAs: 'Product manager',
    question: 'Has there been recent research on onboarding activation?',
    summary:
      'Yes — the Insights team ran an onboarding activation study in Q1 and a follow-up usability round in early Q2. The headline finding: users drop off at the workspace-setup step, not at sign-up. A decision was recorded to defer the invite-teammates step until after first value. The research is recent enough to rely on, but the usability round only covered desktop.',
    status: {
      label: 'Recent · usable',
      tone: 'active',
      note: 'Most recent artefact 6 weeks old. Decision log is current.',
    },
    confidence: {
      level: 'medium',
      score: 66,
      rationale: 'Strong primary research, but mobile was out of scope and sample was small (n=12).',
    },
    sources: [
      { type: 'doc', title: 'Onboarding activation study — findings', ref: 'RES-2026-Q1-07', meta: 'Insights · 24 Feb · n=340', freshness: 'current' },
      { type: 'confluence', title: 'Usability round 2 — synthesis', ref: 'WIKI/onboarding-usability', meta: 'Edited 22 May · Daria N.', freshness: 'current' },
      { type: 'confluence', title: 'Decision log — defer invite step', ref: 'WIKI/decisions/onb-14', meta: 'Logged 28 May', freshness: 'current' },
      { type: 'figma', title: 'Activation flow — tested prototype', ref: 'figma/onb-activation', meta: 'v4 · desktop only', freshness: 'aging' },
      { type: 'jira', title: 'Rework workspace setup step', ref: 'ONB-231', meta: 'In progress · linked to findings', freshness: 'current' },
    ],
    people: [
      { name: 'Daria Novak', initials: 'DN', role: 'UX researcher · study lead', relation: 'owner', hue: '#635BFF' },
      { name: 'Marek L.', initials: 'ML', role: 'Product designer', relation: 'contributor', hue: '#A259FF' },
      { name: 'Flynn R.', initials: 'FR', role: 'PM · owns the decision', relation: 'reviewer', hue: '#10B981' },
    ],
    timeline: [
      { date: '24 Feb 2026', label: 'Activation study published (n=340)', kind: 'doc' },
      { date: '6 May 2026', label: 'Usability round 2 run', kind: 'design' },
      { date: '22 May 2026', label: 'Synthesis written up', kind: 'doc' },
      { date: '28 May 2026', label: 'Decision: defer invite step', kind: 'decision' },
    ],
    nextSteps: [
      'Reuse the Q1 findings — no need to commission new discovery for desktop.',
      'Scope a small mobile usability round to cover the gap before shipping.',
      'Link ONB-231 back to the decision log so the rationale travels with the ticket.',
    ],
    gaps: [
      'No mobile coverage in either research round.',
      'Follow-up usability sample was small (n=12).',
    ],
  },
  {
    id: 'overlap-ownership',
    scenario: 'Checking overlap, reuse or ownership',
    askedAs: 'Staff engineer',
    question: 'Is anyone already building a notifications service — and who owns it?',
    summary:
      'Partly. Two efforts overlap: the Growth team shipped an in-app notification centre last year, and the Platform team has an open RFC for a shared notifications service (email + push) that is still in discovery. There is a real risk of duplicating the delivery layer. Talk to Platform before building — they intend this to be the shared path.',
    status: {
      label: 'Overlap detected',
      tone: 'unknown',
      note: 'One shipped surface + one in-discovery service. No shared owner agreed yet.',
    },
    confidence: {
      level: 'medium',
      score: 58,
      rationale: 'Clear signals of overlap, but the RFC is unowned and scope boundaries are fuzzy.',
    },
    sources: [
      { type: 'confluence', title: 'RFC: shared notifications service', ref: 'RFC-081', meta: 'Discovery · Platform · edited 3 days ago', freshness: 'current' },
      { type: 'github', title: 'growth/notification-center', ref: 'gh:growth-web', meta: 'Shipped · maintained · 1.2k commits', freshness: 'current' },
      { type: 'jira', title: 'Spike: email + push delivery layer', ref: 'PLAT-540', meta: 'To do · unassigned', freshness: 'aging' },
      { type: 'figma', title: 'Notification preferences — concepts', ref: 'figma/notif-prefs', meta: 'Exploration · Growth', freshness: 'aging' },
      { type: 'doc', title: 'Q3 platform priorities (draft)', ref: 'OneDrive · Platform', meta: 'Mentions notifications · unconfirmed', freshness: 'stale' },
    ],
    people: [
      { name: 'Platform Guild', initials: 'PG', role: 'RFC-081 · no named owner', relation: 'owner', hue: '#F59E0B' },
      { name: 'Ola Bianchi', initials: 'OB', role: 'Growth eng · notif-center', relation: 'contributor', hue: '#635BFF' },
      { name: 'Sam O.', initials: 'SO', role: 'Staff eng · wrote the RFC', relation: 'knows', hue: '#A259FF' },
    ],
    timeline: [
      { date: 'Last yr', label: 'Growth ships notification centre', kind: 'code' },
      { date: '6 wks ago', label: 'RFC-081 opened in discovery', kind: 'doc' },
      { date: '3 wks ago', label: 'Delivery-layer spike created', kind: 'ticket' },
      { date: '3 days ago', label: 'RFC updated, still unowned', kind: 'decision' },
    ],
    nextSteps: [
      'Message Sam O. and the Platform Guild before scoping any build.',
      'Decide whether to extend growth/notification-center or start from the RFC.',
      'Push for a named owner on RFC-081 so the boundary gets agreed.',
    ],
    gaps: [
      'RFC-081 has no accountable owner.',
      'Q3 priorities doc is a draft — the mandate is not confirmed.',
    ],
  },
]
