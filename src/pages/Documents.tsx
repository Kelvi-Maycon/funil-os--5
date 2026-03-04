import { useState } from 'react'
import useDocumentStore from '@/stores/useDocumentStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Search, FileText, Plus } from 'lucide-react'
import { format } from 'date-fns'

export default function Documents() {
  const [docs] = useDocumentStore()
  const [, setAction] = useQuickActionStore()
  const [search, setSearch] = useState('')

  const filteredDocs = docs.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Documentos
          </h1>
          <p className="text-base font-medium text-muted-foreground">
            Centralize scripts, copys e roteiros
          </p>
        </div>
        <Button onClick={() => setAction({ type: 'document', mode: 'create' })}>
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
          className="pl-10"
        />
      </div>

      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum documento encontrado"
          description="Você ainda não criou nenhum documento. Comece agora criando scripts e roteiros."
          action={
            <Button
              onClick={() => setAction({ type: 'document', mode: 'create' })}
            >
              <Plus size={16} className="mr-2" /> Criar Documento
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDocs.map((d) => (
            <Card
              key={d.id}
              className="cursor-pointer hover-lift group flex flex-col h-full"
            >
              <CardHeader className="p-6 pb-4 flex flex-row items-start justify-between space-y-0 shrink-0">
                <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center text-info mb-2 group-hover:scale-105 transition-transform">
                  <FileText size={24} />
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  {format(new Date(d.updatedAt), 'dd/MM/yyyy')}
                </span>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                <CardTitle className="text-xl line-clamp-1 mb-2">
                  {d.title}
                </CardTitle>
                <p className="text-base text-muted-foreground line-clamp-3">
                  {d.content.replace(/<[^>]*>?/gm, '') || 'Documento vazio'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
