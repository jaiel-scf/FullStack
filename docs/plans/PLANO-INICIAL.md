# Plano inicial — RF11: edição administrativa de usuários

Status: aprovado pelo responsável em 25/11/2026; implementação iniciada.

## 1. Análise

Aplicar PRD.md, AGENTS.md e a Skill desenvolver-funcionalidade. A entidade Usuario já contém nome, email, perfil e ativo. UsuarioRepository possui busca por email. UsuarioController possui cadastro, listagem e inativação, mas não edição administrativa. O frontend filtra usuários ativos e oferece exclusão. SecurityConfig valida JWT, enquanto o LoginController inclui perfil no token com validade de 3600 segundos. Portanto, a alteração de perfil exige tratamento de tokens antigos.

## 2. Decisões propostas e dúvidas

- Editar outros usuários por modal, incluindo nome, email, perfil e situação.
- Exibir usuários inativos com identificação visual e permitir reativação.
- Impedir edição administrativa da própria conta; manter o fluxo Meu Perfil separado.
- Preservar senha, primeiro acesso, ID e histórico; invalidar recuperação pendente quando email ou situação mudar.
- Reutilizar a tabela usuario, verificando restrições reais de unicidade antes de concluir que nenhuma migração é necessária.
- Rejeitar tokens de usuários inativos ou cujo perfil não corresponda ao atual, exigindo novo login após mudança de perfil. Verificar impacto em todos os controllers e clientes.
- Proteger o último administrador ativo com controle transacional e concorrência, incluindo exclusão lógica.
- Verificar divergências das rotas Meu Perfil antes de corrigir somente problemas pertinentes.
- Confirmar ambiente PostgreSQL isolado e aceitação acadêmica de projeto existente.

## 3. Sequência de implementação

| Fase | Arquivos previstos | Trabalho | Critérios |
|---|---|---|---|
| 1 | UsuarioRepository.java, UsuarioService.java | Validar campos, unicidade, edição transacional, proteção do último administrador e preservação de dados. | CA02, CA05, CA07, CA08, CA10 |
| 2 | UsuarioController.java | Adicionar PUT /usuarios/{id} com DTO específico, autorização e resposta sem dados sensíveis. | CA02, CA06, CA07 |
| 3 | SecurityConfig.java e componentes de segurança necessários | Validar situação e perfil atuais em requisições autenticadas; preservar validações JWT existentes e rotas públicas. | CA03, CA04, CA05, CA06, CA11 |
| 4 | frontend/usuarios.html, frontend/js/usuarios.js, CSS apenas se necessário | Modal, botão Editar, listagem de inativos, validação, mensagens, atualização da tabela e tratamento de sessão inválida. | CA01, CA02, CA03, CA05, CA09 |
| 5 | backend/src/test/ e scripts afetados | Testes de serviço, API, segurança, concorrência e regressão; verificações manuais da interface. | CA01–CA12 |
| 6 | docs/VERIFICACAO.md | Registrar comandos, resultados, falhas, correções e limitações. | CA12 |

Arquivos adicionais poderão ser necessários após inspeção; mudanças de escopo exigem revisão do plano.

## 4. Estratégia de testes

- Edição válida, email duplicado, campos inválidos, usuário inexistente.
- Promoção e rebaixamento; tentativa por usuário comum; token anterior após mudança de perfil; usuário inativo com token anterior.
- Proteção da própria conta e do último administrador, inclusive operações concorrentes.
- Preservação de senha, primeiro acesso, ID e histórico.
- Cancelamento do modal, paginação, temas e reativação.
- Regressão de login, cadastro, listagem, estoque, entradas, requisições e contratos compartilhados com SIA-Mobile.
- Executar git diff --check, node --check nos scripts modificados, Maven test e verify conforme AGENTS.md. Verificar disponibilidade de lint e registrar se inexistente.
- Usar somente dados fictícios e ambiente isolado; não executar testes contra produção.

## 5. Riscos e limites

JWT com perfil desatualizado, concorrência na alteração de administradores, conflitos de email, impacto nos clientes existentes e diferenças entre branches de produção e acadêmica. A leitura de código não comprova funcionamento. Não realizar merge ou deploy. Não incluir chat, estoques separados ou inventário físico.

## 6. Aprovação

Plano aprovado pelo responsável em 25/11/2026: “sim , vamos seguindo”. Registrar eventuais mudanças de requisitos antes de implementar.
