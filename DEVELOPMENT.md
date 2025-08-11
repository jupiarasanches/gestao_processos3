# 🛠️ Guia de Desenvolvimento - EcoFlow

> **Instruções detalhadas para desenvolvedores**
>
> Nota: Este documento é complementar. Para a visão geral e decisões de arquitetura, consulte primeiro a fonte única: [BASE_DO_PROJETO.md](./BASE_DO_PROJETO.md).

## 📋 Índice

1. [Setup do Ambiente](#setup-do-ambiente)
2. [Convenções de Código](#convenções-de-código)
3. [Estrutura de Componentes](#estrutura-de-componentes)
4. [Padrões de Design](#padrões-de-design)
5. [Testes](#testes)
6. [Deploy](#deploy)
7. [Troubleshooting](#troubleshooting)

---

## ⚙️ Setup do Ambiente

### Pré-requisitos
```bash
Node.js 18.0.0+
npm 9.0.0+ ou pnpm 8.0.0+
Git 2.34.0+
VS Code (recomendado)
```

### Instalação Completa
```bash
# 1. Clone o repositório
git clone [URL_DO_REPO]
cd v0-saa-s-ambiental-development

# 2. Instale dependências
npm install
# ou para melhor performance:
pnpm install

# 3. Configure VS Code (opcional)
code .
# Instale as extensões recomendadas quando solicitado

# 4. Execute em desenvolvimento
npm run dev

# 5. Acesse no browser
open http://localhost:3000
```

### Variáveis de Ambiente
```bash
# .env.local (opcional para demo)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Para desenvolvimento local sem Supabase:
# O sistema funciona com valores mock se não configurado
```

---

## 📝 Convenções de Código

### TypeScript
```typescript
// ✅ CORRETO: Use tipos explícitos
interface ProcessProps {
  id: string
  title: string
  status: ProcessStatus
  onUpdate: (id: string) => void
}

// ❌ EVITE: any ou tipos implícitos
const component = (props: any) => { ... }
```

### Nomenclatura
```typescript
// ✅ Componentes: PascalCase
const ProcessCard = () => { ... }

// ✅ Variáveis/funções: camelCase
const handleProcessUpdate = () => { ... }

// ✅ Constantes: UPPER_SNAKE_CASE
const MAX_PROCESSES_PER_PAGE = 50

// ✅ Arquivos: kebab-case
// process-card.tsx, ai-document-search.tsx
```

### Estrutura de Componentes
```typescript
"use client" // Se necessário

import type React from "react"
import { useState, useEffect } from "react"

// Imports externos
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Imports internos
import { useAuth } from "@/components/auth-provider"
import { ProcessType } from "@/types/database"

// Tipos/Interfaces
interface ComponentProps {
  title: string
  children: React.ReactNode
}

// Componente principal
export default function Component({ title, children }: ComponentProps) {
  // Estados
  const [loading, setLoading] = useState(false)
  
  // Hooks
  const { user } = useAuth()
  
  // Effects
  useEffect(() => {
    // lógica do effect
  }, [])
  
  // Funções auxiliares
  const handleAction = () => {
    // lógica da função
  }
  
  // Early returns
  if (loading) return <div>Loading...</div>
  
  // Render principal
  return (
    <Card>
      <h1>{title}</h1>
      {children}
    </Card>
  )
}
```

### Commits Convencionais
```bash
# Tipos permitidos:
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Apenas documentação
style:    Formatação, sem mudança de código
refactor: Refatoração sem nova funcionalidade
test:     Adição/modificação de testes
chore:    Tarefas de manutenção

# Exemplos:
git commit -m "feat: adiciona busca IA em documentos"
git commit -m "fix: corrige redirecionamento após login"
git commit -m "docs: atualiza README com instruções de deploy"
```

---

## 🧩 Estrutura de Componentes

### Hierarquia de Pastas
```
components/
├── ui/                     # Componentes base (shadcn/ui)
│   ├── button.tsx         # Componente Button reutilizável
│   ├── card.tsx           # Componente Card base
│   └── input.tsx          # Input com validações
├── auth-provider.tsx      # Context de autenticação
├── protected-route.tsx    # HOC para proteção
├── app-sidebar.tsx        # Navegação lateral
└── ai-document-search.tsx # Feature específica
```

### Componentes UI Base
```typescript
// components/ui/button.tsx
import { cn } from "@/lib/utils"

interface ButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export const Button = ({ 
  variant = "default", 
  size = "md",
  className,
  children,
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-colors",
        // Variantes
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "outline" && "border border-border bg-transparent",
        // Tamanhos
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2",
        size === "lg" && "px-6 py-3 text-lg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

### Context Providers
```typescript
// components/auth-provider.tsx
interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{error: any}>
  signOut: () => Promise<void>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estado e lógica do provider
  const value = { user, loading, signIn, signOut }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
```

---

## 🎨 Padrões de Design

### Sistema de Cores
```css
/* app/globals.css */
:root {
  /* Cores principais */
  --primary: oklch(0.6 0.25 140);        /* Verde principal */
  --secondary: oklch(0.15 0.04 180);     /* Azul secundário */
  --background: oklch(0.08 0.02 220);    /* Fundo escuro */
  --foreground: oklch(0.98 0.02 120);    /* Texto claro */
  
  /* Estados */
  --success: oklch(0.6 0.25 140);        /* Verde sucesso */
  --warning: oklch(0.7 0.25 80);         /* Amarelo aviso */
  --error: oklch(0.5 0.22 25);           /* Vermelho erro */
  
  /* Transparências */
  --overlay: oklch(0.08 0.02 220 / 0.8); /* Overlay modal */
}
```

### Componentes com Tema
```typescript
// Cores por categoria de processo
const processColors = {
  SIMCAR: "bg-blue-50 text-blue-800 border-blue-200",
  PEF: "bg-green-50 text-green-800 border-green-200",
  PRA: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "CC-SEMA": "bg-yellow-50 text-yellow-800 border-yellow-200",
  DAAP: "bg-gray-50 text-gray-800 border-gray-200",
  Georreferenciamento: "bg-purple-50 text-purple-800 border-purple-200"
} as const

// Uso em componente
const ProcessBadge = ({ type }: { type: keyof typeof processColors }) => (
  <span className={cn("px-2 py-1 rounded-md text-xs", processColors[type])}>
    {type}
  </span>
)
```

### Animações
```css
/* Transições padrão */
.transition-smooth {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Loading animations */
.animate-pulse-slow {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Responsividade
```typescript
// Breakpoints Tailwind
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Ultra wide
}

// Grid responsivo
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

---

## 🧪 Testes

### Estrutura de Testes (Planejado)
```
__tests__/
├── components/
│   ├── auth-provider.test.tsx
│   └── ui/
│       ├── button.test.tsx
│       └── card.test.tsx
├── pages/
│   ├── login.test.tsx
│   └── dashboard.test.tsx
└── utils/
    └── auth.test.tsx
```

### Testes de Componente
```typescript
// __tests__/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Testes E2E
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can login successfully', async ({ page }) => {
  await page.goto('/login')
  
  await page.fill('[data-testid=email]', 'test@example.com')
  await page.fill('[data-testid=password]', 'password123')
  await page.click('[data-testid=login-button]')
  
  await expect(page).toHaveURL('/')
  await expect(page.locator('h1')).toContainText('Dashboard')
})
```

---

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# 1. Instale Vercel CLI
npm i -g vercel

# 2. Faça login
vercel login

# 3. Deploy
vercel

# 4. Configure domínio customizado (opcional)
vercel domains add yourdomain.com
```

### Docker (Alternativo)
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Variables de Ambiente (Produção)
```bash
# Vercel Dashboard ou .env.production
NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_anon_key
DATABASE_URL=postgresql://prod_url
NEXTAUTH_SECRET=prod_secret_key
NEXTAUTH_URL=https://yourdomain.com
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de Hydration
```bash
# Sintoma: Warning: Text content did not match
# Causa: Diferença entre server e client rendering
# Solução: Use useEffect para código client-only

const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null
```

#### 2. Supabase Connection Error
```bash
# Sintoma: "supabaseUrl is required"
# Causa: Variáveis de ambiente não configuradas
# Solução: Configure .env.local ou use valores default
```

#### 3. Build Errors
```bash
# Limpar cache e reinstalar
rm -rf .next node_modules
npm install
npm run build
```

#### 4. TypeScript Errors
```bash
# Verificar tipos
npm run type-check

# Regenerar tipos Supabase
npx supabase gen types typescript --project-id YOUR_PROJECT_ID
```

### Debugging

#### VS Code Launch Config
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

#### Console Debugging
```typescript
// Use apenas em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', { user, processes })
}

// Para componentes
const DebugInfo = ({ data }: any) => {
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <pre className="text-xs bg-gray-100 p-2 rounded">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}
```

---

## 📚 Recursos Adicionais

### VS Code Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag"
  ]
}
```

### Scripts Úteis
```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "clean": "rm -rf .next node_modules"
  }
}
```

### Links Úteis
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)
- [Lucide Icons](https://lucide.dev)

---

**Happy Coding! 🚀**

*Mantenha este guia atualizado conforme o projeto evolui.*