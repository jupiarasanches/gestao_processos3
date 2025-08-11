"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Bot, 
  Search, 
  FileText, 
  Zap, 
  Brain, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Sparkles,
  FileSearch
} from "lucide-react"

interface AISearchResult {
  documentId: string
  documentName: string
  processId: string
  relevanceScore: number
  extractedText: string
  keywords: string[]
  summary: string
  confidence: number
}

interface AIAnalysis {
  query: string
  results: AISearchResult[]
  totalDocuments: number
  processingTime: number
  suggestions: string[]
}

export default function AIDocumentSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<AIAnalysis | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Simulação de dados de documentos processados pela IA
  const mockDocuments: AISearchResult[] = [
    {
      documentId: "DOC-001",
      documentName: "Relatório de Impacto Ambiental - Fazenda São João",
      processId: "SIMCAR-2024-001",
      relevanceScore: 0.95,
      extractedText: "O projeto visa o licenciamento ambiental para atividades agropecuárias em área de 500 hectares. Foram identificadas nascentes e área de preservação permanente que serão mantidas intactas...",
      keywords: ["licenciamento", "agropecuária", "nascentes", "APP", "preservação"],
      summary: "Relatório técnico sobre licenciamento ambiental de fazenda com foco em preservação de nascentes e APPs.",
      confidence: 0.92
    },
    {
      documentId: "DOC-002", 
      documentName: "Plano de Manejo Florestal - Área Central",
      processId: "PEF-2024-002",
      relevanceScore: 0.89,
      extractedText: "O plano de exploração florestal sustentável abrange 200 hectares de floresta nativa. As atividades de corte seletivo serão realizadas conforme normas do IBAMA...",
      keywords: ["manejo florestal", "sustentável", "corte seletivo", "IBAMA", "floresta nativa"],
      summary: "Documento técnico detalhando práticas sustentáveis de manejo florestal em área nativa.",
      confidence: 0.88
    },
    {
      documentId: "DOC-003",
      documentName: "Estudo de Recuperação de APP - Margem do Rio",
      processId: "PRA-2024-006", 
      relevanceScore: 0.91,
      extractedText: "O projeto de recuperação ambiental visa restaurar 50 hectares de área de preservação permanente às margens do Rio Verde. Serão plantadas espécies nativas...",
      keywords: ["recuperação", "APP", "restauração", "espécies nativas", "Rio Verde"],
      summary: "Plano detalhado para recuperação de área degradada às margens de rio com plantio de espécies nativas.",
      confidence: 0.94
    }
  ]

  const performAISearch = async (query: string) => {
    setIsSearching(true)
    
    // Simular processamento da IA
    await new Promise(resolve => setTimeout(resolve, 2000))

    const relevantResults = mockDocuments.filter(doc => 
      doc.extractedText.toLowerCase().includes(query.toLowerCase()) ||
      doc.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase())) ||
      doc.documentName.toLowerCase().includes(query.toLowerCase())
    )

    const analysis: AIAnalysis = {
      query,
      results: relevantResults.sort((a, b) => b.relevanceScore - a.relevanceScore),
      totalDocuments: mockDocuments.length,
      processingTime: Math.random() * 2 + 1, // 1-3 segundos
      suggestions: generateSuggestions(query)
    }

    setSearchResults(analysis)
    setIsSearching(false)
  }

  const generateSuggestions = (query: string): string[] => {
    const suggestions = [
      "licenciamento ambiental",
      "área de preservação permanente", 
      "recuperação ambiental",
      "manejo florestal sustentável",
      "impacto ambiental",
      "espécies nativas",
      "recursos hídricos",
      "compensação ambiental"
    ]
    
    return suggestions
      .filter(s => !s.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      performAISearch(searchQuery.trim())
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Brain className="h-4 w-4" />
          Busca IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Busca Inteligente em Documentos
          </DialogTitle>
          <DialogDescription>
            Use IA para encontrar informações específicas nos documentos dos processos
          </DialogDescription>
        </DialogHeader>

        {/* Interface de Busca */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <FileSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Digite palavras-chave ou faça uma pergunta... (ex: 'nascentes', 'área de preservação')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
              className="gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Buscar
                </>
              )}
            </Button>
          </div>

          {/* Exemplos de busca */}
          {!searchResults && !isSearching && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">💡 Exemplos de busca:</p>
              <div className="flex flex-wrap gap-2">
                {["nascentes", "APP", "recuperação", "manejo florestal", "licenciamento"].map((example) => (
                  <Badge 
                    key={example}
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => setSearchQuery(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isSearching && (
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-y-2 flex-col">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Analisando documentos com IA...</p>
                <div className="text-xs text-muted-foreground/70">
                  Processando conteúdo • Extraindo palavras-chave • Calculando relevância
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resultados da Busca */}
        {searchResults && !isSearching && (
          <div className="space-y-4">
            {/* Cabeçalho dos resultados */}
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    <span className="font-medium">
                      {searchResults.results.length} resultado(s) encontrado(s)
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Processado em {searchResults.processingTime.toFixed(1)}s
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Busca: "{searchResults.query}" em {searchResults.totalDocuments} documentos
                </p>
              </CardContent>
            </Card>

            {/* Lista de Resultados */}
            {searchResults.results.length > 0 ? (
              <div className="space-y-3">
                {searchResults.results.map((result, index) => (
                  <Card key={result.documentId} className="border-border/40 hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4 text-primary" />
                              <h4 className="font-medium">{result.documentName}</h4>
                              <Badge variant="outline" className="text-xs">
                                {result.processId}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {result.summary}
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
                          <p className="italic">"{result.extractedText}"</p>
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
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-amber-500" />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(result.relevanceScore * 100)}% relevante
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-orange-400 mx-auto mb-2" />
                    <h3 className="font-medium mb-1">Nenhum resultado encontrado</h3>
                    <p className="text-sm text-muted-foreground">
                      Tente usar palavras-chave diferentes ou termos mais específicos
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sugestões */}
            {searchResults.suggestions.length > 0 && (
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Sugestões de busca:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.suggestions.map((suggestion) => (
                      <Badge 
                        key={suggestion}
                        variant="outline" 
                        className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        onClick={() => {
                          setSearchQuery(suggestion)
                          performAISearch(suggestion)
                        }}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}