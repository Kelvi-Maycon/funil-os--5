import { Settings } from 'lucide-react'

export default function Config() {
  return (
    <div className="flex flex-col h-full p-8 max-w-5xl mx-auto w-full animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            Configurações
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Gerencie as preferências e configurações do seu workspace.
          </p>
        </div>
      </div>

      <div className="flex-1 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-card/50 text-center p-8 min-h-[400px]">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Página de Configurações
        </h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          Em breve você poderá personalizar todas as preferências do seu
          workspace, incluindo tema, notificações e integrações.
        </p>
      </div>
    </div>
  )
}
