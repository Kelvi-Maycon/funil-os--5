import { useState } from 'react'
import useResourceStore from '@/stores/useResourceStore'
import { Button } from '@/components/ui/button'
import { BookOpen, Plus } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

export default function Library() {
  const [resources] = useResourceStore()

  return (
    <div className="p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Biblioteca
          </h1>
          <p className="text-muted-foreground text-base font-medium">
            Seus ativos, referências e banco de imagens.
          </p>
        </div>
        <Button className="font-bold">
          <Plus size={16} className="mr-2" /> Adicionar Recurso
        </Button>
      </div>

      <div className="flex-1">
        <EmptyState
          icon={BookOpen}
          title="Biblioteca de Ativos"
          description="Explore seus recursos salvos. Interface de galeria avançada em construção."
          action={<Button variant="outline">Upload de Arquivos</Button>}
        />
      </div>
    </div>
  )
}
