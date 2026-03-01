import { Task } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export function TaskMetadata({
  task,
  onUpdate,
}: {
  task: Task
  onUpdate: (u: Partial<Task>) => void
}) {
  const statusColors = getStatusColors(task.status)
  const priorityColors = getPriorityColors(task.priority)

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-10">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] block">
          Responsável
        </label>
        <div className="flex items-center gap-3 bg-white border border-[#E8E2D9] rounded-xl px-3 h-11 transition-colors hover:border-[#C2714F]/30">
          <Avatar className="w-6 h-6">
            <AvatarImage src={task.avatar} />
            <AvatarFallback className="bg-[#F3EEE7] text-[#C2714F] text-[10px] font-bold">
              {task.assignee?.slice(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <input
            value={task.assignee || ''}
            onChange={(e) => onUpdate({ assignee: e.target.value })}
            placeholder="Atribuir"
            className="bg-transparent text-sm font-semibold text-[#3D2B1F] outline-none flex-1 placeholder:text-[#8C7B6C]/50"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] block">
          Prioridade
        </label>
        <Select
          value={task.priority}
          onValueChange={(val: any) => onUpdate({ priority: val })}
        >
          <SelectTrigger
            className={cn(
              'h-11 border-none font-bold text-xs rounded-xl px-4 focus:ring-0 shadow-none hover:opacity-90 transition-opacity',
              priorityColors.bg,
              priorityColors.text,
            )}
          >
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Baixa">Baixa</SelectItem>
            <SelectItem value="Média">Média</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] block">
          Data de Entrega
        </label>
        <div className="flex items-center gap-3 bg-white border border-[#E8E2D9] rounded-xl px-3 h-11 relative focus-within:border-[#C2714F]/50 transition-colors">
          <CalendarIcon size={16} className="text-[#8C7B6C]" />
          <input
            type="date"
            value={
              task.deadline ? format(new Date(task.deadline), 'yyyy-MM-dd') : ''
            }
            onChange={(e) =>
              onUpdate({ deadline: new Date(e.target.value).toISOString() })
            }
            className="bg-transparent text-sm font-semibold text-[#3D2B1F] outline-none flex-1 absolute inset-0 opacity-0 cursor-pointer"
          />
          <span className="text-sm font-semibold text-[#3D2B1F] pointer-events-none">
            {task.deadline
              ? format(new Date(task.deadline), "dd 'de' MMM, yyyy", {
                  locale: ptBR,
                })
              : 'Sem data'}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] block">
          Status
        </label>
        <Select
          value={task.status}
          onValueChange={(val: any) => onUpdate({ status: val })}
        >
          <SelectTrigger
            className={cn(
              'h-11 border-none font-bold text-xs rounded-xl px-4 focus:ring-0 shadow-none hover:opacity-90 transition-opacity',
              statusColors.bg,
              statusColors.text,
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  statusColors.dot,
                  task.status === 'Em Progresso' ? 'animate-pulse' : '',
                )}
              />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A Fazer">A Fazer</SelectItem>
            <SelectItem value="Em Progresso">Em Andamento</SelectItem>
            <SelectItem value="Em Revisão">Em Revisão</SelectItem>
            <SelectItem value="Concluído">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function getStatusColors(status: string) {
  switch (status) {
    case 'Em Progresso':
      return {
        text: 'text-[#F2C166]',
        bg: 'bg-[#F2C166]/10',
        dot: 'bg-[#F2C166]',
      }
    case 'Concluído':
      return {
        text: 'text-[#4CAF50]',
        bg: 'bg-[#4CAF50]/10',
        dot: 'bg-[#4CAF50]',
      }
    case 'Em Revisão':
      return {
        text: 'text-[#9C27B0]',
        bg: 'bg-[#9C27B0]/10',
        dot: 'bg-[#9C27B0]',
      }
    default:
      return {
        text: 'text-[#8C7B6C]',
        bg: 'bg-[#E8E2D9]/50',
        dot: 'bg-[#8C7B6C]',
      }
  }
}

function getPriorityColors(priority: string) {
  switch (priority) {
    case 'Alta':
      return { text: 'text-[#C2714F]', bg: 'bg-[#C2714F]/10' }
    case 'Média':
      return { text: 'text-[#F2C166]', bg: 'bg-[#F2C166]/10' }
    default:
      return { text: 'text-[#8C7B6C]', bg: 'bg-[#E8E2D9]/50' }
  }
}
