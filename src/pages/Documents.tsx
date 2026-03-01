import { useState, useMemo } from 'react'
import useDocumentStore from '@/stores/useDocumentStore'
import useFolderStore from '@/stores/useFolderStore'
import RichTextEditor from '@/components/editor/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FileText,
  Plus,
  Folder as FolderIcon,
  Search,
  Trash2,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { generateId } from '@/lib/generateId'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import {
  ViewToggle,
  FolderBreadcrumbs,
  CreateFolderDialog,
  MoveDialog,
} from '@/components/folders/FolderComponents'

export default function Documents() {
  const [docs, setDocs] = useDocumentStore()
  const [allFolders, setFolders] = useFolderStore()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [docToDelete, setDocToDelete] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newDocTitle, setNewDocTitle] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: 'name' | 'date' | 'type'
    direction: 'asc' | 'desc'
  }>({ key: 'type', direction: 'asc' })

  const { toast } = useToast()

  const activeDoc = docs.find((d) => d.id === activeId)
  const moduleFolders = allFolders.filter((f) => f.module === 'project')

  const currentFolders = moduleFolders.filter((f) => {
    if (search) return f.name.toLowerCase().includes(search.toLowerCase())
    return f.parentId === currentFolderId
  })

  const filteredDocs = docs.filter((d) => {
    if (search) return d.title.toLowerCase().includes(search.toLowerCase())
    return (d.folderId || null) === currentFolderId
  })

  const combinedItems = useMemo(() => {
    const items: Array<{
      id: string
      type: 'folder' | 'doc'
      name: string
      date: string
      raw: any
    }> = []
    currentFolders.forEach((f) =>
      items.push({
        id: f.id,
        type: 'folder',
        name: f.name,
        date: f.createdAt,
        raw: f,
      }),
    )
    filteredDocs.forEach((d) =>
      items.push({
        id: d.id,
        type: 'doc',
        name: d.title,
        date: d.updatedAt,
        raw: d,
      }),
    )
    return items
  }, [currentFolders, filteredDocs])

  const sortedItems = useMemo(() => {
    return [...combinedItems].sort((a, b) => {
      let aVal: any = a[sortConfig.key]
      let bVal: any = b[sortConfig.key]

      if (sortConfig.key === 'date') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      } else if (sortConfig.key === 'name') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1

      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
      return 0
    })
  }, [combinedItems, sortConfig])

  const handleSort = (key: 'name' | 'date' | 'type') => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const renderSortIcon = (key: 'name' | 'date' | 'type') => {
    if (sortConfig.key !== key)
      return (
        <ChevronDown
          size={14}
          className="opacity-0 group-hover:opacity-50 transition-opacity ml-1"
        />
      )
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={14} className="text-primary ml-1" />
    ) : (
      <ChevronDown size={14} className="text-primary ml-1" />
    )
  }

  const handleCreateFolder = (name: string) => {
    setFolders([
      ...allFolders,
      {
        id: generateId('f'),
        module: 'project',
        name,
        parentId: currentFolderId,
        createdAt: new Date().toISOString(),
      },
    ])
    toast({ title: 'Pasta criada com sucesso!' })
  }

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault()
    const newDoc = {
      id: generateId('d'),
      projectId: null,
      title: newDocTitle.trim() || 'Novo Documento',
      content: '',
      updatedAt: new Date().toISOString(),
      folderId: currentFolderId,
    }
    setDocs([...docs, newDoc])
    setNewDocTitle('')
    setIsCreateOpen(false)
    toast({ title: 'Documento criado com sucesso!' })
    setActiveId(newDoc.id)
  }

  const updateDocFolder = (id: string, folderId: string | null) => {
    setDocs(docs.map((d) => (d.id === id ? { ...d, folderId } : d)))
    toast({ title: 'Documento movido com sucesso!' })
  }

  const handleDeleteDoc = () => {
    if (!docToDelete) return
    setDocs(docs.filter((d) => d.id !== docToDelete))
    setDocToDelete(null)
    toast({ title: 'Documento excluído!' })
  }

  if (activeDoc) {
    return (
      <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden animate-fade-in w-full">
        <div className="flex items-center gap-4 px-6 py-3 border-b border-border bg-white shrink-0 shadow-sm z-30">
          <Button
            variant="ghost"
            onClick={() => setActiveId(null)}
            className="text-muted-foreground hover:text-foreground h-9 px-3 -ml-3 font-semibold"
          >
            <ChevronLeft size={16} className="mr-1" />
            Voltar para Documentos
          </Button>
          <div className="h-4 w-[1px] bg-border mx-1" />
          <span className="text-sm font-medium text-foreground truncate">
            {activeDoc.title || 'Sem Título'}
          </span>
        </div>
        <div className="flex-1 overflow-hidden w-full relative">
          <RichTextEditor
            doc={activeDoc}
            onTitleChange={(title) =>
              setDocs(
                docs.map((d) => (d.id === activeDoc.id ? { ...d, title } : d)),
              )
            }
            onProjectChange={(projectId) =>
              setDocs(
                docs.map((d) =>
                  d.id === activeDoc.id ? { ...d, projectId } : d,
                ),
              )
            }
            onChange={(content) =>
              setDocs(
                docs.map((d) =>
                  d.id === activeDoc.id ? { ...d, content } : d,
                ),
              )
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:px-8 border-b border-border -mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-8 min-h-[80px]">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Documentos
          </h1>
          <FolderBreadcrumbs
            currentFolderId={currentFolderId}
            folders={moduleFolders}
            onNavigate={setCurrentFolderId}
            rootName="Workspace"
          />
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          <CreateFolderDialog onConfirm={handleCreateFolder} />
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" /> Novo Documento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Documento</DialogTitle>
                <DialogDescription className="sr-only">
                  Insira o nome do novo documento.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDoc} className="space-y-4 pt-6">
                <Input
                  placeholder="Título do Documento"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  autoFocus
                />
                <Button type="submit" className="w-full">
                  Criar Documento
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative max-w-md shrink-0">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          placeholder="Buscar documentos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 bg-card"
        />
      </div>

      {sortedItems.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center bg-card rounded-2xl border border-dashed border-border shadow-sm max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4 text-primary/50">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground">Vazio</h3>
          <p className="text-base text-muted-foreground mt-2 mb-6">
            Nenhum documento ou pasta encontrado neste local.
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus size={16} className="mr-2" /> Criar Primeiro Documento
          </Button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-12">
          {sortedItems.map((item) => {
            if (item.type === 'folder') {
              return (
                <Card
                  key={item.id}
                  onClick={() => setCurrentFolderId(item.id)}
                  className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer h-full group flex items-center p-6 gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105">
                    <FolderIcon size={24} className="fill-current opacity-20" />
                  </div>
                  <span className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </span>
                </Card>
              )
            } else {
              const doc = item.raw
              return (
                <Card
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer h-full group flex flex-col relative overflow-hidden"
                >
                  <CardHeader className="pb-4 flex-1 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105">
                        <FileText size={24} />
                      </div>
                      <div
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoveDialog
                          folders={moduleFolders}
                          currentFolderId={doc.folderId}
                          onMove={(id) => updateDocFolder(item.id, id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full"
                          onClick={() => setDocToDelete(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {item.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground font-medium">
                      Modificado em{' '}
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </p>
                  </CardContent>
                </Card>
              )
            }
          })}
        </div>
      ) : (
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => handleSort('name')}
                  className="cursor-pointer group hover:bg-muted/50 select-none w-1/2"
                >
                  <div className="flex items-center">
                    Nome {renderSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort('type')}
                  className="cursor-pointer group hover:bg-muted/50 select-none"
                >
                  <div className="flex items-center">
                    Tipo {renderSortIcon('type')}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort('date')}
                  className="cursor-pointer group hover:bg-muted/50 select-none"
                >
                  <div className="flex items-center">
                    Última Modificação {renderSortIcon('date')}
                  </div>
                </TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => {
                if (item.type === 'folder') {
                  return (
                    <TableRow
                      key={item.id}
                      onClick={() => setCurrentFolderId(item.id)}
                      className="cursor-pointer group"
                    >
                      <TableCell className="font-medium flex items-center gap-3 py-4 text-base">
                        <FolderIcon
                          className="text-primary fill-primary/20 group-hover:text-primary transition-colors shrink-0"
                          size={20}
                        />
                        <span className="group-hover:text-primary transition-colors truncate">
                          {item.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium">
                        Pasta
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium">
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )
                } else {
                  const doc = item.raw
                  return (
                    <TableRow
                      key={item.id}
                      onClick={() => setActiveId(item.id)}
                      className="cursor-pointer text-base group"
                    >
                      <TableCell className="font-medium py-4">
                        <div className="flex items-center gap-3">
                          <FileText
                            className="text-primary shrink-0"
                            size={20}
                          />
                          <span className="group-hover:text-primary transition-colors truncate">
                            {item.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium">
                        Documento
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium">
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoveDialog
                            folders={moduleFolders}
                            currentFolderId={doc.folderId}
                            onMove={(id) => updateDocFolder(item.id, id)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full"
                            onClick={() => setDocToDelete(item.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                }
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={!!docToDelete}
        onOpenChange={(open) => !open && setDocToDelete(null)}
        title="Excluir Documento?"
        description="Esta ação é irreversível. O documento será excluído permanentemente."
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleDeleteDoc}
      />
    </div>
  )
}
