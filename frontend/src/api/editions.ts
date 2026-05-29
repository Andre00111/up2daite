import { apiClient } from './client'
import type { Edition } from '../types'

export async function fetchEditions(status?: 'published' | 'draft'): Promise<Edition[]> {
  const params = status ? { status } : undefined
  return apiClient.get<Edition[]>('/api/editions', { params })
}

export async function fetchEditionBySlug(slug: string): Promise<Edition> {
  return apiClient.get<Edition>(`/api/editions/${slug}`)
}

export type EditionWritePayload = {
  title: string
  editorNote?: string
  publishedAt?: string
  storyIds: string[]
}

export async function createEdition(data: EditionWritePayload): Promise<Edition> {
  return apiClient.post<Edition>('/api/editions', data)
}

export async function updateEdition(id: string, data: EditionWritePayload): Promise<Edition> {
  return apiClient.put<Edition>(`/api/editions/${id}`, data)
}

export async function deleteEdition(id: string): Promise<void> {
  await apiClient.delete<void>(`/api/editions/${id}`)
}

export async function publishEdition(id: string): Promise<Edition> {
  return apiClient.put<Edition>(`/api/editions/${id}/publish`, {})
}

export async function unpublishEdition(id: string): Promise<Edition> {
  return apiClient.put<Edition>(`/api/editions/${id}/unpublish`, {})
}
