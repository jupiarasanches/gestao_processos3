"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Mail, 
  Phone, 
  Search, 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  Target,
  TrendingUp,
  Clock,
  Award,
  Users,
  Activity,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { NewTechnicianDialog } from "@/components/new-technician-dialog"
import { useTechnicians } from "@/contexts/technicians-context"

export default function TecnicosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [specialtyFilter, setSpecialtyFilter] = useState("todos")
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null)

  const { technicians, getTechnicianStats, updateTechnician, deleteTechnician } = useTechnicians()
  const stats = getTechnicianStats()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "em_campo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "ferias":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "inativo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativo": return "Ativo"
      case "em_campo": return "Em Campo"
      case "ferias": return "Férias"
      case "inativo": return "Inativo"
      default: return status
    }
  }

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case "SIMCAR":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "PEF":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "DAAP":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "Georreferenciamento":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "CC-SEMA":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400"
      case "PRA":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
      case "Laudos":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600"
    if (efficiency >= 80) return "text-blue-600"
    if (efficiency >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredTechnicians = technicians.filter((tech) => {
    const matchesSearch = 
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || tech.status === statusFilter
    const matchesSpecialty = specialtyFilter === "todos" || tech.specialty === specialtyFilter

    return matchesSearch && matchesStatus && matchesSpecialty
  })

  const selectedTechnicianData = selectedTechnician ? technicians.find(t => t.id === selectedTechnician) : null

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Técnicos</h1>
              <p className="text-muted-foreground">Gerencie a equipe de técnicos ambientais</p>
            </div>
          </div>
          <NewTechnicianDialog />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Técnicos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Campo</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.onField}</div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">De Férias</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.onVacation}</div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eficiência Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgEfficiency}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border/40">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar técnicos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="em_campo">Em Campo</SelectItem>
                  <SelectItem value="ferias">Férias</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Especialidades</SelectItem>
                  <SelectItem value="SIMCAR">SIMCAR</SelectItem>
                  <SelectItem value="PEF">PEF</SelectItem>
                  <SelectItem value="DAAP">DAAP</SelectItem>
                  <SelectItem value="Georreferenciamento">Georreferenciamento</SelectItem>
                  <SelectItem value="CC-SEMA">CC-SEMA</SelectItem>
                  <SelectItem value="PRA">PRA</SelectItem>
                  <SelectItem value="Laudos">Laudos</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground flex items-center">
                Mostrando {filteredTechnicians.length} de {technicians.length} técnicos
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technicians Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTechnicians.map((tech) => (
            <Card key={tech.id} className="border-border/40 hover:shadow-md transition-all duration-200 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={tech.avatar || "/placeholder-user.jpg"} />
                      <AvatarFallback>
                        {tech.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{tech.name}</CardTitle>
                      <Badge className={getSpecialtyColor(tech.specialty)}>{tech.specialty}</Badge>
                    </div>
                  </div>
                  <Badge className={getStatusColor(tech.status)}>{getStatusLabel(tech.status)}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{tech.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{tech.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{tech.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Desde {new Date(tech.joinDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                {/* Efficiency Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Eficiência</span>
                    <span className={getEfficiencyColor(tech.efficiency)}>{tech.efficiency}%</span>
                  </div>
                  <Progress value={tech.efficiency} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/40">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{tech.activeProcesses}</div>
                    <div className="text-xs text-muted-foreground">Ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{tech.completedProcesses}</div>
                    <div className="text-xs text-muted-foreground">Concluídos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{tech.monthlyGoal}</div>
                    <div className="text-xs text-muted-foreground">Meta</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedTechnician(tech.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                      {selectedTechnicianData && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={selectedTechnicianData.avatar || "/placeholder-user.jpg"} />
                                <AvatarFallback>
                                  {selectedTechnicianData.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div>{selectedTechnicianData.name}</div>
                                <div className="text-sm text-muted-foreground font-normal">
                                  {selectedTechnicianData.specialty} • {getStatusLabel(selectedTechnicianData.status)}
                                </div>
                              </div>
                            </DialogTitle>
                          </DialogHeader>
                          
                          <Tabs defaultValue="info" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="info">Informações</TabsTrigger>
                              <TabsTrigger value="performance">Performance</TabsTrigger>
                              <TabsTrigger value="skills">Qualificações</TabsTrigger>
                              <TabsTrigger value="contact">Contato</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="info" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                  <p className="text-sm">{selectedTechnicianData.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                                  <p className="text-sm">{selectedTechnicianData.phone}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Registro</Label>
                                  <p className="text-sm">{selectedTechnicianData.registrationNumber}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Localização</Label>
                                  <p className="text-sm">{selectedTechnicianData.location}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Data de Ingresso</Label>
                                  <p className="text-sm">{new Date(selectedTechnicianData.joinDate).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Experiência</Label>
                                  <p className="text-sm">{selectedTechnicianData.experience}</p>
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="performance" className="space-y-4">
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Eficiência</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Progress value={selectedTechnicianData.efficiency} className="flex-1" />
                                      <span className={`text-sm font-medium ${getEfficiencyColor(selectedTechnicianData.efficiency)}`}>
                                        {selectedTechnicianData.efficiency}%
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Meta Mensal</Label>
                                    <p className="text-2xl font-bold text-primary">{selectedTechnicianData.monthlyGoal}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Processos Ativos</Label>
                                    <p className="text-2xl font-bold text-blue-600">{selectedTechnicianData.activeProcesses}</p>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Processos Concluídos</Label>
                                    <p className="text-2xl font-bold text-green-600">{selectedTechnicianData.completedProcesses}</p>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="skills" className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Certificações</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {selectedTechnicianData.certifications.map((cert, index) => (
                                    <Badge key={index} variant="secondary">{cert}</Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Habilidades</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {selectedTechnicianData.skills.map((skill, index) => (
                                    <Badge key={index} variant="outline">{skill}</Badge>
                                  ))}
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="contact" className="space-y-4">
                              <div>
                                <Label className="text-lg font-medium">Contato de Emergência</Label>
                                <Separator className="my-2" />
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                                    <p className="text-sm">{selectedTechnicianData.emergencyContact.name}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                                    <p className="text-sm">{selectedTechnicianData.emergencyContact.phone}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Parentesco</Label>
                                    <p className="text-sm">{selectedTechnicianData.emergencyContact.relationship}</p>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    Processos
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover Técnico</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover <strong>{tech.name}</strong>? 
                          Esta ação não pode ser desfeita e todos os dados do técnico serão permanentemente removidos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTechnician(tech.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTechnicians.length === 0 && (
          <Card className="border-border/40">
            <CardContent className="text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhum técnico encontrado</h3>
              <p className="text-muted-foreground">Tente ajustar os filtros ou cadastre um novo técnico.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}