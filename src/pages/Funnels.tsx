import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFunnelStore from '@/stores/useFunnelStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Search, Network, Plus } from 'lucide-react'

export default function Funnels() {
  const [funnels] = useFunnelStore()
  const [, setAction] = useQuickActionStore()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filteredFunnels = funnels.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Canvas & Funis
          </h1>
          <p className="text-base font-medium text-muted-foreground">
            Mapeie a jornada do seu cliente e arquiteturas de conversão
          </p>
        </div>
        <Button onClick={() => setAction({ type: 'canvas', mode: 'create' })}>
          <Plus size={16} className="mr-2" /> Novo Funil
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          placeholder="Buscar funis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredFunnels.length === 0 ? (
        <EmptyState
          icon={Network}
          title="Nenhum funil encontrado"
          description="Você ainda não criou nenhum funil. Comece agora mapeando sua primeira estratégia."
          action={
            <Button
              onClick={() => setAction({ type: 'canvas', mode: 'create' })}
            >
              <Plus size={16} className="mr-2" /> Criar Meu Primeiro Funil
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFunnels.map((f) => (
            <Card
              key={f.id}
              className="cursor-pointer hover-lift group overflow-hidden flex flex-col"
              onClick={() => navigate(`/canvas/${f.id}`)}
            >
              <div
                className="h-36 bg-card border-b border-border relative shrink-0"
                style={{
                  backgroundImage:
                    'radial-gradient(hsl(var(--border)) 1px, transparent 0)',
                  backgroundSize: '16px 16px',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/60 backdrop-blur-sm z-10">
                  <Button variant="dark" className="pointer-events-none">
                    Abrir Canvas
                  </Button>
                </div>
                {f.nodes.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 scale-75">
                    <Network size={64} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardHeader className="p-6 pb-2">
                <CardTitle className="line-clamp-1 text-xl">{f.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2 flex justify-between items-center flex-1">
                <span className="text-base text-muted-foreground">
                  {f.nodes.length} blocos
                </span>
                <Badge
                  variant="outline"
                  className="bg-muted text-muted-foreground border-none font-medium"
                >
                  {f.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
