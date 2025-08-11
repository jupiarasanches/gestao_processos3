# Base do Projeto – Gestão de Processos Ambientais

Este documento consolida o que já foi implementado até aqui e define uma base única de referência para manutenção e evolução do sistema. Use-o como guia de arquitetura, decisões técnicas, fluxos principais e checklists operacionais.

## 1) Objetivo e Escopo
- Plataforma para gestão de processos ambientais (protocolos, documentos, prazos, técnicos). 
- Suporta cadastro/consulta de processos por tipo (SIMCAR, CC‑SEMA, DAAP, DLA, PEF, Georreferenciamento), gestão de técnicos, upload/organização de documentos, dashboards e relatórios.

## 2) Visão Geral da Arquitetura
- Frontend: Next.js 15 (App Router) + React 18 + TypeScript.  
- UI/UX: Tailwind CSS (v4), shadcn/ui (Radix), Lucide Icons, Sonner (toasts), Framer Motion (animações/transições).  
- Estado/Contexto: Contexts para Processos, Técnicos e Tema (Theme).  
- Autenticação: MockAuthProvider em uso atual no layout; pronto para migração a Supabase Auth.  
- Persistência: Supabase (PostgreSQL) com cliente no browser e cliente server-side (service role) já preparados.  
- Tipagem: Modelos tipados em `types/database.ts` para tabelas públicas.

## 3) Estrutura de Pastas (resumo funcional)
- `app/`: páginas e rotas (App Router). Destaques:  
  - `login/`, `dashboard/`, `processos/` (subseções por tipo), `tecnicos/`, `upload/`, `relatorios/`, `configuracoes/`, `reset-password/`.
- `components/`: componentes reutilizáveis (UI base shadcn/ui, layout/Sidebar, diálogos, busca, auth/provider, proteção de rotas, animações, etc.).
- `contexts/`: providers de estado (processos, técnicos, tema). 
- `lib/`: integrações utilitárias (Supabase, utils). 
- `scripts/`: SQL (criação/seed) e utilitários (migração para Supabase real). 
- `types/`: tipagem do banco (interfaces e aliases de tipos). 

## 4) Autenticação e Autorização
- Atual: `MockAuthProvider` para fluxo de desenvolvimento sem backend. 
- Planejado/Pronto: `AuthProvider` com Supabase Auth: 
  - Ações: `signIn`, `signUp` (cria registro em `usuarios`), `signOut`, `resetPassword` (via Supabase). 
  - Cliente: `getSupabaseClient()` no client; `supabaseServer` para server-side (service role). 
- Transição facilitada por `scripts/migrate-to-supabase.js`, que ajusta imports/uso do provider real. 
- Proteção de rotas: componente `protected-route.tsx` disponível para gating de páginas (quando necessário).

## 5) Modelagem de Dados (resumo)
Tipagem centralizada em `types/database.ts` com tabelas públicas:
- `usuarios`: perfil básico (id, nome, email, perfil: admin|comum). 
- `tecnicos`: cadastro operacional (nome, registro, contato, especialidade, status: ativo|inativo|ferias|em_campo, localização). 
- `processos`: núcleo do domínio (número, data, tipo de serviço, cliente, status, prioridade, expiração, técnico responsável, descrição).
- `documentos`: metadados de arquivos (nome, tipo, tamanho, data, processo_id, url_arquivo). 

Observações:
- Enums tipados evitam estados inválidos no front. 
- Campos `created_at`/`updated_at` presentes para auditoria e ordenação. 

## 6) Principais Fluxos Funcionais
- Login/Signup/Logout/Reset: via Provider (atual mock, pronto para Supabase). No signup, cria-se registro em `usuarios` com perfil padrão `comum`. 
- Gestão de Técnicos: listagem, criação/edição via diálogos, métricas de equipe (ativos, em campo, férias, inativos) e eficiência média (UI). 
- Gestão de Processos: listagem por tipo, filtros de status/prioridade, criação/edição, cards/estatísticas. 
- Documentos: upload e vinculação a processos, visualização por processo. 
- Dashboard/Relatórios: visão geral com KPIs e gráficos (Recharts) e páginas específicas para relatórios. 

Nota: enquanto a migração para Supabase não é finalizada, dados podem estar em memória (contexts) ou mockados para UI/UX; a tipagem já antecipa o esquema real. 

## 7) Integração com Supabase
- Variáveis de ambiente: 
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (cliente). 
  - `SUPABASE_SERVICE_ROLE_KEY` (apenas server-side). 
- Clientes: 
  - `lib/supabase.ts`: singleton para client-side, com fallback de URL local (apenas dev). 
  - `lib/supabase-server.ts`: cliente com service role para rotinas server-side (não expor em client). 
- Setup/seed: `scripts/01-create-tables.sql` e `scripts/02-seed-data.sql`. Guia detalhado em `scripts/supabase-setup.md`. 

Boas práticas: nunca commitar chaves; usar `.env.local` em dev; revisar políticas RLS e permissões ao ativar tabelas reais. 

## 8) Convenções de Código
- TypeScript estrito, alias `@/*` (ver `tsconfig.json`). 
- Componentização: priorizar shadcn/ui, Radix e componentes locais em `components/ui`. 
- Estilo: Tailwind 4; classes utilitárias; transições/temas com providers. 
- Formulários: `react-hook-form` + `zod` para validação (quando necessário). 
- Padrões de pasta: páginas em `app/`, componentes reutilizáveis em `components/`, integrações em `lib/`, estado em `contexts/`. 
- Logs: evitar logs em produção; concentrar mensagens de debug sob `NODE_ENV=development`. 

## 9) Ambientes (dev/test/prod)
- Dev: `npm run dev`, `.env.local`, mocks habilitados quando necessário. 
- Test: replicar ambiente com base em variáveis separadas; apontar para um projeto Supabase de staging. 
- Prod: provisionar Supabase, configurar URLs/redirects de Auth, RLS e policies, e CI/CD (ex.: Vercel). 

## 10) Scripts e Automatizações
- `scripts/migrate-to-supabase.js`: migra layout e imports do MockAuth para Auth real. 
- SQLs: `01-create-tables.sql` (schema) e `02-seed-data.sql` (dados iniciais). 
- Comandos principais: `dev`, `build`, `start`, `lint`. 

## 11) Roadmap (curto prazo sugerido)
- Conectar páginas de Técnicos e Processos ao Supabase (CRUD completo). 
- Upload de documentos em storage (Supabase Storage) e vínculo na tabela `documentos`. 
- Substituir MockAuth pelo Auth real (usar script de migração e revisar layout/protected routes). 
- Testes: unitários (Jest) e e2e (Cypress) para fluxos críticos. 
- Observabilidade: tratar erros com toasts e logging controlado; boundary de erro para páginas. 

## 12) Checklist de Onboarding (novo dev)
1. `npm install` 
2. Criar `.env.local` com chaves do Supabase (ver `scripts/supabase-setup.md`). 
3. Executar SQLs de criação e seed no Supabase. 
4. `npm run dev` e acessar `http://localhost:3000`. 
5. Validar login e navegação pelas seções e fluxos principais. 

---

Última revisão: gerar esta base a partir do estado atual do repositório. Atualize este documento a cada mudança estrutural relevante (ex.: adoção do Auth real, alterações de schema, novas páginas/fluxos).