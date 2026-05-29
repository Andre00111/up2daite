import { apiClient } from './client'

export type SubscriberAdminDto = {
  id: string
  email: string
  subscribedAt: string
  confirmedAt: string | null
}

export type SendResult = { total: number; sent: number; failed: number }

export const subscribersApi = {
  subscribe(email: string): Promise<void> {
    return apiClient.post<void>('/api/subscribers', { email })
  },

  confirm(token: string): Promise<void> {
    return apiClient.get<void>('/api/subscribers/confirm', { params: { token } })
  },

  unsubscribe(token: string): Promise<void> {
    return apiClient.get<void>('/api/subscribers/unsubscribe', { params: { token } })
  },

  // Admin
  listAll(): Promise<SubscriberAdminDto[]> {
    return apiClient.get<SubscriberAdminDto[]>('/api/admin/subscribers')
  },

  sendEdition(editionId: string): Promise<SendResult> {
    return apiClient.post<SendResult>('/api/admin/newsletter/send', { editionId })
  },
}
