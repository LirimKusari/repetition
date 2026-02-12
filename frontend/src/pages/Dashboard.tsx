import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStudyStats } from '@/hooks/useStudy'
import { useCards } from '@/hooks/useCards'
import { useGroups } from '@/hooks/useGroups'
import { BookOpen, Layers, FolderOpen, Play, TrendingUp } from 'lucide-react'

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStudyStats()
  const { data: cards } = useCards()
  const { data: groups } = useGroups()

  const boxLabels = ['New/Difficult', 'Learning', 'Developing', 'Retained', 'Mastering', 'Mastered']
  const boxColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Weighted Spaced Reinforcement</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Continuous learning with adaptive difficulty
        </p>
      </div>

      {/* Start Study Button */}
      <div className="flex justify-center">
        <Link to="/study">
          <Button size="lg" className="text-lg px-8 py-6">
            <Play className="h-6 w-6 mr-2" />
            Start Studying
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <Layers className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cards?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Groups</CardTitle>
            <FolderOpen className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Box</CardTitle>
            <TrendingUp className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.average_box ? stats.average_box.toFixed(1) : '—'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Box Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Card Distribution by Box
          </CardTitle>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="text-center py-4 text-[hsl(var(--muted-foreground))]">
              Loading statistics...
            </div>
          ) : !stats || stats.total_cards === 0 ? (
            <div className="text-center py-4 text-[hsl(var(--muted-foreground))]">
              No cards yet. Create some cards to see statistics.
            </div>
          ) : (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((box) => {
                const count = stats.cards_by_box[box] || 0
                const percentage = stats.total_cards > 0 
                  ? (count / stats.total_cards) * 100 
                  : 0

                return (
                  <div key={box} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Box {box}: {boxLabels[box - 1]}</span>
                      <span className="text-[hsl(var(--muted-foreground))]">
                        {count} cards ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[hsl(var(--secondary))] overflow-hidden">
                      <div
                        className={`h-full ${boxColors[box - 1]} transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/cards">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[hsl(var(--secondary))]">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Cards</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Create, edit, and organize your flashcards
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/groups">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[hsl(var(--secondary))]">
                <FolderOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Groups</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Organize cards into topic groups
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
