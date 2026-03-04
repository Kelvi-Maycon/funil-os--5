import { useState } from 'react'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Search,
  BookOpen,
  Plus,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react'

export default function Library() {
  const [, setAction] = useQuickActionStore()
  const [search, setSearch] = useState('')

  // Using mock data for demonstration
  const resources = [
    { id: '1', title: 'Referência VSL', type: 'link', tags: ['swipe'] },
    { id: '2', title: 'Paleta Lançamento', type: 'image', tags: ['asset'] },
  ]

  const filtered = resources.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Biblioteca
          </h1>
          <p className="text-base font-medium text-muted-foreground">
            Seus assets, referências e insights salvos
          </p>
        </div>
        <Button onClick={() => setAction({ type: 'asset', mode: 'create' })}>
          <Plus size={16} className="mr-2" /> Novo Recurso
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          placeholder="Buscar recursos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Nenhum recurso encontrado"
          description="Sua biblioteca está vazia. Adicione assets, referências ou insights."
          action={
            <Button
              onClick={() => setAction({ type: 'asset', mode: 'create' })}
            >
              <Plus size={16} className="mr-2" /> Adicionar Recurso
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r) => (
            <Card
              key={r.id}
              className="cursor-pointer hover-lift group flex flex-col h-full"
            >
              <CardHeader className="p-6 pb-4 flex flex-row items-start justify-between space-y-0 shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-105 transition-transform">
                  {r.type === 'link' ? (
                    <LinkIcon size={24} />
                  ) : (
                    <ImageIcon size={24} />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                <CardTitle className="text-xl line-clamp-1 mb-2">
                  {r.title}
                </CardTitle>
                <div className="flex gap-2 mt-auto pt-4 flex-wrap">
                  {r.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="uppercase text-[10px]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
