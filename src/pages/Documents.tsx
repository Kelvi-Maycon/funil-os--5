import { useState } from 'react'
import useDocumentStore from '@/stores/useDocumentStore'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { Button } from '@/components/ui/button'
import { FileText, Plus } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

export default function Documents() {
  const [docs] = useDocumentStore()
  const [, setAction] = useQuickActionStore()

  return (
    <div className="p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-in flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Documentos
          </h1>
          <p className="text-muted-foreground text-base font-medium">
            Centralize seus scripts de vendas, copys e pesquisas.
          </p>
        </div>
        <Button
          onClick={() => setAction({ type: 'document', mode: 'create' })}
          className="font-bold"
        >
          <Plus size={16} className="mr-2" /> Novo Documento
        </Button>
      </div>

      <div className="flex-1">
        <EmptyState
          icon={FileText}
          title="Gestão de Documentos"
          description="O editor rico de documentos em tela cheia será implementado na próxima versão."
          action={
            <Button
              onClick={() => setAction({ type: 'document', mode: 'create' })}
            >
              Criar Documento Rápido
            </Button>
          }
        />
      </div>
    </div>
  )
}
