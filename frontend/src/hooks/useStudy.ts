import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studyApi } from '@/api/study'
import type { AnswerRequest } from '@/types'

export function useNextCard() {
  return useQuery({
    queryKey: ['study', 'next'],
    queryFn: studyApi.getNextCard,
    retry: false,
  })
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: AnswerRequest) => studyApi.submitAnswer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study', 'next'] })
      queryClient.invalidateQueries({ queryKey: ['study', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
  })
}

export function useStudyStats() {
  return useQuery({
    queryKey: ['study', 'stats'],
    queryFn: studyApi.getStats,
  })
}
