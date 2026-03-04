import { useState } from 'react'
import useDocumentStore from '@/stores/useDocumentStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Search, FileText, Plus, ArrowLeft, Save, X } from 'lucide-react'
import { format } from 'date-fns'
import { Document } from '@/types'

function DocumentEditor({
  doc,
  onClose,
  onSave,
}: {
  doc: Document
  onClose: () => void
  onSave: (id: string, content: string, title: string) => void
}) {
  const [title, setTitle] = useState(doc.title)
  const [content, setContent] = useState(doc.content)

  const handleSave = () => {
    onSave(doc.id, content, title)
    onClose()
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0 max-w-md"
            placeholder="Título do documento..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-1" /> Cancelar
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" /> Salvar
          </Button>
        </div>
      </div>

      <Card className="min-h-[500px]">
        <CardContent className="p-6">
          <div
            className="prose prose-sm dark:prose-invert max-w-none min-h-[400px] focus:outline-none"
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: content }}
            onBlur={(e) => setContent(e.currentTarget.innerHTML)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default function Documents() {
  const [docs, setDocs] = useDocumentStore()
  const [, setAction] = useQuickActionStore()
  const [search, setSearch] = useState('')
  const [editingDoc, setEditingDoc] = useState<Document | null>(null)

  const filteredDocs = docs.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSaveDoc = (id: string, content: string, title: string) => {
    setDocs(
      docs.map((d) =>
        d.id === id
          ? { ...d, content, title, updatedAt: new Date().toISOString() }
          : d,
      ),
    )
  }

  if (editingDoc) {
    return (
      <div className="p-6 md:p-8 max-w-[1200px] w-full mx-auto">
        <DocumentEditor
          doc={editingDoc}
          onClose={() => setEditingDoc(null)}
          onSave={handleSaveDoc}
        />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-display">Documentos</h1>
          <p className="text-subhead">
            Centralize scripts, copys e roteiros
          </p>
        </div>
        <Button
          className="btn-primary"
          onClick={() => setAction({ type: 'document', mode: 'create' })}
        >
          <Plus size={16} className="mr-2" /> Novo Documento
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          placeholder="Buscar documentos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 input-premium"
        />
      </div>

      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum documento encontrado"
          description="Comece criando scripts, roteiros e copys para seus projetos."
          action={
            <Button
              className="btn-primary"
              onClick={() => setAction({ type: 'document', mode: 'create' })}
            >
              <Plus size={16} className="mr-2" /> Criar Documento
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDocs.map((d, i) => (
            <div
              key={d.id}
              onClick={() => setEditingDoc(d)}
              className="card-interactive p-5 animate-fade-in-up opacity-0 group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'hsl(var(--info-bg))' }}>
                  <FileText size={20} style={{ color: 'hsl(var(--info))' }} />
                </div>
                <span className="text-caption">
                  {format(new Date(d.updatedAt), 'dd/MM/yyyy')}
                </span>
              </div>
              <h3 className="font-semibold text-sm mb-1 text-foreground group-hover:text-[hsl(var(--brand))] transition-colors">
                {d.title}
              </h3>
              <p className="text-caption line-clamp-2">
                {d.content.replace(/<[^>]*>/g, '').slice(0, 100)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
