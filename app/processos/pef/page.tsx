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
  FileText, 
  Plus, 
  Eye, 
  Upload, 
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Download,
  PauseCircle,
  TreePine
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useProcesses } from "@/contexts/processes-context"
import { NewProcessDialog } from "@/components/new-process-dialog"

export default function PefPage() {
  const { getProcessesByType, updateProcess } = useProcesses()
  
  // Estados para controlar modais
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadProcessId, setUploadProcessId] = useState<string | null>(null)
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false)
  const [documentsProcessId, setDocumentsProcessId] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  
  // Obter todos os processos PEF do contexto
  const pefProcesses = getProcessesByType("PEF")
  
  // Obter processo selecionado para detalhes
  const selectedProcessData = selectedProcess ? pefProcesses.find(p => p.id === selectedProcess) : null
  
  // Obter processo para upload
  const uploadProcess = uploadProcessId ? pefProcesses.find(p => p.id === uploadProcessId) : null
  
  // Obter processo para documentos
  const documentsProcess = documentsProcessId ? pefProcesses.find(p => p.id === documentsProcessId) : null

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

    const currentProcess = pefProcesses.find(p => p.id === uploadProcessId)
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
    const docTypes = ['Plano de Exploração', 'Inventário Florestal', 'Estudo de Impacto', 'Licença Prévia', 'Relatório Técnico', 'Plano de Manejo', 'Declaração de Sustentabilidade']
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
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                <TreePine className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">PEF</h1>
                <p className="text-muted-foreground">Plano de Exploração Florestal</p>
              </div>
            </div>
          </div>
          <NewProcessDialog 
            defaultType="PEF"
            buttonText="Novo PEF"
          />
        </div>
      </div>
    </ProtectedRoute>
  )
}