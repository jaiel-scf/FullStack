---
name: desenvolver-funcionalidade
description: Analisa, planeja, implementa e verifica funcionalidades e correções do SIA conforme PRD.md e AGENTS.md.
---

# Desenvolver funcionalidade

## Objetivo

Orientar o desenvolvimento assistido por IA de maneira incremental, segura, verificável e alinhada aos requisitos do SIA.

## 1. Análise da solicitação

- Leia PRD.md e AGENTS.md na raiz.
- Identifique o requisito, as regras de negócio e os critérios de aceitação envolvidos.
- Inspecione os arquivos existentes, contratos da API e dependências afetadas.
- Diferencie comportamento confirmado, hipótese e requisito ainda não implementado.
- Verifique a branch e o estado do diretório de trabalho.

## 2. Identificação de dúvidas e ambiguidades

- Identifique informações ausentes, conflitos de requisitos, riscos de segurança e possíveis regressões.
- Consulte o responsável pelo projeto quando uma decisão alterar escopo, arquitetura ou regras de negócio.
- Não invente requisitos nem prossiga com ambiguidades que impeçam uma implementação segura.
- Confirme a disponibilidade de ambiente isolado antes de operações que acessem o banco.

## 3. Planejamento

- Descreva objetivo, arquivos afetados, sequência de alterações, riscos e estratégia de testes.
- Relacione cada mudança aos requisitos e critérios de aceitação.
- Para o trabalho acadêmico, registre o plano inicial em docs/plans/PLANO-INICIAL.md.
- Aguarde aprovação humana do plano antes de alterar código.
- Caso o escopo mude, atualize o plano e solicite nova aprovação.

## 4. Implementação

- Trabalhe na branch desenvolvimento-ia.
- Execute somente as alterações aprovadas, preservando a arquitetura e os contratos existentes.
- Valide dados e autorização no backend; não confie apenas no frontend.
- Preserve o padrão visual, os temas e as funcionalidades existentes.
- Adicione ou atualize testes pertinentes.
- Não exponha segredos, não use dados pessoais reais em testes e não altere produção.
- Revise as diferenças antes de registrar commits.

## 5. Verificação

- Confira cada critério de aceitação afetado.
- Execute verificações sintáticas, lint quando disponível, testes e build conforme AGENTS.md.
- Verifique cenários positivos, negativos, autorização, integridade e regressões.
- Corrija falhas relacionadas ao escopo e repita as verificações pertinentes.
- Registre em docs/VERIFICACAO.md os comandos, resultados reais, falhas, correções e limitações.
- Diferencie verificações executadas, não executadas e bloqueadas.
- Não declare sucesso sem evidência.

## Resultado esperado

Entregue um resumo dos requisitos atendidos, arquivos alterados, decisões tomadas, resultados de testes, riscos remanescentes e próximos passos. Não faça merge ou deploy em produção sem aprovação específica.
