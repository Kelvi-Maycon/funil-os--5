import { useNavigate } from 'react-router-dom'
import { Task } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ArrowUpDown, Network, Inbox } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

const statusConfig = {
  Pendente: {
    label: 'Todo',
    color:
      'bg-muted text-muted-foreground border-transparent hover:bg-muted/80',
  },
  'Em Progresso': {
    label: 'In Progress',
    color: 'bg-warning/10 text-warning border-transparent hover:bg-warning/20',
  },
  Concluída: {
    label: 'Done',
    color: 'bg-success/10 text-success border-transparent hover:bg-success/20',
  },
}

const priorityConfig = {
  Baixa: {
    label: 'BAIXA',
    color: 'bg-muted text-muted-foreground border-transparent',
  },
  Média: {
    label: 'MÉDIA',
    color: 'bg-info/10 text-info border-transparent',
  },
  Alta: {
    label: 'ALTA',
    color: 'bg-danger/10 text-danger border-transparent',
  },
}

export default function TasksList({
  tasks,
  onRowClick,
}: {
  tasks: Task[]
  onRowClick: (t: Task) => void
}) {
  const navigate = useNavigate()

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Sem Tarefas"
        description="Não há nenhuma tarefa nesta lista."
      />
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="font-semibold text-foreground">
              Título
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Categoria
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              <div className="flex items-center gap-2">
                Prioridade{' '}
                <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
              </div>
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              <div className="flex items-center gap-2">
                Prazo <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
              </div>
            </TableHead>
            <TableHead className="text-right font-semibold text-foreground">
              Status
            </TableHead>
            <TableHead className="text-right font-semibold text-foreground">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((t) => {
            const sc = statusConfig[t.status as keyof typeof statusConfig] || {
              label: t.status,
              color: 'bg-muted text-muted-foreground',
            }
            const pc = priorityConfig[t.priority]
            return (
              <TableRow
                key={t.id}
                onClick={() => onRowClick(t)}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  {t.title}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="font-normal text-muted-foreground border-border bg-background"
                  >
                    {t.category || 'Geral'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={pc.color}>
                    {pc.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {t.deadline
                    ? format(new Date(t.deadline), 'dd/MM/yyyy')
                    : t.dateLabel || '-'}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className={sc.color}>
                    {sc.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {t.funnelId && t.nodeId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/canvas/${t.funnelId}?nodeId=${t.nodeId}`)
                      }}
                      className="text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
                    >
                      <Network size={14} className="mr-1.5" /> Canvas
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
