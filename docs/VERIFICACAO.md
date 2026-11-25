# Verificação do SIA

Data: 25/11/2026

Branches: `desenvolvimento-ia` (implementação), `integracao-ia-render` (integração), `main` (frontend e entrega), `deploy/render-backend` (backend publicado).

## Evidências de execução

| Verificação | Resultado |
|---|---|
| `mvnw.cmd clean compile` | BUILD SUCCESS; 16 arquivos Java, Java 21 |
| `node --check ../frontend/js/usuarios.js` | Sem erros de sintaxe |
| `mvnw.cmd -Dtest=UsuarioServiceTest,SecurityConfigTest test` | 14 testes, 0 falhas, 0 erros |
| `mvnw.cmd -Dtest=UsuarioServiceTest,SecurityConfigTest package` | BUILD SUCCESS; 14 testes aprovados; JAR executável gerado às 16:41:41 |
| Estrutura Supabase | Campos de edição existentes; email único; RLS habilitado nas cinco tabelas públicas consultadas |

## Cobertura

UsuarioServiceTest: promoção, preservação de senha e primeiro acesso, email duplicado, edição própria, autorização, último administrador, inativação/reativação e perfil inválido.

SecurityConfigTest: JWT válido, usuário inativo, perfil alterado, email alterado, usuário inexistente, expiração e assinatura inválida.

Os testes usam Mockito e chaves fictícias, sem conexão com o banco. O aviso de carregamento dinâmico do Mockito não impediu a execução.

## Integração e publicação

| Verificação | Resultado |
|---|---|
| GitHub Actions, execução 45703848039 | Sucesso: package, testes de movimentações, usuários e JWT, e sintaxe JavaScript da branch de integração |
| PR #11 | Mesclado; backend publicado no Render, commit 173027a8994d68c6ee86b80d43b5310ec59c24ad, status Live |
| PR #12 | Mesclado; frontend publicado no Render, commit b293b8ddd9099d15ea3021da3892a6ce7df9787b, status Live |
| Teste funcional da edição de usuários | Sucesso informado pelo aluno após publicação em 25/11/2026; sem registro individual de cada cenário |

Evidências: [GitHub Actions](https://github.com/jaiel-scf/FullStack/actions/runs/45703848039), [PR backend](https://github.com/jaiel-scf/FullStack/pull/11), [PR frontend](https://github.com/jaiel-scf/FullStack/pull/12), [SIA Web](https://sia-frontend-avz2.onrender.com).

## Pendências e limitações

- Teste funcional da edição confirmado pelo aluno; não houve verificação independente de todos os cenários HTTP/PostgreSQL, regressão completa ou teste do Mobile. A inicialização local com Supabase falhou por configuração/autenticação; a validação foi realizada no ambiente publicado.
- Teste geral BackendApplicationTests não executado por carregar o contexto com conexão potencial ao banco existente.
- Concorrência e revogação definitiva de JWT ainda não comprovadas: restaurar os dados anteriores pode tornar um token não expirado novamente válido.
- Deploys de frontend e backend concluídos; nenhuma migração de esquema ou alteração direta de registros pelo assistente. A correção final do formulário Meu Perfil foi posterior à execução de CI citada e não possui teste específico registrado.
- A escolha acadêmica foi evoluir o SIA existente; a aceitação pelo professor não foi verificada.

A aprovação dos testes unitários não equivale à aprovação integral do sistema.
