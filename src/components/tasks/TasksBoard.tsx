import { useState } from 'react'
import { Task } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import useFunnelStore from '@/stores/useFunnelStore'
import useDocumentStore from '@/stores/useDocumentStore'
import { Plus, Clock, AlertCircle, CheckCircle2, FileText, MapPin } from 'lucide-react'

const columnsConfig = [
  { id: 'Pendente', label: 'PENDENTE', dot: 'bg-muted-foreground', countColor: 'bg-muted text-muted-foreground', dropBg: 'bg-muted/30' },
  { id: 'Em Progresso', label: 'EM PROGRESSO', dot: 'bg-warning', countColor: 'bg-warning/10 text-warning', dropBg: 'bg-warning/10' },
  { id: 'Concluida', label: 'CONCLUIDA', dot: 'bg-success', countColor: 'bg-success/10 text-success', dropBg: 'bg-success/10' },
]

function PriorityDot({ priority }: { priority: string }) {
  const colors: Record<string, string> = { Alta: 'bg-danger', Media: 'bg-warning', Baixa: 'bg-success' }
  return <div className={`w-1.5 h-1.5 rounded-full ${colors[priority] || 'bg-muted-foreground'}`} />
}

export default function TasksBoard({ tasks, updateTask, onCardClick }: { tasks: Task[]; updateTask: (id: string, updates: Partial<Task>) => void; onCardClick: (t: Task) => void }) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverCol, setDragOverCol] = useState<string | null>(null)
  const [funnels] = useFunnelStore()
  const [documents] = useDocumentStore()

  const handleDragStart = (e: React.DragEvent, id: string) => { e.dataTransfer.setData('taskId', id); e.dataTransfer.effectAllowed = 'move'; setDraggingId(id) }
  const handleDragEnd = () => { setDraggingId(null); setDragOverCol(null) }
  const handleDrop = (e: React.DragEvent, status: string) => { e.preventDefault(); const id = e.dataTransfer.getData('taskId'); if (id) updateTask(id, { status: status as Task['status'] }); setDraggingId(null); setDragOverCol(null) }

  const getTaskLinks = (task: Task) => {
    const funnel = funnels.find(f => f.id === task.funnelId)
    const node = funnel?.nodes.find(n => n.id === task.nodeId)
    const linkedDocs = documents.filter(d => task.linkedDocumentIds?.includes(d.id) || (task.nodeId && d.nodeId === task.nodeId))
    return { funnel, node, linkedDocs }
  }

  return (
    <div className="flex gap-5 overflow-x-auto pb-4 h-full items-start no-scrollbar">
      {columnsConfig.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id)
        const isDragOver = dragOverCol === col.id
        return (
          <div key={col.id} className={cn('w-[340px] shrink-0 flex flex-col rounded-2xl transition-all duration-200 relative p-1', isDragOver && `${col.dropBg} ring-2 ring-primary/20`)} onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (!isDragOver) setDragOverCol(col.id) }} onDragLeave={() => setDragOverCol(null)} onDrop={(e) => handleDrop(e, col.id)}>
            <div className="flex justify-between items-center mb-4 px-1">
              <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${col.dot}`} /><h3 className="font-bold text-xs text-foreground tracking-wider uppercase">{col.label}</h3><span className={cn('text-[11px] font-bold rounded-full px-2.5 py-0.5', col.countColor)}>{colTasks.length}</span></div>
              <button className="text-muted-foreground hover:text-foreground transition-colors"><Plus size={16} /></button>
            </div>
            <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto min-h-[150px] pb-4 no-scrollbar">
              {colTasks.map((t) => {
                const isDragging = draggingId === t.id
                const isCompleted = t.status === 'Concluida'
                const links = getTaskLinks(t)
                const hasConnections = links.funnel || links.linkedDocs.length > 0
                return (
                  <Card key={t.id} draggable onDragStart={(e) => handleDragStart(e, t.id)} onDragEnd={handleDragEnd} onClick={() => onCardClick(t)} className={cn('cursor-grab active:cursor-grabbing border-border bg-card transition-all duration-150', isDragging ? 'opacity-40 shadow-none scale-95' : 'shadow-sm hover:shadow-md hover:border-primary/30')}>
                    <CardContent className="p-3.5 flex flex-col gap-2.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2"><Badge variant="outline" className={cn('px-2 py-0 text-[10px] font-bold border-border bg-background', t.categoryColor || 'text-muted-foreground', isCompleted && 'opacity-60')}>{t.category || 'Geral'}</Badge><PriorityDot priority={t.priority} /></div>
                        <div className={cn('flex items-center gap-1 text-[11px] font-medium', t.dateColor || 'text-muted-foreground')}>
                          {t.iconType === 'clock' && <Clock size={11} />}
                          {t.iconType === 'alert' && <AlertCircle size={11} className="text-danger" />}
                          {t.iconType === 'check' && <CheckCircle2 size={11} className="text-success" />}
                          {t.dateLabel}
                        </div>
                      </div>
                      <h4 className={cn('text-sm font-semibold leading-snug', isCompleted && 'line-through opacity-60')}>{t.title}</h4>
                      {typeof t.progress === 'number' && <div className="flex items-center gap-2"><Progress value={t.progress} className="h-1.5 flex-1" /><span className="text-[10px] font-bold text-muted-foreground">{t.progress}%</span></div>}
                      {hasConnections && <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-border/50">
                        {links.funnel && <span className="text-[9px] px-1.5 py-0.5 rounded bg-warning/10 text-warning font-semibold flex items-center gap-1"><MapPin size={8} /> {links.node?.data.name || links.funnel.name}</span>}
                        {links.linkedDocs.length > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-info/10 text-info font-semibold flex items-center gap-1"><FileText size={8} /> {links.linkedDocs.length} doc{links.linkedDocs.length > 1 ? 's' : ''}</span>}
                      </div>}
                      {t.assignees && t.assignees.length > 0 && <div className="flex items-center gap-1 pt-1">{t.assignees.map((a, i) => <div key={i} className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white', a.color)}>{a.initials}</div>)}</div>}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
