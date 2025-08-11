"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { MockAuthProvider, useAuth } from "@/components/mock-auth-provider"
import { ProcessesProvider } from "@/contexts/processes-context"
import { TechniciansProvider } from "@/contexts/technicians-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { PageTransition, PageTransitionWithSidebar } from "@/components/page-transition"
import { ThemeTransition } from "@/components/theme-transition"
import { PageLoadingSpinner } from "@/components/loading-spinner"
import { usePageTransition } from "@/hooks/use-page-transition"
import { AnimatePresence } from "framer-motion"

const inter = Inter({ subsets: ["latin"] })

// Metadata foi removida pois este é um componente client-side

// Componente wrapper que só mostra o sidebar se o usuário estiver logado
function LayoutWithAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const { isTransitioning } = usePageTransition()

  // Enquanto está carregando, não mostra nada (ou você pode mostrar um loading spinner)
  if (loading) {
    return (
      <main className="flex-1 overflow-hidden">
        <PageTransition>{children}</PageTransition>
        <AnimatePresence>{isTransitioning && <PageLoadingSpinner />}</AnimatePresence>
      </main>
    )
  }

  // Se o usuário não está logado, não mostra o sidebar (página de login)
  if (!user) {
    return (
      <main className="flex-1 overflow-hidden">
        <PageTransition>{children}</PageTransition>
        <AnimatePresence>{isTransitioning && <PageLoadingSpinner />}</AnimatePresence>
      </main>
    )
  }

  // Se o usuário está logado, mostra o layout completo com sidebar
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        <PageTransitionWithSidebar>{children}</PageTransitionWithSidebar>
        <AnimatePresence>{isTransitioning && <PageLoadingSpinner />}</AnimatePresence>
      </main>
    </SidebarProvider>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
          <MockAuthProvider>
            <ProcessesProvider>
              <TechniciansProvider>
                <LayoutWithAuth>
                  {children}
                </LayoutWithAuth>
                <Toaster />
                <ThemeTransition />
              </TechniciansProvider>
            </ProcessesProvider>
          </MockAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
