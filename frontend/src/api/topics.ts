import { apiClient } from './client'
import type { Topic } from '../types'

export async function fetchTopics(): Promise<Topic[]> {
  const response = await apiClient.get<Topic[]>('/api/topics')
  return response.data
}
