# 🚀 Guia de Configuração do Supabase

## 📋 Checklist de Configuração

### ✅ 1. Criar Projeto no Supabase
1. Acesse: https://app.supabase.com
2. Clique em "New Project"
3. Configure:
   - **Nome:** `gestao-processos-ambientais`
   - **Senha:** [CRIE UMA SENHA FORTE]
   - **Região:** `South America (São Paulo)`
   - **Plano:** `Free`
4. Aguarde ~2 minutos

### ✅ 2. Obter Credenciais
No painel do Supabase:
1. Vá para **Settings → API**
2. Copie:
   - **Project URL:** `https://[seu-id].supabase.co`
   - **Anon Key:** `eyJ...`

### ✅ 3. Configurar Variáveis de Ambiente
Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[SEU-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ[SUA-ANON-KEY]
```

### ✅ 4. Executar Scripts SQL
No **SQL Editor** do Supabase:

#### 4.1. Primeiro Script (Criar Tabelas)
```sql
-- Copie e cole todo o conteúdo de: scripts/01-create-tables.sql
```

#### 4.2. Segundo Script (Dados Iniciais)
```sql
-- Copie e cole todo o conteúdo de: scripts/02-seed-data.sql
```

### ✅ 5. Configurar Autenticação
No painel do Supabase:
1. Vá para **Authentication → Settings**
2. Configure:
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** `http://localhost:3000/auth/callback`

### ✅ 6. Atualizar Código
Execute no terminal:
```bash
# Parar o servidor atual (Ctrl+C)
# Depois reiniciar
npm run dev
```

### ✅ 7. Migrar de Mock para Real
Execute o script de migração:
```bash
npm run migrate-to-supabase
```

## 🧪 Credenciais de Teste
Após executar os scripts SQL, você pode usar:
- **Admin:** `admin@ecoflow.com` / `123456`
- **Usuário:** `usuario@ecoflow.com` / `123456`

## 🔧 Troubleshooting

### Erro "supabaseUrl is required"
- Verifique se o arquivo `.env.local` está na raiz
- Confirme que as variáveis estão corretas
- Reinicie o servidor (`Ctrl+C` + `npm run dev`)

### Erro de conexão
- Verifique se o projeto Supabase está ativo
- Confirme a URL e chave no painel do Supabase
- Teste a conexão no SQL Editor

### Tabelas não criadas
- Execute os scripts SQL na ordem correta
- Verifique se não há erros no SQL Editor
- Confirme que as tabelas aparecem em "Table Editor"

## 📞 Suporte
Se encontrar problemas, envie:
1. Mensagem de erro completa
2. Conteúdo do arquivo `.env.local` (sem as chaves)
3. Screenshot do painel do Supabase