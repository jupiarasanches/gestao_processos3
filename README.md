# 🌱 EcoFlow - Sistema de Gestão Ambiental

> **Versão 2.0 • Powered by AI**

Sistema moderno para gestão de processos ambientais e florestais com interface intuitiva, busca inteligente por IA e dashboard analytics.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green?style=flat-square&logo=supabase)

## 📖 Documentação Principal

### 🎯 **FONTE ÚNICA DA VERDADE**
Para uma visão completa da arquitetura, decisões técnicas e padrões do projeto: **[BASE_DO_PROJETO.md](./BASE_DO_PROJETO.md)**

### 📚 **Documentação Complementar**
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Documentação detalhada de funcionalidades
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Guia de desenvolvimento e convenções
- **[ULTIMA_ATUALIZACAO.md](./ULTIMA_ATUALIZACAO.md)** - Últimas mudanças e features
- **[ROADMAP_OPERACIONAL.md](./ROADMAP_OPERACIONAL.md)** - Roadmap de desenvolvimento

> **📝 Importante:** Sempre consulte `BASE_DO_PROJETO.md` primeiro para entender a arquitetura geral antes de mergulhar nos documentos específicos.

## 🚀 Quick Start

```bash
# Clone o repositório
git clone [url]
cd v0-saa-s-ambiental-development

# Instale dependências
npm install

# Execute em desenvolvimento
npm run dev

# Acesse: http://localhost:3000
```

## 🎯 Funcionalidades

### ✅ **Implementado**
- 🔐 **Autenticação** completa (login/cadastro/recuperação)
- 🏠 **Dashboard** moderno com métricas em tempo real
- 📋 **Gestão de processos** ambientais (SIMCAR, PEF, PRA, etc.)
- 🤖 **Busca IA** com processamento de linguagem natural
- 👥 **Gestão de técnicos** e atribuições
- 📄 **Upload de documentos** com organização
- 🎨 **Design responsivo** com tema escuro/verde

### 🚧 **Planejado**
- 📊 Analytics avançado com relatórios
- 📱 App mobile (PWA)
- 🔗 Integrações com órgãos ambientais
- 🛡️ Auditoria e compliance LGPD

### Estrutura Principal:
```
app/
├── page.tsx                 # Dashboard principal
├── login/page.tsx          # Autenticação
├── processos/page.tsx      # Gestão de processos
└── globals.css             # Tema e estilos

components/
├── ai-document-search.tsx  # Busca IA
├── auth-provider.tsx       # Autenticação
└── ui/                     # Componentes base
```

## 🎨 Screenshots

### Login Moderno
![Login](docs/login-screenshot.png)

### Dashboard Principal  
![Dashboard](docs/dashboard-screenshot.png)

### Busca IA
![AI Search](docs/ai-search-screenshot.png)

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 + React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: Supabase Authentication  
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deploy**: Vercel Ready

## 📋 Tipos de Processo

| Tipo | Descrição | Ícone | Status |
|------|-----------|-------|--------|
| **SIMCAR** | Sistema Cadastro Ambiental Rural | 🌲 | ✅ |
| **PEF** | Plano de Exploração Florestal | 🌳 | ✅ |
| **PRA** | Plano de Recuperação Ambiental | 🌿 | ✅ |
| **CC-SEMA** | Certidão Conformidade Ambiental | 📄 | ✅ |
| **DAAP** | Declaração Atividades Ambientais | 📋 | ✅ |
| **Georreferenciamento** | Levantamento Topográfico | 🗺️ | ✅ |

## 🤖 IA Features

- **Busca Semântica** em documentos
- **Extração de palavras-chave** automática
- **Análise de relevância** (scoring 0-100%)
- **Sugestões contextuais** inteligentes
- **Simulação de OCR** para PDFs

## 🔐 Autenticação

- ✅ **Login/Cadastro** com validação
- ✅ **Recuperação de senha** por e-mail  
- ✅ **Proteção de rotas** automática
- ✅ **Perfis de usuário** (admin/comum)
- ✅ **Sessões persistentes**

## 🎨 Design System

### Tema de Cores:
- **Primary**: Verde (`oklch(0.6 0.25 140)`)
- **Background**: Escuro com degradê azul → verde
- **Cards**: Glassmorphism com blur effects
- **Animations**: Hover effects e transições suaves

### Componentes:
- Cards com sombras modernas
- Botões com gradientes  
- Inputs com animações
- Modais responsivos
- Progress bars animadas

## 📱 Responsividade

- ✅ **Desktop** (1920px+)
- ✅ **Laptop** (1024px+)  
- ✅ **Tablet** (768px+)
- ✅ **Mobile** (375px+)

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor desenvolvimento
npm run build        # Build produção
npm run start        # Servidor produção
npm run lint         # Verificar código
npm run type-check   # Verificar tipos TS
```

## 📦 Dependências Principais

```json
{
  "next": "15.2.4",
  "react": "18.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "@supabase/supabase-js": "latest",
  "lucide-react": "latest"
}
```

## 🌍 Deploy

### Vercel (Recomendado):
```bash
# Conecte seu repositório no Vercel
# Configure as variáveis de ambiente
# Deploy automático a cada push
```

### Variáveis de Ambiente:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contribuição

1. **Fork** o projeto
2. **Clone** seu fork
3. **Crie** uma branch para sua feature
4. **Commit** suas mudanças
5. **Push** para a branch
6. **Abra** um Pull Request

### Convenções:
- Use **Conventional Commits**
- **TypeScript** obrigatório  
- **ESLint + Prettier** para formatação
- Testes para novas funcionalidades

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- 📧 **E-mail**: suporte@ecoflow.com.br
- 📚 **Docs**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- 🐛 **Issues**: [GitHub Issues](../../issues)
- 💬 **Discord**: [Link do Discord]

## 🧭 Processo de Manutenção da Documentação

- Sempre que houver mudanças em autenticação, schema do banco ou estrutura de pastas:
  1) Atualize primeiro a fonte única: [BASE_DO_PROJETO.md](./BASE_DO_PROJETO.md)
  2) Atualize os documentos complementares se aplicável:
     - DOCUMENTATION.md (funcionalidades detalhadas)
     - DEVELOPMENT.md (fluxos de dev e convenções)
     - ULTIMA_ATUALIZACAO.md (resumo das mudanças)
     - ROADMAP_OPERACIONAL.md (planejamento e próximos passos)
  3) Garanta que o README continua apontando para a BASE como primeira referência

- Dica: mantenha commits `docs:` agregando as alterações, e prefira PRs dedicados para mudanças estruturais + docs.

## 🏆 Roadmap

### Q1 2025
- [ ] Relatórios exportáveis (PDF/Excel)
- [ ] Integração com APIs dos órgãos
- [ ] Notificações em tempo real

### Q2 2025  
- [ ] App mobile (PWA)
- [ ] Integração com OpenAI
- [ ] Sistema de auditoria

### Q3 2025
- [ ] Dashboards personalizáveis
- [ ] Integração GIS
- [ ] Multi-tenancy

---

**Desenvolvido com ❤️ para gestão ambiental sustentável**

⭐ **Star** este repositório se foi útil!

---

*Última atualização: Janeiro 2025*