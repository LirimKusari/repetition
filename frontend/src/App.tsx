import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { BookOpen, Layers, FolderOpen, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dashboard } from '@/pages/Dashboard'
import { CardsPage } from '@/pages/CardsPage'
import { GroupsPage } from '@/pages/GroupsPage'
import { StudyPage } from '@/pages/StudyPage'

function NavLink({ to, children, icon: Icon }: { to: string; children: React.ReactNode; icon: React.ComponentType<{ className?: string }> }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
        isActive
          ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
          : 'hover:bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]'
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{children}</span>
    </Link>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))]/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <BookOpen className="h-6 w-6" />
              <span className="hidden sm:inline">WSR</span>
            </Link>

            <div className="flex items-center gap-2">
              <NavLink to="/" icon={Home}>Dashboard</NavLink>
              <NavLink to="/study" icon={BookOpen}>Study</NavLink>
              <NavLink to="/cards" icon={Layers}>Cards</NavLink>
              <NavLink to="/groups" icon={FolderOpen}>Groups</NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/groups" element={<GroupsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
