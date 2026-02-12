import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GroupForm } from '@/components/GroupForm'
import { GroupList } from '@/components/GroupList'

export function GroupsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Groups</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Hide Form' : 'Add Group'}
        </Button>
      </div>

      {showForm && (
        <GroupForm onSuccess={() => setShowForm(false)} />
      )}

      <GroupList />
    </div>
  )
}
