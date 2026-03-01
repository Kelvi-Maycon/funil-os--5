import { Task } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TaskSubtasks({
  task,
  onAdd,
  onToggle,
  onUpdateTitle,
  onRemove,
}: {
  task: Task
  onAdd: () => void
  onToggle: (id: string) => void
  onUpdateTitle: (id: string, title: string) => void
  onRemove: (id: string) => void
}) {
  const completed = task.subtasks?.filter((st) => st.isCompleted).length || 0
  const total = task.subtasks?.length || 0

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] flex items-center">
          Subtasks
          <span className="ml-2 bg-[#F3EEE7] text-[#C2714F] px-1.5 py-0.5 rounded-md text-[9px]">
            {completed}/{total}
          </span>
        </label>
        <button
          onClick={onAdd}
          className="text-[10px] font-bold text-[#C2714F] hover:text-[#3D2B1F] uppercase tracking-widest transition-colors"
        >
          Adicionar
        </button>
      </div>
      <div className="space-y-2">
        {task.subtasks?.map((st) => (
          <div
            key={st.id}
            className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-[#E8E2D9] group transition-all hover:border-[#C2714F]/30"
          >
            <Checkbox
              checked={st.isCompleted}
              onCheckedChange={() => onToggle(st.id)}
              className="w-[18px] h-[18px] rounded-[5px] data-[state=checked]:bg-[#C2714F] data-[state=checked]:border-[#C2714F] border-[#E8E2D9] transition-colors"
            />
            <input
              value={st.title}
              onChange={(e) => onUpdateTitle(st.id, e.target.value)}
              placeholder="Título da subtask"
              className={cn(
                'flex-1 bg-transparent text-sm outline-none transition-colors font-medium',
                st.isCompleted
                  ? 'text-[#8C7B6C] line-through'
                  : 'text-[#3D2B1F]',
              )}
            />
            <button
              onClick={() => onRemove(st.id)}
              className="text-[#8C7B6C] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {(!task.subtasks || task.subtasks.length === 0) && (
          <div className="text-sm text-[#8C7B6C] italic text-center py-4 bg-white/50 border border-dashed border-[#E8E2D9] rounded-xl">
            Nenhuma subtask adicionada.
          </div>
        )}
      </div>
    </div>
  )
}
