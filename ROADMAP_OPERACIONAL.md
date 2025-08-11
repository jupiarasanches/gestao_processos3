# 🚀 Roadmap para Sistema Operacional - EcoFlow

> Nota: Este documento é complementar. Para a visão geral e decisões de arquitetura, consulte primeiro a fonte única: [BASE_DO_PROJETO.md](./BASE_DO_PROJETO.md).

## 📋 **Status Atual vs. Sistema Operacional**

### **🟢 Atual (Funcional com Simulação)**
- ✅ Interface completa e responsiva
- ✅ Todos os componentes funcionando
- ✅ Dados simulados (mock data)
- ✅ Contextos globais funcionais
- ✅ Busca inteligente simulada
- ✅ Temas e customização
- ✅ Transições e animações

### **🔴 Necessário para Operação Real**
- ❌ Backend com banco de dados
- ❌ Upload real de arquivos
- ❌ Autenticação robusta
- ❌ APIs RESTful/GraphQL
- ❌ Validação de dados server-side
- ❌ Segurança e permissões
- ❌ Deploy em produção

---

## 🏗️ **Arquitetura para Sistema Operacional**

### **📊 Stack Tecnológica Recomendada**

#### **Frontend (Atual - Next.js 15)**
```
✅ Next.js 15 (App Router)
✅ TypeScript
✅ Tailwind CSS
✅ Shadcn/ui
✅ Framer Motion
✅ React Contexts
```

#### **Backend (A Implementar)**
```
🔧 Opção 1: Next.js API Routes + Prisma + PostgreSQL
🔧 Opção 2: Node.js + Express + Prisma + PostgreSQL
🔧 Opção 3: Supabase (Backend as a Service)
🔧 Opção 4: Firebase + Firestore
```

#### **Banco de Dados**
```
🔧 PostgreSQL (Recomendado para produção)
🔧 MySQL (Alternativa robusta)
🔧 Supabase PostgreSQL (Managed)
🔧 MongoDB (Para flexibilidade)
```

#### **Armazenamento de Arquivos**
```
🔧 AWS S3 (Recomendado)
🔧 Cloudinary (Para imagens)
🔧 Supabase Storage
🔧 Google Cloud Storage
```

---

## 📋 **Roadmap Detalhado**

### **🎯 FASE 1: Backend e Banco de Dados (Crítico)**

#### **1.1 Configuração do Banco**
```sql
-- Estrutura de tabelas necessárias

-- Usuários e Autenticação
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'tecnico', 'viewer') DEFAULT 'tecnico',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Técnicos
CREATE TABLE technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  specialty VARCHAR(255),
  experience VARCHAR(100),
  location VARCHAR(255),
  status ENUM('ativo', 'inativo', 'afastado') DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Processos
CREATE TABLE processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type ENUM('SIMCAR', 'CC-SEMA', 'DAAP', 'PEF', 'Georreferenciamento', 'DLA', 'Laudos'),
  status ENUM('pendente', 'em_andamento', 'concluido', 'inativo') DEFAULT 'pendente',
  technician_id UUID REFERENCES technicians(id),
  location VARCHAR(255),
  description TEXT,
  priority ENUM('baixa', 'media', 'alta') DEFAULT 'media',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documentos
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID REFERENCES processes(id),
  name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500),
  file_size INTEGER,
  file_type VARCHAR(100),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Histórico de Ações
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255),
  resource_type VARCHAR(100),
  resource_id UUID,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **1.2 APIs RESTful**
```typescript
// Estrutura de APIs necessárias

// Autenticação
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/refresh

// Técnicos
GET    /api/technicians
POST   /api/technicians
PUT    /api/technicians/:id
DELETE /api/technicians/:id
GET    /api/technicians/:id

// Processos
GET    /api/processes
POST   /api/processes
PUT    /api/processes/:id
DELETE /api/processes/:id
GET    /api/processes/:id
PATCH  /api/processes/:id/status

// Documentos
GET    /api/documents
POST   /api/documents/upload
DELETE /api/documents/:id
GET    /api/documents/:id/download

// Busca
POST   /api/search
GET    /api/search/suggestions

