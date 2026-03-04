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
  AlertCircle,
  CalendarDays,
  CalendarClock,
  Plus,
  FolderOpen,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from 'lucide-react'
import { useState } from 'react'

function isValidDate(dateStr?: string): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return !isNaN(d.getTime())
}

function safeFormatDate(dateStr?: string, dateFormat: string = 'dd/MM'): string {
  if (!isValidDate(dateStr)) return '---'
  return format(new Date(dateStr as string), dateFormat, { locale: ptBR })
}

/* ══════════════════════════════════════════
   METRIC CARD COMPONENT
   ══════════════════════════════════════════ */
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
  const colorMap = {
    brand: 'text-brand bg-brand-subtle',
    success: 'text-success bg-success-bg',
    warning: 'text-warning bg-warning-bg',
    danger: 'text-danger bg-danger-bg',
    info: 'text-info bg-info-bg',
  }

  return (
    <div
      className="metric-card animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="metric-value animate-count-up" style={{ animationDelay: `${delay + 100}ms` }}>
        {value}
      </div>
      <div className="metric-label mt-1.5">{label}</div>
    </div>
  )
}

/* ══════════════════════════════════════════
   TASK SECTION COMPONENT
   ══════════════════════════════════════════ */
function TaskSection({
  title,
  tasks,
  icon: Icon,
  color,
  emptyText,
}: {
  title: string
  tasks: Array<{ id: string; title: string; priority?: string; deadline?: string }>
  icon: React.ElementType
  color: string
  emptyText: string
}) {
  const priorityStyle: Record<string, string> = {
    Alta: 'bg-danger-bg text-danger',
    Média: 'bg-warning-bg text-warning',
    Baixa: 'bg-info-bg text-info',
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-semibold rounded-md">
          {tasks.length}
        </Badge>
      </div>

      {tasks.length === 0 ? (
        <div className="text-[13px] text-muted-foreground/60 py-4 text-center border border-dashed border-border rounded-lg">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-1">
          {tasks.slice(0, 5).map((task) => (
            <div key={task.id} className="task-row group">
              <CheckSquare size={14} className="text-muted-foreground/50 shrink-0" />
              <span className="text-[13px] text-foreground truncate flex-1 font-medium">
                {task.title}
              </span>
              {task.priority && (
                <span className={`badge-premium ${priorityStyle[task.priority] || ''}`}>
                  {task.priority}
                </span>
              )}
              {task.deadline && (
                <span className="text-[11px] text-muted-foreground font-medium">
                  {safeFormatDate(task.deadline)}
                </span>
              )}
            </div>
          ))}
          {tasks.length > 5 && (
            <div className="text-[12px] text-muted-foreground text-center pt-1 font-medium">
              +{tasks.length - 5} mais
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════
   EMPTY STATE
   ══════════════════════════════════════════ */
function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: {
  icon: React.ElementType
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="empty-state py-8">
      <div className="empty-state-icon">
        <Icon size={22} />
      </div>
      <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-[13px] text-muted-foreground max-w-[240px]">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-4 btn-primary text-xs h-8 px-4">
          <Plus size={14} className="mr-1.5" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════
   DASHBOARD MAIN
   ══════════════════════════════════════════ */
export default function Index() {
  const [projects] = useProjectStore()
  const [tasks] = useTaskStore()
  const [funnels] = useFunnelStore()
  const [docs] = useDocumentStore()
  const [, setAction] = useQuickActionStore()

  const activeProjects = projects.filter((p) => p.status === 'Ativo').length
  const pendingTasks = tasks.filter((t) => t.status !== 'Concluído')
  const completedTasks = tasks.filter((t) => t.status === 'Concluído').length
  const activeFunnels = funnels.filter((f) => f.status === 'Ativo').length

  const today = startOfToday()
  const overdueTasks = pendingTasks.filter(
    (t) => isValidDate(t.deadline) && isBefore(new Date(t.deadline as string), today),
  )
  const todayTasks = pendingTasks.filter(
    (t) => isValidDate(t.deadline) && isToday(new Date(t.deadline as string)),
  )
  const weekTasks = pendingTasks.filter((t) => {
    if (!isValidDate(t.deadline)) return false
    const d = new Date(t.deadline as string)
    return isThisWeek(d) && !isToday(d) && !isBefore(d, today)
  })

  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  return (
    <div className="p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sistema Online
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Exportar Relatório</Button>
          <Button onClick={() => setAction({ type: 'task', mode: 'create' })}>
            Quick Action
          </Button>
        </div>
        <Button
          onClick={() => setAction({ mode: 'create', type: 'task' })}
          className="btn-primary text-xs h-9 px-4 gap-1.5"
        >
          <Plus size={15} />
          Nova Tarefa
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Projetos Ativos" value={activeProjects} icon={FolderOpen} color="brand" delay={0} />
        <MetricCard label="Tarefas Pendentes" value={pendingTasks.length} icon={Clock} color="warning" delay={60} />
        <MetricCard label="Funis Ativos" value={activeFunnels} icon={Network} color="info" delay={120} />
        <MetricCard label="Taxa Conclusão" value={`${completionRate}%`} icon={TrendingUp} color="success" delay={180} />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Plano de Ação — 2 columns */}
        <Card className="lg:col-span-2 card-premium">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-brand" />
                <h2 className="text-base font-semibold tracking-tight">Plano de Ação</h2>
              </div>
              <Link
                to="/tarefas"
                className="text-xs text-muted-foreground hover:text-brand font-medium flex items-center gap-1 transition-colors"
              >
                Ver tudo <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <TaskSection
                title="Atrasadas"
                tasks={overdueTasks}
                icon={AlertCircle}
                color="bg-danger"
                emptyText="Nenhuma atrasada"
              />
              <TaskSection
                title="Hoje"
                tasks={todayTasks}
                icon={CalendarDays}
                color="bg-warning"
                emptyText="Nada para hoje"
              />
              <TaskSection
                title="Esta Semana"
                tasks={weekTasks}
                icon={CalendarClock}
                color="bg-info"
                emptyText="Semana livre"
              />
            </div>
          </CardContent>
        </Card>

        {/* Activity / Quick Stats */}
        <Card className="card-premium">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <Layers size={16} className="text-brand" />
              <h2 className="text-base font-semibold tracking-tight">Resumo</h2>
            </div>

            <div className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Progresso Geral</span>
                  <span className="text-xs font-bold text-foreground">{completionRate}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${completionRate}%` }} />
                </div>
              </div>

              <div className="divider" />

              {/* Quick stats list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="dot dot-danger" />
                    <span className="text-[13px] text-foreground font-medium">Atrasadas</span>
                  </div>
                  <span className="text-[13px] font-bold text-foreground">{overdueTasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="dot dot-warning" />
                    <span className="text-[13px] text-foreground font-medium">Para Hoje</span>
                  </div>
                  <span className="text-[13px] font-bold text-foreground">{todayTasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="dot dot-success" />
                    <span className="text-[13px] text-foreground font-medium">Concluídas</span>
                  </div>
                  <span className="text-[13px] font-bold text-foreground">{completedTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="dot dot-info" />
                    <span className="text-[13px] text-foreground font-medium">Documentos</span>
                  </div>
                  <span className="text-[13px] font-bold text-foreground">{docs.length}</span>
                </div>
              </div>

              <div className="divider" />

              {/* CTA */}
              <Button
                variant="outline"
                onClick={() => setAction({ mode: 'create', type: 'project' })}
                className="w-full h-9 text-xs font-semibold border-dashed border-border hover:border-brand hover:bg-brand-subtle hover:text-brand transition-all"
              >
                <Plus size={14} className="mr-1.5" />
                Novo Projeto
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderOpen size={16} className="text-brand" />
            <h2 className="text-base font-semibold tracking-tight">Projetos Recentes</h2>
          </div>
          <Link
            to="/projetos"
            className="text-xs text-muted-foreground hover:text-brand font-medium flex items-center gap-1 transition-colors"
          >
            Ver todos <ArrowUpRight size={12} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="Nenhum projeto"
            description="Crie seu primeiro projeto para começar a organizar seus funis."
            actionLabel="Criar Projeto"
            onAction={() => setAction({ mode: 'create', type: 'project' })}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project, i) => {
              const pTasks = tasks.filter((t) => t.projectId === project.id)
              const pDone = pTasks.filter((t) => t.status === 'Concluído').length
              const pProgress = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0
              const pFunnels = funnels.filter((f) => f.projectId === project.id).length

              return (
                <Link
                  key={project.id}
                  to={`/projetos/${project.id}`}
                  className="card-premium p-4 block group animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground truncate pr-2 group-hover:text-brand transition-colors">
                      {project.name}
                    </h3>
                    <Badge
                      variant={project.status === 'Ativo' ? 'default' : 'secondary'}
                      className="text-[10px] shrink-0 h-5 px-2 rounded-md font-semibold"
                    >
                      {project.status}
                    </Badge>
                  </div>

                  {project.description && (
                    <p className="text-[12px] text-muted-foreground line-clamp-2 mb-3">
                      {project.description}
                    </p>
                  )}

                  <div className="progress-bar mb-3">
                    <div className="progress-bar-fill" style={{ width: `${pProgress}%` }} />
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Network size={12} /> {pFunnels} funis
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckSquare size={12} /> {pDone}/{pTasks.length}
                    </span>
                    <span className="ml-auto font-semibold text-foreground">{pProgress}%</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
