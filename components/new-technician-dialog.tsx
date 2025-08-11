"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { useTechnicians } from "@/contexts/technicians-context"
import { useToast } from "@/hooks/use-toast"

interface NewTechnicianDialogProps {
  buttonText?: string
  defaultSpecialty?: string
}

export function NewTechnicianDialog({ 
  buttonText = "Novo Técnico",
  defaultSpecialty 
}: NewTechnicianDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addTechnician } = useTechnicians()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    registrationNumber: '',
    specialty: defaultSpecialty || '',
    location: '',
    experience: '',
    monthlyGoal: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    certifications: '',
    skills: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newTechnician = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        registrationNumber: formData.registrationNumber,
        specialty: formData.specialty,
        status: 'ativo' as const,
        location: formData.location,
        joinDate: new Date().toISOString().split('T')[0],
        experience: formData.experience,
        monthlyGoal: parseInt(formData.monthlyGoal) || 10,
        certifications: formData.certifications.split(',').map(cert => cert.trim()).filter(Boolean),
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship
        }
      }

      addTechnician(newTechnician)

      toast({
        title: "✅ Técnico cadastrado com sucesso!",
        description: `${formData.name} foi adicionado à equipe.`,
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        registrationNumber: '',
        specialty: defaultSpecialty || '',
        location: '',
        experience: '',
        monthlyGoal: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: '',
        certifications: '',
        skills: ''
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "❌ Erro ao cadastrar técnico",
        description: "Tente novamente ou contate o suporte.",
        variant: "destructive",
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
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Técnico</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo membro da equipe
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome do técnico"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@ecoflow.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registro Profissional *</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  placeholder="CRQ-123456 ou CREA-789012"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade *</Label>
                <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIMCAR">SIMCAR</SelectItem>
                    <SelectItem value="CC-SEMA">CC-SEMA</SelectItem>
                    <SelectItem value="DAAP">DAAP</SelectItem>
                    <SelectItem value="PEF">PEF</SelectItem>
                    <SelectItem value="Georreferenciamento">Georreferenciamento</SelectItem>
                    <SelectItem value="DLA">DLA</SelectItem>
                    <SelectItem value="PRA">PRA</SelectItem>
                    <SelectItem value="Laudos">Laudos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localização *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Cidade, Estado"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Experiência</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="Ex: 5 anos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyGoal">Meta Mensal (processos)</Label>
                <Input
                  id="monthlyGoal"
                  type="number"
                  value={formData.monthlyGoal}
                  onChange={(e) => handleInputChange('monthlyGoal', e.target.value)}
                  placeholder="10"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Contato de Emergência */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contato de Emergência</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Nome</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  placeholder="Nome do contato"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Telefone</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  placeholder="(11) 88888-8888"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelationship">Parentesco</Label>
              <Select value={formData.emergencyContactRelationship} onValueChange={(value) => handleInputChange('emergencyContactRelationship', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o parentesco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pai">Pai</SelectItem>
                  <SelectItem value="Mãe">Mãe</SelectItem>
                  <SelectItem value="Cônjuge">Cônjuge</SelectItem>
                  <SelectItem value="Irmão">Irmão</SelectItem>
                  <SelectItem value="Irmã">Irmã</SelectItem>
                  <SelectItem value="Filho">Filho</SelectItem>
                  <SelectItem value="Filha">Filha</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Qualificações */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Qualificações</h3>
            
            <div className="space-y-2">
              <Label htmlFor="certifications">Certificações</Label>
              <Textarea
                id="certifications"
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                placeholder="Separe por vírgulas: ISO 14001, Gestão Ambiental, SIMCAR Avançado"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Habilidades</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="Separe por vírgulas: Licenciamento, Análise de Solo, Relatórios Técnicos"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar Técnico
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}