import { useState, useEffect } from 'react'
import { Node, NodeData, Task } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  X,
  Plus,
  Trash2,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Settings,
  CheckSquare,
} from 'lucide-react'
import { generateId } from '@/lib/generateId'
import { cn } from '@/lib/utils'
import useDocumentStore from '@/stores/useDocumentStore'
import useResourceStore from '@/stores/useResourceStore'
import useTaskStore from '@/stores/useTaskStore'
import useFunnelStore from '@/stores/useFunnelStore'

type NodeSettingsModalProps = {
  node: Node | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, updates: Partial<NodeData>) => void
}

export function NodeSettingsModal({
  node,
  isOpen,
  onClose,
  onSave,
}: NodeSettingsModalProps) {
  const [name, setName] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [isTaskMode, setIsTaskMode] = useState(false)
  const [linkedDocs, setLinkedDocs] = useState<string[]>([])
  const [linkedAssets, setLinkedAssets] = useState<string[]>([])

  const [docs] = useDocumentStore()
  const [resources] = useResourceStore()
  const [tasks, setTasks] = useTaskStore()
  const [funnels] = useFunnelStore()

  const currentFunnel = funnels.find((f) =>
    f.nodes.some((n) => n.id === node?.id),
  )
  const nodeTasks = tasks.filter(
    (t) => t.nodeId === node?.id || node?.data.linkedTaskIds?.includes(t.id),
  )

  useEffect(() => {
    if (isOpen && node) {
      setName(node.data.name || '')
      setSubtitle(node.data.subtitle || '')
      setDescription(node.data.description || '')
      setIsTaskMode(node.data.isTaskMode || false)
      setLinkedDocs(node.data.linkedDocumentIds || [])
      setLinkedAssets(node.data.linkedAssetIds || [])
    }
  }, [isOpen, node])

  if (!node) return null

  const handleSave = () => {
    onSave(node.id, {
      subtitle,
      description,
      isTaskMode,
      linkedDocumentIds: linkedDocs,
      linkedAssetIds: linkedAssets,
    })
    onClose()
  }

  const addTask = () => {
    const newTask: Task = {
      id: generateId('t'),
      title: 'Nova Tarefa',
      nodeId: node.id,
      funnelId: currentFunnel?.id,
      priority: 'Média',
      status: 'Pendente',
    }
    setTasks([...tasks, newTask])
  }
  const updateTask = (id: string, updates: Partial<Task>) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  const removeTask = (id: string) => setTasks(tasks.filter((t) => t.id !== id))

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto p-6 flex flex-col gap-6 bg-card border-border shadow-2xl sm:rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
            {name || 'Node'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="conf" className="w-full flex-1">
          <TabsList className="flex w-full bg-background rounded-xl p-1.5 mb-6 h-auto gap-1">
            <TabsTrigger
              value="conf"
              className="flex-1 rounded-lg text-[12px] py-2 font-bold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Settings size={14} /> Conf
            </TabsTrigger>
            <TabsTrigger
              value="docs"
              className="flex-1 rounded-lg text-[12px] py-2 font-bold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <FileText size={14} /> Docs
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="flex-1 rounded-lg text-[12px] py-2 font-bold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <CheckSquare size={14} /> Tasks
            </TabsTrigger>
            <TabsTrigger
              value="assets"
              className="flex-1 rounded-lg text-[12px] py-2 font-bold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <ImageIcon size={14} /> Assets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conf" className="space-y-6 outline-none">
            <div className="space-y-2">
              <Label className="section-label">SUBTÍTULO</Label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="+1 filter"
              />
            </div>

            <div className="flex flex-row items-center justify-between rounded-xl border border-border bg-background p-4">
              <div className="space-y-0.5">
                <Label className="text-[14px] font-bold text-foreground">
                  Modo Tarefa
                </Label>
                <p className="text-[12px] text-muted-foreground font-medium">
                  Habilitar checklist
                </p>
              </div>
              <Switch
                checked={isTaskMode}
                onCheckedChange={setIsTaskMode}
                aria-label="Modo Tarefa"
              />
            </div>

            <div className="space-y-2">
              <Label className="section-label">NOTAS ADICIONAIS</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] rounded-xl bg-card border-[1.5px] border-border font-medium text-foreground resize-none p-4 shadow-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
                placeholder="Adicione contexto aqui..."
              />
            </div>
          </TabsContent>

          <TabsContent value="docs" className="space-y-4 outline-none">
            <div className="space-y-3">
              <Label className="text-[14px] font-bold text-foreground">
                Documentos Vinculados
              </Label>
              <Select
                onValueChange={(val) =>
                  !linkedDocs.includes(val) &&
                  setLinkedDocs([...linkedDocs, val])
                }
              >
                <SelectTrigger className="h-[40px] rounded-lg bg-background border-border font-medium">
                  <SelectValue placeholder="Buscar documento..." />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-lg">
                  {docs
                    .filter((d) => !linkedDocs.includes(d.id))
                    .map((d) => (
                      <SelectItem
                        key={d.id}
                        value={d.id}
                        className="font-medium text-[14px]"
                      >
                        {d.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {linkedDocs.map((id) => {
                  const d = docs.find((doc) => doc.id === id)
                  if (!d) return null
                  return (
                    <Badge
                      key={id}
                      variant="outline"
                      className="pl-2 pr-1.5 py-1.5 bg-card border-border rounded-lg gap-1.5 flex items-center shadow-sm"
                    >
                      <FileText size={14} className="text-primary" />{' '}
                      <span className="text-[12px] font-bold text-foreground">
                        {d.title}
                      </span>
                      <button
                        onClick={() =>
                          setLinkedDocs(linkedDocs.filter((l) => l !== id))
                        }
                        className="text-muted-foreground hover:text-primary ml-1 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-4 outline-none">
            <div className="space-y-3">
              <Label className="text-[14px] font-bold text-foreground">
                Ativos da Biblioteca
              </Label>
              <Select
                onValueChange={(val) =>
                  !linkedAssets.includes(val) &&
                  setLinkedAssets([...linkedAssets, val])
                }
              >
                <SelectTrigger className="h-[40px] rounded-lg bg-background border-border font-medium">
                  <SelectValue placeholder="Buscar ativo..." />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-lg">
                  {resources
                    .filter((a) => !linkedAssets.includes(a.id))
                    .map((a) => (
                      <SelectItem
                        key={a.id}
                        value={a.id}
                        className="font-medium text-[14px]"
                      >
                        {a.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {linkedAssets.map((id) => {
                  const a = resources.find((asset) => asset.id === id)
                  if (!a) return null
                  return (
                    <Badge
                      key={id}
                      variant="outline"
                      className="pl-2 pr-1.5 py-1.5 bg-card border-border rounded-lg gap-1.5 flex items-center shadow-sm"
                    >
                      {a.type === 'link' ? (
                        <LinkIcon size={14} className="text-primary" />
                      ) : (
                        <ImageIcon size={14} className="text-primary" />
                      )}
                      <span className="text-[12px] font-bold text-foreground">
                        {a.title}
                      </span>
                      <button
                        onClick={() =>
                          setLinkedAssets(linkedAssets.filter((l) => l !== id))
                        }
                        className="text-muted-foreground hover:text-primary ml-1 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 outline-none">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
              {nodeTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col gap-3 bg-background p-3.5 rounded-xl border border-border"
                >
                  <div className="flex gap-3 items-center">
                    <Checkbox
                      checked={t.status === 'Concluído'}
                      onCheckedChange={(c) =>
                        updateTask(t.id, {
                          status: c ? 'Concluído' : 'Pendente',
                        })
                      }
                      className="w-5 h-5 rounded-[6px]"
                      aria-label={`Completar tarefa ${t.title}`}
                    />
                    <Input
                      value={t.title}
                      onChange={(e) =>
                        updateTask(t.id, { title: e.target.value })
                      }
                      className={cn(
                        'h-9 rounded-lg bg-card font-bold text-[14px] border-border text-foreground shadow-sm focus-visible:border-primary',
                        t.status === 'Concluído' &&
                          'line-through text-muted-foreground opacity-70',
                      )}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTask(t.id)}
                      className="h-9 w-9 text-muted-foreground hover:text-red-500 hover:bg-card shrink-0 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div className="flex gap-2 pl-8">
                    <Select
                      value={t.priority}
                      onValueChange={(v) =>
                        updateTask(t.id, { priority: v as any })
                      }
                    >
                      <SelectTrigger className="h-8 rounded-lg text-[12px] w-[110px] bg-card border-border text-foreground font-bold shadow-sm">
                        <SelectValue placeholder="Prioridade" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-border shadow-lg">
                        <SelectItem value="Baixa" className="font-bold">
                          Baixa
                        </SelectItem>
                        <SelectItem value="Média" className="font-bold">
                          Média
                        </SelectItem>
                        <SelectItem value="Alta" className="font-bold">
                          Alta
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={
                        t.deadline
                          ? (() => {
                              const d = new Date(t.deadline)
                              return isNaN(d.getTime())
                                ? ''
                                : d.toISOString().split('T')[0]
                            })()
                          : ''
                      }
                      onChange={(e) => {
                        const val = e.target.value
                        if (!val) {
                          updateTask(t.id, { deadline: undefined })
                          return
                        }
                        const parsedDate = new Date(val)
                        updateTask(t.id, {
                          deadline: !isNaN(parsedDate.getTime())
                            ? parsedDate.toISOString()
                            : undefined,
                        })
                      }}
                      className="h-8 rounded-lg text-[12px] bg-card border-border text-foreground font-bold flex-1 shadow-sm focus-visible:border-primary"
                    />
                  </div>
                </div>
              ))}
              {nodeTasks.length === 0 && (
                <div className="text-[14px] text-muted-foreground text-center py-8 font-bold bg-background rounded-xl border border-dashed border-border">
                  Nenhuma tarefa vinculada.
                </div>
              )}
            </div>
            <Button
              onClick={addTask}
              variant="outline"
              className="w-full rounded-lg border-dashed border-border bg-card text-foreground hover:text-primary hover:border-primary hover:bg-background h-12 gap-2 transition-colors font-bold"
            >
              <Plus size={18} /> Nova Tarefa
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4 sm:justify-end gap-3 pt-4 border-t border-border">
          <Button
            onClick={handleSave}
            className="w-full rounded-lg h-12 font-bold"
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
