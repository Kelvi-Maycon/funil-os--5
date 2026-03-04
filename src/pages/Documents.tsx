import { useState, useMemo } from 'react'
import useDocumentStore from '@/stores/useDocumentStore'
import useProjectStore from '@/stores/useProjectStore'
import useFunnelStore from '@/stores/useFunnelStore'
import useTaskStore from '@/stores/useTaskStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Search, FileText, Plus, ArrowLeft, Save, X, FolderOpen, MapPin, CheckSquare, Link2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { Document, Task } from '@/types'

function ConnectionBadge({ icon: Icon, label, color = 'bg-muted' }: { icon: any; label: string; color?: string }) {
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${color}`}><Icon size={12} />{label}</span>
}

function DocumentEditor({ doc, onClose, onSave, linkedTasks, projectName, funnelName, nodeName }: { doc: Document; onClose: () => void; onSave: (id: string, content: string, title: string) => void; linkedTasks: Task[]; projectName?: string; funnelName?: string; nodeName?: string }) {
  const [title, setTitle] = useState(doc.title)
  const [content, setContent] = useState(doc.content)
  const handleSave = () => { onSave(doc.id, content, title); onClose() }
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3"><Button variant="ghost" size="icon" onClick={onClose}><ArrowLeft className="h-4 w-4" /></Button><Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xl font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0 max-w-md" placeholder="Titulo do documento..." /></div>
        <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={onClose}><X className="h-4 w-4 mr-1" /> Cancelar</Button><Button size="sm" className="btn-primary" onClick={handleSave}><Save className="h-4 w-4 mr-1" /> Salvar</Button></div>
      </div>
      {(projectName || funnelName || nodeName || linkedTasks.length > 0) && <div className="flex items-center gap-2 mb-4 flex-wrap"><Link2 size={14} className="text-muted-foreground" />{projectName && <ConnectionBadge icon={FolderOpen} label={projectName} color="bg-primary/10 text-primary" />}{funnelName && <ConnectionBadge icon={MapPin} label={funnelName} color="bg-warning/10 text-warning" />}{nodeName && <ConnectionBadge icon={MapPin} label={nodeName} color="bg-info/10 text-info" />}{linkedTasks.length > 0 && <ConnectionBadge icon={CheckSquare} label={`${linkedTasks.length} tarefa${linkedTasks.length > 1 ? 's' : ''}`} color="bg-success/10 text-success" />}</div>}
      {linkedTasks.length > 0 && <div className="mb-4 p-3 rounded-xl bg-card border border-border"><h4 className="text-caption font-bold mb-2 flex items-center gap-1.5"><CheckSquare size={12} /> TAREFAS VINCULADAS</h4><div className="space-y-1.5">{linkedTasks.map(t => <div key={t.id} className="flex items-center gap-2 text-xs py-1"><div className={`w-1.5 h-1.5 rounded-full ${t.status === 'Concluida' ? 'bg-success' : t.status === 'Em Progresso' ? 'bg-warning' : 'bg-muted-foreground'}`} /><span className={t.status === 'Concluida' ? 'line-through text-muted-foreground' : 'text-foreground'}>{t.title}</span><Badge variant="outline" className="text-[9px] px-1.5 py-0 ml-auto">{t.status}</Badge></div>)}</div></div>}
      <Card className="min-h-[500px]"><CardContent className="p-6"><div className="prose prose-sm dark:prose-invert max-w-none min-h-[400px] focus:outline-none" contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: content }} onBlur={(e) => setContent(e.currentTarget.innerHTML)} /></CardContent></Card>
    </div>
  )
}

export default function Documents() {
  const [docs, setDocs] = useDocumentStore()
  const [projects] = useProjectStore()
  const [funnels] = useFunnelStore()
  const [tasks] = useTaskStore()
  const [, setAction] = useQuickActionStore()
  const [search, setSearch] = useState('')
  const [editingDoc, setEditingDoc] = useState<Document | null>(null)
  const [filterProject, setFilterProject] = useState<string | null>(null)

  const filteredDocs = useMemo(() => docs.filter((d) => { if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false; if (filterProject && d.projectId !== filterProject) return false; return true }), [docs, search, filterProject])
  const handleSaveDoc = (id: string, content: string, title: string) => { setDocs(docs.map((d) => d.id === id ? { ...d, content, title, updatedAt: new Date().toISOString() } : d)) }
  const handleDeleteDoc = (id: string) => { setDocs(docs.filter(d => d.id !== id)) }
  const getDocConnections = (doc: Document) => { const project = projects.find(p => p.id === doc.projectId); const funnel = funnels.find(f => f.id === doc.funnelId); const node = funnel?.nodes.find(n => n.id === doc.nodeId); const linkedTasks = tasks.filter(t => doc.linkedTaskIds?.includes(t.id) || t.linkedDocumentIds?.includes(doc.id) || (doc.nodeId && t.nodeId === doc.nodeId)); return { project, funnel, node, linkedTasks } }

  if (editingDoc) { const conn = getDocConnections(editingDoc); return <div className="p-6 md:p-8 max-w-[1200px] w-full mx-auto"><DocumentEditor doc={editingDoc} onClose={() => setEditingDoc(null)} onSave={handleSaveDoc} linkedTasks={conn.linkedTasks} projectName={conn.project?.name} funnelName={conn.funnel?.name} nodeName={conn.node?.data.name} /></div> }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div className="space-y-1"><h1 className="text-display">Documentos</h1><p className="text-subhead">Centralize scripts, copys e roteiros</p></div><Button className="btn-primary" onClick={() => setAction({ type: 'document', mode: 'create' })}><Plus size={16} className="mr-2" /> Novo Documento</Button></div>
      <div className="flex items-center gap-3"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><Input placeholder="Buscar documentos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 input-premium h-9" /></div><select className="h-9 px-3 rounded-lg bg-background border border-border text-xs font-medium" value={filterProject || ''} onChange={(e) => setFilterProject(e.target.value || null)}><option value="">Todos projetos</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      {filteredDocs.length === 0 ? <EmptyState icon={FileText} title="Nenhum documento encontrado" description="Comece criando scripts, roteiros e copys para seus projetos." action={<Button className="btn-primary" onClick={() => setAction({ type: 'document', mode: 'create' })}><Plus size={16} className="mr-2" /> Criar Documento</Button>} /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredDocs.map((d, i) => { const conn = getDocConnections(d); return (<div key={d.id} onClick={() => setEditingDoc(d)} className="card-interactive p-5 animate-fade-in-up opacity-0 group relative" style={{ animationDelay: `${i * 50}ms` }}><button onClick={(e) => { e.stopPropagation(); handleDeleteDoc(d.id) }} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-danger"><Trash2 size={14} /></button><div className="flex items-start justify-between mb-3"><div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'hsl(var(--info-bg))' }}><FileText size={20} style={{ color: 'hsl(var(--info))' }} /></div><span className="text-caption">{format(new Date(d.updatedAt), 'dd/MM/yyyy')}</span></div><h3 className="font-semibold text-sm mb-1 text-foreground group-hover:text-[hsl(var(--brand))] transition-colors">{d.title}</h3><p className="text-caption line-clamp-2 mb-3">{d.content.replace(/<[^>]*>/g, '').slice(0, 100)}...</p><div className="flex items-center gap-1.5 flex-wrap">{conn.project && <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">{conn.project.name}</span>}{conn.funnel && <span className="text-[10px] px-2 py-0.5 rounded-md bg-warning/10 text-warning font-semibold">{conn.funnel.name}</span>}{conn.node && <span className="text-[10px] px-2 py-0.5 rounded-md bg-info/10 text-info font-semibold">{conn.node.data.name}</span>}{conn.linkedTasks.length > 0 && <span className="text-[10px] px-2 py-0.5 rounded-md bg-success/10 text-success font-semibold">{conn.linkedTasks.length} tarefa{conn.linkedTasks.length > 1 ? 's' : ''}</span>}</div></div>) })}</div>
      )}
    </div>
  )
}
