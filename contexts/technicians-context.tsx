"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Technician {
  id: string
  name: string
  email: string
  phone: string
  registrationNumber: string
  specialty: string
  status: 'ativo' | 'inativo' | 'ferias' | 'em_campo'
  location: string
  joinDate: string
  avatar?: string
  activeProcesses: number
  completedProcesses: number
  efficiency: number
  monthlyGoal: number
  experience: string
  certifications: string[]
  skills: string[]
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

interface TechniciansContextType {
  technicians: Technician[]
  addTechnician: (technician: Omit<Technician, 'id' | 'activeProcesses' | 'completedProcesses' | 'efficiency'>) => void
  updateTechnician: (id: string, updates: Partial<Technician>) => void
  deleteTechnician: (id: string) => void
  getTechnicianById: (id: string) => Technician | undefined
  getTechniciansBySpecialty: (specialty: string) => Technician[]
  getAvailableTechnicians: () => Technician[]
  getTechnicianStats: () => {
    total: number
    active: number
    onField: number
    onVacation: number
    inactive: number
    avgEfficiency: number
  }
}

const TechniciansContext = createContext<TechniciansContextType | undefined>(undefined)

const initialTechnicians: Technician[] = [
  {
    id: '1',
    name: 'Maria Santos',
    email: 'maria.santos@ecoflow.com',
    phone: '(11) 99999-1234',
    registrationNumber: 'CRQ-123456',
    specialty: 'SIMCAR',
    status: 'ativo',
    location: 'São Paulo, SP',
    joinDate: '2023-03-15',
    avatar: '/placeholder-user.jpg',
    activeProcesses: 8,
    completedProcesses: 45,
    efficiency: 92,
    monthlyGoal: 12,
    experience: '5 anos',
    certifications: ['ISO 14001', 'Gestão Ambiental', 'SIMCAR Avançado'],
    skills: ['Licenciamento', 'Análise de Solo', 'Relatórios Técnicos'],
    emergencyContact: {
      name: 'João Santos',
      phone: '(11) 88888-1234',
      relationship: 'Cônjuge'
    }
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao.silva@ecoflow.com',
    phone: '(11) 99999-5678',
    registrationNumber: 'CREA-789012',
    specialty: 'PEF',
    status: 'ativo',
    location: 'Campinas, SP',
    joinDate: '2023-01-20',
    avatar: '/placeholder-user.jpg',
    activeProcesses: 6,
    completedProcesses: 32,
    efficiency: 88,
    monthlyGoal: 10,
    experience: '7 anos',
    certifications: ['Engenheiro Florestal', 'Manejo Sustentável'],
    skills: ['Exploração Florestal', 'Inventário Florestal', 'Planos de Manejo'],
    emergencyContact: {
      name: 'Ana Silva',
      phone: '(11) 77777-5678',
      relationship: 'Mãe'
    }
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana.costa@ecoflow.com',
    phone: '(11) 99999-9012',
    registrationNumber: 'CRQ-345678',
    specialty: 'DAAP',
    status: 'ativo',
    location: 'Santos, SP',
    joinDate: '2023-05-10',
    avatar: '/placeholder-user.jpg',
    activeProcesses: 5,
    completedProcesses: 28,
    efficiency: 85,
    monthlyGoal: 8,
    experience: '3 anos',
    certifications: ['Química Ambiental', 'Análise de Efluentes'],
    skills: ['Monitoramento Ambiental', 'Análise Química', 'DAAP'],
    emergencyContact: {
      name: 'Carlos Costa',
      phone: '(11) 66666-9012',
      relationship: 'Pai'
    }
  },
  {
    id: '4',
    name: 'Carlos Lima',
    email: 'carlos.lima@ecoflow.com',
    phone: '(11) 99999-3456',
    registrationNumber: 'CREA-901234',
    specialty: 'Georreferenciamento',
    status: 'em_campo',
    location: 'Ribeirão Preto, SP',
    joinDate: '2022-11-05',
    avatar: '/placeholder-user.jpg',
    activeProcesses: 4,
    completedProcesses: 38,
    efficiency: 96,
    monthlyGoal: 6,
    experience: '10 anos',
    certifications: ['Topografia', 'GPS/GNSS', 'CAR'],
    skills: ['Levantamento Topográfico', 'CAR', 'Georreferenciamento'],
    emergencyContact: {
      name: 'Laura Lima',
      phone: '(11) 55555-3456',
      relationship: 'Esposa'
    }
  },
  {
    id: '5',
    name: 'Lucia Ferreira',
    email: 'lucia.ferreira@ecoflow.com',
    phone: '(11) 99999-7890',
    registrationNumber: 'CRQ-567890',
    specialty: 'CC-SEMA',
    status: 'ferias',
    location: 'Sorocaba, SP',
    joinDate: '2023-08-12',
    avatar: '/placeholder-user.jpg',
    activeProcesses: 2,
    completedProcesses: 22,
    efficiency: 79,
    monthlyGoal: 9,
    experience: '2 anos',
    certifications: ['Gestão Ambiental', 'Auditoria'],
    skills: ['Conformidade', 'Certificação', 'Auditoria Ambiental'],
    emergencyContact: {
      name: 'Roberto Ferreira',
      phone: '(11) 44444-7890',
      relationship: 'Irmão'
    }
  },
  {
    id: '6',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@ecoflow.com',
    phone: '(11) 99999-2468',
    registrationNumber: 'CREA-246810',
    specialty: 'PRA',
    status: 'ativo',
    location: 'Bauru, SP',
    joinDate: '2022-09-30',
    avatar: '/placeholder-user.jpg',
    activeProcesses: 7,
    completedProcesses: 41,
    efficiency: 90,
    monthlyGoal: 11,
    experience: '6 anos',
    certifications: ['Recuperação de Áreas', 'Bioengenharia'],
    skills: ['PRAD', 'Revegetação', 'Bioengenharia'],
    emergencyContact: {
      name: 'Carla Oliveira',
      phone: '(11) 33333-2468',
      relationship: 'Esposa'
    }
  },
  {
    id: '7',
    name: 'Fernanda Costa',
    email: 'fernanda.costa@ecoflow.com',
    phone: '(11) 99999-1357',
    registrationNumber: 'CRQ-135792',
    specialty: 'Laudos',
    status: 'ativo',
    location: 'Jundiaí, SP',
    joinDate: '2023-06-01',
    avatar: '/placeholder-user.jpg',
    activeProcesses: 9,
    completedProcesses: 18,
    efficiency: 87,
    monthlyGoal: 15,
    experience: '4 anos',
    certifications: ['Perícia Ambiental', 'Avaliação de Impacto'],
    skills: ['Laudos Técnicos', 'Perícia', 'Avaliação Ambiental'],
    emergencyContact: {
      name: 'Marcos Costa',
      phone: '(11) 22222-1357',
      relationship: 'Pai'
    }
  }
]

