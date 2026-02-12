export interface Card {
  id: string
  front: string
  back: string
  box: number
  weight: number
  group_id: string | null
  created_at: string
  updated_at: string
}

export interface Group {
  id: string
  name: string
  created_at: string
}

export interface CreateCardRequest {
  front: string
  back: string
  group_id?: string | null
}

export interface UpdateCardRequest {
  front?: string
  back?: string
  group_id?: string | null
}

export interface CreateGroupRequest {
  name: string
}

export interface UpdateGroupRequest {
  name: string
}

export interface AnswerRequest {
  card_id: string
  correct: boolean
}

export interface StudyStats {
  total_cards: number
  cards_by_box: Record<number, number>
  average_box: number
  total_weight: number
}
