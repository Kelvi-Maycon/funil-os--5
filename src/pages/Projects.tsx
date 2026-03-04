import { Link } from 'react-router-dom'
import useProjectStore from '@/stores/useProjectStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Folder, Plus, Search, Calendar, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import { EmptyState } from '@/components/ui/empty-state'

export default function Projects() {
  const [projects] = useProjectStore()
  const [, setAction] = useQuickActionStore()
  const [search, setSearch] = useState('')

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Projetos
          </h1>
          <p className="text-muted-foreground text-base font-medium">
            Gerencie seus lançamentos, campanhas e funis perpétuos.
          </p>
        </div>
        <Button
          onClick={() => setAction({ type: 'project', mode: 'create' })}
          className="font-bold"
        >
          <Plus size={16} className="mr-2" /> Novo Projeto
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="Nenhum projeto encontrado"
          description="Você ainda não tem nenhum projeto. Crie seu primeiro projeto para começar a organizar seus funis e tarefas."
          action={
            <Button
              onClick={() => setAction({ type: 'project', mode: 'create' })}
              size="lg"
            >
              Criar Projeto
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
              placeholder="Pesquisar projetos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card font-medium"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((p) => (
              <Link to={`/projetos/${p.id}`} key={p.id} className="block group">
                <Card className="h-full hover-lift border-border shadow-sm bg-card group-hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <Folder size={20} className="fill-current opacity-20" />
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          p.status === 'Ativo'
                            ? 'bg-success/10 text-success border-none font-bold'
                            : p.status === 'Pausado'
                              ? 'bg-warning/10 text-warning border-none font-bold'
                              : 'bg-muted text-muted-foreground border-none font-bold'
                        }
                      >
                        {p.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                      {p.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 font-medium h-10">
                      {p.description || 'Nenhuma descrição fornecida.'}
                    </p>
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                        <Calendar size={14} />
                        {format(new Date(p.createdAt), 'dd MMM yyyy')}
                      </div>
                      <div className="flex items-center text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">
                        Acessar <ChevronRight size={16} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {filteredProjects.length === 0 && search && (
            <div className="py-12 text-center text-muted-foreground font-medium bg-card rounded-xl border border-dashed border-border">
              Nenhum projeto encontrado para "{search}".
            </div>
          )}
        </>
      )}
    </div>
  )
}