// Dashboard
GET    /api/dashboard/stats
GET    /api/dashboard/charts
```

### **🎯 FASE 2: Sistema de Upload de Arquivos**

#### **2.1 Upload Seguro**
```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Validações
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Arquivo muito grande' }, { status: 400 })
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 })
    }

    // Salvar arquivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const filename = `${Date.now()}-${file.name}`
    const filepath = path.join(process.cwd(), 'uploads', filename)
    
    await writeFile(filepath, buffer)
    
    return NextResponse.json({ 
      message: 'Upload realizado com sucesso',
      filename,
      size: file.size,
      type: file.type
    })
    
  } catch (error) {
    return NextResponse.json({ error: 'Erro no upload' }, { status: 500 })
  }
}
```

#### **2.2 Componente de Upload Real**
```typescript
// components/file-upload-real.tsx
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export function FileUploadReal() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleUpload = async (file: File) => {
    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Upload success:', result)
      } else {
        console.error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div>
      {/* Interface de upload */}
      {uploading && <Progress value={progress} />}
    </div>
  )
}
```

### **🎯 FASE 3: Autenticação Robusta**

#### **3.1 Sistema de Auth com NextAuth.js**
```bash
npm install next-auth @auth/prisma-adapter
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }
```

#### **3.2 Middleware de Proteção**
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Verificar permissões
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/processos/:path*', '/tecnicos/:path*']
}
```

### **🎯 FASE 4: Integração com ORM (Prisma)**

#### **4.1 Schema do Prisma**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(TECNICO)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  technician Technician?
  documents  Document[]
  activities ActivityLog[]
}

model Technician {
  id         String           @id @default(cuid())
  userId     String           @unique
  name       String
  email      String           @unique
  phone      String?
  specialty  String
  experience String
  location   String
  status     TechnicianStatus @default(ATIVO)
  createdAt  DateTime         @default(now())

  user      User      @relation(fields: [userId], references: [id])
  processes Process[]
}

model Process {
  id           String        @id @default(cuid())
  title        String
  type         ProcessType
  status       ProcessStatus @default(PENDENTE)
  technicianId String
  location     String
  description  String?
  priority     Priority      @default(MEDIA)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  technician Technician @relation(fields: [technicianId], references: [id])
  documents  Document[]
}

model Document {
  id         String   @id @default(cuid())
  processId  String
  name       String
  fileUrl    String
  fileSize   Int
  fileType   String
  uploadedBy String
  createdAt  DateTime @default(now())

  process Process @relation(fields: [processId], references: [id])
  user    User    @relation(fields: [uploadedBy], references: [id])
}

enum Role {
  ADMIN
  TECNICO
  VIEWER
}

enum TechnicianStatus {
  ATIVO
  INATIVO
  AFASTADO
}

enum ProcessType {
  SIMCAR
  CC_SEMA
  DAAP
  PEF
  GEORREFERENCIAMENTO
  DLA
  LAUDOS
}

enum ProcessStatus {
  PENDENTE
  EM_ANDAMENTO
  CONCLUIDO
  INATIVO
}

enum Priority {
  BAIXA
  MEDIA
  ALTA
}
```

### **🎯 FASE 5: Contextos Reais com APIs**

#### **5.1 Context com API Real**
```typescript
// contexts/processes-context-real.tsx
"use client"

import { createContext, useContext, useState, useEffect } from 'react'

interface ProcessesContextType {
  processes: Process[]
  loading: boolean
  error: string | null
  addProcess: (process: Omit<Process, 'id'>) => Promise<void>
  updateProcess: (id: string, data: Partial<Process>) => Promise<void>
  deleteProcess: (id: string) => Promise<void>
  refreshProcesses: () => Promise<void>
}

const ProcessesContext = createContext<ProcessesContextType | undefined>(undefined)

export function ProcessesProvider({ children }: { children: React.ReactNode }) {
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProcesses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/processes')
      if (!response.ok) throw new Error('Failed to fetch processes')
      const data = await response.json()
      setProcesses(data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar processos')
    } finally {
      setLoading(false)
    }
  }

  const addProcess = async (processData: Omit<Process, 'id'>) => {
    try {
      const response = await fetch('/api/processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processData)
      })
      if (!response.ok) throw new Error('Failed to create process')
      await fetchProcesses() // Refresh list
    } catch (err) {
      setError('Erro ao criar processo')
      throw err
    }
  }

  const updateProcess = async (id: string, data: Partial<Process>) => {
    try {
      const response = await fetch(`/api/processes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to update process')
      await fetchProcesses() // Refresh list
    } catch (err) {
      setError('Erro ao atualizar processo')
      throw err
    }
  }

  const deleteProcess = async (id: string) => {
    try {
      const response = await fetch(`/api/processes/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete process')
      await fetchProcesses() // Refresh list
    } catch (err) {
      setError('Erro ao deletar processo')
      throw err
    }
  }

  useEffect(() => {
    fetchProcesses()
  }, [])

  return (
    <ProcessesContext.Provider value={{
      processes,
      loading,
      error,
      addProcess,
      updateProcess,
      deleteProcess,
      refreshProcesses: fetchProcesses
    }}>
      {children}
    </ProcessesContext.Provider>
  )
}
```

---

## 🔧 **Implementação Prática - Próximos Passos**

### **📋 Checklist de Implementação**

#### **🚀 Preparação Inicial**
- [ ] Escolher stack de backend (Recomendo: Next.js + Prisma + PostgreSQL)
- [ ] Configurar banco de dados (Local/Cloud)
- [ ] Instalar dependências necessárias
- [ ] Configurar variáveis de ambiente

#### **🗄️ Database Setup**
```bash
# Instalar Prisma
npm install prisma @prisma/client
npm install -D prisma

