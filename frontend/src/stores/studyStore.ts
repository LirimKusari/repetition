import { create } from 'zustand'
import type { Card } from '@/types'

interface StudyState {
  currentCard: Card | null
  userAnswer: string
  isRevealed: boolean
  setCurrentCard: (card: Card | null) => void
  setUserAnswer: (answer: string) => void
  revealAnswer: () => void
  reset: () => void
}

export const useStudyStore = create<StudyState>((set) => ({
  currentCard: null,
  userAnswer: '',
  isRevealed: false,
  setCurrentCard: (card) => set({ currentCard: card, userAnswer: '', isRevealed: false }),
  setUserAnswer: (answer) => set({ userAnswer: answer }),
  revealAnswer: () => set({ isRevealed: true }),
  reset: () => set({ currentCard: null, userAnswer: '', isRevealed: false }),
}))
