import { apiClient } from './client'
import type { Edition } from '../types'

export async function fetchEditions(status?: 'published' | 'draft'): Promise<Edition[]> {
  const params = status ? { status } : undefined
  return apiClient.get<Edition[]>('/api/editions', { params })
}

export async function fetchEditionBySlug(slug: string): Promise<Edition> {
  return apiClient.get<Edition>(`/api/editions/${slug}`)
}

export async function createEdition(data: Omit<Edition, 'storyIds' | 'status'>): Promise<Edition> {
  return apiClient.post<Edition>('/api/editions', data)
}
