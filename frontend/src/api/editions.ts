import { apiClient } from './client'
import type { Edition } from '../types'

export async function fetchEditions(status?: 'published' | 'draft'): Promise<Edition[]> {
  const params = status ? { status } : {}
  const response = await apiClient.get<Edition[]>('/api/editions', { params })
  return response.data
}

export async function fetchEditionBySlug(slug: string): Promise<Edition> {
  const response = await apiClient.get<Edition>(`/api/editions/${slug}`)
  return response.data
}

export async function createEdition(data: Omit<Edition, 'storyIds' | 'status'>): Promise<Edition> {
  const response = await apiClient.post<Edition>('/api/editions', data)
  return response.data
}
