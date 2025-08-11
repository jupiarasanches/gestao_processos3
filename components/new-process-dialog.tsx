"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Calendar, MapPin, User, Building, FileText } from "lucide-react"
import { useProcesses } from "@/contexts/processes-context"
import { useToast } from "@/components/ui/use-toast"

interface NewProcessDialogProps {
  defaultType?: string
  buttonText?: string
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "destructive"
  buttonSize?: "default" | "sm" | "lg"
  className?: string
}

export function NewProcessDialog({ 
  defaultType, 
  buttonText = "Novo Processo",
  buttonVariant = "default",
  buttonSize = "default",
  className 
}: NewProcessDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addProcess } = useProcesses()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    type: defaultType || "",
    title: "",
    client: "",
    technician: "",
    status: "Documentação",
    priority: "Média",
    area: "",
    location: "",
    deadline: "",
    description: ""
  })

  const processTypes = [
    { value: "SIMCAR", label: "SIMCAR - Sistema de Cadastro Ambiental Rural" },
    { value: "PEF", label: "PEF - Plano de Exploração Florestal" },
    { value: "CC-SEMA", label: "CC-SEMA - Certidão de Conformidade Ambiental" },
    { value: "DAAP", label: "DAAP - Declaração de Atividades Ambientais" },
    { value: "Georreferenciamento", label: "Georreferenciamento - Levantamento Topográfico" },
    { value: "DLA", label: "DLA - Dispensa de Licenciamento Ambiental" },
    { value: "Laudos", label: "Laudos - Laudos Técnicos e Pareceres" }
  ]

  const statusOptions = [
    { value: "Documentação", label: "Documentação" },
    { value: "Em Análise", label: "Em Análise" },
    { value: "Aguardando Análise", label: "Aguardando Análise" },
    { value: "Em Elaboração", label: "Em Elaboração" },
    { value: "Aprovado", label: "Aprovado" },
    { value: "Concluído", label: "Concluído" },
    { value: "Pendente", label: "Pendente" }
  ]

  const priorityOptions = [
    { value: "Baixa", label: "Baixa" },
    { value: "Média", label: "Média" },
    { value: "Alta", label: "Alta" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validação básica
      if (!formData.type || !formData.title || !formData.client || !formData.technician || !formData.location || !formData.deadline) {
        toast({
          title: "Erro de Validação",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newProcess = {
        type: formData.type,
        title: formData.title,
        client: formData.client,
        technician: formData.technician,
        status: formData.status,
        priority: formData.priority,
        area: formData.area,
        location: formData.location,
        startDate: new Date().toISOString().split('T')[0],
        deadline: formData.deadline,
        documents: 0,
        progress: 0,
        description: formData.description
      }

      addProcess(newProcess)

      toast({
        title: "Processo Criado!",
        description: `O processo ${formData.type} foi criado com sucesso.`,
        variant: "default"
      })

      // Reset form
      setFormData({
        type: defaultType || "",
        title: "",
        client: "",
        technician: "",
        status: "Documentação",
        priority: "Média",
        area: "",
        location: "",
        deadline: "",
        description: ""
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o processo. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={className}>
          <Plus className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card/80 backdrop-blur-lg shadow-xl border-border/40 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <FileText className="h-5 w-5" />
            Criar Novo Processo
          </DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar um novo processo ambiental.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Tipo de Processo */}
          <div className="grid gap-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Tipo de Processo *
            </Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de processo" />
              </SelectTrigger>
              <SelectContent>
                {processTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Título */}
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título do Processo *
            </Label>
            <Input
              id="title"
              placeholder="Ex: Licenciamento Fazenda São João"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="bg-input/50 border-border/60"
            />
          </div>

          {/* Grid com Cliente e Técnico */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="client" className="text-sm font-medium flex items-center gap-1">
                <Building className="h-3 w-3" />
                Cliente/Empresa *
              </Label>
              <Input
                id="client"
                placeholder="Nome do cliente ou empresa"
                value={formData.client}
                onChange={(e) => handleInputChange("client", e.target.value)}
                className="bg-input/50 border-border/60"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="technician" className="text-sm font-medium flex items-center gap-1">
                <User className="h-3 w-3" />
                Técnico Responsável *
              </Label>
              <Input
                id="technician"
                placeholder="Nome do técnico responsável"
                value={formData.technician}
                onChange={(e) => handleInputChange("technician", e.target.value)}
                className="bg-input/50 border-border/60"
              />
            </div>
          </div>

          {/* Grid com Status e Prioridade */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status Inicial
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Prioridade
              </Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Área (opcional) */}
          <div className="grid gap-2">
            <Label htmlFor="area" className="text-sm font-medium">
              Área (opcional)
            </Label>
            <Input
              id="area"
              placeholder="Ex: 500 hectares"
              value={formData.area}
              onChange={(e) => handleInputChange("area", e.target.value)}
              className="bg-input/50 border-border/60"
            />
          </div>

          {/* Grid com Localização e Prazo */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Localização *
              </Label>
              <Input
                id="location"
                placeholder="Ex: Zona Rural - Município XYZ"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="bg-input/50 border-border/60"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deadline" className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Prazo Final *
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                className="bg-input/50 border-border/60"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição (opcional)
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva brevemente o processo e seus objetivos..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-input/50 border-border/60 min-h-[80px]"
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Processo
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}