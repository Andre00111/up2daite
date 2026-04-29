import { apiClient } from './client'
import type { Story } from '../types'

export async function fetchStories(editionId?: string): Promise<Story[]> {
  const params = editionId ? { editionId } : {}
  const response = await apiClient.get<Story[]>('/api/stories', { params })
  return response.data
}

export async function fetchUnassignedStories(): Promise<Story[]> {
  const response = await apiClient.get<Story[]>('/api/stories', { params: { unassigned: true } })
  return response.data
}

export async function createStory(data: Omit<Story, 'id'>): Promise<Story> {
  const response = await apiClient.post<Story>('/api/stories', data)
  return response.data
}
