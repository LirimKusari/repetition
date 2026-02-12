import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cardsApi } from '@/api/cards'
import type { CreateCardRequest, UpdateCardRequest } from '@/types'

export function useCards() {
  return useQuery({
    queryKey: ['cards'],
    queryFn: cardsApi.getAll,
  })
}

export function useCard(id: string) {
  return useQuery({
    queryKey: ['cards', id],
    queryFn: () => cardsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateCard() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateCardRequest) => cardsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
      queryClient.invalidateQueries({ queryKey: ['study', 'stats'] })
    },
  })
}

export function useUpdateCard() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardRequest }) => 
      cardsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
  })
}

export function useDeleteCard() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => cardsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
      queryClient.invalidateQueries({ queryKey: ['study', 'stats'] })
    },
  })
}
