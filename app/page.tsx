"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/mock-auth-provider"
import { Loader2, TreePine } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Se o usuário está logado, redireciona para o dashboard
        router.push("/dashboard")
      } else {
        // Se não está logado, redireciona para login
        router.push("/login")
      }
    }
  }, [user, loading, router])

  // Mostrar loading enquanto verifica autenticação
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/80">
      <div className="text-center space-y-6">
        {/* Logo animado */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 animate-pulse">
              <TreePine className="h-10 w-10" />
            </div>
          </div>
        </div>

        {/* Loading indicator */}
              <div className="space-y-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            EcoFlow
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-muted-foreground">Verificando autenticação...</p>
              </div>
        </div>
      </div>
    </div>
  )
}