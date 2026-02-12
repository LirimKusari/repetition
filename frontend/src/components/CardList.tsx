import { useState } from 'react'
import { Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCards, useDeleteCard } from '@/hooks/useCards'
import { useGroups } from '@/hooks/useGroups'
import { CardForm } from './CardForm'
import type { Card as CardType } from '@/types'

export function CardList() {
  const { data: cards, isLoading, error } = useCards()
  const { data: groups } = useGroups()
  const deleteCard = useDeleteCard()
  const [editingCard, setEditingCard] = useState<CardType | null>(null)

  const getGroupName = (groupId: string | null) => {
    if (!groupId || !groups) return 'No group'
    const group = groups.find((g) => g.id === groupId)
    return group?.name || 'Unknown'
  }

  const getBoxColor = (box: number) => {
    const colors = [
      'bg-red-100 text-red-800',
      'bg-orange-100 text-orange-800',
      'bg-yellow-100 text-yellow-800',
      'bg-lime-100 text-lime-800',
      'bg-green-100 text-green-800',
      'bg-emerald-100 text-emerald-800',
    ]
    return colors[Math.min(box - 1, colors.length - 1)]
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading cards...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading cards</div>
  }

  if (editingCard) {
    return (
      <CardForm
        card={editingCard}
        onSuccess={() => setEditingCard(null)}
        onCancel={() => setEditingCard(null)}
      />
    )
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
        No cards yet. Create your first card above!
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <Card key={card.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getBoxColor(card.box)}`}>
                    Box {card.box}
                  </span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {getGroupName(card.group_id)}
                  </span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    Weight: {card.weight.toFixed(2)}
                  </span>
                </div>
                <p className="font-medium text-sm mb-1 truncate">{card.front}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] truncate">{card.back}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingCard(card)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteCard.mutate(card.id)}
                  disabled={deleteCard.isPending}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
