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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import QuickActionModal from '@/components/QuickActionModal'
import { DataManager } from '@/components/DataManager'
import useQuickActionStore from '@/stores/useQuickActionStore'

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
  { title: 'Projetos', icon: Folder, url: '/projetos' },
  { title: 'Canvas', icon: Network, url: '/canvas' },
  { title: 'Tarefas', icon: CheckSquare, url: '/tarefas' },
  { title: 'Documentos', icon: FileText, url: '/documentos' },
  { title: 'Biblioteca', icon: BookOpen, url: '/biblioteca' },
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
          'flex flex-row items-center justify-between p-4 px-6 h-20',
          'group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-3 group-data-[collapsible=icon]:py-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:h-auto',
        )}
      >
        {/* Expanded View */}
        <div className="flex items-center w-full justify-between group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-[8px] flex items-center justify-center text-primary-foreground shrink-0 shadow-sm">
              <Folder size={18} className="fill-current" />
            </div>
            <span className="font-bold text-[18px] text-foreground truncate whitespace-nowrap">
              Funil OS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuickAction({ mode: 'create', type: 'task' })}
              className="w-8 h-8 bg-background hover:bg-brand-dark text-primary hover:text-white rounded-[8px] flex items-center justify-center shrink-0 transition-colors duration-100 outline-none"
            >
              <Plus size={18} />
            </button>
            <div className="text-muted-foreground hover:text-brand-dark shrink-0 flex items-center justify-center w-8 h-8 transition-colors duration-100 cursor-pointer">
              <PanelLeftClose size={20} />
            </div>
          </div>
        </div>

        {/* Collapsed View */}
        <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-3 w-full">
          <div className="text-muted-foreground hover:text-brand-dark shrink-0 flex items-center justify-center w-8 h-8 transition-colors duration-100 cursor-pointer">
            <PanelLeft size={20} />
          </div>
          <button
            onClick={() => setQuickAction({ mode: 'create', type: 'task' })}
            className="w-8 h-8 bg-background hover:bg-brand-dark text-primary hover:text-white rounded-[8px] flex items-center justify-center shrink-0 transition-colors duration-100 outline-none"
          >
            <Plus size={18} />
          </button>
          <div className="w-8 h-8 bg-primary rounded-[8px] flex items-center justify-center text-primary-foreground shrink-0 shadow-sm">
            <Folder size={18} className="fill-current" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-3 flex flex-col gap-2 overflow-y-auto overflow-x-hidden no-scrollbar group-data-[collapsible=icon]:items-center">
        <SidebarGroup className="group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:w-auto">
          <SidebarMenu className="gap-2 group-data-[collapsible=icon]:items-center">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.url ||
                (item.url !== '/' && location.pathname.startsWith(item.url))
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className="group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center"
                  >
                    <Link to={item.url}>
                      <item.icon
                        size={20}
                        strokeWidth={isActive ? 2.5 : 2}
                        className="shrink-0 group-data-[collapsible=icon]:mx-auto"
                      />
                      <span className="truncate whitespace-nowrap overflow-hidden transition-all duration-200 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:py-3 shrink-0 transition-all duration-200 border-t border-border">
        <div className="flex items-center w-full justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-3">
          <div className="flex items-center group-data-[collapsible=icon]:justify-center w-full">
            <img
              src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=8"
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-border shrink-0 mr-3 group-data-[collapsible=icon]:mr-0 shadow-sm"
            />
            <div className="flex flex-col overflow-hidden transition-all duration-200 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-bold text-foreground truncate whitespace-nowrap">
                Diego K.
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground truncate whitespace-nowrap">
                diego@funilos.com
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 overflow-hidden transition-colors duration-100 text-muted-foreground hover:text-brand-dark group-data-[collapsible=icon]:justify-center w-full">
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
        <header className="h-20 flex items-center justify-between px-6 border-b border-border bg-sidebar md:hidden shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-[8px] flex items-center justify-center text-primary-foreground shrink-0">
              <Folder size={18} className="fill-current" />
            </div>
            <span className="font-bold text-lg text-foreground">Funil OS</span>
          </div>
          <SidebarTrigger className="text-muted-foreground" />
        </header>
        <main className="flex-1 overflow-auto animate-fade-in relative flex flex-col no-scrollbar">
          <Outlet />
        </main>
      </SidebarInset>
      <QuickActionModal />
    </SidebarProvider>
  )
}
