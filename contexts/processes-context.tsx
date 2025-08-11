"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export interface Process {
  id: string
  type: string
  title: string
  client: string
  technician: string
  status: string
  priority: string
  area?: string
  location: string
  startDate: string
  deadline: string
  documents: number
  progress: number
  description?: string
  createdAt: string
  updatedAt: string
}

interface ProcessesContextType {
  processes: Process[]
  addProcess: (process: Omit<Process, "id" | "createdAt" | "updatedAt">) => void
  updateProcess: (id: string, updates: Partial<Process>) => void
  deleteProcess: (id: string) => void
  getProcessesByType: (type: string) => Process[]
  getProcessById: (id: string) => Process | undefined
}

const ProcessesContext = createContext<ProcessesContextType | undefined>(undefined)

// Dados iniciais de exemplo
const initialProcesses: Process[] = [
  {
    id: "SIMCAR-2024-001",
    type: "SIMCAR",
    title: "Licenciamento Fazenda São João",
    client: "Fazenda São João Ltda",
    technician: "Maria Santos",
    status: "Em Análise",
    priority: "Alta",
    area: "500 hectares",
    location: "Zona Rural - Município XYZ",
    startDate: "2024-01-15",
    deadline: "2024-02-15",
    documents: 5,
    progress: 65,
    description: "Processo de licenciamento ambiental para atividades agropecuárias",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z"
  },
  {
    id: "PEF-2024-002",
    type: "PEF",
    title: "Plano de Exploração Florestal - Área Norte",
    client: "Madeireira Sustentável S.A.",
    technician: "João Silva",
    status: "Documentação",
    priority: "Média",
    area: "300 hectares",
    location: "Floresta Nacional - Setor 4",
    startDate: "2024-01-20",
    deadline: "2024-03-01",
    documents: 8,
    progress: 40,
    description: "Elaboração de plano para exploração florestal sustentável",
    createdAt: "2024-01-20T10:15:00Z",
    updatedAt: "2024-01-22T16:45:00Z"
  },
  {
    id: "LAUDOS-2024-003",
    type: "Laudos",
    title: "Laudo de Viabilidade Ambiental - Complexo Industrial",
    client: "Indústria TechVerde Ltda",
    technician: "Dr. Roberto Silva",
    status: "Concluído",
    priority: "Alta",
    location: "Distrito Industrial - Cidade ABC",
    startDate: "2024-01-10",
    deadline: "2024-02-10",
    documents: 12,
    progress: 100,
    description: "Análise de viabilidade ambiental para instalação de complexo industrial",
    createdAt: "2024-01-10T08:30:00Z",
    updatedAt: "2024-02-08T17:20:00Z"
  },
  {
    id: "CC-SEMA-2024-004",
    type: "CC-SEMA",
    title: "Certidão de Conformidade - Empresa Alpha",
    client: "Empresa Alpha Ltda",
    technician: "Ana Costa",
    status: "Aprovado",
    priority: "Baixa",
    location: "Zona Industrial - Município DEF",
    startDate: "2024-01-05",
    deadline: "2024-01-25",
    documents: 6,
    progress: 100,
    description: "Emissão de certidão de conformidade ambiental",
    createdAt: "2024-01-05T11:00:00Z",
    updatedAt: "2024-01-23T15:10:00Z"
  },
  {
    id: "DAAP-2024-005",
    type: "DAAP",
    title: "Declaração de Atividades - Fazenda Beta",
    client: "Fazenda Beta S.A.",
    technician: "Carlos Mendes",
    status: "Em Análise",
    priority: "Média",
    area: "1200 hectares",
    location: "Zona Rural - Município GHI",
    startDate: "2024-01-18",
    deadline: "2024-02-28",
    documents: 4,
    progress: 50,
    description: "Declaração anual de atividades com potencial impacto ambiental",
    createdAt: "2024-01-18T13:45:00Z",
    updatedAt: "2024-01-25T09:30:00Z"
  },
  {
    id: "GEO-2024-006",
    type: "Georreferenciamento",
    title: "Levantamento Topográfico - Lote 456",
    client: "Propriedade Rural Esperança",
    technician: "Eng. Paula Santos",
    status: "Documentação",
    priority: "Alta",
    area: "800 hectares",
    location: "Zona Rural - Município JKL",
    startDate: "2024-01-22",
    deadline: "2024-03-15",
    documents: 3,
    progress: 25,
    description: "Georreferenciamento de propriedade rural para regularização",
    createdAt: "2024-01-22T07:20:00Z",
    updatedAt: "2024-01-24T12:15:00Z"
  },
  {
    id: "DLA-2024-007",
    type: "DLA",
    title: "Dispensa de Licenciamento - Atividade de Baixo Impacto",
    client: "Microempresa Verde Ltda",
    technician: "Fernanda Lima",
    status: "Aguardando Análise",
    priority: "Baixa",
    location: "Centro Comercial - Cidade MNO",
    startDate: "2024-01-25",
    deadline: "2024-02-20",
    documents: 2,
    progress: 80,
    description: "Solicitação de dispensa para atividade de baixo impacto ambiental",
    createdAt: "2024-01-25T14:30:00Z",
    updatedAt: "2024-01-26T10:45:00Z"
  }
]

export function ProcessesProvider({ children }: { children: ReactNode }) {
  const [processes, setProcesses] = useState<Process[]>(initialProcesses)

  const generateProcessId = (type: string): string => {
    const year = new Date().getFullYear()
    const existingNumbers = processes
      .filter(p => p.type === type && p.id.includes(year.toString()))
      .map(p => {
        const match = p.id.match(/-(\d+)$/)
        return match ? parseInt(match[1]) : 0
      })
    const nextNumber = Math.max(...existingNumbers, 0) + 1
    return `${type}-${year}-${nextNumber.toString().padStart(3, "0")}`
  }

  const addProcess = (processData: Omit<Process, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()
    const newProcess: Process = {
      ...processData,
      id: generateProcessId(processData.type),
      createdAt: now,
      updatedAt: now,
    }
    setProcesses(prev => [newProcess, ...prev])
  }

  const updateProcess = (id: string, updates: Partial<Process>) => {
    setProcesses(prev =>
      prev.map(process =>
        process.id === id
          ? { ...process, ...updates, updatedAt: new Date().toISOString() }
          : process
      )
    )
  }

  const deleteProcess = (id: string) => {
    setProcesses(prev => prev.filter(process => process.id !== id))
  }

  const getProcessesByType = (type: string) => {
    return processes.filter(process => process.type === type)
  }

  const getProcessById = (id: string) => {
    return processes.find(process => process.id === id)
  }

  return (
    <ProcessesContext.Provider value={{
      processes,
      addProcess,
      updateProcess,
      deleteProcess,
      getProcessesByType,
      getProcessById
    }}>
      {children}
    </ProcessesContext.Provider>
  )
}

export function useProcesses() {
  const context = useContext(ProcessesContext)
  if (context === undefined) {
    throw new Error("useProcesses must be used within a ProcessesProvider")
  }
  return context
}