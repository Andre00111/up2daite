import { apiClient } from './client'
import type { Story } from '../types'

export async function fetchStories(editionId?: string): Promise<Story[]> {
  const params = editionId ? { editionId } : undefined
  return apiClient.get<Story[]>('/api/stories', { params })
}

export async function fetchUnassignedStories(): Promise<Story[]> {
  return apiClient.get<Story[]>('/api/stories', { params: { unassigned: true } })
}

export async function createStory(data: Omit<Story, 'id'>): Promise<Story> {
  return apiClient.post<Story>('/api/stories', data)
}
