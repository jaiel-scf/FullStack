# PRD — SIA: Sistema de Almoxarifado

**Versão:** 1.0 — proposta para revisão  
**Projeto:** evolução do SIA FullStack Web  
**Repositório:** https://github.com/jaiel-scf/FullStack

## 1. Objetivo e descrição

Gerenciar materiais de almoxarifado, centralizando o controle de estoque, entradas, requisições, saídas, custos e usuários. A evolução prevista neste trabalho acadêmico é a edição administrativa de usuários existentes, preservando as funcionalidades e a arquitetura atuais.

## 2. Público-alvo

Supervisores de almoxarifado, almoxarifes, gestores administrativos e colaboradores que requisitam materiais.

## 3. Problema

Controles manuais e registros descentralizados dificultam o acompanhamento dos saldos e movimentações. No SIA atual, a ausência de edição administrativa de usuários dificulta a atualização de cadastros e permissões sem recorrer a outros procedimentos.

## 4. Requisitos funcionais

| ID | Requisito | Escopo |
|---|---|---|
| RF01 | Autenticar usuários e controlar acesso por perfil. | Existente |
| RF02 | Cadastrar, consultar e inativar usuários. | Existente |
| RF03 | Cadastrar, consultar, editar e excluir produtos conforme permissões. | Existente |
| RF04 | Consultar saldo e situação do estoque. | Existente |
| RF05 | Registrar entradas de materiais. | Existente |
| RF06 | Registrar e acompanhar requisições de materiais e suas saídas. | Existente |
| RF07 | Consultar histórico de movimentações. | Existente |
| RF08 | Consultar custos médios e valores de estoque conforme permissões vigentes. | Existente |
| RF09 | Identificar produtos com estoque baixo ou crítico. | Existente |
| RF10 | Alterar e recuperar senhas. | Existente |
| RF11 | Permitir que administradores editem nome, e-mail, perfil e situação de usuários existentes. | Evolução aprovada |

Os requisitos existentes descrevem o escopo conhecido do SIA; sua execução integral será confirmada na etapa de verificação.

## 5. Requisitos não funcionais

| ID | Requisito | Verificação |
|---|---|---|
| RNF01 | Segurança: validar autenticação, autorização e dados no backend; não expor senhas, hashes ou tokens de recuperação nas respostas. | Testar acessos sem autenticação, sem permissão e respostas da API. |
| RNF02 | Usabilidade: manter o padrão visual, temas e navegação existentes; apresentar mensagens claras de sucesso e erro. | Revisar o fluxo de edição nos temas existentes. |
| RNF03 | Integridade: preservar identificadores, histórico e relacionamentos dos usuários; impedir e-mails duplicados. | Testar edição válida, conflito de e-mail e preservação dos registros. |
| RNF04 | Manutenibilidade: preservar a separação entre frontend, controller, service e repository, com código consistente e testes. | Revisar alterações e executar testes e build Maven. |
| RNF05 | Compatibilidade: preservar os contratos existentes da API utilizados pelo SIA Web e SIA-Mobile. | Verificar regressões nos fluxos afetados. |

## 6. Regras de negócio

- RN01: os perfis existentes são `admin` e `usuario`.
- RN02: somente administradores ativos podem realizar operações administrativas de usuários; usuários comuns não podem elevar suas próprias permissões.
- RN03: usuários devem estar ativos para acessar funcionalidades protegidas.
- RN04: inativar um usuário não deve apagar seu histórico.
- RN05: entradas e operações administrativas de produtos são restritas aos perfis autorizados.
- RN06: as movimentações devem preservar a consistência do saldo de estoque.
- RN07: a edição administrativa deve validar nome, e-mail e perfil; o e-mail deve ser único e normalizado.
- RN08: deve permanecer pelo menos um administrador ativo, inclusive em operações de inativação e rebaixamento.
- RN09: a alteração de perfil ou situação deve ser respeitada nas requisições protegidas subsequentes, inclusive quando houver JWT emitido anteriormente.
- RN10: a edição administrativa não deve alterar a senha ou o estado de primeiro acesso de forma implícita.

As regras RN07 a RN10 e o comportamento detalhado de RN02/RN03 são critérios propostos para a evolução e devem ser revisados antes da implementação.

## 7. Critérios de aceitação

| ID | Cenário | Resultado esperado |
|---|---|---|
| CA01 | Administrador abre a tela de usuários. | A listagem existente funciona e apresenta a ação de edição para usuários elegíveis. |
| CA02 | Administrador edita nome e e-mail válidos. | Dados persistidos e exibidos na listagem, sem criar outro usuário. |
| CA03 | Administrador promove um usuário comum. | Perfil atualizado e permissões administrativas disponíveis após atualização da sessão ou novo login. |
| CA04 | Administrador rebaixa outro administrador. | Operações administrativas deixam de ser autorizadas no backend, inclusive com token anterior. |
| CA05 | Administrador inativa ou reativa um usuário elegível. | Situação atualizada; usuário inativo não consegue acessar operações protegidas; histórico preservado. |
| CA06 | Usuário comum tenta editar outro usuário ou elevar seu perfil pela API. | Operação recusada, sem alteração de dados. |
| CA07 | Edição com e-mail duplicado, nome vazio ou perfil inválido. | Operação recusada com mensagem adequada, sem persistir alteração inválida. |
| CA08 | Tentativa de rebaixar ou inativar o último administrador ativo. | Operação recusada, inclusive pelo fluxo existente de exclusão lógica. |
| CA09 | Administrador cancela a edição. | Nenhuma alteração persistida. |
| CA10 | Edição concluída. | Identificador, histórico, senha e estado de primeiro acesso preservados. |
| CA11 | Testes de regressão dos fluxos existentes. | Login, cadastro/listagem de usuários, estoque, entradas e requisições continuam funcionando conforme permissões. |
| CA12 | Verificação técnica. | Resultados de testes, análise de código e build registrados; falhas identificadas tratadas ou explicitadas. |

## 8. Tecnologias e restrições

- Backend: Java 21, Spring Boot 4.1.1 e Maven (versões verificadas no pom.xml da branch main).
- Frontend: HTML, CSS e JavaScript, preservando o padrão visual existente.
- Banco: PostgreSQL; comunicação via API REST e autenticação JWT.
- Preservar a arquitetura existente e a integração com o SIA-Mobile.
- Desenvolver e testar em ambiente isolado da produção, sem utilizar dados pessoais reais ou expor credenciais.
- Não incluir chat, categorias/múltiplos estoques ou inventário físico nesta entrega.

## 9. Pendências de definição e verificação

- Confirmar a aceitação pelo professor da evolução de um sistema existente, pois o enunciado solicita um projeto novo.
- Definir no planejamento o tratamento da edição da própria conta administrativa e a apresentação de usuários inativos na listagem.
- Verificar inconsistências do fluxo Meu Perfil e as rotas correspondentes antes de decidir correções.
- Definir o mecanismo de atualização/invalidação de sessões e proteção do último administrador, sem comprometer os contratos da API.
- Confirmar o comportamento dos requisitos existentes por testes; a leitura parcial do repositório não comprova execução.

## 10. Referências metodológicas

- Atlassian — https://www.atlassian.com/br/agile/product-management/requirements
- IBM — https://www.ibm.com/br-pt/think/topics/prompt-engineering
- OpenAI — https://openai.com/pt-BR/index/harness-engineering/
- OWASP — https://genai.owasp.org/resource/securing-agentic-applications-v2/
