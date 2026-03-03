import { Link } from 'react-router-dom'
import useProjectStore from '@/stores/useProjectStore'
import useTaskStore from '@/stores/useTaskStore'
import useFunnelStore from '@/stores/useFunnelStore'
import useDocumentStore from '@/stores/useDocumentStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/ui/EmptyState'
import { format, isToday, isThisWeek, isBefore, startOfToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Clock,
  Target,
  CheckSquare,
  Layers,
  ArrowRight,
  Network,
  FileText,
  AlertCircle,
  CalendarDays,
  CalendarClock,
  TrendingUp,
  Inbox,
  FolderOpen,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

function isValidDate(dateStr?: string): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return !isNaN(d.getTime())
}

function safeFormatDate(dateStr?: string, dateFormat: string = 'dd/MM'): string {
  if (!isValidDate(dateStr)) return '---'
  return format(new Date(dateStr as string), dateFormat)
}

function MetricCard({
  label,
  value,
  icon: Icon,
  subtitle,
  color = 'foreground',
  progress,
  delay = 0,
}: {
  label: string
  value: number
  icon: any
  subtitle: string
  color?: string
  progress?: number
  delay?: number
}) {
  return (
    <Card className="card-interactive animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="metric-label">{label}</span>
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className={`metric-value text-${color}`}>{value}</div>
        {progress !== undefined ? (
          <div className="mt-3">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">{progress}% concluído</p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}

function TaskSection({
  title,
  icon: Icon,
  tasks,
  color,
  emptyText,
  showDate = false,
}: {
  title: string
  icon: any
  tasks: any[]
  color: string
  emptyText: string
  showDate?: boolean
}) {
  const hasItems = tasks.length > 0
  return (
    <Card className={hasItems ? `border-${color}/20 bg-${color}/5` : ''}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-5 pt-4">
        <CardTitle className={`text-sm font-semibold text-${color} flex items-center gap-2`}>
          <Icon size={15} /> {title}
        </CardTitle>
        <Badge variant="outline" className={`bg-${color}/10 text-${color} border-${color}/20 text-xs`}>
          {tasks.length}
        </Badge>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        {tasks.length > 0 ? (
          <div className="space-y-1">
            {tasks.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <span className="text-sm font-medium text-foreground truncate flex-1 mr-3">
                  {t.title}
                </span>
                {showDate ? (
                  <span className={`text-[10px] text-${color} font-semibold shrink-0`}>
                    {safeFormatDate(t.deadline, 'dd/MM')}
                  </span>
                ) : (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {t.priority}
                  </Badge>
                )}
              </div>
            ))}
            {tasks.length > 4 && (
              <p className="text-xs text-muted-foreground pt-1">
                +{tasks.length - 4} mais
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground py-3">{emptyText}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function Index() {
  const [projects] = useProjectStore()
  const [tasks] = useTaskStore()
  const [funnels] = useFunnelStore()
  const [docs] = useDocumentStore()
  const [, setAction] = useQuickActionStore()

  const [quickTask, setQuickTask] = useState('')

  const activeProjects = projects.filter((p) => p.status === 'Ativo').length
  const pendingTasks = tasks.filter((t) => t.status !== 'Concluído')
  const completedTasks = tasks.filter((t) => t.status === 'Concluído').length
  const activeFunnels = funnels.filter((f) => f.status === 'Ativo').length
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

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

  const addQuickTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickTask.trim()) return
    setAction({ type: 'task', mode: 'create' })
    setQuickTask('')
  }

  const getProjectStats = (projectId: string) => {
    const pFunnels = funnels.filter((f) => f.projectId === projectId).length
    const pTasks = tasks.filter((t) => t.projectId === projectId).length
    const pDocs = docs.filter((d) => d.projectId === projectId).length
    return { pFunnels, pTasks, pDocs }
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in">
      {/* === HEADER === */}
      <div className="flex flex-col gap-1 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Bom dia, Diego
            </h1>
            <p className="text-muted-foreground text-base mt-1">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAction({ type: 'task', mode: 'create' })}
              className="gap-2"
            >
              <Zap size={14} /> Quick Action
            </Button>
          </div>
        </div>
      </div>

      {/* === HERO METRICS === */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Projetos Ativos"
          value={activeProjects}
          icon={Layers}
          subtitle={`${projects.length} total`}
          delay={0}
        />
        <MetricCard
          label="Funis Ativos"
          value={activeFunnels}
          icon={Target}
          subtitle={`${funnels.length} total`}
          delay={50}
        />
        <MetricCard
          label="Tasks Pendentes"
          value={pendingTasks.length}
          icon={Clock}
          subtitle={`${tasks.length} total`}
          color="warning"
          delay={100}
        />
        <MetricCard
          label="Concluídas"
          value={completedTasks}
          icon={CheckSquare}
          subtitle=""
          color="success"
          progress={completionRate}
          delay={150}
        />
      </div>

      {/* === QUICK ADD === */}
      <form onSubmit={addQuickTask} className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <Input
          placeholder="Adicionar task rápida..."
          value={quickTask}
          onChange={(e) => setQuickTask(e.target.value)}
          className="flex-1 h-11"
        />
        <Button type="submit" size="sm" className="h-11 px-6">
          Criar
        </Button>
      </form>

      {/* === ACTION PLAN === */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Plano de Ação</h2>
          {overdueTasks.length > 0 && (
            <Badge variant="outline" className="bg-danger/10 text-danger border-danger/20 text-xs">
              {overdueTasks.length} atrasadas
            </Badge>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <TaskSection
            title="Atrasadas"
            icon={AlertCircle}
            tasks={overdueTasks}
            color="danger"
            emptyText="Nenhuma tarefa atrasada \ud83c\udf89"
            showDate
          />
          <TaskSection
            title="Hoje"
            icon={CalendarDays}
            tasks={todayTasks}
            color="warning"
            emptyText="Nenhuma tarefa para hoje"
          />
          <TaskSection
            title="Esta Semana"
            icon={CalendarClock}
            tasks={weekTasks}
            color="info"
            emptyText="Nenhuma tarefa esta semana"
            showDate
          />
        </div>
      </div>

      {/* === UPCOMING TASKS (dark card) === */}
      {pendingTasks.length > 0 && (
        <div className="lg:max-w-3xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Card className="card-dark">
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border-[12px] border-background opacity-5 pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full border-[8px] border-background opacity-5 pointer-events-none" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 text-background">
                <Clock size={18} className="text-primary" /> Próximas Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 relative z-10">
              <div className="space-y-4">
                {pendingTasks.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between border-b border-background/15 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-base text-background">{t.title}</span>
                      <span className="text-xs uppercase font-semibold text-background/50">
                        {safeFormatDate(t.deadline, 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        t.priority === 'Alta'
                          ? 'bg-danger text-danger-foreground border-none'
                          : 'bg-background/20 text-background border-none'
                      }
                    >
                      {t.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* === RECENT PROJECTS === */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Projetos Recentes</h2>
          <Link
            to="/projetos"
            className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
          >
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {projects.slice(0, 3).map((p) => {
              const stats = getProjectStats(p.id)
              return (
                <Link to={`/projetos/${p.id}`} key={p.id}>
                  <Card className="card-interactive cursor-pointer h-full group">
                    <CardHeader className="pb-2 p-5">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {p.name}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={
                            p.status === 'Ativo'
                              ? 'bg-success/10 text-success border-none text-xs'
                              : 'bg-muted text-muted-foreground border-none text-xs'
                          }
                        >
                          {p.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {p.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Network size={12} /> {stats.pFunnels} funis
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckSquare size={12} /> {stats.pTasks} tasks
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText size={12} /> {stats.pDocs} docs
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={<FolderOpen size={28} />}
            title="Nenhum projeto ainda"
            description="Crie seu primeiro projeto para começar a organizar seus funis, tarefas e documentos."
            action={{
              label: 'Criar Projeto',
              onClick: () => setAction({ type: 'project', mode: 'create' }),
            }}
          />
        )}
      </div>
    </div>
  )
}
