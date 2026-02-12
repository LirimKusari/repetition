import { useState } from 'react'
import { Trash2, Edit2, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGroups, useDeleteGroup } from '@/hooks/useGroups'
import { useCards } from '@/hooks/useCards'
import { GroupForm } from './GroupForm'
import type { Group } from '@/types'

export function GroupList() {
  const { data: groups, isLoading, error } = useGroups()
  const { data: cards } = useCards()
  const deleteGroup = useDeleteGroup()
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)

  const getCardCount = (groupId: string) => {
    if (!cards) return 0
    return cards.filter((c) => c.group_id === groupId).length
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading groups...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading groups</div>
  }

  if (editingGroup) {
    return (
      <GroupForm
        group={editingGroup}
        onSuccess={() => setEditingGroup(null)}
        onCancel={() => setEditingGroup(null)}
      />
    )
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
        No groups yet. Create your first group above!
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <Card key={group.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[hsl(var(--secondary))]">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{group.name}</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {getCardCount(group.id)} cards
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingGroup(group)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteGroup.mutate(group.id)}
                  disabled={deleteGroup.isPending}
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
