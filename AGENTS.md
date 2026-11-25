# AGENTS.md — SIA FullStack

## 1. Contexto e escopo
Leia PRD.md antes de trabalhar. A evolução acadêmica aprovada é RF11: edição administrativa de usuários. Chat, múltiplos estoques e inventário físico estão fora do escopo. Preserve funcionalidades existentes.

## 2. Tecnologias e arquitetura
- Backend: Java 21, Spring Boot 4.1.1, Maven Wrapper, Spring Security/JWT, JPA e PostgreSQL.
- Frontend: HTML, CSS, JavaScript e Tailwind CSS via CDN.
- backend/: aplicação Java; mantenha as responsabilidades de controller, service, repository e model.
- frontend/: páginas HTML, scripts em js/, estilos em css/ e recursos em assets/.
- API REST compartilhada com SIA-Mobile. Preserve contratos existentes.

## 3. Fluxo de desenvolvimento
1. Leia os requisitos e inspecione os arquivos atuais antes de propor mudanças.
2. Identifique dúvidas, dependências, riscos e critérios de aceitação.
3. Utilize .agents/skills/desenvolver-funcionalidade/SKILL.md quando criada. Não invente seu conteúdo caso ainda não exista.
4. Registre o plano inicial em docs/plans/PLANO-INICIAL.md e aguarde aprovação humana antes de implementar.
5. Implemente mudanças pequenas, justificadas e restritas ao escopo.
6. Execute verificações e registre resultados reais, falhas e pendências.

## 4. Padrões de código
- Preserve nomes e convenções existentes; utilize nomes claros em português quando coerente com o projeto.
- Controllers recebem requisições e retornam respostas; services concentram regras de negócio; repositories acessam dados.
- Valide entradas no backend. Use DTOs para evitar exposição de campos sensíveis.
- Preserve o padrão visual das telas, temas claro e escuro, modais e paginação.
- Não adicione dependências, migrações ou refatorações abrangentes sem justificativa e aprovação.
- Não remova testes nem desabilite controles de segurança para obter build bem-sucedido.

## 5. Segurança e integridade
- Não confie em permissões do frontend como controle de autorização.
- Verifique perfil e situação atuais do usuário nas operações protegidas conforme PRD.
- Proteja o último administrador ativo, inclusive contra alterações concorrentes.
- Preserve identificadores, histórico, senhas e estado de primeiro acesso durante edição administrativa.
- Não exponha credenciais, hashes, JWTs ou tokens de recuperação.
- Não utilize banco de produção ou dados pessoais reais em testes. Verifique a configuração do ambiente antes de executar testes que acessam banco.
- Não altere hospedagem, variáveis de produção ou branches de produção.

## 6. Comandos importantes (PowerShell)
Na raiz do projeto:

```powershell
git status --short --branch
git diff
git diff --check
git pull --ff-only origin desenvolvimento-ia
```

No backend, com Java 21 e ambiente de teste isolado configurado:

```powershell
Set-Location backend
java -version
.\mvnw.cmd compile
.\mvnw.cmd test
.\mvnw.cmd verify
.\mvnw.cmd spring-boot:run
```

O último comando inicia o servidor e deve ser executado separadamente, quando necessário. Confirme DB_URL, DB_USERNAME, DB_PASSWORD e JWT_SECRET de ambiente isolado sem imprimir seus valores. Verifique outras variáveis exigidas pela configuração atual.

Para o frontend, na raiz, caso Node.js esteja instalado:

```powershell
node --check .\frontend\js\usuarios.js
```

Repita a verificação sintática para scripts alterados. Ela não substitui lint nem testes funcionais. Inspecione a configuração existente antes de afirmar que há ferramenta de lint. Sirva o frontend por servidor HTTP local e configure a API para o backend de teste, sem publicar essa configuração na produção.

## 7. Verificação e entrega
- Relacione testes aos critérios de aceitação do PRD.
- Verifique promoção, rebaixamento, inativação, reativação, validações, autorização e regressões.
- Registre comandos, resultados, limitações e verificações manuais ainda necessárias.
- Trabalhe na branch desenvolvimento-ia. Não inclua backend/uploads/, segredos ou artefatos gerados indevidamente nos commits.
- Não faça merge na main nem deploy sem aprovação específica.
- Informe arquivos alterados, decisões, riscos e próximos passos. Nunca declare testes executados sem evidência.
