"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  MapPin, 
  Plus, 
  TreePine, 
  TrendingUp, 
  Users,
  Calendar,
  BarChart3,
  Activity,
  Leaf,
  Target,
  Brain,
  Zap,
  Award,
  Globe,
  PieChart,
  Database,
  Filter
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/mock-auth-provider"
import { useProcesses } from "@/contexts/processes-context"
import { NewProcessDialog } from "@/components/new-process-dialog"

export default function Dashboard() {
  const { userProfile } = useAuth()
  const { processes } = useProcesses()

  // Usar dados reais do contexto
  const totalProcesses = processes.length
  const activeProcesses = processes.filter(p => p.status === "Em Análise" || p.status === "Em Elaboração" || p.status === "Documentação").length
  const completedProcesses = processes.filter(p => p.status === "Aprovado" || p.status === "Concluído").length
  const pendingProcesses = processes.filter(p => p.status === "Pendente" || p.status === "Aguardando Análise").length

  const stats = [
    {
      title: "Total de Processos",
      value: totalProcesses.toString(),
      change: "+15%",
      trend: "up",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      title: "Processos Ativos",
      value: activeProcesses.toString(),
      change: "+8%",
      trend: "up",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      title: "Concluídos",
      value: completedProcesses.toString(),
      change: "+22%",
      trend: "up",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      borderColor: "border-emerald-200 dark:border-emerald-800"
    },
    {
      title: "Pendentes",
      value: pendingProcesses.toString(),
      change: "-5%",
      trend: "down",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderColor: "border-yellow-200 dark:border-yellow-800"
    },
  ]

  // Usar os processos mais recentes do contexto
  const recentProcesses = processes
    .filter(p => p.status !== "Aprovado" && p.status !== "Concluído") // Apenas processos ativos
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Ordenar por data de criação
    .slice(0, 4) // Pegar apenas os 4 mais recentes
    .map(process => ({
      ...process,
      date: process.startDate,
      icon: process.type === "SIMCAR" || process.type === "PEF" ? TreePine : 
            process.type === "PRA" ? Leaf :
            process.type === "Georreferenciamento" ? MapPin : FileText
    }))

  // Dados calculados dinamicamente por tipo de processo usando dados reais
  const processTypeStats = [
    { 
      type: "SIMCAR", 
      count: processes.filter(p => p.type === "SIMCAR").length, 
      percentage: totalProcesses > 0 ? Math.round((processes.filter(p => p.type === "SIMCAR").length / totalProcesses) * 100) : 0,
      color: "bg-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      textColor: "text-blue-700 dark:text-blue-300",
      icon: TreePine,
      theme: "Cadastro Ambiental Rural"
    },
    { 
      type: "PEF", 
      count: processes.filter(p => p.type === "PEF").length, 
      percentage: totalProcesses > 0 ? Math.round((processes.filter(p => p.type === "PEF").length / totalProcesses) * 100) : 0,
      color: "bg-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20", 
      textColor: "text-green-700 dark:text-green-300",
      icon: TreePine,
      theme: "Exploração Florestal"
    },
    { 
      type: "PRA", 
      count: processes.filter(p => p.type === "PRA").length, 
      percentage: totalProcesses > 0 ? Math.round((processes.filter(p => p.type === "PRA").length / totalProcesses) * 100) : 0,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      textColor: "text-emerald-700 dark:text-emerald-300", 
      icon: Leaf,
      theme: "Recuperação Ambiental"
    },
    { 
      type: "CC-SEMA", 
      count: processes.filter(p => p.type === "CC-SEMA").length, 
      percentage: totalProcesses > 0 ? Math.round((processes.filter(p => p.type === "CC-SEMA").length / totalProcesses) * 100) : 0,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      textColor: "text-yellow-700 dark:text-yellow-300",
      icon: FileText,
      theme: "Conformidade Ambiental"
    },
    { 
      type: "DAAP", 
      count: processes.filter(p => p.type === "DAAP").length, 
      percentage: totalProcesses > 0 ? Math.round((processes.filter(p => p.type === "DAAP").length / totalProcesses) * 100) : 0,
      color: "bg-gray-500",
      bgColor: "bg-gray-50 dark:bg-gray-950/20",
      textColor: "text-gray-700 dark:text-gray-300",
      icon: FileText,
      theme: "Declaração de Atividades"
    },
    { 
      type: "Georreferenciamento", 
      count: processes.filter(p => p.type === "Georreferenciamento").length, 
      percentage: totalProcesses > 0 ? Math.round((processes.filter(p => p.type === "Georreferenciamento").length / totalProcesses) * 100) : 0,
      color: "bg-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      textColor: "text-purple-700 dark:text-purple-300",
      icon: MapPin,
      theme: "Levantamento Topográfico"
    },
    { 
      type: "DLA", 
      count: processes.filter(p => p.type === "DLA").length, 
      percentage: totalProcesses > 0 ? Math.round((processes.filter(p => p.type === "DLA").length / totalProcesses) * 100) : 0,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
      textColor: "text-indigo-700 dark:text-indigo-300",
      icon: FileText,
      theme: "Dispensa de Licenciamento"
    },
    { 
      type: "Laudos", 
      count: processes.filter(p => p.type === "Laudos").length, 
      percentage: totalProcesses > 0 ? Math.round((processes.filter(p => p.type === "Laudos").length / totalProcesses) * 100) : 0,
      color: "bg-teal-500",
      bgColor: "bg-teal-50 dark:bg-teal-950/20",
      textColor: "text-teal-700 dark:text-teal-300",
      icon: FileText,
      theme: "Laudos Técnicos"
    }
  ].sort((a, b) => b.count - a.count) // Ordenar por quantidade

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Em Análise":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Documentação":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Em Campo":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "Pendente":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  const monthlyGoals = [
    { title: "SIMCAR", current: 12, target: 15, progress: 80 },
    { title: "PEF", current: 8, target: 10, progress: 80 },
    { title: "CC-SEMA", current: 5, target: 8, progress: 62.5 },
    { title: "Georreferenciamento", current: 3, target: 5, progress: 60 },
  ]

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-6 p-6">
        {/* Header com saudação personalizada */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {getGreeting()}, {userProfile?.nome?.split(" ")[0] || "Usuário"}! 👋
              </h1>
              <p className="text-muted-foreground">Aqui está um resumo do seu sistema de gestão ambiental</p>
            </div>
          </div>
          <NewProcessDialog />
        </div>

        {/* Cards de estatísticas principais */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={stat.title} className={`${stat.borderColor} ${stat.bgColor} border-2 shadow-sm hover:shadow-md transition-shadow duration-200`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className={`flex items-center text-xs ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    <TrendingUp className={`h-3 w-3 mr-1 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                    {stat.change}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.trend === "up" ? "Aumento" : "Redução"} comparado ao mês anterior
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seção de Gráficos */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Gráfico de Distribuição por Tema */}
          <Card className="lg:col-span-2 border-border/40 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <CardTitle>Distribuição por Tema Ambiental</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  {totalProcesses} total
                </Badge>
              </div>
              <CardDescription>
                Visualização dos processos cadastrados organizados por área temática
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Gráfico de barras horizontais */}
                <div className="space-y-4">
                  {processTypeStats.map((stat, index) => (
                    <div key={stat.type} className={`p-4 rounded-xl ${stat.bgColor} transition-all duration-300 hover:scale-[1.02]`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20`}>
                            <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                          </div>
                          <div>
                            <h4 className={`font-semibold ${stat.textColor}`}>{stat.type}</h4>
                            <p className="text-xs text-muted-foreground">{stat.theme}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.count}</div>
                          <div className="text-xs text-muted-foreground">{stat.percentage}% do total</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white/30 dark:bg-black/20 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                            style={{
                              width: `${stat.percentage}%`,
                              animationDelay: `${index * 200}ms`
                            }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${stat.textColor} min-w-[3rem]`}>
                          {stat.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumo estatístico */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{activeProcesses}</div>
                    <div className="text-xs text-muted-foreground">Ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{completedProcesses}</div>
                    <div className="text-xs text-muted-foreground">Concluídos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{pendingProcesses}</div>
                    <div className="text-xs text-muted-foreground">Pendentes</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar com Rankings e Insights */}
          <div className="space-y-6">
            {/* Top 3 Tipos de Processo */}
            <Card className="border-border/40 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Top Temas
                </CardTitle>
                <CardDescription>
                  Processos mais cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {processTypeStats.slice(0, 3).map((stat, index) => (
                  <div key={stat.type} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${stat.color}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{stat.type}</div>
                      <div className="text-xs text-muted-foreground">{stat.count} processos</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.percentage}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Insights IA */}
            <Card className="border-border/40 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Insights IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Crescimento</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        SIMCAR lidera com {processTypeStats[0]?.count} processos
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-2">
                    <Leaf className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Sustentabilidade</p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        {processTypeStats.find(s => s.type === "PRA")?.count} projetos de recuperação
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Processos Recentes */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/40 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle>Processos em Andamento</CardTitle>
                </div>
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </div>
              <CardDescription>
                Acompanhe o status dos processos mais recentes e ativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProcesses.map((process) => (
                  <div
                    key={process.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{process.id}</span>
                        <Badge variant="outline" className="text-xs">
                          {process.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Técnico: {process.technician}</p>
                      <p className="text-xs text-muted-foreground">{process.date}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(process.status)}>{process.status}</Badge>
                      <Badge className={getPriorityColor(process.priority)}>{process.priority}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card className="border-border/40 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-transparent to-blue-50 dark:to-blue-950/20 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-950/20 dark:hover:to-blue-950/40 border-blue-200 dark:border-blue-800">
                <TreePine className="mr-2 h-4 w-4 text-blue-600" />
                Novo SIMCAR
              </Button>
              <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-transparent to-emerald-50 dark:to-emerald-950/20 hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-950/20 dark:hover:to-emerald-950/40 border-emerald-200 dark:border-emerald-800">
                <Leaf className="mr-2 h-4 w-4 text-emerald-600" />
                Novo PRA
              </Button>
              <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-transparent to-green-50 dark:to-green-950/20 hover:from-green-50 hover:to-green-100 dark:hover:from-green-950/20 dark:hover:to-green-950/40 border-green-200 dark:border-green-800">
                <FileText className="mr-2 h-4 w-4 text-green-600" />
                Novo PEF
              </Button>
              <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-transparent to-purple-50 dark:to-purple-950/20 hover:from-purple-50 hover:to-purple-100 dark:hover:from-purple-950/20 dark:hover:to-purple-950/40 border-purple-200 dark:border-purple-800">
                <MapPin className="mr-2 h-4 w-4 text-purple-600" />
                Georreferenciamento
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Seção inferior com metas e alertas */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/40 shadow-lg">
            <CardHeader>
              <CardTitle>Progresso Mensal</CardTitle>
              <CardDescription>Metas de processos para o mês atual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {monthlyGoals.map((goal) => (
                <div key={goal.title} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{goal.title}</span>
                    <span>{goal.current}/{goal.target}</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Alertas e Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Prazo de vencimento próximo</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">3 processos vencem nos próximos 7 dias</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Documentos pendentes</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">5 processos aguardam documentação</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Processos aprovados</p>
                  <p className="text-xs text-green-700 dark:text-green-300">12 processos foram aprovados hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}