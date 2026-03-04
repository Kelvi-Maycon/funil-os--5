import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { GlobalSearch } from '@/components/GlobalSearch'
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary'
import { ThemeProvider } from '@/components/ThemeProvider'
import Layout from './components/Layout'

const Index = lazy(() => import('./pages/Index'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Funnels = lazy(() => import('./pages/Funnels'))
const Canvas = lazy(() => import('./pages/Canvas'))
const Tasks = lazy(() => import('./pages/Tasks'))
const Documents = lazy(() => import('./pages/Documents'))
const Library = lazy(() => import('./pages/Library'))

function AppSkeleton() {
  return (
    <div className="flex h-screen w-screen bg-background">
      <div className="w-64 border-r border-border bg-sidebar p-4 hidden md:flex flex-col gap-4 shrink-0">
        <div className="h-8 w-32 bg-muted rounded-md animate-pulse" />
        <div className="space-y-2 mt-8">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-10 w-full bg-muted rounded-md animate-pulse" />)}
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-20 border-b border-border flex items-center px-6 shrink-0 bg-background">
          <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="p-8 flex-1 gap-6 flex flex-col overflow-auto bg-background">
          <div className="h-32 w-full bg-muted rounded-xl animate-pulse shrink-0" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
             <div className="h-48 bg-muted rounded-xl animate-pulse" />
             <div className="h-48 bg-muted rounded-xl animate-pulse" />
             <div className="h-48 bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

const App = () => (
  <BrowserRouter>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <GlobalSearch />
        <GlobalErrorBoundary>
          <Suspense fallback={<AppSkeleton />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/projetos" element={<Projects />} />
                <Route path="/projetos/:id" element={<ProjectDetail />} />
                <Route path="/canvas" element={<Funnels />} />
                <Route path="/canvas/:id" element={<Canvas />} />
                <Route path="/tarefas" element={<Tasks />} />
                <Route path="/documentos" element={<Documents />} />
                <Route path="/biblioteca" element={<Library />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </GlobalErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  </BrowserRouter>
)

export default App

