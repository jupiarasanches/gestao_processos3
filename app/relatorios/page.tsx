"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"
import {
  BarChart3,
  Calendar as CalendarIcon,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Target,
  Award,
  Activity,
  Filter,
  RefreshCw
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ProtectedRoute } from "@/components/protected-route"
import { useProcesses } from "@/contexts/processes-context"
import { useTechnicians } from "@/contexts/technicians-context"

export default function RelatoriosPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date()
  })
  const [selectedPeriod, setSelectedPeriod] = useState("mes")
  const [selectedTeam, setSelectedTeam] = useState("todos")
  
  const { processes } = useProcesses()
  const { technicians, getTechnicianStats } = useTechnicians()
  const techStats = getTechnicianStats()

  // Dados calculados para os gráficos
  const analyticsData = useMemo(() => {
    // Estatísticas gerais
    const totalProcesses = processes.length
    const completedProcesses = processes.filter(p => p.status === "Aprovado" || p.status === "Concluído").length
    const activeProcesses = processes.filter(p => p.status === "Em Análise" || p.status === "Em Elaboração").length
    const pendingProcesses = processes.filter(p => p.status === "Pendente" || p.status === "Aguardando Análise").length
    const completionRate = totalProcesses > 0 ? Math.round((completedProcesses / totalProcesses) * 100) : 0

    // Processos por tipo
    const processesByType = processes.reduce((acc, process) => {
      acc[process.type] = (acc[process.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const typeChartData = Object.entries(processesByType).map(([type, count]) => ({
      name: type,
      value: count,
      percentage: Math.round((count / totalProcesses) * 100)
    }))

    // Processos por status
    const processesByStatus = processes.reduce((acc, process) => {
      acc[process.status] = (acc[process.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const statusChartData = Object.entries(processesByStatus).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: Math.round((count / totalProcesses) * 100)
    }))

    // Evolução mensal (simulada)
    const monthlyData = [
      { month: "Jan", processos: 12, concluidos: 8, pendentes: 4 },
      { month: "Fev", processos: 15, concluidos: 11, pendentes: 4 },
      { month: "Mar", processos: 18, concluidos: 14, pendentes: 4 },
      { month: "Abr", processos: 22, concluidos: 17, pendentes: 5 },
      { month: "Mai", processos: 25, concluidos: 20, pendentes: 5 },
      { month: "Jun", processos: 28, concluidos: 23, pendentes: 5 }
    ]

    // Performance por técnico
    const technicianPerformance = technicians.map(tech => ({
      name: tech.name.split(' ')[0],
      concluidos: tech.completedProcesses,
      ativos: tech.activeProcesses,
      eficiencia: tech.efficiency,
      meta: tech.monthlyGoal
    })).sort((a, b) => b.eficiencia - a.eficiencia)

    // Análise de prazos (simulada)
    const deadlineAnalysis = {
      onTime: Math.round(completedProcesses * 0.75),
      delayed: Math.round(completedProcesses * 0.25),
      avgDays: 18
    }

    return {
      totalProcesses,
      completedProcesses,
      activeProcesses,
      pendingProcesses,
      completionRate,
      typeChartData,
      statusChartData,
      monthlyData,
      technicianPerformance,
      deadlineAnalysis
    }
  }, [processes, technicians])

  const COLORS = {
    primary: '#22c55e',
    secondary: '#3b82f6',
    accent: '#f59e0b',
    danger: '#ef4444',
    warning: '#f97316',
    info: '#06b6d4',
    success: '#10b981',
    purple: '#8b5cf6'
  }

  const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.danger, COLORS.warning, COLORS.info, COLORS.purple, COLORS.success]

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">📊 Relatórios e Analytics</h1>
              <p className="text-muted-foreground">Dashboard completo de métricas e indicadores</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="border-border/40">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Última Semana</SelectItem>
                  <SelectItem value="mes">Último Mês</SelectItem>
                  <SelectItem value="trimestre">Último Trimestre</SelectItem>
                  <SelectItem value="ano">Último Ano</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Equipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Equipes</SelectItem>
                  <SelectItem value="simcar">SIMCAR</SelectItem>
                  <SelectItem value="pef">PEF</SelectItem>
                  <SelectItem value="laudos">Laudos</SelectItem>
                  <SelectItem value="georreferenciamento">Georreferenciamento</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd", { locale: ptBR })} -{" "}
                          {format(dateRange.to, "LLL dd", { locale: ptBR })}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y", { locale: ptBR })
                      )
                    ) : (
                      <span>Selecionar data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{ from: dateRange.from!, to: dateRange.to! }}
                    onSelect={(range) => range && setDateRange({ from: range.from!, to: range.to! })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              <div className="text-sm text-muted-foreground flex items-center">
                Última atualização: {format(new Date(), "HH:mm", { locale: ptBR })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalProcesses}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs. mês anterior
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.completionRate}%</div>
              <Progress value={analyticsData.completionRate} className="mt-2" />
              <div className="flex items-center text-xs text-blue-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5% vs. mês anterior
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.activeProcesses}</div>
              <div className="flex items-center text-xs text-orange-600 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                {analyticsData.deadlineAnalysis.avgDays} dias em média
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eficiência da Equipe</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{techStats.avgEfficiency}%</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <Users className="h-3 w-3 mr-1" />
                {techStats.active} técnicos ativos
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos e Análises */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Distribuição por Tipo */}
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Distribuição por Tipo de Processo</CardTitle>
                  <CardDescription>Análise dos tipos mais demandados</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.typeChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.typeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Status dos Processos */}
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Status dos Processos</CardTitle>
                  <CardDescription>Situação atual da carteira</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.statusChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill={COLORS.primary} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Análise de Prazos */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Análise de Cumprimento de Prazos</CardTitle>
                <CardDescription>Performance de entrega da equipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{analyticsData.deadlineAnalysis.onTime}</div>
                    <div className="text-sm text-muted-foreground">No Prazo</div>
                    <div className="text-xs text-green-600 mt-1">
                      {Math.round((analyticsData.deadlineAnalysis.onTime / analyticsData.completedProcesses) * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{analyticsData.deadlineAnalysis.delayed}</div>
                    <div className="text-sm text-muted-foreground">Atrasados</div>
                    <div className="text-xs text-orange-600 mt-1">
                      {Math.round((analyticsData.deadlineAnalysis.delayed / analyticsData.completedProcesses) * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{analyticsData.deadlineAnalysis.avgDays}</div>
                    <div className="text-sm text-muted-foreground">Dias em Média</div>
                    <div className="text-xs text-blue-600 mt-1">Tempo de conclusão</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance por Técnico */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Performance Individual dos Técnicos</CardTitle>
                <CardDescription>Ranking de eficiência e produtividade</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData.technicianPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="concluidos" fill={COLORS.success} name="Concluídos" />
                    <Bar dataKey="ativos" fill={COLORS.secondary} name="Em Andamento" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <div className="grid gap-6 lg:grid-cols-3">
              {analyticsData.technicianPerformance.slice(0, 3).map((tech, index) => (
                <Card key={tech.name} className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                      {tech.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Eficiência</span>
                        <span className="font-medium">{tech.eficiencia}%</span>
                      </div>
                      <Progress value={tech.eficiencia} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{tech.concluidos}</div>
                        <div className="text-muted-foreground">Concluídos</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{tech.ativos}</div>
                        <div className="text-muted-foreground">Em Andamento</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Evolução Temporal */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Evolução dos Processos ao Longo do Tempo</CardTitle>
                <CardDescription>Tendências mensais de crescimento</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={analyticsData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="processos" 
                      stackId="1" 
                      stroke={COLORS.primary} 
                      fill={COLORS.primary} 
                      name="Total de Processos"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="concluidos" 
                      stackId="2" 
                      stroke={COLORS.success} 
                      fill={COLORS.success} 
                      name="Concluídos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Métricas de Crescimento */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Crescimento Mensal</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+18%</div>
                  <p className="text-xs text-muted-foreground">vs. mês anterior</p>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <p className="text-xs text-muted-foreground">este mês</p>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">R$ 125k</div>
                  <p className="text-xs text-muted-foreground">este mês</p>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
                  <Award className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">94%</div>
                  <p className="text-xs text-muted-foreground">NPS médio</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            {/* Distribuição da Equipe */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Distribuição por Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ativos</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(techStats.active / techStats.total) * 100} className="w-24" />
                      <span className="text-sm font-medium">{techStats.active}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Em Campo</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(techStats.onField / techStats.total) * 100} className="w-24" />
                      <span className="text-sm font-medium">{techStats.onField}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">De Férias</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(techStats.onVacation / techStats.total) * 100} className="w-24" />
                      <span className="text-sm font-medium">{techStats.onVacation}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Capacidade da Equipe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{techStats.total}</div>
                    <div className="text-sm text-muted-foreground">Técnicos no total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{techStats.avgEfficiency}%</div>
                    <div className="text-sm text-muted-foreground">Eficiência média</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista Detalhada da Equipe */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Detalhamento Individual</CardTitle>
                <CardDescription>Performance individual dos técnicos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.technicianPerformance.map((tech, index) => (
                    <div key={tech.name} className="flex items-center justify-between p-4 border border-border/40 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={index < 3 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                        <div>
                          <div className="font-medium">{tech.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {tech.concluidos} concluídos • {tech.ativos} ativos
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{tech.eficiencia}%</div>
                        <div className="text-sm text-muted-foreground">eficiência</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}