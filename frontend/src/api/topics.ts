import { apiClient } from './client'
import type { Topic } from '../types'

export async function fetchTopics(): Promise<Topic[]> {
  return apiClient.get<Topic[]>('/api/topics')
}
