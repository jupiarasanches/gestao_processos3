"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Usuario } from "@/types/database"

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  userProfile: Usuario | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, nome: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dados simulados de usuários para demonstração
const mockUsers = [
  {
    id: "1",
    email: "admin@ecoflow.com",
    password: "123456",
    profile: {
      id: "1",
      nome: "Administrador EcoFlow",
      email: "admin@ecoflow.com",
      perfil: "admin" as const,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    }
  },
  {
    id: "2", 
    email: "maria@ecoflow.com",
    password: "123456",
    profile: {
      id: "2",
      nome: "Maria Santos",
      email: "maria@ecoflow.com",
      perfil: "comum" as const,
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z"
    }
  },
  {
    id: "3",
    email: "joao@ecoflow.com", 
    password: "123456",
    profile: {
      id: "3",
      nome: "João Silva",
      email: "joao@ecoflow.com",
      perfil: "comum" as const,
      created_at: "2024-01-03T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z"
    }
  }
]

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento inicial e verificar se há usuário logado
    const checkExistingSession = () => {
      const savedUser = localStorage.getItem('mock-auth-user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData.user)
        setUserProfile(userData.profile)
      }
      setLoading(false)
    }

    // Simular um pequeno delay
    setTimeout(checkExistingSession, 500)
  }, [])

  const signIn = async (email: string, password: string): Promise<{ error: any }> => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockUser = mockUsers.find(u => u.email === email && u.password === password)
    
    if (!mockUser) {
      return { error: { message: "Email ou senha incorretos" } }
    }

    const userData = {
      user: { id: mockUser.id, email: mockUser.email },
      profile: mockUser.profile
    }

    setUser(userData.user)
    setUserProfile(userData.profile)
    
    // Salvar no localStorage para persistir a sessão
    localStorage.setItem('mock-auth-user', JSON.stringify(userData))
    
    return { error: null }
  }

  const signUp = async (email: string, password: string, nome: string): Promise<{ error: any }> => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Verificar se o email já existe
    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      return { error: { message: "Este email já está cadastrado" } }
    }

    // Criar novo usuário
    const newUserId = (mockUsers.length + 1).toString()
    const newUser = {
      id: newUserId,
      email,
      password,
      profile: {
        id: newUserId,
        nome,
        email,
        perfil: "comum" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    // Adicionar aos usuários mock (apenas para esta sessão)
    mockUsers.push(newUser)

    // Para simulação, vamos fazer login automático após criar a conta
    const userData = {
      user: { id: newUser.id, email: newUser.email },
      profile: newUser.profile
    }

    setUser(userData.user)
    setUserProfile(userData.profile)
    
    localStorage.setItem('mock-auth-user', JSON.stringify(userData))
    
    return { error: null }
  }

  const signOut = async (): Promise<void> => {
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setUser(null)
    setUserProfile(null)
    localStorage.removeItem('mock-auth-user')
  }

  const resetPassword = async (email: string): Promise<{ error: any }> => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockUser = mockUsers.find(u => u.email === email)
    
    if (!mockUser) {
      return { error: { message: "Email não encontrado" } }
    }

    // Simular sucesso (em um sistema real enviaria email)
    return { error: null }
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}