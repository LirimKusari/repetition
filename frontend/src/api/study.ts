import { get, post } from './client'
import type { Card, AnswerRequest, StudyStats } from '@/types'

export const studyApi = {
  getNextCard: () => get<Card>('/study/next'),
  submitAnswer: (data: AnswerRequest) => post<Card>('/study/answer', data),
  getStats: () => get<StudyStats>('/study/stats'),
}
