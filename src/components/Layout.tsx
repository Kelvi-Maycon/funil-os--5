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
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import QuickActionModal from '@/components/QuickActionModal'
import { DataManager } from '@/components/DataManager'
import useQuickActionStore from '@/stores/useQuickActionStore'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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

function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-yellow-400" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        {isDark ? 'Modo Claro' : 'Modo Escuro'}
      </TooltipContent>
    </Tooltip>
  )
}

function AppSidebar() {
  const location = useLocation()
  const { open, toggleSidebar } = useSidebar()
  const [, setQuickAction] = useQuickActionStore()

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-sidebar z-30 transition-all duration-200 ease-in-out"
    >
      <SidebarHeader
        className={cn(
          'shrink-0 transition-all duration-200 ease-in-out border-b border-border',
          'flex flex-row items-center justify-between p-3 px-4 h-[56px]',
          'group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2',
        )}
      >
        <Link to="/" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-dark))] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight truncate group-data-[collapsible=icon]:hidden text-foreground">
            Funil OS
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 group-data-[collapsible=icon]:hidden"
          onClick={toggleSidebar}
        >
          {open ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 flex-1 overflow-y-auto no-scrollbar">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="mb-1">
            <div className="nav-group-label group-data-[collapsible=icon]:hidden mb-1">
              {group.label}
            </div>
            <SidebarMenu>
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
                    >
                      <Link
                        to={item.url}
                        className={cn(
                          'nav-item',
                          isActive && 'nav-item-active',
                        )}
                      >
                        <item.icon className="w-[18px] h-[18px] shrink-0" />
                        <span className="truncate group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 btn-primary"
                onClick={() =>
                  setQuickAction({ type: 'project', mode: 'create' })
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Criar Novo</TooltipContent>
          </Tooltip>
          <ThemeSwitch />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 group-data-[collapsible=icon]:block hidden"
                onClick={toggleSidebar}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expandir Menu</TooltipContent>
          </Tooltip>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function Layout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-y-auto bg-background">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
      <QuickActionModal />
      <DataManager />
    </SidebarProvider>
  )
}
