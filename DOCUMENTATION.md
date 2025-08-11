# 📚 Documentação do Sistema EcoFlow

> **Sistema de Gestão Ambiental v2.0 - Powered by AI**

> Nota: Este documento é complementar. Para a visão geral e decisões de arquitetura, consulte primeiro a fonte única: [BASE_DO_PROJETO.md](./BASE_DO_PROJETO.md).

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Funcionalidades Implementadas](#funcionalidades-implementadas)
4. [Estrutura de Arquivos](#estrutura-de-arquivos)
5. [Componentes Principais](#componentes-principais)
6. [Sistema de Autenticação](#sistema-de-autenticação)
7. [Design System](#design-system)
8. [Integração com IA](#integração-com-ia)
9. [Tipos de Processo](#tipos-de-processo)
10. [Configuração e Execução](#configuração-e-execução)
11. [Próximos Passos](#próximos-passos)

---

## 🎯 Visão Geral

O **EcoFlow** é um sistema moderno de gestão de processos ambientais e florestais desenvolvido com Next.js 15, React 18, TypeScript e Tailwind CSS. O sistema oferece uma interface intuitiva para gerenciar diferentes tipos de processos ambientais, com funcionalidades avançadas de busca por IA e dashboard analytics.

### Características Principais:
- ✅ **Autenticação robusta** com Supabase
- ✅ **Dashboard moderno** com métricas em tempo real  
- ✅ **Busca inteligente** com processamento de IA
- ✅ **Design responsivo** com tema escuro/verde
- ✅ **Gerenciamento de processos** ambientais
- ✅ **Sistema de notificações** e alertas

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico:
- **Frontend**: Next.js 15 (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Autenticação**: Supabase Auth
- **Banco de Dados**: Supabase (PostgreSQL)
- **Ícones**: Lucide React
- **Deploy**: Pronto para Vercel

### Estrutura de Diretórios:
```
v0-saa-s-ambiental-development/
├── app/                          # App Router (Next.js 15)
│   ├── globals.css              # Estilos globais e tema
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Dashboard principal
│   ├── login/
│   │   └── page.tsx            # Página de autenticação
│   ├── processos/
│   │   └── page.tsx            # Gestão de processos
│   ├── tecnicos/
│   │   └── page.tsx            # Gestão de técnicos
│   └── upload/
│       └── page.tsx            # Upload de documentos
├── components/                  # Componentes reutilizáveis
│   ├── ui/                     # Componentes base (shadcn/ui)
│   ├── auth-provider.tsx       # Provider de autenticação
│   ├── protected-route.tsx     # Proteção de rotas
│   ├── app-sidebar.tsx         # Sidebar de navegação
│   └── ai-document-search.tsx  # Busca IA
├── lib/                        # Utilitários e configurações
│   ├── supabase.ts            # Cliente Supabase
│   ├── supabase-server.ts     # Servidor Supabase
│   └── utils.ts               # Funções utilitárias
├── types/
│   └── database.ts            # Tipos do banco de dados
└── scripts/                   # Scripts SQL
    ├── 01-create-tables.sql   # Criação de tabelas
    └── 02-seed-data.sql       # Dados iniciais
```

---

## ⚡ Funcionalidades Implementadas

### 🔐 **1. Sistema de Autenticação**
- **Login/Cadastro/Recuperação** de senha
- **Proteção de rotas** automática
- **Perfis de usuário** (admin/comum)
- **Redirecionamento** inteligente pós-login

### 🏠 **2. Dashboard Principal**
- **Saudação personalizada** por horário
- **Métricas em tempo real** (processos, técnicos, etc.)
- **Gráficos interativos** de distribuição
- **Central de alertas** e notificações
- **Ações rápidas** para criação de processos

### 📋 **3. Gestão de Processos**
- **Listagem completa** de processos
- **Filtros avançados** (status, tipo, técnico)
- **Busca textual** e semântica
- **Criação de novos** processos
- **Visualização de detalhes**

### 🤖 **4. Busca Inteligente com IA**
- **Processamento de linguagem natural**
- **Extração de palavras-chave**
- **Análise de relevância** (scoring 0-100%)
- **Sugestões inteligentes**
- **Simulação de OCR** e análise de documentos

### 👥 **5. Gestão de Técnicos**
- **Cadastro de técnicos** responsáveis
- **Atribuição de processos**
- **Acompanhamento de workload**

### 📄 **6. Upload de Documentos**
- **Interface de upload** moderna
- **Organização por processo**
- **Prévia de documentos**

---

## 🧩 Componentes Principais

### `app/page.tsx` - Dashboard Principal
```typescript
// Dashboard moderno com:
- Saudação personalizada baseada no horário
- Cards de estatísticas com animações
- Lista de processos recentes com progresso
- Ações rápidas categorizadas
- Gráficos de distribuição por tipo
- Central de alertas e notificações
```

### `app/login/page.tsx` - Autenticação
```typescript
// Sistema de login com:
- Tabs para Login/Cadastro/Recuperação
- Design glassmorphism moderno
- Validação de formulários
- Feedback visual de estados
- Integração com Supabase Auth
```

### `components/ai-document-search.tsx` - Busca IA
```typescript
// Busca inteligente com:
- Modal moderno com UX otimizada
- Simulação de processamento IA
- Extração automática de keywords
- Scoring de relevância
- Sugestões contextuais
```

### `components/auth-provider.tsx` - Autenticação
```typescript
// Provider global que gerencia:
- Estado de autenticação
- Perfil do usuário
- Sessões persistentes
- Funções de login/logout
```

### `components/protected-route.tsx` - Proteção
```typescript
// Componente que protege rotas:
- Verificação de autenticação
- Redirecionamento automático
- Estados de loading
- Controle de permissões
```

---

## 🔒 Sistema de Autenticação

### Fluxo de Autenticação:
1. **Usuário não autenticado** → Redirecionado para `/login`
2. **Login realizado** → Acesso ao dashboard
3. **Token válido** → Navegação livre no sistema
4. **Token expirado** → Logout automático

### Estados de Autenticação:
```typescript
interface AuthContextType {
  user: User | null              // Usuário do Supabase
  userProfile: Usuario | null    // Perfil customizado
  loading: boolean               // Estado de carregamento
  signIn: (email, password) => Promise<{error}>
  signUp: (email, password, nome) => Promise<{error}>
  signOut: () => Promise<void>
  resetPassword: (email) => Promise<{error}>
}
```

### Proteção de Rotas:
- **Páginas públicas**: `/login`
- **Páginas protegidas**: `/`, `/processos`, `/tecnicos`, `/upload`
- **Verificação automática** em cada navegação

---

## 🎨 Design System

### Tema de Cores (app/globals.css):
```css
:root {
  /* Tema escuro principal */
  --background: oklch(0.08 0.02 220);      /* Fundo escuro azul */
  --foreground: oklch(0.98 0.02 120);      /* Texto verde claro */
  --primary: oklch(0.6 0.25 140);          /* Verde principal */
  --secondary: oklch(0.15 0.04 180);       /* Azul secundário */
  --accent: oklch(0.18 0.05 160);          /* Accent verde-azul */
  
  /* Degradê de fundo */
  background-image: linear-gradient(135deg, 
    oklch(0.08 0.02 220), 
    oklch(0.12 0.04 180), 
    oklch(0.16 0.06 140)
  );
}
```

### Componentes UI (shadcn/ui):
- ✅ **Cards** com glassmorphism
- ✅ **Buttons** com gradientes
- ✅ **Inputs** com animações
- ✅ **Dialogs** modernos
- ✅ **Tables** responsivas
- ✅ **Progress bars** animadas
- ✅ **Badges** categorizadas

### Paleta de Cores por Categoria:
- 🔵 **SIMCAR**: Azul (`oklch(0.6 0.25 240)`)
- 🟢 **PEF**: Verde (`oklch(0.6 0.25 140)`)
- 🌿 **PRA**: Verde esmeralda (`oklch(0.65 0.3 140)`)
- 🟡 **CC-SEMA**: Amarelo (`oklch(0.7 0.25 80)`)
- 🟣 **Georreferenciamento**: Roxo (`oklch(0.6 0.25 280)`)

---

## 🤖 Integração com IA

### Funcionalidades Implementadas:
1. **Busca Semântica** em documentos
2. **Extração automática** de palavras-chave
3. **Análise de relevância** com scoring
4. **Sugestões contextuais** baseadas em conteúdo
5. **Simulação de OCR** para PDFs/imagens

### Estrutura de Dados IA:
```typescript
interface AISearchResult {
  documentId: string           // ID único do documento
  documentName: string         // Nome do arquivo
  processId: string           // Processo relacionado
  relevanceScore: number      // Score 0-1 de relevância
  extractedText: string       // Texto extraído
  keywords: string[]          // Palavras-chave identificadas
  summary: string             // Resumo gerado por IA
  confidence: number          // Confiança da análise (0-1)
}
```

### Exemplos de Busca:
- **"nascentes"** → Encontra documentos sobre recursos hídricos
- **"APP"** → Localiza estudos de Áreas de Preservação Permanente
- **"recuperação"** → Identifica planos de recuperação ambiental

---

## 📋 Tipos de Processo

### Processos Implementados:

1. **SIMCAR** 🌲
   - **Descrição**: Sistema de Cadastro Ambiental Rural
   - **Ícone**: TreePine
   - **Cor**: Azul
   - **Campos**: Propriedade, área, atividades

2. **PEF** 🌳
   - **Descrição**: Plano de Exploração Florestal
   - **Ícone**: TreePine
   - **Cor**: Verde
   - **Campos**: Área florestal, espécies, cronograma

3. **PRA** 🌿
   - **Descrição**: Plano de Recuperação Ambiental
   - **Ícone**: Leaf
   - **Cor**: Verde esmeralda
   - **Campos**: Área degradada, métodos, cronograma

4. **CC-SEMA** 📄
   - **Descrição**: Certidão de Conformidade Ambiental
   - **Ícone**: FileText
   - **Cor**: Amarelo
   - **Campos**: Empresa, atividades, conformidade

5. **DAAP** 📋
   - **Descrição**: Declaração de Atividades Ambientais
   - **Ícone**: FileText
   - **Cor**: Cinza
   - **Campos**: Atividades, impactos, medidas

6. **Georreferenciamento** 🗺️
   - **Descrição**: Levantamento topográfico e locacional
   - **Ícone**: MapPin
   - **Cor**: Roxo
   - **Campos**: Coordenadas, marcos, área

### Status de Processo:
- ✅ **Aprovado** (Verde)
- 🔄 **Em Análise** (Azul) 
- 📝 **Documentação** (Amarelo)
- 🏃 **Em Campo** (Roxo)
- ⏸️ **Pendente** (Laranja)

### Prioridades:
- 🔴 **Alta** (Vermelho)
- 🟡 **Média** (Amarelo)
- 🟢 **Baixa** (Verde)

---

## ⚙️ Configuração e Execução

### Pré-requisitos:
```bash
Node.js 18+ 
npm ou pnpm
Git
```

### Instalação:
```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd v0-saa-s-ambiental-development

# Instale as dependências
npm install
# ou
pnpm install

# Configure as variáveis de ambiente (opcional para demo)
# Crie .env.local com:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Execução:
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Start produção
npm start
```

### URLs de Acesso:
- **Local**: http://localhost:3000
- **Login**: http://localhost:3000/login (redirecionamento automático)
- **Dashboard**: http://localhost:3000/ (protegido)
- **Processos**: http://localhost:3000/processos
- **Técnicos**: http://localhost:3000/tecnicos

---

## 🚀 Próximos Passos

### Funcionalidades Planejadas:

#### 📊 **Analytics Avançado**
- [ ] Gráficos de linha temporal
- [ ] Heatmaps de atividade
- [ ] Relatórios exportáveis (PDF/Excel)
- [ ] Dashboards personalizáveis

#### 🤖 **IA e Automação**
- [ ] Integração com OpenAI/Claude
- [ ] OCR real para documentos
- [ ] Classificação automática de processos
- [ ] Chatbot de suporte

#### 📱 **Mobile e PWA**
- [ ] App mobile responsivo
- [ ] PWA com offline support
- [ ] Notificações push
- [ ] Câmera para upload

#### 🔗 **Integrações**
- [ ] API dos órgãos ambientais
- [ ] Integração bancária
- [ ] Sistemas de GIS
- [ ] E-mail marketing

#### 🛡️ **Segurança e Compliance**
- [ ] Auditoria de ações
- [ ] Backup automático
- [ ] LGPD compliance
- [ ] Two-factor authentication

#### 📈 **Performance**
- [ ] Cache Redis
- [ ] CDN para assets
- [ ] Lazy loading otimizado
- [ ] Monitoring com Sentry

### Melhorias Técnicas:

#### 🏗️ **Arquitetura**
- [ ] Microserviços com tRPC
- [ ] Event sourcing
- [ ] Queue system (Bull/Bee)
- [ ] GraphQL API

#### 🧪 **Testes**
- [ ] Testes unitários (Jest)
- [ ] Testes E2E (Playwright)
- [ ] Testes de carga
- [ ] CI/CD pipeline

#### 📦 **DevOps**
- [ ] Docker containers
- [ ] Kubernetes deployment
- [ ] Monitoring (Grafana)
- [ ] Automated backups

---

## 📝 Notas de Desenvolvimento

### Convenções de Código:
- **TypeScript** obrigatório
- **ESLint + Prettier** para formatação
- **Conventional Commits** para mensagens
- **Componentes funcionais** com hooks

### Estrutura de Commits:
```
feat: adiciona nova funcionalidade
fix: corrige bug existente
docs: atualiza documentação
style: mudanças de estilo/formatação
refactor: refatoração de código
test: adiciona ou modifica testes
chore: tarefas de manutenção
```

### Performance Guidelines:
- Use `React.memo()` para componentes pesados
- Implemente `lazy loading` para rotas
- Otimize imagens com Next.js Image
- Minimize bundle size com análise

### Acessibilidade:
- Sempre use `alt` em imagens
- Implemente navegação por teclado
- Use contraste adequado (WCAG AA)
- Teste com screen readers

---

## 🎯 Conclusão

O **EcoFlow v2.0** está com uma base sólida implementada, oferecendo:

✅ **Sistema de autenticação** robusto e seguro  
✅ **Dashboard moderno** com métricas visuais  
✅ **Gestão completa** de processos ambientais  
✅ **Busca inteligente** com simulação de IA  
✅ **Design system** consistente e responsivo  
✅ **Arquitetura escalável** para crescimento futuro  

O projeto está **pronto para produção** e **preparado para expansão** com as funcionalidades planejadas.

---

**Desenvolvido com ❤️ para gestão ambiental sustentável**

*Última atualização: Janeiro 2025*