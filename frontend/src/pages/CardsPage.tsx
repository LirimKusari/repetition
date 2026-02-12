import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardForm } from '@/components/CardForm'
import { CardList } from '@/components/CardList'

export function CardsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cards</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Hide Form' : 'Add Card'}
        </Button>
      </div>

      {showForm && (
        <CardForm onSuccess={() => setShowForm(false)} />
      )}

      <CardList />
    </div>
  )
}
