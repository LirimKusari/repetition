import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateCard, useUpdateCard } from '@/hooks/useCards'
import { useGroups } from '@/hooks/useGroups'
import type { Card as CardType } from '@/types'

interface CardFormProps {
  card?: CardType | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function CardForm({ card, onSuccess, onCancel }: CardFormProps) {
  const [front, setFront] = useState(card?.front || '')
  const [back, setBack] = useState(card?.back || '')
  const [groupId, setGroupId] = useState<string>(card?.group_id || '')
  
  const { data: groups } = useGroups()
  const createCard = useCreateCard()
  const updateCard = useUpdateCard()
  
  const isEditing = !!card
  const isLoading = createCard.isPending || updateCard.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const data = {
      front,
      back,
      group_id: groupId || null,
    }

    try {
      if (isEditing && card) {
        await updateCard.mutateAsync({ id: card.id, data })
      } else {
        await createCard.mutateAsync(data)
      }
      setFront('')
      setBack('')
      setGroupId('')
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save card:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Card' : 'Create New Card'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="front">Question (Front)</Label>
            <Textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Enter the question..."
              required
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="back">Answer (Back)</Label>
            <Textarea
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Enter the answer..."
              required
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group">Group (Optional)</Label>
            <Select
              id="group"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            >
              <option value="">No group</option>
              {groups?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update Card' : 'Create Card'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