export function TechniciansProvider({ children }: { children: ReactNode }) {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians)

  const generateId = (): string => {
    return `tech_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const addTechnician = (newTechnician: Omit<Technician, 'id' | 'activeProcesses' | 'completedProcesses' | 'efficiency'>) => {
    const technician: Technician = {
      ...newTechnician,
      id: generateId(),
      activeProcesses: 0,
      completedProcesses: 0,
      efficiency: 0
    }
    setTechnicians(prev => [...prev, technician])
  }

  const updateTechnician = (id: string, updates: Partial<Technician>) => {
    setTechnicians(prev => 
      prev.map(tech => 
        tech.id === id ? { ...tech, ...updates } : tech
      )
    )
  }

  const deleteTechnician = (id: string) => {
    setTechnicians(prev => prev.filter(tech => tech.id !== id))
  }

  const getTechnicianById = (id: string): Technician | undefined => {
    return technicians.find(tech => tech.id === id)
  }

  const getTechniciansBySpecialty = (specialty: string): Technician[] => {
    return technicians.filter(tech => tech.specialty === specialty)
  }

  const getAvailableTechnicians = (): Technician[] => {
    return technicians.filter(tech => tech.status === 'ativo')
  }

  const getTechnicianStats = () => {
    const total = technicians.length
    const active = technicians.filter(t => t.status === 'ativo').length
    const onField = technicians.filter(t => t.status === 'em_campo').length
    const onVacation = technicians.filter(t => t.status === 'ferias').length
    const inactive = technicians.filter(t => t.status === 'inativo').length
    const avgEfficiency = technicians.reduce((sum, t) => sum + t.efficiency, 0) / total

    return {
      total,
      active,
      onField,
      onVacation,
      inactive,
      avgEfficiency: Math.round(avgEfficiency)
    }
  }

  const value = {
    technicians,
    addTechnician,
    updateTechnician,
    deleteTechnician,
    getTechnicianById,
    getTechniciansBySpecialty,
    getAvailableTechnicians,
    getTechnicianStats
  }

  return (
    <TechniciansContext.Provider value={value}>
      {children}
    </TechniciansContext.Provider>
  )
}

export function useTechnicians() {
  const context = useContext(TechniciansContext)
  if (context === undefined) {
    throw new Error('useTechnicians must be used within a TechniciansProvider')
  }
  return context
}