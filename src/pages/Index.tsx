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
import { format, isToday, isThisWeek, isBefore, startOfToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Area, AreaChart, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  CheckSquare,
  Layers,
  ArrowRight,
  Network,
  FileText,
  AlertCircle,
  CalendarDays,
  CalendarClock,
  TrendingUp,
  Activity,
  Plus,
} from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/components/ui/empty-state'

function isValidDate(dateStr?: string): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return !isNaN(d.getTime())
}

function safeFormatDate(
  dateStr?: string,
  dateFormat: string = 'dd/MM',
): string {
  if (!isValidDate(dateStr)) return '---'
  return format(new Date(dateStr as string), dateFormat)
}

const heroChartData = [
  { day: 'Seg', tasks: 12, projects: 2 },
  { day: 'Ter', tasks: 19, projects: 2 },
  { day: 'Qua', tasks: 15, projects: 3 },
  { day: 'Qui', tasks: 22, projects: 4 },
  { day: 'Sex', tasks: 28, projects: 4 },
  { day: 'Sáb', tasks: 9, projects: 5 },
  { day: 'Dom', tasks: 14, projects: 5 },
]

const sparklineDataTasks = [
  { value: 10 }, { value: 15 }, { value: 12 }, { value: 20 }, { value: 18 }, { value: 25 }, { value: 22 }
]
const sparklineDataDocs = [
  { value: 2 }, { value: 4 }, { value: 3 }, { value: 6 }, { value: 5 }, { value: 8 }, { value: 7 }
]

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

  const today = startOfToday()
  const overdueTasks = pendingTasks.filter(
    (t) =>
      isValidDate(t.deadline) &&
      isBefore(new Date(t.deadline as string), today),
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

  const isWorkspaceEmpty = projects.length === 0 && tasks.length === 0

  return (
    <div className="p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground capitalize text-base font-medium">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setAction({ type: 'task', mode: 'create' })}
            className="font-bold"
          >
            <Plus size={16} className="mr-2" /> Quick Action
          </Button>
        </div>
      </div>

      {isWorkspaceEmpty ? (
        <EmptyState
          icon={Layers}
          title="Bem-vindo ao Funil OS"
          description="Seu workspace está vazio. Comece criando seu primeiro projeto ou adicionando uma nova tarefa para organizar seu fluxo de trabalho."
          action={
            <Button onClick={() => setAction({ type: 'project', mode: 'create' })} size="lg">
              Criar Primeiro Projeto
            </Button>
          }
        />
      ) : (
        <>
          <Card className="bg-card border border-border shadow-sm p-8 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden group hover-lift">
            <div className="space-y-4 flex-1 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
                <Activity size={16} /> Visão Geral Semanal
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Resumo de Produtividade
              </h2>
              <p className="text-muted-foreground text-base max-w-md">
                Sua equipe concluiu <strong className="text-foreground">{completedTasks} tarefas</strong> e gerenciou <strong className="text-foreground">{activeProjects} projetos</strong> ativos esta semana. Excelente trabalho!
              </p>
            </div>
            <div className="w-full lg:w-[45%] h-[200px] relative z-10">
              <ChartContainer
                config={{ tasks: { color: 'hsl(var(--primary))', label: 'Tarefas' }, projects: { color: 'hsl(var(--info))', label: 'Projetos' } }}
                className="h-full w-full"
              >
                <AreaChart data={heroChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-tasks)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-tasks)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-projects)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-projects)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tickMargin={8} className="text-xs font-medium" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="projects" stroke="var(--color-projects)" fillOpacity={1} fill="url(#colorProjects)" strokeWidth={2} />
                  <Area type="monotone" dataKey="tasks" stroke="var(--color-tasks)" fillOpacity={1} fill="url(#colorTasks)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover-lift p-6 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Projetos Ativos
                </h3>
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-foreground">{activeProjects}</div>
                <div className="text-success text-xs font-bold mt-2 flex items-center gap-1">
                  <TrendingUp size={12} strokeWidth={3} /> Crescimento constante
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-2/3 h-1/2 opacity-10 pointer-events-none">
                <ChartContainer config={{ value: { color: 'hsl(var(--primary))' } }} className="h-full w-full">
                  <LineChart data={sparklineDataDocs}>
                    <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={3} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ChartContainer>
              </div>
            </Card>

            <Card className="hover-lift p-6 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Funis Ativos
                </h3>
                <Network className="h-4 w-4 text-info" />
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-foreground">{activeFunnels}</div>
                <div className="text-muted-foreground text-xs font-bold mt-2">
                  Em {projects.length} projetos
                </div>
              </div>
            </Card>

            <Card className="hover-lift p-6 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Tasks Concluídas
                </h3>
                <CheckSquare className="h-4 w-4 text-success" />
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-foreground">{completedTasks}</div>
                <div className="text-success text-xs font-bold mt-2 flex items-center gap-1">
                  <TrendingUp size={12} strokeWidth={3} /> +12% esta semana
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-2/3 h-1/2 opacity-10 pointer-events-none">
                <ChartContainer config={{ value: { color: 'hsl(var(--success))' } }} className="h-full w-full">
                  <LineChart data={sparklineDataTasks}>
                    <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={3} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ChartContainer>
              </div>
            </Card>

            <Card className="hover-lift p-6 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Documentos
                </h3>
                <FileText className="h-4 w-4 text-warning" />
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-foreground">{docs.length}</div>
                <div className="text-muted-foreground text-xs font-bold mt-2">
                  Atualizados recentemente
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Plano de Ação
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className={overdueTasks.length > 0 ? 'border-danger/30 bg-danger/5' : ''}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-danger flex items-center gap-1.5">
                    <AlertCircle size={14} /> Atrasadas
                  </CardTitle>
                  <Badge variant="outline" className="bg-danger/10 text-danger border-danger/20">
                    {overdueTasks.length}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  {overdueTasks.slice(0, 4).map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                      <span className="text-sm font-medium text-foreground truncate flex-1 mr-2">{t.title}</span>
                      <span className="text-[12px] text-danger font-bold shrink-0">{safeFormatDate(t.deadline, 'dd/MM')}</span>
                    </div>
                  ))}
                  {overdueTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground py-2 font-medium">Nenhuma tarefa atrasada 🎉</p>
                  )}
                </CardContent>
              </Card>

              <Card className={todayTasks.length > 0 ? 'border-warning/30 bg-warning/5' : ''}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-warning flex items-center gap-1.5">
                    <CalendarDays size={14} /> Hoje
                  </CardTitle>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    {todayTasks.length}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  {todayTasks.slice(0, 4).map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                      <span className="text-sm font-medium text-foreground truncate flex-1 mr-2">{t.title}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{t.priority}</Badge>
                    </div>
                  ))}
                  {todayTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground py-2 font-medium">Nenhuma tarefa para hoje</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-info flex items-center gap-1.5">
                    <CalendarClock size={14} /> Esta Semana
                  </CardTitle>
                  <Badge variant="outline" className="bg-info/10 text-info border-info/20">
                    {weekTasks.length}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  {weekTasks.slice(0, 4).map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                      <span className="text-sm font-medium text-foreground truncate flex-1 mr-2">{t.title}</span>
                      <span className="text-[12px] text-muted-foreground font-bold shrink-0">{safeFormatDate(t.deadline, 'dd/MM')}</span>
                    </div>
                  ))}
                  {weekTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground py-2 font-medium">Nenhuma tarefa esta semana</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <form onSubmit={addQuickTask} className="flex items-center gap-2 max-w-sm pt-2">
              <Input
                placeholder="Adicionar task rápida..."
                value={quickTask}
                onChange={(e) => setQuickTask(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="secondary" size="sm" className="font-bold">
                Criar
              </Button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Projetos Recentes
              </h2>
              <Link to="/projetos" className="text-sm text-primary hover:underline font-bold flex items-center gap-1">
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {projects.slice(0, 3).map((p) => {
                const stats = getProjectStats(p.id)
                return (
                  <Link to={`/projetos/${p.id}`} key={p.id}>
                    <Card className="hover-lift cursor-pointer h-full group p-6 border border-border shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {p.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={
                            p.status === 'Ativo'
                              ? 'bg-success/10 text-success border-none'
                              : 'bg-muted text-muted-foreground border-none'
                          }
                        >
                          {p.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-6 font-medium">
                        {p.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Network size={14} /> {stats.pFunnels} funis</span>
                        <span className="flex items-center gap-1.5"><CheckSquare size={14} /> {stats.pTasks} tasks</span>
                        <span className="flex items-center gap-1.5"><FileText size={14} /> {stats.pDocs} docs</span>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

