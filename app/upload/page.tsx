"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, FileText, ImageIcon, Upload, X, Download, Eye, Filter, Search, Calendar, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/protected-route"
import { useProcesses } from "@/contexts/processes-context"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  processId: string
  processType: string
  uploadDate: string
  status: "uploading" | "completed" | "error"
  progress: number
}

export default function UploadPage() {
  const [selectedProcess, setSelectedProcess] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("todos")
  const [filterProcess, setFilterProcess] = useState("todos")
  
  const { processes: allProcesses } = useProcesses()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "licenca_ambiental.pdf",
      size: 2048000,
      type: "application/pdf",
      processId: "SIMCAR-2024-001",
      processType: "SIMCAR",
      uploadDate: "2024-01-15",
      status: "completed",
      progress: 100,
    },
    {
      id: "2",
      name: "planta_baixa.jpg",
      size: 1536000,
      type: "image/jpeg",
      processId: "PEF-2024-002",
      processType: "PEF",
      uploadDate: "2024-01-14",
      status: "completed",
      progress: 100,
    },
    {
      id: "3",
      name: "relatorio_tecnico.pdf",
      size: 3072000,
      type: "application/pdf",
      processId: "DAAP-2024-003",
      processType: "DAAP",
      uploadDate: "2024-01-13",
      status: "completed",
      progress: 100,
    },
    {
      id: "4",
      name: "documento_dla.pdf",
      size: 1820000,
      type: "application/pdf",
      processId: "DLA-2024-006",
      processType: "DLA",
      uploadDate: "2024-01-12",
      status: "completed",
      progress: 100,
    },
    {
      id: "5",
      name: "laudo_tecnico.pdf",
      size: 2550000,
      type: "application/pdf",
      processId: "LAUDOS-2024-007",
      processType: "Laudos",
      uploadDate: "2024-01-11",
      status: "completed",
      progress: 100,
    },
  ])

  const { toast } = useToast()

  // Usar processos do contexto global
  const processOptions = allProcesses.map(process => ({
    id: process.id,
    type: process.type,
    title: `${process.type} - ${process.title}`
  }))

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = (files: FileList) => {
    if (!selectedProcess) {
      toast({
        title: "Erro",
        description: "Selecione um processo antes de fazer upload dos arquivos.",
        variant: "destructive",
      })
      return
    }

    Array.from(files).forEach((file) => {
      // Validar tipo de arquivo
      if (!file.type.includes("pdf") && !file.type.includes("jpeg") && !file.type.includes("jpg")) {
        toast({
          title: "Tipo de arquivo não suportado",
          description: `O arquivo ${file.name} não é um PDF ou JPEG.`,
          variant: "destructive",
        })
        return
      }

      // Validar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: `O arquivo ${file.name} excede o limite de 10MB.`,
          variant: "destructive",
        })
        return
      }

      const selectedProcessData = processOptions.find((p) => p.id === selectedProcess)
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        processId: selectedProcess,
        processType: selectedProcessData?.type || "",
        uploadDate: new Date().toISOString().split("T")[0],
        status: "uploading",
        progress: 0,
      }

      setUploadedFiles((prev) => [...prev, newFile])

      // Simular upload
      simulateUpload(newFile.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        setUploadedFiles((prev) =>
          prev.map((file) => (file.id === fileId ? { ...file, status: "completed", progress: 100 } : file)),
        )
        clearInterval(interval)
        toast({
          title: "Upload concluído",
          description: "Arquivo enviado com sucesso!",
        })
      } else {
        setUploadedFiles((prev) =>
          prev.map((file) => (file.id === fileId ? { ...file, progress: Math.round(progress) } : file)),
        )
      }
    }, 500)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />
    } else if (type.includes("image")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />
    }
    return <FileText className="h-5 w-5 text-gray-500" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Upload className="h-4 w-4 text-blue-500" />
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  // Filtrar arquivos baseado nos filtros
  const filteredFiles = uploadedFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.processId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "todos" || file.type.includes(filterType)
    const matchesProcess = filterProcess === "todos" || file.processType === filterProcess
    
    return matchesSearch && matchesType && matchesProcess
  })

  // Estatísticas
  const stats = {
    total: uploadedFiles.length,
    completed: uploadedFiles.filter(f => f.status === "completed").length,
    uploading: uploadedFiles.filter(f => f.status === "uploading").length,
    totalSize: uploadedFiles.reduce((sum, file) => sum + file.size, 0),
    byType: {
      pdf: uploadedFiles.filter(f => f.type.includes("pdf")).length,
      image: uploadedFiles.filter(f => f.type.includes("image")).length
    }
  }

  return (
    <ProtectedRoute>
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Upload de Documentos</h1>
          <p className="text-muted-foreground">Faça upload de documentos PDF e JPEG para os processos</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Arquivos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(stats.totalSize)} total
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Uploads finalizados
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PDFs</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.byType.pdf}</div>
            <p className="text-xs text-muted-foreground">
              Documentos PDF
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imagens</CardTitle>
            <ImageIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.byType.image}</div>
            <p className="text-xs text-muted-foreground">
              Arquivos de imagem
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Area */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Enviar Documentos</CardTitle>
            <CardDescription>Selecione um processo e faça upload dos documentos relacionados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="process">Processo</Label>
              <Select value={selectedProcess} onValueChange={setSelectedProcess}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um processo" />
                </SelectTrigger>
                <SelectContent>
                  {processOptions.map((process) => (
                    <SelectItem key={process.id} value={process.id}>
                      <span>{process.title}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Arraste arquivos aqui ou clique para selecionar
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Suporte para PDF e JPEG (máximo 10MB por arquivo)</p>
              <Input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Selecionar Arquivos
                </label>
              </Button>
            </div>

            {/* Upload Progress */}
            {uploadedFiles.some((file) => file.status === "uploading") && (
              <div className="space-y-2">
                <h4 className="font-medium">Enviando arquivos...</h4>
                {uploadedFiles
                  .filter((file) => file.status === "uploading")
                  .map((file) => (
                    <div key={file.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate">{file.name}</span>
                        <span>{file.progress}%</span>
                      </div>
                      <Progress value={file.progress} className="h-2" />
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Guidelines */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Diretrizes de Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Formatos Aceitos</h4>
                  <p className="text-sm text-muted-foreground">
                    PDF para documentos oficiais e JPEG para imagens e plantas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Tamanho Máximo</h4>
                  <p className="text-sm text-muted-foreground">Cada arquivo pode ter até 10MB</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Nomenclatura</h4>
                  <p className="text-sm text-muted-foreground">Use nomes descritivos para facilitar a identificação</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Qualidade</h4>
                  <p className="text-sm text-muted-foreground">
                    Certifique-se de que documentos estão legíveis e imagens nítidas
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Filtrar Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou processo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de arquivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="image">Imagens</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterProcess} onValueChange={setFilterProcess}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de processo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os processos</SelectItem>
                <SelectItem value="SIMCAR">SIMCAR</SelectItem>
                <SelectItem value="PEF">PEF</SelectItem>
                <SelectItem value="DAAP">DAAP</SelectItem>
                <SelectItem value="Georreferenciamento">Georreferenciamento</SelectItem>
                <SelectItem value="CC-SEMA">CC-SEMA</SelectItem>
                <SelectItem value="PRA">PRA</SelectItem>
                <SelectItem value="Laudos">Laudos</SelectItem>
                <SelectItem value="DLA">DLA</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              Mostrando {filteredFiles.length} de {uploadedFiles.length} arquivos
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files Table */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Documentos Enviados</CardTitle>
          <CardDescription>{filteredFiles.length} documento(s) exibido(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arquivo</TableHead>
                <TableHead>Processo</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.type.split("/")[1].toUpperCase()}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {file.processType}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{file.processId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>{file.uploadDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      <span className="text-sm capitalize">{file.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  )
}
