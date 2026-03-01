import { useState, useEffect } from 'react'
import { generateId } from '@/lib/generateId'
import { useNavigate } from 'react-router-dom'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Task, Subtask } from '@/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Check,
  Share2,
  MoreHorizontal,
  AtSign,
  Paperclip,
  Send,
  Network,
} from 'lucide-react'
import useProjectStore from '@/stores/useProjectStore'
import { cn } from '@/lib/utils'
import { TaskMetadata } from './TaskMetadata'
import { TaskSubtasks } from './TaskSubtasks'
import { TaskActivity } from './TaskActivity'

export default function TaskDetailSheet({
  task,
  onClose,
  onUpdate,
}: {
  task: Task | null
  onClose: () => void
  onUpdate: (id: string, updates: Partial<Task>) => void
}) {
  const [localTask, setLocalTask] = useState<Task | null>(null)
  const [projects] = useProjectStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (task) setLocalTask(task)
  }, [task])

  if (!localTask) return null

  const handleUpdate = (updates: Partial<Task>) => {
    const updated = { ...localTask, ...updates }
    setLocalTask(updated)
    onUpdate(localTask.id, updates)
  }

  const addSubtask = () => {
    const newSt: Subtask = {
      id: generateId('st'),
      title: '',
      isCompleted: false,
    }
    handleUpdate({ subtasks: [...(localTask.subtasks || []), newSt] })
  }

  const project = projects.find((p) => p.id === localTask.projectId)
  const projectName = project ? project.name : 'Sem Projeto'

  return (
    <Sheet open={!!task} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        overlayClassName="bg-[#3D2B1F]/40 backdrop-blur-[4px]"
        className="w-full sm:max-w-2xl p-0 flex flex-col font-inter border-l border-[#E8E2D9] bg-[#FAF7F2] gap-0 shadow-2xl"
      >
        <SheetTitle className="sr-only">Detalhes da Tarefa</SheetTitle>
        <SheetDescription className="sr-only">
          Visualize e edite as informações e subtarefas da tarefa selecionada.
        </SheetDescription>

        {/* Header */}
        <div className="bg-white px-6 py-5 flex flex-col border-b border-[#E8E2D9] z-10">
          <div className="flex justify-between items-center mb-4 pr-6">
            <div className="flex items-center gap-2 text-[#8C7B6C] text-xs font-semibold">
              <span className="uppercase tracking-widest text-[10px]">
                Projeto:
              </span>
              <span>{projectName}</span>
            </div>
            <div className="flex items-center gap-1">
              {localTask.funnelId && localTask.nodeId && (
                <button
                  onClick={() => {
                    onClose()
                    navigate(
                      `/canvas/${localTask.funnelId}?nodeId=${localTask.nodeId}`,
                    )
                  }}
                  className="h-8 px-3 mr-2 rounded-full bg-[#F3EEE7] text-[#C2714F] text-xs font-bold hover:bg-[#C2714F] hover:text-white transition-colors flex items-center gap-1.5 shadow-sm hover:scale-105 transform"
                >
                  <Network size={14} /> Canvas
                </button>
              )}
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#8C7B6C] hover:bg-[#F3EEE7] hover:text-[#3D2B1F] transition-colors">
                <Share2 size={16} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#8C7B6C] hover:bg-[#F3EEE7] hover:text-[#3D2B1F] transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                handleUpdate({
                  status:
                    localTask.status === 'Concluída' ? 'Pendente' : 'Concluída',
                })
              }
              className={cn(
                'w-7 h-7 rounded-full border flex items-center justify-center transition-colors shrink-0',
                localTask.status === 'Concluída'
                  ? 'bg-[#4CAF50] border-[#4CAF50] text-white'
                  : 'border-[#E8E2D9] text-transparent hover:border-[#C2714F] hover:text-[#C2714F]/50',
              )}
            >
              <Check size={16} strokeWidth={3} />
            </button>
            <input
              value={localTask.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              className="text-2xl font-bold text-[#3D2B1F] bg-transparent outline-none flex-1 placeholder:text-[#E8E2D9]"
              placeholder="Título da tarefa"
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto task-scrollbar p-6 pb-32">
          <TaskMetadata task={localTask} onUpdate={handleUpdate} />

          {/* Description */}
          <div className="mb-10">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] mb-3 block">
              Descrição
            </label>
            <div className="bg-white rounded-2xl p-5 border border-[#E8E2D9] focus-within:border-[#C2714F]/50 focus-within:ring-2 focus-within:ring-[#C2714F]/10 transition-all">
              <textarea
                value={localTask.description || ''}
                onChange={(e) => handleUpdate({ description: e.target.value })}
                placeholder="Adicione mais detalhes a esta tarefa..."
                className="w-full bg-transparent outline-none text-[#3D2B1F] text-sm resize-none min-h-[120px] placeholder:text-[#8C7B6C]/50"
              />
            </div>
          </div>

          <TaskSubtasks
            task={localTask}
            onAdd={addSubtask}
            onToggle={(id) =>
              handleUpdate({
                subtasks: localTask.subtasks?.map((st) =>
                  st.id === id ? { ...st, isCompleted: !st.isCompleted } : st,
                ),
              })
            }
            onUpdateTitle={(id, title) =>
              handleUpdate({
                subtasks: localTask.subtasks?.map((st) =>
                  st.id === id ? { ...st, title } : st,
                ),
              })
            }
            onRemove={(id) =>
              handleUpdate({
                subtasks: localTask.subtasks?.filter((st) => st.id !== id),
              })
            }
          />

          <TaskActivity task={localTask} />
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#FAF7F2] border-t border-[#E8E2D9] p-4 flex items-end gap-3 z-20">
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarFallback className="bg-[#C2714F] text-white text-xs font-bold">
              ME
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 bg-white rounded-2xl border border-[#E8E2D9] flex flex-col p-2 focus-within:border-[#C2714F]/50 focus-within:ring-2 focus-within:ring-[#C2714F]/10 transition-all">
            <textarea
              placeholder="Escreva um comentário..."
              className="w-full bg-transparent outline-none text-sm text-[#3D2B1F] placeholder:text-[#8C7B6C] resize-none h-[40px] px-2 py-1"
            />
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-1 text-[#8C7B6C]">
                <button className="p-1.5 hover:text-[#C2714F] hover:bg-[#F3EEE7] rounded-md transition-colors">
                  <AtSign size={14} />
                </button>
                <button className="p-1.5 hover:text-[#C2714F] hover:bg-[#F3EEE7] rounded-md transition-colors">
                  <Paperclip size={14} />
                </button>
              </div>
              <button className="w-8 h-8 rounded-full bg-[#C2714F] text-white flex items-center justify-center hover:bg-[#a65d3f] transition-all shadow-sm hover:scale-105 transform shrink-0">
                <Send size={14} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
