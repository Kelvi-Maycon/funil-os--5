import { useState } from 'react'
import useTaskStore from '@/stores/useTaskStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Button } from '@/components/ui/button'
import { CheckSquare, Plus } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

export default function Tasks() {
  const [tasks] = useTaskStore()
  const [, setAction] = useQuickActionStore()

  return (
    <div className="p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Tarefas
          </h1>
          <p className="text-muted-foreground text-base font-medium">
            Gerencie todas as atividades do seu workspace.
          </p>
        </div>
        <Button
          onClick={() => setAction({ type: 'task', mode: 'create' })}
          className="font-bold"
        >
          <Plus size={16} className="mr-2" /> Nova Tarefa
        </Button>
      </div>

      <div className="flex-1">
        <EmptyState
          icon={CheckSquare}
          title="Central de Tarefas"
          description="A visualização Kanban detalhada será implementada em breve. Use o dashboard para ver as tarefas pendentes por enquanto."
          action={
            <Button onClick={() => setAction({ type: 'task', mode: 'create' })}>
              Adicionar Nova Tarefa
            </Button>
          }
        />
      </div>
    </div>
  )
}
