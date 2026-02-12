import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import type { Card as CardType } from '@/types'

interface SelfGraderProps {
  card: CardType
  userAnswer: string
  onCorrect: () => void
  onIncorrect: () => void
  isSubmitting: boolean
}

export function SelfGrader({ 
  card, 
  userAnswer, 
  onCorrect, 
  onIncorrect,
  isSubmitting 
}: SelfGraderProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">Compare Your Answer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question */}
        <div className="text-center p-4 rounded-lg bg-[hsl(var(--secondary))]">
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Question:</p>
          <p className="font-medium">{card.front}</p>
        </div>

        {/* Answers comparison */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* User's answer */}
          <div className="p-4 rounded-lg border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2 text-center">Your Answer:</p>
            <p className="text-center font-medium min-h-[60px] flex items-center justify-center">
              {userAnswer || <span className="text-[hsl(var(--muted-foreground))] italic">No answer provided</span>}
            </p>
          </div>

          {/* Correct answer */}
          <div className="p-4 rounded-lg border-2 border-[hsl(var(--success))] bg-green-50 dark:bg-green-950/20">
            <p className="text-sm text-[hsl(var(--success))] mb-2 text-center">Correct Answer:</p>
            <p className="text-center font-medium text-[hsl(var(--success))] min-h-[60px] flex items-center justify-center">
              {card.back}
            </p>
          </div>
        </div>

        {/* Self-grading buttons */}
        <div className="pt-4 border-t border-[hsl(var(--border))]">
          <p className="text-center text-sm text-[hsl(var(--muted-foreground))] mb-4">
            Did you get it right?
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="destructive"
              size="lg"
              onClick={onIncorrect}
              disabled={isSubmitting}
              className="flex-1 max-w-[200px]"
            >
              <X className="h-5 w-5 mr-2" />
              I Got It Wrong
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={onCorrect}
              disabled={isSubmitting}
              className="flex-1 max-w-[200px]"
            >
              <Check className="h-5 w-5 mr-2" />
              I Got It Right
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
