import { Link } from 'react-router-dom'
import useFunnelStore from '@/stores/useFunnelStore'
import useProjectStore from '@/stores/useProjectStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Network, Plus, Search, Folder, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import { EmptyState } from '@/components/ui/empty-state'

export default function Funnels() {
  const [funnels] = useFunnelStore()
  const [projects] = useProjectStore()
  const [, setAction] = useQuickActionStore()
  const [search, setSearch] = useState('')

  const filteredFunnels = funnels.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  )

  const getProjectName = (id?: string | null) => {
    if (!id) return 'Rascunho'
    return projects.find((p) => p.id === id)?.name || 'Desconhecido'
  }

  return (
    <div className="p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Funis e Canvas
          </h1>
          <p className="text-muted-foreground text-base font-medium">
            Desenhe e gerencie a estrutura dos seus funis de marketing.
          </p>
        </div>
        <Button
          onClick={() => setAction({ type: 'canvas', mode: 'create' })}
          className="font-bold"
        >
          <Plus size={16} className="mr-2" /> Novo Canvas
        </Button>
      </div>

      {funnels.length === 0 ? (
        <EmptyState
          icon={Network}
          title="Nenhum funil criado"
          description="Você ainda não tem nenhum funil desenhado. Crie um novo canvas para mapear suas estratégias visuais."
          action={
            <Button
              onClick={() => setAction({ type: 'canvas', mode: 'create' })}
              size="lg"
            >
              Criar Novo Canvas
            </Button>
          }
        />
      ) : (
        <>
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Pesquisar funis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card font-medium"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFunnels.map((f) => (
              <Link to={`/canvas/${f.id}`} key={f.id} className="block group">
                <Card className="h-full hover-lift border-border shadow-sm bg-card group-hover:border-info/50 transition-colors p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-info/10 text-info flex items-center justify-center">
                      <Network size={20} />
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        f.status === 'Ativo'
                          ? 'bg-success/10 text-success border-none font-bold'
                          : 'bg-muted text-muted-foreground border-none font-bold'
                      }
                    >
                      {f.status}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-info transition-colors line-clamp-1 mb-2 text-foreground">
                    {f.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-6">
                    <Folder size={14} />
                    <span className="truncate">
                      {getProjectName(f.projectId)}
                    </span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground">
                      {f.nodes.length} blocos
                    </span>
                    <div className="text-info text-sm font-bold flex items-center opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                      Abrir <ChevronRight size={16} />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
