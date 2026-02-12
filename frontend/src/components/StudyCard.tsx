import { Card, CardContent } from '@/components/ui/card'
import type { Card as CardType } from '@/types'

interface StudyCardProps {
  card: CardType
  showAnswer?: boolean
}

export function StudyCard({ card, showAnswer = false }: StudyCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center">
          <div className="mb-4">
            <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]">
              Box {card.box}
            </span>
          </div>
          
          <div className="min-h-[120px] flex items-center justify-center">
            <p className="text-xl font-medium">{card.front}</p>
          </div>
          
          {showAnswer && (
            <div className="mt-6 pt-6 border-t border-[hsl(var(--border))]">
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">Correct Answer:</p>
              <p className="text-lg text-[hsl(var(--success))] font-medium">{card.back}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
