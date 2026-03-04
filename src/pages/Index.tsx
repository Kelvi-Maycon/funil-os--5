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
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
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
  ArrowDownRight,
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

const sparklineData1 = [{ value: 100 }, { value: 120 }, { value: 110 }, { value: 140 }, { value: 130 }, { value: 160 }, { value: 180 }]
const sparklineData2 = [{ value: 50 }, { value: 60 }, { value: 55 }, { value: 70 }, { value: 80 }, { value: 75 }, { value: 90 }]
const sparklineData3 = [{ value: 4.8 }, { value: 4.9 }, { value: 4.5 }, { value: 4.2 }, { value: 4.4 }, { value: 4.5 }, { value: 4.3 }]

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
  const overdueTasks = pendingTasks.filter((t) => isValidDate(t.deadline) && isBefore(new Date(t.deadline as string), today))
  const todayTasks = pendingTasks.filter((t) => isValidDate(t.deadline) && isToday(new Date(t.deadline as string)))
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground capitalize text-base">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Relatório</Button>
          <Button onClick={() => setAction({ type: 'task', mode: 'create' })}>Quick Action</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative min-h-[160px] group hover-lift">
          <div className="p-6 relative z-10 flex flex-col justify-between h-full">
            <div className="space-y-1">
              <h3 className="text-primary-foreground/80 text-sm font-medium">Receita Total</h3>
              <div className="text-4xl font-bold">R$ 124.500</div>
            </div>
            <div className="text-success bg-white/90 text-xs font-bold mt-4 self-start px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
              <TrendingUp size={12} strokeWidth={3} /> +15% vs mês anterior
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-2/3 h-full opacity-30 pointer-events-none transition-transform duration-500 group-hover:scale-105">
            <ChartContainer config={{ value: { color: '#fff' } }} className="h-full w-full">
              <LineChart data={sparklineData1}>
                <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={4} dot={false} isAnimationActive={false} />
              </LineChart>
            </ChartContainer>
          </div>
        </Card>
        
        <Card className="bg-card text-foreground overflow-hidden relative min-h-[160px] group hover-lift">
          <div className="p-6 relative z-10 flex flex-col justify-between h-full">
            <div className="space-y-1">
              <h3 className="text-muted-foreground text-sm font-medium">Leads Capturados</h3>
              <div className="text-4xl font-bold">8.240</div>
            </div>
            <div className="text-success bg-success/10 text-xs font-bold mt-4 self-start px-2 py-1 rounded-md flex items-center gap-1">
              <TrendingUp size={12} strokeWidth={3} /> +5% vs meta
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-2/3 h-full opacity-20 pointer-events-none transition-transform duration-500 group-hover:scale-105">
            <ChartContainer config={{ value: { color: 'hsl(var(--success))' } }} className="h-full w-full">
              <LineChart data={sparklineData2}>
                <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={4} dot={false} isAnimationActive={false} />
              </LineChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="bg-card text-foreground overflow-hidden relative min-h-[160px] group hover-lift">
          <div className="p-6 relative z-10 flex flex-col justify-between h-full">
            <div className="space-y-1">
              <h3 className="text-muted-foreground text-sm font-medium">Custo por Lead (CPL)</h3>
              <div className="text-4xl font-bold">R$ 4,50</div>
            </div>
            <div className="text-success bg-success/10 text-xs font-bold mt-4 self-start px-2 py-1 rounded-md flex items-center gap-1">
              <ArrowDownRight size={12} strokeWidth={3} /> -2% vs média
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-2/3 h-full opacity-20 pointer-events-none transition-transform duration-500 group-hover:scale-105">
            <ChartContainer config={{ value: { color: 'hsl(var(--primary))' } }} className="h-full w-full">
              <LineChart data={sparklineData3}>
                <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={4} dot={false} isAnimationActive={false} />
              </LineChart>
            </ChartContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift py-4 px-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Projetos Ativos</h3>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold text-foreground">{activeProjects}</div>
        </Card>
        <Card className="hover-lift py-4 px-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Funis Ativos</h3>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold text-foreground">{activeFunnels}</div>
        </Card>
        <Card className="hover-lift py-4 px-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tasks Pendentes</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold text-warning">{pendingTasks.length}</div>
        </Card>
        <Card className="hover-lift py-4 px-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tasks Concluídas</h3>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold text-success">{completedTasks}</div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Plano de Ação</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className={overdueTasks.length > 0 ? 'border-danger/30 bg-danger/5' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-danger flex items-center gap-1.5"><AlertCircle size={14} /> Atrasadas</CardTitle>
              <Badge variant="outline" className="bg-danger/10 text-danger border-danger/20">{overdueTasks.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {overdueTasks.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <span className="text-sm font-medium text-foreground truncate flex-1 mr-2">{t.title}</span>
                  <span className="text-[10px] text-danger font-semibold shrink-0">{safeFormatDate(t.deadline, 'dd/MM')}</span>
                </div>
              ))}
              {overdueTasks.length === 0 && <p className="text-xs text-muted-foreground py-2 font-medium">Nenhuma tarefa atrasada 🎉</p>}
            </CardContent>
          </Card>
          <Card className={todayTasks.length > 0 ? 'border-warning/30 bg-warning/5' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-warning flex items-center gap-1.5"><CalendarDays size={14} /> Hoje</CardTitle>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">{todayTasks.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {todayTasks.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <span className="text-sm font-medium text-foreground truncate flex-1 mr-2">{t.title}</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{t.priority}</Badge>
                </div>
              ))}
              {todayTasks.length === 0 && <p className="text-xs text-muted-foreground py-2 font-medium">Nenhuma tarefa para hoje</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-info flex items-center gap-1.5"><CalendarClock size={14} /> Esta Semana</CardTitle>
              <Badge variant="outline" className="bg-info/10 text-info border-info/20">{weekTasks.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {weekTasks.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <span className="text-sm font-medium text-foreground truncate flex-1 mr-2">{t.title}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold shrink-0">{safeFormatDate(t.deadline, 'dd/MM')}</span>
                </div>
              ))}
              {weekTasks.length === 0 && <p className="text-xs text-muted-foreground py-2 font-medium">Nenhuma tarefa esta semana</p>}
            </CardContent>
          </Card>
        </div>
        <form onSubmit={addQuickTask} className="flex items-center gap-2 max-w-sm">
          <Input placeholder="➕ Adicionar task rápida..." value={quickTask} onChange={(e) => setQuickTask(e.target.value)} className="flex-1" />
          <Button type="submit" variant="secondary" size="sm">Criar</Button>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Projetos Recentes</h2>
          <Link to="/projetos" className="text-sm text-primary hover:underline font-bold flex items-center gap-1">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {projects.slice(0, 3).map((p) => {
            const stats = getProjectStats(p.id)
            return (
              <Link to={`/projetos/${p.id}`} key={p.id}>
                <Card className="hover-lift cursor-pointer h-full group">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{p.name}</CardTitle>
                      <Badge variant="outline" className={p.status === 'Ativo' ? 'bg-success/10 text-success border-none' : 'bg-muted text-muted-foreground border-none'}>{p.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-medium">{p.description}</p>
                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Network size={14} /> {stats.pFunnels} funis</span>
                      <span className="flex items-center gap-1.5"><CheckSquare size={14} /> {stats.pTasks} tasks</span>
                      <span className="flex items-center gap-1.5"><FileText size={14} /> {stats.pDocs} docs</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

