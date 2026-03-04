import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  CheckSquare,
  Layers,
  Target,
  FileText,
  CalendarIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import useQuickActionStore, { EntityType } from '@/stores/useQuickActionStore'
import useProjectStore from '@/stores/useProjectStore'
import useTaskStore from '@/stores/useTaskStore'
import useFunnelStore from '@/stores/useFunnelStore'
import useDocumentStore from '@/stores/useDocumentStore'
import { generateId } from '@/lib/generateId'
import { Task, Funnel, Document, Project } from '@/types'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

export type QuickActionFormData = {
  id?: string
  projectId?: string | null
  title?: string
  name?: string
  description?: string
  content?: string
  priority?: string
  deadline?: string
}

const entityTypes: { id: EntityType; label: string; icon: any }[] = [
  { id: 'task', label: 'TAREFA', icon: CheckSquare },
  { id: 'project', label: 'PROJETO', icon: Layers },
  { id: 'canvas', label: 'FUNIL', icon: Target },
  { id: 'document', label: 'DOCUMENTO', icon: FileText },
]

export default function QuickActionModal() {
  const [state, setState] = useQuickActionStore()
  const [projects, setProjects] = useProjectStore()
  const [tasks, setTasks] = useTaskStore()
  const [funnels, setFunnels] = useFunnelStore()
  const [docs, setDocs] = useDocumentStore()

  const { toast } = useToast()
  const navigate = useNavigate()

  const [selectedType, setSelectedType] = useState<EntityType>('task')
  const [formData, setFormData] = useState<QuickActionFormData>({
    projectId: 'none',
    priority: 'Baixa',
  })

  useEffect(() => {
    if (!state) return

    const initialType = ['swipe', 'insight', 'asset'].includes(state.type)
      ? 'task'
      : state.type

    setSelectedType(initialType)

    if (state.mode === 'edit' && state.itemId) {
      let item: any = null
      if (initialType === 'canvas')
        item = funnels.find((f) => f.id === state.itemId)
      if (initialType === 'document')
        item = docs.find((d) => d.id === state.itemId)
      if (initialType === 'task')
        item = tasks.find((t) => t.id === state.itemId)
      if (initialType === 'project')
        item = projects.find((p) => p.id === state.itemId)

      if (item) {
        setFormData({ ...item, projectId: item.projectId || 'none' })
      }
    } else {
      setFormData({
        projectId: state.defaultProjectId || 'none',
        priority: 'Baixa',
        title: '',
        name: '',
        description: '',
        content: '',
        deadline: '',
      })
    }
  }, [state, funnels, tasks, docs, projects])

  if (!state) return null

  const isCreate = state.mode === 'create'

  const handleClose = () => setState(null)

  const executeSave = () => {
    const projectId = formData.projectId === 'none' ? null : formData.projectId
    const data = { ...formData, projectId }
    delete data.id

    if (isCreate) {
      const id = generateId(selectedType.charAt(0))

      if (selectedType === 'task') {
        setTasks([
          ...tasks,
          {
            ...(data as Partial<Task>),
            id,
            title: data.title || 'Nova Tarefa',
            priority: (data.priority as Task['priority']) || 'Baixa',
            status: 'Pendente',
            deadline: data.deadline || '',
            description: data.description || '',
            category: 'Geral',
            dateLabel: data.deadline
              ? format(new Date(data.deadline), 'dd/MM')
              : '',
            iconType: 'dot',
          } as Task,
        ])
      } else if (selectedType === 'project') {
        const newProject: Project = {
          ...(data as Partial<Project>),
          id,
          name: data.title || data.name || 'Novo Projeto',
          description: data.description || '',
          status: 'Ativo',
          createdAt: new Date().toISOString(),
        }
        setProjects([...projects, newProject])
        if (!state.defaultProjectId) navigate(`/projetos/${id}`)
      } else if (selectedType === 'canvas') {
        const newFunnel: Funnel = {
          ...(data as Partial<Funnel>),
          id,
          name: data.title || data.name || 'Novo Funil',
          status: 'Rascunho',
          createdAt: new Date().toISOString(),
          nodes: [],
          edges: [],
        }
        setFunnels([...funnels, newFunnel])
        if (!state.defaultProjectId) navigate(`/canvas/${id}`)
      } else if (selectedType === 'document') {
        const newDoc: Document = {
          ...(data as Partial<Document>),
          id,
          title: data.title || data.name || 'Novo Documento',
          content: data.content || '',
          updatedAt: new Date().toISOString(),
        }
        setDocs([...docs, newDoc])
        if (!state.defaultProjectId) navigate(`/documentos`)
      }
      toast({ title: 'Criado com sucesso!' })
    } else {
      const id = state.itemId!
      if (selectedType === 'canvas')
        setFunnels(
          funnels.map((f) => (f.id === id ? ({ ...f, ...data } as Funnel) : f)),
        )
      else if (selectedType === 'task')
        setTasks(
          tasks.map((t) => (t.id === id ? ({ ...t, ...data } as Task) : t)),
        )
      else if (selectedType === 'document')
        setDocs(
          docs.map((d) => (d.id === id ? ({ ...d, ...data } as Document) : d)),
        )
      else if (selectedType === 'project')
        setProjects(
          projects.map((p) =>
            p.id === id ? ({ ...p, ...data } as Project) : p,
          ),
        )
      toast({ title: 'Atualizado com sucesso!' })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeSave()
    handleClose()
  }

  const handleSaveAndCreateAnother = (e: React.MouseEvent) => {
    e.preventDefault()
    executeSave()
    setFormData({
      projectId: state.defaultProjectId || 'none',
      priority: 'Baixa',
      title: '',
      name: '',
      description: '',
      content: '',
      deadline: '',
    })
  }

  const currentTypeLabel =
    entityTypes.find((t) => t.id === selectedType)?.label || 'Item'

  return (
    <Dialog open={!!state} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-[640px] p-8 gap-0">
        <DialogHeader className="space-y-0 text-left">
          <DialogTitle className="text-2xl font-bold text-foreground leading-tight">
            {isCreate ? 'Ação Rápida' : `Editar ${currentTypeLabel}`}
          </DialogTitle>
          {isCreate ? (
            <DialogDescription className="text-sm text-muted-foreground mt-1 font-medium">
              O que você deseja criar agora?
            </DialogDescription>
          ) : (
            <DialogDescription className="sr-only">
              Edite as informações do item selecionado.
            </DialogDescription>
          )}
        </DialogHeader>

        {isCreate && (
          <div className="grid grid-cols-4 gap-4 mt-8 mb-8">
            {entityTypes.map((type) => {
              const isActive = selectedType === type.id
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    'flex flex-col items-center justify-center py-6 px-2 rounded-xl border transition-all duration-200 outline-none hover-lift',
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:bg-muted',
                  )}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-sm transition-colors duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground border border-border',
                    )}
                  >
                    <type.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span
                    className={cn(
                      'section-label',
                      isActive ? 'text-primary' : 'text-muted-foreground',
                    )}
                  >
                    {type.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        <form onSubmit={handleSubmit} className={cn(!isCreate && 'mt-8')}>
          <div className="space-y-6">
            {/* TASK FORM */}
            {selectedType === 'task' && (
              <>
                <div>
                  <Label className="section-label block mb-1.5">
                    Título da Tarefa
                  </Label>
                  <Input
                    required
                    placeholder="Ex: Revisar protótipo do dashboard"
                    value={formData.title || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    autoFocus={isCreate}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <Label className="section-label block mb-1.5">
                      Data Limite
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            'w-full h-10 flex items-center justify-start text-left font-bold px-3 text-sm bg-background border border-input rounded-lg transition-colors hover:border-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                            !formData.deadline && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formData.deadline ? (
                            format(new Date(formData.deadline), 'dd/MM/yyyy', {
                              locale: ptBR,
                            })
                          ) : (
                            <span>DD/MM/AAAA</span>
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 z-[100] border-border rounded-xl"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            formData.deadline
                              ? new Date(formData.deadline)
                              : undefined
                          }
                          onSelect={(date) =>
                            setFormData({
                              ...formData,
                              deadline: date ? date.toISOString() : '',
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="section-label block mb-1.5">
                      Prioridade
                    </Label>
                    <Select
                      value={formData.priority || 'Baixa'}
                      onValueChange={(val) =>
                        setFormData({ ...formData, priority: val })
                      }
                    >
                      <SelectTrigger className="h-10 bg-background rounded-lg">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="z-[100] rounded-xl">
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="section-label block mb-1.5">
                    Descrição (Opcional)
                  </Label>
                  <Textarea
                    placeholder="Adicione detalhes importantes sobre esta task..."
                    className="min-h-[110px] resize-none"
                    value={formData.description || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {/* PROJECT FORM */}
            {selectedType === 'project' && (
              <>
                <div>
                  <Label className="section-label block mb-1.5">
                    Nome do Projeto
                  </Label>
                  <Input
                    required
                    placeholder="Ex: Lançamento Alpha"
                    value={formData.title || formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    autoFocus={isCreate}
                  />
                </div>
                <div>
                  <Label className="section-label block mb-1.5">
                    Descrição
                  </Label>
                  <Textarea
                    placeholder="Objetivo principal do projeto..."
                    className="min-h-[110px] resize-none"
                    value={formData.description || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {/* CANVAS / FUNNEL FORM */}
            {selectedType === 'canvas' && (
              <>
                <div>
                  <Label className="section-label block mb-1.5">
                    Nome do Funil
                  </Label>
                  <Input
                    required
                    placeholder="Ex: Funil de Captação VSL"
                    value={formData.title || formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    autoFocus={isCreate}
                  />
                </div>
                {!state.defaultProjectId && (
                  <div>
                    <Label className="section-label block mb-1.5">
                      Vincular a Projeto
                    </Label>
                    <Select
                      value={formData.projectId || 'none'}
                      onValueChange={(val) =>
                        setFormData({ ...formData, projectId: val })
                      }
                    >
                      <SelectTrigger className="h-10 bg-background rounded-lg">
                        <SelectValue placeholder="Selecione um projeto" />
                      </SelectTrigger>
                      <SelectContent className="z-[100] rounded-xl">
                        <SelectItem value="none">Nenhum (Rascunho)</SelectItem>
                        {projects.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            {/* DOCUMENT FORM */}
            {selectedType === 'document' && (
              <>
                <div>
                  <Label className="section-label block mb-1.5">
                    Título do Documento
                  </Label>
                  <Input
                    required
                    placeholder="Ex: Script de Vendas - VSL"
                    value={formData.title || formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    autoFocus={isCreate}
                  />
                </div>
                <div>
                  <Label className="section-label block mb-1.5">
                    Conteúdo Inicial
                  </Label>
                  <Textarea
                    placeholder="Comece a escrever aqui..."
                    className="min-h-[160px] resize-none"
                    value={formData.content || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
            <button
              type="button"
              onClick={handleClose}
              className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors outline-none px-3 py-2 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Cancelar
            </button>
            <div className="flex items-center gap-3">
              {isCreate && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveAndCreateAnother}
                >
                  Salvar e Criar Outra
                </Button>
              )}
              <Button type="submit">
                {isCreate ? `Criar ${currentTypeLabel}` : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
