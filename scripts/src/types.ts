export type TopicId =
  | 'ai-research'
  | 'ai-products'
  | 'ai-policy'
  | 'ai-business'
  | 'ai-tools'

export type SourceType = 'primary' | 'analysis' | 'pr-driven'

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
  status: 'draft' | 'published'
  editorNote?: string
  storyIds: string[]
}

export interface AIJob {
  id: string
  title: string
  category: string
  riskScore: number
  trend: 'rising' | 'stable' | 'declining'
  reasoning: string
  affectedTasks: string[]
  sortOrder: number
}

export interface AIModel {
  id: string
  name: string
  company: string
  logo: string
  gradient: string
  accentColor: string
  rank: number
  category: string
  highlights: string[]
  releaseYear: number
}

export interface RawArticle {
  title: string
  link: string
  publishedAt: string
  sourceName: string
  sourceLanguage: 'de' | 'en'
  snippet: string
}

export interface ClaudeEditionResponse {
  edition: {
    title: string
    editor_note: string
  }
  stories: Array<{
    id_slug: string
    title: string
    editorial_comment: string
    source_name: string
    source_url: string
    source_type: SourceType
    signal_impact: ScoreValue
    signal_hype_level: ScoreValue
    signal_source_quality: ScoreValue
    published_at: string
    topic_ids: TopicId[]
  }>
  new_jobs: Array<{
    title: string
    category: string
    risk_score: number
    trend: 'rising' | 'stable' | 'declining'
    reasoning: string
    affected_tasks: string[]
  }>
}
