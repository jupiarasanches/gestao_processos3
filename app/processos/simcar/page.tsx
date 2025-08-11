"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { 
  TreePine, 
  Plus, 
  Eye, 
  Upload, 
  Calendar,
  User,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Download,
  PauseCircle
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useProcesses } from "@/contexts/processes-context"
import { NewProcessDialog } from "@/components/new-process-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function SimcarPage() {
  const { getProcessesByType, updateProcess } = useProcesses()
  
  // Estados para controlar modais
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadProcessId, setUploadProcessId] = useState<string | null>(null)
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false)
  const [documentsProcessId, setDocumentsProcessId] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  
  // Obter todos os processos SIMCAR do contexto
  const simcarProcesses = getProcessesByType("SIMCAR")
  
  // Obter processo selecionado para detalhes
  const selectedProcessData = selectedProcess ? simcarProcesses.find(p => p.id === selectedProcess) : null
  
  // Obter processo para upload
  const uploadProcess = uploadProcessId ? simcarProcesses.find(p => p.id === uploadProcessId) : null
  
  // Obter processo para documentos
  const documentsProcess = documentsProcessId ? simcarProcesses.find(p => p.id === documentsProcessId) : null

  // Funções para controlar modais
  const handleUploadClick = (processId: string) => {
    setUploadProcessId(processId)
    setUploadDialogOpen(true)
    setSelectedFiles([])
    setUploadProgress({})
  }

  const handleDocumentsClick = (processId: string) => {
    setDocumentsProcessId(processId)
    setDocumentsDialogOpen(true)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!uploadProcessId || selectedFiles.length === 0) return

    for (const file of selectedFiles) {
      const fileName = file.name
      setUploadProgress(prev => ({ ...prev, [fileName]: 0 }))

      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setUploadProgress(prev => ({ ...prev, [fileName]: progress }))
      }
    }

    const currentProcess = simcarProcesses.find(p => p.id === uploadProcessId)
    if (currentProcess) {
      updateProcess(uploadProcessId, { 
        documents: currentProcess.documents + selectedFiles.length 
      })
    }

    setTimeout(() => {
      setUploadDialogOpen(false)
      setUploadProcessId(null)
      setSelectedFiles([])
      setUploadProgress({})
    }, 1000)
  }

  const handleStatusChange = (processId: string, newStatus: string) => {
    updateProcess(processId, { status: newStatus })
  }

  // Gerar lista de documentos simulados
  const generateDocumentsList = (processId: string, documentsCount: number) => {
    const docTypes = ['Escritura da Propriedade', 'Planta Georreferenciada', 'Comprovante INCRA', 'Declaração de Uso do Solo', 'Termo de Compromisso', 'Relatório Técnico', 'Fotos da Propriedade']
    const documents = []
    
    for (let i = 0; i < documentsCount; i++) {
      documents.push({
        id: `${processId}-doc-${i + 1}`,
        name: `${docTypes[i % docTypes.length]}.pdf`,
        type: 'PDF',
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        status: Math.random() > 0.1 ? 'Aprovado' : 'Pendente'
      })
    }
    return documents
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
      case "Concluído":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Em Análise":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Documentação":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
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

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <TreePine className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">SIMCAR</h1>
                <p className="text-muted-foreground">Sistema de Cadastro Ambiental Rural</p>
              </div>
            </div>
          </div>
          <NewProcessDialog 
            defaultType="SIMCAR"
            buttonText="Novo SIMCAR"
          />
        </div>

        {/* Estatísticas */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-700 dark:text-blue-300 text-lg">Total de Processos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">{simcarProcesses.length}</div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Processos SIMCAR ativos</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-700 dark:text-green-300 text-lg">Aprovados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800 dark:text-green-200">
                {simcarProcesses.filter(p => p.status === "Aprovado").length}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">Licenças concedidas</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-700 dark:text-yellow-300 text-lg">Em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-800 dark:text-yellow-200">
                {simcarProcesses.filter(p => p.status !== "Aprovado").length}
              </div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Aguardando conclusão</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Processos */}
        <Card className="border-border/40 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-blue-600" />
                  Processos SIMCAR
                </CardTitle>
                <CardDescription>
                  Sistema de Cadastro Ambiental Rural - Acompanhe todos os processos de licenciamento
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-blue-700 border-blue-200">
                {simcarProcesses.length} processos
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Processo</TableHead>
                  <TableHead>Cliente/Propriedade</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {simcarProcesses.map((process) => (
                  <TableRow key={process.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <TreePine className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{process.id}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{process.title}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {process.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{process.client}</p>
                        <p className="text-sm text-muted-foreground">{process.area}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{process.area}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {process.technician}
                      </div>
                    </TableCell>
                    <TableCell>
                      {process.status === "Concluído" ? (
                        <Badge
                          className={getStatusColor(process.status)}
                          title="Definido como Concluído na aba Processos"
                        >
                          {process.status}
                        </Badge>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Badge
                              className={`${getStatusColor(process.status)} cursor-pointer`}
                              title="Clique para alterar o status"
                            >
                              {process.status}
                            </Badge>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Alterar status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled={process.status === "Em Análise"}
                              onClick={() => handleStatusChange(process.id, "Em Análise")}
                            >
                              Em Análise
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={process.status === "Documentação"}
                              onClick={() => handleStatusChange(process.id, "Documentação")}
                            >
                              Documentação
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={process.status === "Aprovado"}
                              onClick={() => handleStatusChange(process.id, "Aprovado")}
                            >
                              Aprovado
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={process.status === "Inativo"}
                              onClick={() => handleStatusChange(process.id, "Inativo")}
                            >
                              Inativo
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(process.priority)}>
                        {process.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {process.deadline}
                      </div>
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
                              title="Ver Detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
                            {selectedProcessData && (
                              <>
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-3">
                                    <TreePine className="h-6 w-6 text-blue-600" />
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
                                        <p className="text-sm">SIMCAR</p>
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
                                      <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Área</Label>
                                        <p className="text-sm">{selectedProcessData.area}</p>
                                      </div>
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
                                          onClick={() => handleStatusChange(selectedProcessData.id, "Aprovado")}
                                          disabled={selectedProcessData.status === "Aprovado"}
                                        >
                                          <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                                          <div className="text-left">
                                            <div className="font-medium">Aprovar Processo</div>
                                            <div className="text-sm text-muted-foreground">Finalizar como aprovado</div>
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

                        {/* Botão Ver Documentos */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                          onClick={() => handleDocumentsClick(process.id)}
                          title="Ver Documentos"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Informações sobre SIMCAR */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              Sobre o SIMCAR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">O que é o SIMCAR?</h4>
                <p className="text-sm text-muted-foreground">
                  O Sistema de Cadastro Ambiental Rural (SIMCAR) é obrigatório para propriedades rurais e tem como objetivo
                  integrar as informações ambientais das propriedades e posses rurais.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Documentos Necessários</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Escritura ou contrato de arrendamento</li>
                  <li>• Planta georreferenciada da propriedade</li>
                  <li>• Comprovante de inscrição no INCRA</li>
                  <li>• Declaração de uso do solo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialog de Upload de Documentos */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Upload de Documentos SIMCAR
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
                    <TreePine className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">SIMCAR</span>
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

        {/* Dialog de Visualização de Documentos */}
        <Dialog open={documentsDialogOpen} onOpenChange={setDocumentsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Documentos do Processo
              </DialogTitle>
              <DialogDescription>
                {documentsProcess && (
                  <>Documentos anexados ao processo <strong>{documentsProcess.id}</strong> - {documentsProcess.title}</>
                )}
              </DialogDescription>
            </DialogHeader>

            {documentsProcess && (
              <div className="space-y-4">
                {/* Resumo */}
                <div className="p-4 bg-green-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TreePine className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">SIMCAR - {documentsProcess.id}</span>
                    </div>
                    <Badge variant="outline" className="text-green-700">
                      {documentsProcess.documents} documentos
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{documentsProcess.title}</p>
                </div>

                {/* Lista de Documentos */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Documentos Anexados</Label>
                  {documentsProcess.documents > 0 ? (
                    <div className="space-y-2">
                      {generateDocumentsList(documentsProcess.id, documentsProcess.documents).map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-md">
                              <FileText className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{doc.type}</span>
                                <span>•</span>
                                <span>{doc.size}</span>
                                <span>•</span>
                                <span>Enviado em {doc.uploadDate}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={doc.status === 'Aprovado' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {doc.status}
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">Nenhum documento anexado ainda</p>
                      <p className="text-xs text-gray-400">Use o botão de upload para adicionar documentos</p>
                    </div>
                  )}
                </div>

                {/* Documentos Necessários (Específicos para SIMCAR) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-blue-700">Documentos Necessários para SIMCAR</Label>
                  <div className="grid gap-2">
                    {[
                      'Escritura ou contrato de arrendamento',
                      'Planta georreferenciada da propriedade',
                      'Comprovante de inscrição no INCRA',
                      'Declaração de uso do solo',
                      'Termo de compromisso',
                      'Relatório técnico de atividades'
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button onClick={() => setDocumentsDialogOpen(false)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}