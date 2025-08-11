"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, FileText, Filter, MapPin, Plus, Search, TreePine, Upload, Leaf, User, Calendar, BarChart3, Trash2, CheckCircle, PauseCircle, Clock, X } from "lucide-react"
import AIDocumentSearch from "@/components/ai-document-search"
import { NewProcessDialog } from "@/components/new-process-dialog"
import { useProcesses } from "@/contexts/processes-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProcessosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [typeFilter, setTypeFilter] = useState("todos")
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadProcessId, setUploadProcessId] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  
  const { processes, deleteProcess, updateProcess } = useProcesses()

  // Obter processo selecionado
  const selectedProcessData = selectedProcess ? processes.find(p => p.id === selectedProcess) : null

  // Função para alterar status do processo
  const handleStatusChange = (processId: string, newStatus: string) => {
    updateProcess(processId, { status: newStatus })
  }

  // Função para abrir dialog de upload
  const handleUploadClick = (processId: string) => {
    setUploadProcessId(processId)
    setUploadDialogOpen(true)
    setSelectedFiles([])
    setUploadProgress({})
  }

  // Função para lidar com seleção de arquivos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
  }

  // Função para remover arquivo da lista
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Função para simular upload de arquivos
  const handleUpload = async () => {
    if (!uploadProcessId || selectedFiles.length === 0) return

    for (const file of selectedFiles) {
      const fileName = file.name
      setUploadProgress(prev => ({ ...prev, [fileName]: 0 }))

      // Simular progresso de upload
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setUploadProgress(prev => ({ ...prev, [fileName]: progress }))
      }
    }

    // Atualizar contador de documentos do processo
    const currentProcess = processes.find(p => p.id === uploadProcessId)
    if (currentProcess) {
      updateProcess(uploadProcessId, { 
        documents: currentProcess.documents + selectedFiles.length 
      })
    }

    // Fechar dialog e limpar estado
    setTimeout(() => {
      setUploadDialogOpen(false)
      setUploadProcessId(null)
      setSelectedFiles([])
      setUploadProgress({})
    }, 1000)
  }

  // Obter processo para upload
  const uploadProcess = uploadProcessId ? processes.find(p => p.id === uploadProcessId) : null

  // Filtrar e buscar processos
  const filteredProcesses = useMemo(() => {
    return processes.filter(process => {
      const matchesSearch = searchTerm === "" || 
        process.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.technician.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "todos" || process.status === statusFilter
      const matchesType = typeFilter === "todos" || process.type === typeFilter
      
      return matchesSearch && matchesStatus && matchesType
    })
  }, [processes, searchTerm, statusFilter, typeFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
      case "Concluído":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Em Análise":
      case "Em Elaboração":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Documentação":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Aguardando Análise":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "Pendente":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "Inativo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "Média":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Baixa":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SIMCAR":
      case "PEF":
        return <TreePine className="h-4 w-4" />
      case "Georreferenciamento":
        return <MapPin className="h-4 w-4" />
      case "PRA":
        return <Leaf className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Processos</h1>
              <p className="text-muted-foreground">Gerencie todos os processos ambientais e florestais</p>
            </div>
          </div>
          <NewProcessDialog />
        </div>

        {/* Estatísticas */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{processes.length}</div>
              <p className="text-sm text-muted-foreground">Processos cadastrados</p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {processes.filter(p => p.status === "Em Análise" || p.status === "Em Elaboração" || p.status === "Documentação").length}
              </div>
              <p className="text-sm text-muted-foreground">Em andamento</p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Concluídos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {processes.filter(p => p.status === "Aprovado" || p.status === "Concluído").length}
              </div>
              <p className="text-sm text-muted-foreground">Finalizados</p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-yellow-600" />
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {processes.filter(p => p.status === "Pendente" || p.status === "Aguardando Análise" || p.status === "Inativo").length}
              </div>
              <p className="text-sm text-muted-foreground">Aguardando/Inativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="ID, título, cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="Em Análise">Em Análise</SelectItem>
                    <SelectItem value="Em Elaboração">Em Elaboração</SelectItem>
                    <SelectItem value="Documentação">Documentação</SelectItem>
                    <SelectItem value="Aguardando Análise">Aguardando Análise</SelectItem>
                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="SIMCAR">SIMCAR</SelectItem>
                    <SelectItem value="CC-SEMA">CC-SEMA</SelectItem>
                    <SelectItem value="DAAP">DAAP</SelectItem>
                    <SelectItem value="PEF">PEF</SelectItem>
                    <SelectItem value="PRA">PRA</SelectItem>
                    <SelectItem value="DLA">DLA</SelectItem>
                    <SelectItem value="Georreferenciamento">Georreferenciamento</SelectItem>
                    <SelectItem value="Laudos">Laudos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ferramentas</label>
                <AIDocumentSearch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Processos */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Lista de Processos</CardTitle>
            <CardDescription>{filteredProcesses.length} processo(s) encontrado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID / Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Docs</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.map((process) => (
                  <TableRow key={process.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(process.type)}
                          <span className="font-medium">{process.id}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {process.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="font-medium truncate">{process.title}</p>
                        <p className="text-sm text-muted-foreground">Criado em {process.startDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>{process.client}</TableCell>
                    <TableCell>{process.technician}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {process.status === "Concluído" ? (
                          <Badge className={getStatusColor(process.status)} title="Status definido como Concluído">
                            {process.status}
                          </Badge>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Badge className={`${getStatusColor(process.status)} cursor-pointer`} title="Clique para alterar o status">
                                {process.status}
                              </Badge>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuLabel>Alterar status</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem disabled={process.status === "Em Análise"} onClick={() => handleStatusChange(process.id, "Em Análise")}>
                                Em Análise
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled={process.status === "Documentação"} onClick={() => handleStatusChange(process.id, "Documentação")}>
                                Documentação
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled={process.status === "Aprovado"} onClick={() => handleStatusChange(process.id, "Aprovado")}>
                                Aprovado
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled={process.status === "Inativo"} onClick={() => handleStatusChange(process.id, "Inativo")}>
                                Inativo
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(process.priority)}>{process.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{process.deadline}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{process.documents}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {/* Botão Ver Detalhes */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => setSelectedProcess(process.id)}
                            >
                          <Eye className="h-4 w-4" />
                        </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
                            {selectedProcessData && (
                              <>
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-3">
                                    {getTypeIcon(selectedProcessData.type)}
                                    <div>
                                      <div>{selectedProcessData.id}</div>
                                      <div className="text-sm text-muted-foreground font-normal">
                                        {selectedProcessData.title}
                                      </div>
                                    </div>
                                  </DialogTitle>
                                  <DialogDescription>
                                    Cliente: {selectedProcessData.client} • Técnico: {selectedProcessData.technician}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <Tabs defaultValue="info" className="w-full">
                                  <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="info">Informações</TabsTrigger>
                                    <TabsTrigger value="progress">Progresso</TabsTrigger>
                                    <TabsTrigger value="actions">Ações</TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="info" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                                        <p className="text-sm">{selectedProcessData.type}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                        <Badge className={getStatusColor(selectedProcessData.status)}>{selectedProcessData.status}</Badge>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Prioridade</Label>
                                        <Badge className={getPriorityColor(selectedProcessData.priority)}>{selectedProcessData.priority}</Badge>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Localização</Label>
                                        <p className="text-sm">{selectedProcessData.location}</p>
                                      </div>
                                      {selectedProcessData.area && (
                                        <div>
                                          <Label className="text-sm font-medium text-muted-foreground">Área</Label>
                                          <p className="text-sm">{selectedProcessData.area}</p>
                                        </div>
                                      )}
                                      <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Documentos</Label>
                                        <p className="text-sm">{selectedProcessData.documents} arquivo(s)</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Data de Início</Label>
                                        <p className="text-sm">{new Date(selectedProcessData.startDate).toLocaleDateString('pt-BR')}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Prazo</Label>
                                        <p className="text-sm">{new Date(selectedProcessData.deadline).toLocaleDateString('pt-BR')}</p>
                                      </div>
                                    </div>
                                    
                                    {selectedProcessData.description && (
                                      <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Descrição</Label>
                                        <p className="text-sm mt-1">{selectedProcessData.description}</p>
                                      </div>
                                    )}
                                  </TabsContent>
                                  
                                  <TabsContent value="progress" className="space-y-4">
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Progresso do Processo</Label>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Progress value={selectedProcessData.progress} className="flex-1" />
                                        <span className="text-sm font-medium">{selectedProcessData.progress}%</span>
                                      </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Criado em</Label>
                                        <p className="text-sm">{new Date(selectedProcessData.createdAt).toLocaleDateString('pt-BR')} às {new Date(selectedProcessData.createdAt).toLocaleTimeString('pt-BR')}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Última atualização</Label>
                                        <p className="text-sm">{new Date(selectedProcessData.updatedAt).toLocaleDateString('pt-BR')} às {new Date(selectedProcessData.updatedAt).toLocaleTimeString('pt-BR')}</p>
                                      </div>
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="actions" className="space-y-4">
                                    <div>
                                      <Label className="text-lg font-medium">Alterar Status do Processo</Label>
                                      <Separator className="my-3" />
                                      
                                      <div className="grid gap-3">
                                        <Button
                                          variant="outline"
                                          className="justify-start h-auto p-4"
                                          onClick={() => handleStatusChange(selectedProcessData.id, "Inativo")}
                                          disabled={selectedProcessData.status === "Inativo"}
                                        >
                                          <PauseCircle className="mr-3 h-5 w-5 text-orange-600" />
                                          <div className="text-left">
                                            <div className="font-medium">Marcar como Inativo</div>
                                            <div className="text-sm text-muted-foreground">Pausar o processo para continuar outro dia</div>
                                          </div>
                                        </Button>
                                        
                                        <Button
                                          variant="outline"
                                          className="justify-start h-auto p-4"
                                          onClick={() => handleStatusChange(selectedProcessData.id, "Concluído")}
                                          disabled={selectedProcessData.status === "Concluído"}
                                        >
                                          <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                                          <div className="text-left">
                                            <div className="font-medium">Marcar como Concluído</div>
                                            <div className="text-sm text-muted-foreground">Finalizar o processo como concluído</div>
                                          </div>
                                        </Button>
                                        
                                        <Button
                                          variant="outline"
                                          className="justify-start h-auto p-4"
                                          onClick={() => handleStatusChange(selectedProcessData.id, "Em Análise")}
                                          disabled={selectedProcessData.status === "Em Análise"}
                                        >
                                          <Clock className="mr-3 h-5 w-5 text-blue-600" />
                                          <div className="text-left">
                                            <div className="font-medium">Reativar Processo</div>
                                            <div className="text-sm text-muted-foreground">Voltar para Em Análise</div>
                                          </div>
                                        </Button>
                                      </div>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* Botão Upload */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                          onClick={() => handleUploadClick(process.id)}
                          title="Upload de Documentos"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>

                        {/* Botões de Status Rápido */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950"
                          onClick={() => handleStatusChange(process.id, "Inativo")}
                          disabled={process.status === "Inativo"}
                          title="Marcar como Inativo"
                        >
                          <PauseCircle className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                          onClick={() => handleStatusChange(process.id, "Concluído")}
                          disabled={process.status === "Concluído"}
                          title="Marcar como Concluído"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>

                        {/* Botão Deletar */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover Processo</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover o processo <strong>{process.id}</strong> - <strong>{process.title}</strong>? 
                                Esta ação não pode ser desfeita e todos os dados do processo serão permanentemente removidos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteProcess(process.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredProcesses.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum processo encontrado com os filtros aplicados.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de Upload de Documentos */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Upload de Documentos
              </DialogTitle>
              <DialogDescription>
                {uploadProcess && (
                  <>Adicionar documentos ao processo <strong>{uploadProcess.id}</strong> - {uploadProcess.title}</>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Seletor de Arquivos */}
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-sm font-medium">
                  Selecionar Arquivos
                </Label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: PDF, DOC, DOCX, JPG, JPEG, PNG, XLS, XLSX
                </p>
              </div>

              {/* Lista de Arquivos Selecionados */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Arquivos Selecionados</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        
                        {uploadProgress[file.name] !== undefined ? (
                          <div className="flex items-center gap-2">
                            <Progress value={uploadProgress[file.name]} className="w-16 h-2" />
                            <span className="text-xs text-gray-600">{uploadProgress[file.name]}%</span>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações do Processo */}
              {uploadProcess && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(uploadProcess.type)}
                    <span className="font-medium text-sm">{uploadProcess.type}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Documentos atuais: <strong>{uploadProcess.documents}</strong>
                  </p>
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-blue-700">
                      Após upload: <strong>{uploadProcess.documents + selectedFiles.length}</strong> documentos
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setUploadDialogOpen(false)}
                disabled={Object.keys(uploadProgress).length > 0}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || Object.keys(uploadProgress).length > 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {Object.keys(uploadProgress).length > 0 ? 'Enviando...' : `Upload ${selectedFiles.length} arquivo(s)`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}