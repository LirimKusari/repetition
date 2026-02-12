import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { StudyCard } from '@/components/StudyCard'
import { SelfGrader } from '@/components/SelfGrader'
import { useStudyStore } from '@/stores/studyStore'
import { useNextCard, useSubmitAnswer } from '@/hooks/useStudy'
import { BookOpen, RefreshCw } from 'lucide-react'

export function StudyPage() {
  const { 
    currentCard, 
    userAnswer, 
    isRevealed,
    setCurrentCard,
    setUserAnswer,
    revealAnswer,
    reset
  } = useStudyStore()

  const { data: nextCard, isLoading, error, refetch } = useNextCard()
  const submitAnswer = useSubmitAnswer()

  // Set current card when data loads
  useEffect(() => {
    if (nextCard && !currentCard) {
      setCurrentCard(nextCard)
    }
  }, [nextCard, currentCard, setCurrentCard])

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    revealAnswer()
  }

  const handleGrade = async (correct: boolean) => {
    if (!currentCard) return

    try {
      await submitAnswer.mutateAsync({
        card_id: currentCard.id,
        correct,
      })
      reset()
      refetch()
    } catch (err) {
      console.error('Failed to submit answer:', err)
    }
  }

  const handleSkip = () => {
    reset()
    refetch()
  }

  // Loading state
  if (isLoading && !currentCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-[hsl(var(--muted-foreground))]" />
        <p className="mt-4 text-[hsl(var(--muted-foreground))]">Loading cards...</p>
      </div>
    )
  }

  // No cards available
  if (error || (!currentCard && !nextCard)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <BookOpen className="h-16 w-16 text-[hsl(var(--muted-foreground))] mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Cards Available</h2>
        <p className="text-[hsl(var(--muted-foreground))] text-center max-w-md mb-6">
          You don't have any flashcards yet. Create some cards first to start studying!
        </p>
        <Button onClick={() => window.location.href = '/cards'}>
          Go to Cards
        </Button>
      </div>
    )
  }

  const card = currentCard || nextCard

  if (!card) return null

  // Self-grading view
  if (isRevealed) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Study Mode</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Review your answer</p>
        </div>

        <SelfGrader
          card={card}
          userAnswer={userAnswer}
          onCorrect={() => handleGrade(true)}
          onIncorrect={() => handleGrade(false)}
          isSubmitting={submitAnswer.isPending}
        />
      </div>
    )
  }

  // Question view
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Study Mode</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Answer the question below</p>
      </div>

      <StudyCard card={card} />

      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={4}
              className="text-lg"
            />
            <div className="flex gap-3 justify-center">
              <Button type="button" variant="outline" onClick={handleSkip}>
                Skip
              </Button>
              <Button type="submit" size="lg">
                Submit Answer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
