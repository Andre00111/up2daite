import { apiClient } from './client'

export type AIJob = {
  id: string
  title: string
  category: string
  riskScore: number
  trend: 'rising' | 'stable' | 'declining'
  reasoning: string
  affectedTasks: string[]
  sortOrder: number
}

export type AIJobWritePayload = {
  title: string
  category: string
  riskScore: number
  trend: 'rising' | 'stable' | 'declining'
  reasoning: string
  affectedTasks: string[]
  sortOrder?: number
}

export const aiJobsApi = {
  list(): Promise<AIJob[]> {
    return apiClient.get<AIJob[]>('/api/ai-jobs')
  },
  create(data: AIJobWritePayload): Promise<AIJob> {
    return apiClient.post<AIJob>('/api/ai-jobs', data)
  },
  update(id: string, data: AIJobWritePayload): Promise<AIJob> {
    return apiClient.put<AIJob>(`/api/ai-jobs/${id}`, data)
  },
  remove(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/ai-jobs/${id}`)
  },
}
