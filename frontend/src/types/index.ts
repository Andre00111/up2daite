export type TopicId =
  | 'ai-research'
  | 'ai-products'
  | 'ai-policy'
  | 'ai-business'
  | 'ai-tools'

export type SourceType = 'primary' | 'analysis' | 'pr-driven'

export type EditionStatus = 'draft' | 'published'

export type ScoreValue = 1 | 2 | 3 | 4 | 5

export interface Topic {
  id: TopicId
  label: string
}

export interface Source {
  name: string
  url: string
  type: SourceType
}

export interface SignalScore {
  impact: ScoreValue
  hypeLevel: ScoreValue
  sourceQuality: ScoreValue
}

export interface Story {
  id: string
  title: string
  editorialComment: string
  source: Source
  topics: TopicId[]
  signalScore: SignalScore
  publishedAt: string
  editionId: string | null
}

export interface Edition {
  id: string
  slug: string
  number: number
  title: string
  publishedAt: string
  status: EditionStatus
  editorNote?: string
  storyIds: string[]
}

export interface Subscriber {
  id: string
  email: string
  topics: TopicId[]
  subscribedAt: string
}
