import { apiClient } from './client'
import type { Story, SourceType, TopicId, ScoreValue } from '../types'

export async function fetchStories(editionId?: string): Promise<Story[]> {
  const params = editionId ? { editionId } : undefined
  return apiClient.get<Story[]>('/api/stories', { params })
}

export async function fetchUnassignedStories(): Promise<Story[]> {
  return apiClient.get<Story[]>('/api/stories', { params: { unassigned: true } })
}

export type StoryWritePayload = {
  title: string
  editorialComment: string
  source: { name: string; url: string; type: SourceType }
  signalScore: { impact: ScoreValue; hypeLevel: ScoreValue; sourceQuality: ScoreValue }
  topicIds: TopicId[]
  buzzwords: string[]
  publishedAt: string
  editionId: string | null
}

export async function createStory(data: StoryWritePayload): Promise<Story> {
  return apiClient.post<Story>('/api/stories', data)
}

export async function updateStory(id: string, data: StoryWritePayload): Promise<Story> {
  return apiClient.put<Story>(`/api/stories/${id}`, data)
}

export async function deleteStory(id: string): Promise<void> {
  await apiClient.delete<void>(`/api/stories/${id}`)
}
