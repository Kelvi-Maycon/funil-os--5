import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useProjectStore from '@/stores/useProjectStore'
import useFunnelStore from '@/stores/useFunnelStore'
import useTaskStore from '@/stores/useTaskStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import {
  Folder,
  ArrowLeft,
  Network,
  CheckSquare,
  FileText,
  Plus,
  Settings,
  MoreVertical,
  Calendar,
} from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [projects] = useProjectStore()
  const [funnels] = useFunnelStore()
  const [tasks] = useTaskStore()
  const [, setAction] = useQuickActionStore()

  const project = projects.find((p) => p.id === id)
  const projectFunnels = funnels.filter((f) => f.projectId === id)
  const projectTasks = tasks.filter((t) => t.projectId === id)

  if (!project) {
    return (
      <div className="p-8 text-center text-muted-foreground font-bold">
        Projeto não encontrado.
        <Button variant="link" onClick={() => navigate('/projetos')}>
          Voltar para Projetos
        </Button>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground mb-4">
        <Link
          to="/projetos"
          className="hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Projetos
        </Link>
        <span>/</span>
        <span className="text-foreground">{project.name}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
            <Folder size={32} className="fill-current opacity-20" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {project.name}
              </h1>
              <Badge
                variant="outline"
                className={
                  project.status === 'Ativo'
                    ? 'bg-success/10 text-success border-none font-bold'
                    : 'bg-muted text-muted-foreground border-none font-bold'
                }
              >
                {project.status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-base max-w-2xl font-medium leading-relaxed">
              {project.description || 'Sem descrição.'}
            </p>
            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> Criado em{' '}
                {format(new Date(project.createdAt), 'dd/MM/yyyy')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() =>
              setAction({ type: 'project', mode: 'edit', itemId: project.id })
            }
            className="flex-1 md:flex-none font-bold"
          >
            <Settings size={16} className="mr-2" /> Configurações
          </Button>
          <Button
            onClick={() =>
              setAction({
                type: 'canvas',
                mode: 'create',
                defaultProjectId: project.id,
              })
            }
            className="flex-1 md:flex-none font-bold"
          >
            <Plus size={16} className="mr-2" /> Novo Funil
          </Button>
        </div>
      </div>

      <Tabs defaultValue="funnels" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 h-auto p-1.5 bg-background rounded-xl border border-border mb-6">
          <TabsTrigger
            value="funnels"
            className="text-sm font-bold py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Network size={16} className="mr-2" /> Funis (
            {projectFunnels.length})
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="text-sm font-bold py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <CheckSquare size={16} className="mr-2" /> Tarefas (
            {projectTasks.length})
          </TabsTrigger>
          <TabsTrigger
            value="docs"
            className="text-sm font-bold py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <FileText size={16} className="mr-2" /> Docs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funnels" className="space-y-6 outline-none">
          {projectFunnels.length === 0 ? (
            <EmptyState
              icon={Network}
              title="Nenhum funil neste projeto"
              description="Crie seu primeiro canvas para desenhar a estratégia deste projeto."
              action={
                <Button
                  onClick={() =>
                    setAction({
                      type: 'canvas',
                      mode: 'create',
                      defaultProjectId: project.id,
                    })
                  }
                >
                  Criar Primeiro Funil
                </Button>
              }
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projectFunnels.map((f) => (
                <Link to={`/canvas/${f.id}`} key={f.id} className="group">
                  <Card className="p-6 hover-lift border-border bg-card h-full flex flex-col group-hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-info/10 text-info flex items-center justify-center">
                        <Network size={20} />
                      </div>
                      <Badge
                        variant="outline"
                        className="font-bold bg-background"
                      >
                        {f.status}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {f.name}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm font-bold text-muted-foreground">
                      <span>{f.nodes.length} nós</span>
                      <span>Atualizado hoje</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="outline-none">
          {projectTasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="Nenhuma tarefa"
              description="Comece a adicionar tarefas para acompanhar o progresso deste projeto."
              action={
                <Button
                  onClick={() =>
                    setAction({
                      type: 'task',
                      mode: 'create',
                      defaultProjectId: project.id,
                    })
                  }
                >
                  Adicionar Tarefa
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {projectTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${t.status === 'Concluída' ? 'bg-success' : 'bg-warning'}`}
                    />
                    <span
                      className={`font-bold text-sm ${t.status === 'Concluída' ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                    >
                      {t.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="font-bold text-[10px] uppercase"
                    >
                      {t.priority}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground w-8 h-8 rounded-lg"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="docs" className="outline-none">
          <EmptyState
            icon={FileText}
            title="Área de Documentos"
            description="Armazene scripts, copys e referências deste projeto aqui."
            action={
              <Button
                onClick={() =>
                  setAction({
                    type: 'document',
                    mode: 'create',
                    defaultProjectId: project.id,
                  })
                }
              >
                Criar Documento
              </Button>
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
