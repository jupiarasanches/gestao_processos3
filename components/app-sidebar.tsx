"use client"

import {
  BarChart3,
  FileText,
  Home,
  MapPin,
  Settings,
  TreePine,
  Users,
  Bell,
  Upload,
  Search,
  LogOut,
  ClipboardCheck,
} from "lucide-react"
import { useAuth } from "@/components/mock-auth-provider"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { GlobalSearchButton } from "@/components/global-search"

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Processos",
    url: "/processos",
    icon: FileText,
  },
  {
    title: "Técnicos",
    url: "/tecnicos",
    icon: Users,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
]

const processTypes = [
  {
    title: "SIMCAR",
    url: "/processos/simcar",
    icon: TreePine,
  },
  {
    title: "CC-SEMA",
    url: "/processos/cc-sema",
    icon: FileText,
  },
  {
    title: "DAAP",
    url: "/processos/daap",
    icon: FileText,
  },
  {
    title: "PEF",
    url: "/processos/pef",
    icon: TreePine,
  },
  {
    title: "Georreferenciamento",
    url: "/processos/georreferenciamento",
    icon: MapPin,
  },
  {
    title: "DLA",
    url: "/processos/dla",
    icon: FileText,
  },
  {
    title: "Laudos",
    url: "/processos/laudos",
    icon: ClipboardCheck,
  },
]

const utilityItems = [
  {
    title: "Upload de Documentos",
    url: "/upload",
    icon: Upload,
  },
  {
    title: "Busca Inteligente",
    url: "/busca",
    icon: Search,
  },
  {
    title: "Notificações",
    url: "/notificacoes",
    icon: Bell,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
]

// Componente de item de menu animado
function AnimatedMenuItem({ item, isActive }: { item: any, isActive: boolean }) {
  return (
    <SidebarMenuItem>
      <motion.div
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <SidebarMenuButton asChild className={isActive ? "bg-primary/10 text-primary" : ""}>
          <Link href={item.url}>
            <motion.div
              className="flex items-center gap-2 w-full"
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ 
                  rotate: isActive ? 360 : 0,
                  scale: isActive ? 1.1 : 1 
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <item.icon className="h-4 w-4" />
              </motion.div>
              <span>{item.title}</span>
              {isActive && (
                <motion.div
                  className="ml-auto w-2 h-2 bg-primary rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                />
              )}
            </motion.div>
          </Link>
        </SidebarMenuButton>
      </motion.div>
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  const { userProfile, signOut } = useAuth()
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4 space-y-4">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <TreePine className="h-6 w-6" />
          </motion.div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">EcoFlow</h2>
            <p className="text-sm text-muted-foreground">Gestão Ambiental</p>
          </div>
        </motion.div>
        
        {/* Busca Global */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="w-full"
        >
          <GlobalSearchButton />
        </motion.div>
      </SidebarHeader>

      <SidebarContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <SidebarGroup>
            <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainMenuItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
                  >
                    <AnimatedMenuItem 
                      item={item} 
                      isActive={pathname === item.url || (item.url === '/dashboard' && pathname === '/')}
                    />
                  </motion.div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </motion.div>

        <SidebarSeparator />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <SidebarGroup>
            <SidebarGroupLabel>Tipos de Processo</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {processTypes.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + (index * 0.03) }}
                  >
                    <AnimatedMenuItem 
                      item={item} 
                      isActive={pathname === item.url}
                    />
                  </motion.div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </motion.div>

        <SidebarSeparator />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <SidebarGroup>
            <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {utilityItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + (index * 0.05) }}
                  >
                    <AnimatedMenuItem 
                      item={item} 
                      isActive={pathname === item.url}
                    />
                  </motion.div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </motion.div>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt={userProfile?.nome || "Usuário"} />
                <AvatarFallback>
                  {userProfile?.nome?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userProfile?.nome || "Usuário"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userProfile?.perfil === "admin" ? "Administrador" : "Usuário"}
              </p>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start bg-transparent hover:bg-destructive/10 hover:text-destructive" 
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </motion.div>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  )
}