import { useState, useMemo } from 'react'
import useTaskStore from '@/stores/useTaskStore'
import useProjectStore from '@/stores/useProjectStore'
import useFunnelStore from '@/stores/useFunnelStore'
import useDocumentStore from '@/stores/useDocumentStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Filter, LayoutGrid, List, AlertTriangle, X } from 'lucide-react'
import TasksBoard from '@/components/tasks/TasksBoard'
import TasksList from '@/components/tasks/TasksList'
import TaskDetailSheet from '@/components/tasks/TaskDetailSheet'
import { Task } from '@/types'

export default function Tasks() {
  const [tasks, setTasks] = useTaskStore()
  const [projects] = useProjectStore()
  const [, setAction] = useQuickActionStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [search, setSearch] = useState('')
  const [filterProject, setFilterProject] = useState<string | null>(null)
  const [filterPriority, setFilterPriority] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)))
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      if (filterProject && t.projectId !== filterProject) return false
      if (filterPriority && t.priority !== filterPriority) return false
      return true
    })
  }, [tasks, search, filterProject, filterPriority])

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pendente').length,
    inProgress: tasks.filter(t => t.status === 'Em Progresso').length,
    done: tasks.filter(t => t.status === 'Concluída').length,
    overdue: tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'Concluída').length,
  }), [tasks])

  const hasActiveFilters = filterProject || filterPriority

  return (
    <div className="p-6 md:p-8 max-w-[1600px] w-full mx-auto h-full flex flex-col animate-fade-in">
      <Tabs defaultValue="board" className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-col gap-4 mb-6 shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-display">Tarefas</h1>
              <p className="text-subhead">Gerencie seu fluxo de trabalho e prioridades</p>
            </div>
            <Button className="btn-primary" onClick={() => setAction({ type: 'task', mode: 'create' })}>
              <Plus size={16} className="mr-2" /> Nova Tarefa
            </Button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-6 px-4 py-2.5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-muted-foreground" /><span className="text-caption">{stats.pending} pendentes</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-warning" /><span className="text-caption">{stats.inProgress} em progresso</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-success" /><span className="text-caption">{stats.done} concluidas</span></div>
              {stats.overdue > 0 && <div className="flex items-center gap-2"><AlertTriangle size={12} className="text-danger" /><span className="text-caption text-danger font-semibold">{stats.overdue} atrasadas</span></div>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><Input placeholder="Buscar tarefas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 input-premium h-9" /></div>
            <Button variant={showFilters ? 'default' : 'outline'} size="sm" onClick={() => setShowFilters(!showFilters)} className="h-9"><Filter size={14} className="mr-1.5" /> Filtros {hasActiveFilters && <span className="ml-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">{(filterProject ? 1 : 0) + (filterPriority ? 1 : 0)}</span>}</Button>
            <TabsList className="h-9 shadow-sm ml-auto"><TabsTrigger value="board" className="px-3 py-1 font-semibold text-xs"><LayoutGrid size={14} className="mr-1.5" /> Board</TabsTrigger><TabsTrigger value="list" className="px-3 py-1 font-semibold text-xs"><List size={14} className="mr-1.5" /> Lista</TabsTrigger></TabsList>
          </div>
          {showFilters && <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border animate-fade-in-up">
            <span className="text-caption font-semibold">Filtrar:</span>
            <select className="h-8 px-3 rounded-lg bg-background border border-border text-xs font-medium" value={filterProject || ''} onChange={(e) => setFilterProject(e.target.value || null)}><option value="">Todos projetos</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
            <select className="h-8 px-3 rounded-lg bg-background border border-border text-xs font-medium" value={filterPriority || ''} onChange={(e) => setFilterPriority(e.target.value || null)}><option value="">Todas prioridades</option><option value="Alta">Alta</option><option value="Media">Media</option><option value="Baixa">Baixa</option></select>
            {hasActiveFilters && <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { setFilterProject(null); setFilterPriority(null) }}><X size={12} className="mr-1" /> Limpar</Button>}
          </div>}
        </div>
        <div className="flex-1 overflow-auto pb-8 no-scrollbar">
          <TabsContent value="board" className="mt-0 h-full border-none outline-none"><TasksBoard tasks={filteredTasks} updateTask={updateTask} onCardClick={setSelectedTask} /></TabsContent>
          <TabsContent value="list" className="mt-0 h-full border-none outline-none"><TasksList tasks={filteredTasks} onRowClick={setSelectedTask} /></TabsContent>
        </div>
      </Tabs>
      <TaskDetailSheet task={selectedTask} onClose={() => setSelectedTask(null)} onUpdate={updateTask} />
    </div>
  )
}
