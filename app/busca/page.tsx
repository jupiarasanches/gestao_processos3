"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { 
  Search, 
  Bot, 
  FileText, 
  Users, 
  FolderOpen, 
  Zap, 
  Brain, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Sparkles,
  FileSearch,
  History,
  Filter,
  Download,
  Eye,
  Clock,
  TrendingUp,
  Database,
  MapPin,
  TreePine,
  ClipboardCheck
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useProcesses } from "@/contexts/processes-context"
import { useTechnicians } from "@/contexts/technicians-context"
import { motion, AnimatePresence } from "framer-motion"
import { VoiceSearch } from "@/components/voice-search"

interface AISearchResult {
  id: string
  type: "documento" | "processo" | "tecnico"
  title: string
  description: string
  content: string
  keywords: string[]
  relevanceScore: number
  confidence: number
  processId?: string
  dateCreated: string
  fileSize?: string
  author?: string
}

interface SearchHistory {
  id: string
  query: string
  timestamp: string
  resultsCount: number
  category: string
}

export default function BuscaPage() {
  const { processes } = useProcesses()
  const { technicians } = useTechnicians()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<AISearchResult[]>([])
  const [searchCategory, setSearchCategory] = useState<"todos" | "documentos" | "processos" | "tecnicos">("todos")
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [totalProcessingTime, setTotalProcessingTime] = useState(0)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  // Dados simulados expandidos para busca
  const mockDocuments: AISearchResult[] = [
    {
      id: "DOC-001",
      type: "documento",
      title: "Relatório de Impacto Ambiental - Fazenda São João",
      description: "Análise completa do impacto ambiental para licenciamento agropecuário",
      content: "O projeto visa o licenciamento ambiental para atividades agropecuárias em área de 500 hectares. Foram identificadas nascentes e área de preservação permanente que serão mantidas intactas. O estudo aponta baixo impacto ambiental com medidas mitigadoras adequadas.",
      keywords: ["licenciamento", "agropecuária", "nascentes", "APP", "preservação", "impacto ambiental"],
      relevanceScore: 0.95,
      confidence: 0.92,
      processId: "SIMCAR-2024-001",
      dateCreated: "2024-01-15",
      fileSize: "2.4 MB",
      author: "Dr. Maria Silva"
    },
    {
      id: "DOC-002",
      type: "documento", 
      title: "Plano de Manejo Florestal - Área Central",
      description: "Documento técnico para exploração florestal sustentável",
      content: "O plano de exploração florestal sustentável abrange 200 hectares de floresta nativa. As atividades de corte seletivo serão realizadas conforme normas do IBAMA, preservando a biodiversidade e garantindo a regeneração natural.",
      keywords: ["manejo florestal", "sustentável", "corte seletivo", "IBAMA", "floresta nativa", "biodiversidade"],
      relevanceScore: 0.89,
      confidence: 0.88,
      processId: "PEF-2024-002",
      dateCreated: "2024-02-20",
      fileSize: "1.8 MB",
      author: "Eng. João Santos"
    },
    {
      id: "DOC-003",
      type: "documento",
      title: "Estudo de Recuperação de APP - Margem do Rio Verde",
      description: "Plano detalhado para recuperação de área degradada",
      content: "O projeto de recuperação ambiental visa restaurar 50 hectares de área de preservação permanente às margens do Rio Verde. Serão plantadas espécies nativas regionais, incluindo mata ciliar para proteção dos recursos hídricos.",
      keywords: ["recuperação", "APP", "restauração", "espécies nativas", "Rio Verde", "mata ciliar"],
      relevanceScore: 0.91,
      confidence: 0.94,
      processId: "PRA-2024-006",
      dateCreated: "2024-03-10",
      fileSize: "3.1 MB",
      author: "Dra. Ana Costa"
    }
  ]

  // Converter processos em resultados de busca
  const processesToSearchResults = (): AISearchResult[] => {
    return processes.map(process => ({
      id: `PROC-${process.id}`,
      type: "processo" as const,
      title: `${process.type} - ${process.title}`,
      description: process.description || "Processo ambiental em andamento",
      content: `Processo do tipo ${process.type} com status ${process.status}. Técnico responsável: ${process.technician}. Localização: ${process.location}`,
      keywords: [process.type, process.status, process.technician, process.location].filter(Boolean),
      relevanceScore: 0.85,
      confidence: 0.90,
      processId: process.id,
      dateCreated: process.createdAt,
      author: process.technician
    }))
  }

  // Converter técnicos em resultados de busca
  const techniciansToSearchResults = (): AISearchResult[] => {
    return technicians.map(tech => ({
      id: `TECH-${tech.id}`,
      type: "tecnico" as const,
      title: tech.name,
      description: `${tech.specialty} - ${tech.experience}`,
      content: `Técnico especializado em ${tech.specialty} com ${tech.experience} de experiência. Localização: ${tech.location}. Status: ${tech.status}`,
      keywords: [tech.specialty, tech.experience, tech.location, tech.status, tech.name].filter(Boolean),
      relevanceScore: 0.80,
      confidence: 0.85,
      dateCreated: "2024-01-01",
      author: "Sistema"
    }))
  }

  // Função de busca inteligente expandida
  const performAISearch = async (query: string, category: string = "todos") => {
    setIsSearching(true)
    const startTime = Date.now()
    
    // Simular processamento da IA
    await new Promise(resolve => setTimeout(resolve, 1500))

    let allResults: AISearchResult[] = []
    
    // Adicionar documentos
    if (category === "todos" || category === "documentos") {
      allResults.push(...mockDocuments)
    }
    
    // Adicionar processos
    if (category === "todos" || category === "processos") {
      allResults.push(...processesToSearchResults())
    }
    
    // Adicionar técnicos
    if (category === "todos" || category === "tecnicos") {
      allResults.push(...techniciansToSearchResults())
    }

    // Filtrar resultados baseado na query
    const filteredResults = allResults.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase()) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase())) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    )

    // Ordenar por relevância
    const sortedResults = filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore)

    const processingTime = (Date.now() - startTime) / 1000
    setTotalProcessingTime(processingTime)
    setSearchResults(sortedResults)
    setIsSearching(false)

    // Adicionar ao histórico
    const historyItem: SearchHistory = {
      id: Date.now().toString(),
      query,
      timestamp: new Date().toLocaleString(),
      resultsCount: sortedResults.length,
      category
    }
    setSearchHistory(prev => [historyItem, ...prev.slice(0, 9)]) // Manter apenas os 10 mais recentes
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      performAISearch(searchQuery.trim(), searchCategory)
    }
  }

  const handleHistoryClick = (historyItem: SearchHistory) => {
    setSearchQuery(historyItem.query)
    setSearchCategory(historyItem.category as any)
    performAISearch(historyItem.query, historyItem.category)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "documento": return <FileText className="h-4 w-4 text-blue-600" />
      case "processo": return <FolderOpen className="h-4 w-4 text-green-600" />
      case "tecnico": return <Users className="h-4 w-4 text-purple-600" />
      default: return <FileSearch className="h-4 w-4" />
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "documento": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "processo": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "tecnico": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600"
    if (confidence >= 0.7) return "text-yellow-600"
    return "text-orange-600"
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.9) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (confidence >= 0.7) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <AlertTriangle className="h-4 w-4 text-orange-600" />
  }

  const popularQueries = [
    "licenciamento ambiental",
    "área de preservação permanente",
    "recuperação ambiental", 
    "manejo florestal",
    "impacto ambiental",
    "espécies nativas",
    "recursos hídricos",
    "compensação ambiental"
  ]

  const statsData = [
    { label: "Total de Documentos", value: mockDocuments.length, icon: FileText },
    { label: "Processos Ativos", value: processes.length, icon: FolderOpen },
    { label: "Técnicos Cadastrados", value: technicians.length, icon: Users },
    { label: "Buscas Realizadas", value: searchHistory.length, icon: Search }
  ]

  // Carregar busca da URL
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      performAISearch(query, "todos")
    }
  }, [searchParams])

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Bot className="h-8 w-8 text-primary" />
              🔍 Busca Inteligente
            </h1>
            <p className="text-muted-foreground">
              Use IA para encontrar informações em documentos, processos e dados do sistema
            </p>
          </div>
        </div>

        {/* Interface Principal de Busca */}
        <Card className="border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Busca com Inteligência Artificial
            </CardTitle>
            <CardDescription>
              Digite palavras-chave ou faça perguntas em linguagem natural
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Campo de Busca */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Digite sua busca... (ex: 'documentos sobre nascentes', 'processos de João', 'técnicos especialistas em APP')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={searchCategory} onValueChange={(value: any) => setSearchCategory(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">🔍 Todos</SelectItem>
                  <SelectItem value="documentos">📄 Documentos</SelectItem>
                  <SelectItem value="processos">📁 Processos</SelectItem>
                  <SelectItem value="tecnicos">👥 Técnicos</SelectItem>
                </SelectContent>
              </Select>
              <VoiceSearch
                onTranscript={(text) => {
                  setSearchQuery(text)
                  performAISearch(text, searchCategory)
                }}
                className="hidden sm:block"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery.trim()}
                className="px-8 h-12"
                size="lg"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Buscar
                  </>
                )}
              </Button>
            </div>

            {/* Sugestões de Busca */}
            {!searchResults.length && !isSearching && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  💡 Sugestões populares:
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularQueries.map((query) => (
                    <Badge 
                      key={query}
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => setSearchQuery(query)}
                    >
                      {query}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Resultados */}
          <div className="lg:col-span-2 space-y-4">
            {/* Loading State */}
            {isSearching && (
              <Card className="border-primary/20">
                <CardContent className="pt-8 pb-8">
                  <motion.div 
                    className="flex items-center justify-center space-y-4 flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Bot className="h-12 w-12 text-primary" />
                    </motion.div>
                    <div className="text-center">
                      <p className="font-medium mb-1">Analisando documentos com IA...</p>
                      <div className="text-sm text-muted-foreground">
                        Processando conteúdo • Extraindo palavras-chave • Calculando relevância
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            )}

            {/* Resultados */}
            <AnimatePresence>
              {searchResults.length > 0 && !isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Cabeçalho dos Resultados */}
                  <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium">
                            {searchResults.length} resultado(s) encontrado(s)
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Processado em {totalProcessingTime.toFixed(1)}s
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Busca: "{searchQuery}" na categoria "{searchCategory}"
                      </p>
                    </CardContent>
                  </Card>

                  {/* Lista de Resultados */}
                  <div className="space-y-3">
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="border-border/40 hover:shadow-md transition-all duration-200 hover:border-primary/30">
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getTypeIcon(result.type)}
                                    <h4 className="font-medium">{result.title}</h4>
                                    <Badge className={`text-xs ${getTypeBadgeColor(result.type)}`}>
                                      {result.type}
                                    </Badge>
                                    {result.processId && (
                                      <Badge variant="outline" className="text-xs">
                                        {result.processId}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {result.description}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  {getConfidenceIcon(result.confidence)}
                                  <span className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                                    {Math.round(result.confidence * 100)}%
                                  </span>
                                </div>
                              </div>

                              <div className="bg-muted/30 p-3 rounded text-sm">
                                <p className="italic">"{result.content.substring(0, 200)}..."</p>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {result.keywords.slice(0, 4).map((keyword) => (
                                    <Badge key={keyword} variant="secondary" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                  {result.keywords.length > 4 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{result.keywords.length - 4}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(result.dateCreated).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {Math.round(result.relevanceScore * 100)}% relevante
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="mr-1 h-3 w-3" />
                                  Ver Detalhes
                                </Button>
                                {result.type === "documento" && (
                                  <Button variant="outline" size="sm">
                                    <Download className="mr-1 h-3 w-3" />
                                    Download
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nenhum resultado */}
            {searchResults.length === 0 && !isSearching && searchQuery && (
              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                <CardContent className="pt-8 pb-8">
                  <div className="text-center">
                    <FileSearch className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Nenhum resultado encontrado</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Tente usar palavras-chave diferentes ou termos mais específicos
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {popularQueries.slice(0, 4).map((query) => (
                        <Badge 
                          key={query}
                          variant="outline" 
                          className="cursor-pointer hover:bg-orange-100"
                          onClick={() => setSearchQuery(query)}
                        >
                          {query}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Estatísticas do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {statsData.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <Badge variant="secondary">{stat.value}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Histórico de Busca */}
            {searchHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Histórico de Busca
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {searchHistory.slice(0, 5).map((item) => (
                    <div 
                      key={item.id}
                      className="p-2 border border-border/40 rounded cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleHistoryClick(item)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">{item.query}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.resultsCount}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.timestamp}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Filtros Rápidos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros Rápidos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setSearchCategory("documentos")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Apenas Documentos
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setSearchCategory("processos")}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Apenas Processos
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setSearchCategory("tecnicos")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Apenas Técnicos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}