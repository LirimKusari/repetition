import { get, post, put, del } from './client'
import type { Card, CreateCardRequest, UpdateCardRequest } from '@/types'

export const cardsApi = {
  getAll: () => get<Card[]>('/cards'),
  getById: (id: string) => get<Card>(`/cards/${id}`),
  create: (data: CreateCardRequest) => post<Card>('/cards', data),
  update: (id: string, data: UpdateCardRequest) => put<Card>(`/cards/${id}`, data),
  delete: (id: string) => del<{ message: string }>(`/cards/${id}`),
}
