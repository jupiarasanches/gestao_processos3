# Pull Request Template

## 📋 Descrição das Mudanças

<!-- Descreva de forma clara e objetiva o que foi implementado/alterado -->

### Tipo de Mudança
<!-- Marque com `x` o que se aplica -->
- [ ] Bug fix (correção que soluciona um problema)
- [ ] Feature (nova funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Refatoração (melhoria de código sem mudança funcional)
- [ ] Documentação
- [ ] Configuração/Setup

### Mudanças Específicas
<!-- Marque com `x` se alguma dessas áreas foi modificada -->
- [ ] **Autenticação** (providers, contextos, login/logout)
- [ ] **Schema de banco de dados** (types/database.ts, tabelas, relacionamentos)
- [ ] **Estrutura de pastas** (novos diretórios, reorganização)
- [ ] **Configuração de build/deploy** (package.json, next.config, etc.)

## ✅ Checklist de Documentação

### 📚 Atualização da BASE_DO_PROJETO.md
<!-- OBRIGATÓRIO se marcou algum item em "Mudanças Específicas" acima -->
- [ ] **Se alterou auth, schema ou estrutura**: Atualizei a [BASE_DO_PROJETO.md](../BASE_DO_PROJETO.md)
- [ ] **Se não se aplica**: Confirmo que não há mudanças estruturais que exijam atualização da base

### 📖 Documentação Complementar
- [ ] Atualizei documentação complementar relevante (se necessário)
- [ ] Adicionei/atualizei comentários no código (se necessário)

## 🧪 Testes

### Checklist de Validação
- [ ] Testei as mudanças localmente
- [ ] Verifique que não há breaking changes não intencionais
- [ ] Validei que a funcionalidade funciona como esperado
- [ ] Testei em diferentes navegadores (se UI)

### Cenários de Teste
<!-- Descreva os cenários testados -->
1. 
2. 

## 📸 Screenshots/Demonstração

<!-- Se for mudança visual, adicione screenshots ou GIFs -->

## 🔗 Issues Relacionadas

<!-- Liste issues que este PR resolve -->
Resolve #
Relacionado a #

## 📝 Notas Adicionais

<!-- Qualquer informação adicional relevante para os revisores -->

---

## ⚠️ Para Revisores

### Pontos de Atenção
- [ ] Verificar se a BASE_DO_PROJETO.md foi atualizada (se aplicável)
- [ ] Validar que as mudanças estão bem documentadas
- [ ] Confirmar que não há código sensível (secrets, keys)
- [ ] Verificar compatibilidade com ambientes dev/prod

### Impacto
- **Performance**: <!-- Sem impacto / Melhoria / Degradação -->
- **Segurança**: <!-- Sem impacto / Melhoria / Possível risco -->
- **Breaking Changes**: <!-- Não / Sim (explicar) -->