import { apiClient } from './client'

export type AIModel = {
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

export type AIModelWritePayload = {
  name: string
  company: string
  logo?: string
  gradient?: string
  accentColor?: string
  rank: number
  category?: string
  highlights: string[]
  releaseYear?: number
}

export const aiModelsApi = {
  list(): Promise<AIModel[]> {
    return apiClient.get<AIModel[]>('/api/ai-models')
  },
  create(data: AIModelWritePayload): Promise<AIModel> {
    return apiClient.post<AIModel>('/api/ai-models', data)
  },
  update(id: string, data: AIModelWritePayload): Promise<AIModel> {
    return apiClient.put<AIModel>(`/api/ai-models/${id}`, data)
  },
  remove(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/ai-models/${id}`)
  },
}