# Configurar Prisma
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

#### **🔐 Autenticação**
```bash
# Instalar NextAuth
npm install next-auth @auth/prisma-adapter
npm install bcryptjs
npm install -D @types/bcryptjs
```

#### **📁 Upload de Arquivos**
```bash
# Para AWS S3
npm install aws-sdk

# Para Cloudinary
npm install cloudinary

# Para upload local
mkdir uploads
```

#### **🌐 APIs RESTful**
- [ ] Criar estrutura de APIs em `app/api/`
- [ ] Implementar middleware de autenticação
- [ ] Adicionar validação de dados (Zod)
- [ ] Configurar CORS e segurança

### **⚙️ Configuração de Ambiente**

#### **`.env.local`**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecoflow"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Upload (AWS S3)
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_BUCKET_NAME="ecoflow-uploads"
AWS_REGION="us-east-1"

# Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
```

---

## 🚀 **Cronograma Recomendado**

### **📅 Semana 1-2: Foundation**
- Configurar banco de dados
- Implementar schema do Prisma
- Configurar autenticação básica
- Criar APIs essenciais (CRUD)

### **📅 Semana 3-4: Core Features**
- Sistema de upload de arquivos
- Integrar contextos com APIs reais
- Implementar validações
- Testes básicos

### **📅 Semana 5-6: Advanced Features**
- Busca real com indexação
- Relatórios e dashboard
- Sistema de permissões
- Otimizações de performance

### **📅 Semana 7-8: Production Ready**
- Testes completos
- Segurança avançada
- Deploy em staging
- Documentação final

---

## 🎯 **Custos Estimados (Mensal)**

### **💰 Infraestrutura**

#### **Opção 1: Vercel + Supabase (Recomendado)**
```
Vercel Pro: $20/mês
Supabase Pro: $25/mês
Total: ~$45/mês
```

#### **Opção 2: AWS**
```
EC2 t3.small: $15/mês
RDS PostgreSQL: $25/mês  
S3 Storage: $5/mês
Total: ~$45/mês
```

#### **Opção 3: Digital Ocean**
```
Droplet 2GB: $12/mês
Managed Database: $15/mês
Spaces (S3): $5/mês
Total: ~$32/mês
```

---

## 🛡️ **Segurança e Compliance**

### **🔒 Checklist de Segurança**
- [ ] HTTPS obrigatório
- [ ] Validação server-side
- [ ] Rate limiting
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Backup automático
- [ ] Logs de auditoria

### **📋 LGPD Compliance**
- [ ] Política de privacidade
- [ ] Consentimento de dados
- [ ] Direito ao esquecimento
- [ ] Portabilidade de dados
- [ ] Log de acesso a dados pessoais

---

## 🎉 **Conclusão**

### **✅ Para Sistema Operacional Complete:**

1. **🏗️ Backend Robusto** - Database, APIs, Validação
2. **🔐 Autenticação Real** - NextAuth, Permissões, Segurança  
3. **📁 Upload de Arquivos** - AWS S3, Validação, Organização
4. **🔗 Integração APIs** - Contextos reais, Error handling
5. **🚀 Deploy Produção** - Vercel/AWS, CI/CD, Monitoramento

### **📈 ROI Esperado:**
- **Tempo de dev:** 6-8 semanas
- **Custo mensal:** $32-45
- **Capacidade:** 1000+ usuários simultâneos
- **Escalabilidade:** Infinita com cloud

### **🎯 Próximo Passo Imediato:**
**Escolher stack e configurar primeiro endpoint de API!**

Quer que eu implemente alguma dessas fases específicas agora?