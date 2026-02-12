import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateGroup, useUpdateGroup } from '@/hooks/useGroups'
import type { Group } from '@/types'

interface GroupFormProps {
  group?: Group | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function GroupForm({ group, onSuccess, onCancel }: GroupFormProps) {
  const [name, setName] = useState(group?.name || '')
  
  const createGroup = useCreateGroup()
  const updateGroup = useUpdateGroup()
  
  const isEditing = !!group
  const isLoading = createGroup.isPending || updateGroup.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isEditing && group) {
        await updateGroup.mutateAsync({ id: group.id, data: { name } })
      } else {
        await createGroup.mutateAsync({ name })
      }
      setName('')
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save group:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Group' : 'Create New Group'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mathematics, Vocabulary, Physics..."
              required
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update Group' : 'Create Group'}
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
