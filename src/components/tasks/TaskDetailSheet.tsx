import { Task } from '@/types'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import useFunnelStore from '@/stores/useFunnelStore'
import useDocumentStore from '@/stores/useDocumentStore'
import useProjectStore from '@/stores/useProjectStore'
import { Tag, FileText, MapPin, FolderOpen, Link2, CheckSquare, MessageSquare, ExternalLink } from 'lucide-react'

export default function TaskDetailSheet({ task, onClose, onUpdate }: { task: Task | null; onClose: () => void; onUpdate: (id: string, updates: Partial<Task>) => void }) {
  const [projects] = useProjectStore()
  const [funnels] = useFunnelStore()
  const [documents] = useDocumentStore()
  if (!task) return null
  const project = projects.find(p => p.id === task.projectId)
  const funnel = funnels.find(f => f.id === task.funnelId)
  const node = funnel?.nodes.find(n => n.id === task.nodeId)
  const linkedDocs = documents.filter(d => task.linkedDocumentIds?.includes(d.id) || d.linkedTaskIds?.includes(task.id) || (task.nodeId && d.nodeId === task.nodeId))
  const priorityColors: Record<string, string> = { Alta: 'bg-danger/10 text-danger border-danger/20', Media: 'bg-warning/10 text-warning border-warning/20', Baixa: 'bg-success/10 text-success border-success/20' }
  const statusColors: Record<string, string> = { Pendente: 'bg-muted text-muted-foreground', 'Em Progresso': 'bg-warning/10 text-warning', Concluida: 'bg-success/10 text-success' }
  return (
    <Sheet open={!!task} onOpenChange={() => onClose()}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2"><Badge className={cn('text-[10px] font-bold', statusColors[task.status] || '')}>{task.status}</Badge><Badge variant="outline" className={cn('text-[10px] font-bold', priorityColors[task.priority] || '')}>{task.priority}</Badge></div>
          <SheetTitle className="text-xl font-bold">{task.title}</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Link2 size={12} /> Conexoes</h4>
            <div className="space-y-2">
              {project && <div className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-border"><FolderOpen size={14} className="text-primary" /><span className="text-xs font-semibold">{project.name}</span><Badge variant="outline" className="text-[9px] ml-auto">{project.status}</Badge></div>}
              {funnel && <div className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-border"><MapPin size={14} className="text-warning" /><span className="text-xs font-semibold">{funnel.name}</span>{node && <span className="text-[10px] text-muted-foreground ml-1">/ {node.data.name}</span>}</div>}
              {linkedDocs.map(d => <div key={d.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-border"><FileText size={14} className="text-info" /><span className="text-xs font-semibold">{d.title}</span><ExternalLink size={10} className="text-muted-foreground ml-auto" /></div>)}
              {!project && !funnel && linkedDocs.length === 0 && <p className="text-caption text-xs">Nenhuma conexao - vincule a um projeto, funil ou documento.</p>}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Tag size={12} /> Detalhes</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-card border border-border"><span className="text-[10px] text-muted-foreground block mb-0.5">Categoria</span><span className="text-xs font-semibold">{task.category || 'Geral'}</span></div>
              <div className="p-2.5 rounded-lg bg-card border border-border"><span className="text-[10px] text-muted-foreground block mb-0.5">Deadline</span><span className="text-xs font-semibold">{task.deadline || 'Sem prazo'}</span></div>
            </div>
          </div>
          {task.subtasks && task.subtasks.length > 0 && <div className="space-y-3"><h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><CheckSquare size={12} /> Subtarefas <span className="text-[10px] font-normal ml-1">{task.subtasks.filter(s => s.isCompleted).length}/{task.subtasks.length}</span></h4><div className="space-y-1.5">{task.subtasks.map(s => <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"><Checkbox checked={s.isCompleted} /><span className={cn('text-xs', s.isCompleted && 'line-through text-muted-foreground')}>{s.title}</span></div>)}</div></div>}
          {task.comments && task.comments.length > 0 && <div className="space-y-3"><h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><MessageSquare size={12} /> Comentarios ({task.comments.length})</h4><div className="space-y-2">{task.comments.map(c => <div key={c.id} className="p-3 rounded-lg bg-card border border-border"><div className="flex items-center gap-2 mb-1"><div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[9px] text-white font-bold">{c.author.charAt(0)}</div><span className="text-[11px] font-semibold">{c.author}</span><span className="text-[10px] text-muted-foreground ml-auto">{c.createdAt}</span></div><p className="text-xs text-foreground/80">{c.content}</p></div>)}</div></div>}
        </div>
      </SheetContent>
    </Sheet>
  )
}
