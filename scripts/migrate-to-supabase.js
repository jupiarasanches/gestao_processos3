#!/usr/bin/env node

/**
 * Script para migrar da autenticação mock para Supabase real
 * Executa as seguintes ações:
 * 1. Atualiza imports nos componentes
 * 2. Atualiza o layout para usar AuthProvider real
 * 3. Reinicia o servidor de desenvolvimento
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando migração para Supabase...\n');

// Lista de arquivos para atualizar
const filesToUpdate = [
  {
    file: 'app/layout.tsx',
    search: 'import { MockAuthProvider }',
    replace: 'import { AuthProvider }',
    description: 'Layout principal'
  },
  {
    file: 'app/layout.tsx',
    search: 'from "@/components/mock-auth-provider"',
    replace: 'from "@/components/auth-provider"',
    description: 'Import do AuthProvider'
  },
  {
    file: 'app/layout.tsx',
    search: '<MockAuthProvider>',
    replace: '<AuthProvider>',
    description: 'Componente AuthProvider'
  },
  {
    file: 'app/layout.tsx',
    search: '</MockAuthProvider>',
    replace: '</AuthProvider>',
    description: 'Fechamento AuthProvider'
  },
  {
    file: 'app/login/page.tsx',
    search: 'from "@/components/mock-auth-provider"',
    replace: 'from "@/components/auth-provider"',
    description: 'Login - Import AuthProvider'
  },
  {
    file: 'app/dashboard/page.tsx',
    search: 'from "@/components/mock-auth-provider"',
    replace: 'from "@/components/auth-provider"',
    description: 'Dashboard - Import AuthProvider'
  },
  {
    file: 'components/app-sidebar.tsx',
    search: 'from "@/components/mock-auth-provider"',
    replace: 'from "@/components/auth-provider"',
    description: 'Sidebar - Import AuthProvider'
  },
  {
    file: 'components/protected-route.tsx',
    search: 'from "@/components/mock-auth-provider"',
    replace: 'from "@/components/auth-provider"',
    description: 'ProtectedRoute - Import AuthProvider'
  }
];

let updatedFiles = 0;
let errors = 0;

// Função para atualizar um arquivo
function updateFile(fileInfo) {
  const filePath = path.join(process.cwd(), fileInfo.file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Arquivo não encontrado: ${fileInfo.file}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes(fileInfo.search)) {
      content = content.replace(new RegExp(fileInfo.search, 'g'), fileInfo.replace);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${fileInfo.description} - ${fileInfo.file}`);
      updatedFiles++;
    } else {
      console.log(`ℹ️  Já atualizado: ${fileInfo.file}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${fileInfo.file}:`, error.message);
    errors++;
  }
}

// Verificar se as variáveis de ambiente estão configuradas
console.log('🔍 Verificando configuração...');

const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  Arquivo .env.local não encontrado!');
  console.log('📝 Crie o arquivo .env.local com suas credenciais do Supabase:');
  console.log('');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://[seu-id].supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ[sua-chave]');
  console.log('');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('NEXT_PUBLIC_SUPABASE_URL') || !envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
  console.log('⚠️  Configuração incompleta no .env.local!');
  console.log('📝 Verifique se as seguintes variáveis estão definidas:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('');
  process.exit(1);
}

console.log('✅ Configuração encontrada!');
console.log('');

// Executar atualizações
console.log('📝 Atualizando arquivos...');
filesToUpdate.forEach(updateFile);

console.log('');
console.log('📊 Resumo da migração:');
console.log(`✅ Arquivos atualizados: ${updatedFiles}`);
console.log(`❌ Erros: ${errors}`);

if (errors === 0) {
  console.log('');
  console.log('🎉 Migração concluída com sucesso!');
  console.log('');
  console.log('📋 Próximos passos:');
  console.log('1. Execute os scripts SQL no Supabase (ver scripts/supabase-setup.md)');
  console.log('2. Reinicie o servidor: npm run dev');
  console.log('3. Teste o login com: admin@ecoflow.com / 123456');
  console.log('');
} else {
  console.log('');
  console.log('⚠️  Migração concluída com erros. Verifique os problemas acima.');
  console.log('');
  process.exit(1);
}