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
  useSidebar,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Folder,
  Network,
  CheckSquare,
  FileText,
  BookOpen,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import QuickActionModal from '@/components/QuickActionModal'
import { DataManager } from '@/components/DataManager'
import useQuickActionStore from '@/stores/useQuickActionStore'

const navGroups = [
  {
    label: 'Principal',
    items: [
      { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
      { title: 'Projetos', icon: Folder, url: '/projetos' },
      { title: 'Canvas', icon: Network, url: '/canvas' },
    ],
  },
  {
    label: 'Ferramentas',
    items: [
      { title: 'Tarefas', icon: CheckSquare, url: '/tarefas' },
      { title: 'Documentos', icon: FileText, url: '/documentos' },
    ],
  },
  {
    label: 'Recursos',
    items: [
      { title: 'Biblioteca', icon: BookOpen, url: '/biblioteca' },
    ],
  },
]

function AppSidebar() {
  const location = useLocation()
  const { setOpen, isMobile } = useSidebar()
  const [, setQuickAction] = useQuickActionStore()

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
          'flex flex-row items-center justify-between p-4 px-5 h-[60px]',
          'group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-3 group-data-[collapsible=icon]:py-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:h-auto',
        )}
      >
        <div className="flex items-center w-full justify-between group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-dark rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
              <Sparkles size={16} />
            </div>
            <span className="font-bold text-base tracking-tight text-foreground truncate whitespace-nowrap">
              Funil OS
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setQuickAction({ mode: 'create', type: 'task' })}
              className="w-7 h-7 bg-brand-subtle hover:bg-brand/10 text-brand rounded-md flex items-center justify-center shrink-0 transition-all duration-100 outline-none focus-ring"
              title="Nova tarefa"
            >
              <Plus size={15} />
            </button>
            <div className="text-muted-foreground hover:text-foreground shrink-0 flex items-center justify-center">
              <SidebarTrigger>
                <PanelLeftClose size={16} />
              </SidebarTrigger>
            </div>
          </div>
        </div>

        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-dark rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
            <Sparkles size={16} />
          </div>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center text-muted-foreground hover:text-foreground">
          <SidebarTrigger>
            <PanelLeft size={16} />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 gap-0">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-2">
            <div className="section-header group-data-[collapsible=icon]:hidden mb-1">
              {group.label}
            </div>
            <SidebarMenu className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.url === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.url)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        'h-9 rounded-lg px-3 gap-3 font-medium text-[13px] transition-all duration-150',
                        isActive
                          ? 'bg-brand-subtle text-brand font-semibold shadow-none'
                          : 'text-muted-foreground hover:bg-brand-ghost hover:text-foreground',
                      )}
                    >
                      <Link to={item.url}>
                        <item.icon
                          size={17}
                          className={cn(
                            'shrink-0 transition-colors',
                            isActive ? 'text-brand' : 'text-muted-foreground',
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-light to-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
            DK
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-[13px] font-semibold text-foreground truncate">Diego K.</span>
            <span className="text-[11px] text-muted-foreground truncate">Growth Lead</span>
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
