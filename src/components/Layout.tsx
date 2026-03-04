import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import {
  LayoutDashboard,
  Folder,
  Network,
  CheckSquare,
  FileText,
  BookOpen,
  Settings,
  PanelLeft,
  PanelLeftClose,
  Plus,
  ChevronDown,
  LineChart,
  Lightbulb,
  Image as ImageIcon,
  BookMarked,
  Users,
  CreditCard,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import QuickActionModal from '@/components/QuickActionModal'
import { DataManager } from '@/components/DataManager'
import useQuickActionStore from '@/stores/useQuickActionStore'

const navGroups = {
  core: [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
    { title: 'Projetos', icon: Folder, url: '/projetos' },
    { title: 'Funis / Canvas', icon: Network, url: '/canvas' },
    { title: 'Analytics', icon: LineChart, url: '/analytics' },
  ],
  tools: [
    { title: 'Tarefas', icon: CheckSquare, url: '/tarefas' },
    { title: 'Documentos', icon: FileText, url: '/documentos' },
    { title: 'Biblioteca', icon: BookOpen, url: '/biblioteca' },
    { title: 'Insights', icon: Lightbulb, url: '/insights' },
    { title: 'Ativos', icon: ImageIcon, url: '/ativos' },
    { title: 'Swipe File', icon: BookMarked, url: '/swipe' },
  ],
  config: [
    { title: 'Configurações', icon: Settings, url: '/config' },
    { title: 'Equipe', icon: Users, url: '/equipe' },
    { title: 'Faturamento', icon: CreditCard, url: '/faturamento' },
  ],
}

function AppSidebar() {
  const location = useLocation()
  const { setOpen, isMobile, state } = useSidebar()
  const [, setQuickAction] = useQuickActionStore()

  const checkIsActive = (url: string) => {
    return (
      location.pathname === url ||
      (url !== '/' && location.pathname.startsWith(url))
    )
  }

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-sidebar z-30 shadow-none transition-all duration-200 ease-in-out"
      onMouseEnter={() => !isMobile && setOpen(true)}
      onMouseLeave={() => !isMobile && setOpen(false)}
    >
      <SidebarHeader
        className={cn(
          'shrink-0 transition-all duration-200 ease-in-out border-b border-border',
          'flex flex-row items-center justify-between p-4 px-6 h-20',
          'group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-3 group-data-[collapsible=icon]:py-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:h-auto',
        )}
      >
        <div className="flex items-center w-full justify-between group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shrink-0 shadow-sm">
              <Folder size={18} className="fill-current" />
            </div>
            <span className="font-bold text-lg text-foreground truncate whitespace-nowrap">
              Funil OS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuickAction({ mode: 'create', type: 'task' })}
              className="w-8 h-8 bg-background hover:bg-primary/10 text-primary hover:text-primary rounded-lg flex items-center justify-center shrink-0 transition-colors duration-100 outline-none"
              title="Nova Ação"
            >
              <Plus size={18} />
            </button>
            <div
              className="text-muted-foreground hover:text-foreground shrink-0 flex items-center justify-center w-8 h-8 transition-colors duration-100 cursor-pointer"
              title="Recolher Sidebar"
            >
              <PanelLeftClose size={20} />
            </div>
          </div>
        </div>

        <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-3 w-full">
          <div
            className="text-muted-foreground hover:text-foreground shrink-0 flex items-center justify-center w-8 h-8 transition-colors duration-100 cursor-pointer"
            title="Expandir Sidebar"
          >
            <PanelLeft size={20} />
          </div>
          <button
            onClick={() => setQuickAction({ mode: 'create', type: 'task' })}
            className="w-8 h-8 bg-background hover:bg-primary/10 text-primary hover:text-primary rounded-lg flex items-center justify-center shrink-0 transition-colors duration-100 outline-none"
            title="Nova Ação"
          >
            <Plus size={18} />
          </button>
          <div
            className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shrink-0 shadow-sm"
            title="Funil OS"
          >
            <Folder size={18} className="fill-current" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-3 flex flex-col gap-6 overflow-y-auto overflow-x-hidden no-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden mb-2">
            CORE
          </SidebarGroupLabel>
          <SidebarMenu className="gap-2 group-data-[collapsible=icon]:items-center">
            {navGroups.core.map((item) => {
              const isActive = checkIsActive(item.url)
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group-data-[collapsible=icon]:hidden hover:bg-accent cursor-pointer rounded-md mb-2"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between outline-none px-2">
                FERRAMENTAS
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarMenu className="gap-2 mt-1 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:mt-0">
                {navGroups.tools.map((item) => {
                  const isActive = checkIsActive(item.url)
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link to={item.url}>
                          <item.icon
                            size={20}
                            strokeWidth={isActive ? 2.5 : 2}
                          />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible mt-auto">
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group-data-[collapsible=icon]:hidden hover:bg-accent cursor-pointer rounded-md mb-2"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between outline-none px-2">
                CONFIG
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarMenu className="gap-2 mt-1 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:mt-0">
                {navGroups.config.map((item) => {
                  const isActive = checkIsActive(item.url)
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link to={item.url}>
                          <item.icon
                            size={20}
                            strokeWidth={isActive ? 2.5 : 2}
                          />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:py-3 shrink-0 transition-all duration-200 border-t border-border">
        <div className="flex items-center w-full justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-3">
          <div className="flex items-center group-data-[collapsible=icon]:justify-center w-full overflow-hidden">
            <img
              src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=8"
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-border shrink-0 mr-3 group-data-[collapsible=icon]:mr-0 shadow-sm"
              title={state === 'collapsed' ? 'Perfil: Diego K.' : undefined}
            />
            <div className="flex flex-col overflow-hidden transition-all duration-200 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:hidden flex-1">
              <span className="text-sm font-bold text-foreground truncate">
                Diego K.
              </span>
              <span className="text-xs font-semibold text-muted-foreground truncate">
                diego@funilos.com
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 transition-colors duration-100 text-muted-foreground hover:text-foreground group-data-[collapsible=icon]:justify-center">
            <DataManager />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function Layout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="bg-background relative flex flex-col h-screen overflow-hidden w-full transition-all duration-200 ease-in-out">
        <header className="h-20 flex items-center justify-between px-6 border-b border-border bg-background md:hidden shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shrink-0">
              <Folder size={18} className="fill-current" />
            </div>
            <span className="font-bold text-lg text-foreground">Funil OS</span>
          </div>
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
        </header>
        <main className="flex-1 overflow-auto animate-fade-in relative flex flex-col no-scrollbar">
          <Outlet />
        </main>
      </SidebarInset>
      <QuickActionModal />
    </SidebarProvider>
  )
}
