# Verificação do SIA

Data: 25/11/2026

Branch: `desenvolvimento-ia`

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

## Pendências e limitações

- Teste funcional da interface e integração HTTP/PostgreSQL ainda não executados.
- Teste geral BackendApplicationTests não executado por carregar o contexto com conexão potencial ao banco existente.
- Concorrência e revogação definitiva de JWT ainda não comprovadas: restaurar os dados anteriores pode tornar um token não expirado novamente válido.
- Nenhum deploy ou alteração de dados de produção realizado nesta etapa.
- A escolha acadêmica foi evoluir o SIA existente; a aceitação pelo professor não foi verificada.

A aprovação dos testes unitários não equivale à aprovação integral do sistema.
