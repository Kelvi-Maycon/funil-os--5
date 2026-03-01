import { useState } from 'react'
import { Task } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  MoreHorizontal,
  Plus,
  Clock,
  AlertCircle,
  Circle,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react'

const columnsConfig = [
  {
    id: 'Pendente',
    label: 'PENDENTE',
    dot: 'bg-[#8C7B6C]',
    countColor: 'bg-[#E8E2D9] text-[#8C7B6C]',
  },
  {
    id: 'Em Progresso',
    label: 'EM PROGRESSO',
    dot: 'bg-[#E5B567]',
    countColor: 'bg-[#F3EEE7] text-[#C2714F]',
  },
  {
    id: 'Concluída',
    label: 'CONCLUÍDA',
    dot: 'bg-[#A1C9A3]',
    countColor: 'bg-[#E8F2E8] text-[#4CAF50]',
  },
]

export default function TasksBoard({
  tasks,
  updateTask,
  onCardClick,
}: {
  tasks: Task[]
  updateTask: (id: string, updates: Partial<Task>) => void
  onCardClick: (t: Task) => void
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverCol, setDragOverCol] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id)
    e.dataTransfer.effectAllowed = 'move'
    setDraggingId(id)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setDragOverCol(null)
  }

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('taskId')
    if (id) updateTask(id, { status: status as Task['status'] })
    setDraggingId(null)
    setDragOverCol(null)
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-full items-start no-scrollbar">
      {columnsConfig.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id)
        const isDragOver = dragOverCol === col.id

        return (
          <div
            key={col.id}
            className={cn(
              'w-[340px] shrink-0 flex flex-col rounded-2xl transition-all duration-200 relative',
              isDragOver && 'bg-black/5 ring-2 ring-primary/20',
            )}
            onDragOver={(e) => {
              e.preventDefault()
              e.dataTransfer.dropEffect = 'move'
              if (!isDragOver) setDragOverCol(col.id)
            }}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className="flex justify-between items-center mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className="font-bold text-[13px] text-[#3D2B1F] tracking-wide">
                  {col.label}
                </h3>
                <span
                  className={cn(
                    'text-[11px] font-bold rounded-full px-2.5 py-0.5',
                    col.countColor,
                  )}
                >
                  {colTasks.length}
                </span>
              </div>
              <button className="text-[#8C7B6C] hover:text-[#3D2B1F] transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-[150px] pb-4 no-scrollbar">
              {colTasks.map((t) => {
                const isDragging = draggingId === t.id
                const isCompleted = t.status === 'Concluída'

                return (
                  <Card
                    key={t.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, t.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onCardClick(t)}
                    className={cn(
                      'cursor-grab active:cursor-grabbing border-[#E8E2D9] rounded-[14px] bg-white transition-all',
                      isDragging
                        ? 'opacity-40 shadow-none'
                        : 'shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-[#C2714F]/40',
                    )}
                  >
                    <CardContent className="p-4 flex flex-col gap-3.5">
                      <div className="flex justify-between items-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            'px-2 py-0.5 text-[10px] font-bold border-[#E8E2D9] bg-white',
                            t.categoryColor || 'text-[#8C7B6C]',
                            isCompleted && 'opacity-60',
                          )}
                        >
                          {t.category || 'Geral'}
                        </Badge>
                        <div
                          className={cn(
                            'text-[#8C7B6C]',
                            isCompleted && 'opacity-60',
                          )}
                        >
                          {t.iconType === 'clock' && <Clock size={14} />}
                          {t.iconType === 'alert' && (
                            <AlertCircle size={14} className="text-[#C2714F]" />
                          )}
                          {t.iconType === 'dot' && (
                            <Circle
                              size={10}
                              className="fill-[#E5B567] text-[#E5B567]"
                            />
                          )}
                          {t.iconType === 'comment' && (
                            <MessageSquare size={14} />
                          )}
                          {t.iconType === 'check' && (
                            <CheckCircle2
                              size={14}
                              className="text-[#A1C9A3]"
                            />
                          )}
                        </div>
                      </div>

                      <span
                        className={cn(
                          'font-bold text-[14px] leading-snug',
                          isCompleted
                            ? 'line-through text-[#8C7B6C] opacity-70'
                            : 'text-[#3D2B1F]',
                        )}
                      >
                        {t.title}
                      </span>

                      {t.status === 'Em Progresso' &&
                        t.progress !== undefined && (
                          <div className="w-full mt-1">
                            <Progress
                              value={t.progress}
                              indicatorColor="bg-[#E5B567]"
                              className="h-1 bg-[#F3EEE7]"
                            />
                          </div>
                        )}

                      <div className="flex justify-between items-end mt-1">
                        <div className="flex -space-x-1.5">
                          {t.assignees?.map((assignee, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-[1.5px] border-white',
                                assignee.color,
                                isCompleted && 'opacity-70',
                              )}
                            >
                              {assignee.initials}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'text-[10px] font-bold uppercase tracking-wider',
                              t.dateColor || 'text-[#8C7B6C]',
                              isCompleted && 'opacity-60',
                              t.status === 'Em Progresso' &&
                                t.progress !== undefined &&
                                'text-[#3D2B1F]',
                            )}
                          >
                            {t.dateLabel}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {col.id === 'Pendente' && (
                <button className="w-full mt-1 py-3 rounded-[14px] border border-dashed border-[#E8E2D9] text-[#8C7B6C] text-xs font-bold hover:bg-[#F3EEE7] hover:text-[#3D2B1F] flex items-center justify-center gap-1.5 transition-colors">
                  <Plus size={14} className="stroke-[3]" /> Adicionar
                </button>
              )}
            </div>
          </div>
        )
      })}

      {/* New Column Placeholder */}
      <div className="w-[340px] shrink-0 flex flex-col rounded-2xl border border-dashed border-[#E8E2D9] h-[140px] items-center justify-center text-[#8C7B6C] hover:bg-[#F3EEE7] hover:text-[#3D2B1F] transition-colors cursor-pointer mt-10">
        <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center mb-2">
          <Plus size={16} className="stroke-[3]" />
        </div>
        <span className="text-sm font-bold">Criar Coluna</span>
      </div>
    </div>
  )
}
