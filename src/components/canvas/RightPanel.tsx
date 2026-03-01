import { Node, Funnel, Task, Resource } from '@/types'
import { generateId } from '@/lib/generateId'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  X,
  FileText,
  CheckSquare,
  Image as ImageIcon,
  Plus,
  Settings,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useDocumentStore from '@/stores/useDocumentStore'
import useTaskStore from '@/stores/useTaskStore'
import useResourceStore from '@/stores/useResourceStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export default function RightPanel({
  node,
  funnel,
  defaultTab = 'details',
  hideHeader,
  onChange,
  onClose,
}: {
  node: Node
  funnel: Funnel
  defaultTab?: string
  hideHeader?: boolean
  onChange: (n: Node) => void
  onClose: () => void
}) {
  const [docs, setDocs] = useDocumentStore()
  const [tasks, setTasks] = useTaskStore()
  const [resources, setResources] = useResourceStore()
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [inspectResource, setInspectResource] = useState<Resource | null>(null)

  // Local state for Conf tab properties
  const [name, setName] = useState(node.data.name || '')
  const [subtitle, setSubtitle] = useState(node.data.subtitle || '')
  const [isTaskMode, setIsTaskMode] = useState(node.data.isTaskMode || false)
  const [notes, setNotes] = useState(node.data.notes || '')

  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab, node.id])

  useEffect(() => {
    setName(node.data.name || '')
    setSubtitle(node.data.subtitle || '')
    setIsTaskMode(node.data.isTaskMode || false)
    setNotes(node.data.notes || '')
  }, [node])

  const handleSave = () => {
    onChange({
      ...node,
      data: {
        ...node.data,
        name,
        subtitle,
        isTaskMode,
        notes,
      },
    })
    onClose()
  }

  const linkedDocs = docs.filter((d) =>
    node.data.linkedDocumentIds?.includes(d.id),
  )
  const linkedTasks = tasks.filter(
    (t) => t.nodeId === node.id || node.data.linkedTaskIds?.includes(t.id),
  )
  const linkedResources = resources.filter((a) =>
    node.data.linkedAssetIds?.includes(a.id),
  )

  const projDocs = docs.filter(
    (d) =>
      d.projectId === funnel.projectId &&
      !node.data.linkedDocumentIds?.includes(d.id),
  )
  const projTasks = tasks.filter(
    (t) =>
      t.projectId === funnel.projectId &&
      t.nodeId !== node.id &&
      !node.data.linkedTaskIds?.includes(t.id),
  )
  const projResources = resources.filter(
    (a) =>
      a.projectId === funnel.projectId &&
      !node.data.linkedAssetIds?.includes(a.id),
  )

  const linkResource = (type: 'doc' | 'task' | 'asset', id: string) => {
    const key =
      type === 'doc'
        ? 'linkedDocumentIds'
        : type === 'task'
          ? 'linkedTaskIds'
          : 'linkedAssetIds'
    onChange({
      ...node,
      data: {
        ...node.data,
        name,
        subtitle,
        isTaskMode,
        notes,
        [key]: [
          ...((node.data[key as keyof typeof node.data] as string[]) || []),
          id,
        ],
      },
    })
    if (type === 'doc')
      setDocs(
        docs.map((d) =>
          d.id === id ? { ...d, funnelId: funnel.id, nodeId: node.id } : d,
        ),
      )
    if (type === 'task')
      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, funnelId: funnel.id, nodeId: node.id } : t,
        ),
      )
  }

  const handleCreateTask = () => {
    const newTask: Task = {
      id: generateId('t'),
      title: 'Nova Tarefa do Nó',
      projectId: funnel.projectId,
      funnelId: funnel.id,
      nodeId: node.id,
      priority: 'Média',
      status: 'A Fazer',
      deadline: new Date(Date.now() + 86400000).toISOString(),
    }
    setTasks([...tasks, newTask])
    onChange({
      ...node,
      data: {
        ...node.data,
        name,
        subtitle,
        isTaskMode,
        notes,
        linkedTaskIds: [...(node.data.linkedTaskIds || []), newTask.id],
      },
    })
  }

  return (
    <div
      className={cn(
        'w-full sm:w-80 max-w-full bg-card border-l border-border flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.1)] z-30 shrink-0 absolute right-0 bottom-0 rounded-tl-[16px] transition-all',
        hideHeader ? 'top-0' : 'top-20',
      )}
    >
      <div className="px-6 py-6 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span className="section-label">Propriedades do Nó</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-background w-8 h-8 rounded-full"
          >
            <X size={16} />
          </Button>
        </div>
        <input
          className="w-full bg-transparent text-[24px] font-bold text-foreground outline-none placeholder:text-muted-foreground"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do Nó"
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0 overflow-hidden"
      >
        <TabsList className="mx-6 mt-6 grid grid-cols-4 gap-1 bg-background p-1 rounded-[10px] border border-border">
          <TabsTrigger
            value="details"
            className="text-[10px] sm:text-[11px] font-bold rounded-[8px] data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 py-1.5"
          >
            <Settings size={14} />{' '}
            <span className="hidden sm:inline">Conf</span>
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="text-[10px] sm:text-[11px] font-bold rounded-[8px] data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 py-1.5"
          >
            <FileText size={14} />{' '}
            <span className="hidden sm:inline">Docs</span>
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="text-[10px] sm:text-[11px] font-bold rounded-[8px] data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 py-1.5"
          >
            <CheckSquare size={14} />{' '}
            <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="text-[10px] sm:text-[11px] font-bold rounded-[8px] data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 py-1.5"
          >
            <ImageIcon size={14} />{' '}
            <span className="hidden sm:inline">Assets</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="details"
          className="flex-1 overflow-auto p-6 space-y-6 m-0 border-none outline-none no-scrollbar"
        >
          <div className="space-y-2">
            <Label className="section-label block mb-1.5">Subtítulo</Label>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="+1 filter"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-background border border-border rounded-[10px]">
            <div className="flex flex-col space-y-0.5">
              <Label className="text-[14px] font-bold text-foreground">
                Modo Tarefa
              </Label>
              <span className="text-[12px] font-medium text-muted-foreground">
                Habilitar checklist
              </span>
            </div>
            <Switch
              checked={isTaskMode}
              onCheckedChange={setIsTaskMode}
              aria-label="Modo Tarefa"
            />
          </div>

          <div className="space-y-2">
            <Label className="section-label block mb-1.5">
              Notas Adicionais
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione contexto aqui..."
              className="min-h-[160px] bg-background border border-border shadow-none focus-visible:ring-primary/20 rounded-[10px] p-4 resize-none text-[14px] font-medium text-foreground"
            />
          </div>
        </TabsContent>

        <TabsContent
          value="content"
          className="flex-1 overflow-auto p-6 space-y-6 m-0 border-none outline-none no-scrollbar"
        >
          <div className="flex items-center gap-2">
            <Select onValueChange={(val) => linkResource('doc', val)}>
              <SelectTrigger className="flex-1 bg-background border-border rounded-[10px] text-foreground font-bold h-11">
                <SelectValue placeholder="Vincular Documento..." />
              </SelectTrigger>
              <SelectContent className="rounded-[10px] border-border">
                {projDocs.map((d) => (
                  <SelectItem
                    key={d.id}
                    value={d.id}
                    className="font-bold text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-muted-foreground" />
                      {d.title}
                    </div>
                  </SelectItem>
                ))}
                {projDocs.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground text-center font-bold">
                    Nenhum documento
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          {linkedDocs.map((doc) => (
            <div
              key={doc.id}
              className="space-y-3 border border-border rounded-[10px] p-4 bg-card shadow-sm hover-lift"
            >
              <div className="font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                <FileText size={16} className="text-primary" /> {doc.title}
              </div>
              <div
                contentEditable
                className="min-h-[150px] outline-none text-sm text-muted-foreground font-medium"
                dangerouslySetInnerHTML={{ __html: doc.content }}
                onBlur={(e) =>
                  setDocs(
                    docs.map((d) =>
                      d.id === doc.id
                        ? { ...d, content: e.currentTarget.innerHTML }
                        : d,
                    ),
                  )
                }
              />
            </div>
          ))}
        </TabsContent>

        <TabsContent
          value="tasks"
          className="flex-1 overflow-auto p-6 space-y-6 m-0 border-none outline-none no-scrollbar"
        >
          <div className="flex items-center gap-2">
            <Select onValueChange={(val) => linkResource('task', val)}>
              <SelectTrigger className="flex-1 bg-background border-border rounded-[10px] text-foreground font-bold h-11">
                <SelectValue placeholder="Importar Tarefa..." />
              </SelectTrigger>
              <SelectContent className="rounded-[10px] border-border">
                {projTasks.map((t) => (
                  <SelectItem
                    key={t.id}
                    value={t.id}
                    className="font-bold text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <CheckSquare
                        size={14}
                        className="text-muted-foreground"
                      />
                      {t.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="bg-background text-foreground hover:bg-border border border-border rounded-[10px] w-11 h-11 p-0 shrink-0"
              onClick={handleCreateTask}
            >
              <Plus size={16} />
            </Button>
          </div>
          <div className="space-y-3">
            {linkedTasks.map((t) => (
              <div
                key={t.id}
                className="p-4 border border-border rounded-[10px] bg-background flex flex-col gap-3 hover-lift"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm text-foreground leading-tight">
                    {t.title}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-primary text-primary shrink-0 ml-2"
                  >
                    {t.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="resources"
          className="flex-1 overflow-auto p-6 space-y-6 m-0 border-none outline-none no-scrollbar"
        >
          <div className="flex items-center gap-2">
            <Select onValueChange={(val) => linkResource('asset', val)}>
              <SelectTrigger className="flex-1 bg-background border-border rounded-[10px] text-foreground font-bold h-11">
                <SelectValue placeholder="Vincular Recurso..." />
              </SelectTrigger>
              <SelectContent className="rounded-[10px] border-border">
                {projResources.map((a) => (
                  <SelectItem
                    key={a.id}
                    value={a.id}
                    className="font-bold text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <ImageIcon size={14} className="text-muted-foreground" />
                      {a.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-4">
            {linkedResources.map((a) => (
              <div
                key={a.id}
                className="rounded-[12px] overflow-hidden border border-border bg-card cursor-pointer hover:border-primary transition-colors hover-lift"
                onClick={() => a.type === 'image' && setInspectResource(a)}
              >
                {a.type === 'image' ? (
                  <img
                    src={a.content}
                    alt={a.title}
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div className="p-4 text-sm font-medium text-muted-foreground bg-background">
                    {a.content}
                  </div>
                )}
                <div className="p-3 text-[13px] font-bold text-foreground border-t border-border">
                  {a.title}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-6 border-t border-border shrink-0 bg-card">
        <Button className="w-full h-12 text-[15px]" onClick={handleSave}>
          Salvar Alterações
        </Button>
      </div>

      <Dialog
        open={!!inspectResource}
        onOpenChange={(open) => !open && setInspectResource(null)}
      >
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none shadow-2xl flex flex-col overflow-hidden rounded-none sm:rounded-none">
          <DialogTitle className="sr-only">Inspeção de Recurso</DialogTitle>
          <div className="absolute top-6 left-6 text-white font-bold text-xl z-10 drop-shadow-md">
            {inspectResource?.title}
          </div>
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <img
              src={inspectResource?.content}
              alt={inspectResource?.title}
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
