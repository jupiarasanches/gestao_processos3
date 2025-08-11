"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Bot, FileText, FolderOpen, Users, Zap, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface QuickSearchResult {
  id: string
  type: "documento" | "processo" | "tecnico"
  title: string
  description: string
  url: string
  icon: any
}

export function GlobalSearchButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<QuickSearchResult[]>([])
  const router = useRouter()

  // Dados simulados para busca rápida
  const quickSearchData: QuickSearchResult[] = [
    {
      id: "1",
      type: "documento",
      title: "Relatório de Impacto Ambiental",
      description: "Fazenda São João - Licenciamento",
      url: "/processos/simcar",
      icon: FileText
    },
    {
      id: "2",
      type: "processo",
      title: "SIMCAR-2024-001",
      description: "Processo de licenciamento em andamento",
      url: "/processos/simcar",
      icon: FolderOpen
    },
    {
      id: "3",
      type: "tecnico",
      title: "Dr. Maria Silva",
      description: "Especialista em Licenciamento Ambiental",
      url: "/tecnicos",
      icon: Users
    },
    {
      id: "4",
      type: "documento",
      title: "Plano de Manejo Florestal",
      description: "Área Central - Exploração Sustentável",
      url: "/processos/pef",
      icon: FileText
    }
  ]

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const filtered = quickSearchData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    setResults(filtered)
  }

  const handleResultClick = (result: QuickSearchResult) => {
    setIsOpen(false)
    setQuery("")
    setResults([])
    router.push(result.url)
  }

  const handleAdvancedSearch = () => {
    setIsOpen(false)
    router.push(`/busca?q=${encodeURIComponent(query)}`)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "documento": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "processo": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "tecnico": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Buscar...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Busca Rápida
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campo de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Digite para buscar documentos, processos ou técnicos..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                handleSearch(e.target.value)
              }}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Resultados da busca rápida */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2 max-h-64 overflow-y-auto"
              >
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 border border-border/40 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <result.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{result.title}</p>
                          <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <Zap className="h-4 w-4 text-amber-500" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sugestões quando não há resultados */}
          {query && results.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Nenhum resultado encontrado</p>
              <p className="text-xs text-muted-foreground">Tente termos diferentes ou use a busca avançada</p>
            </div>
          )}

          {/* Sugestões iniciais */}
          {!query && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Sugestões populares:</p>
              <div className="flex flex-wrap gap-2">
                {["licenciamento", "APP", "manejo florestal", "recuperação"].map((suggestion) => (
                  <Badge 
                    key={suggestion}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => {
                      setQuery(suggestion)
                      handleSearch(suggestion)
                    }}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Resultados em tempo real
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAdvancedSearch}
              className="gap-2"
            >
              <Bot className="h-4 w-4" />
              Busca Avançada com IA
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Componente para usar em qualquer lugar da aplicação
export function QuickSearchWidget() {
  return (
    <div className="flex items-center gap-2">
      <GlobalSearchButton />
    </div>
  )
}