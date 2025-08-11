"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Palette,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  AlertTriangle,
  CheckCircle,
  Key,
  Eye,
  EyeOff,
  Plus,
  X,
  Edit
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/mock-auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "@/contexts/theme-context"
import { motion } from "framer-motion"

export default function ConfiguracoesPage() {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const { theme: currentTheme, setTheme, themes } = useTheme()
  
  // Estados para as configurações
  const [profileData, setProfileData] = useState({
    nome: userProfile?.nome || "Admin Sistema",
    email: userProfile?.email || "admin@ecoflow.com",
    telefone: "(11) 99999-0000",
    cargo: "Administrador",
    departamento: "TI",
    avatar: "/placeholder-user.jpg"
  })

  const [systemSettings, setSystemSettings] = useState({
    siteName: "EcoFlow",
    siteDescription: "Sistema de Gestão de Processos Ambientais",
    defaultLanguage: "pt-BR",
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
    currency: "BRL",
    maxFileSize: 10,
    autoBackup: true,
    maintenanceMode: false
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    processUpdates: true,
    deadlineAlerts: true,
    teamMentions: true,
    systemAlerts: true,
    weeklyReports: true,
    marketingEmails: false
  })

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    requirePasswordChange: true,
    allowRememberMe: true
  })


  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "✅ Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "❌ Erro ao salvar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResetSettings = () => {
    setSystemSettings({
      siteName: "EcoFlow",
      siteDescription: "Sistema de Gestão de Processos Ambientais",
      defaultLanguage: "pt-BR",
      timezone: "America/Sao_Paulo",
      dateFormat: "DD/MM/YYYY",
      currency: "BRL",
      maxFileSize: 10,
      autoBackup: true,
      maintenanceMode: false
    })
    toast({
      title: "⚡ Configurações restauradas",
      description: "Todas as configurações foram restauradas para o padrão.",
    })
  }

  const handleExportData = () => {
    toast({
      title: "📁 Exportação iniciada",
      description: "Seus dados estão sendo preparados para download.",
    })
  }

  const handleImportData = () => {
    toast({
      title: "📤 Importação realizada",
      description: "Dados importados com sucesso.",
    })
  }

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">⚙️ Configurações</h1>
            <p className="text-muted-foreground">Gerencie sua conta e preferências do sistema</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
          </TabsList>

          {/* Perfil do Usuário */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Atualize seus dados pessoais e de contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-lg">
                      {profileData.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Alterar Foto
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={profileData.nome}
                      onChange={(e) => setProfileData(prev => ({ ...prev, nome: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={profileData.telefone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, telefone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Select value={profileData.cargo} onValueChange={(value) => setProfileData(prev => ({ ...prev, cargo: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Técnico Senior">Técnico Senior</SelectItem>
                        <SelectItem value="Técnico">Técnico</SelectItem>
                        <SelectItem value="Analista">Analista</SelectItem>
                        <SelectItem value="Coordenador">Coordenador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={handleSaveProfile} disabled={loading}>
                    {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Alterar Senha */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>Altere sua senha e configurações de segurança</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <Button className="w-full md:w-auto">
                  <Key className="mr-2 h-4 w-4" />
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações do Sistema */}
          <TabsContent value="system" className="space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>Configurações básicas do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Nome do Sistema</Label>
                    <Input
                      id="siteName"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">Idioma Padrão</Label>
                    <Select value={systemSettings.defaultLanguage} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, defaultLanguage: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                        <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                        <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Formato de Data</Label>
                    <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, dateFormat: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Descrição do Sistema</Label>
                  <Textarea
                    id="siteDescription"
                    value={systemSettings.siteDescription}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Configurações Avançadas</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Backup Automático</Label>
                      <div className="text-sm text-muted-foreground">
                        Executar backup diário dos dados
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoBackup: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Modo Manutenção</Label>
                      <div className="text-sm text-muted-foreground">
                        Desabilitar acesso temporariamente
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleResetSettings}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restaurar Padrões
                  </Button>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Backup e Exportação */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Backup e Exportação</CardTitle>
                <CardDescription>Gerencie backups e exportação de dados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Dados
                  </Button>
                  <Button variant="outline" onClick={handleImportData}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importar Dados
                  </Button>
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Último backup:</strong> Hoje às 03:00 - Status: ✅ Sucesso
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>Configure como você deseja receber notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Notificações Gerais</h3>
                  
                  {Object.entries({
                    emailNotifications: "Notificações por E-mail",
                    pushNotifications: "Notificações Push",
                    processUpdates: "Atualizações de Processos",
                    deadlineAlerts: "Alertas de Prazo",
                    teamMentions: "Menções da Equipe",
                    systemAlerts: "Alertas do Sistema"
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{label}</Label>
                        <div className="text-sm text-muted-foreground">
                          Receber {label.toLowerCase()}
                        </div>
                      </div>
                      <Switch
                        checked={notifications[key as keyof typeof notifications]}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [key]: checked }))}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Comunicação</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Relatórios Semanais</Label>
                      <div className="text-sm text-muted-foreground">
                        Receber resumo semanal por e-mail
                      </div>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>E-mails de Marketing</Label>
                      <div className="text-sm text-muted-foreground">
                        Receber novidades e promoções
                      </div>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketingEmails: checked }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Preferências
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segurança */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
                <CardDescription>Gerencie as configurações de segurança do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticação de Dois Fatores</Label>
                      <div className="text-sm text-muted-foreground">
                        Adicione uma camada extra de segurança
                      </div>
                    </div>
                    <Switch
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactorAuth: checked }))}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Timeout da Sessão (minutos)</Label>
                      <Input
                        type="number"
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expiração da Senha (dias)</Label>
                      <Input
                        type="number"
                        value={security.passwordExpiry}
                        onChange={(e) => setSecurity(prev => ({ ...prev, passwordExpiry: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Lembrar-me</Label>
                      <div className="text-sm text-muted-foreground">
                        Permitir que usuários salvem login
                      </div>
                    </div>
                    <Switch
                      checked={security.allowRememberMe}
                      onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, allowRememberMe: checked }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Logs de Segurança</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border border-border/40 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Login bem-sucedido</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Hoje, 09:30</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-border/40 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Tentativa de acesso negada</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Ontem, 22:15</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Shield className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aparência */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Personalização Visual</CardTitle>
                <CardDescription>Customize a aparência do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Tema de Cores</h3>
                  
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {themes.map((theme, index) => (
                      <motion.div
                        key={theme.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          currentTheme === theme.id 
                            ? 'border-primary bg-primary/10 shadow-lg scale-105' 
                            : 'border-border/40 hover:border-primary/50 hover:bg-primary/5'
                        }`}
                        onClick={() => {
                          setTheme(theme.id)
                          toast({
                            title: "🎨 Tema alterado!",
                            description: `Tema ${theme.name} aplicado com sucesso.`,
                          })
                        }}
                        whileHover={{ scale: currentTheme === theme.id ? 1.05 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                            style={{ 
                              backgroundColor: `rgb(${theme.previewRgb})` 
                            }}
                            animate={{ 
                              scale: currentTheme === theme.id ? 1.2 : 1,
                              rotate: currentTheme === theme.id ? 360 : 0
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          <span className="font-medium">{theme.name}</span>
                        </div>
                        {currentTheme === theme.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
                            <Badge className="mt-2" variant="default">✨ Ativo</Badge>
                          </motion.div>
                        )}
                        
                        {/* Preview das cores do tema */}
                        <div className="flex gap-1 mt-3">
                          <div 
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ backgroundColor: `rgb(${theme.previewRgb})` }}
                          />
                          <div 
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ 
                              backgroundColor: `rgb(${theme.previewRgb})`,
                              opacity: 0.7
                            }}
                          />
                          <div 
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ 
                              backgroundColor: `rgb(${theme.previewRgb})`,
                              opacity: 0.4
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Preview do tema atual */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="p-4 border border-primary/20 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5"
                  >
                    <h4 className="font-medium mb-2">Preview do Tema Atual</h4>
                    <div className="flex items-center gap-4">
                      <Button size="sm">Botão Primário</Button>
                      <Button variant="secondary" size="sm">Botão Secundário</Button>
                      <Badge>Badge</Badge>
                    </div>
                  </motion.div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Layout</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Largura do Sidebar</Label>
                      <Select defaultValue="default">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compacto</SelectItem>
                          <SelectItem value="default">Padrão</SelectItem>
                          <SelectItem value="wide">Largo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Densidade</Label>
                      <Select defaultValue="comfortable">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compacto</SelectItem>
                          <SelectItem value="comfortable">Confortável</SelectItem>
                          <SelectItem value="spacious">Espaçoso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => {
                        toast({
                          title: "✅ Tema salvo!",
                          description: "Suas preferências de aparência foram salvas.",
                        })
                      }}
                    >
                      <Palette className="mr-2 h-4 w-4" />
                      Salvar Preferências
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}