import { useState } from 'react'
import useTaskStore from '@/stores/useTaskStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus } from 'lucide-react'
import TasksBoard from '@/components/tasks/TasksBoard'
import TasksList from '@/components/tasks/TasksList'
import TaskDetailSheet from '@/components/tasks/TaskDetailSheet'
import { Task } from '@/types'

export default function Tasks() {
  const [tasks, setTasks] = useTaskStore()
  const [, setAction] = useQuickActionStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)))
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] w-full mx-auto h-full flex flex-col animate-fade-in">
      <Tabs defaultValue="board" className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Tarefas
            </h1>
            <p className="text-base font-medium text-muted-foreground">
              Gerencie seu fluxo de trabalho e prioridades
            </p>
          </div>
          <div className="flex items-center gap-4">
            <TabsList className="shadow-sm">
              <TabsTrigger value="board" className="px-4 py-1.5 font-bold">
                Board
              </TabsTrigger>
              <TabsTrigger value="list" className="px-4 py-1.5 font-bold">
                Lista
              </TabsTrigger>
            </TabsList>
            <Button onClick={() => setAction({ type: 'task', mode: 'create' })}>
              <Plus size={16} className="mr-2" /> Nova Tarefa
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto pb-8 no-scrollbar">
          <TabsContent
            value="board"
            className="mt-0 h-full border-none outline-none"
          >
            <TasksBoard
              tasks={tasks}
              updateTask={updateTask}
              onCardClick={setSelectedTask}
            />
          </TabsContent>
          <TabsContent
            value="list"
            className="mt-0 h-full border-none outline-none"
          >
            <TasksList tasks={tasks} onRowClick={setSelectedTask} />
          </TabsContent>
        </div>
      </Tabs>

      <TaskDetailSheet
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={updateTask}
      />
    </div>
  )
}
