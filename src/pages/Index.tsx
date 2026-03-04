import { Link } from 'react-router-dom'
import useProjectStore from '@/stores/useProjectStore'
import useTaskStore from '@/stores/useTaskStore'
import useFunnelStore from '@/stores/useFunnelStore'
import useDocumentStore from '@/stores/useDocumentStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, isToday, isThisWeek, isBefore, startOfToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Target,
  CheckSquare,
  Layers,
  ArrowRight,
  Network,
  FileText,
  Plus,
  FolderOpen,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'

function isValidDate(dateStr?: string): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return !isNaN(d.getTime())
}

function safeFormatDate(dateStr?: string, dateFormat: string = 'dd/MM'): string {
  if (!isValidDate(dateStr)) return '---'
  return format(new Date(dateStr as string), dateFormat, { locale: ptBR })
}

function MetricCard({
  label,
  value,
  icon: Icon,
  color = 'brand',
  delay = 0,
}: {
  label: string
  value: number | string
  icon: React.ElementType
  color?: 'brand' | 'success' | 'warning' | 'danger' | 'info'
  delay?: number
}) {
  const colorMap: Record<string, string> = {
    brand: 'hsl(var(--brand))',
    success: 'hsl(var(--success))',
    warning: 'hsl(var(--warning))',
    danger: 'hsl(var(--danger))',
    info: 'hsl(var(--info))',
  }
  const bgMap: Record<string, string> = {
    brand: 'hsl(var(--brand-subtle))',
    success: 'hsl(var(--success-bg))',
    warning: 'hsl(var(--warning-bg))',
    danger: 'hsl(var(--danger-bg))',
    info: 'hsl(var(--info-bg))',
  }

  return (
    <div
      className="metric-card animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: bgMap[color], color: colorMap[color] }}
        >
          <Icon className="w-[18px] h-[18px]" />
        </div>
      </div>
      <div className="metric-value">{value}</div>
      <div className="text-caption mt-1">{label}</div>
    </div>
  )
}

function ProjectCard({
  project,
  tasks,
  funnelCount,
  delay = 0,
}: {
  project: any
  tasks: any[]
  funnelCount: number
  delay?: number
}) {
  const completed = tasks.filter((t: any) => t.status === 'Concluído' || t.status === 'Concluída').length
  const total = tasks.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  const statusColor: Record<string, string> = {
    Ativo: 'hsl(var(--success))',
    Pausado: 'hsl(var(--warning))',
    Concluído: 'hsl(var(--info))',
  }

  return (
    <Link
      to={`/projetos/${project.id}`}
      className="card-interactive p-5 animate-fade-in-up opacity-0 group block"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: statusColor[project.status] || 'hsl(var(--text-ghost))' }}
          />
          <span className="text-caption">{project.status}</span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-[hsl(var(--text-ghost))] group-hover:text-[hsl(var(--brand))] transition-colors" />
      </div>

      <h3 className="font-semibold text-sm mb-1 text-foreground">{project.name}</h3>
      <p className="text-caption mb-4 line-clamp-2">{project.description}</p>

      <div className="flex items-center justify-between text-caption mb-2">
        <span>{funnelCount} funis</span>
        <span>{pct}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </Link>
  )
}

export default function Index() {
  const [projects] = useProjectStore()
  const [tasks] = useTaskStore()
  const [funnels] = useFunnelStore()
  const [docs] = useDocumentStore()
  const [, setAction] = useQuickActionStore()

  const activeProjects = projects.filter((p) => p.status === 'Ativo')
  const completedTasks = tasks.filter((t) => t.status === 'Concluído' || t.status === 'Concluída').length
  const totalTasks = tasks.length
  const overdueTasks = tasks.filter(
    (t) => t.deadline && isValidDate(t.deadline) && isBefore(new Date(t.deadline), startOfToday()) && t.status !== 'Concluído' && t.status !== 'Concluída',
  )

  return (
    <div className="p-6 md:p-8 max-w-[1400px] w-full mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display">Dashboard</h1>
          <p className="text-subhead mt-1">Visão geral dos seus projetos</p>
        </div>
        <Button
          className="btn-primary"
          onClick={() => setAction({ type: 'project', mode: 'create' })}
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Projeto
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Projetos Ativos"
          value={activeProjects.length}
          icon={Target}
          color="brand"
          delay={0}
        />
        <MetricCard
          label="Tarefas Concluídas"
          value={`${completedTasks}/${totalTasks}`}
          icon={CheckSquare}
          color="success"
          delay={50}
        />
        <MetricCard
          label="Funis Ativos"
          value={funnels.filter((f) => f.status === 'Ativo').length}
          icon={Network}
          color="info"
          delay={100}
        />
        <MetricCard
          label="Documentos"
          value={docs.length}
          icon={FileText}
          color="warning"
          delay={150}
        />
      </div>

      {/* Overdue alert */}
      {overdueTasks.length > 0 && (
        <div
          className="p-4 rounded-lg animate-fade-in-up opacity-0"
          style={{
            background: 'hsl(var(--danger-bg))',
            border: '1px solid hsl(var(--danger) / 0.2)',
            animationDelay: '200ms',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="dot-danger" />
            <span className="font-semibold text-sm" style={{ color: 'hsl(var(--danger))' }}>
              {overdueTasks.length} tarefa{overdueTasks.length > 1 ? 's' : ''} atrasada{overdueTasks.length > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-caption ml-4">
            {overdueTasks
              .slice(0, 3)
              .map((t) => t.title)
              .join(', ')}
            {overdueTasks.length > 3 && ` e mais ${overdueTasks.length - 3}`}
          </p>
        </div>
      )}

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading">Projetos</h2>
          <Link
            to="/projetos"
            className="text-caption flex items-center gap-1 hover:text-foreground transition-colors"
          >
            Ver todos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-sm mb-1 text-foreground">
              Nenhum projeto ainda
            </h3>
            <p className="text-caption mb-4">
              Comece criando seu primeiro projeto
            </p>
            <Button
              className="btn-primary"
              onClick={() => setAction({ type: 'project', mode: 'create' })}
            >
              <Plus className="w-4 h-4 mr-2" /> Criar Projeto
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                tasks={tasks.filter((t) => t.projectId === p.id)}
                funnelCount={funnels.filter((f) => f.projectId === p.id).length}
                delay={250 + i * 50}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
